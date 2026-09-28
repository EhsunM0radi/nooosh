import React from 'react';
import { toPersianDigits } from '../utils/persian';

interface GlassRowIndicatorProps {
  consumedGlasses: number;
  totalGoalGlasses: number;
  onGlassClick: () => void;
}

export const GlassRowIndicator: React.FC<GlassRowIndicatorProps> = ({
  consumedGlasses,
  totalGoalGlasses,
  onGlassClick,
}) => {
  const displayGoal = Math.max(1, totalGoalGlasses);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200">
          {toPersianDigits(consumedGlasses)} از {toPersianDigits(displayGoal)} لیوان امروز
        </span>
        <button
          onClick={onGlassClick}
          className="text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>+ نوشیدن یک لیوان</span>
          <span className="text-[10px] text-slate-400">(۲۵۰ml)</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        {Array.from({ length: displayGoal }).map((_, idx) => {
          const isFilled = idx < consumedGlasses;
          return (
            <button
              key={idx}
              onClick={onGlassClick}
              title={`لیوان ${toPersianDigits(idx + 1)}`}
              className={`relative flex-1 min-w-[28px] max-w-[42px] h-11 rounded-xl flex items-center justify-center border transition-all duration-300 transform active:scale-95 cursor-pointer ${
                isFilled
                  ? 'bg-gradient-to-b from-sky-400 to-sky-600 border-sky-500 shadow-sm text-white scale-100'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-sky-300'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill={isFilled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 drop-shadow-sm"
              >
                <path d="M5 2h14l-2 18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 2Z" />
                <path d="M6 7h12" />
              </svg>
              {isFilled && (
                <span className="absolute bottom-1 text-[9px] font-bold opacity-90">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
