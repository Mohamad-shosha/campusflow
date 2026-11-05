import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthModal } from './AuthModal';
import { AuthProvider } from '../context/AuthContext';
import { AppPreferencesProvider } from '../../../shared/context/AppPreferencesContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AppPreferencesProvider>
      <AuthProvider>{ui}</AuthProvider>
    </AppPreferencesProvider>
  );
};

describe('AuthModal Component', () => {
  it('does not render when isOpen is false', () => {
    renderWithProviders(<AuthModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByTestId('auth-modal-overlay')).not.toBeInTheDocument();
  });

  it('renders login form by default when opened', () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('auth-modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('tab-login')).toHaveClass('active');
  });

  it('switches between Login and Register tabs', () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={vi.fn()} />);

    // Click register tab
    fireEvent.click(screen.getByTestId('tab-register'));
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();

    // Click login tab back
    fireEvent.click(screen.getByTestId('tab-login'));
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('validates required fields on login submit with empty inputs', async () => {
    renderWithProviders(<AuthModal isOpen={true} onClose={vi.fn()} />);

    fireEvent.click(screen.getByTestId('submit-login-btn'));

    await waitFor(() => {
      expect(
        screen.getByText(/الرقم الجامعي أو البريد يجب ألا يقل عن 3 أحرف/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/كلمة المرور يجب ألا تقل عن 8 خانات/i)
      ).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    renderWithProviders(<AuthModal isOpen={true} onClose={handleClose} />);

    fireEvent.click(screen.getByTestId('auth-modal-close'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
