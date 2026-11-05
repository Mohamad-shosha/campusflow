export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string | undefined;
  timestamp?: string | undefined;
  invalidFields?: Record<string, string> | undefined;
  [key: string]: unknown;
}

export type Role =
  'CAMPUS_ADMIN' | 'SECURITY_OFFICER' | 'PARKING_OFFICER' | 'FACULTY' | 'STUDENT' | 'PEER_TUTOR';

export type UserType = 'STUDENT' | 'FACULTY' | 'STAFF';

export interface VehicleDto {
  id: string;
  plateLettersAr: string;
  plateLettersEn: string;
  plateDigits: string;
  formattedPlateAr: string;
  formattedPlateEn: string;
  makeModel?: string | undefined;
  color?: string | undefined;
  primary: boolean;
  active: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  universityId: string;
  universityNumber: string;
  email: string;
  phone?: string | undefined;
  fullNameAr: string;
  fullNameEn: string;
  userType: UserType;
  status: string;
  collegeId?: string | undefined;
  specialty?: string | undefined;
  locale?: string | undefined;
  theme?: string | undefined;
  roles: Role[];
  vehicles: VehicleDto[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: {
    id: string;
    universityId: string;
    universityNumber: string;
    email: string;
    phone?: string | undefined;
    fullNameAr: string;
    fullNameEn: string;
    userType: UserType;
    roles: Role[];
    primaryVehiclePlate?: string | undefined;
  };
}

export interface LoginRequest {
  universityCode?: string | undefined;
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  universityCode?: string | undefined;
  universityNumber: string;
  email: string;
  password: string;
  fullNameAr: string;
  fullNameEn: string;
  userType: UserType;
  phone?: string | undefined;
  plateLettersAr?: string | undefined;
  plateDigits?: string | undefined;
  makeModel?: string | undefined;
  color?: string | undefined;
}
