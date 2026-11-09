import { FC } from 'react';
import { RefreshCw, Zap, ShieldCheck, UserCheck, Clock, Star, Car } from 'lucide-react';
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

/**
 * SpotCard — Deluxe Parking Card adhering to the unified CampusFlow Card Design System.
 * Inspired by modern luxury card anatomy:
 * - Brand eyebrow & bold vehicle model name
 * - Live status & bay indicator badges
 * - Spacious visual center with grounded realistic vehicle and asphalt demarcation
 * - Relaxed, minimal metadata strip (Color — Year, Plate, Driver/Duration)
 * - Full-width rounded bottom action button (Reserve / Details / AI Flex)
 */
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
      {/* 1. Header Strip: Brand/Zone Eyebrow + Bay Badge + Live Status */}
      <div className="card-top-strip">
        <div className="card-brand-meta">
          <span className="card-brand-label">
            {isOccupied
              ? carTheme.brand
              : isAr
                ? `${spot.zone} - ${spot.college}`
                : `${spot.zone} - ${spot.collegeEn}`}
          </span>
          <h4
            className="card-model-title"
            title={
              isOccupied
                ? carTheme.model
                : isAr
                  ? `موقف شاغر #${String(spot.id).padStart(2, '0')}`
                  : `Available Bay #${String(spot.id).padStart(2, '0')}`
            }
          >
            {isOccupied
              ? carTheme.model
              : isAr
                ? `موقف شاغر #${String(spot.id).padStart(2, '0')}`
                : `Available Bay #${String(spot.id).padStart(2, '0')}`}
          </h4>
        </div>

        <div className="card-badges-stack">
          <div className="bay-indicator-chip">
            <span className="bay-num-text">#{String(spot.id).padStart(2, '0')}</span>
            <div
              className="iot-ceiling-sensor-mini"
              title={`IoT Sensor: ${badgeText}`}
              style={{
                boxShadow: `0 0 8px ${sensorGlowColor}`,
                borderColor: sensorGlowColor,
              }}
            >
              <span className="sensor-core" style={{ background: sensorGlowColor }} />
            </div>
          </div>
          <span
            className="card-status-pill"
            style={{
              borderColor: statusColor,
              color: statusColor,
              background: `rgba(${statusClass === 'available' ? '16, 185, 129' : statusClass === 'flex-share' ? '245, 158, 11' : statusClass === 'faculty-spot' ? '139, 92, 246' : '239, 68, 68'}, 0.12)`,
            }}
          >
            {isCurrentUserSpot ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Star size={9} fill="#3b82f6" color="#3b82f6" />
                <span>{isAr ? 'محجوز لك' : 'Your Spot'}</span>
              </span>
            ) : (
              badgeText
            )}
          </span>
        </div>
      </div>

      {/* 2. Visual Center: Spacious realistic vehicle render with asphalt ground shadow */}
      <div className="spot-visual-center">
        {isOccupied ? (
          <div className="realistic-parked-car-wrapper">
            <div className="stall-line-left" />
            <div className="stall-line-right" />

            <CarSvg
              color={carTheme.color}
              gradientStart={carTheme.gradientStart}
              gradientMid={carTheme.gradientMid}
              gradientEnd={carTheme.gradientEnd}
              type={carTheme.type}
              plate={spot.plate || carTheme.plateLabel}
              style={{ width: '64px', height: '104px' }}
            />

            <div className="car-model-pill" title={spot.car || carTheme.modelLabel}>
              <Car size={11} />
              <span>{spot.car || carTheme.modelLabel}</span>
            </div>
          </div>
        ) : isFlex ? (
          <div className="realistic-flex-wrapper">
            <div className="stall-line-left" />
            <div className="stall-line-right" />

            <div style={{ opacity: 0.92, position: 'relative' }}>
              <CarSvg
                color={carTheme.color}
                gradientStart={carTheme.gradientStart}
                gradientMid={carTheme.gradientMid}
                gradientEnd={carTheme.gradientEnd}
                type={carTheme.type}
                plate={spot.plate || carTheme.plateLabel}
                style={{ width: '64px', height: '104px' }}
              />
              <div className="flex-pulse-overlay">
                <RefreshCw size={26} color="var(--fbsu-gold)" className="animate-spin-slow" />
              </div>
            </div>

            <div className="flex-model-pill">
              <RefreshCw size={10} color="var(--fbsu-gold)" />
              <span>{isAr ? 'في بريك (متاح للتبادل)' : 'On Break (Flex Swappable)'}</span>
            </div>
          </div>
        ) : (
          <div className="empty-parking-bay-stencil">
            <div className="stall-line-left" />
            <div className="stall-line-right" />

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

            <div className="bay-reserve-btn-pill">
              <span>{isAr ? '+ احجز الآن' : '+ Book Spot'}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Minimal Metadata Strip: Relaxed spacing ("معلومات قليلة، ومساحات مريحة") */}
      <div className="card-minimal-meta">
        {isOccupied ? (
          <>
            <div className="meta-spec-row">
              <span className="meta-color-year">
                {isAr
                  ? `${carTheme.colorNameAr} — ${carTheme.year}`
                  : `${carTheme.colorNameEn} — ${carTheme.year}`}
              </span>
              {spot.plate && <span className="meta-plate-code">{spot.plate}</span>}
            </div>
            <div className="meta-driver-row">
              {spot.occupant ? (
                <div className="meta-occupant-wrap">
                  <UserCheck size={11} color="var(--text-dim)" />
                  <span className="driver-name">{spot.occupant}</span>
                </div>
              ) : (
                <span className="driver-name">{subInfo}</span>
              )}
              {spot.timeLeft && (
                <span className="time-remaining-chip">
                  <Clock size={10} />
                  <span>{spot.timeLeft}</span>
                </span>
              )}
            </div>
          </>
        ) : isFlex ? (
          <>
            <div className="meta-spec-row">
              <span className="meta-color-year">
                {isAr ? 'متاح للتبادل خلال البريك' : 'Break Swap Available'}
              </span>
              <span className="meta-plate-code">{spot.plate || carTheme.plateLabel}</span>
            </div>
            <div className="meta-driver-row">
              <div className="meta-occupant-wrap">
                <UserCheck size={11} color="var(--text-dim)" />
                <span className="driver-name">
                  {spot.occupant || (isAr ? 'طالب في بريك' : 'Student on break')}
                </span>
              </div>
              <span className="reward-chip">{isAr ? '+5.75 ر.س' : '+5.75 SAR'}</span>
            </div>
          </>
        ) : (
          <>
            <div className="meta-spec-row">
              <span className="meta-color-year">
                {isAr ? 'موقف شاغر • حجز فوري' : 'Vacant • Instant Booking'}
              </span>
              <span className="meta-rate-chip">{isAr ? '5.75 ر.س / س' : '5.75 SAR/h'}</span>
            </div>
            <div className="meta-driver-row">
              <span className="access-info-text">
                {isAr ? 'دخول سلس وفوري عبر ALPR' : 'Instant access via ALPR Gate'}
              </span>
              <span className="vacant-ready-tag">{isAr ? 'جاهز للاستخدام' : 'Ready'}</span>
            </div>
          </>
        )}
      </div>

      {/* 4. Full-Width Rounded Action Button (matching the user's reference slide) */}
      <div className="card-cta-row">
        {!isOccupied && !isFlex ? (
          <button type="button" className="btn-gold card-action-btn">
            <span>{isAr ? 'احجز الموقف الآن' : 'Reserve Spot'}</span>
          </button>
        ) : isFlex ? (
          <button type="button" className="btn-gold card-action-btn">
            <RefreshCw size={12} className="spin-slow" />
            <span>{isAr ? 'تبادل ذكي (AI Flex)' : 'Swap Spot'}</span>
          </button>
        ) : isCurrentUserSpot ? (
          <button
            type="button"
            className="btn-primary card-action-btn"
            style={{ background: '#2563eb', borderColor: '#3b82f6' }}
          >
            <span>{isAr ? 'تصريحك الرقمي' : 'Digital Pass'}</span>
          </button>
        ) : (
          <button type="button" className="btn-glass card-action-btn">
            <span>{isAr ? 'عرض تفاصيل الموقف' : 'View Bay Details'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
