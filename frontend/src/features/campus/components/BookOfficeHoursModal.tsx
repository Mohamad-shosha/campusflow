import { useState, type FC, type SyntheticEvent } from 'react';
import { X, Calendar, UserCheck } from 'lucide-react';
import type { FacultyMember } from '../data/campusData';
import { soundFX } from '../../../shared/utils/sound';

export interface BookOfficeHoursModalProps {
  isOpen: boolean;
  faculty: FacultyMember | null;
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
  };
  onClose: () => void;
  onConfirm: (facultyId: string, slotTime: string, notes: string) => void;
}

export const BookOfficeHoursModal: FC<BookOfficeHoursModalProps> = ({
  isOpen,
  faculty,
  isAr,
  currentUser,
  onClose,
  onConfirm,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [topic, setTopic] = useState<string>('مناقشة مشروع التخرج واستفسار التصميم المنطقي');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen || !faculty) return null;

  const activeSlot = selectedSlot || faculty.timeSlots.find(s => s.available)?.time || '';

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    soundFX.playSuccess();
    setIsSuccess(true);
    setTimeout(() => {
      onConfirm(faculty.id, activeSlot, topic);
      setIsSuccess(false);
      onClose();
    }, 1200);
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
              {faculty.name} ({faculty.badge})
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
              {faculty.timeSlots.map(slot => (
                <button
                  key={slot.time}
                  type="button"
                  className={`time-slot-btn ${slot.available ? '' : 'disabled'} ${activeSlot === slot.time ? 'active' : ''}`}
                  disabled={!slot.available}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedSlot(slot.time);
                  }}
                  style={
                    activeSlot === slot.time
                      ? {
                          borderColor: 'var(--fbsu-primary)',
                          background: 'rgba(17,110,99,0.2)',
                          color: '#fff',
                        }
                      : {}
                  }
                >
                  <div style={{ fontWeight: 800 }}>{slot.time}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    {slot.duration}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {isAr ? 'موضوع الاستفسار أو المقابلة:' : 'Discussion Topic:'}
            </label>
            <textarea
              className="form-control"
              rows={2}
              value={topic}
              onChange={e => setTopic(e.target.value)}
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
              ✓{' '}
              {isAr
                ? 'تم تأكيد حجز الموعد وإرسال إشعار فوري للعمادة!'
                : 'Slot confirmed & notification sent!'}
            </div>
          ) : (
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.95rem' }}
              type="submit"
            >
              <Calendar size={16} color="#ffffff" />
              <span>{isAr ? 'تأكيد الحجز وإرسال إشعار فوري' : 'Confirm & Dispatch Alert'}</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
