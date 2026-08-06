import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Activity,
  HeartPulse,
  Flame,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Compass,
  ChevronRight,
  Sparkles,
  Bed,
  CheckCircle2,
  Navigation,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Hospital, BedType, BedBooking } from '../types';
import { getHospitalsApi } from '../lib/api';
import { BedBookingModal } from './BedBookingModal';
import { useClinStore } from '../store/useClinStore';

interface HospitalLocatorProps {
  recommendedBedType?: BedType;
  triageUrgency?: string;
  clinicalCaseSummary?: string;
  isEmbedded?: boolean;
}

export const HospitalLocator: React.FC<HospitalLocatorProps> = ({
  recommendedBedType = 'all' as any,
  triageUrgency,
  clinicalCaseSummary,
  isEmbedded = false
}) => {
  const { userLocation, lastTriageSummary } = useClinStore();
  const criticalityPercentage = lastTriageSummary?.criticalityPercentage ?? 0;
  
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [selectedBedType, setSelectedBedType] = useState<string>(
    recommendedBedType !== 'all' ? recommendedBedType : (criticalityPercentage > 70 ? 'icu' : 'all')
  );
  
  const [userLocationDetected, setUserLocationDetected] = useState<boolean>(!!userLocation);
  const [activeLocalityLabel, setActiveLocalityLabel] = useState<string>(
    userLocation ? `GPS Fixed: ${userLocation.latitude?.toFixed(4)}° N, ${userLocation.longitude?.toFixed(4)}° E` : 'Ranga Reddy District / Financial District & HITEC City, Telangana'
  );

  // Selected hospital for booking modal
  const [selectedHospitalForHold, setSelectedHospitalForHold] = useState<Hospital | null>(null);
  const [activeSuccessNotification, setActiveSuccessNotification] = useState<string | null>(null);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const data = await getHospitalsApi({
        query: searchQuery,
        locality: selectedLocality,
        bedType: selectedBedType !== 'all' ? selectedBedType : undefined
      });
      setHospitals(data.hospitals || []);
    } catch (err) {
      console.warn('Failed to load hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [searchQuery, selectedLocality, selectedBedType]);

  const handleGpsAutoDetect = () => {
    setUserLocationDetected(true);
    setActiveLocalityLabel('Financial District, Nanakramguda, Ranga Reddy (GPS Fixed: 17.4182° N, 78.3473° E)');
    setSelectedLocality('all');
    fetchHospitals();
  };

  const handleBookingSuccess = (booking: BedBooking, updatedHospital: Hospital) => {
    setHospitals((prev) =>
      prev.map((h) => (h.id === updatedHospital.id ? updatedHospital : h))
    );
    setActiveSuccessNotification(
      `🎉 Bed successfully held at ${updatedHospital.name}! Token: ${booking.booking_token}`
    );
    setTimeout(() => setActiveSuccessNotification(null), 8000);
  };

  const getPulsingBadge = (available: number, total: number, label: string) => {
    const isCritical = available === 0;
    const isLow = available > 0 && available <= 3;
    const isAvailable = available > 3;

    let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    let pulseColor = 'bg-emerald-500';

    if (isCritical) {
      badgeColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      pulseColor = 'bg-rose-500';
    } else if (isLow) {
      badgeColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      pulseColor = 'bg-amber-500';
    }

    return (
      <div className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between text-xs font-mono font-bold ${badgeColor}`}>
        <div className="flex items-center space-x-1.5">
          <span className="relative flex h-2 w-2">
            {!isCritical && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColor}`} />}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${pulseColor}`} />
          </span>
          <span className="text-[11px] font-sans font-semibold text-slate-700 dark:text-slate-300">{label}:</span>
        </div>
        <span className="font-mono">
          {available}/{total}
        </span>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${isEmbedded ? 'mt-6 pt-6 border-t border-slate-200 dark:border-slate-800' : ''}`}>
      
      {/* Triage Emergency Callout Header if embedded */}
      {triageUrgency && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-red-100">
            <Flame className="w-4 h-4 text-white animate-bounce" />
            <span>AI Triage Protocol: Physical Admission Recommended</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">
            Urgent Hospital Bed Routing ({triageUrgency})
          </h2>
          <p className="text-xs text-red-100 leading-relaxed max-w-3xl">
            ClinOS AI has matched live beds across nearby tertiary trauma centers in Ranga Reddy and Hyderabad. Secure an immediate 2-hour hold reservation below.
          </p>
        </div>
      )}

      {/* Main Header & GPS Location Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-red-600 dark:text-red-400 font-bold mb-1">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Real-Time Bed Tracking & Physical Routing</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Nearby Hospital Bed Locator
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Active GPS Region: <strong className="text-slate-800 dark:text-slate-200">{activeLocalityLabel}</strong></span>
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleGpsAutoDetect}
              className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Compass className="w-3.5 h-3.5 animate-spin text-red-600" />
              <span>Auto-Detect GPS</span>
            </button>

            <button
              type="button"
              onClick={fetchHospitals}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-all"
              title="Refresh Bed Availability"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          
          {/* Search Bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hospital name, specialty (e.g., Trauma, Cardiology), or locality..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Locality Quick Selector */}
          <div>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="all">All Telangana / Ranga Reddy Hubs</option>
              <option value="Gachibowli">Gachibowli (Ranga Reddy)</option>
              <option value="Nanakramguda">Financial District (Ranga Reddy)</option>
              <option value="HITEC">HITEC City (Ranga Reddy)</option>
              <option value="Jubilee Hills">Jubilee Hills (Hyderabad/RR)</option>
              <option value="LB Nagar">LB Nagar (Ranga Reddy)</option>
              <option value="Secunderabad">Secunderabad</option>
            </select>
          </div>

        </div>

        {/* Bed Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-2 flex items-center space-x-1">
            <Bed className="w-3.5 h-3.5" />
            <span>Filter Bed Tier:</span>
          </span>

          {[
            { id: 'all', label: 'All Beds' },
            { id: 'icu', label: 'ICU Beds Only', pulse: true },
            { id: 'oxygen', label: 'Oxygen Beds Only' },
            { id: 'general', label: 'General Beds' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedBedType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                selectedBedType === tab.id
                  ? 'bg-red-600 text-white shadow-sm shadow-red-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.pulse && selectedBedType === tab.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              )}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Success Notification */}
      {activeSuccessNotification && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-scaleUp">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{activeSuccessNotification}</span>
          </div>
          <button
            onClick={() => setActiveSuccessNotification(null)}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hospital Cards Grid */}
      {loading ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Activity className="w-6 h-6 animate-spin mx-auto text-red-600 mb-2" />
          <p className="text-xs text-slate-500">Querying real-time hospital bed telemetry...</p>
        </div>
      ) : hospitals.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Building2 className="w-8 h-8 mx-auto text-slate-400" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Hospitals Match Current Filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or switching bed tiers to view available beds.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedLocality('all');
              setSelectedBedType('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hospitals.map((hospital) => {
            const totalAvailable =
              hospital.icu_beds_available + hospital.oxygen_beds_available + hospital.general_beds_available;
            const hasIcu = hospital.icu_beds_available > 0;
            const hasOxygen = hospital.oxygen_beds_available > 0;

            return (
              <div
                key={hospital.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Hospital Header */}
                <div className="p-5 space-y-3">
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 flex items-center justify-center font-black text-sm border border-red-200 dark:border-red-800">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                          {hospital.distance_km} KM AWAY
                        </span>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-red-600 transition-colors">
                          {hospital.name}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
                      ⭐ {hospital.rating}
                    </span>
                  </div>

                  {/* Locality & Address */}
                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <p className="font-medium text-slate-700 dark:text-slate-300 flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{hospital.locality}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 pl-5">
                      {hospital.address}
                    </p>
                  </div>

                  {/* Specialties Pills */}
                  {hospital.specialties && hospital.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {hospital.specialties.slice(0, 3).map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Live Bed Count Telemetry Grid */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {getPulsingBadge(hospital.icu_beds_available, hospital.icu_beds_total, 'ICU Beds')}
                    {getPulsingBadge(hospital.oxygen_beds_available, hospital.oxygen_beds_total, 'Oxygen Beds')}
                    {getPulsingBadge(hospital.general_beds_available, hospital.general_beds_total, 'General Beds')}
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  
                  <a
                    href={`tel:${hospital.emergency_helpline}`}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-red-50 text-red-600 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all"
                    title="Direct Emergency Helpline"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedHospitalForHold(hospital)}
                    disabled={totalAvailable === 0}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm ${
                      totalAvailable > 0
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{totalAvailable > 0 ? 'Hold Bed (2h Pass)' : 'Beds Full'}</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Bed Booking Modal */}
      {selectedHospitalForHold && (
        <BedBookingModal
          hospital={selectedHospitalForHold}
          defaultBedType={
            recommendedBedType !== 'all'
              ? recommendedBedType
              : selectedHospitalForHold.icu_beds_available > 0
              ? 'icu'
              : 'oxygen'
          }
          clinicalCaseSummary={clinicalCaseSummary}
          onClose={() => setSelectedHospitalForHold(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

    </div>
  );
};
