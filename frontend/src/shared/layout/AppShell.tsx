import { type FC, type ReactNode } from 'react';
import { TopRibbon } from './TopRibbon';
import { Header } from './Header';
import { Footer } from './Footer';
import type { AppUser } from '../types/navigation';
import { useAppPreferences } from '../context/AppPreferencesContext';

export interface AppShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: AppUser;
  isAuthenticated?: boolean | undefined;
  onLogout?: (() => void) | undefined;
  notificationCount?: number | undefined;
  flexCount?: number | undefined;
  onOpenNotifications?: (() => void) | undefined;
  onOpenAuth?: (() => void) | undefined;
  onOpenProfile?: (() => void) | undefined;
  onOpenWallet?: (() => void) | undefined;
  children: ReactNode;
}

export const AppShell: FC<AppShellProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  isAuthenticated = false,
  onLogout,
  notificationCount = 3,
  flexCount = 2,
  onOpenNotifications,
  onOpenAuth,
  onOpenProfile,
  onOpenWallet,
  children,
}) => {
  const { isAr, isLightTheme } = useAppPreferences();

  return (
    <div
      className={`app-shell ${isLightTheme ? 'theme-light' : 'theme-dark'}`}
      dir={isAr ? 'rtl' : 'ltr'}
      data-testid="app-shell"
    >
      <TopRibbon flexCount={flexCount} />
      <Header
        activeTab={activeTab}
        onTabChange={onTabChange}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        notificationCount={notificationCount}
        onOpenNotifications={onOpenNotifications}
        onOpenAuth={onOpenAuth}
        onOpenProfile={onOpenProfile}
        onOpenWallet={onOpenWallet}
      />
      <main className="main-content">{children}</main>
      <Footer onTabChange={onTabChange} />
    </div>
  );
};
