import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from './App';
import { tokenStorage } from '../shared/http/tokenStorage';

describe('App Integration, Auth & Route Guard Tests (P3-03 to P3-05)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = '';
    vi.clearAllMocks();
  });

  it('renders guest state when no JWT tokens are present', async () => {
    render(<App initialTab="map" />);

    expect(screen.getByTestId('top-ribbon')).toBeInTheDocument();
    expect(screen.getByTestId('main-header')).toBeInTheDocument();

    const guestStatus = await screen.findByText(/زائر غير مسجل/i);
    expect(guestStatus).toBeInTheDocument();
  });

  it('opens and closes AuthModal when clicking login button', async () => {
    render(<App initialTab="map" />);

    const openLoginBtn = screen.getByTestId('open-login-btn');
    fireEvent.click(openLoginBtn);

    expect(screen.getByTestId('auth-modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();

    const closeBtn = screen.getByTestId('auth-modal-close');
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('auth-modal-overlay')).not.toBeInTheDocument();
  });

  it('displays auth-required guard when navigating to guarded admin tab as a guest', async () => {
    render(<App initialTab="map" />);

    const adminPanelBtn = screen.getByRole('button', { name: /لوحة المسؤول \(محمية\)/i });
    fireEvent.click(adminPanelBtn);

    const authRequired = await screen.findByTestId('auth-required');
    expect(authRequired).toBeInTheDocument();
    expect(screen.getByText('تسجيل الدخول مطلوب')).toBeInTheDocument();
  });

  it('renders SaudiPlate components on the home view', () => {
    render(<App initialTab="map" />);

    const plates = screen.getAllByTestId('saudi-plate');
    expect(plates.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('ط ر ق')).toBeInTheDocument();
    expect(screen.getByText('أ ب ح')).toBeInTheDocument();
  });

  it('stores and retrieves JWT tokens via tokenStorage correctly', () => {
    expect(tokenStorage.getAccessToken()).toBeNull();

    tokenStorage.setTokens('access-token-123', 'refresh-token-456');

    expect(tokenStorage.getAccessToken()).toBe('access-token-123');
    expect(tokenStorage.getRefreshToken()).toBe('refresh-token-456');

    tokenStorage.clearTokens();

    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getRefreshToken()).toBeNull();
  });

  it('toggles language and updates UI properly with AuthProvider wrapper', async () => {
    render(<App initialTab="map" />);

    const langToggleBtn = screen.getByTitle('التحويل إلى اللغة الإنجليزية');

    await act(async () => {
      fireEvent.click(langToggleBtn);
    });

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(screen.getByText(/Authentication Status:/i)).toBeInTheDocument();
  });
});
