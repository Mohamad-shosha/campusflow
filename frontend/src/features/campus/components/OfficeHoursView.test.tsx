import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OfficeHoursView } from './OfficeHoursView';
import { FACULTY_MEMBERS, type FacultyMember } from '../data/campusData';
import { officeHoursApi } from '../api/officeHoursApi';

vi.mock('../api/officeHoursApi', () => ({
  officeHoursApi: {
    getFaculty: vi.fn(),
    bookAppointment: vi.fn(),
    getMyAppointments: vi.fn(),
    cancelAppointment: vi.fn(),
  },
}));

describe('OfficeHoursView (P6-05)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders faculty leadership cards and disables already-booked slots', () => {
    render(
      <OfficeHoursView
        facultyList={FACULTY_MEMBERS}
        isAr={true}
        isAuthenticated={true}
        currentUser={{ id: '20210045', name: 'إياد الحربي' }}
      />
    );

    expect(screen.getByTestId('faculty-card-drRaghad')).toBeInTheDocument();
    expect(screen.getByTestId('faculty-card-drMezher')).toBeInTheDocument();
    expect(screen.getByTestId('faculty-card-doctor')).toBeInTheDocument();

    const bookedSlotBtn = screen.getByRole('button', { name: /11:30 ص/i });
    expect(bookedSlotBtn).toBeDisabled();
  });

  it('prompts unauthenticated visitors to sign in before booking an office hour', () => {
    const onOpenAuth = vi.fn();
    render(
      <OfficeHoursView
        facultyList={FACULTY_MEMBERS}
        isAr={false}
        isAuthenticated={false}
        currentUser={{ id: 'guest', name: 'Guest' }}
        onOpenAuth={onOpenAuth}
      />
    );

    fireEvent.click(screen.getByTestId('open-book-faculty-drRaghad'));
    expect(screen.getByTestId('book-office-hours-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('office-hours-signin-cta'));
    expect(onOpenAuth).toHaveBeenCalledTimes(1);
  });

  it('books a live backend office-hour slot and passes updated faculty to onBookSuccess', async () => {
    const onBookSuccess = vi.fn();
    const baseFaculty = FACULTY_MEMBERS[0]!;
    const liveFaculty: FacultyMember = {
      ...baseFaculty,
      backendId: 'prof-uuid-1',
      timeSlots: baseFaculty.timeSlots.map((s, idx) => ({
        ...s,
        id: `slot-uuid-${idx}`,
      })),
    };

    const updatedFaculty: FacultyMember = {
      ...liveFaculty,
      timeSlots: liveFaculty.timeSlots.map((s, idx) =>
        idx === 1 ? { ...s, available: false, bookedNote: 'محجوز - إياد الحربي' } : s
      ),
    };

    vi.mocked(officeHoursApi.bookAppointment).mockResolvedValue({
      appointment: {
        id: 'appt-uuid-1',
        slotId: 'slot-uuid-1',
        profileCode: 'drRaghad',
        facultyNameAr: baseFaculty.name,
        facultyNameEn: baseFaculty.nameEn,
        officeLocation: baseFaculty.office,
        studentUniversityNumber: '20210045',
        studentNameAr: 'إياد الحربي',
        timeLabelAr: '11:15 ص',
        timeLabelEn: '11:15 AM',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        topic: 'مراجعة معمارية الحاسب',
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        updatedFaculty: {
          id: 'prof-uuid-1',
          profileCode: 'drRaghad',
          facultyUserId: 'u-fac-1',
          universityNumber: 'FAC-8821',
          nameAr: baseFaculty.name,
          nameEn: baseFaculty.nameEn,
          email: baseFaculty.email,
          rankAr: baseFaculty.rank,
          rankEn: baseFaculty.rankEn,
          collegeAr: baseFaculty.college,
          collegeEn: 'College of Computing',
          officeLocation: baseFaculty.office,
          badgeAr: baseFaculty.badge,
          badgeEn: 'Dept Chairperson',
          avatarColor: baseFaculty.avatarColor,
          daysTextAr: baseFaculty.daysText,
          daysTextEn: 'Sun & Tue',
          nextAvailableAr: baseFaculty.nextAvailable,
          nextAvailableEn: '11:15 AM',
          coursesSupervised: baseFaculty.coursesSupervised,
          timeSlots: [],
        },
      },
      updatedFaculty,
    });

    render(
      <OfficeHoursView
        facultyList={[liveFaculty]}
        isAr={true}
        isAuthenticated={true}
        currentUser={{ id: '20210045', name: 'إياد الحربي' }}
        onBookSuccess={onBookSuccess}
      />
    );

    // Click the 11:15 ص slot directly on the card to preselect it
    fireEvent.click(screen.getByRole('button', { name: /11:15 ص/i }));
    expect(screen.getByTestId('book-office-hours-modal')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/موضوع الاستفسار/i), {
      target: { value: 'مراجعة معمارية الحاسب' },
    });

    fireEvent.click(screen.getByTestId('confirm-office-hours-btn'));

    await waitFor(() => {
      expect(officeHoursApi.bookAppointment).toHaveBeenCalledWith(
        'slot-uuid-1',
        'مراجعة معمارية الحاسب'
      );
      expect(onBookSuccess).toHaveBeenCalledWith(
        'drRaghad',
        '11:15 ص',
        'مراجعة معمارية الحاسب',
        updatedFaculty
      );
    });
  });
});
