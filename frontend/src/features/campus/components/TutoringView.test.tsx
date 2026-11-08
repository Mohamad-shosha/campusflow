import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TutoringView } from './TutoringView';
import { INITIAL_TUTORING_SESSIONS } from '../data/campusData';
import { tutoringApi } from '../api/tutoringApi';

vi.mock('../api/tutoringApi', () => ({
  tutoringApi: {
    getSessions: vi.fn(),
    createSession: vi.fn(),
    bookSession: vi.fn(),
    getMyEnrollments: vi.fn(),
  },
}));

describe('TutoringView (P6-03)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sessions and filters by category pills', () => {
    render(
      <TutoringView
        sessions={INITIAL_TUTORING_SESSIONS}
        isAr={true}
        isAuthenticated={true}
        currentUser={{
          id: 'STD-999',
          name: 'طالب تجريبي',
          role: 'طالب',
          walletBalance: 250,
        }}
        onOpenTuition={vi.fn()}
        onBookSuccess={vi.fn()}
        onAddSession={vi.fn()}
      />
    );

    expect(screen.getByTestId('tutoring-card-TUT-101')).toBeInTheDocument();
    expect(screen.getByTestId('tutoring-card-TUT-103')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /التصميم المنطقي/i }));

    expect(screen.queryByTestId('tutoring-card-TUT-101')).not.toBeInTheDocument();
    expect(screen.getByTestId('tutoring-card-TUT-103')).toBeInTheDocument();
  });

  it('executes live booking API call and invokes onBookSuccess with updated balance', async () => {
    const onBookSuccess = vi.fn();
    const targetSession = INITIAL_TUTORING_SESSIONS[2]!; // TUT-103 (70 SAR)

    vi.mocked(tutoringApi.bookSession).mockResolvedValue({
      enrollment: {
        enrollmentId: 'enr-1',
        sessionId: 'uuid-103',
        sessionCode: 'TUT-103',
        courseCode: 'CEN 220',
        courseNameAr: targetSession.courseName,
        courseNameEn: targetSession.courseNameEn,
        tutorUniversityNumber: 'STD-202410102',
        tutorNameAr: targetSession.tutorName,
        tutorNameEn: 'Fatima',
        studentUniversityNumber: 'STD-999',
        studentNameAr: 'طالب تجريبي',
        amountPaid: 70,
        currency: 'SAR',
        studentWalletBalance: 180,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        session: {
          id: 'uuid-103',
          sessionCode: 'TUT-103',
          tutorUserId: 'u-1',
          tutorUniversityNumber: 'STD-202410102',
          tutorNameAr: targetSession.tutorName,
          tutorNameEn: 'Fatima',
          tutorRoleAr: targetSession.tutorRole,
          tutorRoleEn: 'Honor Student',
          tutorAvatarColor: '#ec4899',
          courseCode: 'CEN 220',
          courseNameAr: targetSession.courseName,
          courseNameEn: targetSession.courseNameEn,
          coveredLectures: targetSession.coveredLectures,
          coveredScope: targetSession.coveredScope,
          category: 'hardware',
          hourlyRate: 70,
          durationHours: 1,
          totalPrice: 70,
          currency: 'SAR',
          scheduleText: targetSession.dateTime,
          location: targetSession.location,
          maxCapacity: 10,
          enrolledCount: 1,
          rating: 4.98,
          reviewsCount: 15,
          status: 'OPEN',
          enrolledStudents: ['طالب تجريبي'],
          enrolledStudentNumbers: ['STD-999'],
          createdAt: new Date().toISOString(),
        },
      },
      updatedSession: {
        ...targetSession,
        enrolledStudents: ['طالب تجريبي'],
        enrolledStudentNumbers: ['STD-999'],
      },
    });

    render(
      <TutoringView
        sessions={[targetSession]}
        isAr={true}
        isAuthenticated={true}
        currentUser={{
          id: 'STD-999',
          name: 'طالب تجريبي',
          role: 'طالب',
          walletBalance: 250,
        }}
        onOpenTuition={vi.fn()}
        onBookSuccess={onBookSuccess}
        onAddSession={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /حجز الجلسة وسداد/i }));
    expect(screen.getByTestId('book-tutoring-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-book-tutoring-btn'));

    await waitFor(
      () => {
        expect(tutoringApi.bookSession).toHaveBeenCalledTimes(1);
        expect(onBookSuccess).toHaveBeenCalledWith(expect.objectContaining({ id: 'TUT-103' }), 180);
      },
      { timeout: 2500 }
    );
  });

  it('publishes a new tutoring session via CreateTutoringModal', async () => {
    const onAddSession = vi.fn();
    const createdSession = {
      ...INITIAL_TUTORING_SESSIONS[1]!,
      id: 'TUT-NEW1',
      courseCode: 'CS 399',
    };
    vi.mocked(tutoringApi.createSession).mockResolvedValue(createdSession);

    render(
      <TutoringView
        sessions={INITIAL_TUTORING_SESSIONS}
        isAr={false}
        isAuthenticated={true}
        currentUser={{
          id: '20220088',
          name: 'Rakan Al-Mutairi',
          role: 'STUDENT',
          walletBalance: 400,
        }}
        onOpenTuition={vi.fn()}
        onBookSuccess={vi.fn()}
        onAddSession={onAddSession}
      />
    );

    fireEvent.click(screen.getByTestId('open-create-tutoring-btn'));
    expect(screen.getByTestId('create-tutoring-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('publish-tutoring-submit-btn'));

    await waitFor(() => {
      expect(tutoringApi.createSession).toHaveBeenCalledTimes(1);
      expect(onAddSession).toHaveBeenCalledWith(createdSession);
    });
  });
});
