import { useState, FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, User, ShieldCheck, Lock } from 'lucide-react';
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from '../schemas/authValidation';
import { useAuth } from '../context/AuthContext';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, register: registerUser } = useAuth();

  // Login form
  const {
    register: loginField,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      universityCode: 'FBSU',
    },
  });

  // Register form
  const {
    register: regField,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: regErrors, isSubmitting: isRegistering },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: 'STUDENT',
      universityCode: 'FBSU',
    },
  });

  if (!isOpen) return null;

  const onLogin = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      await login(data);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'بيانات الدخول غير صحيحة. يرجى التحقق من الرقم الجامعي وكلمة المرور.';
      setErrorMessage(errorMsg);
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setErrorMessage(null);
    try {
      await registerUser({
        universityCode: data.universityCode,
        universityNumber: data.universityNumber,
        email: data.email,
        password: data.password,
        fullNameAr: data.fullNameAr,
        fullNameEn: data.fullNameEn,
        userType: data.userType,
        phone: data.phone || undefined,
        plateLettersAr: data.plateLettersAr || undefined,
        plateDigits: data.plateDigits || undefined,
        makeModel: data.makeModel || undefined,
        color: data.color || undefined,
      });
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'فشل إنشاء الحساب. قد يكون الرقم الجامعي أو البريد مسجلاً مسبقاً.';
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="modal-overlay open" data-testid="auth-modal-overlay">
      <div className="modal-content-box" style={{ maxWidth: '520px', position: 'relative' }}>
        <button
          className="modal-close-btn"
          onClick={onClose}
          type="button"
          aria-label="Close"
          data-testid="auth-modal-close"
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img
            src="/assets/branding/fbsu-logo.png"
            style={{ height: '48px', marginBottom: '0.6rem' }}
            alt="FBSU"
          />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            بوابة الدخول الموحد لجامعة فهد بن سلطان
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            نظام إدارة وتصاريح المواقف الذكية بالذكاء الاصطناعي
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          className="auth-tab-buttons"
          style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}
        >
          <button
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            type="button"
            data-testid="tab-login"
          >
            <User size={15} />
            <span>تسجيل الدخول</span>
          </button>
          <button
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            type="button"
            data-testid="tab-register"
          >
            <ShieldCheck size={15} />
            <span>إنشاء حساب جديد</span>
          </button>
        </div>

        {errorMessage && (
          <div
            className="fbsu-toast-error"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              color: '#f43f5e',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              fontSize: '0.85rem',
            }}
            data-testid="auth-error-banner"
          >
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit(onLogin)} data-testid="login-form">
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">الرقم الجامعي أو البريد الإلكتروني:</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="مثال: 20210045 أو email@fbsu.edu.sa"
                  {...loginField('identifier')}
                />
              </div>
              {loginErrors.identifier && (
                <span
                  style={{
                    color: '#f43f5e',
                    fontSize: '0.75rem',
                    marginTop: '0.25rem',
                    display: 'block',
                  }}
                >
                  {loginErrors.identifier.message}
                </span>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">كلمة المرور:</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-control"
                  placeholder="أدخل كلمة المرور"
                  {...loginField('password')}
                />
              </div>
              {loginErrors.password && (
                <span
                  style={{
                    color: '#f43f5e',
                    fontSize: '0.75rem',
                    marginTop: '0.25rem',
                    display: 'block',
                  }}
                >
                  {loginErrors.password.message}
                </span>
              )}
            </div>

            <button
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.95rem',
                fontSize: '0.95rem',
              }}
              type="submit"
              disabled={isLoggingIn}
              data-testid="submit-login-btn"
            >
              <Lock size={18} />
              <span>{isLoggingIn ? 'جاري التحقق...' : 'تسجيل الدخول (FBSU SSO)'}</span>
            </button>

            {/* Quick 1-Click Demo Personas */}
            <div
              style={{
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                ⚡ تجربة سريعة بنقرة واحدة (حسابات العرض التفاعلي)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={isLoggingIn}
                  onClick={() => {
                    setLoginValue('identifier', '20210045');
                    setLoginValue('password', 'FbsuDev2026!');
                    onLogin({
                      identifier: '20210045',
                      password: 'FbsuDev2026!',
                      universityCode: 'FBSU',
                    });
                  }}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.45rem 0.6rem',
                    justifyContent: 'flex-start',
                  }}
                >
                  🎓 <strong>إياد الحربي</strong> (طالب)
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={isLoggingIn}
                  onClick={() => {
                    setLoginValue('identifier', '20220088');
                    setLoginValue('password', 'FbsuDev2026!');
                    onLogin({
                      identifier: '20220088',
                      password: 'FbsuDev2026!',
                      universityCode: 'FBSU',
                    });
                  }}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.45rem 0.6rem',
                    justifyContent: 'flex-start',
                  }}
                >
                  🚗 <strong>راكان المطيري</strong> (طالب)
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={isLoggingIn}
                  onClick={() => {
                    setLoginValue('identifier', 'FAC-8821');
                    setLoginValue('password', 'FbsuDev2026!');
                    onLogin({
                      identifier: 'FAC-8821',
                      password: 'FbsuDev2026!',
                      universityCode: 'FBSU',
                    });
                  }}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.45rem 0.6rem',
                    justifyContent: 'flex-start',
                  }}
                >
                  👩‍🏫 <strong>د. رغد النفيعي</strong> (أستاذ)
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={isLoggingIn}
                  onClick={() => {
                    setLoginValue('identifier', 'ADM-1001');
                    setLoginValue('password', 'FbsuDev2026!');
                    onLogin({
                      identifier: 'ADM-1001',
                      password: 'FbsuDev2026!',
                      universityCode: 'FBSU',
                    });
                  }}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.45rem 0.6rem',
                    justifyContent: 'flex-start',
                  }}
                >
                  🛡️ <strong>إدارة النظام</strong> (Admin)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit(onRegister)} data-testid="register-form">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '0.85rem',
              }}
            >
              <div className="form-group">
                <label className="form-label">الاسم بالعربية:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="مثال: أحمد العطوي"
                  {...regField('fullNameAr')}
                />
                {regErrors.fullNameAr && (
                  <span style={{ color: '#f43f5e', fontSize: '0.72rem' }}>
                    {regErrors.fullNameAr.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Name in English:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ahmed Al-Atwi"
                  {...regField('fullNameEn')}
                />
                {regErrors.fullNameEn && (
                  <span style={{ color: '#f43f5e', fontSize: '0.72rem' }}>
                    {regErrors.fullNameEn.message}
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '0.85rem',
              }}
            >
              <div className="form-group">
                <label className="form-label">الرقم الجامعي:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="20240192"
                  {...regField('universityNumber')}
                />
                {regErrors.universityNumber && (
                  <span style={{ color: '#f43f5e', fontSize: '0.72rem' }}>
                    {regErrors.universityNumber.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">الصفة الأكاديمية:</label>
                <select className="form-control" {...regField('userType')}>
                  <option value="STUDENT">طالب جامعي</option>
                  <option value="FACULTY">عضو هيئة تدريس</option>
                  <option value="STAFF">موظف إداري</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0.85rem' }}>
              <label className="form-label">البريد الإلكتروني الجامعي:</label>
              <input
                type="email"
                className="form-control"
                placeholder="student@fbsu.edu.sa"
                {...regField('email')}
              />
              {regErrors.email && (
                <span style={{ color: '#f43f5e', fontSize: '0.72rem' }}>
                  {regErrors.email.message}
                </span>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '0.85rem',
              }}
            >
              <div className="form-group">
                <label className="form-label">كلمة المرور:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="8 خانات على الأقل"
                  {...regField('password')}
                />
                {regErrors.password && (
                  <span style={{ color: '#f43f5e', fontSize: '0.72rem' }}>
                    {regErrors.password.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">رقم الجوال (اختياري):</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="0501234567"
                  {...regField('phone')}
                />
              </div>
            </div>

            {/* Vehicle Optional */}
            <div
              style={{
                background: 'rgba(255,255,255,0.02)',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--fbsu-gold)',
                  fontWeight: 800,
                  display: 'block',
                  marginBottom: '0.4rem',
                }}
              >
                بيانات المركبة لدخول البوابات التلقائي (اختياري):
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="حروف اللوحة (مثال: أ ب ح)"
                  {...regField('plateLettersAr')}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="أرقام اللوحة (مثال: 1234)"
                  {...regField('plateDigits')}
                />
              </div>
            </div>

            <button
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.95rem',
                fontSize: '0.95rem',
              }}
              type="submit"
              disabled={isRegistering}
              data-testid="submit-register-btn"
            >
              <ShieldCheck size={18} />
              <span>{isRegistering ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب وتفعيل البوابة'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
