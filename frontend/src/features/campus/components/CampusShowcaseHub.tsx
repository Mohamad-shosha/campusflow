import { FC } from 'react';
import {
  Building2,
  Cpu,
  ShieldCheck,
  DoorClosed,
  UserCheck,
  BookOpen,
  Bus,
  UtensilsCrossed,
  Wallet,
  ArrowRight,
  ArrowLeft,
  Award,
  Clock,
  MapPin,
  Users,
  Coffee,
  CreditCard,
  Navigation,
} from 'lucide-react';
import { soundFX } from '../../../shared/utils/sound';
import {
  INITIAL_STUDY_ROOMS,
  FACULTY_MEMBERS,
  INITIAL_TUTORING_SESSIONS,
} from '../data/campusData';

export interface CampusShowcaseHubProps {
  isAr: boolean;
  onNavigate: (tab: string) => void;
  onOpenAuth?: () => void;
  isAuthenticated: boolean;
  walletBalance?: number;
}

export const CampusShowcaseHub: FC<CampusShowcaseHubProps> = ({
  isAr,
  onNavigate,
  walletBalance = 150.0,
}) => {
  const NextArrow = isAr ? ArrowLeft : ArrowRight;
  const featuredRooms = INITIAL_STUDY_ROOMS.slice(0, 4);
  const featuredFaculty = FACULTY_MEMBERS.slice(0, 4);
  const featuredTutoring = INITIAL_TUTORING_SESSIONS.slice(0, 3);

  return (
    <div
      className="campus-showcase-hub"
      data-testid="campus-showcase-hub"
      style={{ marginTop: '3.5rem' }}
    >
      {/* 1. SECTION: Smart Research Labs & High-Performance Study Hubs */}
      <section className="showcase-section" style={{ marginBottom: '4rem' }}>
        <div
          className="section-head"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <span
              className="section-eyebrow"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--fbsu-primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              <Cpu size={16} />
              <span>
                {isAr ? 'مختبرات الأبحاث والذكاء الاصطناعي' : 'Research Labs & AI Infrastructure'}
              </span>
            </span>
            <h3
              className="section-title"
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                marginTop: '0.35rem',
              }}
            >
              {isAr
                ? 'المعامل والقاعات الذكية المجهزة للحجز الفوري (10 مرافق متقدمة)'
                : 'Smart Laboratories & Collaborative Hubs (10 Facilities)'}
            </h3>
            <p
              className="section-subtitle"
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.92rem',
                maxWidth: '780px',
                marginTop: '0.25rem',
              }}
            >
              {isAr
                ? 'استكشف واحجز أحدث بيئات العمل الهندسية ومختبرات الحوسبة الفائقة المزودة بوحدات NVIDIA GPU وشبكات Cisco وغرف الدراسة المعزولة صوتياً.'
                : 'Explore and reserve top-tier engineering environments, NVIDIA GPU clusters, Cisco CyberOps sandboxes, and acoustically isolated study pods.'}
            </p>
          </div>

          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              soundFX.playClick();
              onNavigate('rooms');
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>{isAr ? 'استعراض كافة المعامل (10)' : 'View All Labs (10)'}</span>
            <NextArrow size={16} />
          </button>
        </div>

        {/* Labs Grid */}
        <div className="showcase-grid">
          {featuredRooms.map(room => {
            const isAvailable = room.status === 'available';
            const statusNum = isAvailable
              ? isAr
                ? 'متاح الآن'
                : 'Available'
              : room.status === 'in-use'
                ? isAr
                  ? 'جلسة نشطة'
                  : 'In Session'
                : isAr
                  ? 'محجوز'
                  : 'Reserved';
            const statusUnit = isAvailable
              ? isAr
                ? 'حجز فوري'
                : 'Instant Book'
              : isAr
                ? 'حتى 02:00 م'
                : 'Until 2PM';

            return (
              <div
                key={room.id}
                className="tutoring-card showcase-deluxe-card"
                data-testid={`showcase-lab-${room.id}`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="tutoring-top-bar">
                    <span className="course-code-badge">
                      <Cpu size={13} color="var(--fbsu-primary)" />
                      <span>{isAr ? room.typeBadge : room.typeBadgeEn || room.typeBadge}</span>
                    </span>

                    <div className="tutor-rate-badge">
                      <span
                        className="tutor-rate-num"
                        style={{ color: isAvailable ? '#10b981' : '#f59e0b', fontSize: '1.1rem' }}
                      >
                        {statusNum}
                      </span>
                      <span className="tutor-rate-unit">{statusUnit}</span>
                    </div>
                  </div>

                  {/* Profile Strip */}
                  <div className="tutor-profile-strip">
                    <div
                      className="tutor-avatar-circle"
                      style={{
                        background: 'linear-gradient(135deg, #0d9488 0%, #042f2e 100%)',
                        borderColor: 'rgba(45, 212, 191, 0.4)',
                      }}
                    >
                      <Cpu size={22} color="#ffffff" />
                    </div>
                    <div className="tutor-info-meta">
                      <div className="tutor-title-row">
                        <span className="tutor-name">
                          {isAr ? room.typeBadge : room.typeBadgeEn || room.typeBadge}
                        </span>
                        <span className="tutor-badge-tag">
                          {isAr ? 'معمل بحثي معتمد' : 'Verified Facility'}
                        </span>
                      </div>
                      <div className="tutor-college-text">
                        {isAr ? room.building : room.buildingEn || room.building}
                      </div>
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
                        <span>★ 4.98</span>
                        <span style={{ color: 'var(--text-dim)' }}>
                          ({isAr ? 'تجهيزات فائقة' : 'High Spec HPC'})
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4 className="showcase-card-title">
                    {isAr ? room.name : room.nameEn || room.name}
                  </h4>

                  {/* Inset Scope Box */}
                  <div className="tutoring-content-box">
                    <div className="lectures-scope-title">
                      <Cpu size={14} color="var(--fbsu-gold)" />
                      <span>
                        {room.specs && room.specs[0]
                          ? room.specs[0]
                          : isAr
                            ? 'تجهيزات الحوسبة المتقدمة'
                            : 'Hardware Specifications'}
                      </span>
                    </div>
                    <div className="lectures-scope-desc">
                      {room.specs && room.specs[1]
                        ? room.specs[1]
                        : isAr
                          ? 'اتصال مباشر بشبكة الألياف الضوئية الفائقة 40Gbps وحوسبة سحابية متقدمة.'
                          : 'Direct 40Gbps HPC cluster connection and cloud computing.'}
                    </div>
                  </div>

                  {/* Meta Details Row */}
                  <div className="tutoring-meta-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} color="var(--text-dim)" />
                      <span>{isAr ? room.building : room.buildingEn || room.building}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <DoorClosed size={14} color="var(--text-dim)" />
                      <span>{isAr ? 'دخول فوري بالـ NFC' : 'Instant NFC Entry'}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.76rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <Users size={13} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? `السعة الاستيعابية: ${room.capacity}`
                        : `Capacity: ${room.capacity}`}
                    </span>
                  </div>

                  {/* Routing / Security Notice */}
                  <div className="wallet-routing-notice">
                    <ShieldCheck size={14} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'حجز فوري ومؤكد متصل بأنظمة الأبواب الذكية IoT وسيرفرات الكلية.'
                        : 'Instant reservation synced with campus IoT smart locks & compute.'}
                    </span>
                  </div>
                </div>

                {/* Golden CTA Button */}
                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => {
                    soundFX.playClick();
                    onNavigate('rooms');
                  }}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.85rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <DoorClosed size={16} />
                  <span>
                    {isAvailable
                      ? isAr
                        ? 'احجز هذه القاعة الآن'
                        : 'Book Facility Now'
                      : isAr
                        ? 'عرض جدول الجلسة'
                        : 'View Schedule'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. SECTION: Academic Advising & Distinguished Faculty Office Hours */}
      <section className="showcase-section" style={{ marginBottom: '4rem' }}>
        <div
          className="section-head"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <span
              className="section-eyebrow"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--fbsu-gold)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              <UserCheck size={16} />
              <span>
                {isAr ? 'الإرشاد الأكاديمي والاستشارات' : 'Academic Mentorship & Faculty Advising'}
              </span>
            </span>
            <h3
              className="section-title"
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                marginTop: '0.35rem',
              }}
            >
              {isAr
                ? 'الساعات المكتبية المباشرة لعمداء الكليات ورؤساء الأقسام'
                : 'Office Hours & Advising with University Deans & Chairs'}
            </h3>
            <p
              className="section-subtitle"
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.92rem',
                maxWidth: '780px',
                marginTop: '0.25rem',
              }}
            >
              {isAr
                ? 'احجز موعداً مباشراً لمناقشة الخطط الدراسية، مشاريع التخرج، أطروحات الماجستير، أو معادلة المقررات بنقرة واحدة.'
                : 'Directly schedule 1-on-1 sessions for degree planning, senior capstones, master thesis advising, or credit transfer.'}
            </p>
          </div>

          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              soundFX.playClick();
              onNavigate('office-hours');
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>{isAr ? 'استعراض كافة الأساتذة (6)' : 'View All Faculty (6)'}</span>
            <NextArrow size={16} />
          </button>
        </div>

        {/* Faculty Grid */}
        <div className="showcase-grid">
          {featuredFaculty.map(faculty => {
            const avatarChar = faculty.name.split(' ').slice(1, 2)[0]?.charAt(0) || 'د';

            return (
              <div
                key={faculty.id}
                className="tutoring-card showcase-deluxe-card"
                data-testid={`showcase-faculty-${faculty.id}`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="tutoring-top-bar">
                    <span className="course-code-badge">
                      <UserCheck size={13} color="var(--fbsu-primary)" />
                      <span>{isAr ? faculty.badge : faculty.badgeEn || faculty.badge}</span>
                    </span>

                    <div className="tutor-rate-badge">
                      <span className="tutor-rate-num" style={{ fontSize: '1.05rem' }}>
                        {isAr ? 'ساعات مكتبية' : 'Office Hours'}
                      </span>
                      <span className="tutor-rate-unit">
                        {isAr ? 'استشارة مجانية' : 'Free 1-on-1'}
                      </span>
                    </div>
                  </div>

                  {/* Profile Strip */}
                  <div className="tutor-profile-strip">
                    <div
                      className="tutor-avatar-circle"
                      style={{
                        background: faculty.avatarColor,
                        borderColor: 'rgba(215, 162, 55, 0.4)',
                      }}
                    >
                      {avatarChar}
                    </div>
                    <div className="tutor-info-meta">
                      <div className="tutor-title-row">
                        <span className="tutor-name">{isAr ? faculty.name : faculty.nameEn}</span>
                        <span className="tutor-badge-tag">
                          {isAr ? faculty.badge : faculty.badgeEn || faculty.badge}
                        </span>
                      </div>
                      <div className="tutor-college-text">
                        {isAr ? faculty.rank : faculty.rankEn}
                      </div>
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
                        <span>★ 5.0</span>
                        <span style={{ color: 'var(--text-dim)' }}>
                          ({isAr ? 'تقييم إرشاد ممتاز' : 'Top Mentor Rating'})
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4 className="showcase-card-title">
                    {isAr ? faculty.rank : faculty.rankEn}
                  </h4>

                  {/* Inset Scope Box */}
                  <div className="tutoring-content-box">
                    <div className="lectures-scope-title">
                      <BookOpen size={14} color="var(--fbsu-gold)" />
                      <span>{isAr ? 'مجالات الإرشاد والمتابعة المعتمدة' : 'Advising Focus'}</span>
                    </div>
                    <div className="lectures-scope-desc">
                      {isAr
                        ? 'مناقشة مشاريع التخرج، أطروحات الماجستير، الخطط الدراسية، ومعادلة المقررات الأكاديمية والتوجيه المهني.'
                        : 'Senior capstone advising, master thesis supervision, degree plans, and course equivalence.'}
                    </div>
                  </div>

                  {/* Meta Details Row */}
                  <div className="tutoring-meta-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} color="var(--text-dim)" />
                      <span>
                        {faculty.office ||
                          (isAr ? 'مكتب العمادة - مبنى الإدارة' : 'Dean Office - Admin Bldg')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} color="var(--fbsu-gold)" />
                      <strong style={{ color: 'var(--fbsu-gold)' }}>
                        {isAr
                          ? faculty.nextAvailable
                          : faculty.nextAvailableEn || faculty.nextAvailable}
                      </strong>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.76rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <Users size={13} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'جلسة فردية مباشرة 1-on-1 (30 دقيقة)'
                        : '1-on-1 In-Person Session (30 mins)'}
                    </span>
                  </div>

                  {/* Routing / Security Notice */}
                  <div className="wallet-routing-notice">
                    <ShieldCheck size={14} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'حجز مباشر في الأجندة الرسمية للعمادة مع تنبيه فوري عبر الرسائل والتقويم.'
                        : 'Official calendar booking with instant confirmation & SMS alert.'}
                    </span>
                  </div>
                </div>

                {/* Golden CTA Button */}
                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => {
                    soundFX.playClick();
                    onNavigate('office-hours');
                  }}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.85rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <UserCheck size={16} />
                  <span>{isAr ? 'حجز موعد استشارة' : 'Book Office Hour'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SECTION: Peer Tutoring & AI-Assisted Academic Support */}
      <section className="showcase-section" style={{ marginBottom: '4rem' }}>
        <div
          className="section-head"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <span
              className="section-eyebrow"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--fbsu-primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              <BookOpen size={16} />
              <span>
                {isAr ? 'شروحات الأقران ودعم المتفوقين' : 'Peer Tutoring & Student Success'}
              </span>
            </span>
            <h3
              className="section-title"
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                marginTop: '0.35rem',
              }}
            >
              {isAr
                ? 'جلسات المذاكرة المعتمدة مع نخبة طلاب الشرف (70 ر.س / ساعة)'
                : 'Certified Peer Tutoring by Honor Students (70 SAR / hr)'}
            </h3>
            <p
              className="section-subtitle"
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.92rem',
                maxWidth: '780px',
                marginTop: '0.25rem',
              }}
            >
              {isAr
                ? 'جلسات تقوية معتمدة لنماذج الاختبارات والبرمجة وحل المسائل الهندسية، مع خصم الرسوم تلقائياً من محفظتك الجامعية.'
                : 'Boost your academic performance with peer tutoring in algorithms, calculus, logic design, and physics.'}
            </p>
          </div>

          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              soundFX.playClick();
              onNavigate('tutoring');
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>{isAr ? 'استعراض كافة الشروحات (6)' : 'View All Sessions (6)'}</span>
            <NextArrow size={16} />
          </button>
        </div>

        {/* Tutoring Grid - EXACT MATCH to Reference Design */}
        <div className="showcase-grid">
          {featuredTutoring.map(session => (
            <div
              key={session.id}
              className="tutoring-card showcase-deluxe-card"
              data-testid={`showcase-tutoring-${session.id}`}
            >
              <div>
                {/* Top Bar */}
                <div className="tutoring-top-bar">
                  <span className="course-code-badge">
                    <Award size={13} color="var(--fbsu-primary)" />
                    <span>{session.courseCode}</span>
                  </span>

                  <div className="tutor-rate-badge">
                    <span className="tutor-rate-num">
                      {session.hourlyRate} {isAr ? 'ر.س' : 'SAR'}
                    </span>
                    <span className="tutor-rate-unit">{isAr ? 'للساعة الواحدة' : 'per hour'}</span>
                  </div>
                </div>

                {/* Tutor Profile Strip */}
                <div className="tutor-profile-strip">
                  <div
                    className="tutor-avatar-circle"
                    style={{ background: session.tutorAvatarColor }}
                  >
                    {session.tutorName.charAt(0)}
                  </div>
                  <div className="tutor-info-meta">
                    <div className="tutor-title-row">
                      <span className="tutor-name">
                        {isAr ? session.tutorName : session.tutorNameEn || session.tutorName}
                      </span>
                      <span className="tutor-badge-tag">{isAr ? 'طالب متميز' : 'Honor Tutor'}</span>
                    </div>
                    <div className="tutor-college-text">
                      {isAr ? session.tutorRole : session.tutorRoleEn || session.tutorRole}
                    </div>
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
                      <span>★ {session.rating}</span>
                      <span style={{ color: 'var(--text-dim)' }}>
                        ({session.reviewsCount} {isAr ? 'تقييم طالب' : 'reviews'})
                      </span>
                    </div>
                  </div>
                </div>

                <h4 className="showcase-card-title">
                  {isAr ? session.courseName : session.courseNameEn}
                </h4>

                {/* Scope Box */}
                <div className="tutoring-content-box">
                  <div className="lectures-scope-title">
                    <BookOpen size={14} color="var(--fbsu-gold)" />
                    <span>{session.coveredLectures}</span>
                  </div>
                  <div className="lectures-scope-desc">{session.coveredScope}</div>
                </div>

                {/* Meta details */}
                <div className="tutoring-meta-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} color="var(--text-dim)" />
                    <span>
                      {session.dateTime} ({session.durationHours}h)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="var(--text-dim)" />
                    <span>{session.location}</span>
                  </div>
                </div>

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
                      ? `المسجلون حالياً: ${session.enrolledStudents.length} / ${session.maxCapacity || 10}`
                      : `Enrolled: ${session.enrolledStudents.length} / ${session.maxCapacity || 10}`}
                  </span>
                </div>

                {/* University Balance routing notice */}
                <div className="wallet-routing-notice">
                  <ShieldCheck size={14} color="var(--fbsu-primary)" />
                  <span>
                    {isAr
                      ? `يتم تحويل ${session.totalPrice} ر.س كرصيد جامعي للطالب ${session.tutorName.split(' ')[0]} لسداد رسوم جامعته.`
                      : `${session.totalPrice} SAR transfers directly to official university tuition credit.`}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="btn-gold book-tutoring-btn"
                onClick={() => {
                  soundFX.playClick();
                  onNavigate('tutoring');
                }}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.85rem',
                  fontSize: '0.9rem',
                }}
              >
                <Wallet size={16} color="#0b1a17" />
                <span>
                  {isAr
                    ? `حجز الجلسة وسداد ${session.totalPrice} ر.س`
                    : `Book & Settle ${session.totalPrice} SAR`}
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SECTION: Smart Auxiliary University Services (Shuttles, Dining & Wallet) */}
      <section className="showcase-section" style={{ marginBottom: '2.5rem' }}>
        <div className="section-head" style={{ marginBottom: '1.75rem' }}>
          <span
            className="section-eyebrow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--fbsu-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            <Building2 size={16} />
            <span>
              {isAr ? 'الخدمات الطلابية واللوجستية الموحدة' : 'Unified Auxiliary Campus Services'}
            </span>
          </span>
          <h3
            className="section-title"
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginTop: '0.35rem',
            }}
          >
            {isAr
              ? 'الحياة الجامعية الذكية: النقل الترددي، المطاعم، والمحفظة الرقمية'
              : 'Smart Campus Life: Shuttle Fleet, Dining & Campus Wallet'}
          </h3>
        </div>

        <div className="showcase-grid">
          {/* Service 1: Shuttle Fleet */}
          <div className="tutoring-card showcase-deluxe-card">
            <div>
              <div className="tutoring-top-bar">
                <span className="course-code-badge">
                  <Bus size={13} color="var(--fbsu-primary)" />
                  <span>FBSU-EXPRESS</span>
                </span>

                <div className="tutor-rate-badge">
                  <span className="tutor-rate-num" style={{ color: '#10b981', fontSize: '1.1rem' }}>
                    {isAr ? 'مباشر GPS' : 'Live GPS'}
                  </span>
                  <span className="tutor-rate-unit">{isAr ? 'مجاني للطلاب' : 'Free for All'}</span>
                </div>
              </div>

              <div className="tutor-profile-strip">
                <div
                  className="tutor-avatar-circle"
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                  }}
                >
                  <Bus size={22} color="#ffffff" />
                </div>
                <div className="tutor-info-meta">
                  <div className="tutor-title-row">
                    <span className="tutor-name">
                      {isAr ? 'أسطول الحافلات الترددية' : 'FBSU Express Shuttle'}
                    </span>
                    <span className="tutor-badge-tag">
                      {isAr ? 'أسطول كهربائي نشط' : 'Electric Fleet'}
                    </span>
                  </div>
                  <div className="tutor-college-text">
                    {isAr ? '4 حافلات كهربائية نشطة في المسار' : '4 Zero-Emission Shuttles Active'}
                  </div>
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
                    <span>★ 4.96</span>
                    <span style={{ color: 'var(--text-dim)' }}>
                      ({isAr ? 'تواتر كل 7 دقائق' : 'Every 7 mins'})
                    </span>
                  </div>
                </div>
              </div>

              <h4 className="showcase-card-title">
                {isAr
                  ? 'النقل الترددي الذكي المباشر بالحرم الجامعي'
                  : 'Zero-Emission Campus Shuttle Network'}
              </h4>

              <div className="tutoring-content-box">
                <div className="lectures-scope-title">
                  <Navigation size={14} color="var(--fbsu-gold)" />
                  <span>{isAr ? 'المسار النشط ومواعيد الوصول الحية' : 'Live Route & Arrival'}</span>
                </div>
                <div className="lectures-scope-desc">
                  {isAr
                    ? 'خدمة نقل كهربائي مجانية تربط البوابة الرئيسية، مجمع الهندسة، المكتبة، ومباني السكن الطلابي كل 7 دقائق. الحافلة القادمة لمحطة الهندسة: تصل خلال 3 دقائق.'
                    : 'Free electric shuttle connecting Main Gate, Engineering complex, Library, and Residences every 7 minutes. Next stop arrival: 3 mins.'}
                </div>
              </div>

              <div className="tutoring-meta-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} color="var(--text-dim)" />
                  <span>07:30 ص - 05:00 م</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} color="var(--text-dim)" />
                  <span>{isAr ? 'كافة محطات الكليات والسكن' : 'All Campus Stations'}</span>
                </div>
              </div>

              <div className="wallet-routing-notice">
                <ShieldCheck size={14} color="var(--fbsu-primary)" />
                <span>
                  {isAr
                    ? 'تتبع مباشر عبر الـ GPS ومتصل بالبطاقة الجامعية الرقمية.'
                    : 'Real-time GPS tracking integrated with digital student ID.'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-gold"
              onClick={() => {
                soundFX.playClick();
                onNavigate('bus');
              }}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                fontSize: '0.9rem',
              }}
            >
              <Bus size={16} />
              <span>{isAr ? 'استعراض مواعيد وخطوط الحافلات' : 'View Live Shuttle Tracker'}</span>
            </button>
          </div>

          {/* Service 2: Smart Dining */}
          <div className="tutoring-card showcase-deluxe-card">
            <div>
              <div className="tutoring-top-bar">
                <span className="course-code-badge">
                  <UtensilsCrossed size={13} color="var(--fbsu-primary)" />
                  <span>FBSU-DINING</span>
                </span>

                <div className="tutor-rate-badge">
                  <span className="tutor-rate-num" style={{ color: 'var(--fbsu-gold)', fontSize: '1.1rem' }}>
                    {isAr ? 'خصم 20%' : '20% OFF'}
                  </span>
                  <span className="tutor-rate-unit">{isAr ? 'طلب مسبق' : 'Order Ahead'}</span>
                </div>
              </div>

              <div className="tutor-profile-strip">
                <div
                  className="tutor-avatar-circle"
                  style={{
                    background: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)',
                    borderColor: 'rgba(245, 158, 11, 0.4)',
                  }}
                >
                  <UtensilsCrossed size={22} color="#ffffff" />
                </div>
                <div className="tutor-info-meta">
                  <div className="tutor-title-row">
                    <span className="tutor-name">
                      {isAr ? 'المطاعم والكافيهات الجامعية' : 'Campus Cafes & Dining'}
                    </span>
                    <span className="tutor-badge-tag">
                      {isAr ? 'استلام فوري' : 'Fast Pickup'}
                    </span>
                  </div>
                  <div className="tutor-college-text">
                    {isAr ? 'ستاربكس • مطعم الحرم المركزي' : 'Starbucks & Campus Food Court'}
                  </div>
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
                    <span>★ 4.94</span>
                    <span style={{ color: 'var(--text-dim)' }}>
                      ({isAr ? 'خصم فوري للمحفظة' : 'Instant Wallet Discount'})
                    </span>
                  </div>
                </div>
              </div>

              <h4 className="showcase-card-title">
                {isAr
                  ? 'الطلب المسبق السريع والاستلام بدون انتظار'
                  : 'Fast Pickup & Mobile Student Dining'}
              </h4>

              <div className="tutoring-content-box">
                <div className="lectures-scope-title">
                  <Coffee size={14} color="var(--fbsu-gold)" />
                  <span>{isAr ? 'عروض اليوم الحصرية للطلاب' : 'Today Exclusive Combos'}</span>
                </div>
                <div className="lectures-scope-desc">
                  {isAr
                    ? 'استمتع بقوائم الطعام الطازجة والقهوة المختصة مع خصم فوري 20% للطلاب مخصوم مباشرة من محفظتك الجامعية بدون بطاقات بنكية.'
                    : 'Order healthy bowls and specialty coffee with 20% student discount deducted instantly from your campus wallet.'}
                </div>
              </div>

              <div className="tutoring-meta-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} color="var(--text-dim)" />
                  <span>{isAr ? 'استلام خلال 5-10 دقائق' : 'Ready in 5-10 mins'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} color="var(--text-dim)" />
                  <span>{isAr ? 'المطعم المركزي وستاربكس' : 'Central Hall & Starbucks'}</span>
                </div>
              </div>

              <div className="wallet-routing-notice">
                <ShieldCheck size={14} color="var(--fbsu-primary)" />
                <span>
                  {isAr
                    ? 'دفع فوري مخصوم من الرصيد الجامعي مع فاتورة إلكترونية معتمدة.'
                    : 'Seamless institutional wallet settlement with e-receipt.'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-gold"
              onClick={() => {
                soundFX.playClick();
                onNavigate('dining');
              }}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                fontSize: '0.9rem',
              }}
            >
              <UtensilsCrossed size={16} />
              <span>{isAr ? 'استعراض المطاعم والوجبات' : 'Browse Dining Menus'}</span>
            </button>
          </div>

          {/* Service 3: Campus Digital Wallet */}
          <div className="tutoring-card showcase-deluxe-card">
            <div>
              <div className="tutoring-top-bar">
                <span className="course-code-badge">
                  <Wallet size={13} color="var(--fbsu-primary)" />
                  <span>FBSU-WALLET</span>
                </span>

                <div className="tutor-rate-badge">
                  <span className="tutor-rate-num" style={{ color: '#10b981', fontSize: '1.1rem' }}>
                    {walletBalance.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
                  </span>
                  <span className="tutor-rate-unit">{isAr ? 'الرصيد المتاح' : 'Balance'}</span>
                </div>
              </div>

              <div className="tutor-profile-strip">
                <div
                  className="tutor-avatar-circle"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
                    borderColor: 'rgba(52, 211, 153, 0.4)',
                  }}
                >
                  <Wallet size={22} color="#ffffff" />
                </div>
                <div className="tutor-info-meta">
                  <div className="tutor-title-row">
                    <span className="tutor-name">
                      {isAr ? 'المحفظة الرقمية والرسوم' : 'Digital Campus Wallet'}
                    </span>
                    <span className="tutor-badge-tag">
                      {isAr ? 'معاملات فورية' : 'Zero-Fee Transfer'}
                    </span>
                  </div>
                  <div className="tutor-college-text">
                    {isAr ? 'الحساب المالي الموحد للطالب' : 'Unified Financial Ledger'}
                  </div>
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
                    <span>★ 4.99</span>
                    <span style={{ color: 'var(--text-dim)' }}>
                      ({isAr ? 'شحن Mada و Apple Pay' : 'Mada & Apple Pay'})
                    </span>
                  </div>
                </div>
              </div>

              <h4 className="showcase-card-title">
                {isAr
                  ? 'إدارة الرصيد الجامعي وسداد الرسوم والمواقف'
                  : 'Integrated Tuition & Campus Micro-Payments'}
              </h4>

              <div className="tutoring-content-box">
                <div className="lectures-scope-title">
                  <CreditCard size={14} color="var(--fbsu-gold)" />
                  <span>{isAr ? 'خدمات المحفظة المالية المعتمدة' : 'Unified Financial Scope'}</span>
                </div>
                <div className="lectures-scope-desc">
                  {isAr
                    ? 'محفظتك المالية الموحدة لحجز المواقف الذكية، سداد شروحات الأقران، تسوية الرسوم الدراسية، وشحن الرصيد الآمن عبر Mada و Apple Pay بدون رسوم.'
                    : 'Institutional wallet for smart parking, peer tutoring settlements, tuition deductions, and instant P2P peer transfers.'}
                </div>
              </div>

              <div className="tutoring-meta-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} color="var(--text-dim)" />
                  <span>{isAr ? 'تسوية آنية 24/7' : '24/7 Instant Clearing'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CreditCard size={14} color="var(--text-dim)" />
                  <span>مدى • أبل باي • تحويل أقران</span>
                </div>
              </div>

              <div className="wallet-routing-notice">
                <ShieldCheck size={14} color="var(--fbsu-primary)" />
                <span>
                  {isAr
                    ? 'نظام دفع مالي آمن ومعتمد متصل بوزارة التعليم وعمادة القبول.'
                    : 'Certified ledger linked to the university registrar & MOE.'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-gold"
              onClick={() => {
                soundFX.playClick();
                onNavigate('wallet');
              }}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                fontSize: '0.9rem',
              }}
            >
              <Wallet size={16} />
              <span>{isAr ? 'إدارة المحفظة وشحن الرصيد' : 'Manage Campus Wallet'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
