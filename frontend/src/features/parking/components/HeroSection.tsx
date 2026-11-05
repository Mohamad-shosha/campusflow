import { FC } from 'react';
import {
  Sparkles,
  MapPin,
  BookOpen,
  UserCheck,
  DoorClosed,
  Car,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { soundFX } from '../../../shared/utils/sound';

export interface HeroSectionProps {
  isAr: boolean;
  totalSpots: number;
  availableCount: number;
  flexCount: number;
  onNavigate: (tab: string) => void;
}

export const HeroSection: FC<HeroSectionProps> = ({
  isAr,
  totalSpots,
  availableCount,
  flexCount,
  onNavigate,
}) => {
  return (
    <section className="hero-section">
      <div className="hero-backdrop"></div>
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-tag">
              <Sparkles size={14} color="#38c2b0" />
              <span>
                {isAr
                  ? 'مبادرة التحول الرقمي بالذكاء الاصطناعي - جامعة فهد بن سلطان'
                  : 'AI Digital Transformation - FBSU Campus'}
              </span>
            </div>
            <h2 className="hero-title">
              {isAr ? (
                <>
                  مواقف ذكية بتبادل مرن تلقائي{' '}
                  <span className="highlight">دون إهدار لأي موقف</span>
                </>
              ) : (
                <>
                  Smart Parking with AI Flex Sharing{' '}
                  <span className="highlight">Zero Wasted Spaces</span>
                </>
              )}
            </h2>
            <p className="hero-desc">
              {isAr
                ? 'حل هندسي متكامل ينهي أزمة مواقف الجامعة: عندما يغادر الطالب في أوقات البريك (2-4 ساعات)، يتعرف النظام تلقائياً على خروجه عبر كاميرات قراءة اللوحات (ALPR) ويفتح الموقف لزميله القادم للمحاضرة، مع كسب رصيد مكافأة وحجز متوافق مع جداول الكليات!'
                : 'An intelligent platform solving campus parking congestion: when a student leaves during breaks (2-4 hrs), AI ALPR cameras detect departure and dynamically reallocate the spot to incoming students based on class schedules, earning cashback rewards!'}
            </p>
            <div className="hero-cta-group">
              <button
                className="btn-primary"
                onClick={() => {
                  soundFX.playClick();
                  onNavigate('map');
                }}
                type="button"
              >
                <MapPin size={18} color="#ffffff" />
                <span>{isAr ? 'خريطة المواقف' : 'Explore Parking'}</span>
              </button>
              <button
                className="btn-gold"
                onClick={() => {
                  soundFX.playClick();
                  onNavigate('tutoring');
                }}
                type="button"
              >
                <BookOpen size={18} color="#0b1a17" />
                <span>{isAr ? 'شروحات الأقران (70 ر.س)' : 'Peer Tutoring (70 SAR)'}</span>
              </button>
              <button
                className="btn-outline"
                onClick={() => {
                  soundFX.playClick();
                  onNavigate('office-hours');
                }}
                type="button"
              >
                <UserCheck size={18} />
                <span>{isAr ? 'الساعات المكتبية (د. رغد ود. محمد مزهر)' : 'Office Hours'}</span>
              </button>
              <button
                className="btn-outline"
                onClick={() => {
                  soundFX.playClick();
                  onNavigate('rooms');
                }}
                type="button"
              >
                <DoorClosed size={18} />
                <span>{isAr ? 'حجز القاعات والمعامل' : 'Study Pods & Labs'}</span>
              </button>
            </div>
          </div>

          {/* Feature Showcase Card */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderColor: 'var(--fbsu-primary-border)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--fbsu-primary-light)',
                    color: 'var(--fbsu-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={22} color="var(--fbsu-primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {isAr ? 'مبدأ التبادل الذكي (Flex Share)' : 'Smart Flex Share Logic'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'نموذج محاكاة واقعي للتبادل الذكي بين الطلاب' : 'Realistic Student Flex Sharing Model'}
                  </span>
                </div>
              </div>
              <span className="badge badge-flex">
                <Zap size={13} color="var(--fbsu-gold)" />
                {isAr ? 'نشط الآن' : 'Active'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--fbsu-primary-light)',
                    color: 'var(--fbsu-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {isAr ? 'رصد خروج إياد بالذكاء الاصطناعي' : 'AI Detection of Eyad Departure'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {isAr
                      ? 'كاميرا البوابة تقرأ لوحة (ب ط ك 1234) وترصد خروج إياد في بريك 3 ساعات.'
                      : 'Gate camera reads plate (ب ط ك 1234) and logs Eyad leaving on a 3-hour break.'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--fbsu-gold-light)',
                    color: 'var(--fbsu-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {isAr ? 'تحويل الموقف #01 إلى "تبادل ذكي"' : 'Convert Bay #01 to "AI Flex"'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {isAr
                      ? 'بدل إهدار الموقف فارغاً، يفتحه النظام تلقائياً لمن لديه كلاس بنفس التوقيت.'
                      : 'Instead of wasting the spot, the system reallocates it to incoming students.'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--fbsu-primary-light)',
                    color: 'var(--fbsu-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  3
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {isAr ? 'توجيه راكان وربح إياد للمكافأة' : 'Guide Rakan & Reward Eyad'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {isAr
                      ? 'راكان يركن فور وصوله، وإياد يكسب 17.25 ر.س في محفظته الجامعية!'
                      : 'Rakan parks immediately, and Eyad earns 17.25 SAR in his university balance!'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Stats Banner */}
        <div className="hero-stats-banner">
          <div className="stat-chip">
            <div className="stat-chip-icon">
              <Car size={22} color="var(--fbsu-primary)" />
            </div>
            <div>
              <div className="stat-chip-num">{totalSpots}</div>
              <div className="stat-chip-label">{isAr ? 'إجمالي مواقف القطاع' : 'Total Pilot Bays'}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-chip-icon"
              style={{ background: 'var(--status-available-bg)', color: 'var(--status-available)' }}
            >
              <CheckCircle2 size={22} color="var(--status-available)" />
            </div>
            <div>
              <div className="stat-chip-num" style={{ color: 'var(--status-available)' }}>
                {availableCount}
              </div>
              <div className="stat-chip-label">{isAr ? 'مواقف شاغرة الآن' : 'Available Right Now'}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-chip-icon"
              style={{ background: 'var(--fbsu-gold-light)', color: 'var(--fbsu-gold)' }}
            >
              <RefreshCw size={22} color="var(--fbsu-gold)" />
            </div>
            <div>
              <div className="stat-chip-num" style={{ color: 'var(--fbsu-gold)' }}>
                {flexCount}
              </div>
              <div className="stat-chip-label">{isAr ? 'مواقف بالتبادل الذكي' : 'In Flex Mode'}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div className="stat-chip-icon">
              <ShieldCheck size={22} color="var(--fbsu-primary)" />
            </div>
            <div>
              <div className="stat-chip-num">99.4%</div>
              <div className="stat-chip-label">{isAr ? 'دقة قارئ اللوحات' : 'ALPR Accuracy'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
