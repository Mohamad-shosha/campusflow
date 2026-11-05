import { createContext, useContext, useState, useEffect, FC, ReactNode, useCallback } from 'react';
import { tokenStorage } from '../../../shared/http/tokenStorage';
import { authApi } from '../api/authApi';
import type { UserProfile, LoginRequest, RegisterRequest, Role } from '../../../shared/types/auth';

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserProfile = useCallback(async () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch {
      tokenStorage.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();

    const handleAutoLogout = () => {
      setUser(null);
    };

    window.addEventListener('fbsu:auth-logout', handleAutoLogout);
    return () => window.removeEventListener('fbsu:auth-logout', handleAutoLogout);
  }, [fetchUserProfile]);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const authData = await authApi.login(credentials);
      tokenStorage.setTokens(authData.accessToken, authData.refreshToken);
      await fetchUserProfile();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterRequest) => {
    setIsLoading(true);
    try {
      const authData = await authApi.register(payload);
      tokenStorage.setTokens(authData.accessToken, authData.refreshToken);
      await fetchUserProfile();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } finally {
      tokenStorage.clearTokens();
      setUser(null);
      setIsLoading(false);
    }
  };

  const hasRole = (role: Role): boolean => {
    return user?.roles?.includes(role) ?? false;
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    return user?.roles ? roles.some(r => user.roles.includes(r)) : false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
    refreshProfile: fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
