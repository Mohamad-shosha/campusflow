import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlprGateView } from './AlprGateView';
import { parkingApi } from '../api/parkingApi';

vi.mock('../api/parkingApi', () => ({
  parkingApi: {
    scanGate: vi.fn(),
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
});
