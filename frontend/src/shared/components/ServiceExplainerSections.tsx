import { type FC } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
  Clock,
  Car,
  MapPin,
  Users,
  Award,
  BookOpen,
  UserCheck,
  CreditCard,
  QrCode,
  Bus,
} from 'lucide-react';

export type SupportedService =
  | 'parking'
  | 'rooms'
  | 'tutoring'
  | 'office-hours'
  | 'gate'
  | 'share'
  | 'booking'
  | 'tuition'
  | 'wallet'
  | 'analytics'
  | 'bus'
  | 'transit';

export interface ServiceExplainerSectionsProps {
  service: SupportedService;
  isAr: boolean;
  onNavigate?: (tab: string) => void;
}

export const ServiceExplainerSections: FC<ServiceExplainerSectionsProps> = ({ service, isAr }) => {
  return (
    <div
      className="service-explainer-wrapper"
      data-testid="service-explainer-sections"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* =========================================================================
          1. PARKING EXPLAINER SECTIONS
          ========================================================================= */}
      {service === 'parking' && (
        <>
          {/* Section 1: How It Works */}
          <section className="service-explainer-block">
            <div className="section-head text-center">
              <span className="section-eyebrow">
                <Sparkles size={14} />
                <span>
                  {isAr
                    ? 'منظومة إنترنت الأشياء والذكاء الاصطناعي'
                    : 'IoT & AI Parking Architecture'}
                </span>
              </span>
              <h3 className="section-title">
                {isAr
                  ? 'كيف تعمل منظومة المواقف الذكية في جامعة فهد بن سلطان؟'
                  : 'How the Smart Parking Suite Works'}
              </h3>
              <p className="section-subtitle">
                {isAr
                  ? 'أربعة أركان تقنية متكاملة تضمن تجربة ركن انسيابية وخالية تماماً من العشوائية وإهدار الوقت.'
                  : 'Four integrated pillars guaranteeing seamless campus arrival with zero congestion and wasted spots.'}
              </p>
            </div>

            <div className="explainer-cards-grid">
              <div className="explainer-step-card">
                <div className="step-card-num">01</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(17, 110, 99, 0.15)', color: 'var(--fbsu-primary)' }}
                >
                  <MapPin size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'استكشاف الخريطة وحجز الموقف' : 'Explore Map & Reserve'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'استعرض المخطط التفاعلي للشواغر الموزعة على القطاعات A, B, C, D، واختر مكانك المفضل بنقرة واحدة مع إصدار تصريح رقمي فوري.'
                    : 'Browse real-time bay availability across sectors A, B, C, D and reserve your space instantly with digital pass confirmation.'}
                </p>
              </div>

              <div className="explainer-step-card">
                <div className="step-card-num">02</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(215, 162, 55, 0.15)', color: 'var(--fbsu-gold)' }}
                >
                  <Zap size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'دخول فوري بكاميرات ALPR' : 'Touchless ALPR Gate Entry'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'كاميرات الذكاء الاصطناعي عند بوابات الحرم تقرأ لوحة سيارتك السعودية في أجزاء من الثانية وتفتح الحاجز التلقائي بدون توقف أو بطاقات.'
                    : 'AI-powered gate cameras scan Saudi license plates in sub-300ms, raising automated barriers without queues or physical cards.'}
                </p>
              </div>

              <div className="explainer-step-card">
                <div className="step-card-num">03</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(56, 194, 176, 0.15)', color: '#38c2b0' }}
                >
                  <Cpu size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'مستشعرات IoT السقفية الحية' : 'Live Ceiling IoT Sensors'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'حساسات كهرومغناطيسية وفوق صوتية مثبتة بكل موقف ترصد وقوف المركبة فوراً وتحدث الخريطة المركزية واللوحات الإرشادية لحظياً.'
                    : 'Ultrasonic and magnetic ceiling sensors continuously detect bay occupancy, updating campus monitors and driver apps in real time.'}
                </p>
              </div>

              <div className="explainer-step-card">
                <div className="step-card-num">04</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(215, 162, 55, 0.15)', color: 'var(--fbsu-gold)' }}
                >
                  <Award size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'التبادل الذكي Flex Share' : 'AI Flex Share & Rewards'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'عند خروجك خلال فترات البريك، يتيح النظام موقفك تلقائياً لزملائك القادمين للمحاضرات ويكافئك برصيد نقدي يُضاف مباشرة لمحفظتك.'
                    : 'When you leave during breaks, the system reallocates your vacant spot to incoming peers, crediting cash rewards to your wallet.'}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Sectors Guide */}
          <section className="service-explainer-block" style={{ marginTop: '3.5rem' }}>
            <div className="section-head text-center">
              <span className="section-eyebrow">
                <Car size={14} />
                <span>{isAr ? 'توزيع القطاعات والتجهيزات' : 'Campus Parking Sectors'}</span>
              </span>
              <h3 className="section-title">
                {isAr
                  ? 'تجهيزات قطاعات المواقف داخل الحرم الجامعي'
                  : 'Tailored Parking Sectors & Facilities'}
              </h3>
            </div>

            <div className="sectors-guide-grid">
              <div className="sector-guide-card">
                <div className="sector-card-header">
                  <span
                    className="sector-pill"
                    style={{ background: 'rgba(17, 110, 99, 0.25)', color: '#38c2b0' }}
                  >
                    {isAr ? 'قطاع A' : 'Sector A'}
                  </span>
                  <span className="sector-bays-count">
                    {isAr ? 'مواقف #01 إلى #10' : 'Bays #01 to #10'}
                  </span>
                </div>
                <h4 className="sector-title">
                  {isAr ? 'كلية الهندسة والحاسب الآلي' : 'College of Engineering & IT'}
                </h4>
                <p className="sector-desc">
                  {isAr
                    ? 'أقرب المواقف لبوابات كليات الهندسة ومعامل الذكاء الاصطناعي، مجهزة بمستشعرات سقفية ومظلات واقية من الشمس.'
                    : 'Closest bays to Engineering faculties and AI Supercomputing labs, fully shaded with overhead IoT sensing.'}
                </p>
              </div>

              <div className="sector-guide-card">
                <div className="sector-card-header">
                  <span
                    className="sector-pill"
                    style={{ background: 'rgba(56, 194, 176, 0.25)', color: '#38c2b0' }}
                  >
                    {isAr ? 'قطاع B' : 'Sector B'}
                  </span>
                  <span className="sector-bays-count">
                    {isAr ? 'مواقف #11 إلى #18' : 'Bays #11 to #18'}
                  </span>
                </div>
                <h4 className="sector-title">
                  {isAr ? 'كلية إدارة الأعمال والعلوم الطبية' : 'Business & Health Sciences'}
                </h4>
                <p className="sector-desc">
                  {isAr
                    ? 'مواقف رحبة تواجه المجمع الأكاديمي المركزي، وتدعم مسارات المشاة السريعة للوصول إلى قاعات المحاضرات والمكتبة المركزية.'
                    : 'Spacious bays adjacent to the main academic complex, offering dedicated pedestrian corridors to lecture halls.'}
                </p>
              </div>

              <div className="sector-guide-card">
                <div className="sector-card-header">
                  <span
                    className="sector-pill"
                    style={{ background: 'rgba(215, 162, 55, 0.25)', color: 'var(--fbsu-gold)' }}
                  >
                    {isAr ? 'قطاع C' : 'Sector C'}
                  </span>
                  <span className="sector-bays-count">
                    {isAr ? 'مواقف #19 إلى #24' : 'Bays #19 to #24'}
                  </span>
                </div>
                <h4 className="sector-title">
                  {isAr ? 'كادر التدريس والقيادات الأكاديمية' : 'Faculty & University Leadership'}
                </h4>
                <p className="sector-desc">
                  {isAr
                    ? 'مواقف مخصصة ومحمية إلكترونياً لأعضاء هيئة التدريس والعمداء ورؤساء الأقسام، مع إمكانية التبادل الذكي أثناء السفر أو الإجازات.'
                    : 'Protected bays for faculty and deans, featuring automated reservation locks and flex-sharing during sabbatical leaves.'}
                </p>
              </div>

              <div className="sector-guide-card">
                <div className="sector-card-header">
                  <span
                    className="sector-pill"
                    style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#10b981' }}
                  >
                    {isAr ? 'قطاع D' : 'Sector D'}
                  </span>
                  <span className="sector-bays-count">
                    {isAr ? 'مواقف #25 إلى #30' : 'Bays #25 to #30'}
                  </span>
                </div>
                <h4 className="sector-title">
                  {isAr ? 'شحن المركبات EV وذوو الهمم' : 'EV Fast Charging & Accessible'}
                </h4>
                <p className="sector-desc">
                  {isAr
                    ? 'مزودة بمحطات شحن كهربائي فائق السرعة، ومواقف بمساحات واسعة مصممة بالكامل وفق كود الوصول الشامل لأصحاب الهمم.'
                    : 'Equipped with Level-3 EV chargers and extra-wide access bays strictly reserved for mobility-impaired students and staff.'}
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Safety & Policies */}
          <section className="service-explainer-block" style={{ marginTop: '3.5rem' }}>
            <div className="explainer-guidelines-box">
              <div className="guidelines-icon-col">
                <ShieldCheck size={36} color="var(--fbsu-gold)" />
              </div>
              <div className="guidelines-text-col">
                <h4 className="guidelines-title">
                  {isAr
                    ? 'قواعد وإرشادات السلامة في مواقف الجامعة'
                    : 'Campus Parking Policies & Safety'}
                </h4>
                <ul className="guidelines-list">
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'السرعة القصوى داخل ممرات المواقف هي 15 كم/س لضمان سلامة المشاة والطلاب.'
                        : 'Strict 15 km/h campus speed limit enforced for pedestrian safety.'}
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'فترة السماح قبل موعد الحجز هي 15 دقيقة لتسهيل وصولك للموقف وحجزه مسبقاً.'
                        : '15-minute arrival grace period applies to all reserved sessions.'}
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'يرجى التأكد من نظافة لوحة المركبة لضمان قراءتها بنجاح عند كاميرات بوابات ALPR.'
                        : 'Ensure clean vehicle plates for flawless touchless optical recognition.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =========================================================================
          2. SMART LABS & STUDY ROOMS EXPLAINER SECTIONS
          ========================================================================= */}
      {service === 'rooms' && (
        <>
          <section className="service-explainer-block">
            <div className="section-head text-center">
              <span className="section-eyebrow">
                <Cpu size={14} />
                <span>
                  {isAr ? 'البنية التحتية والقدرات البحثية' : 'Advanced Research Capabilities'}
                </span>
              </span>
              <h3 className="section-title">
                {isAr
                  ? 'التجهيزات المتقدمة ومختبرات الأبحاث والذكاء الاصطناعي'
                  : 'Supercomputing & Research Laboratory Facilities'}
              </h3>
              <p className="section-subtitle">
                {isAr
                  ? 'صُممت معامل جامعة فهد بن سلطان بأعلى المواصفات التقنية لتمكين الطلاب والباحثين من إنجاز مشاريع الذكاء الاصطناعي والأمن السيبراني.'
                  : 'Engineered to highest international benchmarks, empowering students and researchers in AI, CyberOps, and Cloud Engineering.'}
              </p>
            </div>

            <div className="explainer-cards-grid">
              <div className="explainer-step-card">
                <div className="step-card-num">AI</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(215, 162, 55, 0.15)', color: 'var(--fbsu-gold)' }}
                >
                  <Cpu size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'مختبر الحوسبة الفائقة و AI' : 'AI & HPC Supercomputing Lab'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? '20 محطة عمل HP Z8 مزودة بكروت NVIDIA RTX 4090 24GB VRAM مع اتصال ألياف ضوئية 40Gbps لتدريب نماذج Deep Learning و LLMs.'
                    : '20 HP Z8 stations powered by NVIDIA RTX 4090 24GB GPUs linked to high-speed 40Gbps optical fiber cluster for Deep Learning.'}
                </p>
              </div>

              <div className="explainer-step-card">
                <div className="step-card-num">NOC</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(17, 110, 99, 0.15)', color: 'var(--fbsu-primary)' }}
                >
                  <ShieldCheck size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'مركز العمليات السيبرانية Cisco' : 'Cisco CyberOps NOC Lab'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'جدران مراقبة أمنية Security Video Wall وراوترات Cisco Catalyst 9300 و ISR 4000 مخصصة لاختبارات الاختراق والتحليل الأمني.'
                    : 'Enterprise Security Video Wall, Cisco Catalyst 9300 switches, and ISR 4000 routers for penetration testing and forensics.'}
                </p>
              </div>

              <div className="explainer-step-card">
                <div className="step-card-num">DEV</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(56, 194, 176, 0.15)', color: '#38c2b0' }}
                >
                  <Zap size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'معمل هندسة البرمجيات السحابية' : 'Cloud & Software Engineering Lab'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? '24 جهاز Apple iMac و HP Workstation مجهزة بـ Java 21, Python 3.12, Docker, Node.js وسيرفرات تكامل مستمر CI/CD محلي.'
                    : '24 dual-platform iMacs and HP Workstations pre-configured with Java 21, Docker, Python 3.12, and automated CI/CD pipelines.'}
                </p>
              </div>

              <div className="explainer-step-card">
                <div className="step-card-num">POD</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(215, 162, 55, 0.15)', color: 'var(--fbsu-gold)' }}
                >
                  <Users size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'كبائن التركيز وغرف النقاش' : 'Acoustic Pods & Discussion Rooms'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'غرف دراسة معزولة صوتياً بمعيار 42dB مزودة بشاشات ذكية 4K ومنصات إضاءة تفاعلية مناسبة للعمل الجماعي والمقابلات.'
                    : 'Acoustically insulated 42dB pods with 4K interactive presentation screens, ideal for team collaboration and remote interviews.'}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Booking Policies */}
          <section className="service-explainer-block" style={{ marginTop: '3.5rem' }}>
            <div className="explainer-guidelines-box">
              <div className="guidelines-icon-col">
                <Clock size={36} color="var(--fbsu-gold)" />
              </div>
              <div className="guidelines-text-col">
                <h4 className="guidelines-title">
                  {isAr
                    ? 'سياسة حجز واستخدام المعامل والقاعات'
                    : 'Laboratory Reservation Guidelines'}
                </h4>
                <ul className="guidelines-list">
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'الحجز الفوري متاح لجميع طلاب الكلية عبر تسجيل الدخول بالرقم الجامعي.'
                        : 'Instant reservation accessible to all registered university students.'}
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'يمكن تمديد الجلسة بحد أقصى 30 دقيقة إضافية في حال عدم وجود حجز لاحق على نفس القاعة.'
                        : 'Sessions extendable by up to 30 minutes subject to subsequent booking availability.'}
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'يرجى إخلاء المعمل أو كابينة الدراسة قبل 5 دقائق من انتهاء الجلسة للحفاظ على النظافة وجاهزية الأجهزة.'
                        : 'Please release the facility 5 minutes prior to session expiry for sanitization.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =========================================================================
          3. PEER TUTORING EXPLAINER SECTIONS
          ========================================================================= */}
      {service === 'tutoring' && (
        <>
          <section className="service-explainer-block">
            <div className="section-head text-center">
              <span className="section-eyebrow">
                <BookOpen size={14} />
                <span>
                  {isAr
                    ? 'برنامج التميز الأكاديمي والتمويل الذاتي'
                    : 'Peer Mentorship & Financial Support'}
                </span>
              </span>
              <h3 className="section-title">
                {isAr
                  ? 'كيف يعمل برنامج التدريس بالأقران في جامعة فهد بن سلطان؟'
                  : 'How the Peer Tutoring System Works'}
              </h3>
              <p className="section-subtitle">
                {isAr
                  ? 'منظومة مبتكرة تدعم المتفوقين مالياً وتساعد الطلاب على رفع تحصيلهم الدراسي في المقررات التخصصية.'
                  : 'An innovative framework rewarding top-achieving students while elevating cohort academic mastery.'}
              </p>
            </div>

            <div className="explainer-cards-grid">
              <div className="explainer-step-card">
                <div className="step-card-num">01</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(215, 162, 55, 0.15)', color: 'var(--fbsu-gold)' }}
                >
                  <Users size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'طرح الجلسة أو حجزها' : 'Publish or Book Session'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'يقوم الطالب المتميز بنشر موعد جلسة الشرح للمقرر (CS, CEN, MATH)، أو يختار الطالب المستفيد الجلسة المناسبة لجدوله.'
                    : 'Top peers publish targeted review sessions for difficult courses, while fellow students select their preferred slot.'}
                </p>
              </div>

              <div className="explainer-step-card">
                <div className="step-card-num">02</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(17, 110, 99, 0.15)', color: 'var(--fbsu-primary)' }}
                >
                  <CreditCard size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'سداد رمزي (70 ر.س/ساعة)' : 'Affordable 70 SAR Fee'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'يتم سداد رسوم الجلسة مباشرة من المحفظة الجامعية برسم رمزي مدعوم يضمن التزام الحضور وجدية التعلم.'
                    : 'Session fees are deducted seamlessly from student campus wallets at an institution-subsidized flat rate.'}
                </p>
              </div>

              <div className="explainer-step-card">
                <div className="step-card-num">03</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(56, 194, 176, 0.15)', color: '#38c2b0' }}
                >
                  <Award size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'تحويل فوري لسداد الرسوم' : 'Direct Tuition Credit'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'تتحول عوائد التدريس فورياً إلى الحساب الجامعي للطالب المعلم لخصمها مباشرة من فاتورة الرسوم الدراسية للفصل الحالي.'
                    : 'Earnings are transferred instantly to the peer tutor’s university ledger to pay down semester academic invoices.'}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Eligibility Criteria */}
          <section className="service-explainer-block" style={{ marginTop: '3.5rem' }}>
            <div className="explainer-guidelines-box">
              <div className="guidelines-icon-col">
                <Award size={36} color="var(--fbsu-gold)" />
              </div>
              <div className="guidelines-text-col">
                <h4 className="guidelines-title">
                  {isAr ? 'معايير وشروط الانضمام كمعلم أقران' : 'Peer Tutor Qualification Criteria'}
                </h4>
                <ul className="guidelines-list">
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'معدل تراكمي لا يقل عن 3.5 من 4.0 مع الحصول على تقدير A أو A+ في المقرر المستهدف.'
                        : 'Minimum 3.5/4.0 CGPA and A or A+ grade earned in the targeted course.'}
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'تزكية أكاديمية معتمدة من أستاذ المقرر أو رئيس القسم المختص.'
                        : 'Formal endorsement from course instructor or department chair.'}
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'الحفاظ على تقييم طلابي إيجابي (4.5+ نجوم) لضمان استمرارية صلاحية التدريس.'
                        : 'Maintain a 4.5+ star evaluation score to retain peer tutoring privileges.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =========================================================================
          4. FACULTY OFFICE HOURS EXPLAINER SECTIONS
          ========================================================================= */}
      {service === 'office-hours' && (
        <>
          <section className="service-explainer-block">
            <div className="section-head text-center">
              <span className="section-eyebrow">
                <UserCheck size={14} />
                <span>{isAr ? 'التواصل الأكاديمي المباشر' : 'Direct Faculty Advising'}</span>
              </span>
              <h3 className="section-title">
                {isAr
                  ? 'منصة الساعات المكتبية والتوجيه الأكاديمي والمهني'
                  : 'Academic Leadership & Mentorship Consultations'}
              </h3>
              <p className="section-subtitle">
                {isAr
                  ? 'فرصة حصرية للتواصل المباشر مع عمداء الكليات ورؤساء الأقسام لمناقشة خططك الدراسية ومشاريع التخرج وفرص التدريب.'
                  : 'Direct, prioritized appointment scheduling with collegiate deans, department chairs, and senior professors.'}
              </p>
            </div>

            <div className="explainer-cards-grid">
              <div className="explainer-step-card">
                <div className="step-card-num">01</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(17, 110, 99, 0.15)', color: 'var(--fbsu-primary)' }}
                >
                  <BookOpen size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'الإرشاد والخطط الدراسية' : 'Curriculum & Academic Plans'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'مناقشة متطلبات التخرج، معادلة المقررات، حل مشاكل التعارض في الجداول، والتوجيه لاختيار المسارات التخصصية.'
                    : 'Clarify degree requirements, course prerequisites, timetable clashes, and elective specialization tracks.'}
                </p>
              </div>

              <div className="explainer-step-card">
                <div className="step-card-num">02</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(215, 162, 55, 0.15)', color: 'var(--fbsu-gold)' }}
                >
                  <Award size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'مشاريع التخرج والأبحاث' : 'Capstone Projects & Research'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'عرض أفكار مشاريع التخرج، الحصول على إشراف مباشر من الأساتذة، ومناقشة نشر الأوراق العلمية في المجلات المحكمة.'
                    : 'Pitch graduation project ideas, secure senior faculty supervision, and collaborate on peer-reviewed research papers.'}
                </p>
              </div>

              <div className="explainer-step-card">
                <div className="step-card-num">03</div>
                <div
                  className="step-card-icon-wrap"
                  style={{ background: 'rgba(56, 194, 176, 0.15)', color: '#38c2b0' }}
                >
                  <Users size={24} />
                </div>
                <h4 className="step-card-title">
                  {isAr ? 'التدريب التعاوني والتوظيف' : 'Internships & NEOM Placements'}
                </h4>
                <p className="step-card-desc">
                  {isAr
                    ? 'الحصول على خطابات التوصية واستشارات التدريب الصيفي لدى الشركاء الصناعيين في نيوم ومشروع البحر الأحمر.'
                    : 'Obtain official academic recommendations for cooperative internships at NEOM and Red Sea Global.'}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Advising Etiquette */}
          <section className="service-explainer-block" style={{ marginTop: '3.5rem' }}>
            <div className="explainer-guidelines-box">
              <div className="guidelines-icon-col">
                <Clock size={36} color="var(--fbsu-gold)" />
              </div>
              <div className="guidelines-text-col">
                <h4 className="guidelines-title">
                  {isAr ? 'إرشادات حضور الساعات المكتبية' : 'Appointment Guidelines & Protocol'}
                </h4>
                <ul className="guidelines-list">
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'يصل إشعار فوري للعمادة وأستاذ المقرر فور تأكيد حجز الموعد على النظام.'
                        : 'Immediate automated notification is dispatched to deanery upon slot booking.'}
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'يرجى كتابة موضوع الاستفسار بوضوح في نموذج الحجز لتمكين عضو هيئة التدريس من التحضير المسبق.'
                        : 'State consultation inquiry clearly in reservation note to allow advance faculty preparation.'}
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="var(--fbsu-primary)" />
                    <span>
                      {isAr
                        ? 'في حال الرغبة بالإلغاء، يرجى الإلغاء قبل ساعتين على الأقل لإتاحة الفرصة لزميل آخر.'
                        : 'Cancel at least 2 hours prior to liberate appointment time for fellow students.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =========================================================================
          5. ALPR GATE EXPLAINER SECTIONS
          ========================================================================= */}
      {service === 'gate' && (
        <section className="service-explainer-block">
          <div className="section-head text-center">
            <span className="section-eyebrow">
              <ShieldCheck size={14} />
              <span>
                {isAr ? 'الذكاء الاصطناعي للبوابات' : 'Computer Vision Gate Architecture'}
              </span>
            </span>
            <h3 className="section-title">
              {isAr
                ? 'كيف تقرأ البوابة لوحات المركبات وتتحقق من التصاريح؟'
                : 'How Automated License Plate Recognition Works'}
            </h3>
          </div>

          <div className="explainer-cards-grid">
            <div className="explainer-step-card">
              <div className="step-card-num">01</div>
              <h4 className="step-card-title">{isAr ? 'رصد الاقتراب' : 'Vehicle Proximity'}</h4>
              <p className="step-card-desc">
                {isAr
                  ? 'رادار أرضي يستشعر اقتراب المركبة من خط الوقوف على مسافة 2 متر ويشغل الكاميرا عالية السرعة.'
                  : 'Ground induction radar detects approaching vehicle at 2m line, activating high-fps camera capture.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">02</div>
              <h4 className="step-card-title">
                {isAr ? 'معالجة اللوحة OCR' : 'Optical Neural OCR'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'نموذج ذكاء اصطناعي مدرب على اللوحات السعودية يحلل الحروف والأرقام العربية والإنجليزية بدقة 99.4%.'
                  : 'Deep learning vision model segments Arabic & English alphanumeric plates with 99.4% accuracy.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">03</div>
              <h4 className="step-card-title">
                {isAr ? 'المطابقة السحابية' : 'Cloud Verification'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'مطابقة اللوحة مع قاعدة بيانات التصاريح والحجوزات الحية للجامعة في أقل من 300 مللي ثانية.'
                  : 'Instantaneous query against PostgreSQL active permits and reservations sub-300ms.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">04</div>
              <h4 className="step-card-title">{isAr ? 'رفع الحاجز الآلي' : 'Barrier Raise'}</h4>
              <p className="step-card-desc">
                {isAr
                  ? 'يفتح الحاجز الهيدروليكي فورا مع تسجيل وقت الدخول وإرسال إشعار لحظي لهاتف السائق.'
                  : 'High-speed hydraulic barrier lifts smoothly, logging timestamp and dispatching mobile notification.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          6. FLEX SHARE EXPLAINER SECTIONS
          ========================================================================= */}
      {service === 'share' && (
        <section className="service-explainer-block">
          <div className="section-head text-center">
            <span className="section-eyebrow">
              <Zap size={14} />
              <span>
                {isAr ? 'مبدأ التبادل الذكي واستثمار المواقف' : 'Smart Spot Sharing Principles'}
              </span>
            </span>
            <h3 className="section-title">
              {isAr
                ? 'استثمر موقفك أثناء مغادرتك واكسب رصيداً جامعيًا'
                : 'Monetize Vacant Hours & Elevate Campus Capacity'}
            </h3>
          </div>

          <div className="explainer-cards-grid">
            <div className="explainer-step-card">
              <div className="step-card-num">01</div>
              <h4 className="step-card-title">
                {isAr ? 'تحديد فترة المغادرة' : 'Specify Break Interval'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'حدد مدة غيابك عن الحرم الجامعي (من 1 إلى 5 ساعات) واضغط على "تفعيل التبادل الذكي".'
                  : 'Select your anticipated absence window (1 to 5 hrs) and toggle "Activate Flex Share".'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">02</div>
              <h4 className="step-card-title">
                {isAr ? 'إتاحة الموقف للزملاء' : 'Peer Spot Allocation'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'يتحول موقفك تلقائياً في الخريطة الحية إلى لون التبادل الذهبي ليتمكن زملاؤك من حجزه.'
                  : 'Your bay automatically turns to amber "AI Flex" on the campus map for peer booking.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">03</div>
              <h4 className="step-card-title">
                {isAr ? 'كسب العائد المالي' : 'Instant Wallet Reward'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'فور وقوف المركبة البديلة، يُحول العائد المالي المحدد مباشرة إلى رصيد محفظتك الجامعية.'
                  : 'The moment the incoming vehicle parks, reward credits deposit straight into your wallet.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">04</div>
              <h4 className="step-card-title">{isAr ? 'ضمان خلو الموقف' : 'Guaranteed Vacancy'}</h4>
              <p className="step-card-desc">
                {isAr
                  ? 'يلزم النظام السائق البديل بإخلاء الموقف قبل موعد عودتك بـ 15 دقيقة مع تنبيهات تلقائية.'
                  : 'System obliges temporary driver to evacuate 15 min prior to your return with alerts.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          7. ADVANCE BOOKING EXPLAINER SECTIONS
          ========================================================================= */}
      {service === 'booking' && (
        <section className="service-explainer-block">
          <div className="section-head text-center">
            <span className="section-eyebrow">
              <QrCode size={14} />
              <span>{isAr ? 'التصاريح والباقات المعتمدة' : 'Permits & Packages'}</span>
            </span>
            <h3 className="section-title">
              {isAr ? 'باقات حجز المواقف والتصاريح الرقمية' : 'Tailored Parking Booking Plans'}
            </h3>
          </div>

          <div className="explainer-cards-grid">
            <div className="explainer-step-card">
              <div className="step-card-num">HRS</div>
              <h4 className="step-card-title">{isAr ? 'الحجز الساعي المرن' : 'Hourly Flexible'}</h4>
              <p className="step-card-desc">
                {isAr
                  ? 'رسم رمزي 3 ر.س/ساعة مثالي لحضور المحاضرات الفردية والمراجعات في معامل الكلية.'
                  : '3 SAR/hr ideal for individual classes, lab sessions, and quick library visits.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">DAY</div>
              <h4 className="step-card-title">
                {isAr ? 'التصريح اليومي الشامل' : 'Full-Day Campus Pass'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'تصريح ليوم دراسي كامل يتيح الدخول والخروج المتكرر من كافة بوابات الحرم الجامعي.'
                  : 'Full-day pass enabling unlimited gate entries and exits throughout academic hours.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">SEM</div>
              <h4 className="step-card-title">
                {isAr ? 'الاشتراك الفصلي المحمي' : 'Semester Protected Pass'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'موقف مخصص ومحمي باسمك طوال الفصل الدراسي لطلاب الدراسات العليا وأعضاء الهيئة.'
                  : 'Dedicated assigned bay reserved in your name across the entire semester.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          8. TUITION EXPLAINER SECTIONS
          ========================================================================= */}
      {service === 'tuition' && (
        <section className="service-explainer-block">
          <div className="section-head text-center">
            <span className="section-eyebrow">
              <CreditCard size={14} />
              <span>{isAr ? 'التكامل المالي الرقمي' : 'Academic Invoicing Integration'}</span>
            </span>
            <h3 className="section-title">
              {isAr
                ? 'سداد الرسوم الدراسية وإصدار الإيصالات الموثقة'
                : 'Tuition Settlement & Verified Receipts'}
            </h3>
          </div>

          <div className="explainer-cards-grid">
            <div className="explainer-step-card">
              <div className="step-card-num">01</div>
              <h4 className="step-card-title">
                {isAr ? 'سداد مباشر من المحفظة' : 'Direct Wallet Settlement'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'استخدم رصيد محفظتك المكتسب من التدريس بالأقران والتبادل الذكي لسداد فواتيرك الأكاديمية.'
                  : 'Apply campus earnings from peer tutoring and flex sharing directly to tuition balances.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">02</div>
              <h4 className="step-card-title">
                {isAr ? 'إيصال مشفر بـ QR Code' : 'Cryptographic QR Receipts'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'يصدر النظام إيصال سداد رسمي معتمد ومزود برمز QR يتيح التحقق الفوري لعمادة القبول.'
                  : 'Official electronic receipts encoded with cryptographic QR for instant registrar verification.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">03</div>
              <h4 className="step-card-title">
                {isAr ? 'خطط التقسيط الميسرة' : 'Flexible Payment Plans'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'خيارات تقسيط مجدولة تتوافق مع التقويم الدراسي وتضمن استمرارية تسجيلك بدون تأخير.'
                  : 'Scheduled installment options aligned with semester milestones, keeping registration active.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          9. WALLET EXPLAINER SECTIONS
          ========================================================================= */}
      {service === 'wallet' && (
        <section className="service-explainer-block">
          <div className="section-head text-center">
            <span className="section-eyebrow">
              <Zap size={14} />
              <span>{isAr ? 'منظومة الدفع الموحدة' : 'Unified Campus Payments'}</span>
            </span>
            <h3 className="section-title">
              {isAr
                ? 'استخدامات المحفظة الجامعية والتحويل الفوري'
                : 'Campus Digital Wallet Features'}
            </h3>
          </div>

          <div className="explainer-cards-grid">
            <div className="explainer-step-card">
              <div className="step-card-num">01</div>
              <h4 className="step-card-title">
                {isAr ? 'سداد فوري لكافة الخدمات' : 'All-in-One Payments'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'ادفع رسوم المواقف، جلسات التدريس، وحجز المعامل بنقرة واحدة بدون بطاقات مصرفية متكررة.'
                  : 'One-click payments for parking, peer tutoring, and facilities without re-entering card details.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">02</div>
              <h4 className="step-card-title">
                {isAr ? 'تحويل فوري بين الطلاب P2P' : 'Instant Student P2P'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'حول الرصيد لزملائك الطلاب فورياً عبر الرقم الجامعي لمشاركة مصاريف الكتب والمشاريع.'
                  : 'Transfer credits between students using university ID for collaborative projects.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">03</div>
              <h4 className="step-card-title">
                {isAr ? 'سجل محاسبي موثق Ledger' : 'Audited Financial Ledger'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'سجل شفاف يوثق كل عملية إيداع، خصم، أو تحويل مع رقم مرجعي فريد وتاريخ العملية بدقة.'
                  : 'Immutable ledger logging every debit, credit, and transfer with unique reference IDs.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          11. TRANSIT & ECO-SHUTTLE FLEET EXPLAINER SECTIONS
          ========================================================================= */}
      {(service === 'bus' || service === 'transit') && (
        <section className="service-explainer-block" data-testid="explainer-transit-block">
          <div className="section-header-centered">
            <span className="section-eyebrow">
              <Bus size={14} />
              <span>
                {isAr ? 'منظومة النقل الترددي الصديق للبيئة' : 'Eco-Shuttle Transit System'}
              </span>
            </span>
            <h3 className="section-title">
              {isAr
                ? 'كيف تعمل منظومة الحافلات الكهربائية وتذاكر الصعود الذكية'
                : 'How FBSU Smart Shuttles & QR Boarding Passes Work'}
            </h3>
          </div>

          <div className="explainer-cards-grid">
            <div className="explainer-step-card">
              <div className="step-card-num">01</div>
              <h4 className="step-card-title">
                {isAr ? 'تتبع لحظي للأسطول والمقاعد الشاغرة' : 'Live Fleet Telemetry & Seats'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'شاهد موقع كل حافلة بدقة، نسبة شحن البطارية، وعدد المقاعد الشاغرة قبل التوجه للمحطة.'
                  : 'Track real-time shuttle location, EV battery percentage, and seat occupancy before heading to the stop.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">02</div>
              <h4 className="step-card-title">
                {isAr ? 'تذكرة صعود رقمية مشفرة بـ QR' : 'Encrypted QR Boarding Pass'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'أصدر تصريح ركوب فوري مشفر يرتبط برقمك الجامعي ومحطة الوصول بنقرة زر واحدة ومجاناً.'
                  : 'Generate a cryptographic digital boarding token tied to your student ID and destination stop with zero friction.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">03</div>
              <h4 className="step-card-title">
                {isAr ? 'حرم جامعي أخضر وصفر انبعاثات' : 'Zero-Emission Green Campus'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'أسطول حافلات كهربائي 100% يربط بوابات الحرم ومواقف السيارات بكافة الكليات بتردد كل 10 دقائق.'
                  : '100% electric bus fleet connecting campus gates, parking lots, and faculties on a 10-minute cadence.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          11. TRANSIT & ECO-SHUTTLE FLEET EXPLAINER SECTIONS
          ========================================================================= */}
      {(service === 'bus' || service === 'transit') && (
        <section className="service-explainer-block" data-testid="explainer-transit-block">
          <div className="section-header-centered">
            <span className="section-eyebrow">
              <Bus size={14} />
              <span>
                {isAr ? 'منظومة النقل الترددي الصديق للبيئة' : 'Eco-Shuttle Transit System'}
              </span>
            </span>
            <h3 className="section-title">
              {isAr
                ? 'كيف تعمل منظومة الحافلات الكهربائية وتذاكر الصعود الذكية'
                : 'How FBSU Smart Shuttles & QR Boarding Passes Work'}
            </h3>
          </div>

          <div className="explainer-cards-grid">
            <div className="explainer-step-card">
              <div className="step-card-num">01</div>
              <h4 className="step-card-title">
                {isAr ? 'تتبع لحظي للأسطول والمقاعد الشاغرة' : 'Live Fleet Telemetry & Seats'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'شاهد موقع كل حافلة بدقة، نسبة شحن البطارية، وعدد المقاعد الشاغرة قبل التوجه للمحطة.'
                  : 'Track real-time shuttle location, EV battery percentage, and seat occupancy before heading to the stop.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">02</div>
              <h4 className="step-card-title">
                {isAr ? 'تذكرة صعود رقمية مشفرة بـ QR' : 'Encrypted QR Boarding Pass'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'أصدر تصريح ركوب فوري مشفر يرتبط برقمك الجامعي ومحطة الوصول بنقرة زر واحدة ومجاناً.'
                  : 'Generate a cryptographic digital boarding token tied to your student ID and destination stop with zero friction.'}
              </p>
            </div>
            <div className="explainer-step-card">
              <div className="step-card-num">03</div>
              <h4 className="step-card-title">
                {isAr ? 'حرم جامعي أخضر وصفر انبعاثات' : 'Zero-Emission Green Campus'}
              </h4>
              <p className="step-card-desc">
                {isAr
                  ? 'أسطول حافلات كهربائي 100% يربط بوابات الحرم ومواقف السيارات بكافة الكليات بتردد كل 10 دقائق.'
                  : '100% electric bus fleet connecting campus gates, parking lots, and faculties on a 10-minute cadence.'}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
