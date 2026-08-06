import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, X, PhoneCall } from 'lucide-react';

interface Props {
  compact?: boolean;
  dismissible?: boolean;
}

export const MedicalDisclaimerBanner: React.FC<Props> = ({ compact = false, dismissible = false }) => {
  const [dismissed, setDismissed] = useState<boolean>(false);

  if (dismissed) return null;

  if (compact) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl px-3 py-1.5 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center space-x-2 truncate">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="truncate">
            <strong>Clinical Support System:</strong> AI-generated guidance. <em>Not medical advice.</em>
          </span>
        </div>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-600 hover:text-amber-800 dark:hover:text-amber-200 p-0.5"
            aria-label="Dismiss disclaimer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-amber-50/90 dark:bg-amber-950/30 border-b border-amber-200/80 dark:border-amber-900/60 py-2 px-4 sm:px-6 text-amber-900 dark:text-amber-300 text-xs shrink-0 transition-colors">
      <div className="w-full flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="truncate text-xs leading-tight">
            <strong className="font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider text-[10px] font-mono mr-1.5">
              Decision Support Notice:
            </strong>
            ClinOS generates autonomous decision support for licensed medical practitioners. 
            <strong className="ml-1 text-amber-950 dark:text-amber-100">Not Medical Advice — Always Consult a Licensed Physician.</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <a
            href="tel:108"
            className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 font-mono text-[10px] font-bold border border-rose-200 dark:border-rose-800 hover:bg-rose-200 transition-colors"
          >
            <PhoneCall className="w-2.5 h-2.5 text-rose-600 dark:text-rose-400" />
            <span>Emergency: 108</span>
          </a>
          <span className="hidden md:inline-block font-mono text-[10px] bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-md border border-amber-300/70 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold">
            IEC-62304 / ISO-13485
          </span>
          {dismissible && (
            <button
              onClick={() => setDismissed(true)}
              className="text-amber-600 hover:text-amber-900 dark:hover:text-amber-200 p-0.5"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
