import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlprGateView } from './AlprGateView';
import { parkingApi } from '../api/parkingApi';

vi.mock('../api/parkingApi', () => ({
  parkingApi: {
    scanGate: vi.fn(),
    getGateEvents: vi.fn(),
  },
}));

describe('AlprGateView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ALPR viewport, saudi plate, and preset vehicle selectors', () => {
    render(<AlprGateView isAr={true} />);

    expect(screen.getByTestId('alpr-gate-view')).toBeInTheDocument();
    expect(
      screen.getByText('نظام التعرف التلقائي على اللوحات (ALPR) وفتح البوابات الذكي')
    ).toBeInTheDocument();
    expect(screen.getByTestId('preset-faculty-btn')).toBeInTheDocument();
    expect(screen.getByTestId('preset-student-btn')).toBeInTheDocument();
    expect(screen.getByTestId('preset-unregistered-btn')).toBeInTheDocument();
    expect(screen.getByTestId('gate-status-text')).toHaveTextContent(
      'البوابة مغلقة - بانتظار الفحص'
    );
  });

  it('handles faculty scan successfully and opens barrier arm (GRANTED)', async () => {
    vi.mocked(parkingApi.scanGate).mockResolvedValue({
      decision: 'GRANTED',
      gateAction: 'OPEN_BARRIER',
      reasonCode: 'FACULTY_CAMPUS_PERMIT',
      displayMessageAr: 'مرحباً بك د. محمد مزهر، تصريح هيئة التدريس سارٍ',
      displayMessageEn: 'Welcome Dr. Mohammad Mezher',
      bayNumber: 19,
      bayCode: 'FBSU-BAY-019',
      zoneCode: 'ZONE_C',
      zoneNameAr: 'مواقف أعضاء هيئة التدريس',
      zoneNameEn: 'Faculty Zone',
      driverNameAr: 'د. محمد مزهر',
      driverNameEn: 'Dr. Mohammad Mezher',
      userType: 'FACULTY',
      scannedPlate: 'س ع د 7700',
    });

    render(<AlprGateView isAr={true} />);

    const facultyBtn = screen.getByTestId('preset-faculty-btn');
    fireEvent.click(facultyBtn);

    const scanBtn = screen.getByTestId('trigger-gate-scan-btn');
    fireEvent.click(scanBtn);

    await waitFor(() => {
      expect(parkingApi.scanGate).toHaveBeenCalledWith({
        gateId: 'GATE_MAIN_NORTH_01',
        plateLettersAr: 'س ع د',
        plateDigits: '7700',
      });
      expect(screen.getByTestId('gate-status-text')).toHaveTextContent(
        'البوابة مفتوحة - تفضل بالمرور'
      );
      expect(
        screen.getByText('تم التحقق بنجاح - مرحباً بك في جامعة فهد بن سلطان')
      ).toBeInTheDocument();
      expect(screen.getByText('#19')).toBeInTheDocument();
    });
  });

  it('handles unregistered vehicle scan and keeps barrier closed (DENIED)', async () => {
    vi.mocked(parkingApi.scanGate).mockResolvedValue({
      decision: 'DENIED',
      gateAction: 'KEEP_CLOSED',
      reasonCode: 'UNREGISTERED_VEHICLE',
      displayMessageAr: 'المركبة غير مسجلة في منظومة جامعة فهد بن سلطان',
      displayMessageEn: 'Vehicle is not registered in FBSU system',
      scannedPlate: 'ق و ل 9999',
    });

    render(<AlprGateView isAr={true} />);

    const unregBtn = screen.getByTestId('preset-unregistered-btn');
    fireEvent.click(unregBtn);

    const scanBtn = screen.getByTestId('trigger-gate-scan-btn');
    fireEvent.click(scanBtn);

    await waitFor(() => {
      expect(parkingApi.scanGate).toHaveBeenCalledWith({
        gateId: 'GATE_MAIN_NORTH_01',
        plateLettersAr: 'ق و ل',
        plateDigits: '9999',
      });
      expect(screen.getByTestId('gate-status-text')).toHaveTextContent(
        'البوابة مغلقة - بانتظار الفحص'
      );
      expect(screen.getByText('تم رفض الدخول - الحاجز مغلق')).toBeInTheDocument();
      expect(screen.getByText('UNREGISTERED_VEHICLE')).toBeInTheDocument();
    });
  });

  it('shows restricted notice when caller lacks officer/admin role and never fetches /gate/events', () => {
    render(<AlprGateView isAr={true} canViewGateHistory={false} />);
    expect(screen.getByTestId('gate-events-restricted-notice')).toBeInTheDocument();
    expect(parkingApi.getGateEvents).not.toHaveBeenCalled();
  });

  it('loads and filters persisted gate events when caller is SECURITY_OFFICER or CAMPUS_ADMIN', async () => {
    vi.mocked(parkingApi.getGateEvents).mockResolvedValue({
      content: [
        {
          id: 'ev-1',
          gateId: 'GATE_MAIN_NORTH_01',
          plateLettersAr: 'س ع د',
          plateDigits: '7700',
          decision: 'GRANTED',
          reason: 'FACULTY_CAMPUS_PERMIT',
          bayNumber: 19,
          bayCode: 'A-19',
          occurredAt: '2026-11-10T10:00:00Z',
        },
      ],
      page: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1,
    });

    render(<AlprGateView isAr={true} canViewGateHistory={true} />);

    await waitFor(() => {
      expect(parkingApi.getGateEvents).toHaveBeenCalledWith({ page: 0, size: 10 });
      expect(screen.getByTestId('gate-events-table')).toBeInTheDocument();
      expect(screen.getByText('FACULTY_CAMPUS_PERMIT')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('gate-events-filter-denied'));

    await waitFor(() => {
      expect(parkingApi.getGateEvents).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        decision: 'DENIED',
      });
    });
  });
});
