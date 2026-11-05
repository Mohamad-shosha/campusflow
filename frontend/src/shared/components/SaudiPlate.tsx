import { FC } from 'react';

export interface SaudiPlateProps {
  lettersAr: string;
  lettersEn: string;
  digits: string;
  isPrimary?: boolean;
}

export const SaudiPlate: FC<SaudiPlateProps> = ({
  lettersAr,
  lettersEn,
  digits,
  isPrimary = false,
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#ffffff',
        color: '#000000',
        border: isPrimary ? '2px solid #10b981' : '2px solid #000000',
        borderRadius: '8px',
        padding: '0.4rem 0.85rem',
        minWidth: '150px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        fontFamily: 'Tajawal, sans-serif',
      }}
      data-testid="saudi-plate"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          borderBottom: '1px solid #ccc',
          paddingBottom: '0.2rem',
          fontSize: '1rem',
          fontWeight: 900,
        }}
      >
        <span>{digits}</span>
        <span style={{ letterSpacing: '0.2em' }}>{lettersAr}</span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: '0.2rem',
          fontSize: '0.82rem',
          fontWeight: 700,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        <span>{digits}</span>
        <span style={{ letterSpacing: '0.25em' }}>{lettersEn}</span>
      </div>
    </div>
  );
};
