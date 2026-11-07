import { useState, useEffect, type FC, type SyntheticEvent } from 'react';
import {
  X,
  User,
  Car,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Star,
  Trash2,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../api/profileApi';
import { useAppPreferences } from '../../../shared/context/AppPreferencesContext';
import { SaudiPlate } from '../../../shared/components/SaudiPlate';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminPanel?: (() => void) | undefined;
  onProfileUpdated?: (() => void) | undefined;
}

export const ProfileModal: FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAdminPanel,
  onProfileUpdated,
}) => {
  const { user, refreshProfile } = useAuth();
  const { isAr } = useAppPreferences();

  const [activeTab, setActiveTab] = useState<'account' | 'vehicles' | 'security'>('account');
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Account fields
  const [fullNameAr, setFullNameAr] = useState<string>('');
  const [fullNameEn, setFullNameEn] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // Add Vehicle fields
  const [plateLettersAr, setPlateLettersAr] = useState<string>('');
  const [plateDigits, setPlateDigits] = useState<string>('');
  const [makeModel, setMakeModel] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [setPrimary, setSetPrimary] = useState<boolean>(true);
  const [isSubmittingVehicle, setIsSubmittingVehicle] = useState<boolean>(false);
  const [busyVehicleId, setBusyVehicleId] = useState<string | null>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSavingPassword, setIsSavingPassword] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setStatusBanner(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && user) {
      setFullNameAr(user.fullNameAr || '');
      setFullNameEn(user.fullNameEn || '');
      setPhone(user.phone || '');
      setSpecialty(user.specialty || '');
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const extractError = (err: unknown, fallbackAr: string, fallbackEn: string): string => {
    const apiErr = err as {
      response?: {
        data?: { detail?: string; message?: string; invalidFields?: Record<string, string> };
      };
    };
    const invalidFields = apiErr?.response?.data?.invalidFields;
    if (invalidFields && Object.keys(invalidFields).length > 0) {
      const firstKey = Object.keys(invalidFields)[0];
      if (firstKey && invalidFields[firstKey]) {
        return invalidFields[firstKey];
      }
    }
    return (
      apiErr?.response?.data?.detail ||
      apiErr?.response?.data?.message ||
      (isAr ? fallbackAr : fallbackEn)
    );
  };

  const handleSaveProfile = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusBanner(null);

    if (!fullNameAr.trim() || !fullNameEn.trim()) {
      setStatusBanner({
        type: 'error',
        text: isAr
          ? 'يرجى إدخال الاسم الكامل بالعربية والإنجليزية.'
          : 'Full name in both Arabic and English is required.',
      });
      return;
    }

    setIsSavingProfile(true);
    try {
      await profileApi.updateProfile({
        fullNameAr: fullNameAr.trim(),
        fullNameEn: fullNameEn.trim(),
        phone: phone.trim() || undefined,
        specialty: specialty.trim() || undefined,
      });
      await refreshProfile();
      onProfileUpdated?.();
      setStatusBanner({
        type: 'success',
        text: isAr
          ? 'تم حفظ وتحديث بيانات ملفك الجامعي بنجاح.'
          : 'Your university profile has been updated successfully.',
      });
    } catch (err: unknown) {
      setStatusBanner({
        type: 'error',
        text: extractError(
          err,
          'تعذر تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.',
          'Failed to update profile. Please try again.'
        ),
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddVehicle = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusBanner(null);

    if (!plateLettersAr.trim() || !plateDigits.trim()) {
      setStatusBanner({
        type: 'error',
        text: isAr
          ? 'يرجى إدخال حروف اللوحة العربية وأرقامها (مثال: ط ر ق — 4040).'
          : 'Please enter Arabic plate letters and digits (e.g. ط ر ق — 4040).',
      });
      return;
    }

    setIsSubmittingVehicle(true);
    try {
      await profileApi.addVehicle({
        plateLettersAr: plateLettersAr.trim(),
        plateDigits: plateDigits.trim(),
        makeModel: makeModel.trim() || undefined,
        color: color.trim() || undefined,
        setPrimary,
      });
      await refreshProfile();
      onProfileUpdated?.();
      setPlateLettersAr('');
      setPlateDigits('');
      setMakeModel('');
      setColor('');
      setStatusBanner({
        type: 'success',
        text: isAr
          ? 'تم تسجيل المركبة وتفعيل تصريح البوابة الذكية ALPR بنجاح.'
          : 'Vehicle registered and ALPR smart gate permit activated.',
      });
    } catch (err: unknown) {
      setStatusBanner({
        type: 'error',
        text: extractError(
          err,
          'تعذر إضافة المركبة. تأكد من صحة اللوحة السعودية وعدم تسجيلها مسبقاً.',
          'Could not add vehicle. Ensure valid Saudi plate letters/digits and uniqueness.'
        ),
      });
    } finally {
      setIsSubmittingVehicle(false);
    }
  };

  const handleSetPrimary = async (vehicleId: string) => {
    setStatusBanner(null);
    setBusyVehicleId(vehicleId);
    try {
      await profileApi.setPrimaryVehicle(vehicleId);
      await refreshProfile();
      onProfileUpdated?.();
      setStatusBanner({
        type: 'success',
        text: isAr
          ? 'تم تعيين المركبة كمركبة أساسية لدخول البوابات والحجوزات.'
          : 'Designated as primary vehicle for campus gate access and bookings.',
      });
    } catch (err: unknown) {
      setStatusBanner({
        type: 'error',
        text: extractError(
          err,
          'تعذر تعيين المركبة الأساسية.',
          'Failed to designate primary vehicle.'
        ),
      });
    } finally {
      setBusyVehicleId(null);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    setStatusBanner(null);
    setBusyVehicleId(vehicleId);
    try {
      await profileApi.deleteVehicle(vehicleId);
      await refreshProfile();
      onProfileUpdated?.();
      setStatusBanner({
        type: 'success',
        text: isAr
          ? 'تم إلغاء تسجيل المركبة وسحب تصريح البوابة.'
          : 'Vehicle deactivated and gate permit revoked.',
      });
    } catch (err: unknown) {
      setStatusBanner({
        type: 'error',
        text: extractError(err, 'تعذر حذف المركبة.', 'Failed to remove vehicle.'),
      });
    } finally {
      setBusyVehicleId(null);
    }
  };

  const handleChangePassword = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusBanner(null);

    if (newPassword.length < 8) {
      setStatusBanner({
        type: 'error',
        text: isAr
          ? 'كلمة المرور الجديدة يجب ألا تقل عن 8 خانات.'
          : 'New password must be at least 8 characters.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusBanner({
        type: 'error',
        text: isAr
          ? 'تأكيد كلمة المرور الجديدة غير متطابق.'
          : 'New password confirmation does not match.',
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      await profileApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStatusBanner({
        type: 'success',
        text: isAr ? 'تم تحديث كلمة المرور بنجاح.' : 'Password updated successfully.',
      });
    } catch (err: unknown) {
      setStatusBanner({
        type: 'error',
        text: extractError(
          err,
          'كلمة المرور الحالية غير صحيحة أو تعذر التحديث.',
          'Current password is incorrect or update failed.'
        ),
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const isAdmin = user.roles.includes('CAMPUS_ADMIN');

  return (
    <div
      className="modal-overlay open"
      id="profile-modal-backdrop"
      onClick={e => {
        if ((e.target as HTMLElement).id === 'profile-modal-backdrop') onClose();
      }}
      data-testid="profile-modal-overlay"
    >
      <div
        className="modal-content-box"
        style={{
          maxWidth: '640px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          type="button"
          aria-label="Close"
          data-testid="profile-modal-close"
        >
          <X size={16} />
        </button>

        {/* Header Summary */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.85rem',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--fbsu-gold)',
                marginBottom: '0.2rem',
              }}
            >
              {isAr ? 'الملف الجامعي الموحد — FBSU ID' : 'Unified Academic Profile — FBSU ID'}
            </div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: 0,
              }}
            >
              {isAr ? user.fullNameAr : user.fullNameEn}
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <span>{user.universityNumber}</span> · <span>{user.email}</span>
            </div>
          </div>

          {isAdmin && onOpenAdminPanel && (
            <button
              type="button"
              className="btn-gold"
              onClick={() => {
                onClose();
                onOpenAdminPanel();
              }}
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              data-testid="open-admin-panel-btn"
            >
              <ShieldCheck size={15} color="#0b1a17" />
              <span>{isAr ? 'لوحة المسؤول (RBAC)' : 'Admin Console'}</span>
            </button>
          )}
        </div>

        {/* Sub-Tabs */}
        <div
          className="auth-tab-buttons"
          style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}
        >
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('account');
              setStatusBanner(null);
            }}
            data-testid="profile-tab-account"
          >
            <User size={15} />
            <span>{isAr ? 'البيانات الشخصية' : 'Account Info'}</span>
          </button>

          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('vehicles');
              setStatusBanner(null);
            }}
            data-testid="profile-tab-vehicles"
          >
            <Car size={15} />
            <span>
              {isAr
                ? `المركبات (${user.vehicles?.length || 0})`
                : `Vehicles (${user.vehicles?.length || 0})`}
            </span>
          </button>

          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('security');
              setStatusBanner(null);
            }}
            data-testid="profile-tab-security"
          >
            <Lock size={15} />
            <span>{isAr ? 'كلمة المرور' : 'Security'}</span>
          </button>
        </div>

        {/* Status Feedback Banner */}
        {statusBanner && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              background:
                statusBanner.type === 'success'
                  ? 'rgba(56, 194, 176, 0.12)'
                  : 'rgba(244, 63, 94, 0.12)',
              border:
                statusBanner.type === 'success'
                  ? '1px solid var(--status-available)'
                  : '1px solid rgba(244, 63, 94, 0.4)',
              color: statusBanner.type === 'success' ? 'var(--status-available)' : '#f43f5e',
            }}
            data-testid="profile-status-banner"
          >
            {statusBanner.type === 'success' ? (
              <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
            ) : (
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
            )}
            <span>{statusBanner.text}</span>
          </div>
        )}

        {/* TAB 1: ACCOUNT INFO */}
        {activeTab === 'account' && (
          <form onSubmit={handleSaveProfile} data-testid="profile-account-form">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.85rem',
                marginBottom: '0.85rem',
              }}
            >
              <div className="form-group">
                <label className="form-label">
                  {isAr ? 'الاسم الكامل بالعربية:' : 'Full Name (Arabic):'}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={fullNameAr}
                  onChange={e => setFullNameAr(e.target.value)}
                  data-testid="profile-fullname-ar"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isAr ? 'الاسم الكامل بالإنجليزية:' : 'Full Name (English):'}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={fullNameEn}
                  onChange={e => setFullNameEn(e.target.value)}
                  data-testid="profile-fullname-en"
                />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.85rem',
                marginBottom: '1rem',
              }}
            >
              <div className="form-group">
                <label className="form-label">{isAr ? 'رقم الجوال:' : 'Mobile Phone:'}</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="0501234567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  data-testid="profile-phone"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isAr ? 'التخصص / القسم الأكاديمي:' : 'Academic Major / Department:'}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={isAr ? 'مثال: هندسة البرمجيات' : 'e.g. Software Engineering'}
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  data-testid="profile-specialty"
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginBottom: '1.25rem',
                fontSize: '0.78rem',
              }}
            >
              <span className="badge badge-fbsu">
                {isAr ? 'الصفة:' : 'Type:'} {user.userType}
              </span>
              {user.roles.map(role => (
                <span key={role} className="badge badge-gold">
                  {role}
                </span>
              ))}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSavingProfile}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
              data-testid="profile-save-btn"
            >
              <span>
                {isSavingProfile
                  ? isAr
                    ? 'جاري الحفظ...'
                    : 'Saving...'
                  : isAr
                    ? 'حفظ التعديلات'
                    : 'Save Profile Changes'}
              </span>
            </button>
          </form>
        )}

        {/* TAB 2: REGISTERED VEHICLES */}
        {activeTab === 'vehicles' && (
          <div data-testid="profile-vehicles-section">
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {!user.vehicles || user.vehicles.length === 0 ? (
                <div
                  style={{
                    padding: '1.25rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    border: '1px dashed var(--border-subtle)',
                    fontSize: '0.85rem',
                  }}
                >
                  {isAr
                    ? 'لا توجد مركبات مسجلة حالياً. أضف مركبتك بالأسفل لتفعيل الدخول الآلي عبر بوابات ALPR.'
                    : 'No vehicles registered yet. Add your vehicle below for automated ALPR gate access.'}
                </div>
              ) : (
                user.vehicles.map(v => (
                  <div
                    key={v.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.85rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: v.primary
                        ? '1px solid var(--status-available)'
                        : '1px solid var(--border-subtle)',
                    }}
                    data-testid={`vehicle-card-${v.id}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <SaudiPlate
                        lettersAr={v.plateLettersAr}
                        lettersEn={v.plateLettersEn}
                        digits={v.plateDigits}
                        isPrimary={v.primary}
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                          {v.makeModel || (isAr ? 'مركبة مسجلة' : 'Registered Vehicle')}
                          {v.color ? ` (${v.color})` : ''}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {v.primary ? (
                            <span style={{ color: 'var(--status-available)', fontWeight: 700 }}>
                              ★ {isAr ? 'المركبة الأساسية للبوابات' : 'Primary Gate Vehicle'}
                            </span>
                          ) : (
                            <span>{isAr ? 'مركبة إضافية مصرحة' : 'Secondary Permitted'}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                      {!v.primary && (
                        <button
                          type="button"
                          className="utility-pill-btn"
                          disabled={busyVehicleId === v.id}
                          onClick={() => handleSetPrimary(v.id)}
                          data-testid={`set-primary-vehicle-${v.id}`}
                        >
                          <Star size={13} color="var(--fbsu-gold)" />
                          <span>{isAr ? 'تعيين أساسية' : 'Set Primary'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        className="utility-pill-btn"
                        disabled={busyVehicleId === v.id}
                        onClick={() => handleDeleteVehicle(v.id)}
                        style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.35)' }}
                        data-testid={`delete-vehicle-${v.id}`}
                      >
                        <Trash2 size={13} />
                        <span>{isAr ? 'حذف' : 'Remove'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add New Vehicle Form */}
            <form
              onSubmit={handleAddVehicle}
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
              }}
              data-testid="add-vehicle-form"
            >
              <h4
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  color: 'var(--fbsu-gold)',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Plus size={15} />
                <span>
                  {isAr ? 'تسجيل مركبة جديدة (لوحة سعودية)' : 'Register New Saudi Vehicle'}
                </span>
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.65rem',
                  marginBottom: '0.75rem',
                }}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder={isAr ? 'حروف اللوحة (مثال: ح ر ب)' : 'Arabic Letters (e.g. ح ر ب)'}
                  value={plateLettersAr}
                  onChange={e => setPlateLettersAr(e.target.value)}
                  data-testid="new-vehicle-letters"
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder={isAr ? 'الأرقام (مثال: 4040)' : 'Digits (e.g. 4040)'}
                  value={plateDigits}
                  onChange={e => setPlateDigits(e.target.value)}
                  data-testid="new-vehicle-digits"
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder={isAr ? 'الطراز (مثال: كامري 2025)' : 'Model (e.g. Camry 2025)'}
                  value={makeModel}
                  onChange={e => setMakeModel(e.target.value)}
                  data-testid="new-vehicle-model"
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder={isAr ? 'اللون (مثال: أبيض)' : 'Color (e.g. White)'}
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  data-testid="new-vehicle-color"
                />
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={setPrimary}
                  onChange={e => setSetPrimary(e.target.checked)}
                />
                <span>
                  {isAr
                    ? 'اعتمادها كمركبة أساسية للبوابات الذكية والحجوزات'
                    : 'Set as primary vehicle for ALPR gates and bookings'}
                </span>
              </label>

              <button
                type="submit"
                className="btn-gold"
                disabled={isSubmittingVehicle}
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                data-testid="vehicle-add-btn"
              >
                <Car size={16} color="#0b1a17" />
                <span>
                  {isSubmittingVehicle
                    ? isAr
                      ? 'جاري التسجيل...'
                      : 'Registering...'
                    : isAr
                      ? 'إضافة المركبة وتفعيل التصريح'
                      : 'Add Vehicle & Issue Gate Permit'}
                </span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PASSWORD & SECURITY */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} data-testid="profile-password-form">
            <div className="form-group" style={{ marginBottom: '0.85rem' }}>
              <label className="form-label">
                {isAr ? 'كلمة المرور الحالية:' : 'Current Password:'}
              </label>
              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                data-testid="current-password-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0.85rem' }}>
              <label className="form-label">
                {isAr
                  ? 'كلمة المرور الجديدة (8 خانات على الأقل):'
                  : 'New Password (min 8 characters):'}
              </label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                data-testid="new-password-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">
                {isAr ? 'تأكيد كلمة المرور الجديدة:' : 'Confirm New Password:'}
              </label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                data-testid="confirm-password-input"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSavingPassword}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
              data-testid="password-save-btn"
            >
              <Lock size={16} />
              <span>
                {isSavingPassword
                  ? isAr
                    ? 'جاري التحديث...'
                    : 'Updating...'
                  : isAr
                    ? 'تحديث كلمة المرور'
                    : 'Update Password'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
