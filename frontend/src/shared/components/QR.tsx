import { FC, useMemo } from 'react';

export interface QRProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  title?: string;
  testId?: string;
}

export const QR: FC<QRProps> = ({
  value,
  size = 180,
  fgColor = '#116E63',
  bgColor = '#ffffff',
  title = 'FBSU Digital Pass QR',
  testId = 'fbsu-qr',
}) => {
  // Deterministic pattern generator based on input string
  const dots = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    const grid = [];
    const gridSize = 15;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Skip finder pattern zones (top-left, top-right, bottom-left: 5x5 areas)
        const inTopLeft = row < 5 && col < 5;
        const inTopRight = row < 5 && col >= gridSize - 5;
        const inBottomLeft = row >= gridSize - 5 && col < 5;

        if (inTopLeft || inTopRight || inBottomLeft) continue;

        // Pseudo-random pseudo-deterministic bit
        const bit = Math.abs(Math.sin(hash + row * 19 + col * 31)) > 0.45;
        if (bit) {
          grid.push({
            x: 20 + col * 10.6,
            y: 20 + row * 10.6,
            isGold: (row + col) % 7 === 0,
          });
        }
      }
    }
    return grid;
  }, [value]);

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: bgColor,
        padding: '12px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      }}
      data-testid={testId}
      aria-label={title}
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="200" height="200" fill={bgColor} rx="8" />

        {/* Top-Left Finder */}
        <rect x="15" y="15" width="48" height="48" rx="8" fill={fgColor} />
        <rect x="23" y="23" width="32" height="32" rx="4" fill={bgColor} />
        <rect x="30" y="30" width="18" height="18" rx="2" fill={fgColor} />

        {/* Top-Right Finder */}
        <rect x="137" y="15" width="48" height="48" rx="8" fill={fgColor} />
        <rect x="145" y="23" width="32" height="32" rx="4" fill={bgColor} />
        <rect x="152" y="30" width="18" height="18" rx="2" fill={fgColor} />

        {/* Bottom-Left Finder */}
        <rect x="15" y="137" width="48" height="48" rx="8" fill={fgColor} />
        <rect x="23" y="145" width="32" height="32" rx="4" fill={bgColor} />
        <rect x="30" y="152" width="18" height="18" rx="2" fill={fgColor} />

        {/* Data Dots */}
        {dots.map((dot, idx) => (
          <circle key={idx} cx={dot.x} cy={dot.y} r={3.8} fill={dot.isGold ? '#d7a237' : fgColor} />
        ))}

        {/* Center alignment marker */}
        <rect x="94" y="94" width="12" height="12" rx="2" fill="#d7a237" />
      </svg>
    </div>
  );
};
