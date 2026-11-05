import { apiClient } from '../../../shared/http/apiClient';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from '../../../shared/types/auth';

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Best-effort logout on the server
    }
  },

  async getSession(): Promise<{ userId: string; universityId: string; universityNumber: string; authorities: string[] }> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/me');
    return response.data;
  },
};
