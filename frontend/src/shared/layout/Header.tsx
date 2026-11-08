import { useState, useRef, useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Car,
  ChevronDown,
  BookOpen,
  BarChart3,
  Volume2,
  VolumeX,
  Globe,
  Sun,
  Moon,
  Bell,
  Wallet,
  MapPin,
  Calendar,
  Camera,
  RefreshCw,
  Users,
  UserCheck,
  DoorClosed,
  GraduationCap,
  LogIn,
  LogOut,
} from 'lucide-react';
import type { AppUser } from '../types/navigation';
import { useAppPreferences } from '../context/AppPreferencesContext';

export interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: AppUser;
  isAuthenticated?: boolean | undefined;
  onLogout?: (() => void) | undefined;
  notificationCount?: number | undefined;
  onOpenNotifications?: (() => void) | undefined;
  onOpenWallet?: (() => void) | undefined;
  onOpenAuth?: (() => void) | undefined;
  onOpenProfile?: (() => void) | undefined;
}

export const Header: FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  isAuthenticated = false,
  onLogout,
  notificationCount = 3,
  onOpenNotifications,
  onOpenWallet,
  onOpenAuth,
  onOpenProfile,
}) => {
  const { t } = useTranslation();
  const { isAr, soundEnabled, toggleSound, toggleLanguage, isLightTheme, toggleTheme } =
    useAppPreferences();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleDropdownItemClick = (tabId: string) => {
    onTabChange(tabId);
    setOpenDropdown(null);
  };

  const isParkingActive = ['map', 'booking', 'gate', 'share'].includes(activeTab);
  const isCampusActive = ['tuition', 'tutoring', 'office-hours', 'rooms'].includes(activeTab);

  return (
    <header className="main-header" ref={headerRef} data-testid="main-header">
      <div className="header-compact-container">
        {/* Right Section: Brand & Nav */}
        <div className="header-right-group">
          <div className="brand-section">
            <img
              src="/assets/branding/fbsu-logo.png"
              alt="FBSU Logo"
              className="brand-logo-img"
              style={{ height: '36px' }}
            />
            <h1 className="brand-uni-name">{t('common.universityName')}</h1>
          </div>

          <nav className="nav-menu">
            {/* Smart Parking Suite Dropdown */}
            <div className={`nav-dropdown-group ${openDropdown === 'parking' ? 'open' : ''}`}>
              <button
                className={`nav-item nav-dropdown-trigger ${isParkingActive ? 'active' : ''}`}
                onClick={e => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === 'parking' ? null : 'parking');
                }}
                type="button"
                aria-expanded={openDropdown === 'parking'}
              >
                <Car size={14} />
                <span>{t('nav.parkingSuite')}</span>
                <ChevronDown size={12} className="dropdown-arrow" />
              </button>

              <div className="nav-dropdown-menu">
                <button
                  className={`dropdown-item ${activeTab === 'map' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('map')}
                  type="button"
                >
                  <MapPin size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{t('nav.liveMap')}</span>
                    <span className="dropdown-item-desc">{t('nav.liveMapDesc')}</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'booking' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('booking')}
                  type="button"
                >
                  <Calendar size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{t('nav.bookParking')}</span>
                    <span className="dropdown-item-desc">{t('nav.bookParkingDesc')}</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'gate' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('gate')}
                  type="button"
                >
                  <Camera size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{t('nav.gateAlpr')}</span>
                    <span className="dropdown-item-desc">{t('nav.gateAlprDesc')}</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'share' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('share')}
                  type="button"
                >
                  <RefreshCw size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{t('nav.shareAndEarn')}</span>
                    <span className="dropdown-item-desc">{t('nav.shareAndEarnDesc')}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Campus Hub Dropdown */}
            <div className={`nav-dropdown-group ${openDropdown === 'campus' ? 'open' : ''}`}>
              <button
                className={`nav-item nav-dropdown-trigger ${isCampusActive ? 'active' : ''}`}
                onClick={e => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === 'campus' ? null : 'campus');
                }}
                type="button"
                aria-expanded={openDropdown === 'campus'}
              >
                <BookOpen size={14} />
                <span>{t('nav.campusHub')}</span>
                <span className="nav-highlight-dot"></span>
                <ChevronDown size={12} className="dropdown-arrow" />
              </button>

              <div className="nav-dropdown-menu">
                <button
                  className={`dropdown-item ${activeTab === 'tuition' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('tuition')}
                  type="button"
                  data-testid="nav-tuition-item"
                >
                  <GraduationCap size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">
                      {isAr ? 'الرسوم الدراسية والإيصالات' : 'Tuition & Receipts'}
                    </span>
                    <span className="dropdown-item-desc">
                      {isAr
                        ? 'سداد الفواتير الأكاديمية من المحفظة'
                        : 'Academic invoices & verified receipts'}
                    </span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'tutoring' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('tutoring')}
                  type="button"
                >
                  <Users size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{t('nav.peerTutoring')}</span>
                    <span className="dropdown-item-desc">{t('nav.peerTutoringDesc')}</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'office-hours' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('office-hours')}
                  type="button"
                >
                  <UserCheck size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{t('nav.officeHours')}</span>
                    <span className="dropdown-item-desc">{t('nav.officeHoursDesc')}</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'rooms' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('rooms')}
                  type="button"
                >
                  <DoorClosed size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{t('nav.studyRooms')}</span>
                    <span className="dropdown-item-desc">{t('nav.studyRoomsDesc')}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Direct Analytics Tab */}
            <button
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => onTabChange('analytics')}
              type="button"
            >
              <BarChart3 size={14} />
              <span>{t('nav.analytics')}</span>
            </button>
          </nav>
        </div>

        {/* Left Section: Controls, Utilities, Badges */}
        <div className="header-left-cluster">
          <div className="system-utilities-capsule">
            <button
              className={`utility-pill-btn ${soundEnabled ? 'sound-active' : ''}`}
              onClick={toggleSound}
              type="button"
              title={soundEnabled ? t('utilities.disableSound') : t('utilities.enableSound')}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="utility-text-label">
                {soundEnabled ? t('utilities.sound') : t('utilities.muted')}
              </span>
            </button>

            <span className="utility-divider"></span>

            <button
              className="utility-pill-btn"
              onClick={toggleLanguage}
              type="button"
              title={isAr ? t('utilities.switchToEn') : t('utilities.switchToAr')}
            >
              <Globe size={14} />
              <span className="utility-text-label" style={{ fontWeight: 800 }}>
                {isAr ? 'EN' : 'عربي'}
              </span>
            </button>

            <span className="utility-divider"></span>

            <button
              className="utility-pill-btn"
              onClick={toggleTheme}
              type="button"
              title={t('utilities.toggleTheme')}
            >
              {isLightTheme ? <Sun size={14} color="var(--fbsu-gold)" /> : <Moon size={14} />}
              <span className="utility-text-label">
                {isLightTheme ? t('utilities.themeLight') : t('utilities.themeDark')}
              </span>
            </button>
          </div>

          {/* Direct Notifications */}
          <button
            className="wallet-badge-btn"
            onClick={onOpenNotifications}
            type="button"
            title={t('utilities.notificationsTitle')}
            data-testid="header-notifications-btn"
            style={{
              background: 'rgba(215, 162, 55, 0.12)',
              borderColor: 'var(--fbsu-gold-border)',
              gap: '0.4rem',
            }}
          >
            <Bell size={14} color="var(--fbsu-gold)" />
            <span
              data-testid="header-unread-badge"
              style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--fbsu-gold)' }}
            >
              {notificationCount}
            </span>
          </button>

          {/* University Wallet */}
          <button
            className="wallet-badge-btn"
            onClick={onOpenWallet}
            type="button"
            title={t('utilities.walletTitle')}
            data-testid="header-wallet-btn"
          >
            <Wallet size={13} color="var(--fbsu-gold)" />
            <span data-testid="header-wallet-balance">
              {isAuthenticated ? currentUser.walletBalance.toFixed(2) : '0.00'}{' '}
              {t('common.currency')}
            </span>
          </button>

          {/* User Profile / Sign In & Sign Out */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                className="auth-btn-header"
                onClick={onOpenProfile ?? onOpenAuth}
                type="button"
                title={t('utilities.profileTitle')}
                data-testid="header-auth-btn"
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: currentUser.avatarColor || '#116E63',
                    display: 'inline-block',
                  }}
                ></span>
                <span>
                  {isAr ? currentUser.name.split(' ')[0] : currentUser.nameEn.split(' ')[0]} (
                  {isAr ? currentUser.role.split(' ')[0] : currentUser.roleEn.split(' ')[0]})
                </span>
              </button>
              {onLogout && (
                <button
                  className="utility-pill-btn"
                  onClick={onLogout}
                  type="button"
                  title={t('auth.signOut')}
                  data-testid="header-logout-btn"
                  style={{
                    border: '1px solid rgba(239, 68, 68, 0.45)',
                    color: '#f87171',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <LogOut size={13} />
                  <span className="utility-text-label">{t('auth.signOut')}</span>
                </button>
              )}
            </div>
          ) : (
            <button
              className="auth-btn-header"
              onClick={onOpenAuth}
              type="button"
              title={t('utilities.profileTitle')}
              data-testid="header-auth-btn"
            >
              <LogIn size={14} color="var(--fbsu-gold)" />
              <span>{t('auth.signIn')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
