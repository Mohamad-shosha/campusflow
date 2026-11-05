import { useState, FC } from 'react';
import {
  BookOpen,
  GraduationCap,
  Award,
  Clock,
  MapPin,
  ShieldCheck,
  Wallet,
  Plus,
} from 'lucide-react';
import type { TutoringSession } from '../data/campusData';
import { BookTutoringModal } from './BookTutoringModal';
import { CreateTutoringModal } from './CreateTutoringModal';
import { soundFX } from '../../../shared/utils/sound';

export interface TutoringViewProps {
  sessions: TutoringSession[];
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
    role: string;
    walletBalance: number;
  };
  onOpenTuition: () => void;
  onBookSuccess: (session: TutoringSession) => void;
  onAddSession: (session: TutoringSession) => void;
}

export const TutoringView: FC<TutoringViewProps> = ({
  sessions,
  isAr,
  currentUser,
  onOpenTuition,
  onBookSuccess,
  onAddSession,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<TutoringSession | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const filteredSessions = sessions.filter(s => {
    if (filter === 'all') return true;
    return s.category === filter;
  });

  return (
    <div data-testid="tutoring-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <BookOpen size={16} color="var(--fbsu-gold)" />
          <span>{isAr ? 'الأنشطة الطلابية وشروحات الأقران' : 'Peer Tutoring & Student Economy'}</span>
        </span>
        <h3 className="section-title">
          {isAr
            ? 'منظومة الشروحات الطلابية والرصيد الجامعي الذكي'
            : 'FBSU Peer Tutoring & Academic Wallet Hub'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'منصة رسمية تتيح للطلاب المتميزين (مثل إياد في الرياضيات وراكان في البرمجة) تقديم شروحات للمحاضرات والشباتر بأسعار محددة (70 ر.س / ساعة). لا تُحول المبالغ كاش؛ بل تتحول تلقائياً إلى "رصيد جامعي" معتمد في محفظة الطالب يُسدد به رسوم جامعته أو مواقفه!'
            : 'Distinguished students (e.g. Eyad in Math, Rakan in Coding) provide peer tutoring at 70 SAR/hour. Earnings transfer directly into University Balance to settle tuition fees or parking!'}
        </p>
      </div>

      {/* Student Economy Banner */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(17,110,99,0.2), rgba(215,162,55,0.15))',
          border: '1px solid var(--fbsu-gold-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.4rem 1.6rem',
          marginBottom: '2rem',
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
              color: 'var(--fbsu-gold)',
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
                ? 'الشرح بـ 70 ر.س/ساعة ➔ تجميع 10 ساعات = 700 ر.س ➔ خصم مباشر وسداد فوري من رسوم الفصل الدراسي بالجامعة!'
                : 'Teach for 70 SAR/hr ➔ 10 hrs = 700 SAR credited to University Balance ➔ Offsets tuition & parking!'}
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
              setIsCreateOpen(true);
            }}
            type="button"
          >
            <Plus size={16} color="#ffffff" />
            <span>{isAr ? 'طرح جلسة شرح جديدة' : 'Post New Session'}</span>
          </button>
        </div>
      </div>

      {/* Tutoring Hub Filter Toolbar */}
      <div className="campus-hub-toolbar">
        <div className="hub-filter-pills">
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
          <button
            className={`hub-filter-btn ${filter === 'math' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setFilter('math');
            }}
            type="button"
          >
            <span>{isAr ? 'الرياضيات والهندسة (إياد الحربي)' : 'Math & Calculus'}</span>
          </button>
          <button
            className={`hub-filter-btn ${filter === 'programming' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setFilter('programming');
            }}
            type="button"
          >
            <span>{isAr ? 'البرمجة وهياكل البيانات (راكان المطيري)' : 'Programming (Rakan)'}</span>
          </button>
          <button
            className={`hub-filter-btn ${filter === 'hardware' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setFilter('hardware');
            }}
            type="button"
          >
            <span>{isAr ? 'التصميم المنطقي (Logic Design)' : 'Digital Logic Design'}</span>
          </button>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {isAr ? 'المستخدم الحالي الحاجز:' : 'Current User:'}{' '}
          <strong>{currentUser.name}</strong> ({currentUser.walletBalance.toFixed(2)}{' '}
          {isAr ? 'ر.س' : 'SAR'})
        </div>
      </div>

      {/* Tutoring Cards Grid */}
      <div className="tutoring-grid">
        {filteredSessions.map(s => (
          <div key={s.id} className="tutoring-card">
            <div>
              <div className="tutoring-top-bar">
                <span className="course-code-badge">
                  <Award size={13} color="var(--fbsu-primary)" />
                  <span>{s.courseCode}</span>
                </span>

                <div className="tutor-rate-badge">
                  <span className="tutor-rate-num">
                    {s.hourlyRate} {isAr ? 'ر.س' : 'SAR'}
                  </span>
                  <span className="tutor-rate-unit">{isAr ? 'للساعة الواحدة' : 'per hour'}</span>
                </div>
              </div>

              {/* Tutor Profile Info */}
              <div className="tutor-profile-strip">
                <div className="tutor-avatar-circle" style={{ background: s.tutorAvatarColor }}>
                  {s.tutorName.charAt(0)}
                </div>
                <div className="tutor-info-meta">
                  <div className="tutor-title-row">
                    <span className="tutor-name">{s.tutorName}</span>
                    <span className="tutor-badge-tag">{isAr ? 'طالب متميز' : 'Honor Tutor'}</span>
                  </div>
                  <div className="tutor-college-text">{s.tutorRole}</div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      color: 'var(--fbsu-gold)',
                      marginTop: '0.25rem',
                    }}
                  >
                    <span>★ {s.rating}</span>
                    <span style={{ color: 'var(--text-dim)' }}>
                      ({s.reviewsCount} {isAr ? 'تقييم طالب' : 'reviews'})
                    </span>
                  </div>
                </div>
              </div>

              <h4
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginBottom: '0.65rem',
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

              {/* Meta details */}
              <div className="tutoring-meta-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} color="var(--text-dim)" />
                  <span>{s.dateTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} color="var(--text-dim)" />
                  <span>{s.location}</span>
                </div>
              </div>

              {/* University Balance routing notice */}
              <div className="wallet-routing-notice">
                <ShieldCheck size={14} color="var(--fbsu-primary)" />
                <span>
                  {isAr
                    ? `يتم تحويل ${s.hourlyRate} ر.س كرصيد جامعي للطالب ${s.tutorName.split(' ')[0]} لسداد رسوم جامعته.`
                    : 'Payment converted to official university tuition credit.'}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              className="btn-gold book-tutoring-btn"
              onClick={() => {
                soundFX.playClick();
                setSelectedSession(s);
              }}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.9rem' }}
              type="button"
            >
              <Wallet size={16} color="#0b1a17" />
              <span>
                {isAr
                  ? `حجز الجلسة وسداد ${s.hourlyRate} ر.س`
                  : `Book & Settle ${s.hourlyRate} SAR`}
              </span>
            </button>
          </div>
        ))}
      </div>

      <BookTutoringModal
        isOpen={selectedSession !== null}
        session={selectedSession}
        isAr={isAr}
        currentUser={currentUser}
        onClose={() => setSelectedSession(null)}
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
