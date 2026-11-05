import { useState, FC } from 'react';
import { X, Award, ShieldCheck, Wallet } from 'lucide-react';
import type { TutoringSession } from '../data/campusData';
import { soundFX } from '../../../shared/utils/sound';

export interface BookTutoringModalProps {
  isOpen: boolean;
  session: TutoringSession | null;
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
    walletBalance: number;
  };
  onClose: () => void;
  onConfirmBooking: (session: TutoringSession) => void;
}

export const BookTutoringModal: FC<BookTutoringModalProps> = ({
  isOpen,
  session,
  isAr,
  currentUser,
  onClose,
  onConfirmBooking,
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen || !session) return null;

  const handleConfirm = () => {
    soundFX.playSuccess();
    setIsSuccess(true);
    setTimeout(() => {
      onConfirmBooking(session);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const hasEnoughBalance = currentUser.walletBalance >= session.totalPrice;

  return (
    <div
      className="modal-overlay open"
      id="tutoring-book-backdrop"
      onClick={e => {
        if ((e.target as HTMLElement).id === 'tutoring-book-backdrop') onClose();
      }}
      data-testid="book-tutoring-modal"
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
              background: 'var(--fbsu-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={24} color="var(--fbsu-gold)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {isAr ? 'تأكيد حجز جلسة الشرح الأكاديمي' : 'Confirm Peer Tutoring Booking'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {session.courseCode} - {session.courseName}
            </span>
          </div>
        </div>

        {/* Details Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>
                {isAr ? 'المعلم الأقران:' : 'Tutor:'}
              </span>
              <strong style={{ color: 'var(--text-main)' }}>{session.tutorName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>
                {isAr ? 'الموعد والمكان:' : 'Time & Location:'}
              </span>
              <strong style={{ color: 'var(--fbsu-primary)' }}>{session.dateTime}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>
                {isAr ? 'نطاق الشرح:' : 'Scope:'}
              </span>
              <span>{session.coveredLectures}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>
                {isAr ? 'الموقع الأكاديمي:' : 'Location:'}
              </span>
              <span>{session.location}</span>
            </div>
          </div>
        </div>

        {/* Financial Flow summary */}
        <div
          style={{
            background: 'var(--fbsu-gold-light)',
            border: '1px solid var(--fbsu-gold-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {isAr ? 'تكلفة الحجز (سعر الساعة الأكاديمية):' : 'Tutoring Fee (1 Hour):'}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--fbsu-gold)' }}>
                {session.totalPrice.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
              </div>
            </div>
            <div style={{ textAlign: 'start' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isAr ? 'رصيد محفظتك المتاح:' : 'Your Available Balance:'}
              </div>
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: hasEnoughBalance ? 'var(--status-available)' : '#ef4444',
                }}
              >
                {currentUser.walletBalance.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px dashed rgba(215, 162, 55, 0.4)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <ShieldCheck size={14} color="var(--fbsu-primary)" />
            <span>
              {isAr
                ? `سيتم تحويل ${session.totalPrice} ر.س إلى رصيد الطالب ${session.tutorName} لسداد رسومه الجامعية فوراً.`
                : `Amount converts directly to tuition credit for ${session.tutorName}.`}
            </span>
          </div>
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
            ✓ {isAr ? 'تم تأكيد حجز الجلسة وخصم الرسوم بنجاح!' : 'Session booked & fee settled successfully!'}
          </div>
        ) : (
          <button
            className="btn-gold"
            onClick={handleConfirm}
            disabled={!hasEnoughBalance}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.95rem',
              opacity: hasEnoughBalance ? 1 : 0.5,
              cursor: hasEnoughBalance ? 'pointer' : 'not-allowed',
            }}
            type="button"
            data-testid="confirm-book-tutoring-btn"
          >
            <Wallet size={16} color="#0b1a17" />
            <span>
              {hasEnoughBalance
                ? isAr
                  ? `تأكيد وسداد ${session.totalPrice} ر.س من المحفظة`
                  : `Confirm & Pay ${session.totalPrice} SAR`
                : isAr
                  ? 'رصيد المحفظة غير كافٍ - يرجى شحن الرصيد'
                  : 'Insufficient Balance'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
