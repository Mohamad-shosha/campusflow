import { apiClient } from '../../../shared/http/apiClient';
import type {
  NotificationResponse,
  UnreadCountResponse,
  MarkAllReadResponse,
} from '../types/notification';

export const notificationsApi = {
  getMyNotifications: async (): Promise<NotificationResponse[]> => {
    const response = await apiClient.get<NotificationResponse[]>('/notifications/my');
    return response.data;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id: string): Promise<NotificationResponse> => {
    const response = await apiClient.patch<NotificationResponse>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<MarkAllReadResponse> => {
    const response = await apiClient.post<MarkAllReadResponse>('/notifications/mark-all-read');
    return response.data;
  },
};

