import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminDashboard } from './AdminDashboard';
import { adminApi } from '../api/adminApi';
import type { AdminSpot, AdminTariff, AdminRoom, AdminUser, AdminAuditLog } from '../types/admin';

// Mock the adminApi functions
vi.mock('../api/adminApi', () => ({
  adminApi: {
    getSpots: vi.fn(),
    updateSpotStatus: vi.fn(),
    updateSpotType: vi.fn(),
    getTariffs: vi.fn(),
    updateTariff: vi.fn(),
    getRooms: vi.fn(),
    createRoom: vi.fn(),
    updateRoom: vi.fn(),
    updateRoomStatus: vi.fn(),
    getGateEvents: vi.fn(),
    getUsers: vi.fn(),
    updateUserStatus: vi.fn(),
    updateUserRoles: vi.fn(),
    getAuditLogs: vi.fn(),
    getTransitRoutes: vi.fn(),
    createTransitRoute: vi.fn(),
    updateTransitRouteStatus: vi.fn(),
    getTransitShuttles: vi.fn(),
    createShuttleBus: vi.fn(),
    updateShuttleBus: vi.fn(),
  },
}));

describe('AdminDashboard Component Tests', () => {
  const mockSpots: AdminSpot[] = [
    {
      id: 'spot-uuid-1',
      bayNumber: 1,
      zoneCode: 'A',
      spotType: 'STANDARD',
      status: 'AVAILABLE',
      occupantName: null,
      currentVehiclePlate: null,
    },
    {
      id: 'spot-uuid-2',
      bayNumber: 2,
      zoneCode: 'A',
      spotType: 'FACULTY',
      status: 'MAINTENANCE',
      occupantName: null,
      currentVehiclePlate: null,
    },
  ];

  const mockTariffs: AdminTariff[] = [
    { userType: 'STUDENT', hourlyRate: 2.0, dailyCap: 15.0, flexCashbackRate: 5.75 },
    { userType: 'FACULTY', hourlyRate: 1.0, dailyCap: 10.0, flexCashbackRate: 5.75 },
  ];

  const mockRooms: AdminRoom[] = [
    {
      id: 'room-uuid-1',
      roomCode: 'LIB-101',
      nameAr: 'غرفة ابن الهيثم',
      nameEn: 'Ibn Al-Haytham Room',
      capacity: 6,
      floorNumber: 1,
      roomType: 'DISCUSSION',
      status: 'AVAILABLE',
      hasProjector: true,
      hasWhiteboard: true,
      isQuietZone: false,
    },
  ];

  const mockUsers: AdminUser[] = [
    {
      id: 'user-uuid-1',
      universityNumber: '202401',
      email: 'student@fbsu.edu.sa',
      fullNameAr: 'سعود الشمري',
      fullNameEn: 'Saud Al-Shammari',
      userType: 'STUDENT',
      status: 'ACTIVE',
      roles: ['STUDENT'],
      createdAt: '2026-01-01T10:00:00Z',
    },
  ];

  const mockAuditLogs: AdminAuditLog[] = [
    {
      id: 'audit-uuid-1',
      actorEmail: 'admin@fbsu.edu.sa',
      actorName: 'Admin',
      action: 'UPDATE_SPOT_STATUS',
      entityType: 'PARKING_SPOT',
      entityId: 'spot-uuid-1',
      descriptionAr: 'تحويل الموقف للصيانة',
      descriptionEn: 'Converted spot to maintenance',
      createdAt: '2026-11-08T12:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adminApi.getSpots).mockResolvedValue(mockSpots);
    vi.mocked(adminApi.getTariffs).mockResolvedValue(mockTariffs);
    vi.mocked(adminApi.getRooms).mockResolvedValue(mockRooms);
    vi.mocked(adminApi.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(adminApi.getAuditLogs).mockResolvedValue(mockAuditLogs);
    vi.mocked(adminApi.getGateEvents).mockResolvedValue({
      content: [],
      page: 0,
      size: 30,
      totalElements: 0,
      totalPages: 0,
    });
    vi.mocked(adminApi.getTransitRoutes).mockResolvedValue([]);
    vi.mocked(adminApi.getTransitShuttles).mockResolvedValue([]);
  });

  it('renders admin dashboard header, badges, and default spots tab with spot data', async () => {
    render(<AdminDashboard isAr={true} />);

    expect(screen.getByText('لوحة الحوكمة والتحكم الإداري المركزي')).toBeInTheDocument();
    expect(screen.getByText('CAMPUS_ADMIN')).toBeInTheDocument();
    expect(screen.getByTestId('admin-tab-spots')).toBeInTheDocument();
    expect(screen.getByTestId('admin-tab-tariffs')).toBeInTheDocument();
    expect(screen.getByTestId('admin-tab-rooms')).toBeInTheDocument();
    expect(screen.getByTestId('admin-tab-users')).toBeInTheDocument();
    expect(screen.getByTestId('admin-tab-audit')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('#01')).toBeInTheDocument();
      expect(screen.getByText('#02')).toBeInTheDocument();
    });
  });

  it('toggles spot maintenance status and updates UI feedback banner', async () => {
    vi.mocked(adminApi.updateSpotStatus).mockResolvedValueOnce({
      ...mockSpots[0],
      status: 'MAINTENANCE',
    });

    render(<AdminDashboard isAr={true} />);

    await waitFor(() => {
      expect(screen.getByText('#01')).toBeInTheDocument();
    });

    const maintenanceButtons = screen.getAllByRole('button', { name: /صيانة/i });
    fireEvent.click(maintenanceButtons[0]);

    await waitFor(() => {
      expect(adminApi.updateSpotStatus).toHaveBeenCalledWith('spot-uuid-1', {
        status: 'MAINTENANCE',
        reason: 'Routine admin maintenance inspection',
      });
      expect(screen.getByTestId('admin-feedback-banner')).toBeInTheDocument();
    });
  });

  it('switches to tariffs tab and saves tariff updates successfully', async () => {
    vi.mocked(adminApi.updateTariff).mockResolvedValueOnce({
      userType: 'STUDENT',
      hourlyRate: 3.0,
      dailyCap: 20.0,
      flexCashbackRate: 6.5,
    });

    render(<AdminDashboard isAr={true} />);

    const tariffsTab = screen.getByTestId('admin-tab-tariffs');
    fireEvent.click(tariffsTab);

    await waitFor(() => {
      expect(screen.getByTestId('admin-tariffs-panel')).toBeInTheDocument();
      expect(screen.getByText('STUDENT')).toBeInTheDocument();
    });

    const saveButtons = screen.getAllByRole('button', { name: /حفظ التسعيرة/i });
    fireEvent.click(saveButtons[0]);

    await waitFor(() => {
      expect(adminApi.updateTariff).toHaveBeenCalled();
      expect(screen.getByTestId('admin-feedback-banner')).toBeInTheDocument();
    });
  });

  it('switches to rooms tab and allows toggling room status', async () => {
    vi.mocked(adminApi.updateRoomStatus).mockResolvedValueOnce({
      ...mockRooms[0],
      status: 'MAINTENANCE',
    });

    render(<AdminDashboard isAr={true} />);

    const roomsTab = screen.getByTestId('admin-tab-rooms');
    fireEvent.click(roomsTab);

    await waitFor(() => {
      expect(screen.getByTestId('admin-rooms-panel')).toBeInTheDocument();
      expect(screen.getByText('LIB-101')).toBeInTheDocument();
      expect(screen.getByText('غرفة ابن الهيثم')).toBeInTheDocument();
    });

    const maintenanceBtn = screen.getByRole('button', { name: /صيانة الغرفة/i });
    fireEvent.click(maintenanceBtn);

    await waitFor(() => {
      expect(adminApi.updateRoomStatus).toHaveBeenCalledWith('room-uuid-1', {
        status: 'MAINTENANCE',
        reason: 'Scheduled sanitization / maintenance',
      });
    });
  });

  it('switches to users tab, renders user search, and toggles user suspension', async () => {
    vi.mocked(adminApi.updateUserStatus).mockResolvedValueOnce({
      ...mockUsers[0],
      status: 'SUSPENDED',
    });

    render(<AdminDashboard isAr={true} />);

    const usersTab = screen.getByTestId('admin-tab-users');
    fireEvent.click(usersTab);

    await waitFor(() => {
      expect(screen.getByTestId('admin-users-panel')).toBeInTheDocument();
      expect(screen.getByText('سعود الشمري')).toBeInTheDocument();
      expect(screen.getByText('student@fbsu.edu.sa')).toBeInTheDocument();
    });

    const suspendBtn = screen.getByRole('button', { name: /تجميد/i });
    fireEvent.click(suspendBtn);

    await waitFor(() => {
      expect(adminApi.updateUserStatus).toHaveBeenCalledWith('user-uuid-1', {
        status: 'SUSPENDED',
        reason: 'Administrative suspension',
      });
      expect(screen.getByTestId('admin-feedback-banner')).toBeInTheDocument();
    });
  });

  it('switches to audit log tab and displays recorded admin actions', async () => {
    render(<AdminDashboard isAr={true} />);

    const auditTab = screen.getByTestId('admin-tab-audit');
    fireEvent.click(auditTab);

    await waitFor(() => {
      expect(screen.getByTestId('admin-audit-panel')).toBeInTheDocument();
      expect(screen.getByText('admin@fbsu.edu.sa')).toBeInTheDocument();
      expect(screen.getByText('UPDATE_SPOT_STATUS')).toBeInTheDocument();
      expect(screen.getByText('تحويل الموقف للصيانة')).toBeInTheDocument();
    });
  });

  it('opens create room modal from rooms tab and submits new room', async () => {
    vi.mocked(adminApi.createRoom).mockResolvedValueOnce({
      id: 'room-uuid-2',
      roomCode: 'LAB-204',
      nameAr: 'مختبر الذكاء الاصطناعي',
      nameEn: 'AI Lab',
      buildingAr: 'مبنى كلية الحاسب',
      buildingEn: 'College of Computing',
      capacityAr: '8 أشخاص',
      capacityEn: '8 Seats',
      typeBadgeAr: 'قاعة دراسة ذكية',
      typeBadgeEn: 'Smart Study Pod',
      status: 'AVAILABLE',
      specsAr: ['شاشة عرض تفاعلية', 'سبورة زجاجية'],
      specsEn: ['Smart Display', 'Glass Whiteboard'],
    });

    render(<AdminDashboard isAr={true} />);

    fireEvent.click(screen.getByTestId('admin-tab-rooms'));

    await waitFor(() => {
      expect(screen.getByTestId('admin-create-room-btn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('admin-create-room-btn'));

    fireEvent.change(screen.getByTestId('room-form-code'), { target: { value: 'LAB-204' } });
    fireEvent.change(screen.getByTestId('room-form-name-ar'), {
      target: { value: 'مختبر الذكاء الاصطناعي' },
    });
    fireEvent.change(screen.getByTestId('room-form-name-en'), { target: { value: 'AI Lab' } });

    fireEvent.click(screen.getByTestId('room-form-submit'));

    await waitFor(() => {
      expect(adminApi.createRoom).toHaveBeenCalledWith(
        expect.objectContaining({
          roomCode: 'LAB-204',
          nameAr: 'مختبر الذكاء الاصطناعي',
          nameEn: 'AI Lab',
        })
      );
      expect(screen.getByText('LAB-204')).toBeInTheDocument();
    });
  });

  it('switches to gate tab, renders persisted gate events, and filters by decision', async () => {
    vi.mocked(adminApi.getGateEvents).mockResolvedValue({
      content: [
        {
          id: 'gate-evt-1',
          gateId: 'MAIN-GATE',
          plateLettersAr: 'أ ح د',
          plateDigits: '4582',
          decision: 'DENIED',
          reason: 'UNREGISTERED_VEHICLE',
          bayNumber: null,
          bayCode: null,
          occurredAt: '2026-11-10T10:15:00Z',
        },
      ],
      page: 0,
      size: 30,
      totalElements: 1,
      totalPages: 1,
    });

    render(<AdminDashboard isAr={true} />);

    fireEvent.click(screen.getByTestId('admin-tab-gate'));

    await waitFor(() => {
      expect(screen.getByTestId('admin-gate-panel')).toBeInTheDocument();
      expect(screen.getByText('MAIN-GATE')).toBeInTheDocument();
      expect(screen.getByText('أ ح د 4582')).toBeInTheDocument();
      expect(screen.getByText('UNREGISTERED_VEHICLE')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('admin-gate-filter-denied'));

    await waitFor(() => {
      expect(adminApi.getGateEvents).toHaveBeenCalledWith({
        page: 0,
        size: 30,
        decision: 'DENIED',
      });
    });
  });

  it('switches to transit tab, retires DEMO_V15 route, saves shuttle telemetry, and creates new manual route', async () => {
    const sampleRoute = {
      id: 'route-uuid-1',
      routeCode: 'ROUTE-EXPRESS',
      nameAr: 'المسار السريع الأخضر',
      nameEn: 'Express Green Line',
      colorHex: '#10b981',
      operatingHoursAr: '07:30 ص - 05:30 م',
      operatingHoursEn: '07:30 AM - 05:30 PM',
      frequencyMinutes: 8,
      status: 'ACTIVE' as const,
      displayOrder: 1,
      stops: [],
      source: 'DEMO_V15',
    };
    const sampleShuttle = {
      id: 'bus-uuid-1',
      routeCode: 'ROUTE-EXPRESS',
      busNumber: 'FBSU-BUS-01',
      plateLettersAr: 'أ ح د',
      plateDigits: '4582',
      modelName: 'BYD K8',
      totalCapacity: 28,
      occupiedSeats: 12,
      availableSeats: 16,
      isElectric: true,
      driverNameAr: 'عبدالله السعدي',
      driverNameEn: 'Abdullah Al-Saadi',
      status: 'IN_TRANSIT' as const,
      nextStopEtaMins: 3,
      batteryPercentage: 92,
      source: 'DEMO_V15',
    };

    vi.mocked(adminApi.getTransitRoutes).mockResolvedValueOnce([sampleRoute]);
    vi.mocked(adminApi.getTransitShuttles).mockResolvedValueOnce([sampleShuttle]);
    vi.mocked(adminApi.updateTransitRouteStatus).mockResolvedValueOnce({
      ...sampleRoute,
      status: 'INACTIVE',
    });
    vi.mocked(adminApi.updateShuttleBus).mockResolvedValueOnce({
      ...sampleShuttle,
      occupiedSeats: 18,
    });
    vi.mocked(adminApi.createTransitRoute).mockResolvedValueOnce({
      ...sampleRoute,
      id: 'route-uuid-2',
      routeCode: 'ROUTE-LABS',
      nameAr: 'مسار المختبرات',
      nameEn: 'Labs Route',
      source: 'MANUAL',
    });

    render(<AdminDashboard isAr={true} />);

    fireEvent.click(screen.getByTestId('admin-tab-transit'));

    await waitFor(() => {
      expect(screen.getByTestId('admin-transit-panel')).toBeInTheDocument();
      expect(screen.getAllByText('DEMO_V15')).toHaveLength(2);
      expect(screen.getByText('FBSU-BUS-01')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('admin-route-status-ROUTE-EXPRESS'), {
      target: { value: 'INACTIVE' },
    });

    await waitFor(() => {
      expect(adminApi.updateTransitRouteStatus).toHaveBeenCalledWith('route-uuid-1', {
        status: 'INACTIVE',
        reason: 'Admin status change to INACTIVE',
      });
    });

    fireEvent.change(screen.getByTestId('admin-shuttle-occupied-FBSU-BUS-01'), {
      target: { value: '18' },
    });
    fireEvent.click(screen.getByTestId('admin-save-shuttle-FBSU-BUS-01'));

    await waitFor(() => {
      expect(adminApi.updateShuttleBus).toHaveBeenCalledWith(
        'bus-uuid-1',
        expect.objectContaining({ occupiedSeats: 18 })
      );
    });

    fireEvent.click(screen.getByTestId('admin-create-route-btn'));
    fireEvent.change(screen.getByTestId('route-form-code'), { target: { value: 'ROUTE-LABS' } });
    fireEvent.change(screen.getByTestId('route-form-name-ar'), {
      target: { value: 'مسار المختبرات' },
    });
    fireEvent.change(screen.getByTestId('route-form-name-en'), {
      target: { value: 'Labs Route' },
    });
    fireEvent.click(screen.getByTestId('route-form-submit'));

    await waitFor(() => {
      expect(adminApi.createTransitRoute).toHaveBeenCalledWith(
        expect.objectContaining({ routeCode: 'ROUTE-LABS' })
      );
      expect(screen.getByText('MANUAL')).toBeInTheDocument();
    });
  });
});
