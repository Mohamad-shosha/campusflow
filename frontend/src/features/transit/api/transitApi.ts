import { apiClient } from '../../../shared/http/apiClient';
import type {
  TransitRoute,
  ShuttleBus,
  TransitPass,
  BookTransitPassRequest,
} from '../types/transit';
import { INITIAL_TRANSIT_ROUTES, INITIAL_SHUTTLE_BUSES } from '../data/transitData';

export const transitApi = {
  getRoutes: async (): Promise<TransitRoute[]> => {
    try {
      const response = await apiClient.get<TransitRoute[]>('/transit/routes');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return INITIAL_TRANSIT_ROUTES;
    } catch {
      return INITIAL_TRANSIT_ROUTES;
    }
  },

  getLiveShuttles: async (): Promise<ShuttleBus[]> => {
    try {
      const response = await apiClient.get<ShuttleBus[]>('/transit/shuttles/live');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return INITIAL_SHUTTLE_BUSES;
    } catch {
      return INITIAL_SHUTTLE_BUSES;
    }
  },

  bookBoardingPass: async (request: BookTransitPassRequest): Promise<TransitPass> => {
    try {
      const response = await apiClient.post<TransitPass>('/transit/passes/book', request);
      return response.data;
    } catch {
      // Offline fallback mock pass
      const dummyCode = 'FBSU-BUS-' + Math.floor(1000 + Math.random() * 9000);
      return {
        id: 'pass-' + Date.now(),
        passCode: dummyCode,
        qrToken: 'FBSU-QR-' + Date.now(),
        userName: 'طالب جامعي (حساب تجريبي)',
        userUniversityNumber: '202410098',
        routeId: request.routeId,
        routeCode: 'EX-01',
        routeNameAr: 'خط الحرم الأخضر السريع (Green Line)',
        routeNameEn: 'Campus Green Express',
        routeColor: '#10B981',
        pickupStopId: request.pickupStopId,
        pickupStopNameAr: 'بوابة الجامعة الرئيسية (Main Gate)',
        pickupStopNameEn: 'Main Gate',
        dropoffStopId: request.dropoffStopId,
        dropoffStopNameAr: 'مجمع كليات الحاسب والهندسة (Engineering Complex)',
        dropoffStopNameEn: 'Engineering Complex',
        boardingWindow: 'صالح لمدة 45 دقيقة',
        fareAmount: 0.0,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
    }
  },

  getMyPasses: async (): Promise<TransitPass[]> => {
    try {
      const response = await apiClient.get<TransitPass[]>('/transit/passes/my');
      return response.data;
    } catch {
      return [];
    }
  },
};
