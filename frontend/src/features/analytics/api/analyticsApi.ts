import { apiClient } from '../../../shared/http/apiClient';
import type { AnalyticsSummary, HourlyLoadPoint, ZoneOccupancyStat } from '../types/analytics';

export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const response = await apiClient.get<AnalyticsSummary>('/analytics/summary');
    return response.data;
  },

  getHourlyLoad: async (): Promise<HourlyLoadPoint[]> => {
    const response = await apiClient.get<HourlyLoadPoint[]>('/analytics/hourly-load');
    return response.data;
  },

  getZoneStats: async (): Promise<ZoneOccupancyStat[]> => {
    const response = await apiClient.get<ZoneOccupancyStat[]>('/analytics/zones');
    return response.data;
  },
};
