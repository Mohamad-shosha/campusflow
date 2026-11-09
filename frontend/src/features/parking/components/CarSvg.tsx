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
 * CarSvg — Authentic top-down 2D vehicle visualization matching the reference design.
 * Features:
 * - Crisp pure-white outer border (#ffffff) enveloping the body and side mirrors seamlessly.
 * - Symmetrical aerodynamic chassis with curved front hood and rear corners.
 * - Integrated rounded side mirrors protruding left and right with matching white outline.
 * - Warm pale-yellow headlights (#dbd87f / #fde047) at the front corners.
 * - Deep-tinted front & rear curved windshields (#081014) with subtle glare outline.
 * - Vivid red taillights (#e44141) at the rear corners.
 * - Centered white bumper/plate bar (#ffffff) flanked by the red taillights.
 * - Soft ambient ground shadow for realistic elevation above the asphalt.
 */
export const CarSvg: FC<CarSvgProps> = ({
  color = '#10695e',
  type = 'sedan',
  plate,
  className = 'car-svg-icon',
  style,
  headlightsOn = false,
}) => {
  const uniqueId = useId().replace(/:/g, '_');

  // Mini plate digits extraction
  const cleanPlate = (plate || '').trim();
  const plateDigits = cleanPlate ? cleanPlate.split(/\s+/).pop() || '' : '';

  // Windshield outline contrast based on paint tone
  const isDarkColor =
    color.toLowerCase() === '#18181b' ||
    color.toLowerCase() === '#09090b' ||
    color.toLowerCase() === '#10695e' ||
    color.toLowerCase() === '#1e3a8a' ||
    color.toLowerCase() === '#334155';
  const windshieldStroke = isDarkColor ? 'rgba(255, 255, 255, 0.42)' : 'rgba(0, 0, 0, 0.38)';

  // SUV slight width & roof rack adjustments
  const isSuv = type === 'suv';
  const isEv = type === 'ev';

  return (
    <svg
      className={`${className} car-svg-graphic`}
      viewBox="0 0 108 134"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '52px',
        height: '84px',
        display: 'block',
        margin: '0 auto',
        filter: 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.55))',
        transition: 'transform 0.25s ease, filter 0.25s ease',
        ...style,
      }}
      aria-label={type}
    >
      <defs>
        {/* Soft Ambient Ground Shadow */}
        <radialGradient id={`shadow_${uniqueId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0.65)" />
          <stop offset="70%" stopColor="rgba(0, 0, 0, 0.25)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
        </radialGradient>

        {/* Soft Headlight Light Beam Projection (Active on hover or flag) */}
        <linearGradient id={`beam_${uniqueId}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(254, 240, 138, 0.55)" />
          <stop offset="60%" stopColor="rgba(254, 240, 138, 0.18)" />
          <stop offset="100%" stopColor="rgba(254, 240, 138, 0)" />
        </linearGradient>

        {/* Windshield Glass Deep Tint */}
        <linearGradient id={`glass_${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#081014" />
          <stop offset="60%" stopColor="#0f1c24" />
          <stop offset="100%" stopColor="#081014" />
        </linearGradient>
      </defs>

      {/* 0. Soft Ambient Headlight Beam Projection on hover */}
      <g className={`car-headlight-beams ${headlightsOn ? 'always-on' : ''}`}>
        <polygon points="32,15 18,0 42,0 41,15" fill={`url(#beam_${uniqueId})`} />
        <polygon points="67,15 66,0 90,0 76,15" fill={`url(#beam_${uniqueId})`} />
      </g>

      {/* 1. Ground Shadow (Tightly nestled under the vehicle silhouette) */}
      <ellipse cx="54" cy="68" rx="34" ry="56" fill={`url(#shadow_${uniqueId})`} />

      {/* 2. Main Car Body & Mirrors Silhouette (Continuous White Outline) */}
      {isSuv ? (
        // SUV / 4x4 Silhouette (Slightly broader stance with same iconic outline)
        <path
          d="M 54 10
             C 65 10 75 12 80 18
             C 83 21 83 24 83 28
             L 83 48
             C 83 48 87.5 48.5 88 52
             L 88 58
             C 87.5 61.5 83 62 83 62
             L 83 108
             C 83 115 80 120 74 122
             C 67 124 59 125 54 125
             C 49 125 41 124 34 122
             C 28 120 25 115 25 108
             L 25 62
             C 25 62 20.5 61.5 20 58
             L 20 52
             C 20.5 48.5 25 48 25 48
             L 25 28
             C 25 24 25 21 28 18
             C 33 12 43 10 54 10 Z"
          fill={color}
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      ) : (
        // Standard / Luxury / Sedan Silhouette (Exact match to reference image)
        <path
          d="M 54 11
             C 64 11 74 13 79 19
             C 81 21 81 24 81 28
             L 81 48
             C 81 48 85.5 48.5 86 52
             L 86 58
             C 85.5 61.5 81 62 81 62
             L 81 107
             C 81 114 78 119 72 121
             C 66 123 58 124 54 124
             C 50 124 42 123 36 121
             C 30 119 27 114 27 107
             L 27 62
             C 27 62 22.5 61.5 22 58
             L 22 52
             C 22.5 48.5 27 48 27 48
             L 27 28
             C 27 24 27 21 29 19
             C 34 13 44 11 54 11 Z"
          fill={color}
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      )}

      {/* SUV Roof Rack Rail Details */}
      {isSuv && (
        <g stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.2" strokeLinecap="round">
          <line x1="32" y1="50" x2="32" y2="102" />
          <line x1="76" y1="50" x2="76" y2="102" />
        </g>
      )}

      {/* EV Futuristic Front Light Strip */}
      {isEv && (
        <line
          x1="42"
          y1="13.5"
          x2="66"
          y2="13.5"
          stroke="#38bdf8"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.9"
        />
      )}

      {/* 3. Front Headlights (Warm Pale-Yellow rounded corner blocks) */}
      <path
        d="M 31 15 C 35 13 41 14 42 16 L 41 21 C 36 21 32 19 30 17 Z"
        fill="#dbd87f"
      />
      <path
        d="M 77 15 C 73 13 67 14 66 16 L 67 21 C 72 21 76 19 78 17 Z"
        fill="#dbd87f"
      />

      {/* 4. Front Windshield (Deep Tinted curved trapezoid with subtle outline) */}
      <path
        d="M 36 47 C 42 42 66 42 72 47 L 70 61 C 64 60 44 60 38 61 Z"
        fill={`url(#glass_${uniqueId})`}
        stroke={windshieldStroke}
        strokeWidth="1.15"
        strokeLinejoin="round"
      />

      {/* 5. Rear Windshield (Deep Tinted curved trapezoid with subtle outline) */}
      <path
        d="M 39 86 C 44 85 64 85 69 86 L 70 96 C 64 95 44 95 38 96 Z"
        fill={`url(#glass_${uniqueId})`}
        stroke={windshieldStroke}
        strokeWidth="1.15"
        strokeLinejoin="round"
      />

      {/* 6. Rear Taillights (Vivid Red rounded rectangular blocks at corners) */}
      <rect x="31" y="113" width="9.5" height="5.5" rx="1.8" fill="#e44141" />
      <rect x="67.5" y="113" width="9.5" height="5.5" rx="1.8" fill="#e44141" />

      {/* 7. Center White Bumper / License Plate Bar */}
      <rect
        x="41.5"
        y="115"
        width="25"
        height="6.5"
        rx="2"
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth="0.5"
      />

      {/* Optional Saudi Green micro-badge inside white bar */}
      <rect x="42.2" y="115.8" width="3.2" height="4.9" rx="0.8" fill="#047857" />
      {plateDigits && (
        <text
          x="55.5"
          y="119.8"
          fill="#09090b"
          fontSize="3.6"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.3"
        >
          {plateDigits.slice(-4)}
        </text>
      )}
    </svg>
  );
};
