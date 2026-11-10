import { apiClient } from '../../../shared/http/apiClient';
import type { GateEventPageResponse } from '../../parking/types/parking';
import type {
  AdminSpot,
  AdminTariff,
  AdminRoom,
  AdminUser,
  AdminAuditLog,
  CreateRoomRequest,
  UpdateRoomRequest,
  UpdateSpotStatusRequest,
  UpdateSpotTypeRequest,
  UpdateTariffRequest,
  UpdateRoomStatusRequest,
  UpdateUserStatusRequest,
  UpdateUserRolesRequest,
} from '../types/admin';

export const adminApi = {
  // --- Parking Admin ---
  getSpots: async (): Promise<AdminSpot[]> => {
    const response = await apiClient.get<AdminSpot[]>('/admin/parking/spots');
    return response.data;
  },

  updateSpotStatus: async (id: string, payload: UpdateSpotStatusRequest): Promise<AdminSpot> => {
    const response = await apiClient.patch<AdminSpot>(`/admin/parking/spots/${id}/status`, payload);
    return response.data;
  },

  updateSpotType: async (id: string, payload: UpdateSpotTypeRequest): Promise<AdminSpot> => {
    const response = await apiClient.patch<AdminSpot>(`/admin/parking/spots/${id}/type`, payload);
    return response.data;
  },

  getTariffs: async (): Promise<AdminTariff[]> => {
    const response = await apiClient.get<AdminTariff[]>('/admin/parking/tariffs');
    return response.data;
  },

  updateTariff: async (userType: string, payload: UpdateTariffRequest): Promise<AdminTariff> => {
    const response = await apiClient.put<AdminTariff>(
      `/admin/parking/tariffs/${userType}`,
      payload
    );
    return response.data;
  },

  // --- Rooms Admin ---
  getRooms: async (): Promise<AdminRoom[]> => {
    const response = await apiClient.get<AdminRoom[]>('/admin/rooms');
    return response.data;
  },

  createRoom: async (payload: CreateRoomRequest): Promise<AdminRoom> => {
    const response = await apiClient.post<AdminRoom>('/admin/rooms', payload);
    return response.data;
  },

  updateRoom: async (id: string, payload: UpdateRoomRequest): Promise<AdminRoom> => {
    const response = await apiClient.patch<AdminRoom>(`/admin/rooms/${id}`, payload);
    return response.data;
  },

  updateRoomStatus: async (id: string, payload: UpdateRoomStatusRequest): Promise<AdminRoom> => {
    const response = await apiClient.patch<AdminRoom>(`/admin/rooms/${id}/status`, payload);
    return response.data;
  },

  // --- Gate Passage Events ---
  getGateEvents: async (params?: {
    page?: number;
    size?: number;
    decision?: 'GRANTED' | 'DENIED';
  }): Promise<GateEventPageResponse> => {
    const response = await apiClient.get<GateEventPageResponse>('/parking/gate/events', { params });
    return response.data;
  },

  // --- Users Admin ---
  getUsers: async (params?: {
    search?: string;
    role?: string;
    userType?: string;
    status?: string;
  }): Promise<AdminUser[]> => {
    const response = await apiClient.get<AdminUser[]>('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (id: string, payload: UpdateUserStatusRequest): Promise<AdminUser> => {
    const response = await apiClient.patch<AdminUser>(`/admin/users/${id}/status`, payload);
    return response.data;
  },

  updateUserRoles: async (id: string, payload: UpdateUserRolesRequest): Promise<AdminUser> => {
    const response = await apiClient.patch<AdminUser>(`/admin/users/${id}/roles`, payload);
    return response.data;
  },

  // --- Audit Logs ---
  getAuditLogs: async (params?: {
    entityType?: string;
    action?: string;
    limit?: number;
  }): Promise<AdminAuditLog[]> => {
    const response = await apiClient.get<AdminAuditLog[]>('/admin/audit-logs', { params });
    return response.data;
  },
};
