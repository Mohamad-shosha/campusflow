import { FC } from 'react';
import { RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import type { ParkingSpot } from '../data/parkingData';
import { CarSvg } from './CarSvg';
import { soundFX } from '../../../shared/utils/sound';

export interface SpotCardProps {
  spot: ParkingSpot;
  isAr: boolean;
  isCurrentUserSpot?: boolean;
  onClick: (spot: ParkingSpot) => void;
}

export const SpotCard: FC<SpotCardProps> = ({ spot, isAr, isCurrentUserSpot = false, onClick }) => {
  let statusClass = 'available';
  let badgeText = isAr ? 'متاح الآن' : 'Available';
  let statusColor = 'var(--status-available)';
  let subInfo = isAr ? 'احجز الآن' : 'Reserve now';

  if (spot.status === 'occupied') {
    statusClass = 'occupied';
    badgeText = isAr ? 'مشغول' : 'Occupied';
    statusColor = 'var(--status-occupied)';
    subInfo = spot.timeLeft || (isAr ? 'حتى نهاية المحاضرة' : 'Until class end');
  } else if (spot.status === 'reserved') {
    statusClass = 'occupied';
    badgeText = isAr ? 'محجوز' : 'Reserved';
    statusColor = 'var(--status-occupied)';
    subInfo = spot.timeLeft || (isAr ? 'محجوز مسبقاً' : 'Reserved');
  } else if (spot.status === 'flex' || spot.status === 'flex-share') {
    statusClass = 'flex-share';
    badgeText = isAr ? 'تبادل ذكي' : 'AI Flex Share';
    statusColor = 'var(--fbsu-gold)';
    subInfo = isAr ? 'متاح خلال البريك' : 'Available during break';
  } else if (spot.status === 'faculty' || spot.status === 'faculty-spot') {
    statusClass = 'faculty-spot';
    badgeText = isAr ? 'دكاترة' : 'Faculty';
    statusColor = 'var(--status-faculty)';
    subInfo = isAr ? 'مخصص للكادر' : 'Staff Only';
  }

  if (isCurrentUserSpot) {
    statusClass += ' reserved-user';
  }

  let visualCenter;
  if (
    spot.status === 'occupied' ||
    spot.status === 'reserved' ||
    spot.status === 'faculty' ||
    spot.status === 'faculty-spot'
  ) {
    const carColor =
      spot.id === 1
        ? '#116E63'
        : spot.id === 2
          ? '#0b6d87'
          : spot.status === 'faculty' || spot.status === 'faculty-spot'
            ? '#8b5cf6'
            : '#d97706';
    visualCenter = <CarSvg color={carColor} />;
  } else if (spot.status === 'flex' || spot.status === 'flex-share') {
    visualCenter = (
      <div style={{ textAlign: 'center', padding: '0.6rem 0' }}>
        <RefreshCw size={32} color="var(--fbsu-gold)" className="animate-spin-slow" />
        <span
          style={{
            fontSize: '0.7rem',
            color: 'var(--fbsu-gold)',
            fontWeight: 800,
            display: 'block',
            marginTop: '0.35rem',
          }}
        >
          AI FLEX
        </span>
      </div>
    );
  } else {
    visualCenter = (
      <div
        style={{
          width: '40px',
          height: '68px',
          border: '1.5px dashed var(--border-subtle)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.75rem',
          fontWeight: 800,
        }}
      >
        {spot.zone === 'D' ? (
          <Zap size={18} color="var(--fbsu-primary)" />
        ) : spot.id % 7 === 0 ? (
          <ShieldCheck size={18} />
        ) : (
          'P'
        )}
      </div>
    );
  }

  return (
    <div
      className={`parking-spot-card ${statusClass}`}
      data-testid="spot-card"
      data-spot-id={spot.id}
      onClick={() => {
        soundFX.playClick();
        onClick(spot);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          soundFX.playClick();
          onClick(spot);
        }
      }}
    >
      <div className="spot-top-meta">
        <span className="spot-number">#{String(spot.id).padStart(2, '0')}</span>
        <span className="spot-zone-badge">
          {spot.zone} - {isAr ? spot.college : spot.collegeEn}
        </span>
      </div>

      <div className="spot-visual-center">{visualCenter}</div>

      <div className="spot-bottom-status">
        <span className="status-text" style={{ color: statusColor }}>
          {badgeText}
        </span>
        <span className="status-sub-info">{spot.occupant || subInfo}</span>
      </div>
    </div>
  );
};
