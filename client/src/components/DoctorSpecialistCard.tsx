import React from 'react';
import { ShieldCheck, Star, Video, Building2, Calendar, Award, ChevronRight, Phone, Sparkles } from 'lucide-react';
import { DoctorSpecialist, MatchedSpecialist } from '../types';

interface Props {
  specialist: DoctorSpecialist | MatchedSpecialist;
  onBookClick: (specialist: DoctorSpecialist) => void;
  compact?: boolean;
}

export const DoctorSpecialistCard: React.FC<Props> = ({
  specialist,
  onBookClick,
  compact = false,
}) => {
  const isMatched = 'matchScore' in specialist;
  const matchScore = isMatched ? (specialist as MatchedSpecialist).matchScore : null;
  const matchReason = isMatched ? (specialist as MatchedSpecialist).matchReason : null;
  const urgencyLevel = isMatched ? (specialist as MatchedSpecialist).urgencyLevel : null;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
      
      {/* Top Details */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Avatar Pill */}
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${specialist.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0`}
            >
              {specialist.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {specialist.name}
                </h4>
                {specialist.verifiedBadge && (
                  <span title="Board Certified & Verified">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-blue-700 truncate">{specialist.title}</p>
              <p className="text-[11px] text-slate-500 truncate">{specialist.hospital}</p>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{specialist.rating.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 font-normal">({specialist.reviewsCount})</span>
          </div>
        </div>

        {/* Match Percentage (If recommended for case) */}
        {isMatched && matchScore && (
          <div className="mb-3 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[10px] font-bold">
                {matchScore}% AI MATCH
              </span>
              <span className="text-[11px] text-slate-700 font-medium truncate max-w-[200px]">
                {matchReason}
              </span>
            </div>
            {urgencyLevel && (
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  urgencyLevel.includes('Emergency')
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {urgencyLevel}
              </span>
            )}
          </div>
        )}

        {/* Bio Snippet */}
        {!compact && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 font-sans">
            {specialist.bio}
          </p>
        )}

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 font-sans">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 flex items-center space-x-1">
            <Award className="w-3 h-3 text-slate-500" />
            <span>{specialist.experienceYears} Years Exp.</span>
          </span>

          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
            {specialist.languages.join(', ')}
          </span>

          {specialist.consultationModes.includes('Telehealth') && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
              <Video className="w-3 h-3 text-emerald-600" />
              <span>Telehealth Available</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
            Next Open Slot:
          </span>
          <span className="text-xs font-bold text-slate-900 block font-mono">
            {specialist.nextAvailableSlot}
          </span>
        </div>

        <button
          onClick={() => onBookClick(specialist)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-1.5 shrink-0"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Consultation</span>
        </button>
      </div>

    </div>
  );
};
