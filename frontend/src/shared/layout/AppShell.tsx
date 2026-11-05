import { FC, ReactNode } from 'react';
import { TopRibbon } from './TopRibbon';
import { Header } from './Header';
import { Footer } from './Footer';
import type { AppUser } from '../types/navigation';
import { useAppPreferences } from '../context/AppPreferencesContext';

export interface AppShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: AppUser;
  notificationCount?: number;
  onOpenAuth?: (() => void) | undefined;
  onOpenWallet?: (() => void) | undefined;
  children: ReactNode;
}

export const AppShell: FC<AppShellProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  notificationCount = 3,
  onOpenAuth,
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
      <TopRibbon flexCount={3} />
      <Header
        activeTab={activeTab}
        onTabChange={onTabChange}
        currentUser={currentUser}
        notificationCount={notificationCount}
        onOpenAuth={onOpenAuth}
        onOpenWallet={onOpenWallet}
      />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};
