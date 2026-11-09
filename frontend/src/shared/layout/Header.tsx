import { useState, useRef, useEffect, type FC, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Car,
  ChevronDown,
  BookOpen,
  BarChart3,
  Volume2,
  VolumeX,
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
  Bus,
  LogIn,
  LogOut,
  Menu,
  X,
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

type IconType = ComponentType<{ size?: number | string }>;

interface NavLeaf {
  id: string;
  icon: IconType;
  title: string;
  desc: string;
  activeIds?: string[];
  testId?: string;
}

interface NavGroup {
  id: string;
  icon: IconType;
  label: string;
  items: NavLeaf[];
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('');

export const Header: FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  isAuthenticated = false,
  onLogout,
  notificationCount = 0,
  onOpenNotifications,
  onOpenWallet,
  onOpenAuth,
  onOpenProfile,
}) => {
  const { t } = useTranslation();
  const { isAr, soundEnabled, toggleSound, toggleLanguage, isLightTheme, toggleTheme } =
    useAppPreferences();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const go = (tabId: string) => {
    onTabChange(tabId);
    setOpenGroup(null);
    setMobileOpen(false);
  };

  const groups: NavGroup[] = [
    {
      id: 'parking',
      icon: Car,
      label: t('nav.parkingSuite'),
      items: [
        { id: 'map', icon: MapPin, title: t('nav.liveMap'), desc: t('nav.liveMapDesc') },
        {
          id: 'booking',
          icon: Calendar,
          title: t('nav.bookParking'),
          desc: t('nav.bookParkingDesc'),
        },
        { id: 'gate', icon: Camera, title: t('nav.gateAlpr'), desc: t('nav.gateAlprDesc') },
        {
          id: 'share',
          icon: RefreshCw,
          title: t('nav.shareAndEarn'),
          desc: t('nav.shareAndEarnDesc'),
        },
      ],
    },
    {
      id: 'campus',
      icon: BookOpen,
      label: t('nav.campusHub'),
      items: [
        {
          id: 'tutoring',
          icon: Users,
          title: t('nav.peerTutoring'),
          desc: t('nav.peerTutoringDesc'),
        },
        {
          id: 'office-hours',
          icon: UserCheck,
          title: t('nav.officeHours'),
          desc: t('nav.officeHoursDesc'),
        },
        {
          id: 'rooms',
          icon: DoorClosed,
          title: t('nav.studyRooms'),
          desc: t('nav.studyRoomsDesc'),
        },
        {
          id: 'bus',
          icon: Bus,
          title: isAr ? 'النقل الجامعي' : 'Campus Transit',
          desc: isAr ? 'المسارات والحافلات وتذاكر الصعود' : 'Routes, shuttles & boarding passes',
          activeIds: ['bus', 'transit'],
          testId: 'nav-transit-item',
        },
      ],
    },
    {
      id: 'finance',
      icon: Wallet,
      label: isAr ? 'المالية' : 'Finance',
      items: [
        {
          id: 'wallet',
          icon: Wallet,
          title: isAr ? 'المحفظة الجامعية' : 'Campus Wallet',
          desc: isAr ? 'الرصيد والشحن والتحويل والسجل' : 'Balance, top-up, transfers & ledger',
        },
        {
          id: 'tuition',
          icon: GraduationCap,
          title: isAr ? 'الرسوم الدراسية والإيصالات' : 'Tuition & Receipts',
          desc: isAr ? 'سداد الفواتير الأكاديمية من المحفظة' : 'Academic invoices & receipts',
          testId: 'nav-tuition-item',
        },
      ],
    },
  ];

  const isLeafActive = (leaf: NavLeaf) => (leaf.activeIds ?? [leaf.id]).includes(activeTab);
  const isGroupActive = (group: NavGroup) => group.items.some(isLeafActive);

  const renderLeaf = (leaf: NavLeaf, inMobile = false) => {
    const Icon = leaf.icon;
    return (
      <button
        key={leaf.id}
        type="button"
        className={`cf-menu__item ${isLeafActive(leaf) ? 'is-active' : ''}`}
        onClick={() => go(leaf.id)}
        aria-current={isLeafActive(leaf) ? 'page' : undefined}
        data-testid={inMobile ? undefined : leaf.testId}
      >
        <span className="cf-menu__icon">
          <Icon size={16} />
        </span>
        <span>
          <span className="cf-menu__title">{leaf.title}</span>
          <span className="cf-menu__desc">{leaf.desc}</span>
        </span>
      </button>
    );
  };

  const displayName = isAr ? currentUser.name : currentUser.nameEn || currentUser.name;
  const displayRole = isAr ? currentUser.role : currentUser.roleEn || currentUser.role;
  const unread = notificationCount ?? 0;

  const utilityButtons = (
    <>
      <button
        className="cf-icon-btn"
        onClick={toggleLanguage}
        type="button"
        title={isAr ? t('utilities.switchToEn') : t('utilities.switchToAr')}
        aria-label={isAr ? t('utilities.switchToEn') : t('utilities.switchToAr')}
      >
        <span className="cf-icon-btn__text">{isAr ? 'EN' : 'ع'}</span>
      </button>
      <button
        className="cf-icon-btn"
        onClick={toggleTheme}
        type="button"
        title={t('utilities.toggleTheme')}
        aria-label={t('utilities.toggleTheme')}
      >
        {isLightTheme ? <Moon size={17} /> : <Sun size={17} />}
      </button>
      <button
        className="cf-icon-btn"
        onClick={toggleSound}
        type="button"
        title={soundEnabled ? t('utilities.disableSound') : t('utilities.enableSound')}
        aria-label={soundEnabled ? t('utilities.disableSound') : t('utilities.enableSound')}
        aria-pressed={soundEnabled}
      >
        {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
      </button>
    </>
  );

  return (
    <header className="cf-header" ref={headerRef} data-testid="main-header">
      <div className="cf-header__bar">
        <button
          type="button"
          className="cf-icon-btn cf-menu-toggle"
          onClick={() => setMobileOpen(open => !open)}
          aria-expanded={mobileOpen}
          aria-controls="cf-mobile-nav"
          aria-label={isAr ? 'القائمة' : 'Menu'}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <button type="button" className="cf-brand" onClick={() => go('map')}>
          <img src="/assets/branding/fbsu-logo.png" alt="FBSU" />
          <span className="cf-brand__text">
            <span className="cf-brand__name">{t('common.universityName')}</span>
            <span className="cf-brand__tag">CampusFlow</span>
          </span>
        </button>

        <nav className="cf-nav" aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}>
          {groups.map(group => {
            const GroupIcon = group.icon;
            const isOpen = openGroup === group.id;
            return (
              <div
                key={group.id}
                className={`cf-nav__item ${isOpen ? 'is-open' : ''}`}
                onMouseEnter={() => setOpenGroup(group.id)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  type="button"
                  className={`cf-nav__link ${isGroupActive(group) ? 'is-active' : ''}`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={e => {
                    e.stopPropagation();
                    setOpenGroup(isOpen ? null : group.id);
                  }}
                >
                  <GroupIcon size={16} />
                  <span>{group.label}</span>
                  <ChevronDown size={14} className="cf-caret" />
                </button>
                <div className="cf-menu" role="menu">
                  {group.items.map(leaf => renderLeaf(leaf))}
                </div>
              </div>
            );
          })}
          <div className="cf-nav__item">
            <button
              type="button"
              className={`cf-nav__link ${activeTab === 'analytics' ? 'is-active' : ''}`}
              onClick={() => go('analytics')}
              aria-current={activeTab === 'analytics' ? 'page' : undefined}
            >
              <BarChart3 size={16} />
              <span>{t('nav.analytics')}</span>
            </button>
          </div>
        </nav>

        <div className="cf-header__actions">
          <div className="cf-header__utils">
            {utilityButtons}
            <span className="cf-divider" aria-hidden="true" />
          </div>

          <button
            className="cf-icon-btn"
            onClick={onOpenNotifications}
            type="button"
            title={t('utilities.notificationsTitle')}
            aria-label={t('utilities.notificationsTitle')}
            data-testid="header-notifications-btn"
          >
            <Bell size={18} />
            <span
              className={`cf-count-badge ${unread === 0 ? 'is-zero' : ''}`}
              data-testid="header-unread-badge"
            >
              {unread > 99 ? '99+' : unread}
            </span>
          </button>

          <button
            className="cf-wallet-pill"
            onClick={onOpenWallet}
            type="button"
            title={t('utilities.walletTitle')}
            data-testid="header-wallet-btn"
          >
            <Wallet size={15} />
            <span data-testid="header-wallet-balance">
              {isAuthenticated ? currentUser.walletBalance.toFixed(2) : '0.00'}{' '}
              <span className="cf-wallet-pill__label">{t('common.currency')}</span>
            </span>
          </button>

          {isAuthenticated ? (
            <>
              <button
                className="cf-user-btn"
                onClick={onOpenProfile ?? onOpenAuth}
                type="button"
                title={t('utilities.profileTitle')}
                data-testid="header-auth-btn"
              >
                <span
                  className="cf-avatar"
                  style={{ background: currentUser.avatarColor || 'var(--fbsu-primary)' }}
                  aria-hidden="true"
                >
                  {initials(displayName)}
                </span>
                <span className="cf-user-name">{displayName.split(' ')[0]}</span>
                <span className="cf-user-role">· {displayRole.split(' ')[0]}</span>
              </button>
              {onLogout && (
                <button
                  className="cf-icon-btn"
                  onClick={onLogout}
                  type="button"
                  title={t('auth.signOut')}
                  aria-label={t('auth.signOut')}
                  data-testid="header-logout-btn"
                >
                  <LogOut size={17} />
                </button>
              )}
            </>
          ) : (
            <button
              className="btn-primary cf-signin-btn"
              onClick={onOpenAuth}
              type="button"
              title={t('utilities.profileTitle')}
              data-testid="header-auth-btn"
            >
              <LogIn size={16} />
              <span>{t('auth.signIn')}</span>
            </button>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div
          className="cf-mobile-panel"
          id="cf-mobile-nav"
          role="navigation"
          aria-label={isAr ? 'القائمة' : 'Menu'}
        >
          {groups.map(group => (
            <div key={group.id} className="cf-mobile-group">
              <div className="cf-mobile-group__title">{group.label}</div>
              <div className="cf-mobile-grid">
                {group.items.map(leaf => renderLeaf(leaf, true))}
              </div>
            </div>
          ))}
          <div className="cf-mobile-group">
            <div className="cf-mobile-grid">
              {renderLeaf(
                {
                  id: 'analytics',
                  icon: BarChart3,
                  title: t('nav.analytics'),
                  desc: isAr ? 'مؤشرات تشغيل المواقف' : 'Parking operations indicators',
                },
                true
              )}
            </div>
          </div>
          <div className="cf-mobile-utils">{utilityButtons}</div>
        </div>
      )}
    </header>
  );
};
