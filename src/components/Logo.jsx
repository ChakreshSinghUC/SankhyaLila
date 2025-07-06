import React from 'react';

const Logo = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={{ display: 'inline-block' }}
    >
      {/* Outer circle - representing infinity */}
      <circle
        cx="60"
        cy="60"
        r="55"
        fill="none"
        stroke="url(#gradient1)"
        strokeWidth="3"
        opacity="0.8"
      />
      
      {/* Golden ratio spiral */}
      <path
        d="M 60 60 Q 75 45 90 60 Q 75 75 60 75 Q 45 60 45 45 Q 60 30 75 45"
        fill="none"
        stroke="url(#gradient2)"
        strokeWidth="2.5"
        opacity="0.9"
      />
      
      {/* Sanskrit-inspired geometric pattern */}
      <g transform="translate(60,60)">
        {/* Central lotus-like pattern */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <g key={i} transform={`rotate(${angle})`}>
            <path
              d="M 0 0 Q 15 -8 20 0 Q 15 8 0 0"
              fill="url(#gradient3)"
              opacity="0.7"
            />
          </g>
        ))}
      </g>
      
      {/* Mathematical symbols subtly integrated */}
      <text
        x="35"
        y="35"
        fontSize="12"
        fill="url(#gradient4)"
        opacity="0.6"
        fontFamily="serif"
      >
        π
      </text>
      <text
        x="80"
        y="85"
        fontSize="10"
        fill="url(#gradient4)"
        opacity="0.6"
        fontFamily="serif"
      >
        φ
      </text>
      <text
        x="25"
        y="85"
        fontSize="11"
        fill="url(#gradient4)"
        opacity="0.6"
        fontFamily="serif"
      >
        ∞
      </text>
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e88e5" />
          <stop offset="100%" stopColor="#673ab7" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#f7931e" />
        </linearGradient>
        <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4caf50" />
          <stop offset="100%" stopColor="#2e7d32" />
        </radialGradient>
        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9c27b0" />
          <stop offset="100%" stopColor="#673ab7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
