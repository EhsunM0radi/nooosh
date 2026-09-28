import React from 'react';
import { toPersianDigits } from '../utils/persian';
import { NooshCharacter } from './NooshCharacter';

interface CircularWaterProgressProps {
  percentage: number;
  consumedMl: number;
  goalMl: number;
  size?: number;
}

export const CircularWaterProgress: React.FC<CircularWaterProgressProps> = ({
  percentage,
  consumedMl,
  goalMl,
  size = 230,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  // Calculate liquid height inside inner circle (diameter ~ size - 32)
  const innerSize = size - strokeWidth * 2 - 8;
  const waterHeight = Math.min(100, Math.max(5, clampedPercentage));
  const isGoalReached = clampedPercentage >= 100;

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* Background Outer Ring */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-sky-100 dark:text-slate-800"
        />
        {/* Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="waterFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Inner Masked Container for Animated Liquid Wave */}
      <div
        className="absolute rounded-full overflow-hidden flex flex-col items-center justify-center pointer-events-none bg-sky-50/50 dark:bg-slate-900/40 backdrop-blur-sm"
        style={{ width: innerSize, height: innerSize }}
      >
        {/* Liquid Wave Simulation */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out overflow-hidden"
          style={{ height: `${waterHeight}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-sky-500/35 to-sky-400/20" />
          <svg
            className="absolute top-0 left-0 w-[200%] h-4 -translate-y-2 animate-[wave_4s_linear_infinite]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z"
              fill="rgba(56, 189, 248, 0.4)"
            />
          </svg>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <NooshCharacter size={44} isCelebrating={isGoalReached} className="mb-0.5" />

          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-sky-950 dark:text-sky-100 tracking-tight">
              {toPersianDigits(clampedPercentage)}
            </span>
            <span className="text-sm font-bold text-sky-600 dark:text-sky-400">٪</span>
          </div>

          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
            {toPersianDigits(consumedMl)} / {toPersianDigits(goalMl)} میلی‌لیتر
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            ({toPersianDigits((consumedMl / 1000).toFixed(1))} از {toPersianDigits((goalMl / 1000).toFixed(1))} لیتر)
          </div>
        </div>
      </div>
    </div>
  );
};
