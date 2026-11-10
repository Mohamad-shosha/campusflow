import { useMemo, useState, FC } from 'react';
import {
  BookOpen,
  GraduationCap,
  Clock,
  MapPin,
  ShieldCheck,
  Wallet,
  Plus,
  Users,
  Search,
  RotateCw,
  Star,
  X,
} from 'lucide-react';
import type { TutoringSession } from '../data/campusData';
import { tutoringApi } from '../api/tutoringApi';
import { BookTutoringModal } from './BookTutoringModal';
import { CreateTutoringModal } from './CreateTutoringModal';
import { soundFX } from '../../../shared/utils/sound';
import type { ResourceStatus } from '../../../shared/types/resource';

// Categories allowed by the tutoring_session CHECK constraint (V10__tutoring.sql)
const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  programming: { ar: 'البرمجة وهياكل البيانات', en: 'Programming' },
  hardware: { ar: 'التصميم المنطقي والعتاد', en: 'Digital Logic & Hardware' },
  math: { ar: 'الرياضيات والفيزياء', en: 'Math & Physics' },
  science: { ar: 'العلوم', en: 'Science' },
  general: { ar: 'عام', en: 'General' },
};

export interface TutoringViewProps {
  sessions: TutoringSession[];
  /** Load state of `sessions` from the API (defaults to 'ready' for isolated usage) */
  status?: ResourceStatus | undefined;
  onRetry?: (() => void) | undefined;
  isAr: boolean;
  isAuthenticated?: boolean | undefined;
  currentUser: {
    id: string;
    name: string;
    role: string;
    walletBalance: number;
  };
  onOpenAuth?: (() => void) | undefined;
  onOpenTuition: () => void;
  onBookSuccess: (session: TutoringSession, updatedBalance?: number) => void;
  onAddSession: (session: TutoringSession) => void;
  onSessionUpdated?: ((session: TutoringSession) => void) | undefined;
}

export const TutoringView: FC<TutoringViewProps> = ({
  sessions,
  status = 'ready',
  onRetry,
  isAr,
  isAuthenticated = false,
  currentUser,
  onOpenAuth = () => {},
  onOpenTuition,
  onBookSuccess,
  onAddSession,
  onSessionUpdated,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<TutoringSession | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sessionOverrides, setSessionOverrides] = useState<Record<string, TutoringSession>>({});
  const [reviewModalSession, setReviewModalSession] = useState<TutoringSession | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Filter pills are derived from the categories present in the loaded sessions
  const categories = useMemo(
    () => Array.from(new Set(sessions.map(s => s.category).filter(Boolean))),
    [sessions]
  );

  const filteredSessions = sessions.filter(s => {
    if (filter !== 'all' && s.category !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName =
        (s.courseName && s.courseName.toLowerCase().includes(q)) ||
        (s.courseNameEn && s.courseNameEn.toLowerCase().includes(q));
      const matchCode = s.courseCode && s.courseCode.toLowerCase().includes(q);
      const matchTutor =
        (s.tutorName && s.tutorName.toLowerCase().includes(q)) ||
        (s.tutorNameEn && s.tutorNameEn.toLowerCase().includes(q));
      return matchName || matchCode || matchTutor;
    }
    return true;
  });

  return (
    <div data-testid="tutoring-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <BookOpen size={16} color="var(--fbsu-gold)" />
          <span>
            {isAr ? 'الأنشطة الطلابية وشروحات الأقران' : 'Peer Tutoring & Student Economy'}
          </span>
        </span>
        <h3 className="section-title">
          {isAr
            ? 'منظومة الشروحات الطلابية والرصيد الجامعي الذكي'
            : 'FBSU Peer Tutoring & Academic Wallet Hub'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'منصة رسمية تتيح للطلاب المتميزين تقديم شروحات للمحاضرات بسعر رسمي موحد (70 ر.س / ساعة). لا تُحول المبالغ كاش؛ بل تتحول إلى رصيد جامعي في محفظة الطالب يُسدد به رسومه الجامعية أو المواقف.'
            : 'Distinguished students provide peer tutoring at the official rate of 70 SAR/hour. Earnings are credited to the tutor’s university wallet to settle tuition or parking fees.'}
        </p>
      </div>

      {/* Student Economy Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(17,110,99,0.2), rgba(215,162,55,0.15))',
          border: '1px solid var(--fbsu-gold-border)',
          borderRadius: 'var(--r-lg)',
          padding: '0.9rem 1.15rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--fbsu-gold-light)',
              color: 'var(--gold-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <GraduationCap size={24} color="var(--fbsu-gold)" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              {isAr ? 'دورة الرصيد الجامعي (Student Tuition Offset)' : 'Tuition Offset Flow'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {isAr
                ? 'الشرح بـ 70 ر.س/ساعة ➔ يُضاف المبلغ لرصيدك الجامعي ➔ استخدمه لسداد الرسوم الجامعية أو المواقف.'
                : 'Teach at 70 SAR/hr ➔ earnings credited to your university wallet ➔ use them for tuition or parking.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn-gold"
            onClick={() => {
              soundFX.playClick();
              onOpenTuition();
            }}
            type="button"
          >
            <Wallet size={16} color="#0b1a17" />
            <span>{isAr ? 'سداد الرسوم الجامعية من رصيدك' : 'Pay Tuition From Balance'}</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              soundFX.playClick();
              if (!isAuthenticated) {
                onOpenAuth();
                return;
              }
              setIsCreateOpen(true);
            }}
            type="button"
            data-testid="open-create-tutoring-btn"
          >
            <Plus size={16} color="#ffffff" />
            <span>{isAr ? 'طرح جلسة شرح جديدة' : 'Post New Session'}</span>
          </button>
        </div>
      </div>

      {/* Tutoring Hub Filter Toolbar */}
      <div className="campus-hub-toolbar" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="hub-filter-pills" style={{ flexWrap: 'wrap' }}>
          <button
            className={`hub-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setFilter('all');
            }}
            type="button"
          >
            <span>{isAr ? 'جميع الشروحات الأكاديمية' : 'All Sessions'}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`hub-filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setFilter(cat);
              }}
              type="button"
            >
              <span>
                {CATEGORY_LABELS[cat]
                  ? isAr
                    ? CATEGORY_LABELS[cat].ar
                    : CATEGORY_LABELS[cat].en
                  : cat}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Quick Search */}
          <div className="rooms-search" style={{ flex: '0 1 280px' }}>
            <Search size={15} className="rooms-search-icon" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label={isAr ? 'بحث في الجلسات' : 'Search sessions'}
              placeholder={isAr ? 'ابحث بالمقرر أو الطالب...' : 'Search course or tutor...'}
            />
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {isAr ? 'المستخدم الحالي:' : 'Current User:'} <strong>{currentUser.name}</strong> (
            {currentUser.walletBalance.toFixed(2)} {isAr ? 'ر.س' : 'SAR'})
          </div>
        </div>
      </div>

      {/* Data states (no mock fallback) */}
      {status === 'loading' && sessions.length === 0 && (
        <div className="campus-data-state" role="status" data-testid="tutoring-loading">
          {isAr ? 'جاري تحميل جلسات الشرح...' : 'Loading tutoring sessions...'}
        </div>
      )}
      {status === 'error' && sessions.length === 0 && (
        <div className="campus-data-state is-error" role="alert" data-testid="tutoring-load-error">
          <span>
            {isAr ? 'تعذر تحميل جلسات الشرح من الخادم.' : 'Could not load tutoring sessions.'}
          </span>
          {onRetry && (
            <button type="button" className="btn-outline" onClick={onRetry}>
              <RotateCw size={14} />
              <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
            </button>
          )}
        </div>
      )}
      {status === 'ready' && filteredSessions.length === 0 && (
        <div className="campus-data-state" data-testid="tutoring-empty">
          {sessions.length === 0
            ? isAr
              ? 'لا توجد جلسات شرح منشورة حالياً.'
              : 'No tutoring sessions have been published yet.'
            : isAr
              ? 'لا توجد جلسات مطابقة للتصفية أو البحث.'
              : 'No sessions match your filter or search.'}
        </div>
      )}

      {/* Tutoring Cards Grid (Pixel-Perfect Alignment with Attachment Image 1) */}
      <div className="tutoring-grid">
        {filteredSessions.map(baseSession => {
          const s = sessionOverrides[baseSession.id] ?? baseSession;
          const isEnrolled =
            isAuthenticated &&
            ((s.enrolledStudentNumbers && s.enrolledStudentNumbers.includes(currentUser.id)) ||
              s.enrolledStudents.includes(currentUser.name));
          const isOwn = isAuthenticated && s.tutorId === currentUser.id;
          const displayTutorName = isAr ? s.tutorName : s.tutorNameEn || s.tutorName;
          const displayTutorRole = isAr ? s.tutorRole : s.tutorRoleEn || s.tutorRole;
          const avatarInitial = displayTutorName.charAt(0);
          const hasRealRating = s.reviewsCount > 0 && s.rating !== null;

          return (
            <div key={s.id} className="tutoring-card" data-testid={`tutoring-card-${s.id}`}>
              <div>
                {/* Top Bar: Rate on Left, Course Code on Right in RTL */}
                <div className="tutoring-top-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="course-code-badge">
                      <GraduationCap size={13} color="var(--fbsu-primary)" />
                      <span>{s.courseCode}</span>
                    </span>
                    {hasRealRating && s.rating !== null && (
                      <span
                        data-testid={`tutoring-rating-${s.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '999px',
                          background: 'rgba(215, 162, 55, 0.16)',
                          color: 'var(--gold-text, #fbbf24)',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                        }}
                      >
                        <Star size={12} fill="currentColor" />
                        <span>
                          {s.rating.toFixed(1)} ({s.reviewsCount})
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="tutor-rate-badge">
                    <span className="tutor-rate-num">
                      {s.hourlyRate} {isAr ? 'ر.س' : 'SAR'}
                    </span>
                    <span className="tutor-rate-unit">{isAr ? 'للساعة الواحدة' : 'per hour'}</span>
                  </div>
                </div>

                {/* Tutor Profile Strip */}
                <div className="tutor-profile-strip">
                  <div
                    className="tutor-avatar-circle"
                    style={{
                      background: s.tutorAvatarColor,
                      fontSize: '1.1rem',
                    }}
                  >
                    {avatarInitial}
                  </div>
                  <div className="tutor-info-meta">
                    <div className="tutor-title-row">
                      <span className="tutor-name">{displayTutorName}</span>
                      <span className="tutor-badge-tag">{isAr ? 'معلم أقران' : 'Peer Tutor'}</span>
                    </div>
                    <div className="tutor-college-text">{displayTutorRole}</div>
                  </div>
                </div>

                {/* Main Course Title */}
                <h4
                  style={{
                    fontSize: '1.12rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.35,
                  }}
                >
                  {isAr ? s.courseName : s.courseNameEn}
                </h4>

                {/* Scope Box */}
                <div className="tutoring-content-box">
                  <div className="lectures-scope-title">
                    <BookOpen size={14} color="var(--fbsu-gold)" />
                    <span>{s.coveredLectures}</span>
                  </div>
                  <div className="lectures-scope-desc">{s.coveredScope}</div>
                </div>

                {/* Meta details (Date/Time & Location) */}
                <div className="tutoring-meta-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} color="var(--text-dim)" />
                    <span>
                      {s.dateTime} ({s.durationHours}h)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="var(--text-dim)" />
                    <span>{s.location}</span>
                  </div>
                </div>

                {/* Enrolled peer capacity */}
                <div
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginBottom: '0.65rem',
                  }}
                >
                  <Users size={13} color="var(--fbsu-primary)" />
                  <span>
                    {isAr
                      ? `المسجلون حالياً: ${s.enrolledStudents.length}${s.maxCapacity ? ` / ${s.maxCapacity}` : ''}`
                      : `Enrolled: ${s.enrolledStudents.length}${s.maxCapacity ? ` / ${s.maxCapacity}` : ''}`}
                  </span>
                </div>

                {/* University Balance routing notice */}
                <div className="wallet-routing-notice">
                  <ShieldCheck size={14} color="var(--fbsu-primary)" />
                  <span>
                    {isAr
                      ? `يتم تحويل ${s.totalPrice} ر.س كرصيد جامعي إلى محفظة المعلم.`
                      : `${s.totalPrice} SAR transfers directly to official university tuition credit.`}
                  </span>
                </div>
              </div>

              {/* Golden Action Button + Enrolled Student Review Action */}
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <button
                  className="btn-gold book-tutoring-btn"
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedSession(s);
                  }}
                  disabled={s.status === 'booked' && !isEnrolled}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.85rem',
                    fontSize: '0.9rem',
                  }}
                  type="button"
                >
                  <Wallet size={16} color="#0b1a17" />
                  <span>
                    {isEnrolled
                      ? isAr
                        ? 'مسجل بالفعل في الجلسة ✓'
                        : 'Enrolled ✓'
                      : isOwn
                        ? isAr
                          ? 'جلستك المنشورة'
                          : 'Your Published Session'
                        : s.status === 'booked'
                          ? isAr
                            ? 'اكتمل العدد'
                            : 'Session Full'
                          : isAr
                            ? `حجز الجلسة وسداد ${s.totalPrice} ر.س`
                            : `Book & Settle ${s.totalPrice} SAR`}
                  </span>
                </button>

                {isEnrolled && !isOwn && (
                  <button
                    type="button"
                    className="btn-outline"
                    data-testid={`rate-tutoring-btn-${s.id}`}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.82rem',
                      padding: '0.5rem',
                    }}
                    onClick={() => {
                      soundFX.playClick();
                      setReviewModalSession(s);
                      setReviewRating(5);
                      setReviewComment('');
                      setReviewError(null);
                    }}
                  >
                    <Star size={14} color="var(--fbsu-gold)" />
                    <span>{isAr ? 'تقييم الجلسة وإضافة مراجعة' : 'Rate & Review Session'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {reviewModalSession && (
        <div
          className="modal-overlay active"
          role="dialog"
          aria-modal="true"
          data-testid="tutoring-review-modal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'rgba(3, 12, 10, 0.78)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="glass-panel"
            style={{ width: '100%', maxWidth: 440, padding: '1.35rem', borderRadius: 14 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.85rem',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                {isAr
                  ? `تقييم جلسة ${reviewModalSession.courseCode}`
                  : `Rate ${reviewModalSession.courseCode}`}
              </h3>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setReviewModalSession(null)}
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={async e => {
                e.preventDefault();
                setIsSubmittingReview(true);
                setReviewError(null);
                try {
                  const trimmedComment = reviewComment.trim();
                  const updated = await tutoringApi.submitReview(
                    reviewModalSession.backendId || reviewModalSession.id,
                    {
                      rating: reviewRating,
                      ...(trimmedComment ? { comment: trimmedComment } : {}),
                    }
                  );
                  setSessionOverrides(prev => ({ ...prev, [reviewModalSession.id]: updated }));
                  if (onSessionUpdated) onSessionUpdated(updated);
                  setReviewModalSession(null);
                } catch {
                  setReviewError(
                    isAr
                      ? 'تعذر إرسال التقييم (قد تكون قيّمت الجلسة مسبقاً).'
                      : 'Could not submit review (you may have already reviewed this session).'
                  );
                } finally {
                  setIsSubmittingReview(false);
                }
              }}
              style={{ display: 'grid', gap: '0.8rem' }}
            >
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  {isAr ? 'التقييم بالنجوم (1 إلى 5)' : 'Star Rating (1 to 5)'}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      data-testid={`review-star-${star}`}
                      className={`btn btn-sm ${reviewRating >= star ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setReviewRating(star)}
                    >
                      <Star size={15} fill={reviewRating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {isAr ? 'ملاحظاتك (اختياري)' : 'Feedback comment (optional)'}
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  className="form-control"
                  data-testid="review-comment-input"
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder={isAr ? 'اكتب تجربتك مع المعلم الأقران...' : 'Share your feedback...'}
                />
              </div>

              {reviewError && (
                <div style={{ fontSize: '0.82rem', color: '#fca5a5' }}>{reviewError}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setReviewModalSession(null)}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmittingReview}
                  data-testid="submit-tutoring-review-btn"
                >
                  {isSubmittingReview
                    ? isAr
                      ? 'جاري الحفظ...'
                      : 'Saving...'
                    : isAr
                      ? 'إرسال التقييم'
                      : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BookTutoringModal
        isOpen={selectedSession !== null}
        session={selectedSession}
        isAr={isAr}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onClose={() => setSelectedSession(null)}
        onOpenAuth={onOpenAuth}
        onConfirmBooking={onBookSuccess}
      />

      <CreateTutoringModal
        isOpen={isCreateOpen}
        isAr={isAr}
        currentUser={currentUser}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={onAddSession}
      />
    </div>
  );
};
