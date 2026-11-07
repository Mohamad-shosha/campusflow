import { useState, type FC, type SyntheticEvent } from 'react';
import { X, DoorClosed, Calendar } from 'lucide-react';
import { useState, useEffect, type FC, type SyntheticEvent } from 'react';
import { X, DoorClosed, Calendar, AlertCircle, LogIn } from 'lucide-react';
import type { StudyRoom } from '../data/campusData';
import { roomsApi, type BookRoomPayload } from '../api/roomsApi';
import { soundFX } from '../../../shared/utils/sound';

export interface BookRoomModalProps {
  isOpen: boolean;
  room: StudyRoom | null;
  isAr: boolean;
  isAuthenticated?: boolean | undefined;
  currentUser: {
    id: string;
    name: string;
  };
  onClose: () => void;
  onConfirm: (roomId: string, timeFrom: string, timeTo: string, purpose: string) => void;
  onOpenAuth?: (() => void) | undefined;
  onConfirm: (
    roomId: string,
    timeFrom: string,
    timeTo: string,
    purpose: string,
    updatedRoom?: StudyRoom
  ) => void;
}

export const BookRoomModal: FC<BookRoomModalProps> = ({
  isOpen,
  room,
  isAr,
  isAuthenticated = false,
  currentUser,
  onClose,
  onOpenAuth = () => {},
  onConfirm,
}) => {
  const [timeFrom, setTimeFrom] = useState<string>('09:00');
  const [timeTo, setTimeTo] = useState<string>('09:20');
  const [purpose, setPurpose] = useState<string>('جلسة عمل جماعي لإنجاز تكليف البرمجة');
  const [teamMembers, setTeamMembers] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && room) {
      setErrorMessage(null);
      setIsSuccess(false);
      setIsSubmitting(false);
      // Pre-fill time with current hour if possible
      const now = new Date();
      const startMinutes = now.getMinutes() < 30 ? '00' : '30';
      const endMinutes = now.getMinutes() < 30 ? '30' : '00';
      const endHour = now.getMinutes() < 30 ? now.getHours() : (now.getHours() + 1) % 24;
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeFrom(`${pad(now.getHours())}:${startMinutes}`);
      setTimeTo(`${pad(endHour)}:${endMinutes}`);
    }
  }, [isOpen, room]);

  if (!isOpen || !room) return null;

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    soundFX.playSuccess();
    setIsSuccess(true);
    setTimeout(() => {
      onConfirm(room.id, timeFrom, timeTo, purpose);
      setIsSuccess(false);
    setErrorMessage(null);

    if (!isAuthenticated) {
      onClose();
    }, 1200);
      onOpenAuth();
      return;
    }

    const trimmedPurpose = purpose.trim();
    if (!trimmedPurpose) {
      setErrorMessage(isAr ? 'يرجى كتابة الهدف من الحجز.' : 'Please enter the booking purpose.');
      return;
    }

    // Build today ISO timestamps with selected time
    const today = new Date();
    const [fromH, fromM] = timeFrom.split(':').map(Number);
    const [toH, toM] = timeTo.split(':').map(Number);

    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), fromH, fromM, 0);
    let endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), toH, toM, 0);
    if (endDate <= startDate) {
      // If end time is earlier or equal, assume crossing midnight or adjust
      endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
    }

    const durationMinutes = (endDate.getTime() - startDate.getTime()) / (60 * 1000);
    if (durationMinutes < 5 || durationMinutes > 180) {
      setErrorMessage(
        isAr
          ? 'مدة الحجز يجب أن تكون بين 5 دقائق و 3 ساعات كحد أقصى.'
          : 'Booking duration must be between 5 minutes and 3 hours.'
      );
      return;
    }

    const parsedTeam = teamMembers
      .split(/[,،\n]/)
      .map(m => m.trim())
      .filter(m => m.length > 0);
    if (parsedTeam.length === 0) {
      parsedTeam.push(currentUser.name);
    }

    setIsSubmitting(true);
    try {
      const payload: BookRoomPayload = {
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        startLabel: timeFrom,
        endLabel: timeTo,
        purpose: trimmedPurpose,
        teamMembers: parsedTeam,
      };

      const updated = await roomsApi.bookRoom(room.id, payload);
      soundFX.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        onConfirm(room.id, timeFrom, timeTo, trimmedPurpose, updated);
        setIsSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 250);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const apiDetail = (err as { response?: { data?: { detail?: string } } })?.response?.data
        ?.detail;
      setErrorMessage(
        apiDetail ||
          (isAr
            ? 'تعذر تأكيد الحجز. قد تكون القاعة محجوزة في هذا التوقيت.'
            : 'Unable to confirm booking. The room may already be reserved during this window.')
      );
    }
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

        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}
        >
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
            <h3
              style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}
            >
              {isAr ? 'حجز قاعة أو معمل للعمل الجماعي' : 'Reserve Lab / Study Pod'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {room.name} ({room.building})
              {isAr ? room.name : room.nameEn || room.name} ({isAr ? room.building : room.buildingEn || room.building})
            </span>
          </div>
        </div>

        {errorMessage && (
          <div
            data-testid="rooms-error-banner"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244,63,94,0.12)',
              border: '1px solid rgba(244,63,94,0.35)',
              color: '#fda4af',
              fontSize: '0.84rem',
              fontWeight: 700,
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

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
            <div
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}
            >
              <span style={{ color: 'var(--text-muted)' }}>
                {isAr ? 'السعة والتجهيزات:' : 'Capacity:'}
              </span>
              <strong style={{ color: 'var(--text-main)' }}>{room.capacity}</strong>
              <strong style={{ color: 'var(--text-main)' }}>
                {isAr ? room.capacity : room.capacityEn || room.capacity}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                {isAr ? 'قائد المجموعة:' : 'Team Lead:'}
              </span>
              <strong style={{ color: 'var(--fbsu-primary)' }}>
                {currentUser.name} ({currentUser.id})
              </strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{isAr ? 'وقت الدخول:' : 'Start Time:'}</label>
              <label className="form-label" htmlFor="room-time-from-input">
                {isAr ? 'وقت الدخول:' : 'Start Time:'}
              </label>
              <input
                id="room-time-from-input"
                type="time"
                className="form-control"
                value={timeFrom}
                onChange={e => setTimeFrom(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{isAr ? 'موعد الخروج الإلزامي:' : 'Exit Time:'}</label>
              <label className="form-label" htmlFor="room-time-to-input">
                {isAr ? 'موعد الخروج الإلزامي:' : 'Exit Time:'}
              </label>
              <input
                id="room-time-to-input"
                type="time"
                className="form-control"
                value={timeTo}
                onChange={e => setTimeTo(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {isAr ? 'الهدف من الحجز وأسماء أعضاء الفريق:' : 'Purpose & Team:'}
            <label className="form-label" htmlFor="room-purpose-input">
              {isAr ? 'الهدف من الحجز (المقرر أو المشروع):' : 'Purpose (Course / Project):'}
            </label>
            <textarea
              id="room-purpose-input"
              className="form-control"
              rows={2}
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {isSuccess ? (
          <div className="form-group">
            <label className="form-label" htmlFor="room-team-members-input">
              {isAr ? 'أسماء أعضاء الفريق (اختياري - مفصولين بفواصل):' : 'Team Members (Optional, comma-separated):'}
            </label>
            <input
              id="room-team-members-input"
              type="text"
              className="form-control"
              placeholder={isAr ? 'مثال: راكان المطيري، عبد العزيز البلوي' : 'e.g. Rakan, Abdulaziz'}
              value={teamMembers}
              onChange={e => setTeamMembers(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {!isAuthenticated ? (
            <button
              className="btn-primary"
              data-testid="room-signin-cta"
              style={{ width: '100%', justifyContent: 'center', padding: '0.95rem' }}
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
            >
              <LogIn size={16} color="#ffffff" />
              <span>
                {isAr ? 'تسجيل الدخول لتأكيد حجز القاعة' : 'Sign In to Reserve Pod'}
              </span>
            </button>
          ) : isSuccess ? (
            <div
              data-testid="room-success-banner"
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
              ✓{' '}
              {isAr
                ? 'تم تأكيد حجز القاعة وبدء المؤقت التنازلي!'
                : 'Reservation active with countdown!'}
            </div>
          ) : (
            <button
              className="btn-primary"
              data-testid="confirm-room-booking-btn"
              style={{ width: '100%', justifyContent: 'center', padding: '0.95rem' }}
              type="submit"
              disabled={isSubmitting}
            >
              <Calendar size={16} color="#ffffff" />
              <span>{isAr ? 'تأكيد الحجز وتفعيل العداد التنازلي' : 'Confirm & Start Timer'}</span>
              <span>
                {isSubmitting
                  ? isAr
                    ? 'جاري تأكيد الحجز...'
                    : 'Confirming...'
                  : isAr
                    ? 'تأكيد الحجز وتفعيل العداد التنازلي'
                    : 'Confirm & Start Timer'}
              </span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
