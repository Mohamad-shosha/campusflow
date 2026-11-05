export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  timestamp?: string;
  invalidFields?: Record<string, string>;
  [key: string]: unknown;
}

export type Role =
  | 'CAMPUS_ADMIN'
  | 'SECURITY_OFFICER'
  | 'PARKING_OFFICER'
  | 'FACULTY'
  | 'STUDENT'
  | 'PEER_TUTOR';

export type UserType = 'STUDENT' | 'FACULTY' | 'STAFF';

export interface VehicleDto {
  id: string;
  plateLettersAr: string;
  plateLettersEn: string;
  plateDigits: string;
  formattedPlateAr: string;
  formattedPlateEn: string;
  makeModel?: string;
  color?: string;
  primary: boolean;
  active: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  universityId: string;
  universityNumber: string;
  email: string;
  phone?: string;
  fullNameAr: string;
  fullNameEn: string;
  userType: UserType;
  status: string;
  collegeId?: string;
  specialty?: string;
  locale?: string;
  theme?: string;
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
  tokens: AuthTokens;
  user: {
    id: string;
    universityId: string;
    universityNumber: string;
    email: string;
    phone?: string;
    fullNameAr: string;
    fullNameEn: string;
    userType: UserType;
    roles: Role[];
    primaryVehiclePlate?: string;
  };
}

export interface LoginRequest {
  universityCode?: string;
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  universityCode?: string;
  universityNumber: string;
  email: string;
  password: string;
  fullNameAr: string;
  fullNameEn: string;
  userType: UserType;
  phone?: string;
  plateLettersAr?: string;
  plateDigits?: string;
  makeModel?: string;
  color?: string;
}

