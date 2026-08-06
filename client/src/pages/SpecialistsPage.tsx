import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Search,
  Video,
  ShieldCheck,
} from 'lucide-react';
import { DoctorSpecialist } from '../types';
import { getSpecialistsApi } from '../lib/api';
import { DoctorSpecialistCard } from '../components/DoctorSpecialistCard';
import { DoctorBookingModal } from '../components/DoctorBookingModal';
import { useClinStore } from '../store/useClinStore';

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
  const { lastSpecialistReferral } = useClinStore();
  const recommendedSpecialty = lastSpecialistReferral?.primarySpecialty;
  
  const [specialists, setSpecialists] = useState<DoctorSpecialist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(recommendedSpecialty || 'All');
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Hero Header Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Verified Specialist Clinical Directory</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recommended Specialized Doctors & Physicians
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Connect with leading board-certified specialists, department chiefs, and academic surgeons. 
              Schedule in-person clinic appointments or instant video telehealth consultations.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0 font-mono">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 block">100%</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Board Certified</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 block">&lt; 24h</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Avg. Next Slot</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-base font-extrabold text-purple-600 dark:text-purple-400 block">4.94 ★</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Patient Rating</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-2 flex flex-col md:flex-row gap-3 items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialty, or condition..."
              className="w-full pl-9 pr-20 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors"
            >
              Search
            </button>
          </form>

          <button
            onClick={() => setTelehealthOnly(!telehealthOnly)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all shrink-0 ${
              telehealthOnly
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Telehealth Available Only</span>
          </button>
        </div>

        {/* Specialty Categories Scroll */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {SPECIALTIES.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Showing {specialists.length} Certified Specialists
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse h-56 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : specialists.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Stethoscope className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Specialists Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search terms or specialty filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedSpecialty('All');
                setSearchQuery('');
                setTelehealthOnly(false);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {specialists.map((doc) => (
              <DoctorSpecialistCard
                key={doc.id}
                specialist={doc}
                onBookClick={(specialist) => setSelectedSpecialistForBooking(specialist)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <DoctorBookingModal
        specialist={selectedSpecialistForBooking}
        isOpen={Boolean(selectedSpecialistForBooking)}
        onClose={() => setSelectedSpecialistForBooking(null)}
      />
    </div>
  );
};
