import React from 'react';

interface AlienLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AlienLogo: React.FC<AlienLogoProps> = ({
  size = 'md',
  showWordmark = true,
  animated = false,
  className = '',
  onClick,
}) => {
  const iconDimensions = {
    sm: { box: 28, radius: 7 },
    md: { box: 36, radius: 9 },
    lg: { box: 44, radius: 11 },
    xl: { box: 56, radius: 14 },
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 ${
          animated ? 'hover:scale-105' : ''
        }`}
        style={{ width: iconDimensions.box, height: iconDimensions.box }}
      >
        <svg
          viewBox="0 0 40 40"
          width={iconDimensions.box}
          height={iconDimensions.box}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_12px_rgba(124,92,255,0.4)]"
        >
          <defs>
            <linearGradient id="alienGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C5CFF" />
              <stop offset="60%" stopColor="#B05CFF" />
              <stop offset="100%" stopColor="#22E6A8" />
            </linearGradient>
            <radialGradient id="alienEyeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22E6A8" />
              <stop offset="100%" stopColor="#07060D" />
            </radialGradient>
          </defs>

          {/* Rounded base plate */}
          <rect
            width="40"
            height="40"
            rx={iconDimensions.radius}
            fill="#14111F"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.2"
          />

          {/* Alien Head shape */}
          <path
            d="M20 8.5C13.8 8.5 9.5 13.5 9.5 19.5C9.5 25.8 14.5 31.5 20 31.5C25.5 31.5 30.5 25.8 30.5 19.5C30.5 13.5 26.2 8.5 20 8.5Z"
            fill="url(#alienGradient)"
          />

          {/* Subtle forehead antenna or crest notch */}
          <circle cx="20" cy="11.5" r="1.5" fill="#22E6A8" />

          {/* Left Slanted Alien Eye */}
          <ellipse
            cx="15.5"
            cy="19"
            rx="2.8"
            ry="4.5"
            transform="rotate(-20 15.5 19)"
            fill="#07060D"
          />
          <circle cx="15" cy="18" r="1.2" fill="#22E6A8" />

          {/* Right Slanted Alien Eye */}
          <ellipse
            cx="24.5"
            cy="19"
            rx="2.8"
            ry="4.5"
            transform="rotate(20 24.5 19)"
            fill="#07060D"
          />
          <circle cx="25" cy="18" r="1.2" fill="#22E6A8" />

          {/* Tiny subtle alien mouth */}
          <path
            d="M18 25.5C19 26.2 21 26.2 22 25.5"
            stroke="#07060D"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        {/* Ambient subtle glow pulse */}
        <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#7C5CFF]/20 to-[#22E6A8]/20 blur-md pointer-events-none -z-10" />
      </div>

      {showWordmark && (
        <span
          className={`font-heading font-bold tracking-tight text-white ${textSize} flex items-center`}
        >
          Alien<span className="text-[#22E6A8]">.ai</span>
        </span>
      )}
    </div>
  );
};
