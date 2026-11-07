import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingWizardView } from './BookingWizardView';
import { parkingApi } from '../api/parkingApi';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

vi.mock('../api/parkingApi', () => ({
  parkingApi: {
    getSpots: vi.fn().mockResolvedValue([
      {
        id: 'spot-uuid-2',
        bayNumber: 2,
        zoneCode: 'A',
        zoneNameAr: 'الحاسب والهندسة',
        zoneNameEn: 'Computing & Engineering',
        status: 'AVAILABLE',
        distanceMeters: 35,
        flexEligible: false,
      },
      {
        id: 'spot-uuid-3',
        bayNumber: 3,
        zoneCode: 'A',
        zoneNameAr: 'الحاسب والهندسة',
        zoneNameEn: 'Computing & Engineering',
        status: 'AVAILABLE',
        distanceMeters: 40,
        flexEligible: false,
      },
    ]),
    createBooking: vi.fn().mockResolvedValue({
      id: 'booking-uuid-1',
      spotId: 'spot-uuid-2',
      bayNumber: 2,
      zoneCode: 'A',
      zoneNameAr: 'الحاسب والهندسة',
      zoneNameEn: 'Computing & Engineering',
      vehiclePlate: 'أ ب ح 1234',
      durationHours: 3,
      ratePerHour: 5.75,
      totalAmount: 11.5,
      currency: 'SAR',
      status: 'CONFIRMED',
      digitalPassCode: 'FBSU-A-02-B812',
      qrToken: 'fbsu://pass/v1?code=FBSU-A-02-B812&bay=2',
      createdAt: '2026-11-06T12:00:00Z',
    }),
  },
}));

describe('BookingWizardView Component', () => {
  const dummyUser = {
    id: 'STD-1001',
    name: 'أحمد العطوي',
    car: 'تويوتا كامري 2023',
    plate: 'أ ب ح 1234',
    primarySpot: 2,
  };

  it('renders booking wizard form, pattern options, and order ticket', async () => {
    render(<BookingWizardView isAr={true} currentUser={dummyUser} />);

    expect(screen.getByTestId('booking-wizard-view')).toBeInTheDocument();
    expect(screen.getByText(/حجز موقف ذكي متوافق مع جدولك الدراسي/i)).toBeInTheDocument();
    expect(screen.getByText(/فاتورة تصريح المواقف الذكية/i)).toBeInTheDocument();
  });

  it('executes booking API and opens DigitalPassModal on confirm', async () => {
    const handleSuccess = vi.fn();
    render(
      <BookingWizardView isAr={true} currentUser={dummyUser} onBookingSuccess={handleSuccess} />
    );

    // Wait for spots to load
    await waitFor(() => {
      expect(parkingApi.getSpots).toHaveBeenCalled();
    });

    const confirmBtn = screen.getByTestId('confirm-booking-btn');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(parkingApi.createBooking).toHaveBeenCalled();
      expect(handleSuccess).toHaveBeenCalled();
      expect(screen.getByTestId('digital-pass-modal')).toBeInTheDocument();
      expect(screen.getByText('FBSU-A-02-B812')).toBeInTheDocument();
    });
  });
});
