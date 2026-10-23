import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

export const InnovoadAiLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  textClassName = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-base', subtext: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-lg', subtext: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', text: 'text-xl', subtext: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl', subtext: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Logo Emblem Icon */}
      <div
        className={`relative shrink-0 ${currentSize.icon} rounded-2xl bg-[#478B8D] dark:bg-[#1E4344] p-0.5 shadow-sm border border-[#3A7577] dark:border-[#2F6163] overflow-hidden flex items-center justify-center group transition-transform hover:scale-105`}
      >
        {/* Subtle executive glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Custom Vector SVG Logo Symbol matching INNOVOADAI emblem */}
        <svg viewBox="0 0 100 100" className="w-full h-full p-1 relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="invGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#EAE2D6" />
              <stop offset="100%" stopColor="#B2E4E6" />
            </linearGradient>
            <linearGradient id="invGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5EFE6" />
              <stop offset="100%" stopColor="#3A7577" />
            </linearGradient>
            <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#478B8D" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background subtle neural arc */}
          <path d="M 20 38 A 32 32 0 0 1 80 38" stroke="url(#invGrad1)" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
          <line x1="50" y1="20" x2="32" y2="30" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.5" />
          <line x1="50" y1="20" x2="68" y2="30" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.5" />

          {/* Top Beacon Circle */}
          <circle cx="50" cy="18" r="7" fill="url(#beaconGlow)" />
          <circle cx="50" cy="18" r="3.5" fill="#FFFFFF" />

          {/* Book Wings / Shield Outline */}
          <path d="M 18 42 Q 35 48 48 76 Q 30 72 18 56 Z" fill="url(#invGrad2)" opacity="0.9" />
          <path d="M 82 42 Q 65 48 52 76 Q 70 72 82 56 Z" fill="url(#invGrad2)" opacity="0.9" />

          {/* Stylized 'I' and 'A' Monogram Centerpiece */}
          <path
            d="M 50 25 C 47 38, 42 55, 32 80 C 40 82, 46 72, 50 62 C 54 72, 60 82, 68 80 C 58 55, 53 38, 50 25 Z"
            fill="url(#invGrad1)"
          />
          {/* Ribbon crossbar of A */}
          <path d="M 36 60 Q 50 52 64 60 C 60 64, 40 64, 36 60 Z" fill="#FFFFFF" />
          <circle cx="50" cy="32" r="3" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight text-slate-900 dark:text-white font-sans ${currentSize.text} ${textClassName}`}
            >
              INNOVOAD<span className="text-[#478B8D] dark:text-[#78BFC1]">AI</span>
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#478B8D]/20 text-[#1F494A] dark:bg-[#478B8D]/30 dark:text-[#B2E4E6] border border-[#478B8D]/40 tracking-wider">
              PRO
            </span>
          </div>
          <p className={`text-slate-600 dark:text-slate-400 font-medium tracking-wide ${currentSize.subtext} -mt-0.5`}>
            Academic Intelligence Portal
          </p>
        </div>
      )}
    </div>
  );
};
