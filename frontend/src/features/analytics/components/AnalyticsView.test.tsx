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
  },
}));

describe('AnalyticsView Component Tests', () => {
  const mockSummary: AnalyticsSummary = {
    netCapacityGainPercent: 55.0,
    timeSavedMinutes: 18.5,
    satisfactionRatePercent: 99.2,
    totalSpots: 30,
    availableSpots: 18,
    occupiedSpots: 12,
    flexSharesActive: 4,
    totalGatePassages: 142,
    totalLedgerRevenue: 24500.0,
    hourlyLoad: [
      { time: '08:00', load: 85, color: '#f59e0b', labelAr: 'ذروة 1', labelEn: 'Peak 1' },
      { time: '09:00', load: 95, color: '#ef4444', labelAr: 'ذروة قصوى', labelEn: 'Max Peak' },
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders only KPIs computed from real records', async () => {
    vi.mocked(analyticsApi.getSummary).mockResolvedValueOnce(mockSummary);

    render(<AnalyticsView isAr={true} />);

    expect(screen.getByTestId('analytics-view')).toBeInTheDocument();
    expect(screen.getByText('لوحة تحليلات الذكاء الاصطناعي')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('kpi-total-spots')).toHaveTextContent(
        String(mockSummary.totalSpots)
      );
      expect(screen.getByTestId('kpi-gate-passages')).toHaveTextContent(
        String(mockSummary.totalGatePassages)
      );
    });
    // Hardcoded backend metrics are not displayed
    expect(screen.queryByText('+55%')).not.toBeInTheDocument();
    expect(screen.queryByText(/99.2%/)).not.toBeInTheDocument();
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
