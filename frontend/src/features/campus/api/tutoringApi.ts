import { apiClient } from '../../../shared/http/apiClient';
import type { TutoringSession } from '../data/campusData';

export interface TutoringSessionDto {
  id: string;
  sessionCode: string;
  tutorUserId: string;
  tutorUniversityNumber: string;
  tutorNameAr: string;
  tutorNameEn: string;
  tutorRoleAr: string;
  tutorRoleEn: string;
  tutorAvatarColor: string;
  courseCode: string;
  courseNameAr: string;
  courseNameEn: string;
  coveredLectures: string;
  coveredScope: string;
  category: string;
  hourlyRate: number;
  durationHours: number;
  totalPrice: number;
  currency: string;
  scheduleText: string;
  location: string;
  maxCapacity: number;
  enrolledCount: number;
  rating: number;
  reviewsCount: number;
  status: 'OPEN' | 'BOOKED' | 'COMPLETED' | 'CANCELLED';
  enrolledStudents: string[];
  enrolledStudentNumbers: string[];
  createdAt: string;
}

export interface CreateTutoringSessionPayload {
  courseCode: string;
  courseNameAr: string;
  courseNameEn?: string;
  coveredLectures: string;
  coveredScope: string;
  category: string;
  durationHours: number;
  scheduleText: string;
  location: string;
  maxCapacity?: number;
}

export interface TutoringEnrollmentDto {
  enrollmentId: string;
  sessionId: string;
  sessionCode: string;
  courseCode: string;
  courseNameAr: string;
  courseNameEn: string;
  tutorUniversityNumber: string;
  tutorNameAr: string;
  tutorNameEn: string;
  studentUniversityNumber: string;
  studentNameAr: string;
  amountPaid: number;
  currency: string;
  studentWalletBalance: number;
  status: string;
  createdAt: string;
  session: TutoringSessionDto;
}

export function mapTutoringDtoToUi(dto: TutoringSessionDto): TutoringSession {
  const mappedStatus: TutoringSession['status'] =
    dto.status === 'BOOKED' ? 'booked' : dto.status === 'COMPLETED' ? 'completed' : 'open';

  return {
    id: dto.sessionCode || dto.id,
    backendId: dto.id,
    tutorId: dto.tutorUniversityNumber,
    tutorName: dto.tutorNameAr,
    tutorNameEn: dto.tutorNameEn,
    tutorRole: dto.tutorRoleAr,
    tutorRoleEn: dto.tutorRoleEn,
    tutorAvatarColor: dto.tutorAvatarColor || '#116E63',
    courseCode: dto.courseCode,
    courseName: dto.courseNameAr,
    courseNameEn: dto.courseNameEn,
    coveredLectures: dto.coveredLectures,
    coveredScope: dto.coveredScope,
    hourlyRate: Number(dto.hourlyRate),
    durationHours: Number(dto.durationHours),
    totalPrice: Number(dto.totalPrice),
    dateTime: dto.scheduleText,
    location: dto.location,
    category: dto.category,
    rating: Number(dto.rating),
    reviewsCount: dto.reviewsCount,
    status: mappedStatus,
    enrolledStudents: dto.enrolledStudents ?? [],
    enrolledStudentNumbers: dto.enrolledStudentNumbers ?? [],
    maxCapacity: dto.maxCapacity,
    enrolledCount: dto.enrolledCount,
  };
}

export const tutoringApi = {
  getSessions: async (category?: string): Promise<TutoringSession[]> => {
    const params: Record<string, string> = {};
    if (category && category !== 'all') {
      params.category = category;
    }
    const response = await apiClient.get<TutoringSessionDto[]>('/tutoring/sessions', { params });
    return response.data.map(mapTutoringDtoToUi);
  },

  createSession: async (payload: CreateTutoringSessionPayload): Promise<TutoringSession> => {
    const response = await apiClient.post<TutoringSessionDto>('/tutoring/sessions', payload);
    return mapTutoringDtoToUi(response.data);
  },

  bookSession: async (
    idOrCode: string,
    idempotencyKey: string
  ): Promise<{ enrollment: TutoringEnrollmentDto; updatedSession: TutoringSession }> => {
    const response = await apiClient.post<TutoringEnrollmentDto>(
      `/tutoring/sessions/${encodeURIComponent(idOrCode)}/book`,
      { idempotencyKey }
    );
    return {
      enrollment: response.data,
      updatedSession: mapTutoringDtoToUi(response.data.session),
    };
  },

  getMyEnrollments: async (): Promise<TutoringEnrollmentDto[]> => {
    const response = await apiClient.get<TutoringEnrollmentDto[]>('/tutoring/enrollments/my');
    return response.data;
  },
};
