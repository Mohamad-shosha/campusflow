import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notificationsApi } from './notificationsApi';
import { apiClient } from '../../../shared/http/apiClient';

vi.mock('../../../shared/http/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

describe('notificationsApi Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getMyNotifications calls GET /notifications/my', async () => {
    const mockList = [{ id: '1', titleAr: 'إشعار' }];
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockList });

    const result = await notificationsApi.getMyNotifications();

    expect(apiClient.get).toHaveBeenCalledWith('/notifications/my');
    expect(result).toEqual(mockList);
  });

  it('getUnreadCount calls GET /notifications/unread-count', async () => {
    const mockCount = { unreadCount: 5 };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockCount });

    const result = await notificationsApi.getUnreadCount();

    expect(apiClient.get).toHaveBeenCalledWith('/notifications/unread-count');
    expect(result).toEqual(mockCount);
  });

  it('markAsRead calls PATCH /notifications/:id/read', async () => {
    const mockUpdated = { id: 'abc', read: true };
    vi.mocked(apiClient.patch).mockResolvedValueOnce({ data: mockUpdated });

    const result = await notificationsApi.markAsRead('abc');

    expect(apiClient.patch).toHaveBeenCalledWith('/notifications/abc/read');
    expect(result).toEqual(mockUpdated);
  });

  it('markAllAsRead calls POST /notifications/mark-all-read', async () => {
    const mockRes = { success: true, markedCount: 3, message: 'All marked read' };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockRes });

    const result = await notificationsApi.markAllAsRead();

    expect(apiClient.post).toHaveBeenCalledWith('/notifications/mark-all-read');
    expect(result).toEqual(mockRes);
  });
});

