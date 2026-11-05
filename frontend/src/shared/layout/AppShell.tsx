import { FC, ReactNode } from 'react';
import { TopRibbon } from './TopRibbon';
import { Header } from './Header';
import { Footer } from './Footer';
import type { AppUser } from '../types/navigation';

export interface AppShellProps {
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
  children: ReactNode;
}

export const AppShell: FC<AppShellProps> = ({
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
  children,
}) => {
  return (
    <div className={`app-shell ${isLightTheme ? 'theme-light' : 'theme-dark'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <TopRibbon isAr={isAr} flexCount={3} />
      <Header
        isAr={isAr}
        activeTab={activeTab}
        onTabChange={onTabChange}
        currentUser={currentUser}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onToggleLang={onToggleLang}
        isLightTheme={isLightTheme}
        onToggleTheme={onToggleTheme}
        notificationCount={notificationCount}
      />
      <main className="main-content">
        {children}
      </main>
      <Footer isAr={isAr} />
    </div>
  );
};

