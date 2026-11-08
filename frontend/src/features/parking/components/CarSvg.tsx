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
  headlightsOn?: boolean;
}

/**
 * CarSvg — Refined, sleek architectural top-down vehicle visualization.
 * Designed with elegant proportions, delicate contour lines, subtle metallic gloss,
 * and minimalist lighting that seamlessly harmonizes with the luxury dark campus UI.
 */
export const CarSvg: FC<CarSvgProps> = ({
  color = '#0d9488',
  gradientStart,
  gradientMid,
  gradientEnd,
  type = 'sedan',
  plate,
  className = 'car-svg-icon',
  style,
  headlightsOn = false,
}) => {
  const uniqueId = useId().replace(/:/g, '_');

  // Harmonious metallic gloss gradients
  const gStart = gradientStart || '#134e4a';
  const gMid = gradientMid || '#2dd4bf';
  const gEnd = gradientEnd || '#042f2e';

  // Plate display parsing
  const plateText = (plate || 'أ ب ج 1234').trim();
  const plateParts = plateText.split(' ');
  const plateLetters = plateParts.slice(0, Math.max(1, plateParts.length - 1)).join(' ');
  const plateDigits = plateParts[plateParts.length - 1] || '1234';

  return (
    <svg
      className={`${className} car-svg-graphic`}
      viewBox="0 0 64 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '50px',
        height: '90px',
        display: 'block',
        margin: '0 auto',
        filter: 'drop-shadow(0 8px 14px rgba(0, 0, 0, 0.55))',
        transition: 'transform 0.25s ease, filter 0.25s ease',
        ...style,
      }}
      aria-label={type}
    >
      <defs>
        {/* Paint Gloss Gradient */}
        <linearGradient id={`paint_${uniqueId}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={gEnd} />
          <stop offset="12%" stopColor={gStart} />
          <stop offset="38%" stopColor={color} />
          <stop offset="50%" stopColor={gMid} />
          <stop offset="62%" stopColor={color} />
          <stop offset="88%" stopColor={gStart} />
          <stop offset="100%" stopColor={gEnd} />
        </linearGradient>

        {/* Panoramic Glass Canopy Gradient */}
        <linearGradient id={`glass_${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#090d16" />
          <stop offset="45%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0b0f19" />
        </linearGradient>

        {/* Delicate Glass Glare Line */}
        <linearGradient id={`glare_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
          <stop offset="30%" stopColor="rgba(255, 255, 255, 0.1)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>

        {/* Ambient Ground Shadow */}
        <radialGradient id={`shadow_${uniqueId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0.75)" />
          <stop offset="65%" stopColor="rgba(0, 0, 0, 0.35)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
        </radialGradient>

        {/* Soft Headlight Beams */}
        <linearGradient id={`beam_${uniqueId}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(254, 240, 138, 0.45)" />
          <stop offset="50%" stopColor="rgba(224, 242, 254, 0.18)" />
          <stop offset="100%" stopColor="rgba(224, 242, 254, 0)" />
        </linearGradient>
      </defs>

      {/* 0. Soft Ambient Headlight Projection on hover */}
      <g className={`car-headlight-beams ${headlightsOn ? 'always-on' : ''}`}>
        <polygon points="15,14 4,0 24,0 20,14" fill={`url(#beam_${uniqueId})`} />
        <polygon points="44,14 40,0 60,0 49,14" fill={`url(#beam_${uniqueId})`} />
      </g>

      {/* 1. Ground Shadow (Tucked tightly under the chassis) */}
      <ellipse cx="32" cy="58" rx="28" ry="52" fill={`url(#shadow_${uniqueId})`} />

      {/* 2. Inset Tires & Alloy Wheels (Elegantly tucked into wheel wells) */}
      {/* Front Tires */}
      <rect x="3" y="16" width="6" height="18" rx="2.5" fill="#09090b" />
      <rect x="4.5" y="18" width="3" height="14" rx="1" fill="#475569" />
      <rect x="55" y="16" width="6" height="18" rx="2.5" fill="#09090b" />
      <rect x="56.5" y="18" width="3" height="14" rx="1" fill="#475569" />

      {/* Rear Tires */}
      <rect x="3" y="78" width="6" height="19" rx="2.5" fill="#09090b" />
      <rect x="4.5" y="80" width="3" height="15" rx="1" fill="#475569" />
      <rect x="55" y="78" width="6" height="19" rx="2.5" fill="#09090b" />
      <rect x="56.5" y="80" width="3" height="15" rx="1" fill="#475569" />

      {/* 3. Aerodynamic Body Shell — Smooth, delicate silhouette */}
      {type === 'suv' ? (
        // SUV / Crossover Silhouette
        <path
          d="M 18 9 Q 32 6 46 9 C 53 11 55 16 55 25 C 55 35 53 48 53 66 C 53 84 55 96 55 104 C 55 109 50 111 43 111 Q 32 112 21 111 C 14 111 9 109 9 104 C 9 96 11 84 11 66 C 11 48 9 35 9 25 C 9 16 11 11 18 9 Z"
          fill={`url(#paint_${uniqueId})`}
          stroke="rgba(255, 255, 255, 0.28)"
          strokeWidth="0.85"
        />
      ) : type === 'ev' ? (
        // Minimalist Aerodynamic EV Silhouette
        <path
          d="M 19 9 Q 32 6.5 45 9 C 52 10.5 54 15 54 25 C 54 35 52 48 52 65 C 52 82 54 94 54 103 C 54 108 49 110 42 110 Q 32 111 22 110 C 15 110 10 108 10 103 C 10 94 12 82 12 65 C 12 48 10 35 10 25 C 10 15 12 10.5 19 9 Z"
          fill={`url(#paint_${uniqueId})`}
          stroke="#38bdf8"
          strokeWidth="0.85"
        />
      ) : (
        // Sleek Sedan / Executive Silhouette
        <path
          d="M 19 10 Q 32 7 45 10 C 52 11.5 54 16 54 26 C 54 36 52 49 52 66 C 52 83 54 95 54 103 C 54 108 49 110 42 110 Q 32 111.5 22 110 C 15 110 10 108 10 103 C 10 95 12 83 12 66 C 12 49 10 36 10 26 C 10 16 12 11.5 19 10 Z"
          fill={`url(#paint_${uniqueId})`}
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="0.85"
        />
      )}

      {/* 4. Delicate Bonnet Crease Lines */}
      <path d="M 20 11 Q 23 23 23 33" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="0.75" />
      <path d="M 44 11 Q 41 23 41 33" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="0.75" />

      {/* Front Grille / EV Light Strip */}
      {type === 'ev' ? (
        <line
          x1="22"
          y1="9.5"
          x2="42"
          y2="9.5"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      ) : (
        <ellipse cx="32" cy="9.5" rx="2.5" ry="1.2" fill="rgba(255, 255, 255, 0.65)" />
      )}

      {/* 5. Minimalist Side Mirrors */}
      <path
        d="M 10 33 L 4 31 C 2.5 31 2.5 36 4 37 L 10 37 Z"
        fill={`url(#paint_${uniqueId})`}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="0.6"
      />
      <path
        d="M 54 33 L 60 31 C 61.5 31 61.5 36 60 37 L 54 37 Z"
        fill={`url(#paint_${uniqueId})`}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="0.6"
      />

      {/* 6. Panoramic Glass Canopy (Cabin) */}
      <path
        d="M 19 33 Q 32 30 45 33 C 49 34 50 38 49 46 L 47 75 C 47 82 45 85 41 86 Q 32 87 23 86 C 19 85 17 82 17 75 L 15 46 C 14 38 15 34 19 33 Z"
        fill={`url(#glass_${uniqueId})`}
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="0.7"
      />

      {/* Windshield Wiper Hints & Glare */}
      <line
        x1="21"
        y1="36"
        x2="31"
        y2="39"
        stroke="rgba(255, 255, 255, 0.35)"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <line
        x1="33"
        y1="38"
        x2="43"
        y2="36"
        stroke="rgba(255, 255, 255, 0.35)"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <path d="M 19 34 Q 32 31 45 34 L 43 45 Q 32 41 21 45 Z" fill={`url(#glare_${uniqueId})`} />

      {/* Roof Pillars (A/B/C) & Sunroof Seam */}
      <line x1="16" y1="52" x2="48" y2="52" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.6" />
      <line x1="17" y1="68" x2="47" y2="68" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.6" />

      {/* 7. Front Jewel-Eye LED Headlights */}
      <path d="M 12 11 Q 17 10 20 12 L 19 14 Q 15 13 13 14 Z" fill="#fef08a" />
      <path d="M 52 11 Q 47 10 44 12 L 45 14 Q 49 13 51 14 Z" fill="#fef08a" />

      {/* 8. Rear Tail Light Continuous Ribbon */}
      <path d="M 12 104 Q 32 106 52 104" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13" cy="104" r="1.2" fill="#f87171" />
      <circle cx="51" cy="104" r="1.2" fill="#f87171" />

      {/* 9. Miniature Saudi License Plate Badge (Embedded at rear bumper) */}
      <g transform="translate(19, 97)">
        {/* Plate Frame */}
        <rect
          x="0"
          y="0"
          width="26"
          height="8.5"
          rx="1.8"
          fill="#ffffff"
          stroke="#1e293b"
          strokeWidth="0.6"
        />
        {/* Official Saudi Emblem Green Box */}
        <rect x="0.6" y="0.6" width="4.5" height="7.3" rx="1" fill="#047857" />
        {/* Palm & Sword Emblem Hint */}
        <circle cx="2.8" cy="3.5" r="1" fill="#ffffff" />
        <line x1="2.2" y1="5.5" x2="3.4" y2="5.5" stroke="#ffffff" strokeWidth="0.4" />
        {/* Arabic Letters & Digits */}
        <text
          x="10.5"
          y="6.2"
          fill="#09090b"
          fontSize="4.2"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.4"
        >
          {plateLetters.slice(0, 5)}
        </text>
        <text
          x="20.5"
          y="6.2"
          fill="#09090b"
          fontSize="4"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
        >
          {plateDigits.slice(-4)}
        </text>
      </g>
    </svg>
  );
};
