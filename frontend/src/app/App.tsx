import { useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../shared/layout/AppShell';
import { AppPreferencesProvider, useAppPreferences } from '../shared/context/AppPreferencesContext';
import type { AppUser } from '../shared/types/navigation';
import '../shared/i18n/i18n';
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

export interface AppContentProps {
  initialTab?: string;
}

const AppContent: FC<AppContentProps> = ({ initialTab = 'map' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { t } = useTranslation();
  const { isAr } = useAppPreferences();

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      currentUser={defaultUser}
    >
      <div className="container" style={{ padding: '3rem 1.25rem', minHeight: '60vh' }}>
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div className="badge badge-gold" style={{ marginBottom: '1.25rem' }}>
            {isAr ? 'المرحلة الثالثة: دعم تعدد اللغات والمظهر التفاعلي (P3-02)' : 'Phase 3: i18n & Theme Switching Engine (P3-02)'}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>
            {t('common.systemTitle')}
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1.5rem' }}>
            {isAr
              ? `القسم النشط حالياً: [${activeTab}]. محرك الترجمة i18n شغال بالكامل مع دعم التبديل التلقائي للخطوط والاتجاه RTL/LTR وحفظ التفضيلات.`
              : `Current Active View: [${activeTab}]. Full i18n engine active with RTL/LTR document direction, font family switching, and local storage persistence.`}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="fbsu-alert-btn-primary"
              onClick={() => setActiveTab('map')}
              type="button"
            >
              {t('nav.liveMap')}
            </button>
            <button
              className="fbsu-alert-btn-secondary"
              onClick={() => setActiveTab('booking')}
              type="button"
            >
              {t('nav.bookParking')}
            </button>
            <button
              className="fbsu-alert-btn-secondary"
              onClick={() => setActiveTab('tutoring')}
              type="button"
            >
              {t('nav.peerTutoring')}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export const App: FC<AppContentProps> = (props) => {
  return (
    <AppPreferencesProvider>
      <AppContent {...props} />
    </AppPreferencesProvider>
  );
};
