import { FC } from 'react';

export interface CarSvgProps {
  color?: string;
  className?: string;
}

export const CarSvg: FC<CarSvgProps> = ({ color = '#116E63', className = 'car-svg-icon' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', margin: '0 auto', maxHeight: '100%' }}
    >
      <ellipse cx="50" cy="85" rx="42" ry="70" fill="rgba(0,0,0,0.4)" filter="blur(6px)" />
      <rect x="18" y="10" width="64" height="135" rx="24" fill={color} stroke="#ffffff" strokeWidth="2" />
      <path
        d="M 26 52 Q 50 42 74 52 L 70 76 Q 50 72 30 76 Z"
        fill="#0c1f1c"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />
      <path
        d="M 28 114 Q 50 118 72 114 L 68 98 Q 50 101 32 98 Z"
        fill="#0c1f1c"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />
      <rect x="12" y="55" width="7" height="15" rx="3" fill={color} stroke="#ffffff" strokeWidth="1" />
      <rect x="81" y="55" width="7" height="15" rx="3" fill={color} stroke="#ffffff" strokeWidth="1" />
      <rect x="23" y="14" width="14" height="8" rx="3" fill="#fef08a" opacity="0.9" />
      <rect x="63" y="14" width="14" height="8" rx="3" fill="#fef08a" opacity="0.9" />
      <rect x="23" y="136" width="14" height="6" rx="2" fill="#ef4444" />
      <rect x="63" y="136" width="14" height="6" rx="2" fill="#ef4444" />
      <rect x="33" y="138" width="34" height="7" rx="1.5" fill="#ffffff" />
    </svg>
  );
};
