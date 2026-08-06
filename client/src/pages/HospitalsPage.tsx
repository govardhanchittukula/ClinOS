import React from 'react';
import { HospitalLocator } from '../components/HospitalLocator';
import { PhoneCall, Ambulance } from 'lucide-react';

export const HospitalsPage: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Top Emergency Action Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-red-100">
            <Ambulance className="w-3.5 h-3.5" />
            <span>Telangana State Healthcare Network • Ranga Reddy Cluster</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Real-Time Hospital Bed Locator & Holds
          </h1>
          <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
            Locate live ICU, Oxygen, and General admission beds with verified 2-hour digital reservations across Continental, AIG, Care, Apollo, KIMS, and Sunrise trauma centers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:108"
            className="px-4 py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 font-black text-xs flex items-center justify-center space-x-2 shadow-xs transition-all text-center"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-600" />
            <span>National Emergency: Dial 108</span>
          </a>
        </div>
      </div>

      {/* Live Hospital Locator Component */}
      <HospitalLocator />
    </div>
  );
};
