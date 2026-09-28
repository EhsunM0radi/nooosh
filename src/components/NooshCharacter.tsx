import React from 'react';

interface NooshCharacterProps {
  size?: number;
  isCelebrating?: boolean;
  className?: string;
}

export const NooshCharacter: React.FC<NooshCharacterProps> = ({
  size = 80,
  isCelebrating = false,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform duration-700 ease-in-out ${
        isCelebrating ? 'animate-bounce' : 'hover:scale-105'
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id="nooshGrad" x1="0" y1="0.1" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <filter id="nooshGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0284C7" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Droplet Body */}
        <path
          d="M 50 12 C 20 45 15 65 15 75 C 15 95 85 95 85 75 C 85 65 80 45 50 12 Z"
          fill="url(#nooshGrad)"
          stroke="#0284C7"
          strokeWidth="3"
          filter="url(#nooshGlow)"
        />

        {/* Light reflection highlight on top-left */}
        <path
          d="M 32 45 C 28 55 28 68 35 75"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Sparkling Eyes */}
        <circle cx="38" cy="62" r="5.5" fill="#0F172A" />
        <circle cx="62" cy="62" r="5.5" fill="#0F172A" />

        {/* Catchlights in Eyes */}
        <circle cx="36.5" cy="60.5" r="2.2" fill="#FFFFFF" />
        <circle cx="60.5" cy="60.5" r="2.2" fill="#FFFFFF" />

        {/* Blush Cheeks */}
        <circle cx="28" cy="68" r="5" fill="#FF8FA3" opacity="0.65" />
        <circle cx="72" cy="68" r="5" fill="#FF8FA3" opacity="0.65" />

        {/* Cheerful Smile */}
        <path
          d="M 42 72 Q 50 80 58 72"
          fill="none"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Gold star if celebrating */}
        {isCelebrating && (
          <g transform="translate(68, 14)">
            <polygon
              points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="0.8"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
