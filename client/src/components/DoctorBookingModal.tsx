import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Video, Building2, CheckCircle2, ShieldCheck, User, Mail, Phone, FileText, Sparkles } from 'lucide-react';
import { DoctorSpecialist, AppointmentConfirmation } from '../types';
import { bookSpecialistAppointmentApi } from '../lib/api';

interface Props {
  specialist: DoctorSpecialist | null;
  clinicalCaseSummary?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorBookingModal: React.FC<Props> = ({
  specialist,
  clinicalCaseSummary = '',
  isOpen,
  onClose,
}) => {
  const [patientName, setPatientName] = useState<string>('Alex Johnson');
  const [patientEmail, setPatientEmail] = useState<string>('alex.johnson@patient-mail.com');
  const [patientPhone, setPatientPhone] = useState<string>('+1 (555) 321-7890');
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState<string>('10:30 AM');
  const [consultationMode, setConsultationMode] = useState<'Telehealth' | 'In-Person'>('Telehealth');
  const [reasonForVisit, setReasonForVisit] = useState<string>(
    clinicalCaseSummary ? `Referral evaluation for: ${clinicalCaseSummary.slice(0, 100)}...` : 'Specialist Clinical Consultation'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null);

  if (!isOpen || !specialist) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await bookSpecialistAppointmentApi({
        specialistId: specialist.id,
        patientName,
        patientEmail,
        patientPhone,
        preferredDate,
        preferredTime,
        consultationMode,
        reasonForVisit,
        clinicalCaseSummary,
      });
      setConfirmation(res.confirmation);
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmation(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {confirmation ? 'Consultation Confirmed' : 'Book Specialist Consultation'}
                </h3>
                <p className="text-xs text-slate-500">
                  {specialist.name} • {specialist.specialty}
                </p>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            {confirmation ? (
              /* Success Confirmation Card */
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    BOOKING REFERENCE: {confirmation.confirmationId}
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-900 mt-3">
                    Appointment Successfully Scheduled!
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                    Your appointment with <strong className="text-slate-900">{confirmation.specialist.name}</strong> is confirmed.
                  </p>
                </div>

                {/* Details Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs text-slate-700 font-sans">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Physician:</span>
                    <strong className="text-slate-900">{confirmation.specialist.name}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Hospital / Clinic:</span>
                    <strong className="text-slate-900">{confirmation.specialist.hospital}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Date & Time:</span>
                    <strong className="text-blue-700">{confirmation.scheduledTime}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Mode:</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      {confirmation.consultationMode}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Patient:</span>
                    <strong className="text-slate-900">{confirmation.patientName}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  {confirmation.instructions}
                </p>

                <button
                  onClick={handleResetAndClose}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-500/20 transition-all"
                >
                  Done & Return to Workspace
                </button>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Doctor Mini Card */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${specialist.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0`}>
                    {specialist.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{specialist.name}</h4>
                    <p className="text-[11px] text-blue-700 font-medium">{specialist.specialty}</p>
                    <p className="text-[10px] text-slate-500 truncate">{specialist.hospital}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-700 block">★ {specialist.rating}</span>
                    <span className="text-[10px] text-slate-500">{specialist.experienceYears}y exp</span>
                  </div>
                </div>

                {/* Consultation Mode Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Consultation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setConsultationMode('Telehealth')}
                      className={`p-3 rounded-xl border flex items-center space-x-2.5 text-xs font-semibold transition-all ${
                        consultationMode === 'Telehealth'
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-400/40'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Video className="w-4 h-4 text-blue-600" />
                      <div className="text-left">
                        <span className="block font-bold">Video Telehealth</span>
                        <span className="text-[10px] text-slate-500 font-normal">Fastest • From Home</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConsultationMode('In-Person')}
                      className={`p-3 rounded-xl border flex items-center space-x-2.5 text-xs font-semibold transition-all ${
                        consultationMode === 'In-Person'
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-400/40'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <div className="text-left">
                        <span className="block font-bold">In-Clinic Visit</span>
                        <span className="text-[10px] text-slate-500 font-normal">Hospital Campus</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="09:00 AM">09:00 AM - Morning Slot</option>
                      <option value="10:30 AM">10:30 AM - Morning Slot</option>
                      <option value="01:30 PM">01:30 PM - Afternoon Slot</option>
                      <option value="03:30 PM">03:30 PM - Afternoon Slot</option>
                      <option value="05:00 PM">05:00 PM - Evening Slot</option>
                    </select>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Patient Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Alex Johnson"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          placeholder="patient@email.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Reason for Specialist Consultation
                    </label>
                    <textarea
                      rows={2}
                      value={reasonForVisit}
                      onChange={(e) => setReasonForVisit(e.target.value)}
                      placeholder="Describe primary symptoms or attach clinical triage notes..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Security and Insurance Note */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    HIPAA Compliant Encrypted Booking • Insurance Verified: {specialist.consultationFee}
                  </span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirming Appointment with Clinic...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm Specialist Appointment</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
