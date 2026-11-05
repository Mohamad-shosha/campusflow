import { useState, useRef, useEffect, FC } from 'react';
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
  Zap,
  Camera,
  RefreshCw,
  Users,
  UserCheck,
  DoorClosed,
} from 'lucide-react';
import type { AppUser } from '../types/navigation';

export interface HeaderProps {
  isAr: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: AppUser;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleLang: () => void;
  isLightTheme: boolean;
  onToggleTheme: () => void;
  notificationCount?: number;
  onOpenNotifications?: () => void;
  onOpenWallet?: () => void;
  onOpenAuth?: () => void;
}

export const Header: FC<HeaderProps> = ({
  isAr,
  activeTab,
  onTabChange,
  currentUser,
  soundEnabled,
  onToggleSound,
  onToggleLang,
  isLightTheme,
  onToggleTheme,
  notificationCount = 3,
  onOpenNotifications,
  onOpenWallet,
  onOpenAuth,
}) => {
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

  const isParkingActive = ['map', 'booking', 'simulator', 'gate', 'share'].includes(activeTab);
  const isCampusActive = ['tutoring', 'office-hours', 'rooms'].includes(activeTab);

  return (
    <header className="main-header" ref={headerRef} data-testid="main-header">
      <div className="header-compact-container">
        {/* Right Section: Brand & Nav */}
        <div className="header-right-group">
          <div className="brand-section">
            <img
              src="/assets/branding/fbsu-logo.png"
              alt="شعار جامعة فهد بن سلطان"
              className="brand-logo-img"
              style={{ height: '36px' }}
            />
            <h1 className="brand-uni-name">
              {isAr ? 'جامعة فهد بن سلطان' : 'Fahad Bin Sultan University'}
            </h1>
          </div>

          <nav className="nav-menu">
            {/* Smart Parking Suite Dropdown */}
            <div className={`nav-dropdown-group ${openDropdown === 'parking' ? 'open' : ''}`}>
              <button
                className={`nav-item nav-dropdown-trigger ${isParkingActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === 'parking' ? null : 'parking');
                }}
                type="button"
              >
                <Car size={14} />
                <span>{isAr ? 'المواقف الذكية' : 'Smart Parking'}</span>
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
                    <span className="dropdown-item-title">{isAr ? 'خريطة المواقف الحية' : 'Live Map'}</span>
                    <span className="dropdown-item-desc">{isAr ? '30 موقفاً وحساسات إنترنت الأشياء' : '30 Bays & IoT'}</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'booking' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('booking')}
                  type="button"
                >
                  <Calendar size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{isAr ? 'حجز موقف وتصريح ذكي' : 'Book Parking'}</span>
                    <span className="dropdown-item-desc">{isAr ? 'تصريح رقمي FBSU Pass فوري' : 'Digital QR & NFC'}</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'simulator' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('simulator')}
                  type="button"
                >
                  <Zap size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{isAr ? 'محاكاة التبادل Flex-Share' : 'Flex Swap Demo'}</span>
                    <span className="dropdown-item-desc">{isAr ? 'سيناريو بريك إياد وراكان' : 'Break Swap'}</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'gate' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('gate')}
                  type="button"
                >
                  <Camera size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{isAr ? 'كاميرات وقارئ اللوحات ALPR' : 'Gate ALPR'}</span>
                    <span className="dropdown-item-desc">{isAr ? 'رؤية حاسوبية وبوابة آلية' : 'Optical Plate Reader'}</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'share' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('share')}
                  type="button"
                >
                  <RefreshCw size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{isAr ? 'شارك موقفك واربح' : 'Share & Earn'}</span>
                    <span className="dropdown-item-desc">{isAr ? 'كاش باك 17.25 ر.س بالمحفظة' : '17.25 SAR per break'}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Campus Hub Dropdown */}
            <div className={`nav-dropdown-group ${openDropdown === 'campus' ? 'open' : ''}`}>
              <button
                className={`nav-item nav-dropdown-trigger ${isCampusActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === 'campus' ? null : 'campus');
                }}
                type="button"
              >
                <BookOpen size={14} />
                <span>{isAr ? 'الحرم والأنشطة' : 'Campus Hub'}</span>
                <span className="nav-highlight-dot"></span>
                <ChevronDown size={12} className="dropdown-arrow" />
              </button>

              <div className="nav-dropdown-menu">
                <button
                  className={`dropdown-item ${activeTab === 'tutoring' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('tutoring')}
                  type="button"
                >
                  <Users size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{isAr ? 'النشاط الطلابي والتدريس (70 ر.س)' : 'Peer Tutoring (70 SAR)'}</span>
                    <span className="dropdown-item-desc">{isAr ? 'حصص تقوية وسداد الرسوم الجامعية' : 'Lectures & tuition fee offset'}</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'office-hours' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('office-hours')}
                  type="button"
                >
                  <UserCheck size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{isAr ? 'الساعات المكتبية للعمداء والرؤساء' : 'Faculty Office Hours'}</span>
                    <span className="dropdown-item-desc">{isAr ? 'د. رغد النفيعي ود. محمد مزهر' : 'Dr. Raghad & Dr. Mezher'}</span>
                  </div>
                </button>
                <button
                  className={`dropdown-item ${activeTab === 'rooms' ? 'active' : ''}`}
                  onClick={() => handleDropdownItemClick('rooms')}
                  type="button"
                >
                  <DoorClosed size={14} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-title">{isAr ? 'حجز القاعات ومعامل الحاسوب' : 'Labs & Study Pods'}</span>
                    <span className="dropdown-item-desc">{isAr ? 'إياد، راكان، عبد العزيز ومؤقت المغادرة' : 'Teamwork & countdown timer'}</span>
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
              <span>{isAr ? 'التحليلات' : 'Analytics'}</span>
            </button>
          </nav>
        </div>

        {/* Left Section: Controls, Utilities, Badges */}
        <div className="header-left-cluster">
          <div className="system-utilities-capsule">
            <button
              className={`utility-pill-btn ${soundEnabled ? 'sound-active' : ''}`}
              onClick={onToggleSound}
              type="button"
              title={soundEnabled ? (isAr ? 'كتم المؤثرات الصوتية' : 'Mute Sound') : (isAr ? 'تشغيل المؤثرات الصوتية' : 'Enable Sound')}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="utility-text-label">{soundEnabled ? (isAr ? 'صوت' : 'Sound') : (isAr ? 'صامت' : 'Muted')}</span>
            </button>

            <span className="utility-divider"></span>

            <button
              className="utility-pill-btn"
              onClick={onToggleLang}
              type="button"
              title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe size={14} />
              <span className="utility-text-label" style={{ fontWeight: 800 }}>{isAr ? 'EN' : 'عربي'}</span>
            </button>

            <span className="utility-divider"></span>

            <button
              className="utility-pill-btn"
              onClick={onToggleTheme}
              type="button"
              title={isAr ? 'تبديل المظهر' : 'Toggle Theme'}
            >
              {isLightTheme ? <Sun size={14} color="var(--fbsu-gold)" /> : <Moon size={14} />}
              <span className="utility-text-label">{isAr ? (isLightTheme ? 'نهاري' : 'ليلي') : (isLightTheme ? 'Light' : 'Dark')}</span>
            </button>
          </div>

          {/* Direct Notifications */}
          <button
            className="wallet-badge-btn"
            onClick={onOpenNotifications}
            type="button"
            style={{
              background: 'rgba(215, 162, 55, 0.12)',
              borderColor: 'var(--fbsu-gold-border)',
              gap: '0.4rem',
            }}
          >
            <Bell size={14} color="var(--fbsu-gold)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--fbsu-gold)' }}>
              {notificationCount}
            </span>
          </button>

          {/* University Wallet */}
          <button
            className="wallet-badge-btn"
            onClick={onOpenWallet}
            type="button"
          >
            <Wallet size={13} color="var(--fbsu-gold)" />
            <span>{currentUser.walletBalance.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}</span>
          </button>

          {/* User Profile */}
          <button
            className="auth-btn-header"
            onClick={onOpenAuth}
            type="button"
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
              {isAr ? currentUser.name.split(' ')[0] : currentUser.nameEn.split(' ')[0]} ({currentUser.role.split(' ')[0]})
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

