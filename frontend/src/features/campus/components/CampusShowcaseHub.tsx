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
      <section className="showcase-section" style={{ marginBottom: '3.5rem' }}>
        <div
          className="section-head"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {featuredRooms.map(room => {
            const isAvailable = room.status === 'available';
            const statusColor = isAvailable
              ? '#10b981'
              : room.status === 'in-use'
                ? '#f59e0b'
                : '#3b82f6';
            const statusLabel = isAvailable
              ? isAr
                ? 'متاحة للحجز الفوري'
                : 'Available Now'
              : room.status === 'in-use'
                ? isAr
                  ? 'جلسة نشطة حالياً'
                  : 'Session Active'
                : isAr
                  ? 'محجوزة مسبقاً'
                  : 'Reserved';

            return (
              <div
                key={room.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.25s ease',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        background: 'rgba(13, 148, 136, 0.15)',
                        color: 'var(--fbsu-primary)',
                        border: '1px solid rgba(13, 148, 136, 0.3)',
                      }}
                    >
                      {isAr ? room.typeBadge : room.typeBadgeEn || room.typeBadge}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: statusColor,
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: statusColor,
                          boxShadow: `0 0 8px ${statusColor}`,
                        }}
                      />
                      <span>{statusLabel}</span>
                    </span>
                  </div>

                  <h4
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {isAr ? room.name : room.nameEn || room.name}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-dim)',
                      marginBottom: '0.85rem',
                    }}
                  >
                    {isAr ? room.building : room.buildingEn || room.building}
                  </p>

                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <DoorClosed size={14} color="var(--fbsu-gold)" />
                    <span>{isAr ? room.capacity : room.capacityEn || room.capacity}</span>
                  </div>

                  {room.specs && room.specs.length > 0 && (
                    <ul
                      style={{
                        margin: '0 0 1.25rem 0',
                        paddingInlineStart: '1.1rem',
                        fontSize: '0.78rem',
                        color: 'var(--text-dim)',
                        lineHeight: 1.6,
                      }}
                    >
                      {(isAr ? room.specs : room.specsEn || room.specs)
                        .slice(0, 2)
                        .map((spec, sIdx) => (
                          <li key={sIdx}>{spec}</li>
                        ))}
                    </ul>
                  )}
                </div>

                <button
                  type="button"
                  className={isAvailable ? 'btn-primary' : 'btn-glass'}
                  onClick={() => {
                    soundFX.playClick();
                    onNavigate('rooms');
                  }}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    padding: '0.65rem 1rem',
                  }}
                >
                  <DoorClosed size={15} />
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
      <section className="showcase-section" style={{ marginBottom: '3.5rem' }}>
        <div
          className="section-head"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {featuredFaculty.map(faculty => (
            <div
              key={faculty.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(15, 23, 42, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: faculty.avatarColor,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.15rem',
                      boxShadow: `0 4px 12px ${faculty.avatarColor}55`,
                      flexShrink: 0,
                    }}
                  >
                    {faculty.name.split(' ').slice(1, 2)[0]?.charAt(0) || 'د'}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        margin: 0,
                      }}
                    >
                      {isAr ? faculty.name : faculty.nameEn}
                    </h4>
                    <span
                      style={{ fontSize: '0.76rem', color: 'var(--fbsu-gold)', fontWeight: 600 }}
                    >
                      {isAr ? faculty.badge : faculty.badgeEn || faculty.badge}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.85rem',
                    lineHeight: 1.5,
                  }}
                >
                  {isAr ? faculty.rank : faculty.rankEn}
                </p>

                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.1rem',
                    fontSize: '0.78rem',
                  }}
                >
                  <div style={{ color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
                    {isAr ? 'أقرب موعد متاح:' : 'Next Available Slot:'}
                  </div>
                  <strong style={{ color: 'var(--fbsu-primary)' }}>
                    {isAr
                      ? faculty.nextAvailable
                      : faculty.nextAvailableEn || faculty.nextAvailable}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="btn-gold"
                onClick={() => {
                  soundFX.playClick();
                  onNavigate('office-hours');
                }}
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              >
                <UserCheck size={15} />
                <span>{isAr ? 'حجز موعد استشارة' : 'Book Office Hour'}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION: Peer Tutoring & AI-Assisted Academic Support */}
      <section className="showcase-section" style={{ marginBottom: '3.5rem' }}>
        <div
          className="section-head"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
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

        {/* Tutoring Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {featuredTutoring.map(session => (
            <div
              key={session.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(15, 23, 42, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: 'var(--fbsu-gold)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    {session.courseCode}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ⭐ {session.rating}{' '}
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                      ({session.reviewsCount})
                    </span>
                  </span>
                </div>

                <h4
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '0.45rem',
                  }}
                >
                  {isAr ? session.courseName : session.courseNameEn}
                </h4>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: session.tutorAvatarColor,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    {session.tutorName.charAt(0)}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {isAr ? session.tutorName : session.tutorNameEn || session.tutorName}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-dim)',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                  }}
                >
                  {session.coveredScope}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '0.85rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>
                    {isAr ? 'رسوم الجلسة (ساعة):' : 'Session Fee:'}
                  </span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--fbsu-primary)' }}>
                    {session.hourlyRate} {isAr ? 'ر.س' : 'SAR'}
                  </strong>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    soundFX.playClick();
                    onNavigate('tutoring');
                  }}
                  style={{ fontSize: '0.82rem', padding: '0.55rem 0.95rem' }}
                >
                  <BookOpen size={14} />
                  <span>{isAr ? 'حجز وحضور الجلسة' : 'Enroll Session'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SECTION: Smart Auxiliary University Services (Shuttles, Dining & Wallet) */}
      <section className="showcase-section" style={{ marginBottom: '2.5rem' }}>
        <div className="section-head" style={{ marginBottom: '1.5rem' }}>
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* Service 1: Shuttle Fleet */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(15, 23, 42, 0.65)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(14, 165, 233, 0.15)',
                  color: '#0ea5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bus size={22} />
              </div>
              <div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                  }}
                >
                  {isAr ? 'أسطول الحافلات الترددية FBSU Express' : 'FBSU Express Shuttle Fleet'}
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                  ● {isAr ? 'مباشر: 4 حافلات نشطة في المسار' : 'Live: 4 Active Shuttles on Route'}
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginBottom: '1rem',
              }}
            >
              {isAr
                ? 'خدمة نقل كهربائي ترددي مجانية تربط البوابة الرئيسية، مجمع الهندسة، المكتبة، ومباني السكن الطلابي كل 7 دقائق.'
                : 'Free zero-emission electric shuttle buses circulating between the Main Gate, Engineering complex, Library, and Student Residences every 7 minutes.'}
            </p>

            <div
              style={{
                padding: '0.65rem 0.85rem',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                marginBottom: '1rem',
              }}
            >
              <div>
                🚌{' '}
                {isAr
                  ? 'الحافلة القادمة لمحطة الهندسة: تصل خلال 3 دقائق'
                  : 'Next Bus at Engineering Stop: Arrives in 3 mins'}
              </div>
            </div>

            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                soundFX.playClick();
                onNavigate('bus');
              }}
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
            >
              <span>{isAr ? 'استعراض مواعيد وخطوط الحافلات' : 'View Live Shuttle Tracker'}</span>
              <NextArrow size={14} />
            </button>
          </div>

          {/* Service 2: Smart Dining */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(15, 23, 42, 0.65)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--fbsu-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UtensilsCrossed size={22} />
              </div>
              <div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                  }}
                >
                  {isAr ? 'المطاعم والكافيهات الجامعية' : 'Campus Dining & Cafeterias'}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--fbsu-gold)', fontWeight: 700 }}>
                  {isAr ? 'طلب مسبق واستلام سريع بدون انتظار' : 'Pre-order & Fast Pickup'}
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginBottom: '1rem',
              }}
            >
              {isAr
                ? 'استمتع بقوائم الطعام الطازجة ومشروبات القهوة المختصة في ستاربكس ومطعم الحرم المركزي مع الخصم الفوري من المحفظة.'
                : 'Browse menus, order ahead from campus cafes and Starbucks, and pay seamlessly using your institutional campus wallet.'}
            </p>

            <div
              style={{
                padding: '0.65rem 0.85rem',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                marginBottom: '1rem',
              }}
            >
              <div>
                ☕{' '}
                {isAr
                  ? 'عروض اليوم: خصم 20% للطلاب على وجبات الغداء الصحية'
                  : 'Today Special: 20% Student Discount on Healthy Lunch Combos'}
              </div>
            </div>

            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                soundFX.playClick();
                onNavigate('dining');
              }}
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
            >
              <span>{isAr ? 'استعراض المطاعم والوجبات' : 'Browse Dining Menus'}</span>
              <NextArrow size={14} />
            </button>
          </div>

          {/* Service 3: Campus Digital Wallet */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(15, 23, 42, 0.65)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Wallet size={22} />
              </div>
              <div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                  }}
                >
                  {isAr ? 'المحفظة الرقمية والرسوم' : 'Campus Digital Wallet'}
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                  {isAr
                    ? `الرصيد المتاح: ${walletBalance.toFixed(2)} ر.س`
                    : `Balance: ${walletBalance.toFixed(2)} SAR`}
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginBottom: '1rem',
              }}
            >
              {isAr
                ? 'محفظتك المالية الموحدة لحجز المواقف، شروحات الأقران، سداد الرسوم الدراسية، وشحن الرصيد الآمن عبر Mada و Apple Pay.'
                : 'Your unified financial hub for parking tariffs, tutoring, tuition invoices, and instant Mada / Apple Pay top-ups.'}
            </p>

            <div
              style={{
                padding: '0.65rem 0.85rem',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                marginBottom: '1rem',
              }}
            >
              <div>
                💳{' '}
                {isAr
                  ? 'معاملات فورية خالية من الرسوم الإضافية بين الطلاب'
                  : 'Zero-fee instant peer transfers with audit trail'}
              </div>
            </div>

            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                soundFX.playClick();
                onNavigate('wallet');
              }}
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
            >
              <span>{isAr ? 'إدارة المحفظة وشحن الرصيد' : 'Manage Wallet & Top Up'}</span>
              <NextArrow size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Institutional Accreditation Banner */}
      <section
        style={{
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-lg)',
          background:
            'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(13, 148, 136, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--fbsu-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <div>
            <h4
              style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}
            >
              {isAr
                ? 'منظومة معتمدة ومطابقة لأعلى معايير الأمن السيبراني والجودة'
                : 'Institutional Accreditation & Cybersecurity Certified'}
            </h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              {isAr
                ? 'مرخصة ومطابقة لضوابط الهيئة الوطنية للأمن السيبراني NCA والاعتماد المؤسسي الكامل لجامعة فهد بن سلطان.'
                : 'Compliant with Saudi National Cybersecurity Authority (NCA) standards and accredited by Ministry of Education.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.35rem 0.75rem',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-main)',
            }}
          >
            NCA ECC-1:2018
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.35rem 0.75rem',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-main)',
            }}
          >
            ABET Accredited
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.35rem 0.75rem',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-main)',
            }}
          >
            NCAAA Institutional
          </span>
        </div>
      </section>
    </div>
  );
};
