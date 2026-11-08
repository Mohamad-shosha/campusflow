import { apiClient } from '../../../shared/http/apiClient';
import type { FacultyMember, TimeSlot } from '../data/campusData';

export interface OfficeHourSlotDto {
  id: string;
  startTime: string;
  endTime: string;
  timeLabelAr: string;
  timeLabelEn: string;
  durationMinutes: number;
  available: boolean;
  bookedNote: string | null;
}

export interface FacultyOfficeDto {
  id: string;
  profileCode: string;
  facultyUserId: string;
  universityNumber: string;
  nameAr: string;
  nameEn: string;
  email: string;
  rankAr: string;
  rankEn: string;
  collegeAr: string;
  collegeEn: string;
  officeLocation: string;
  badgeAr: string;
  badgeEn: string;
  avatarColor: string;
  daysTextAr: string;
  daysTextEn: string;
  nextAvailableAr: string;
  nextAvailableEn: string;
  coursesSupervised: string[];
  timeSlots: OfficeHourSlotDto[];
}

export interface OfficeHourAppointmentDto {
  id: string;
  slotId: string;
  profileCode: string;
  facultyNameAr: string;
  facultyNameEn: string;
  officeLocation: string;
  studentUniversityNumber: string;
  studentNameAr: string;
  timeLabelAr: string;
  timeLabelEn: string;
  startTime: string;
  endTime: string;
  topic: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedFaculty: FacultyOfficeDto;
}

export function mapSlotDtoToUi(dto: OfficeHourSlotDto): TimeSlot {
  return {
    id: dto.id,
    time: dto.timeLabelAr,
    timeEn: dto.timeLabelEn || dto.timeLabelAr,
    duration: `${dto.durationMinutes} دقيقة`,
    durationEn: `${dto.durationMinutes} mins`,
    available: dto.available,
    bookedNote: dto.bookedNote ?? undefined,
  };
}

export function mapFacultyDtoToUi(dto: FacultyOfficeDto): FacultyMember {
  return {
    id: dto.profileCode || dto.id,
    backendId: dto.id,
    facultyUserId: dto.facultyUserId,
    universityNumber: dto.universityNumber,
    name: dto.nameAr,
    nameEn: dto.nameEn,
    rank: dto.rankAr,
    rankEn: dto.rankEn,
    college: dto.collegeAr,
    collegeEn: dto.collegeEn,
    office: dto.officeLocation,
    email: dto.email,
    badge: dto.badgeAr,
    badgeEn: dto.badgeEn,
    avatarColor: dto.avatarColor || '#116E63',
    daysText: dto.daysTextAr,
    daysTextEn: dto.daysTextEn,
    nextAvailable: dto.nextAvailableAr,
    nextAvailableEn: dto.nextAvailableEn,
    coursesSupervised: dto.coursesSupervised ?? [],
    timeSlots: (dto.timeSlots ?? []).map(mapSlotDtoToUi),
  };
}

export const officeHoursApi = {
  getFaculty: async (): Promise<FacultyMember[]> => {
    const response = await apiClient.get<FacultyOfficeDto[]>('/office-hours/faculty');
    return response.data.map(mapFacultyDtoToUi);
  },

  bookAppointment: async (
    slotId: string,
    topic: string
  ): Promise<{ appointment: OfficeHourAppointmentDto; updatedFaculty: FacultyMember }> => {
    const response = await apiClient.post<OfficeHourAppointmentDto>('/office-hours/appointments', {
      slotId,
      topic,
    });
    return {
      appointment: response.data,
      updatedFaculty: mapFacultyDtoToUi(response.data.updatedFaculty),
    };
  },

  getMyAppointments: async (): Promise<OfficeHourAppointmentDto[]> => {
    const response = await apiClient.get<OfficeHourAppointmentDto[]>(
      '/office-hours/appointments/my'
    );
    return response.data;
  },

  cancelAppointment: async (
    appointmentId: string
  ): Promise<{ appointment: OfficeHourAppointmentDto; updatedFaculty: FacultyMember }> => {
    const response = await apiClient.post<OfficeHourAppointmentDto>(
      `/office-hours/appointments/${encodeURIComponent(appointmentId)}/cancel`
    );
    return {
      appointment: response.data,
      updatedFaculty: mapFacultyDtoToUi(response.data.updatedFaculty),
    };
  },
};
