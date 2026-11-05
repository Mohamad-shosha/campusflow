import { createContext, useContext, useEffect, useState, FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { updateDocumentDirection, SupportedLanguage } from '../i18n/i18n';

export type ThemeMode = 'dark' | 'light';

export interface AppPreferencesContextType {
  lang: SupportedLanguage;
  isAr: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  theme: ThemeMode;
  isLightTheme: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const AppPreferencesContext = createContext<AppPreferencesContextType | undefined>(undefined);

export const AppPreferencesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();

  // Language state
  const [lang, setLang] = useState<SupportedLanguage>(
    () => (localStorage.getItem('fbsu_lang') as SupportedLanguage) || 'ar'
  );

  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('fbsu_theme') as ThemeMode;
    return saved === 'light' ? 'light' : 'dark';
  });

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('fbsu_sound') !== 'false';
  });

  // Synchronize language with i18n and DOM
  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem('fbsu_lang', lang);
    updateDocumentDirection(lang);
  }, [lang, i18n]);

  // Synchronize theme with body classes
  useEffect(() => {
    localStorage.setItem('fbsu_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    } else {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  // Synchronize sound
  useEffect(() => {
    localStorage.setItem('fbsu_sound', soundEnabled ? 'true' : 'false');
  }, [soundEnabled]);

  const setLanguage = (newLang: SupportedLanguage) => setLang(newLang);
  const toggleLanguage = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));

  const setTheme = (newTheme: ThemeMode) => setThemeState(newTheme);
  const toggleTheme = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  const value: AppPreferencesContextType = {
    lang,
    isAr: lang === 'ar',
    setLanguage,
    toggleLanguage,
    theme,
    isLightTheme: theme === 'light',
    setTheme,
    toggleTheme,
    soundEnabled,
    toggleSound,
  };

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
};

export const useAppPreferences = (): AppPreferencesContextType => {
  const context = useContext(AppPreferencesContext);
  if (!context) {
    throw new Error('useAppPreferences must be used within an AppPreferencesProvider');
  }
  return context;
};

