import { useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../shared/layout/AppShell';
import { AppPreferencesProvider, useAppPreferences } from '../shared/context/AppPreferencesContext';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { AuthModal } from '../features/auth/components/AuthModal';
import { WalletPage } from '../features/wallet';
import { Toast, type ToastType } from '../shared/components/Toast';
import { SaudiPlate } from '../shared/components/SaudiPlate';
import type { AppUser } from '../shared/types/navigation';
import '../shared/i18n/i18n';
import '../styles/main.css';

export interface AppContentProps {
  initialTab?: string;
}

const AppContent: FC<AppContentProps> = ({ initialTab = 'map' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [liveBalance, setLiveBalance] = useState<number>(720.0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [activeToast, setActiveToast] = useState<{
    message: string;
    type: ToastType;
    title?: string;
  } | null>(null);

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
        walletBalance: liveBalance,
        avatarColor: '#116E63',
      }
    : {
        id: '20210045',
        name: 'إياد الحربي',
        nameEn: 'Eyad Al-Harbi',
        role: 'طالب متميز',
        roleEn: 'Honor Student',
        walletBalance: liveBalance,
        avatarColor: '#116E63',
      };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      currentUser={currentUser}
      onOpenAuth={() => {
        setAuthModalTab('login');
        setIsAuthModalOpen(true);
      }}
      onOpenWallet={() => setActiveTab('wallet')}
    >
      <div className="container" style={{ padding: '3rem 1.25rem', minHeight: '60vh' }}>
        {activeToast && (
          <div
            style={{ position: 'fixed', top: '1.5rem', insetInlineEnd: '1.5rem', zIndex: 999999 }}
          >
            <Toast
              message={activeToast.message}
              type={activeToast.type}
              title={activeToast.title}
              onClose={() => setActiveToast(null)}
            />
          </div>
        )}

        <div
          className="glass-panel"
          style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}
        >
          <div className="badge badge-gold" style={{ marginBottom: '1.25rem' }}>
            {isAr
              ? 'المرحلة الثالثة: الواجهات الأمامية ومنظومة الهوية والمكونات المشتركة (P3 Complete)'
              : 'Phase 3: React Foundation, Auth Modals, Shared UI Kit & Architecture (P3 Complete)'}
          </div>
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 900,
              color: 'var(--text-main)',
              marginBottom: '1rem',
            }}
          >
            {t('common.systemTitle')}
          </h2>

          <div
            style={{
              margin: '1rem 0',
              padding: '1.25rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', display: 'block' }}>
                  {isAr ? 'حالة الحساب والمصادقة:' : 'Authentication Status:'}
                </span>
                <strong
                  style={{
                    color: isAuthenticated ? 'var(--status-available)' : 'var(--fbsu-gold)',
                    fontSize: '1rem',
                  }}
                >
                  {isAuthenticated
                    ? `✓ ${currentUser.name} (${currentUser.role})`
                    : `${isAr ? 'زائر غير مسجل (دخول متاح)' : 'Guest (Authentication Available)'}`}
                </strong>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!isAuthenticated ? (
                  <>
                    <button
                      className="fbsu-alert-btn-primary"
                      onClick={() => {
                        setAuthModalTab('login');
                        setIsAuthModalOpen(true);
                      }}
                      type="button"
                      data-testid="open-login-btn"
                    >
                      {isAr ? 'تسجيل الدخول' : 'Sign In'}
                    </button>
                    <button
                      className="fbsu-alert-btn-secondary"
                      onClick={() => {
                        setAuthModalTab('register');
                        setIsAuthModalOpen(true);
                      }}
                      type="button"
                      data-testid="open-register-btn"
                    >
                      {isAr ? 'حساب جديد' : 'Register'}
                    </button>
                  </>
                ) : (
                  <button
                    className="fbsu-alert-btn-secondary"
                    onClick={async () => {
                      await logout();
                      setActiveToast({ message: 'تم تسجيل الخروج بنجاح', type: 'info' });
                    }}
                    type="button"
                    data-testid="user-logout-btn"
                  >
                    {isAr ? 'تسجيل الخروج' : 'Log Out'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Demonstration of Saudi Plate Component */}
          <div
            style={{
              margin: '1.5rem 0',
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <SaudiPlate lettersAr="ط ر ق" lettersEn="T R G" digits="4040" isPrimary={true} />
            <SaudiPlate lettersAr="أ ب ح" lettersEn="A B J" digits="1234" isPrimary={false} />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
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
              className={activeTab === 'wallet' ? 'fbsu-alert-btn-primary' : 'fbsu-alert-btn-secondary'}
              onClick={() => setActiveTab('wallet')}
              type="button"
              data-testid="tab-wallet-btn"
            >
              {isAr ? 'المحفظة الرقمية' : 'Digital Wallet'}
            </button>
            <button
              className="fbsu-alert-btn-secondary"
              onClick={() => setActiveTab('admin-panel')}
              type="button"
            >
              {isAr ? 'لوحة المسؤول (محمية)' : 'Admin Panel (Guarded)'}
            </button>
          </div>

          {activeTab === 'wallet' && (
            <div style={{ marginTop: '2rem', textAlign: 'initial' }}>
              <WalletPage onBalanceUpdate={b => setLiveBalance(b)} />
            </div>
          )}

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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onSuccess={() => {
          setActiveToast({
            title: isAr ? 'تمت المصادقة' : 'Authenticated',
            message: isAr
              ? 'تم تسجيل الدخول بنجاح وتحديث الصلاحيات'
              : 'Session authorized successfully',
            type: 'success',
          });
        }}
      />
    </AppShell>
  );
};

export const App: FC<AppContentProps> = props => {
  return (
    <AppPreferencesProvider>
      <AuthProvider>
        <AppContent {...props} />
      </AuthProvider>
    </AppPreferencesProvider>
  );
};
