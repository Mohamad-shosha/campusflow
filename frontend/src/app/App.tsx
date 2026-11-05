import { useState, FC } from 'react';
import { AppShell } from '../shared/layout/AppShell';
import type { AppUser } from '../shared/types/navigation';
import '../styles/main.css';

const defaultUser: AppUser = {
  id: '20210045',
  name: 'إياد الحربي',
  nameEn: 'Eyad Al-Harbi',
  role: 'طالب متميز - كلية الهندسة',
  roleEn: 'Honor Student - Engineering',
  college: 'كلية الهندسة',
  car: 'تويوتا كامري 2023',
  walletBalance: 720.0,
  avatarColor: '#116E63',
};

export interface AppProps {
  initialTab?: string;
  initialLang?: 'ar' | 'en';
}

export const App: FC<AppProps> = ({
  initialTab = 'map',
  initialLang = 'ar',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [lang, setLang] = useState<'ar' | 'en'>(initialLang);
  const [isLight, setIsLight] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const isAr = lang === 'ar';

  return (
    <AppShell
      isAr={isAr}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      currentUser={defaultUser}
      soundEnabled={soundEnabled}
      onToggleSound={() => setSoundEnabled((v) => !v)}
      onToggleLang={() => setLang((l) => (l === 'ar' ? 'en' : 'ar'))}
      isLightTheme={isLight}
      onToggleTheme={() => setIsLight((v) => !v)}
    >
      <div className="container" style={{ padding: '3rem 1.25rem', minHeight: '60vh' }}>
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div className="badge badge-gold" style={{ marginBottom: '1.25rem' }}>
            {isAr ? 'المرحلة الثالثة: تأسيس React 19 + TypeScript Strict' : 'Phase 3: React 19 + TypeScript Strict'}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>
            {isAr ? 'منظومة الحرم الجامعي والمواقف الذكية' : 'Smart Campus & ALPR Vision Platform'}
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1.5rem' }}>
            {isAr
              ? `القسم النشط حالياً: [${activeTab}]. تم بناء الهيكل الرئيسي (AppShell & Header & Ribbon & Navigation & Footer) بنجاح مع مطابقة الـ Design Tokens.`
              : `Current Active View: [${activeTab}]. Fully responsive institutional AppShell with Header, Ribbon, Navigation, and Footer initialized.`}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="fbsu-alert-btn-primary"
              onClick={() => setActiveTab('map')}
              type="button"
            >
              {isAr ? 'خريطة المواقف' : 'Parking Map'}
            </button>
            <button
              className="fbsu-alert-btn-secondary"
              onClick={() => setActiveTab('booking')}
              type="button"
            >
              {isAr ? 'حجز تصريح' : 'Book Permit'}
            </button>
            <button
              className="fbsu-alert-btn-secondary"
              onClick={() => setActiveTab('tutoring')}
              type="button"
            >
              {isAr ? 'جلسات الشرح' : 'Peer Tutoring'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
