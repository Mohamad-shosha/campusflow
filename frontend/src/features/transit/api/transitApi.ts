import { apiClient } from '../../../shared/http/apiClient';
import type {
  TransitRoute,
  ShuttleBus,
  TransitPass,
  BookTransitPassRequest,
} from '../types/transit';

// All calls propagate errors to the caller. There is intentionally no offline
// or mock fallback: a failed request must never look like real data or a
// successfully issued boarding pass.
export const transitApi = {
  getRoutes: async (): Promise<TransitRoute[]> => {
    const response = await apiClient.get<TransitRoute[]>('/transit/routes');
    return Array.isArray(response.data) ? response.data : [];
  },

  getLiveShuttles: async (): Promise<ShuttleBus[]> => {
    const response = await apiClient.get<ShuttleBus[]>('/transit/shuttles');
    return Array.isArray(response.data) ? response.data : [];
  },

  bookBoardingPass: async (request: BookTransitPassRequest): Promise<TransitPass> => {
    const response = await apiClient.post<TransitPass>('/transit/passes/book', request);
    return response.data;
  },

  getMyPasses: async (): Promise<TransitPass[]> => {
    const response = await apiClient.get<TransitPass[]>('/transit/passes/my');
    return Array.isArray(response.data) ? response.data : [];
  },
};
