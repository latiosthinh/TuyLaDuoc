import React from "react";

interface LogoIconProps {
  className?: string;
  size?: number;
}

export function LogoIcon({ className = "h-9 w-9", size = 36 }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="logo-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="logo-spark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffedd5" />
        </linearGradient>
        <filter id="logo-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Squircle container with brand gradient */}
      <rect width="32" height="32" rx="8" fill="url(#logo-bg)" />
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="7.25"
        stroke="url(#logo-ring)"
        strokeWidth="1"
      />

      {/* Outer ticks & orbit track */}
      <circle
        cx="16"
        cy="16"
        r="9.5"
        stroke="#ffedd5"
        strokeOpacity="0.35"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />

      {/* 4 dynamic domain blades */}
      <path
        d="M16 7.5 A8.5 8.5 0 0 1 24.5 16"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M24.5 16 A8.5 8.5 0 0 1 16 24.5"
        stroke="#fed7aa"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M16 24.5 A8.5 8.5 0 0 1 7.5 16"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M7.5 16 A8.5 8.5 0 0 1 16 7.5"
        stroke="#fed7aa"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Center compass star & focal needle */}
      <g filter="url(#logo-shadow)">
        <path
          d="M16 9 L18.5 14.5 L23 16 L18.5 17.5 L16 23 L13.5 17.5 L9 16 L13.5 14.5 Z"
          fill="url(#logo-spark)"
        />
      </g>

      {/* Center pivot gem */}
      <circle cx="16" cy="16" r="2.2" fill="#c2410c" />
      <circle cx="16" cy="16" r="1.1" fill="#ffffff" />
    </svg>
  );
}
