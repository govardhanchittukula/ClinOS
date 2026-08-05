import React from 'react';
import { HospitalLocator } from '../components/HospitalLocator';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import { ShieldCheck, PhoneCall, Bed, Ambulance } from 'lucide-react';

export const HospitalsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">
      <MedicalDisclaimerBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Top Emergency Action Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-red-100">
              <Ambulance className="w-4 h-4 animate-bounce" />
              <span>Telangana State Healthcare Network • Ranga Reddy Cluster</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Real-Time Hospital Bed Locator & Holds
            </h1>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
              Locate live ICU, Oxygen, and General admission beds with verified 2-hour digital reservations across Continental, AIG, Care, Apollo, KIMS, and Sunrise trauma centers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="tel:108"
              className="px-5 py-3 rounded-2xl bg-white text-red-700 hover:bg-red-50 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-black/10 transition-all text-center"
            >
              <PhoneCall className="w-4 h-4 text-red-600 animate-pulse" />
              <span>National Emergency: Dial 108</span>
            </a>
          </div>
        </div>

        {/* Live Hospital Locator Component */}
        <HospitalLocator />

      </main>
    </div>
  );
};
