import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookOfficeHoursModal } from './BookOfficeHoursModal';
import { officeHoursApi } from '../api/officeHoursApi';
import type { FacultyMember } from '../data/campusData';

vi.mock('../api/officeHoursApi', async importOriginal => {
  const actual = await importOriginal<typeof import('../api/officeHoursApi')>();
  return {
    ...actual,
    officeHoursApi: { ...actual.officeHoursApi, bookAppointment: vi.fn() },
  };
});

const day = (offsetDays: number, hourUtc: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  d.setUTCHours(hourUtc, 0, 0, 0);
  return d.toISOString();
};

const faculty: FacultyMember = {
  id: 'drTest',
  name: 'د. اختبار',
  nameEn: 'Dr. Test',
  rank: 'أستاذ',
  rankEn: 'Professor',
  college: 'الحاسب',
  office: 'A-1',
  email: 'test@fbsu.edu.sa',
  badge: 'أستاذ',
  avatarColor: '#000',
  daysText: '',
  nextAvailable: '',
  coursesSupervised: [],
  timeSlots: [
    // Same clock label on three different days: one past, two upcoming
    {
      id: 'past',
      startTime: day(-3, 8),
      time: '11:00 ص',
      timeEn: '11:00 AM',
      duration: '15',
      available: true,
    },
    {
      id: 'tomorrow',
      startTime: day(1, 8),
      time: '11:00 ص',
      timeEn: '11:00 AM',
      duration: '15',
      available: true,
    },
    {
      id: 'later',
      startTime: day(2, 8),
      time: '11:00 ص',
      timeEn: '11:00 AM',
      duration: '15',
      available: true,
    },
  ],
};

const renderModal = () =>
  render(
    <BookOfficeHoursModal
      isOpen
      faculty={faculty}
      isAr={false}
      isAuthenticated
      currentUser={{ id: 'S1', name: 'Student' }}
      onClose={() => {}}
      onConfirm={() => {}}
    />
  );

describe('BookOfficeHoursModal slot selection', () => {
  beforeEach(() => {
    vi.mocked(officeHoursApi.bookAppointment).mockReset();
    vi.mocked(officeHoursApi.bookAppointment).mockResolvedValue({
      appointment: {} as never,
      updatedFaculty: undefined as never,
    } as never);
  });

  it('hides past slots and shows a day label on each slot', () => {
    renderModal();
    const slotButtons = screen.getAllByRole('button', { name: /11:00 AM/ });
    expect(slotButtons).toHaveLength(2);
  });

  it('books exactly the slot that was clicked when labels repeat across days', async () => {
    renderModal();
    const slotButtons = screen.getAllByRole('button', { name: /11:00 AM/ });
    fireEvent.click(slotButtons[1]!);
    expect(slotButtons[1]!.className).toContain('active');
    expect(slotButtons[0]!.className).not.toContain('active');

    fireEvent.submit(slotButtons[1]!.closest('form')!);
    await waitFor(() => expect(officeHoursApi.bookAppointment).toHaveBeenCalled());
    expect(vi.mocked(officeHoursApi.bookAppointment).mock.calls[0]![0]).toBe('later');
  });

  it('uses an English default topic in English mode', () => {
    renderModal();
    expect(screen.getByDisplayValue(/Graduation project discussion/)).toBeInTheDocument();
  });
});
