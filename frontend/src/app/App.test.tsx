import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from './App';

describe('i18n & Theme Preferences Tests (P3-02)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = '';
  });

  it('renders with Arabic by default and updates document direction', () => {
    render(<App initialTab="map" />);

    expect(screen.getByTestId('top-ribbon')).toBeInTheDocument();
    expect(screen.getByTestId('main-header')).toBeInTheDocument();
    expect(screen.getByTestId('main-footer')).toBeInTheDocument();

    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');

    // Both header and footer contain the university name
    const arTitles = screen.getAllByText('جامعة فهد بن سلطان');
    expect(arTitles.length).toBeGreaterThanOrEqual(1);
  });

  it('toggles language between Arabic and English, updating DOM and persisting to localStorage', async () => {
    render(<App />);

    const langToggleBtn = screen.getByTitle('التحويل إلى اللغة الإنجليزية');
    expect(langToggleBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(langToggleBtn);
    });

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(localStorage.getItem('fbsu_lang')).toBe('en');

    // Both header and footer contain the translated university name
    const enTitles = screen.getAllByText('Fahad Bin Sultan University');
    expect(enTitles.length).toBeGreaterThanOrEqual(1);
  });

  it('toggles day/night theme and updates body classes and localStorage', async () => {
    render(<App />);

    const themeToggleBtn = screen.getByTitle('تبديل المظهر النهاري / الليلي');
    expect(themeToggleBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(themeToggleBtn);
    });

    expect(document.body.classList.contains('theme-light')).toBe(true);
    expect(localStorage.getItem('fbsu_theme')).toBe('light');

    await act(async () => {
      fireEvent.click(themeToggleBtn);
    });

    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(localStorage.getItem('fbsu_theme')).toBe('dark');
  });
});
