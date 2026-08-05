import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandLogo: React.FC<Props> = ({ size = 'md', showText = true }) => {
  const dimensions = {
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-lg', badge: 'text-[9px]' },
    md: { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-xl', badge: 'text-[10px]' },
    lg: { box: 'w-14 h-14', icon: 'w-7 h-7', text: 'text-3xl', badge: 'text-xs' },
  }[size];

  return (
    <div className="flex items-center space-x-3 group">
      
      {/* Brand Icon Badge */}
      <div className={`relative ${dimensions.box} rounded-2xl bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/35 transition-all duration-300`}>
        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
          
          {/* Subtle Radial Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50/50 pointer-events-none" />

          {/* SVG Medical Pulse Cross Logo */}
          <svg
            className={`${dimensions.icon} text-blue-600 transform group-hover:scale-110 transition-transform duration-300`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Medical Cross Base */}
            <path d="M12 2v20M2 12h20" strokeOpacity="0.2" />
            {/* Pulse Wave Trace */}
            <path
              d="M3 12h3.5l1.5-4 3.5 9 2.5-7 1.5 3.5H21"
              className="animate-pulse"
            />
            {/* Neural Connection Nodes */}
            <circle cx="8" cy="8" r="1.5" className="fill-blue-600" />
            <circle cx="13" cy="17" r="1.5" className="fill-teal-500" />
            <circle cx="15.5" cy="10" r="1.5" className="fill-emerald-500" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className={`font-extrabold ${dimensions.text} tracking-tight text-slate-900 font-sans`}>
              Clin<span className="text-blue-600">OS</span>
            </span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-sm ${dimensions.badge}`}>
              v2.5 PRO
            </span>
          </div>
          <span className="text-[11px] text-slate-500 tracking-wide font-medium font-sans">
            Autonomous Clinical Orchestrator
          </span>
        </div>
      )}

    </div>
  );
};
