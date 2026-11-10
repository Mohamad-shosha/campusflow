import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AnalyticsView } from './AnalyticsView';
import { analyticsApi } from '../api/analyticsApi';
import type { AnalyticsSummary } from '../types/analytics';

vi.mock('../api/analyticsApi', () => ({
  analyticsApi: {
    getSummary: vi.fn(),
    getHourlyLoad: vi.fn(),
    getZoneStats: vi.fn(),
    getRoomsUtilization: vi.fn(),
    getRevenueBreakdown: vi.fn(),
  },
}));

describe('AnalyticsView Component Tests', () => {
  const mockSummary: AnalyticsSummary = {
    netCapacityGainPercent: null,
    timeSavedMinutes: null,
    satisfactionRatePercent: null,
    totalSpots: 40,
    availableSpots: 18,
    occupiedSpots: 22,
    flexSharesActive: 4,
    totalGatePassages: 142,
    totalLedgerRevenue: 575.5,
    hourlyLoad: [
      { time: '08:00', load: 85, color: '#f59e0b', labelAr: '12 دخول', labelEn: '12 entries' },
      { time: '09:00', load: 100, color: '#ef4444', labelAr: '14 دخول', labelEn: '14 entries' },
    ],
    zoneStats: [
      {
        zoneCode: 'A',
        zoneNameAr: 'قطاع A - الحاسب والهندسة',
        zoneNameEn: 'Zone A - Engineering & Computing',
        totalSpots: 10,
        occupiedSpots: 7,
        occupancyRate: 70.0,
      },
      {
        zoneCode: 'B',
        zoneNameAr: 'قطاع B - إدارة الأعمال والطب',
        zoneNameEn: 'Zone B - Business & Medicine',
        totalSpots: 8,
        occupiedSpots: 4,
        occupancyRate: 50.0,
      },
    ],
    roomsUtilization: {
      totalRooms: 10,
      availableRooms: 6,
      inUseRooms: 2,
      reservedRooms: 1,
      maintenanceRooms: 1,
      activeUtilizationPercent: 33.3,
      activeBookingsCount: 3,
    },
    revenueBreakdown: {
      netParkingRevenue: 575.5,
      tuitionRevenue: 14500.0,
      tutoringVolume: 420.0,
      totalCampusVolume: 15495.5,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders live KPIs, hourly gate load, financial breakdown, and rooms utilization', async () => {
    vi.mocked(analyticsApi.getSummary).mockResolvedValueOnce(mockSummary);

    render(<AnalyticsView isAr={true} />);

    expect(screen.getByTestId('analytics-view')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('kpi-total-spots')).toHaveTextContent('40');
      expect(screen.getByTestId('kpi-gate-passages')).toHaveTextContent('142');
      expect(screen.getByTestId('analytics-revenue-panel')).toBeInTheDocument();
      expect(screen.getByTestId('rev-parking')).toHaveTextContent('575.50');
      expect(screen.getByTestId('rev-tuition')).toHaveTextContent('14500.00');
      expect(screen.getByTestId('rev-tutoring')).toHaveTextContent('420.00');
      expect(screen.getByTestId('analytics-rooms-panel')).toHaveTextContent('33.3%');
      expect(screen.getByTestId('hourly-load-grid')).toBeInTheDocument();
    });

    // Unmeasured metrics are never fabricated or shown
    expect(screen.queryByText('+42%')).not.toBeInTheDocument();
    expect(screen.queryByText(/98\.8%/)).not.toBeInTheDocument();
  });

  it('shows honest empty message when no gate passages occurred in last 7 days', async () => {
    vi.mocked(analyticsApi.getSummary).mockResolvedValueOnce({
      ...mockSummary,
      hourlyLoad: [],
    });

    render(<AnalyticsView isAr={false} />);

    expect(await screen.findByTestId('hourly-load-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('hourly-load-grid')).not.toBeInTheDocument();
  });

  it('shows an error state with retry instead of fallback figures', async () => {
    vi.mocked(analyticsApi.getSummary).mockRejectedValueOnce(new Error('network'));

    render(<AnalyticsView isAr={false} />);

    expect(await screen.findByTestId('analytics-load-error')).toBeInTheDocument();
    expect(screen.queryByTestId('analytics-kpis')).not.toBeInTheDocument();
  });

  it('renders dynamic zone occupancy cards when zoneStats are returned', async () => {
    vi.mocked(analyticsApi.getSummary).mockResolvedValueOnce(mockSummary);

    render(<AnalyticsView isAr={true} />);

    await waitFor(() => {
      expect(screen.getByTestId('analytics-zones-panel')).toBeInTheDocument();
      expect(screen.getByText('قطاع A - الحاسب والهندسة')).toBeInTheDocument();
      expect(screen.getByText('قطاع B - إدارة الأعمال والطب')).toBeInTheDocument();
      expect(screen.getByText('70%')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });
});
