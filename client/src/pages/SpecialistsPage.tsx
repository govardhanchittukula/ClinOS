import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Search,
  Filter,
  Video,
  Building2,
  ShieldCheck,
  Award,
  Sparkles,
  Calendar,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { DoctorSpecialist } from '../types';
import { getSpecialistsApi } from '../lib/api';
import { DoctorSpecialistCard } from '../components/DoctorSpecialistCard';
import { DoctorBookingModal } from '../components/DoctorBookingModal';

const SPECIALTIES = [
  'All',
  'General Surgery',
  'Cardiology',
  'Neurology',
  'Gastroenterology',
  'Pulmonology',
  'Orthopedics',
  'Nephrology',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
];

export const SpecialistsPage: React.FC = () => {
  const [specialists, setSpecialists] = useState<DoctorSpecialist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [telehealthOnly, setTelehealthOnly] = useState<boolean>(false);
  const [selectedSpecialistForBooking, setSelectedSpecialistForBooking] = useState<DoctorSpecialist | null>(null);

  const fetchSpecialists = async () => {
    setLoading(true);
    try {
      const res = await getSpecialistsApi({
        specialty: selectedSpecialty,
        search: searchQuery,
        telehealthOnly,
      });
      setSpecialists(res.specialists);
    } catch (err) {
      console.error('Failed to load specialists directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialists();
  }, [selectedSpecialty, telehealthOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSpecialists();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      
      {/* Hero Header Section */}
      <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 border border-blue-200 text-blue-700 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Specialist Clinical Directory</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Recommended Specialized Doctors & Physicians
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                Connect with leading board-certified specialists, department chiefs, and academic surgeons. 
                Schedule in-person clinic appointments or instant video telehealth consultations.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xl font-extrabold text-blue-600 block">100%</span>
                <span className="text-[11px] text-slate-500 font-medium">Board Certified</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xl font-extrabold text-emerald-600 block">&lt; 24 hrs</span>
                <span className="text-[11px] text-slate-500 font-medium">Avg. Next Slot</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center col-span-2 sm:col-span-1">
                <span className="text-xl font-extrabold text-purple-600 block">4.94 ★</span>
                <span className="text-[11px] text-slate-500 font-medium">Patient Rating</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="pt-2 flex flex-col md:flex-row gap-3 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, symptom (e.g. appendicitis, chest pain), hospital, or keyword..."
                className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors"
              >
                Search
              </button>
            </form>

            <button
              onClick={() => setTelehealthOnly(!telehealthOnly)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center space-x-2 transition-all shrink-0 ${
                telehealthOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Video className="w-4 h-4 text-emerald-600" />
              <span>Telehealth Available Only</span>
            </button>
          </div>

          {/* Specialty Categories Scroll */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {SPECIALTIES.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Doctor Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Showing {specialists.length} Certified Specialists
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-64 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-12 bg-slate-100 rounded-xl"></div>
                <div className="h-8 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : specialists.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Specialists Found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or specialty filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedSpecialty('All');
                setSearchQuery('');
                setTelehealthOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.map((doc) => (
              <DoctorSpecialistCard
                key={doc.id}
                specialist={doc}
                onBookClick={(specialist) => setSelectedSpecialistForBooking(specialist)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      <DoctorBookingModal
        specialist={selectedSpecialistForBooking}
        isOpen={Boolean(selectedSpecialistForBooking)}
        onClose={() => setSelectedSpecialistForBooking(null)}
      />

    </div>
  );
};
