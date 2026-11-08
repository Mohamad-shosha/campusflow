import { FC } from 'react';
import { RefreshCw, Zap, ShieldCheck, UserCheck, Clock, Car } from 'lucide-react';
import type { ParkingSpot } from '../data/parkingData';
import { CarSvg } from './CarSvg';
import { getCarVisualTheme } from '../utils/carTheme';
import { soundFX } from '../../../shared/utils/sound';

export interface SpotCardProps {
  spot: ParkingSpot;
  isAr: boolean;
  isCurrentUserSpot?: boolean;
  onClick: (spot: ParkingSpot) => void;
}

export const SpotCard: FC<SpotCardProps> = ({ spot, isAr, isCurrentUserSpot = false, onClick }) => {
  const isOccupied =
    spot.status === 'occupied' ||
    spot.status === 'reserved' ||
    spot.status === 'faculty' ||
    spot.status === 'faculty-spot';

  const isFlex = spot.status === 'flex' || spot.status === 'flex-share';

  let statusClass = 'available';
  let badgeText = isAr ? 'متاح الآن' : 'Available';
  let statusColor = 'var(--status-available)';
  let subInfo = isAr ? 'احجز الآن' : 'Reserve now';
  let sensorGlowColor = '#10b981';

  if (spot.status === 'occupied') {
    statusClass = 'occupied';
    badgeText = isAr ? 'مشغول' : 'Occupied';
    statusColor = 'var(--status-occupied)';
    subInfo = spot.timeLeft || (isAr ? 'حتى نهاية المحاضرة' : 'Until class end');
    sensorGlowColor = '#ef4444';
  } else if (spot.status === 'reserved') {
    statusClass = 'occupied';
    badgeText = isAr ? 'محجوز' : 'Reserved';
    statusColor = 'var(--status-occupied)';
    subInfo = spot.timeLeft || (isAr ? 'محجوز مسبقاً' : 'Reserved');
    sensorGlowColor = '#ef4444';
  } else if (isFlex) {
    statusClass = 'flex-share';
    badgeText = isAr ? 'تبادل ذكي' : 'AI Flex Share';
    statusColor = 'var(--fbsu-gold)';
    subInfo = isAr ? 'متاح خلال البريك' : 'Available during break';
    sensorGlowColor = '#f59e0b';
  } else if (spot.status === 'faculty' || spot.status === 'faculty-spot') {
    statusClass = 'faculty-spot';
    badgeText = isAr ? 'دكاترة' : 'Faculty';
    statusColor = 'var(--status-faculty)';
    subInfo = isAr ? 'مخصص للكادر' : 'Faculty Only';
    sensorGlowColor = '#8b5cf6';
  }

  if (isCurrentUserSpot) {
    statusClass += ' reserved-user';
  }

  const carTheme = getCarVisualTheme(spot);

  let visualCenter;
  if (isOccupied) {
    visualCenter = (
      <div className="realistic-parked-car-wrapper">
        <CarSvg
          color={carTheme.color}
          gradientStart={carTheme.gradientStart}
          gradientMid={carTheme.gradientMid}
          gradientEnd={carTheme.gradientEnd}
          type={carTheme.type}
          plate={spot.plate || carTheme.plateLabel}
        />
        {/* Car Model Floating Pill */}
        <div className="car-model-pill">
          <Car size={11} />
          <span>{spot.car || carTheme.modelLabel}</span>
        </div>
      </div>
    );
  } else if (isFlex) {
    visualCenter = (
      <div className="realistic-flex-wrapper">
        {spot.car ? (
          <div style={{ opacity: 0.85, position: 'relative' }}>
            <CarSvg
              color={carTheme.color}
              gradientStart={carTheme.gradientStart}
              gradientMid={carTheme.gradientMid}
              gradientEnd={carTheme.gradientEnd}
              type={carTheme.type}
              plate={spot.plate || carTheme.plateLabel}
            />
            <div className="flex-pulse-overlay">
              <RefreshCw size={24} color="var(--fbsu-gold)" className="animate-spin-slow" />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '0.6rem 0' }}>
            <RefreshCw size={32} color="var(--fbsu-gold)" className="animate-spin-slow" />
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--fbsu-gold)',
                fontWeight: 800,
                display: 'block',
                marginTop: '0.35rem',
              }}
            >
              AI FLEX SHARE
            </span>
          </div>
        )}
      </div>
    );
  } else {
    // Empty Authentic Parking Bay
    visualCenter = (
      <div className="empty-parking-bay-stencil">
        {/* Road Surface Demarcation */}
        <div className="bay-pavement-marking">
          {spot.zone === 'D' || spot.isEV ? (
            <div className="ev-stencil-icon">
              <Zap size={22} color="var(--fbsu-primary)" />
              <span className="ev-stencil-text">EV CHARGE</span>
            </div>
          ) : spot.isAccessible ? (
            <div className="accessible-stencil-icon">
              <span style={{ fontSize: '1.25rem' }}>♿</span>
            </div>
          ) : spot.isFaculty ? (
            <div className="faculty-stencil-icon">
              <ShieldCheck size={22} color="var(--status-faculty)" />
              <span className="faculty-stencil-text">STAFF</span>
            </div>
          ) : (
            <div className="standard-p-stencil">
              <span className="p-letter">P</span>
              <span className="bay-stencil-num">#{String(spot.id).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* Action Prompt Pill */}
        <div className="bay-reserve-btn-pill">
          <span>{isAr ? '+ احجز الآن' : '+ Book Spot'}</span>
        </div>
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
      {/* 1. Parking Stall Top Meta & IoT Sensor */}
      <div className="spot-top-meta">
        <span className="spot-number">#{String(spot.id).padStart(2, '0')}</span>

        {/* Ultrasonic IoT Ceiling Sensor Dot */}
        <div
          className="iot-ceiling-sensor"
          title={`IoT Smart Sensor: ${badgeText}`}
          style={{
            boxShadow: `0 0 10px ${sensorGlowColor}`,
            borderColor: sensorGlowColor,
          }}
        >
          <span className="sensor-core" style={{ background: sensorGlowColor }} />
        </div>

        <span className="spot-zone-badge">
          {spot.zone} - {isAr ? spot.college : spot.collegeEn}
        </span>
      </div>

      {/* 2. Wheel Stopper Bar (Concrete/Rubber curb at top of parking bay) */}
      <div className="parking-bay-wheel-stop" />

      {/* 3. Center Bay: Realistic Parked Vehicle or Empty Asphalt Stencil */}
      <div className="spot-visual-center">{visualCenter}</div>

      {/* 4. Bottom Status & Driver / Time Metadata */}
      <div className="spot-bottom-status">
        <div className="status-primary-row">
          <span className="status-text" style={{ color: statusColor }}>
            {badgeText}
          </span>
          {spot.timeLeft && (
            <span className="time-remaining-badge">
              <Clock size={10} />
              <span>{spot.timeLeft}</span>
            </span>
          )}
        </div>

        <div className="status-sub-row">
          {spot.occupant ? (
            <div className="occupant-info-line">
              <UserCheck size={11} color="var(--text-dim)" />
              <span className="occupant-name">{spot.occupant}</span>
            </div>
          ) : (
            <span className="status-sub-info">{subInfo}</span>
          )}
        </div>
      </div>
    </div>
  );
};
