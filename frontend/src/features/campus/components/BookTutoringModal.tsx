import { useState, FC } from 'react';
import { X, Award, ShieldCheck, Wallet, LogIn, AlertCircle } from 'lucide-react';
import type { TutoringSession } from '../data/campusData';
import { tutoringApi } from '../api/tutoringApi';
import { soundFX } from '../../../shared/utils/sound';

export interface BookTutoringModalProps {
  isOpen: boolean;
  session: TutoringSession | null;
  isAr: boolean;
  isAuthenticated: boolean;
  currentUser: {
    id: string;
    name: string;
    walletBalance: number;
  };
  onClose: () => void;
  onOpenAuth: () => void;
  onConfirmBooking: (session: TutoringSession, updatedBalance?: number) => void;
}

export const BookTutoringModal: FC<BookTutoringModalProps> = ({
  isOpen,
  session,
  isAr,
  isAuthenticated,
  currentUser,
  onClose,
  onOpenAuth,
  onConfirmBooking,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !session) return null;

  const hasEnoughBalance = currentUser.walletBalance >= session.totalPrice;
  const isOwnSession = isAuthenticated && session.tutorId === currentUser.id;
  const isAlreadyEnrolled =
    isAuthenticated &&
    ((session.enrolledStudentNumbers && session.enrolledStudentNumbers.includes(currentUser.id)) ||
      session.enrolledStudents.includes(currentUser.name));

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      onClose();
      onOpenAuth();
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const idempotencyKey = `tut-book-${session.id}-${currentUser.id}-${Date.now()}`;
      const { enrollment, updatedSession } = await tutoringApi.bookSession(
        session.backendId || session.id,
        idempotencyKey
      );
      soundFX.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        onConfirmBooking(updatedSession, Number(enrollment.studentWalletBalance));
        setIsSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 800);
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        (isAr
          ? 'تعذر إتمام حجز الجلسة. يرجى التحقق من الرصيد أو حالة الجلسة.'
          : 'Unable to complete enrollment. Please verify your wallet balance or session status.');
      setErrorMsg(detail);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay open"
      id="tutoring-book-backdrop"
      onClick={e => {
        if ((e.target as HTMLElement).id === 'tutoring-book-backdrop') {
          setErrorMsg(null);
          onClose();
        }
      }}
      data-testid="book-tutoring-modal"
    >
      <div className="modal-content-box" style={{ maxWidth: '540px' }}>
        <button
          className="modal-close-btn"
          onClick={() => {
            setErrorMsg(null);
            onClose();
          }}
          type="button"
          aria-label="Close"
        >
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
              background: 'var(--fbsu-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={24} color="var(--fbsu-gold)" />
          </div>
          <div>
            <h3
              style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}
            >
              {isAr ? 'تأكيد حجز جلسة الشرح الأكاديمي' : 'Confirm Peer Tutoring Booking'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {session.courseCode} - {isAr ? session.courseName : session.courseNameEn}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.85rem',
              fontSize: '0.88rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>
                {isAr ? 'المعلم الأقران:' : 'Tutor:'}
              </span>
              <strong style={{ color: 'var(--text-main)' }}>
                {isAr ? session.tutorName : session.tutorNameEn || session.tutorName}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>
                {isAr ? 'الموعد والمدة:' : 'Schedule & Duration:'}
              </span>
              <strong style={{ color: 'var(--fbsu-primary)' }}>
                {session.dateTime} ({session.durationHours}h)
              </strong>
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
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {isAr
                  ? `تكلفة الجلسة (${session.durationHours} ساعة × ${session.hourlyRate} ر.س):`
                  : `Session Fee (${session.durationHours}h × ${session.hourlyRate} SAR):`}
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
                ? `سيتم تحويل ${session.totalPrice.toFixed(2)} ر.س إلى رصيد الطالب ${session.tutorName} لسداد رسومه الجامعية فوراً.`
                : `${session.totalPrice.toFixed(2)} SAR transfers directly to tuition credit for ${session.tutorNameEn || session.tutorName}.`}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div
            role="alert"
            style={{
              padding: '0.85rem 1rem',
              marginBottom: '1rem',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            data-testid="book-tutoring-error"
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

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
              ? 'تم تأكيد حجز الجلسة وتحويل الرسوم بنجاح!'
              : 'Session booked & fee settled successfully!'}
          </div>
        ) : !isAuthenticated ? (
          <button
            className="btn-primary"
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            style={{ width: '100%', justifyContent: 'center', padding: '0.95rem' }}
            type="button"
            data-testid="signin-to-book-tutoring-btn"
          >
            <LogIn size={16} />
            <span>{isAr ? 'تسجيل الدخول لحجز الجلسة' : 'Sign In to Book Session'}</span>
          </button>
        ) : (
          <button
            className="btn-gold"
            onClick={handleConfirm}
            disabled={!hasEnoughBalance || isSubmitting || isOwnSession || isAlreadyEnrolled}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.95rem',
              opacity:
                hasEnoughBalance && !isSubmitting && !isOwnSession && !isAlreadyEnrolled ? 1 : 0.5,
              cursor:
                hasEnoughBalance && !isSubmitting && !isOwnSession && !isAlreadyEnrolled
                  ? 'pointer'
                  : 'not-allowed',
            }}
            type="button"
            data-testid="confirm-book-tutoring-btn"
          >
            <Wallet size={16} color="#0b1a17" />
            <span>
              {isSubmitting
                ? isAr
                  ? 'جارٍ تنفيذ الحجز والتحويل...'
                  : 'Processing Enrollment...'
                : isOwnSession
                  ? isAr
                    ? 'لا يمكنك حجز جلستك الخاصة'
                    : 'Cannot Book Your Own Session'
                  : isAlreadyEnrolled
                    ? isAr
                      ? 'أنت مسجل بالفعل في هذه الجلسة'
                      : 'Already Enrolled in Session'
                    : hasEnoughBalance
                      ? isAr
                        ? `تأكيد وسداد ${session.totalPrice.toFixed(2)} ر.س من المحفظة`
                        : `Confirm & Pay ${session.totalPrice.toFixed(2)} SAR`
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
