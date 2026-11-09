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
import { useAppPreferences } from '../../../shared/context/AppPreferencesContext';

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
  const { isAr } = useAppPreferences();

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
        (isAr
          ? 'بيانات الدخول غير صحيحة. يرجى التحقق من الرقم الجامعي وكلمة المرور.'
          : 'Invalid credentials. Please verify your university ID/email and password.');
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
        (isAr
          ? 'فشل إنشاء الحساب. قد يكون الرقم الجامعي أو البريد مسجلاً مسبقاً.'
          : 'Registration failed. University ID or email may already be registered.');
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
            {isAr
              ? 'بوابة الدخول الموحد لجامعة فهد بن سلطان'
              : 'Fahad Bin Sultan University Unified SSO'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {isAr
              ? 'نظام إدارة وتصاريح المواقف الذكية بالذكاء الاصطناعي'
              : 'AI Smart Campus Parking & Digital Permits Gateway'}
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
            <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
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
            <span>{isAr ? 'إنشاء حساب جديد' : 'Create Account'}</span>
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
              <label className="form-label">
                {isAr ? 'الرقم الجامعي أو البريد الإلكتروني:' : 'University ID or Email:'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={
                    isAr
                      ? 'مثال: 20210045 أو email@fbsu.edu.sa'
                      : 'e.g. 20210045 or email@fbsu.edu.sa'
                  }
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
              <label className="form-label">{isAr ? 'كلمة المرور:' : 'Password:'}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-control"
                  placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter your password'}
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
              <span>
                {isLoggingIn
                  ? isAr
                    ? 'جاري التحقق...'
                    : 'Verifying...'
                  : isAr
                    ? 'تسجيل الدخول (FBSU SSO)'
                    : 'Sign In (FBSU SSO)'}
              </span>
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
                {isAr
                  ? '⚡ تجربة سريعة بنقرة واحدة (حسابات العرض التفاعلي)'
                  : '⚡ 1-Click Demo Personas (Interactive Accounts)'}
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
                  🎓 <strong>{isAr ? 'إياد الحربي' : 'Eyad Al-Harbi'}</strong> (
                  {isAr ? 'طالب' : 'Student'})
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
                  🚗 <strong>{isAr ? 'راكان المطيري' : 'Rakan Al-Mutairi'}</strong> (
                  {isAr ? 'طالب' : 'Student'})
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
                  👩‍🏫 <strong>{isAr ? 'د. رغد النفيعي' : 'Dr. Raghad'}</strong> (
                  {isAr ? 'أستاذ' : 'Faculty'})
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
                  🛡️ <strong>{isAr ? 'إدارة النظام' : 'System Admin'}</strong> (Admin)
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
                <label className="form-label">
                  {isAr ? 'الاسم بالعربية:' : 'Full Name (Arabic):'}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={isAr ? 'مثال: أحمد العطوي' : 'أحمد العطوي'}
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
                <label className="form-label">{isAr ? 'الرقم الجامعي:' : 'University ID:'}</label>
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
                <label className="form-label">
                  {isAr ? 'الصفة الأكاديمية:' : 'Academic Role:'}
                </label>
                <select className="form-control" {...regField('userType')}>
                  <option value="STUDENT">{isAr ? 'طالب جامعي' : 'University Student'}</option>
                  <option value="FACULTY">{isAr ? 'عضو هيئة تدريس' : 'Faculty Member'}</option>
                  <option value="STAFF">{isAr ? 'موظف إداري' : 'Administrative Staff'}</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0.85rem' }}>
              <label className="form-label">
                {isAr ? 'البريد الإلكتروني الجامعي:' : 'University Email:'}
              </label>
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
                <label className="form-label">{isAr ? 'كلمة المرور:' : 'Password:'}</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder={isAr ? '8 خانات على الأقل' : 'At least 8 characters'}
                  {...regField('password')}
                />
                {regErrors.password && (
                  <span style={{ color: '#f43f5e', fontSize: '0.72rem' }}>
                    {regErrors.password.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isAr ? 'رقم الجوال (اختياري):' : 'Mobile Phone (Optional):'}
                </label>
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
                background: 'var(--surface-soft)',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--gold-text)',
                  fontWeight: 800,
                  display: 'block',
                  marginBottom: '0.4rem',
                }}
              >
                {isAr
                  ? 'بيانات المركبة لدخول البوابات التلقائي (اختياري):'
                  : 'Vehicle Details for Automated ALPR Gate Access (Optional):'}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={
                    isAr ? 'حروف اللوحة (مثال: أ ب ح)' : 'Arabic Plate Letters (e.g. أ ب ح)'
                  }
                  {...regField('plateLettersAr')}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder={isAr ? 'أرقام اللوحة (مثال: 1234)' : 'Plate Digits (e.g. 1234)'}
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
              <span>
                {isRegistering
                  ? isAr
                    ? 'جاري إنشاء الحساب...'
                    : 'Creating Account...'
                  : isAr
                    ? 'إنشاء الحساب وتفعيل البوابة'
                    : 'Create Account & Activate Portal'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
