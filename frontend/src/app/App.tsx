import { useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../shared/layout/AppShell';
import { AppPreferencesProvider, useAppPreferences } from '../shared/context/AppPreferencesContext';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import type { AppUser } from '../shared/types/navigation';
import '../shared/i18n/i18n';
import '../styles/main.css';

export interface AppContentProps {
  initialTab?: string;
}

const AppContent: FC<AppContentProps> = ({ initialTab = 'map' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { t } = useTranslation();
  const { isAr } = useAppPreferences();
  const { user, isAuthenticated, logout } = useAuth();

  const currentUser: AppUser = user
    ? {
        id: user.universityNumber,
        name: user.fullNameAr,
        nameEn: user.fullNameEn,
        role: user.roles[0] || 'STUDENT',
        roleEn: user.roles[0] || 'STUDENT',
        walletBalance: 720.0,
        avatarColor: '#116E63',
      }
    : {
        id: '20210045',
        name: 'إياد الحربي',
        nameEn: 'Eyad Al-Harbi',
        role: 'طالب متميز',
        roleEn: 'Honor Student',
        walletBalance: 720.0,
        avatarColor: '#116E63',
      };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      currentUser={currentUser}
    >
      <div className="container" style={{ padding: '3rem 1.25rem', minHeight: '60vh' }}>
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div className="badge badge-gold" style={{ marginBottom: '1.25rem' }}>
            {isAr
              ? 'المرحلة الثالثة: عميل الـ API وإدارة الجلسات وحماية المسارات (P3-03)'
              : 'Phase 3: Typed HTTP Client, Auth Context & Route Guards (P3-03)'}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>
            {t('common.systemTitle')}
          </h2>

          <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              {isAr ? 'حالة المصادقة الحالية:' : 'Current Auth State:'}{' '}
              <strong style={{ color: isAuthenticated ? 'var(--status-available)' : 'var(--status-occupied)' }}>
                {isAuthenticated
                  ? `${isAr ? 'مسجل دخول كـ' : 'Authenticated as'} ${currentUser.name}`
                  : `${isAr ? 'زائر (وضع المحاكاة)' : 'Guest (Demo Session)'}`}
              </strong>
            </p>
            {isAuthenticated && (
              <button
                className="fbsu-alert-btn-secondary"
                onClick={() => logout()}
                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                type="button"
              >
                {isAr ? 'تسجيل الخروج' : 'Log Out'}
              </button>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1.5rem' }}>
            {isAr
              ? `القسم النشط حالياً: [${activeTab}]. تم إعداد عميل Axios مع اعتراض 401 والتجديد التلقائي لرموز JWT وحماية المسارات بالصلاحيات.`
              : `Current View: [${activeTab}]. Axios HTTP client with 401 JWT refresh rotation, Auth Context, and RBAC guards active.`}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
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
              onClick={() => setActiveTab('admin-panel')}
              type="button"
            >
              {isAr ? 'لوحة المسؤول (محمية)' : 'Admin Panel (Guarded)'}
            </button>
          </div>

          {activeTab === 'admin-panel' && (
            <ProtectedRoute requiredRoles={['CAMPUS_ADMIN']}>
              <div
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  borderColor: 'var(--fbsu-primary)',
                  background: 'rgba(17, 110, 99, 0.1)',
                }}
                data-testid="admin-panel-content"
              >
                <h4 style={{ color: 'var(--fbsu-primary)', marginBottom: '0.5rem' }}>
                  {isAr ? 'لوحة التحكم الإدارية المصرحة' : 'Authorized Campus Admin Panel'}
                </h4>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  {isAr
                    ? 'أهلاً بك يا مسؤول النظام. هذه المنطقة محمية بقواعد RBAC ولا يمكن لغير فئة CAMPUS_ADMIN الوصول إليها.'
                    : 'Welcome, Campus Administrator. This area is strictly protected by RBAC.'}
                </p>
              </div>
            </ProtectedRoute>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export const App: FC<AppContentProps> = (props) => {
  return (
    <AppPreferencesProvider>
      <AuthProvider>
        <AppContent {...props} />
      </AuthProvider>
    </AppPreferencesProvider>
  );
};
