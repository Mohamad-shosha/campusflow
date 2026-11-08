import { FC, useId } from 'react';

export interface CarSvgProps {
  color?: string;
  gradientStart?: string;
  gradientMid?: string;
  gradientEnd?: string;
  type?: 'sedan' | 'suv' | 'luxury' | 'ev';
  plate?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export const CarSvg: FC<CarSvgProps> = ({
  color = '#0d9488',
  gradientStart,
  gradientMid,
  gradientEnd,
  type = 'sedan',
  plate,
  className = 'car-svg-icon',
  style,
}) => {
  const uniqueId = useId().replace(/:/g, '_');

  // Fallback gradient derivations if not provided
  const gStart = gradientStart || '#115e59';
  const gMid = gradientMid || '#2dd4bf';
  const gEnd = gradientEnd || '#042f2e';

  return (
    <svg
      className={className}
      viewBox="0 0 86 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '64px',
        height: '112px',
        display: 'block',
        margin: '0 auto',
        filter: 'drop-shadow(0 10px 14px rgba(0, 0, 0, 0.55))',
        ...style,
      }}
      aria-label={type}
    >
      <defs>
        {/* Paint Gloss Gradient */}
        <linearGradient id={`paint_${uniqueId}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={gEnd} />
          <stop offset="12%" stopColor={gStart} />
          <stop offset="42%" stopColor={color} />
          <stop offset="50%" stopColor={gMid} />
          <stop offset="58%" stopColor={color} />
          <stop offset="88%" stopColor={gStart} />
          <stop offset="100%" stopColor={gEnd} />
        </linearGradient>

        {/* Windshield Tint Gradient */}
        <linearGradient id={`windshield_${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#090d16" />
          <stop offset="60%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Glass Specular Glare */}
        <linearGradient id={`glare_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.35)" />
          <stop offset="40%" stopColor="rgba(255, 255, 255, 0.08)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>

        {/* Ambient Ground Shadow */}
        <radialGradient id={`shadow_${uniqueId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0.75)" />
          <stop offset="65%" stopColor="rgba(0, 0, 0, 0.4)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
        </radialGradient>

        {/* Headlight Beam Glow */}
        <linearGradient id={`headlightBeam_${uniqueId}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(224, 242, 254, 0.45)" />
          <stop offset="100%" stopColor="rgba(224, 242, 254, 0)" />
        </linearGradient>
      </defs>

      {/* 1. Ground Ambient Shadow */}
      <ellipse cx="43" cy="74" rx="38" ry="64" fill={`url(#shadow_${uniqueId})`} />

      {/* 2. Tires & Alloy Wheels */}
      {/* Front Left */}
      <rect x="4" y="20" width="10" height="23" rx="3.5" fill="#18181b" />
      <rect x="6" y="24" width="6" height="15" rx="2" fill="#52525b" />
      {/* Front Right */}
      <rect x="72" y="20" width="10" height="23" rx="3.5" fill="#18181b" />
      <rect x="74" y="24" width="6" height="15" rx="2" fill="#52525b" />
      {/* Rear Left */}
      <rect x="4" y="102" width="10" height="25" rx="3.5" fill="#18181b" />
      <rect x="6" y="106" width="6" height="17" rx="2" fill="#52525b" />
      {/* Rear Right */}
      <rect x="72" y="102" width="10" height="25" rx="3.5" fill="#18181b" />
      <rect x="74" y="106" width="6" height="17" rx="2" fill="#52525b" />

      {/* 3. Car Body Shell */}
      {type === 'suv' ? (
        // SUV Muscular Body
        <path
          d="M 23 10 Q 43 6 63 10 C 72 12 75 19 75 30 C 75 42 72 58 72 82 C 72 106 75 122 75 133 C 75 140 68 143 59 143 Q 43 145 27 143 C 18 143 11 140 11 133 C 11 122 14 106 14 82 C 14 58 11 42 11 30 C 11 19 14 12 23 10 Z"
          fill={`url(#paint_${uniqueId})`}
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.2"
        />
      ) : type === 'ev' ? (
        // EV Aerodynamic Sleek Silhouette
        <path
          d="M 25 11 Q 43 7 61 11 C 70 12 73 19 73 31 C 73 43 71 59 71 81 C 71 103 73 119 73 131 C 73 137 67 140 59 140 Q 43 142 27 140 C 19 140 13 137 13 131 C 13 119 15 103 15 81 C 15 59 13 43 13 31 C 13 19 16 12 25 11 Z"
          fill={`url(#paint_${uniqueId})`}
          stroke="#38bdf8"
          strokeWidth="1.2"
        />
      ) : (
        // Sedan / Luxury Streamlined Silhouette
        <path
          d="M 24 12 Q 43 8 62 12 C 70 13 73 20 73 32 C 73 44 71 60 71 82 C 71 104 73 120 73 131 C 73 137 67 140 58 140 Q 43 142 28 140 C 19 140 13 137 13 131 C 13 120 15 104 15 82 C 15 60 13 44 13 32 C 13 20 16 13 24 12 Z"
          fill={`url(#paint_${uniqueId})`}
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.2"
        />
      )}

      {/* 4. Bonnet Character Lines (Hood) */}
      <path
        d="M 26 14 Q 31 30 31 43"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 60 14 Q 55 30 55 43"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
        fill="none"
      />

      {/* 5. Side Mirrors */}
      {/* Left */}
      <path
        d="M 14 42 L 5 39 C 2.5 39 2.5 47 5 48 L 14 48 Z"
        fill={`url(#paint_${uniqueId})`}
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth="0.8"
      />
      <line
        x1="4.5"
        y1="41"
        x2="4.5"
        y2="46"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Right */}
      <path
        d="M 72 42 L 81 39 C 83.5 39 83.5 47 81 48 L 72 48 Z"
        fill={`url(#paint_${uniqueId})`}
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth="0.8"
      />
      <line
        x1="81.5"
        y1="41"
        x2="81.5"
        y2="46"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* 6. Front Windshield */}
      <path
        d="M 22 45 Q 43 39 64 45 L 61 68 Q 43 64 25 68 Z"
        fill={`url(#windshield_${uniqueId})`}
        stroke="rgba(255, 255, 255, 0.35)"
        strokeWidth="1"
      />
      {/* Windshield Reflection Glare */}
      <path d="M 28 46 L 40 43 L 34 67 L 25 68 Z" fill={`url(#glare_${uniqueId})`} />
      {/* Rearview mirror base */}
      <rect x="41" y="44" width="4" height="4" rx="1" fill="#000000" />

      {/* 7. Roof Section */}
      {type === 'ev' ? (
        // EV Panoramic Glass Canopy
        <>
          <rect
            x="24"
            y="69"
            width="38"
            height="32"
            rx="3"
            fill="#090d16"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1"
          />
          {/* Subtle Electric Power Indicator */}
          <circle cx="43" cy="85" r="4.5" fill="rgba(56, 189, 248, 0.2)" />
          <path d="M 43 82 L 41 85 L 43.5 85 L 42 88 L 45 84.5 L 43 84.5 Z" fill="#38bdf8" />
        </>
      ) : type === 'suv' ? (
        // SUV Roof with Side Rails
        <>
          <rect
            x="23"
            y="70"
            width="40"
            height="30"
            rx="4"
            fill="#0b111e"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
          />
          {/* Left Roof Rail */}
          <rect
            x="18"
            y="55"
            width="2.5"
            height="50"
            rx="1"
            fill="#cbd5e1"
            stroke="#475569"
            strokeWidth="0.5"
          />
          {/* Right Roof Rail */}
          <rect
            x="65.5"
            y="55"
            width="2.5"
            height="50"
            rx="1"
            fill="#cbd5e1"
            stroke="#475569"
            strokeWidth="0.5"
          />
        </>
      ) : (
        // Sedan / Luxury Sunroof
        <rect
          x="25"
          y="70"
          width="36"
          height="28"
          rx="4"
          fill="#090d16"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
        />
      )}

      {/* 8. Rear Windshield */}
      <path
        d="M 25 102 Q 43 98 61 102 L 59 119 Q 43 122 27 119 Z"
        fill={`url(#windshield_${uniqueId})`}
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
      />
      {/* Defroster Grid Lines */}
      <line
        x1="28"
        y1="106"
        x2="58"
        y2="106"
        stroke="#f59e0b"
        strokeWidth="0.6"
        strokeOpacity="0.5"
      />
      <line
        x1="27"
        y1="110"
        x2="59"
        y2="110"
        stroke="#f59e0b"
        strokeWidth="0.6"
        strokeOpacity="0.5"
      />
      <line
        x1="27"
        y1="114"
        x2="59"
        y2="114"
        stroke="#f59e0b"
        strokeWidth="0.6"
        strokeOpacity="0.5"
      />

      {/* 9. Front Headlights (High-Intensity LED Projectors) */}
      {/* Left Headlight */}
      <path
        d="M 17 15 Q 26 11 30 18 L 26 26 Q 16 23 17 15 Z"
        fill="#f8fafc"
        stroke="#e2e8f0"
        strokeWidth="0.8"
      />
      <circle cx="21" cy="20" r="2.2" fill="#38bdf8" />
      <circle cx="26" cy="22" r="1.8" fill="#ffffff" />
      <rect x="15" y="19" width="2" height="5" rx="1" fill="#f59e0b" />

      {/* Right Headlight */}
      <path
        d="M 69 15 Q 60 11 56 18 L 60 26 Q 70 23 69 15 Z"
        fill="#f8fafc"
        stroke="#e2e8f0"
        strokeWidth="0.8"
      />
      <circle cx="65" cy="20" r="2.2" fill="#38bdf8" />
      <circle cx="60" cy="22" r="1.8" fill="#ffffff" />
      <rect x="69" y="19" width="2" height="5" rx="1" fill="#f59e0b" />

      {/* 10. Rear Taillights (Continuous LED Light Bar) */}
      <path d="M 18 133 Q 43 136 68 133" stroke="#ef4444" strokeWidth="3.2" strokeLinecap="round" />
      {/* Left Taillight Cluster */}
      <rect x="16" y="130" width="8" height="5" rx="1.5" fill="#dc2626" />
      {/* Right Taillight Cluster */}
      <rect x="62" y="130" width="8" height="5" rx="1.5" fill="#dc2626" />

      {/* 11. Miniature Saudi License Plate on Trunk */}
      <rect
        x="31"
        y="132"
        width="24"
        height="6.8"
        rx="1.2"
        fill="#ffffff"
        stroke="#94a3b8"
        strokeWidth="0.7"
      />
      {/* Saudi Green Emblem Stencil */}
      <rect x="32" y="133.5" width="3.5" height="4" rx="0.5" fill="#15803d" />
      {/* License Plate String or Simulation */}
      <text
        x="44"
        y="137.2"
        fill="#0f172a"
        fontSize="3.8"
        fontWeight="bold"
        fontFamily="monospace"
        textAnchor="middle"
      >
        {plate ? plate.slice(0, 9) : 'FBSU 2026'}
      </text>
    </svg>
  );
};
