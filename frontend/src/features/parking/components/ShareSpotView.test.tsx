import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareSpotView } from './ShareSpotView';
import { parkingApi } from '../api/parkingApi';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

vi.mock('../api/parkingApi', () => ({
  parkingApi: {
    getSpots: vi.fn(),
    getFlexOffers: vi.fn(),
    createFlexOffer: vi.fn(),
    claimFlexOffer: vi.fn(),
  },
}));

describe('ShareSpotView Component', () => {
  const mockUser = {
    id: 'user-123',
    name: 'سعد القحطاني',
    role: 'طالب',
    primarySpot: 1,
    walletBalance: 150.0,
  };

  const mockSpots = [
    {
      id: 'spot-uuid-1',
      bayNumber: 1,
      bayCode: 'FBSU-BAY-001',
      zoneCode: 'ZONE_A',
      zoneNameAr: 'مواقف الطلاب أ',
      zoneNameEn: 'Zone A',
      status: 'OCCUPIED' as const,
      type: 'STANDARD' as const,
      spotType: 'STANDARD' as const,
      distanceMeters: 45,
      hourlyRateSar: 5.75,
      isAccessible: false,
      hasEvCharger: false,
      isShaded: true,
      flexEligible: true,
      activeBookingId: null,
    },
  ];

  const mockOffers = [
    {
      id: 'offer-uuid-1',
      spotId: 'spot-uuid-5',
      bayNumber: 5,
      bayCode: 'FBSU-BAY-005',
      zoneCode: 'ZONE_A',
      zoneNameAr: 'مواقف الطلاب أ',
      zoneNameEn: 'Zone A',
      offererNameAr: 'د. محمد مزهر',
      offererNameEn: 'Dr. Mohammad Mezher',
      startTime: '2026-11-06T10:00:00Z',
      endTime: '2026-11-06T13:00:00Z',
      rewardAmount: 17.25,
      currency: 'SAR',
      status: 'AVAILABLE' as const,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(parkingApi.getSpots).mockResolvedValue(mockSpots);
    vi.mocked(parkingApi.getFlexOffers).mockResolvedValue(mockOffers);
  });

  it('renders flex share portal heading, sub-tabs, and calculates default reward', async () => {
    render(<ShareSpotView isAr={true} currentUser={mockUser} />);

    expect(screen.getByTestId('share-spot-view')).toBeInTheDocument();
    expect(screen.getByText('بوابة التبادل الذكي')).toBeInTheDocument();
    expect(screen.getByText('سعد القحطاني (طالب)')).toBeInTheDocument();
    expect(screen.getByTestId('flex-reward-amount')).toHaveTextContent('17.25 ر.س');
    expect(screen.getByTestId('tab-share-my-spot')).toBeInTheDocument();
    expect(screen.getByTestId('tab-browse-flex-spots')).toBeInTheDocument();
  });

  it('updates break hours selection and recalculates reward amount dynamically', async () => {
    render(<ShareSpotView isAr={true} currentUser={mockUser} />);

    // Click 1 hour
    const breakOption1 = screen.getByTestId('break-option-1');
    fireEvent.click(breakOption1);
    expect(screen.getByTestId('flex-reward-amount')).toHaveTextContent('5.75 ر.س');

    // Click 4 hours
    const breakOption4 = screen.getByTestId('break-option-4');
    fireEvent.click(breakOption4);
    expect(screen.getByTestId('flex-reward-amount')).toHaveTextContent('23.00 ر.س');
  });

  it('activates flex share through real parkingApi and invokes onShareConfirmed', async () => {
    const handleShareConfirmed = vi.fn();
    vi.mocked(parkingApi.createFlexOffer).mockResolvedValue({
      id: 'new-offer-id',
      spotId: 'spot-uuid-1',
      bayNumber: 1,
      bayCode: 'FBSU-BAY-001',
      offererNameAr: 'سعد القحطاني',
      offererNameEn: 'Saad',
      startTime: '2026-11-06T10:00:00Z',
      endTime: '2026-11-06T13:00:00Z',
      rewardAmount: 17.25,
      currency: 'SAR',
      status: 'AVAILABLE' as const,
    });

    render(
      <ShareSpotView
        isAr={true}
        currentUser={mockUser}
        onShareConfirmed={handleShareConfirmed}
      />
    );

    // Wait for spots to load
    await waitFor(() => {
      expect(screen.getByTestId('spot-select')).toBeInTheDocument();
    });

    const activateBtn = screen.getByTestId('activate-flex-share-btn');
    fireEvent.click(activateBtn);

    await waitFor(() => {
      expect(parkingApi.createFlexOffer).toHaveBeenCalledWith({
        spotId: 'spot-uuid-1',
        durationMinutes: 180,
      });
      expect(handleShareConfirmed).toHaveBeenCalledWith(3, 17.25);
      expect(screen.getByTestId('flex-share-success-banner')).toBeInTheDocument();
    });
  });

  it('switches to browse tab and allows claiming an available shared spot', async () => {
    vi.mocked(parkingApi.claimFlexOffer).mockResolvedValue({
      id: 'offer-uuid-1',
      spotId: 'spot-uuid-5',
      bayNumber: 5,
      bayCode: 'FBSU-BAY-005',
      offererNameAr: 'د. محمد مزهر',
      offererNameEn: 'Dr. Mohammad Mezher',
      startTime: '2026-11-06T10:00:00Z',
      endTime: '2026-11-06T13:00:00Z',
      rewardAmount: 17.25,
      currency: 'SAR',
      status: 'CLAIMED' as const,
    });

    render(<ShareSpotView isAr={true} currentUser={mockUser} />);

    const browseTabBtn = screen.getByTestId('tab-browse-flex-spots');
    fireEvent.click(browseTabBtn);

    await waitFor(() => {
      expect(screen.getByTestId('flex-offer-card-offer-uuid-1')).toBeInTheDocument();
      expect(screen.getByText('#5')).toBeInTheDocument();
      expect(screen.getByText('د. محمد مزهر')).toBeInTheDocument();
    });

    const claimBtn = screen.getByTestId('claim-offer-btn-offer-uuid-1');
    fireEvent.click(claimBtn);

    await waitFor(() => {
      expect(parkingApi.claimFlexOffer).toHaveBeenCalledWith('offer-uuid-1');
      expect(screen.getByTestId('claim-success-banner')).toBeInTheDocument();
    });
  });
});
