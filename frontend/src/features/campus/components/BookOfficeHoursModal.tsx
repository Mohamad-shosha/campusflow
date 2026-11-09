import { useState, useEffect, type FC, type SyntheticEvent } from 'react';
import { X, Calendar, UserCheck, AlertCircle, LogIn } from 'lucide-react';
import type { FacultyMember } from '../data/campusData';
import { officeHoursApi } from '../api/officeHoursApi';
import { soundFX } from '../../../shared/utils/sound';

export interface BookOfficeHoursModalProps {
  isOpen: boolean;
  faculty: FacultyMember | null;
  initialSlotTime?: string | undefined;
  isAr: boolean;
  isAuthenticated?: boolean | undefined;
  currentUser: {
    id: string;
    name: string;
  };
  onClose: () => void;
  onOpenAuth?: (() => void) | undefined;
  onConfirm: (
    facultyId: string,
    slotTime: string,
    notes: string,
    updatedFaculty?: FacultyMember
  ) => void;
}

export const BookOfficeHoursModal: FC<BookOfficeHoursModalProps> = ({
  isOpen,
  faculty,
  initialSlotTime,
  isAr,
  isAuthenticated = false,
  currentUser,
  onClose,
  onOpenAuth = () => {},
  onConfirm,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [topic, setTopic] = useState<string>('مناقشة مشروع التخرج واستفسار التصميم المنطقي');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && faculty) {
      setErrorMessage(null);
      setIsSuccess(false);
      setIsSubmitting(false);
      if (initialSlotTime) {
        setSelectedSlot(initialSlotTime);
      } else {
        setSelectedSlot(faculty.timeSlots.find(s => s.available)?.time ?? '');
      }
    }
  }, [isOpen, faculty, initialSlotTime]);

  if (!isOpen || !faculty) return null;

  const activeSlotTime = selectedSlot || faculty.timeSlots.find(s => s.available)?.time || '';
  const activeSlotObj = faculty.timeSlots.find(s => s.time === activeSlotTime);
  const hasAvailableSlots = faculty.timeSlots.some(s => s.available);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      onClose();
      onOpenAuth();
      return;
    }

    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setErrorMessage(
        isAr ? 'يرجى كتابة موضوع الاستفسار أو المقابلة.' : 'Please enter a discussion topic.'
      );
      return;
    }

    if (!activeSlotObj || !activeSlotObj.available) {
      setErrorMessage(
        isAr ? 'يرجى اختيار فترة زمنية متاحة.' : 'Please select an available office-hour slot.'
      );
      return;
    }

    // A slot can only be booked through its real backend id; never mark it booked locally
    if (!activeSlotObj.id) {
      setErrorMessage(
        isAr
          ? 'هذا الموعد غير متزامن مع الخادم ولا يمكن حجزه. حدّث الصفحة وحاول مجدداً.'
          : 'This slot is not synced with the server and cannot be booked. Refresh and try again.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await officeHoursApi.bookAppointment(activeSlotObj.id, trimmedTopic);
      const updatedFaculty: FacultyMember | undefined = result.updatedFaculty;

      soundFX.playSuccess();
      setIsSuccess(true);
      const displaySlot = isAr ? activeSlotObj.time : activeSlotObj.timeEn || activeSlotObj.time;
      setTimeout(() => {
        onConfirm(faculty.id, displaySlot, trimmedTopic, updatedFaculty);
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
            ? 'تعذر تأكيد الموعد. قد تكون الفترة محجوزة مسبقاً.'
            : 'Unable to confirm appointment. The slot may already be booked.')
      );
    }
  };

  return (
    <div
      className="modal-overlay open"
      id="faculty-book-backdrop"
      onClick={e => {
        if ((e.target as HTMLElement).id === 'faculty-book-backdrop') onClose();
      }}
      data-testid="book-office-hours-modal"
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
            <UserCheck size={24} color="var(--fbsu-primary)" />
          </div>
          <div>
            <h3
              style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}
            >
              {isAr ? 'حجز موعد ساعة مكتبية' : 'Book Faculty Office Hour Slot'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isAr ? faculty.name : faculty.nameEn} (
              {isAr ? faculty.badge : faculty.badgeEn || faculty.badge})
            </span>
          </div>
        </div>

        {errorMessage && (
          <div
            data-testid="office-hours-error-banner"
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
              background: 'var(--surface-soft)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1rem',
              fontSize: '0.88rem',
            }}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
            >
              <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'المكتب:' : 'Office:'}</span>
              <strong style={{ color: 'var(--text-main)' }}>{faculty.office}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                {isAr ? 'الطالب المستفيد:' : 'Student:'}
              </span>
              <strong style={{ color: 'var(--fbsu-primary)' }}>
                {currentUser.name} ({currentUser.id})
              </strong>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {isAr ? 'اختر الفترة الزمنية المتاحة:' : 'Select Available Slot:'}
            </label>
            <div className="time-slots-picker-grid">
              {faculty.timeSlots.map((slot, idx) => {
                const isSelected = activeSlotTime === slot.time && slot.available;
                return (
                  <button
                    key={slot.id || `${slot.time}-${idx}`}
                    type="button"
                    className={`time-slot-btn ${slot.available ? '' : 'disabled'} ${isSelected ? 'active' : ''}`}
                    disabled={!slot.available || isSubmitting}
                    title={slot.bookedNote || ''}
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedSlot(slot.time);
                    }}
                    style={
                      isSelected
                        ? {
                            borderColor: 'var(--fbsu-primary)',
                            background: 'rgba(17,110,99,0.2)',
                            color: 'var(--text-strong)',
                          }
                        : {}
                    }
                  >
                    <div style={{ fontWeight: 800 }}>
                      {isAr ? slot.time : slot.timeEn || slot.time}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                      {isAr ? slot.duration : slot.durationEn || slot.duration}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="office-hours-topic-input">
              {isAr ? 'موضوع الاستفسار أو المقابلة:' : 'Discussion Topic:'}
            </label>
            <textarea
              id="office-hours-topic-input"
              className="form-control"
              rows={2}
              value={topic}
              onChange={e => setTopic(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {!isAuthenticated ? (
            <button
              className="btn-primary"
              data-testid="office-hours-signin-cta"
              style={{ width: '100%', justifyContent: 'center', padding: '0.95rem' }}
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
            >
              <LogIn size={16} color="#ffffff" />
              <span>
                {isAr ? 'تسجيل الدخول لتأكيد حجز الساعة المكتبية' : 'Sign In to Confirm Slot'}
              </span>
            </button>
          ) : isSuccess ? (
            <div
              data-testid="office-hours-success-banner"
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
                ? 'تم تأكيد حجز الموعد وإرسال إشعار فوري للعمادة!'
                : 'Slot confirmed & notification sent!'}
            </div>
          ) : (
            <button
              className="btn-primary"
              data-testid="confirm-office-hours-btn"
              style={{ width: '100%', justifyContent: 'center', padding: '0.95rem' }}
              type="submit"
              disabled={isSubmitting || !hasAvailableSlots}
            >
              <Calendar size={16} color="#ffffff" />
              <span>
                {isSubmitting
                  ? isAr
                    ? 'جاري تأكيد الحجز...'
                    : 'Confirming...'
                  : isAr
                    ? 'تأكيد الحجز وإرسال إشعار فوري'
                    : 'Confirm & Dispatch Alert'}
              </span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
