import { useState, FC } from 'react';
import { X, DoorClosed, Calendar } from 'lucide-react';
import type { StudyRoom } from '../data/campusData';
import { soundFX } from '../../../shared/utils/sound';

export interface BookRoomModalProps {
  isOpen: boolean;
  room: StudyRoom | null;
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
  };
  onClose: () => void;
  onConfirm: (roomId: string, timeFrom: string, timeTo: string, purpose: string) => void;
}

export const BookRoomModal: FC<BookRoomModalProps> = ({
  isOpen,
  room,
  isAr,
  currentUser,
  onClose,
  onConfirm,
}) => {
  const [timeFrom, setTimeFrom] = useState<string>('09:00');
  const [timeTo, setTimeTo] = useState<string>('09:20');
  const [purpose, setPurpose] = useState<string>('جلسة عمل جماعي لإنجاز تكليف البرمجة');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen || !room) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playSuccess();
    setIsSuccess(true);
    setTimeout(() => {
      onConfirm(room.id, timeFrom, timeTo, purpose);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="modal-overlay open"
      id="room-book-backdrop"
      onClick={e => {
        if ((e.target as HTMLElement).id === 'room-book-backdrop') onClose();
      }}
      data-testid="book-room-modal"
    >
      <div className="modal-content-box" style={{ maxWidth: '540px' }}>
        <button className="modal-close-btn" onClick={onClose} type="button" aria-label="Close">
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--fbsu-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DoorClosed size={24} color="var(--fbsu-primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {isAr ? 'حجز قاعة أو معمل للعمل الجماعي' : 'Reserve Lab / Study Pod'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {room.name} ({room.building})
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1rem',
              fontSize: '0.88rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'السعة والتجهيزات:' : 'Capacity:'}</span>
              <strong style={{ color: 'var(--text-main)' }}>{room.capacity}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'قائد المجموعة:' : 'Team Lead:'}</span>
              <strong style={{ color: 'var(--fbsu-primary)' }}>
                {currentUser.name} ({currentUser.id})
              </strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{isAr ? 'وقت الدخول:' : 'Start Time:'}</label>
              <input
                type="time"
                className="form-control"
                value={timeFrom}
                onChange={e => setTimeFrom(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{isAr ? 'موعد الخروج الإلزامي:' : 'Exit Time:'}</label>
              <input
                type="time"
                className="form-control"
                value={timeTo}
                onChange={e => setTimeTo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{isAr ? 'الهدف من الحجز وأسماء أعضاء الفريق:' : 'Purpose & Team:'}</label>
            <textarea
              className="form-control"
              rows={2}
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              required
            />
          </div>

          {isSuccess ? (
            <div
              style={{
                padding: '1rem',
                background: 'rgba(56,194,176,0.1)',
                border: '1px solid var(--status-available)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                color: 'var(--status-available)',
                fontWeight: 800,
              }}
            >
              ✓ {isAr ? 'تم تأكيد حجز القاعة وبدء المؤقت التنازلي!' : 'Reservation active with countdown!'}
            </div>
          ) : (
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.95rem' }}
              type="submit"
            >
              <Calendar size={16} color="#ffffff" />
              <span>{isAr ? 'تأكيد الحجز وتفعيل العداد التنازلي' : 'Confirm & Start Timer'}</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
