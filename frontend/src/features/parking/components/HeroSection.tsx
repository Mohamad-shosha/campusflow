import { FC, type ComponentType } from 'react';
import {
  Car,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Calendar,
  Camera,
  BookOpen,
  UserCheck,
  DoorClosed,
  Bus,
  Wallet,
  GraduationCap,
  ArrowUpRight,
  Sparkles,
  QrCode,
  Languages,
  ArrowDown,
} from 'lucide-react';
import { soundFX } from '../../../shared/utils/sound';

export interface HeroSectionProps {
  isAr: boolean;
  totalSpots: number;
  availableCount: number;
  flexCount: number;
  /** True until parking data has been loaded from the API; figures show as '—' */
  isLoading?: boolean | undefined;
  /** True when parking data could not be loaded; figures show as '—' with an "unavailable" badge */
  isUnavailable?: boolean | undefined;
  onNavigate: (tab: string) => void;
}

type ServiceGroup = 'parking' | 'campus' | 'finance';

interface ServiceLink {
  tab: string;
  group: ServiceGroup;
  icon: ComponentType<{ size?: number | string }>;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
}

const GROUP_LABELS: Record<ServiceGroup, { ar: string; en: string }> = {
  parking: { ar: 'المواقف', en: 'Parking' },
  campus: { ar: 'الحرم الجامعي', en: 'Campus' },
  finance: { ar: 'المالية', en: 'Finance' },
};

// Ordered for a balanced 3 x 3 grid: parking, campus, then transit + finance.
const SERVICES: ServiceLink[] = [
  {
    tab: 'booking',
    group: 'parking',
    icon: Calendar,
    ar: 'حجز موقف',
    en: 'Book a bay',
    descAr: 'احجز موقفك مسبقاً واحصل على تصريح رقمي برمز QR',
    descEn: 'Reserve a bay in advance and get a QR digital pass',
  },
  {
    tab: 'share',
    group: 'parking',
    icon: RefreshCw,
    ar: 'التبادل الذكي',
    en: 'Flex Share',
    descAr: 'أتح موقفك لزملائك أثناء البريك واكسب مكافأة التعرفة',
    descEn: 'Offer your bay during breaks and earn the tariff cashback',
  },
  {
    tab: 'gate',
    group: 'parking',
    icon: Camera,
    ar: 'بوابة ALPR',
    en: 'Gate ALPR',
    descAr: 'التحقق من لوحة المركبة وقرار فتح البوابة',
    descEn: 'Plate verification and gate access decisions',
  },
  {
    tab: 'tutoring',
    group: 'campus',
    icon: BookOpen,
    ar: 'الشروحات الطلابية',
    en: 'Peer tutoring',
    descAr: 'احجز جلسة شرح أو انشر جلستك بالسعر الرسمي',
    descEn: 'Book a session or publish your own at the official rate',
  },
  {
    tab: 'office-hours',
    group: 'campus',
    icon: UserCheck,
    ar: 'الساعات المكتبية',
    en: 'Office hours',
    descAr: 'احجز موعداً مع عضو هيئة التدريس',
    descEn: 'Book an appointment with a faculty member',
  },
  {
    tab: 'rooms',
    group: 'campus',
    icon: DoorClosed,
    ar: 'المعامل والقاعات',
    en: 'Labs & study rooms',
    descAr: 'حجز جماعي بوقت محدد ومؤقت للمغادرة',
    descEn: 'Timed team bookings with a departure countdown',
  },
  {
    tab: 'bus',
    group: 'campus',
    icon: Bus,
    ar: 'النقل الجامعي',
    en: 'Campus transit',
    descAr: 'المسارات والحافلات وتذاكر الصعود',
    descEn: 'Routes, shuttles and boarding passes',
  },
  {
    tab: 'wallet',
    group: 'finance',
    icon: Wallet,
    ar: 'المحفظة الجامعية',
    en: 'Campus wallet',
    descAr: 'الرصيد والشحن والتحويل وسجل الحركات',
    descEn: 'Balance, top-ups, transfers and ledger',
  },
  {
    tab: 'tuition',
    group: 'finance',
    icon: GraduationCap,
    ar: 'الرسوم الدراسية',
    en: 'Tuition',
    descAr: 'الفواتير الأكاديمية والسداد والإيصالات',
    descEn: 'Academic invoices, payments and receipts',
  },
];

export const HeroSection: FC<HeroSectionProps> = ({
  isAr,
  totalSpots,
  availableCount,
  flexCount,
  isLoading = false,
  isUnavailable = false,
  onNavigate,
}) => {
  const hasData = !isLoading && !isUnavailable;
  const fmt = (n: number) => (hasData ? String(n) : '—');
  const occupancy =
    hasData && totalSpots > 0
      ? Math.round(((totalSpots - availableCount) / totalSpots) * 100)
      : null;

  const go = (tab: string) => {
    soundFX.playClick();
    onNavigate(tab);
  };

  const scrollToMap = () => {
    soundFX.playClick();
    document
      .querySelector('[data-testid="parking-lot-view"]')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className="cf-photo-hero cf-photo-hero--home" aria-labelledby="cf-home-title">
        <div className="cf-photo-hero__media" aria-hidden="true" />
        <div className="cf-photo-hero__shade" aria-hidden="true" />

        <div className="cf-wide cf-photo-hero__inner">
          <div className="cf-home-hero__grid">
            <div className="cf-home-hero__intro cf-rise">
              <span className="cf-hero-tag">
                <Sparkles size={14} />
                {isAr ? 'جامعة فهد بن سلطان · تبوك' : 'Fahad Bin Sultan University · Tabuk'}
              </span>

              <h2 id="cf-home-title" className="cf-hero-title cf-hero-title--xl">
                {isAr ? (
                  <>
                    مواقف ذكية وخدمات جامعية <span className="cf-hero-accent">في منصة واحدة</span>
                  </>
                ) : (
                  <>
                    Smart parking and campus services{' '}
                    <span className="cf-hero-accent">on one platform</span>
                  </>
                )}
              </h2>

              <p className="cf-hero-desc">
                {isAr
                  ? 'احجز موقفك، أتح موقفك لزملائك أثناء البريك، واحجز الشروحات والساعات المكتبية والمعامل، وادفع من محفظتك الجامعية — من بيانات أنظمة الجامعة مباشرة.'
                  : 'Book a bay, share yours during breaks, reserve tutoring, office hours and labs, and pay from your campus wallet — straight from university records.'}
              </p>

              <div className="cf-hero-actions">
                <button
                  type="button"
                  className="btn-gold cf-hero-btn"
                  onClick={() => go('booking')}
                >
                  <Calendar size={18} />
                  <span>{isAr ? 'احجز موقفك الآن' : 'Book a bay'}</span>
                </button>
                <button
                  type="button"
                  className="cf-hero-btn cf-hero-btn--ghost"
                  onClick={() => go('share')}
                >
                  <RefreshCw size={18} />
                  <span>{isAr ? 'التبادل الذكي' : 'Flex Share'}</span>
                </button>
              </div>

              <ul className="cf-hero-points">
                <li>
                  <QrCode size={15} />
                  {isAr ? 'تصاريح رقمية برمز QR' : 'QR digital passes'}
                </li>
                <li>
                  <Wallet size={15} />
                  {isAr ? 'السداد من المحفظة الجامعية' : 'Pay from your campus wallet'}
                </li>
                <li>
                  <Languages size={15} />
                  {isAr ? 'عربي و English' : 'English & العربية'}
                </li>
              </ul>
            </div>

            <aside
              className="cf-hero-panel cf-rise cf-rise--delay"
              aria-live="polite"
              aria-label={isAr ? 'حالة المواقف الآن' : 'Parking right now'}
            >
              <div className="cf-hero-panel__head">
                <span className="cf-hero-panel__title">
                  <MapPin size={16} />
                  {isAr ? 'حالة المواقف الآن' : 'Parking right now'}
                </span>
                {isUnavailable ? (
                  <span className="cf-live-dot is-off">
                    <span />
                    {isAr ? 'غير متاح' : 'Unavailable'}
                  </span>
                ) : (
                  <span className={`cf-live-dot ${isLoading ? 'is-loading' : ''}`}>
                    <span />
                    {isLoading ? (isAr ? 'جاري التحميل' : 'Loading') : isAr ? 'مباشر' : 'Live'}
                  </span>
                )}
              </div>

              <div className="cf-hero-stats">
                <div className="cf-hero-stat">
                  <Car size={18} />
                  <strong>{fmt(totalSpots)}</strong>
                  <span>{isAr ? 'إجمالي المواقف' : 'Total bays'}</span>
                </div>
                <div className="cf-hero-stat cf-hero-stat--ok">
                  <CheckCircle2 size={18} />
                  <strong>{fmt(availableCount)}</strong>
                  <span>{isAr ? 'متاحة الآن' : 'Available'}</span>
                </div>
                <div className="cf-hero-stat cf-hero-stat--gold">
                  <RefreshCw size={18} />
                  <strong>{fmt(flexCount)}</strong>
                  <span>{isAr ? 'في التبادل' : 'Flex Share'}</span>
                </div>
              </div>

              <div className="cf-hero-meter">
                <div className="cf-hero-meter__row">
                  <span>{isAr ? 'نسبة الإشغال' : 'Occupancy'}</span>
                  <strong>{occupancy === null ? '—' : `${occupancy}%`}</strong>
                </div>
                <span className="cf-hero-meter__track">
                  <span className="cf-hero-meter__fill" style={{ width: `${occupancy ?? 0}%` }} />
                </span>
              </div>

              <button type="button" className="cf-hero-panel__link" onClick={scrollToMap}>
                <span>{isAr ? 'عرض خريطة المواقف' : 'View the parking map'}</span>
                <ArrowDown size={16} />
              </button>
            </aside>
          </div>
        </div>
      </section>

      <section className="cf-services" aria-labelledby="cf-services-title">
        <div className="cf-wide">
          <header className="cf-services__head">
            <div>
              <span className="cf-services__eyebrow">
                {isAr ? 'خدمات الحرم الجامعي' : 'Campus services'}
              </span>
              <h3 id="cf-services-title" className="cf-services__title">
                {isAr ? 'كل ما تحتاجه في الجامعة' : 'Everything you need on campus'}
              </h3>
            </div>
            <p className="cf-services__sub">
              {isAr
                ? 'اختر الخدمة للانتقال إليها مباشرة.'
                : 'Choose a service to go straight to it.'}
            </p>
          </header>

          <div className="cf-services__grid">
            {SERVICES.map(service => {
              const Icon = service.icon;
              const group = service.group;
              return (
                <button
                  key={service.tab}
                  type="button"
                  className={`cf-service-card cf-service-card--${group}`}
                  onClick={() => go(service.tab)}
                >
                  <span className="cf-service-card__icon" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <span className="cf-service-card__body">
                    <span className="cf-service-card__group">
                      {isAr ? GROUP_LABELS[group].ar : GROUP_LABELS[group].en}
                    </span>
                    <span className="cf-service-card__title">{isAr ? service.ar : service.en}</span>
                    <span className="cf-service-card__desc">
                      {isAr ? service.descAr : service.descEn}
                    </span>
                  </span>
                  <span className="cf-service-card__arrow" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
