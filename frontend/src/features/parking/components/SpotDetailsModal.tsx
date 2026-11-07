import { type FC } from 'react';
import { X, Zap, AlertCircle, Loader2 } from 'lucide-react';
import type { ParkingSpot } from '../data/parkingData';

export interface SpotDetailsModalProps {
  isOpen: boolean;
  spot: ParkingSpot | null;
  isAr: boolean;
  onClose: () => void;
  onBook: (spot: ParkingSpot) => void;
  isBooking?: boolean | undefined;
  bookingError?: string | null | undefined;
}

export const SpotDetailsModal: FC<SpotDetailsModalProps> = ({
  isOpen,
  spot,
  isAr,
  onClose,
  onBook,
  isBooking = false,
  bookingError = null,
}) => {
  if (!isOpen || !spot) return null;

  const isAvailable = spot.status === 'available';
  const isFlex = spot.status === 'flex' || spot.status === 'flex-share';

  return (
    <div
      className="modal-overlay open"
      id="spot-modal-backdrop"
      onClick={e => {
        if ((e.target as HTMLElement).id === 'spot-modal-backdrop') onClose();
      }}
      data-testid="spot-details-modal"
    >
      <div className="modal-content-box" style={{ maxWidth: '540px' }}>
        <button className="modal-close-btn" onClick={onClose} type="button" aria-label="Close">
          <X size={16} />
        </button>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <span className="badge badge-gold">
              {isAr
                ? `قطاع ${spot.zone} - ${spot.college}`
                : `Zone ${spot.zone} - ${spot.collegeEn}`}
            </span>
            <h3
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                marginTop: '0.35rem',
              }}
            >
              {isAr
                ? `موقف رقم #${String(spot.id).padStart(2, '0')}`
                : `Bay #${String(spot.id).padStart(2, '0')}`}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isAr
                ? `المسافة حتى مدخل الكلية: ${spot.distance}`
                : `Distance to campus entrance: ${spot.distance}`}
            </span>
          </div>

          <span
            className={`badge ${
              isAvailable ? 'badge-available' : isFlex ? 'badge-flex' : 'badge-occupied'
            }`}
          >
            {isAvailable
              ? isAr
                ? 'متاح الآن'
                : 'Available'
              : isFlex
                ? isAr
                  ? 'تبادل ذكي نشط'
                  : 'AI Flex Active'
                : isAr
                  ? 'مشغول'
                  : 'Occupied'}
          </span>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              fontSize: '0.9rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>
                {isAr ? 'الحالة الحالية:' : 'Current Status:'}
              </span>
              <strong style={{ color: 'var(--text-main)' }}>
                {spot.occupant || (isAr ? 'شاغر وجاهز للاستخدام' : 'Vacant & Ready')}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>
                {isAr ? 'المستشعر الذكي IoT:' : 'IoT Bay Sensor:'}
              </span>
              <strong style={{ color: 'var(--status-available)' }}>
                {isAr ? 'متصل (إشارة ممتازة)' : 'Connected (Optimal)'}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>
                {isAr ? 'المركبة الحالية:' : 'Current Vehicle:'}
              </span>
              <strong style={{ color: 'var(--text-main)' }}>
                {spot.car || (isAr ? 'لا يوجد' : 'None')}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>
                {isAr ? 'الوقت المتبقي:' : 'Time Left:'}
              </span>
              <strong style={{ color: 'var(--fbsu-gold)' }}>
                {spot.timeLeft || (isAr ? 'متاح فوري' : 'Instant Availability')}
              </strong>
            </div>
          </div>
        </div>

        {bookingError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
            data-testid="spot-modal-booking-error"
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{bookingError}</span>
          </div>
        )}

        {isAvailable || isFlex ? (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn-gold"
              style={{ flex: 1, justifyContent: 'center', opacity: isBooking ? 0.7 : 1 }}
              onClick={() => onBook(spot)}
              disabled={isBooking}
              type="button"
              data-testid="modal-book-spot-btn"
            >
              {isBooking ? (
                <>
                  <Loader2 size={16} className="spin-anim" />
                  <span>{isAr ? 'جاري الحجز وخصم الرسوم...' : 'Booking & Debiting Wallet...'}</span>
                </>
              ) : (
                <>
                  <Zap size={16} color="#0b1a17" />
                  <span>
                    {isAr
                      ? `احجز هذا الموقف الآن (3 ساعات - 17.25 ر.س من المحفظة)`
                      : `Book This Bay Now (3 hrs - 17.25 SAR from Wallet)`}
                  </span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '0.5rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            {isAr
              ? 'هذا الموقف مشغول حالياً وسيتاح تلقائياً فور مغادرة صاحبه أو في وقت البريك القادم.'
              : 'This bay is currently occupied and will dynamically unlock when the occupant departs.'}
          </div>
        )}
      </div>
    </div>
  );
};
