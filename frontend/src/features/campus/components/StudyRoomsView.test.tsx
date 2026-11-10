import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyRoomsView } from './StudyRoomsView';
import { INITIAL_STUDY_ROOMS, type StudyRoom } from '../data/campusData';
import { roomsApi } from '../api/roomsApi';

vi.mock('../api/roomsApi', () => ({
  roomsApi: {
    getRooms: vi.fn(),
    getRoom: vi.fn(),
    bookRoom: vi.fn(),
    extendBooking: vi.fn(),
    releaseBooking: vi.fn(),
  },
}));

describe('StudyRoomsView (P6-07)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all study pods and labs with badges and live statuses', () => {
    render(
      <StudyRoomsView
        rooms={INITIAL_STUDY_ROOMS}
        isAr={true}
        isAuthenticated={true}
        currentUser={{ id: '20210045', name: 'إياد الحربي' }}
      />
    );

    expect(screen.getByTestId('room-card-LAB-102')).toBeInTheDocument();
    expect(screen.getByTestId('room-card-ROOM-A04')).toBeInTheDocument();
    expect(screen.getByTestId('room-card-LAB-205')).toBeInTheDocument();
    expect(screen.getByTestId('room-card-ROOM-C12')).toBeInTheDocument();

    expect(screen.getAllByText(/مشغول حالياً/i).length).toBeGreaterThanOrEqual(1);
  });

  it('prompts unauthenticated users to sign in before booking', () => {
    const onOpenAuth = vi.fn();
    render(
      <StudyRoomsView
        rooms={INITIAL_STUDY_ROOMS}
        isAr={false}
        isAuthenticated={false}
        currentUser={{ id: 'guest', name: 'Guest' }}
        onOpenAuth={onOpenAuth}
      />
    );

    fireEvent.click(screen.getByTestId('book-room-btn-ROOM-A04'));
    expect(screen.getByTestId('book-room-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('room-signin-cta'));
    expect(onOpenAuth).toHaveBeenCalledTimes(1);
  });

  it('submits a booking via roomsApi.bookRoom and updates room to in-use', async () => {
    const onRoomBooked = vi.fn();
    const targetRoom = INITIAL_STUDY_ROOMS.find(r => r.id === 'ROOM-A04')!; // ROOM-A04 (available)

    const updatedRoom: StudyRoom = {
      ...targetRoom,
      status: 'in-use',
      activeBooking: {
        bookingId: 'book-uuid-1',
        leaderUserId: 'u-1',
        teamLead: 'راكان المطيري',
        teamMembers: ['راكان المطيري'],
        purpose: 'جلسة عمل ومذاكرة جماعية',
        timeSlot: '09:00 - 09:30',
        totalMinutes: 30,
        remainingMinutes: 30,
        extendedCount: 0,
        status: 'ACTIVE',
      },
    };

    vi.mocked(roomsApi.bookRoom).mockResolvedValue(updatedRoom);

    render(
      <StudyRoomsView
        rooms={[targetRoom]}
        isAr={true}
        isAuthenticated={true}
        currentUser={{ id: '20220088', name: 'راكان المطيري' }}
        onRoomBooked={onRoomBooked}
      />
    );

    fireEvent.click(screen.getByTestId('book-room-btn-ROOM-A04'));
    expect(screen.getByTestId('book-room-modal')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/الهدف من الحجز/i), {
      target: { value: 'جلسة عمل ومذاكرة جماعية' },
    });

    fireEvent.click(screen.getByTestId('confirm-room-booking-btn'));

    await waitFor(() => {
      expect(roomsApi.bookRoom).toHaveBeenCalledWith(
        'ROOM-A04',
        expect.objectContaining({
          purpose: 'جلسة عمل ومذاكرة جماعية',
        })
      );
      expect(onRoomBooked).toHaveBeenCalledWith(
        'ROOM-A04',
        expect.any(String),
        expect.any(String),
        'جلسة عمل ومذاكرة جماعية',
        updatedRoom
      );
    });
  });

  it('extends an active room booking (+10 mins) via roomsApi.extendBooking', async () => {
    const onRoomUpdated = vi.fn();
    const lab102Base = INITIAL_STUDY_ROOMS.find(r => r.id === 'LAB-102')!;
    const inUseRoom: StudyRoom = {
      ...lab102Base,
      activeBooking: {
        ...lab102Base.activeBooking!,
        bookingId: 'book-lab-102',
        remainingMinutes: 11,
      },
    };

    const extendedRoom: StudyRoom = {
      ...inUseRoom,
      activeBooking: {
        ...inUseRoom.activeBooking!,
        remainingMinutes: 21,
        extendedCount: 1,
      },
    };

    vi.mocked(roomsApi.extendBooking).mockResolvedValue(extendedRoom);

    render(
      <StudyRoomsView
        rooms={[inUseRoom]}
        isAr={true}
        isAuthenticated={true}
        currentUser={{ id: '20210045', name: 'إياد الحربي' }}
        onRoomUpdated={onRoomUpdated}
      />
    );

    fireEvent.click(screen.getByTestId('extend-room-LAB-102'));

    await waitFor(() => {
      expect(roomsApi.extendBooking).toHaveBeenCalledWith('book-lab-102');
      expect(onRoomUpdated).toHaveBeenCalledWith(extendedRoom);
    });
  });

  it('releases an active room booking via roomsApi.releaseBooking', async () => {
    const onRoomUpdated = vi.fn();
    const lab102Base = INITIAL_STUDY_ROOMS.find(r => r.id === 'LAB-102')!;
    const inUseRoom: StudyRoom = {
      ...lab102Base,
      activeBooking: {
        ...lab102Base.activeBooking!,
        bookingId: 'book-lab-102',
      },
    };

    const releasedRoom: StudyRoom = {
      ...inUseRoom,
      status: 'available',
      activeBooking: undefined,
    };

    vi.mocked(roomsApi.releaseBooking).mockResolvedValue(releasedRoom);

    render(
      <StudyRoomsView
        rooms={[inUseRoom]}
        isAr={true}
        isAuthenticated={true}
        currentUser={{ id: '20210045', name: 'إياد الحربي' }}
        onRoomUpdated={onRoomUpdated}
      />
    );

    fireEvent.click(screen.getByTestId('release-room-LAB-102'));

    await waitFor(() => {
      expect(roomsApi.releaseBooking).toHaveBeenCalledWith('book-lab-102');
      expect(onRoomUpdated).toHaveBeenCalledWith(releasedRoom);
    });
  });

  it('renders live utilization bar, requirement note, and daily schedule slots when provided', () => {
    const lab205: StudyRoom = {
      ...INITIAL_STUDY_ROOMS[2]!,
      id: 'LAB-205',
      utilizationPercent: 28,
      requirementNote: 'يتطلب بطاقة المعمل الهندسي',
      requirementNoteEn: 'Requires Engineering Lab badge',
      scheduleSlots: [
        { time: '08:00 - 10:00', timeEn: '08:00 - 10:00', status: 'booked', label: 'Logic Lab' },
        { time: '10:00 - 12:00', timeEn: '10:00 - 12:00', status: 'available' },
      ],
    };

    render(
      <StudyRoomsView
        rooms={[lab205]}
        isAr={true}
        isAuthenticated={true}
        currentUser={{ id: '20220088', name: 'راكان المطيري' }}
      />
    );

    expect(screen.getByText('28%')).toBeInTheDocument();
    expect(screen.getByText('يتطلب بطاقة المعمل الهندسي')).toBeInTheDocument();
    expect(screen.getByTestId('room-schedule-LAB-205')).toBeInTheDocument();
    expect(screen.getByText('08:00 - 10:00')).toBeInTheDocument();
    expect(screen.getByText('10:00 - 12:00')).toBeInTheDocument();
  });
});
