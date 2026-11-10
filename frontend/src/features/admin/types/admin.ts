export type AdminSpotStatus =
  'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'FLEX_SHARE' | 'FACULTY_ASSIGNED' | 'MAINTENANCE';
export type AdminSpotType =
  'STANDARD' | 'ACCESSIBLE' | 'EV' | 'EV_CHARGING' | 'FACULTY' | 'VIP' | 'SERVICE';

export interface AdminSpot {
  id: string;
  zoneId?: string;
  zoneCode?: string;
  bayNumber: number;
  spotType: AdminSpotType;
  status: AdminSpotStatus;
  occupiedUntil?: string | null;
  currentVehiclePlate?: string | null;
  occupantName?: string | null;
  occupantNameAr?: string | null;
  occupantNameEn?: string | null;
  plateLettersAr?: string | null;
  plateDigits?: string | null;
  vehicleModel?: string | null;
  flexEligible?: boolean;
}

export interface AdminTariff {
  id?: string;
  userType: 'STUDENT' | 'FACULTY' | 'STAFF' | 'VISITOR' | 'GUEST';
  hourlyRate: number;
  dailyCap?: number;
  flexCashbackRate?: number;
  dailyRate?: number;
  semesterRate?: number;
}

export interface AdminRoom {
  id: string;
  buildingId?: string;
  roomCode: string;
  nameAr: string;
  nameEn: string;
  buildingAr?: string;
  buildingEn?: string;
  capacityAr?: string;
  capacityEn?: string;
  typeBadgeAr?: string;
  typeBadgeEn?: string;
  specsAr?: string[];
  specsEn?: string[];
  availableFromAr?: string;
  availableFromEn?: string;
  displayOrder?: number;
  capacity?: number;
  floorNumber?: number;
  roomType?: string;
  status: string;
  hasProjector?: boolean;
  hasWhiteboard?: boolean;
  isQuietZone?: boolean;
}

export interface CreateRoomRequest {
  roomCode: string;
  nameAr: string;
  nameEn: string;
  buildingAr: string;
  buildingEn: string;
  capacityAr: string;
  capacityEn: string;
  typeBadgeAr: string;
  typeBadgeEn: string;
  specsAr: string[];
  specsEn: string[];
  availableFromAr: string;
  availableFromEn: string;
  status: 'AVAILABLE' | 'IN_USE' | 'RESERVED' | 'MAINTENANCE';
  displayOrder: number;
}

export interface UpdateRoomRequest {
  nameAr?: string;
  nameEn?: string;
  buildingAr?: string;
  buildingEn?: string;
  capacityAr?: string;
  capacityEn?: string;
  typeBadgeAr?: string;
  typeBadgeEn?: string;
  specsAr?: string[];
  specsEn?: string[];
  availableFromAr?: string;
  availableFromEn?: string;
  status?: 'AVAILABLE' | 'IN_USE' | 'RESERVED' | 'MAINTENANCE';
  displayOrder?: number;
}

export interface AdminUser {
  id: string;
  universityId?: string;
  universityNumber?: string;
  email: string;
  phone?: string;
  fullNameAr: string;
  fullNameEn: string;
  userType: string;
  status: 'ACTIVE' | 'SUSPENDED';
  specialty?: string;
  roles: string[];
  collegeId?: string;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  actorId?: string;
  actorEmail: string;
  actorName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  descriptionAr: string;
  descriptionEn: string;
  detailsJson?: string;
  createdAt: string;
}

export interface UpdateSpotStatusRequest {
  status: AdminSpotStatus;
  reason?: string;
}

export interface UpdateSpotTypeRequest {
  spotType: AdminSpotType;
  reason?: string;
}

export interface UpdateTariffRequest {
  hourlyRate: number;
  dailyCap: number;
  flexCashbackRate: number;
}

export interface UpdateRoomStatusRequest {
  status: string;
  reason?: string;
}

export interface UpdateUserStatusRequest {
  status: 'ACTIVE' | 'SUSPENDED';
  reason?: string;
}

export interface UpdateUserRolesRequest {
  roles: string[];
}
