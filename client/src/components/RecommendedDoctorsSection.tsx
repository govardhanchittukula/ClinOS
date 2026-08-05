import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Sparkles, ShieldCheck, HelpCircle, ChevronRight, AlertCircle, Calendar } from 'lucide-react';
import { RecommendationResult, DoctorSpecialist } from '../types';
import { getSpecialistRecommendationsApi } from '../lib/api';
import { DoctorSpecialistCard } from './DoctorSpecialistCard';
import { DoctorBookingModal } from './DoctorBookingModal';

interface Props {
  clinicalCase: string;
  differentialDiagnoses?: string[];
}

export const RecommendedDoctorsSection: React.FC<Props> = ({
  clinicalCase,
  differentialDiagnoses = [],
}) => {
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSpecialistForBooking, setSelectedSpecialistForBooking] = useState<DoctorSpecialist | null>(null);

  useEffect(() => {
    if (!clinicalCase) return;

    setLoading(true);
    getSpecialistRecommendationsApi({ clinicalCase, differentialDiagnoses })
      .then((data) => {
        setRecommendation(data.recommendation);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Specialist recommendation error:', err);
        setLoading(false);
      });
  }, [clinicalCase, differentialDiagnoses]);

  if (loading) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-md text-center space-y-3">
        <Stethoscope className="w-8 h-8 text-blue-600 animate-bounce mx-auto" />
        <p className="text-xs font-semibold text-slate-700">
          ClinOS Multi-Agent Engine is matching verified medical specialists to your clinical case...
        </p>
      </div>
    );
  }

  if (!recommendation || recommendation.recommendedSpecialists.length === 0) {
    return null;
  }

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-blue-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI-Driven Specialist Matching Engine</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Recommended Specialists & Direct Clinical Referrals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Board-certified physicians matched to your symptom profile and differential diagnosis
          </p>
        </div>

        <Link
          to="/specialists"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-all border border-slate-200 shrink-0"
        >
          <span>Explore All Specialists</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Rationale & Primary Specialty Box */}
      <div className="p-4 md:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Primary Recommended Specialty:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-mono text-xs font-bold shadow-sm">
              {recommendation.primarySpecialty}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-sans pt-1">
            {recommendation.referralRationale}
          </p>
        </div>
      </div>

      {/* Recommended Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendation.recommendedSpecialists.map((doc) => (
          <DoctorSpecialistCard
            key={doc.id}
            specialist={doc}
            onBookClick={(specialist) => setSelectedSpecialistForBooking(specialist)}
          />
        ))}
      </div>

      {/* Suggested Questions to Ask */}
      {recommendation.suggestedQuestionsForDoctor && recommendation.suggestedQuestionsForDoctor.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Recommended Questions for Your Specialist Consultation</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
            {recommendation.suggestedQuestionsForDoctor.map((q, idx) => (
              <li key={idx} className="flex items-start space-x-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="font-mono text-blue-600 font-bold text-[11px] shrink-0">
                  Q{idx + 1}:
                </span>
                <span className="leading-snug">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Booking Modal */}
      <DoctorBookingModal
        specialist={selectedSpecialistForBooking}
        clinicalCaseSummary={clinicalCase}
        isOpen={Boolean(selectedSpecialistForBooking)}
        onClose={() => setSelectedSpecialistForBooking(null)}
      />

    </div>
  );
};
