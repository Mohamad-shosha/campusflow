import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from './App';
import { tokenStorage } from '../shared/http/tokenStorage';

describe('App Full Integration & Feature Navigation Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = '';
    vi.clearAllMocks();
  });

  it('renders brand header, top ribbon, hero section, and live parking map by default', () => {
    render(<App initialTab="map" />);

    expect(screen.getByTestId('top-ribbon')).toBeInTheDocument();
    expect(screen.getByTestId('main-header')).toBeInTheDocument();
    expect(screen.getByTestId('parking-lot-view')).toBeInTheDocument();
    expect(
      screen.getByText(/المخطط الرقمي المباشر لمواقف جامعة فهد بن سلطان/i)
    ).toBeInTheDocument();
  });

  it('displays Sign In button and 0.00 wallet balance when unauthenticated instead of static demo persona', () => {
    render(<App initialTab="map" />);

    const authBtn = screen.getByTestId('header-auth-btn');
    expect(authBtn).toHaveTextContent('تسجيل الدخول');
    expect(authBtn).not.toHaveTextContent('إياد');

    const walletBalance = screen.getByTestId('header-wallet-balance');
    expect(walletBalance).toHaveTextContent('0.00');
  });

  it('opens and closes AuthModal when clicking header auth button', () => {
    render(<App initialTab="map" />);

    const authBtn = screen.getByTitle('الملف الشخصي وتبديل المستخدم');
    fireEvent.click(authBtn);

    expect(screen.getByTestId('auth-modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();

    const closeBtn = screen.getByTestId('auth-modal-close');
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('auth-modal-overlay')).not.toBeInTheDocument();
  });

  it('navigates seamlessly between parking and campus views via category subnav', () => {
    render(<App initialTab="map" />);

    // Click Book Spot
    const bookBtn = screen.getByRole('button', { name: /حجز موقف وتصريح/i });
    fireEvent.click(bookBtn);
    expect(screen.getByTestId('booking-wizard-view')).toBeInTheDocument();

    // Click Gate ALPR
    const gateBtn = screen.getByRole('button', { name: /بوابة وكاميرات ALPR/i });
    fireEvent.click(gateBtn);
    expect(screen.getByTestId('alpr-gate-view')).toBeInTheDocument();

    // Click Share & Earn
    const shareBtn = screen.getByRole('button', { name: /شارك موقفك واربح/i });
    fireEvent.click(shareBtn);
    expect(screen.getByTestId('share-spot-view')).toBeInTheDocument();
  });

  it('displays auth-required guard when navigating to guarded admin tab as an unauthorized user', async () => {
    render(<App initialTab="admin-panel" />);

    const authRequired = await screen.findByTestId('auth-required');
    expect(authRequired).toBeInTheDocument();
    expect(screen.getByText('تسجيل الدخول مطلوب')).toBeInTheDocument();
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

  it('toggles language and updates UI direction correctly', async () => {
    render(<App initialTab="map" />);

    const langToggleBtn = screen.getByTitle('التحويل إلى اللغة الإنجليزية');

    await act(async () => {
      fireEvent.click(langToggleBtn);
    });

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });
});
