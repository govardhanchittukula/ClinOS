import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Building2,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  QrCode,
  Share2,
  Printer,
  ChevronRight,
  Sparkles,
  HeartPulse,
  Flame
} from 'lucide-react';
import { Hospital, BedType, BedBooking } from '../types';
import { bookHospitalBedApi } from '../lib/api';
import { getStoredAuthUser } from '../lib/supabase';

interface BedBookingModalProps {
  hospital: Hospital;
  defaultBedType?: BedType;
  clinicalCaseSummary?: string;
  onClose: () => void;
  onBookingSuccess?: (booking: BedBooking, updatedHospital: Hospital) => void;
}

export const BedBookingModal: React.FC<BedBookingModalProps> = ({
  hospital,
  defaultBedType = 'icu',
  clinicalCaseSummary,
  onClose,
  onBookingSuccess
}) => {
  const authUser = getStoredAuthUser();
  const [bedType, setBedType] = useState<BedType>(defaultBedType);
  const [patientName, setPatientName] = useState<string>(authUser?.full_name || 'Alex Rivera');
  const [patientPhone, setPatientPhone] = useState<string>('+91 98765 43210');
  const [priorityNote, setPriorityNote] = useState<string>(
    clinicalCaseSummary ? `Triage case summary: ${clinicalCaseSummary.slice(0, 120)}...` : 'Emergency physical transfer from ClinOS AI Triage.'
  );

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BedBooking | null>(null);
  const [confirmedHospital, setConfirmedHospital] = useState<Hospital | null>(null);

  const getAvailability = (type: BedType) => {
    if (type === 'icu') return hospital.icu_beds_available;
    if (type === 'oxygen') return hospital.oxygen_beds_available;
    return hospital.general_beds_available;
  };

  const handleConfirmHold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Please provide patient full name.');
      return;
    }
    if (getAvailability(bedType) <= 0) {
      setError(`No ${bedType.toUpperCase()} beds are currently available at ${hospital.name}.`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await bookHospitalBedApi({
        hospital_id: hospital.id,
        patient_id: authUser?.id,
        patient_name: patientName,
        patient_phone: patientPhone,
        bed_type: bedType
      });

      setConfirmedBooking(res.booking);
      setConfirmedHospital(res.updated_hospital);
      if (onBookingSuccess) {
        onBookingSuccess(res.booking, res.updated_hospital);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete emergency bed hold.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md">
              <HeartPulse className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight">Emergency Bed Hold Reservation</h2>
              <p className="text-[11px] text-red-100 font-mono">Live physical admission routing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {confirmedBooking ? (
            /* Digital Bed Reservation Pass (Success Ticket) */
            <div className="space-y-5 animate-scaleUp">
              
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30 animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg">
                  Bed Successfully Reserved!
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  A 2-hour hold has been placed at the hospital admission desk.
                </p>
              </div>

              {/* Digital Pass Ticket Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border border-slate-700 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-red-600/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-red-400" />
                    <span className="font-bold text-xs text-slate-200">{confirmedHospital?.name || hospital.name}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/40">
                    2-Hour Hold
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Reservation Token</span>
                    <span className="font-mono font-black text-lg text-amber-400 tracking-wider">
                      {confirmedBooking.booking_token}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Bed Tier</span>
                    <span className="font-bold text-white capitalize flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <span>{confirmedBooking.bed_type.toUpperCase()} Care Bed</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Patient</span>
                    <span className="font-semibold text-slate-200">{confirmedBooking.patient_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Valid Until</span>
                    <span className="font-mono text-slate-200">
                      {new Date(confirmedBooking.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">{hospital.locality}</strong>
                    <span className="text-slate-400">{hospital.address}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-red-950/50 border border-red-900/50 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-red-300 font-mono">
                    <Phone className="w-4 h-4 text-red-400 animate-pulse" />
                    <span>Emergency Helpline:</span>
                  </div>
                  <a
                    href={`tel:${hospital.emergency_helpline}`}
                    className="font-mono font-bold text-white hover:underline"
                  >
                    {hospital.emergency_helpline}
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transition-all text-center"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Navigate in Google Maps</span>
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Ticket</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Close Window
              </button>

            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleConfirmHold} className="space-y-5">
              
              {/* Selected Hospital Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{hospital.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{hospital.locality} • {hospital.distance_km} km away</span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    ⭐ {hospital.rating}
                  </span>
                </div>
              </div>

              {/* Bed Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Select Required Bed Tier:</span>
                  <span className="text-[11px] font-normal text-slate-500 font-mono">Live Hospital Bed Availability</span>
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  
                  {/* ICU Bed */}
                  <button
                    type="button"
                    onClick={() => setBedType('icu')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      bedType === 'icu'
                        ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-200 ring-2 ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">ICU Bed</span>
                      <span className={`w-2 h-2 rounded-full ${hospital.icu_beds_available > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </div>
                    <span className="text-[11px] font-mono font-black block">
                      {hospital.icu_beds_available} Left
                    </span>
                  </button>

                  {/* Oxygen Bed */}
                  <button
                    type="button"
                    onClick={() => setBedType('oxygen')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      bedType === 'oxygen'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Oxygen Bed</span>
                      <span className={`w-2 h-2 rounded-full ${hospital.oxygen_beds_available > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </div>
                    <span className="text-[11px] font-mono font-black block">
                      {hospital.oxygen_beds_available} Left
                    </span>
                  </button>

                  {/* General Bed */}
                  <button
                    type="button"
                    onClick={() => setBedType('general')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      bedType === 'general'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">General</span>
                      <span className={`w-2 h-2 rounded-full ${hospital.general_beds_available > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </div>
                    <span className="text-[11px] font-mono font-black block">
                      {hospital.general_beds_available} Left
                    </span>
                  </button>

                </div>
              </div>

              {/* Patient Information Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Enter patient name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none font-mono"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Triage Note */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Admission Priority / Triage Notes
                </label>
                <textarea
                  rows={2}
                  value={priorityNote}
                  onChange={(e) => setPriorityNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none resize-none"
                  placeholder="Clinical notes for the ER triage desk..."
                />
              </div>

              {/* 2-Hour Hold Guarantee Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start space-x-2.5 text-xs text-amber-900 dark:text-amber-200">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>2-Hour Emergency Hold Policy:</strong> Upon confirmation, ClinOS will atomically reserve this bed in the hospital's central registry for 120 minutes. Please bring photo ID and your token to the ER desk.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-700 dark:text-red-300 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || getAvailability(bedType) <= 0}
                  className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>Confirm Emergency 2-Hour Hold</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
