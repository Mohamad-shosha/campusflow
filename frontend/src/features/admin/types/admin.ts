export type AdminSpotStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
export type AdminSpotType = 'STANDARD' | 'ACCESSIBLE' | 'EV' | 'FACULTY';

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
}

export interface AdminTariff {
  id?: string;
  userType: 'STUDENT' | 'FACULTY' | 'STAFF' | 'VISITOR';
  hourlyRate: number;
  dailyRate: number;
  semesterRate: number;
}

export interface AdminRoom {
  id: string;
  buildingId?: string;
  roomCode: string;
  nameAr: string;
  nameEn: string;
  capacity: number;
  floorNumber: number;
  roomType: string;
  status: string;
  hasProjector: boolean;
  hasWhiteboard: boolean;
  isQuietZone: boolean;
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
  dailyRate: number;
  semesterRate: number;
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
