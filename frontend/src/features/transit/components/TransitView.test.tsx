import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransitView } from './TransitView';

vi.mock('../api/transitApi', () => ({
  transitApi: {
    getRoutes: vi.fn().mockResolvedValue([
      {
        id: 'r-1',
        routeCode: 'EX-01',
        nameAr: 'خط الحرم الأخضر السريع (Green Line)',
        nameEn: 'Campus Green Express',
        colorHex: '#10B981',
        operatingHoursAr: '07:00 ص - 10:00 م',
        operatingHoursEn: '07:00 AM - 10:00 PM',
        frequencyMinutes: 10,
        status: 'ACTIVE',
        displayOrder: 1,
        stops: [
          {
            id: 's-1',
            stopCode: 'ST-01',
            nameAr: 'بوابة الجامعة الرئيسية (Main Gate)',
            nameEn: 'Main Gate',
            locationDescAr: 'البوابة الشمالية',
            locationDescEn: 'North Gate',
            stopOrder: 1,
            etaMinutesFromStart: 0,
            hasShelter: true,
            hasAc: true,
          },
        ],
      },
    ]),
    getLiveShuttles: vi.fn().mockResolvedValue([
      {
        id: 'sh-1',
        routeId: 'r-1',
        routeCode: 'EX-01',
        routeNameAr: 'خط الحرم الأخضر السريع',
        routeNameEn: 'Campus Green Express',
        routeColor: '#10B981',
        busNumber: 'SHUTTLE-01',
        plateLettersAr: 'أ ب ج',
        plateDigits: '1001',
        modelName: 'King Long E10 Eco-Shuttle',
        totalCapacity: 28,
        occupiedSeats: 14,
        availableSeats: 14,
        isElectric: true,
        driverNameAr: 'سالم الشمري',
        driverNameEn: 'Salem Al-Shammary',
        status: 'IN_TRANSIT',
        nextStopNameAr: 'مجمع كليات الهندسة',
        nextStopNameEn: 'Engineering Complex',
        nextStopEtaMins: 3,
        batteryPercentage: 94,
      },
    ]),
    bookBoardingPass: vi.fn().mockResolvedValue({
      id: 'pass-test-1',
      passCode: 'FBSU-BUS-9001',
      qrToken: 'FBSU-QR-9001',
      userName: 'طالب جامعي',
      userUniversityNumber: '202410098',
      routeId: 'r-1',
      routeCode: 'EX-01',
      routeNameAr: 'خط الحرم الأخضر السريع',
      routeNameEn: 'Campus Green Express',
      routeColor: '#10B981',
      pickupStopId: 's-1',
      pickupStopNameAr: 'بوابة الجامعة الرئيسية',
      pickupStopNameEn: 'Main Gate',
      dropoffStopId: 's-2',
      dropoffStopNameAr: 'مجمع كليات الهندسة',
      dropoffStopNameEn: 'Engineering Complex',
      boardingWindow: 'صالح لمدة 45 دقيقة',
      fareAmount: 0.0,
      status: 'ACTIVE',
      createdAt: '2026-11-09T05:00:00Z',
    }),
    getMyPasses: vi.fn().mockResolvedValue([]),
  },
}));

describe('TransitView Component', () => {
  it('renders telemetry badges and active fleet cards', async () => {
    render(<TransitView isAr={true} />);

    expect(screen.getByText(/أسطول الحافلات النشط/i)).toBeInTheDocument();
    expect(screen.getByText(/انبعاثات كربونية/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/SHUTTLE-01/i)).toBeInTheDocument();
      expect(screen.getByText(/سالم الشمري/i)).toBeInTheDocument();
    });
  });

  it('filters by route and searches by query', async () => {
    render(<TransitView isAr={true} />);

    await waitFor(() => {
      expect(screen.getByText(/SHUTTLE-01/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/ابحث برقم الحافلة أو المحطة/i);
    fireEvent.change(searchInput, { target: { value: 'غير موجود' } });

    expect(screen.getByText(/لا توجد حافلات مطابقة للبحث/i)).toBeInTheDocument();
  });

  it('opens boarding pass modal when clicking issue boarding pass', async () => {
    render(<TransitView isAr={true} />);

    await waitFor(() => {
      expect(screen.getByText(/SHUTTLE-01/i)).toBeInTheDocument();
    });

    const bookBtn = screen.getByText(/إصدار تذكرة صعود ذكية/i);
    fireEvent.click(bookBtn);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/بطاقة ركوب الحافلة الذكية/i)).toBeInTheDocument();
      expect(screen.getByText(/FBSU-BUS-9001/i)).toBeInTheDocument();
    });
  });
});
