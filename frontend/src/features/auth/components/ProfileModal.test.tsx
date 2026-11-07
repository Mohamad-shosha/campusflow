import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileModal } from './ProfileModal';
import { AppPreferencesProvider } from '../../../shared/context/AppPreferencesContext';

const mockRefreshProfile = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'u-1',
      universityId: 'uni-1',
      universityNumber: '20210045',
      email: 'eyad.harbi@fbsu.edu.sa',
      phone: '0501234567',
      fullNameAr: 'إياد الحربي',
      fullNameEn: 'Eyad Al-Harbi',
      userType: 'STUDENT',
      status: 'ACTIVE',
      specialty: 'هندسة مدنية',
      roles: ['STUDENT', 'CAMPUS_ADMIN'],
      vehicles: [
        {
          id: 'veh-1',
          plateLettersAr: 'ب ط ك',
          plateLettersEn: 'B T K',
          plateDigits: '5021',
          formattedPlateAr: 'ب ط ك 5021',
          formattedPlateEn: 'B T K 5021',
          makeModel: 'Toyota Camry 2022',
          color: 'Silver',
          primary: true,
          active: true,
          createdAt: '2026-09-01T00:00:00Z',
        },
      ],
    },
    refreshProfile: mockRefreshProfile,
  }),
}));

describe('ProfileModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user profile details, tabs, and admin console button when open', () => {
    const onClose = vi.fn();
    const onOpenAdmin = vi.fn();

    render(
      <AppPreferencesProvider>
        <ProfileModal isOpen={true} onClose={onClose} onOpenAdminPanel={onOpenAdmin} />
      </AppPreferencesProvider>
    );

    expect(screen.getByTestId('profile-modal-overlay')).toBeInTheDocument();
    expect(screen.getByText('إياد الحربي')).toBeInTheDocument();
    expect(screen.getByTestId('profile-fullname-ar')).toHaveValue('إياد الحربي');

    const adminBtn = screen.getByTestId('open-admin-panel-btn');
    fireEvent.click(adminBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onOpenAdmin).toHaveBeenCalledTimes(1);
  });

  it('switches between Account, Vehicles, and Security tabs cleanly', () => {
    render(
      <AppPreferencesProvider>
        <ProfileModal isOpen={true} onClose={vi.fn()} />
      </AppPreferencesProvider>
    );

    fireEvent.click(screen.getByTestId('profile-tab-vehicles'));
    expect(screen.getByTestId('profile-vehicles-section')).toBeInTheDocument();
    expect(screen.getByText(/Toyota Camry 2022/)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('profile-tab-security'));
    expect(screen.getByTestId('profile-password-form')).toBeInTheDocument();
  });
});
