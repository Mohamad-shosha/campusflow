import { apiClient } from '../../../shared/http/apiClient';
import type { UserProfile, VehicleDto } from '../../../shared/types/auth';

export interface UpdateProfilePayload {
  fullNameAr?: string | undefined;
  fullNameEn?: string | undefined;
  phone?: string | undefined;
  specialty?: string | undefined;
  locale?: string | undefined;
  theme?: string | undefined;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface CreateVehiclePayload {
  plateLettersAr: string;
  plateDigits: string;
  makeModel?: string | undefined;
  color?: string | undefined;
  setPrimary?: boolean | undefined;
}

export const profileApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/me');
    return response.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const response = await apiClient.patch<UserProfile>('/me', payload);
    return response.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/me/change-password', payload);
    return response.data;
  },

  async getVehicles(): Promise<VehicleDto[]> {
    const response = await apiClient.get<VehicleDto[]>('/vehicles');
    return response.data;
  },

  async addVehicle(payload: CreateVehiclePayload): Promise<VehicleDto> {
    const response = await apiClient.post<VehicleDto>('/vehicles', payload);
    return response.data;
  },

  async setPrimaryVehicle(vehicleId: string): Promise<VehicleDto> {
    const response = await apiClient.patch<VehicleDto>(`/vehicles/${vehicleId}/primary`);
    return response.data;
  },

  async deleteVehicle(vehicleId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/vehicles/${vehicleId}`);
    return response.data;
  },
};
