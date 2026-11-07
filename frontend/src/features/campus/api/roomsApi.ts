import { apiClient } from '../../../shared/http/apiClient';
import type { StudyRoom } from '../data/campusData';

export interface ActiveRoomBookingDto {
  bookingId: string;
  leaderUserId: string;
  leaderUniversityNumber: string;
  teamLead: string;
  teamLeadEn: string;
  teamMembers: string[];
  purpose: string;
  startTime: string;
  endTime: string;
  startLabel: string;
  endLabel: string;
  totalMinutes: number;
  remainingMinutes: number;
  extendedCount: number;
  status: string;
}

export interface StudyRoomDto {
  id: string;
  roomCode: string;
  nameAr: string;
  nameEn: string;
  buildingAr: string;
  buildingEn: string;
  capacityAr: string;
  capacityEn: string;
  typeBadgeAr: string;
  typeBadgeEn: string;
  status: 'AVAILABLE' | 'IN_USE' | 'RESERVED' | 'MAINTENANCE';
  specsAr: string[];
  specsEn: string[];
  availableFromAr: string;
  availableFromEn: string;
  activeBooking?: ActiveRoomBookingDto | null;
}

export interface BookRoomPayload {
  startTime: string;
  endTime: string;
  startLabel?: string;
  endLabel?: string;
  purpose: string;
  teamMembers?: string[];
}

export function mapRoomDtoToUi(dto: StudyRoomDto): StudyRoom {
  const mappedStatus: StudyRoom['status'] =
    dto.status === 'IN_USE'
      ? 'in-use'
      : dto.status === 'RESERVED'
        ? 'reserved'
        : dto.status === 'MAINTENANCE'
          ? 'maintenance'
          : 'available';

  const activeBooking = dto.activeBooking
    ? {
        bookingId: dto.activeBooking.bookingId,
        leaderUserId: dto.activeBooking.leaderUserId,
        teamLead: dto.activeBooking.teamLead,
        teamLeadEn: dto.activeBooking.teamLeadEn,
        teamMembers: dto.activeBooking.teamMembers ?? [],
        purpose: dto.activeBooking.purpose,
        startTime: dto.activeBooking.startTime,
        endTime: dto.activeBooking.endTime,
        timeSlot: `${dto.activeBooking.startLabel} - ${dto.activeBooking.endLabel}`,
        startLabel: dto.activeBooking.startLabel,
        endLabel: dto.activeBooking.endLabel,
        totalMinutes: dto.activeBooking.totalMinutes,
        remainingMinutes: dto.activeBooking.remainingMinutes,
        extendedCount: dto.activeBooking.extendedCount,
        status: dto.activeBooking.status,
      }
    : undefined;

  return {
    id: dto.roomCode || dto.id,
    backendId: dto.id,
    roomCode: dto.roomCode,
    name: dto.nameAr,
    nameEn: dto.nameEn,
    building: dto.buildingAr,
    buildingEn: dto.buildingEn,
    capacity: dto.capacityAr,
    capacityEn: dto.capacityEn,
    typeBadge: dto.typeBadgeAr,
    typeBadgeEn: dto.typeBadgeEn,
    status: mappedStatus,
    activeBooking,
    specs: dto.specsAr ?? [],
    specsEn: dto.specsEn ?? [],
    availableFrom: dto.availableFromAr,
    availableFromEn: dto.availableFromEn,
  };
}

export const roomsApi = {
  getRooms: async (): Promise<StudyRoom[]> => {
    const response = await apiClient.get<StudyRoomDto[]>('/rooms');
    return response.data.map(mapRoomDtoToUi);
  },

  getRoom: async (idOrCode: string): Promise<StudyRoom> => {
    const response = await apiClient.get<StudyRoomDto>(`/rooms/${encodeURIComponent(idOrCode)}`);
    return mapRoomDtoToUi(response.data);
  },

  bookRoom: async (idOrCode: string, payload: BookRoomPayload): Promise<StudyRoom> => {
    const response = await apiClient.post<StudyRoomDto>(
      `/rooms/${encodeURIComponent(idOrCode)}/book`,
      payload
    );
    return mapRoomDtoToUi(response.data);
  },

  extendBooking: async (bookingId: string): Promise<StudyRoom> => {
    const response = await apiClient.post<StudyRoomDto>(
      `/rooms/bookings/${encodeURIComponent(bookingId)}/extend`
    );
    return mapRoomDtoToUi(response.data);
  },

  releaseBooking: async (bookingId: string): Promise<StudyRoom> => {
    const response = await apiClient.post<StudyRoomDto>(
      `/rooms/bookings/${encodeURIComponent(bookingId)}/release`
    );
    return mapRoomDtoToUi(response.data);
  },
};
