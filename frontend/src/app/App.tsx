import { useState, useEffect, useCallback, type FC } from 'react';
import { AppShell } from '../shared/layout/AppShell';
import { AppPreferencesProvider, useAppPreferences } from '../shared/context/AppPreferencesContext';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { AuthModal } from '../features/auth/components/AuthModal';
import { ProfileModal } from '../features/auth/components/ProfileModal';
import { WalletPage } from '../features/wallet';
import { TuitionPage } from '../features/tuition';
import { walletApi } from '../features/wallet/api/walletApi';
import { Toast, type ToastType } from '../shared/components/Toast';
import type { AppUser } from '../shared/types/navigation';
import { INITIAL_PARKING_SPOTS, type ParkingSpot } from '../features/parking/data/parkingData';
import { parkingApi } from '../features/parking/api/parkingApi';
import { mapBackendSpotToUi, type ParkingSummaryResponse } from '../features/parking/types/parking';
import {
  INITIAL_TUTORING_SESSIONS,
  FACULTY_MEMBERS,
  INITIAL_STUDY_ROOMS,
  CAMPUS_NOTIFICATIONS,
  type TutoringSession,
  type FacultyMember,
  type StudyRoom,
  type CampusNotification,
} from '../features/campus/data/campusData';

import { HeroSection } from '../features/parking/components/HeroSection';
import { CategorySubnav } from '../features/parking/components/CategorySubnav';
import { ParkingLotView } from '../features/parking/components/ParkingLotView';
import { BookingWizardView } from '../features/parking/components/BookingWizardView';
import { SimulatorView } from '../features/parking/components/SimulatorView';
import { AlprGateView } from '../features/parking/components/AlprGateView';
import { ShareSpotView } from '../features/parking/components/ShareSpotView';

import { TutoringView } from '../features/campus/components/TutoringView';
import { tutoringApi } from '../features/campus/api/tutoringApi';
import { OfficeHoursView } from '../features/campus/components/OfficeHoursView';
import { officeHoursApi } from '../features/campus/api/officeHoursApi';
import { StudyRoomsView } from '../features/campus/components/StudyRoomsView';
import { roomsApi } from '../features/campus/api/roomsApi';
import { AnalyticsView } from '../features/analytics/components/AnalyticsView';
import { NotificationsModal } from '../features/notifications/components/NotificationsModal';

import '../shared/i18n/i18n';
import '../styles/main.css';

export interface AppContentProps {
  initialTab?: string | undefined;
}

const AppContent: FC<AppContentProps> = ({ initialTab = 'map' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [liveBalance, setLiveBalance] = useState<number>(0.0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Dynamic campus state
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(INITIAL_PARKING_SPOTS);
  const [isParkingLoading, setIsParkingLoading] = useState<boolean>(false);
  const [parkingLastUpdated, setParkingLastUpdated] = useState<Date | null>(null);
  const [parkingSummary, setParkingSummary] = useState<ParkingSummaryResponse | null>(null);

  const [tutoringSessions, setTutoringSessions] =
    useState<TutoringSession[]>(INITIAL_TUTORING_SESSIONS);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(FACULTY_MEMBERS);
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>(INITIAL_STUDY_ROOMS);
  const [notifications, setNotifications] = useState<CampusNotification[]>(CAMPUS_NOTIFICATIONS);

  const [activeToast, setActiveToast] = useState<{
    message: string;
    type: ToastType;
    title?: string | undefined;
  } | null>(null);

  const { isAr } = useAppPreferences();
  const { user, isAuthenticated, logout } = useAuth();

  // Fetch live wallet balance from backend whenever user is authenticated
  const fetchWalletBalance = useCallback(async () => {
    if (!isAuthenticated) {
      setLiveBalance(0.0);
      return;
    }
    try {
      const walletData = await walletApi.getWallet();
      if (walletData && walletData.balance !== undefined) {
        setLiveBalance(Number(walletData.balance));
      }
    } catch {
      // Non-blocking if backend unreachable in unit tests
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWalletBalance();
  }, [fetchWalletBalance, user?.id]);

  const fetchParkingData = useCallback(async () => {
    setIsParkingLoading(true);
    try {
      const [backendSpots, summary] = await Promise.all([
        parkingApi.getSpots(),
        parkingApi.getSummary().catch(() => null),
      ]);
      if (backendSpots && backendSpots.length > 0) {
        setParkingSpots(backendSpots.map(mapBackendSpotToUi));
        setParkingLastUpdated(new Date());
      }
      if (summary) {
        setParkingSummary(summary);
      }
    } catch (err) {
      console.warn('Failed to fetch live parking data from backend:', err);
    } finally {
      setIsParkingLoading(false);
    }
  }, []);

  const fetchTutoringSessions = useCallback(async () => {
    try {
      const liveSessions = await tutoringApi.getSessions();
      if (liveSessions && liveSessions.length > 0) {
        setTutoringSessions(liveSessions);
      }
    } catch {
      // Fallback to initial showcase sessions when offline or in isolated unit tests
    }
  }, []);

  const fetchFacultyOfficeHours = useCallback(async () => {
    try {
      const liveFaculty = await officeHoursApi.getFaculty();
      if (liveFaculty && liveFaculty.length > 0) {
        setFacultyList(liveFaculty);
      }
    } catch {
      // Fallback to initial faculty directory when offline or in isolated unit tests
    }
  }, []);

  const fetchStudyRooms = useCallback(async () => {
    try {
      const liveRooms = await roomsApi.getRooms();
      if (liveRooms && liveRooms.length > 0) {
        setStudyRooms(liveRooms);
      }
    } catch {
      // Fallback to initial study rooms when offline or in isolated unit tests
    }
  }, []);

  useEffect(() => {
    fetchParkingData();
    fetchTutoringSessions();
    fetchFacultyOfficeHours();
    fetchStudyRooms();
    const interval = setInterval(fetchParkingData, 30000);
    return () => clearInterval(interval);
  }, [fetchParkingData, fetchTutoringSessions, fetchFacultyOfficeHours, fetchStudyRooms]);

  const handleRefreshAll = useCallback(async () => {
    await Promise.all([
      fetchParkingData(),
      fetchWalletBalance(),
      fetchTutoringSessions(),
      fetchFacultyOfficeHours(),
      fetchStudyRooms(),
    ]);
  }, [
    fetchParkingData,
    fetchWalletBalance,
    fetchTutoringSessions,
    fetchFacultyOfficeHours,
    fetchStudyRooms,
  ]);

  const handleLogout = async () => {
    await logout();
    setLiveBalance(0.0);
    setActiveToast({
      title: isAr ? 'تم تسجيل الخروج' : 'Signed Out',
      message: isAr
        ? 'تم تسجيل الخروج من حسابك الجامعي بنجاح.'
        : 'You have been signed out of your campus session.',
      type: 'info',
    });
  };

  const currentUser: AppUser = user
    ? {
        id: user.universityNumber,
        name: user.fullNameAr,
        nameEn: user.fullNameEn,
        role:
          user.userType === 'FACULTY'
            ? 'عضو هيئة تدريس'
            : user.userType === 'STAFF'
              ? 'إداري'
              : 'طالب',
        roleEn: user.roles[0] || user.userType || 'STUDENT',
        walletBalance: liveBalance,
        avatarColor: '#116E63',
      }
    : {
        id: 'guest',
        name: 'زائر',
        nameEn: 'Guest',
        role: 'زائر',
        roleEn: 'Guest',
        walletBalance: 0.0,
        avatarColor: '#116E63',
      };

  const totalSpots = parkingSummary?.totalSpots ?? parkingSpots.length;
  const availableCount =
    parkingSummary?.availableSpots ?? parkingSpots.filter(s => s.status === 'available').length;
  const flexCount =
    parkingSummary?.flexSpots ??
    parkingSpots.filter(s => s.status === 'flex' || s.status === 'flex-share').length;

  const handleReserveSpot = (spotId: number) => {
    setParkingSpots(prev =>
      prev.map(s =>
        s.id === spotId
          ? {
              ...s,
              status: 'reserved' as const,
              occupant: currentUser.name,
              timeLeft: isAr ? 'محجوز لك' : 'Reserved for you',
            }
          : s
      )
    );
    setActiveToast({
      title: isAr ? 'تم الحجز بنجاح' : 'Spot Reserved',
      message: isAr
        ? `تم حجز الموقف رقم #${spotId} وإصدار التصريح الرقمي`
        : `Bay #${spotId} reserved and digital pass issued`,
      type: 'success',
    });
  };

  const handleShareConfirmed = (_hours: number, earnAmount: number) => {
    handleRefreshAll();
    setActiveToast({
      title: isAr ? 'تم تفعيل التبادل الذكي' : 'Flex Share Activated',
      message: isAr
        ? `تمت إتاحة موقفك للتبادل الذكي (عائد +${earnAmount.toFixed(2)} ر.س عند حجزه)`
        : `Spot shared for Flex exchange (+${earnAmount.toFixed(2)} SAR reward upon claim)`,
      type: 'success',
    });
  };

  const handleTutoringBooked = (updatedSession: TutoringSession, updatedBalance?: number) => {
    setTutoringSessions(prev => prev.map(s => (s.id === updatedSession.id ? updatedSession : s)));
    if (updatedBalance !== undefined) {
      setLiveBalance(updatedBalance);
    } else {
      fetchWalletBalance();
    }
    setActiveToast({
      title: isAr ? 'تم تأكيد حجز جلسة الشرح' : 'Tutoring Session Booked',
      message: isAr
        ? `تم تسجيلك في مقرر ${updatedSession.courseCode} وتحويل ${updatedSession.totalPrice.toFixed(2)} ر.س للمعلم الأقران.`
        : `Enrolled in ${updatedSession.courseCode}; ${updatedSession.totalPrice.toFixed(2)} SAR transferred to peer tutor.`,
      type: 'success',
    });
  };

  const handleAddTutoringSession = (newSession: TutoringSession) => {
    setTutoringSessions(prev => [newSession, ...prev]);
    setActiveToast({
      title: isAr ? 'تم طرح الجلسة' : 'Session Published',
      message: isAr ? 'أصبحت جلستك متاحة الآن لجميع الطلاب' : 'Session is now live for peers',
      type: 'success',
    });
  };

  const handleOfficeHoursSuccess = (
    facultyId: string,
    slotTime: string,
    _notes: string,
    updatedFaculty?: FacultyMember
  ) => {
    if (updatedFaculty) {
      setFacultyList(prev => prev.map(f => (f.id === facultyId ? updatedFaculty : f)));
    } else {
      fetchFacultyOfficeHours();
    }
    setActiveToast({
      title: isAr ? 'تم حجز الموعد' : 'Appointment Confirmed',
      message: isAr
        ? `تم حجز موعد الساعة المكتبية (${slotTime}) وإشعار العمادة فوراً`
        : `Office hour slot (${slotTime}) confirmed`,
      type: 'success',
    });
  };

  const primaryVehicle = user?.vehicles?.find(v => v.primary) ?? user?.vehicles?.[0];
  const primaryPlate = primaryVehicle
    ? `${primaryVehicle.plateLettersAr} ${primaryVehicle.plateDigits}`
    : isAuthenticated
      ? isAr
        ? 'غير مسجلة'
        : 'Unregistered'
      : 'أ ب ح 1234';
  const primaryCarModel =
    primaryVehicle?.makeModel ||
    (isAuthenticated
      ? isAr
        ? 'مركبة جامعية مسجلة'
        : 'Registered Campus Vehicle'
      : isAr
        ? 'مركبة زائر (يرجى تسجيل الدخول)'
        : 'Guest Vehicle (Sign in required)');
  const userAssignedBay =
    parkingSpots.find(
      s => user && (s.occupant === user.fullNameAr || s.occupant === user.fullNameEn)
    )?.id ?? 1;
  const isPreviewTab = ['analytics'].includes(activeTab);

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      currentUser={currentUser}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
      notificationCount={notifications.length}
      flexCount={flexCount}
      onOpenNotifications={() => setIsNotifModalOpen(true)}
      onOpenAuth={() => {
        setAuthModalTab('login');
        setIsAuthModalOpen(true);
      }}
      onOpenProfile={() => setIsProfileModalOpen(true)}
      onOpenWallet={() => setActiveTab('wallet')}
    >
      {activeToast && (
        <div style={{ position: 'fixed', top: '1.5rem', insetInlineEnd: '1.5rem', zIndex: 999999 }}>
          <Toast
            message={activeToast.message}
            type={activeToast.type}
            title={activeToast.title}
            onClose={() => setActiveToast(null)}
          />
        </div>
      )}

      {/* Hero Section displayed on map tab or home */}
      {activeTab === 'map' && (
        <HeroSection
          isAr={isAr}
          totalSpots={totalSpots}
          availableCount={availableCount}
          flexCount={flexCount}
          onNavigate={tab => setActiveTab(tab)}
        />
      )}

      <div
        className="container"
        style={{ marginTop: '2.5rem', minHeight: '60vh', paddingBottom: '3rem' }}
      >
        {/* Category Subnav chips */}
        <CategorySubnav activeTab={activeTab} isAr={isAr} onTabChange={setActiveTab} />

        {isPreviewTab && (
          <div
            className="glass-panel"
            style={{
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid var(--fbsu-gold-border)',
              background: 'var(--fbsu-gold-light)',
              fontSize: '0.84rem',
              color: 'var(--text-main)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
            data-testid="roadmap-preview-banner"
          >
            <strong>
              {isAr
                ? '📋 معاينة تفاعلية للمراحل القادمة (Phase 6 & 7 Backlog)'
                : '📋 Interactive UI Preview (Scheduled for Phase 6 & 7)'}
            </strong>
            <span style={{ color: 'var(--text-muted)' }}>
              {isAr
                ? 'بيانات هذا القسم للعرض التصميمي فقط لحين ربط واجهات البرمجة الخاصة به في المرحلة القادمة.'
                : 'Showcase prototype data; live backend persistence is scheduled in Phase 6–7.'}
            </span>
          </div>
        )}

        {/* Tab 1: Live Map */}
        {activeTab === 'map' && (
          <ParkingLotView
            spots={parkingSpots}
            isAr={isAr}
            currentUser={{
              id: currentUser.id,
              name: currentUser.name,
              plate: primaryPlate,
              primarySpot: userAssignedBay,
            }}
            isAuthenticated={isAuthenticated}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onReserveSpot={handleReserveSpot}
            onBookingSuccess={booking => {
              handleRefreshAll();
              setActiveToast({
                title: isAr ? 'تم الحجز بنجاح' : 'Booking Confirmed',
                message: isAr
                  ? `تم حجز موقف #${booking.bayNumber} وخصم ${Number(booking.totalAmount).toFixed(2)} ر.س من محفظتك الجامعية.`
                  : `Bay #${booking.bayNumber} reserved and ${Number(booking.totalAmount).toFixed(2)} SAR debited from your wallet.`,
                type: 'success',
              });
            }}
            onBookingCancelled={() => {
              handleRefreshAll();
              setActiveToast({
                title: isAr ? 'تم إلغاء الحجز واسترداد المبلغ' : 'Booking Cancelled & Refunded',
                message: isAr
                  ? 'تم إلغاء الحجز وإعادة المبلغ المخصوم إلى محفظتك الجامعية فوراً.'
                  : 'Reservation cancelled and full amount refunded to your wallet.',
                type: 'info',
              });
            }}
            onOpenGate={() => setActiveTab('gate')}
            isLoading={isParkingLoading}
            onRefresh={handleRefreshAll}
            lastUpdated={parkingLastUpdated}
          />
        )}

        {/* Tab 2: Booking Wizard */}
        {activeTab === 'booking' && (
          <BookingWizardView
            isAr={isAr}
            currentUser={{
              id: currentUser.id,
              name: currentUser.name,
              car: primaryCarModel,
              plate: primaryPlate,
              primarySpot: userAssignedBay,
            }}
            isAuthenticated={isAuthenticated}
            onOpenGate={() => setActiveTab('gate')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onBookingSuccess={booking => {
              handleRefreshAll();
              setActiveToast({
                title: isAr ? 'تم الحجز بنجاح' : 'Booking Confirmed',
                message: isAr
                  ? 'تم تأكيد حجز موقف #' +
                    booking.bayNumber +
                    ' بنجاح، وخصم ' +
                    Number(booking.totalAmount).toFixed(2) +
                    ' ر.س من محفظتك.'
                  : 'Bay #' +
                    booking.bayNumber +
                    ' booked. ' +
                    Number(booking.totalAmount).toFixed(2) +
                    ' SAR debited from wallet.',
                type: 'success',
              });
            }}
            onBookingCancelled={() => {
              handleRefreshAll();
              setActiveToast({
                title: isAr ? 'تم إلغاء الحجز واسترداد الرصيد' : 'Booking Cancelled & Refunded',
                message: isAr
                  ? 'تم إلغاء الحجز وإعادة المبلغ كاملاً إلى محفظتك الجامعية.'
                  : 'Booking cancelled and amount refunded to your wallet.',
                type: 'info',
              });
            }}
          />
        )}

        {/* Tab 3: Simulator */}
        {activeTab === 'simulator' && <SimulatorView isAr={isAr} />}

        {/* Tab 4: Gate ALPR */}
        {activeTab === 'gate' && <AlprGateView isAr={isAr} />}

        {/* Tab 5: Share Spot */}
        {activeTab === 'share' && (
          <ShareSpotView
            isAr={isAr}
            currentUser={{
              id: currentUser.id,
              name: currentUser.name,
              role: currentUser.role,
              primarySpot: userAssignedBay,
              walletBalance: currentUser.walletBalance,
            }}
            onShareConfirmed={handleShareConfirmed}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onRefreshSpots={handleRefreshAll}
          />
        )}

        {/* Tab 6: Peer Tutoring */}
        {activeTab === 'tutoring' && (
          <TutoringView
            sessions={tutoringSessions}
            isAr={isAr}
            isAuthenticated={isAuthenticated}
            currentUser={{
              id: currentUser.id,
              name: currentUser.name,
              role: currentUser.role,
              walletBalance: currentUser.walletBalance,
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenTuition={() => setActiveTab('tuition')}
            onBookSuccess={handleTutoringBooked}
            onAddSession={handleAddTutoringSession}
          />
        )}

        {/* Tab 7: Faculty Office Hours */}
        {activeTab === 'office-hours' && (
          <OfficeHoursView
            facultyList={facultyList}
            isAr={isAr}
            isAuthenticated={isAuthenticated}
            currentUser={{
              id: currentUser.id,
              name: currentUser.name,
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onBookSuccess={handleOfficeHoursSuccess}
          />
        )}

        {/* Tab 8: Study Rooms & Labs */}
        {activeTab === 'rooms' && (
          <StudyRoomsView
            rooms={studyRooms}
            isAr={isAr}
            isAuthenticated={isAuthenticated}
            currentUser={{
              id: currentUser.id,
              name: currentUser.name,
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onRoomBooked={(_roomId, _timeFrom, _timeTo, _purpose, updated) => {
              if (updated) {
                setStudyRooms(prev => prev.map(r => (r.id === updated.id ? updated : r)));
              } else {
                fetchStudyRooms();
              }
              setActiveToast({
                title: isAr ? 'تم حجز القاعة' : 'Room Reserved',
                message: isAr
                  ? 'تم تفعيل حجز القاعة وبدء المؤقت التنازلي بنجاح'
                  : 'Room booking active with countdown',
                type: 'success',
              });
            }}
            onRoomUpdated={updated => {
              setStudyRooms(prev => prev.map(r => (r.id === updated.id ? updated : r)));
            }}
          />
        )}

        {/* Tab 9: Analytics */}
        {activeTab === 'analytics' && <AnalyticsView isAr={isAr} />}

        {/* Tab 10: Wallet Page */}
        {activeTab === 'wallet' && (
          <div style={{ marginTop: '1rem' }}>
            <WalletPage
              onBalanceUpdate={b => setLiveBalance(b)}
              onNavigateToTuition={() => setActiveTab('tuition')}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 11: Tuition Page */}
        {activeTab === 'tuition' && (
          <div style={{ marginTop: '1rem' }}>
            <TuitionPage
              onBalanceUpdate={b => setLiveBalance(b)}
              onOpenTopUp={() => setActiveTab('wallet')}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 12: Admin Panel */}
        {activeTab === 'admin-panel' && (
          <ProtectedRoute requiredRoles={['CAMPUS_ADMIN']}>
            <div
              className="glass-panel"
              style={{
                padding: '2.5rem',
                borderColor: 'var(--fbsu-primary)',
                background: 'rgba(17, 110, 99, 0.1)',
                textAlign: 'center',
              }}
              data-testid="admin-panel-content"
            >
              <h3
                style={{ color: 'var(--fbsu-primary)', marginBottom: '0.75rem', fontWeight: 800 }}
              >
                {isAr ? 'لوحة التحكم الإدارية المصرحة' : 'Authorized Campus Admin Panel'}
              </h3>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {isAr
                  ? 'أهلاً بك يا مسؤول النظام. هذه المنطقة محمية بقواعد RBAC ولا يمكن لغير فئة CAMPUS_ADMIN الوصول إليها.'
                  : 'Welcome, Campus Administrator. This area is strictly protected by RBAC.'}
              </p>
            </div>
          </ProtectedRoute>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onSuccess={() => {
          handleRefreshAll();
          setActiveToast({
            title: isAr ? 'تمت المصادقة' : 'Authenticated',
            message: isAr
              ? 'تم تسجيل الدخول بنجاح وتحديث رصيد المحفظة والصلاحيات'
              : 'Signed in and synced live wallet balance',
            type: 'success',
          });
        }}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenAdminPanel={() => setActiveTab('admin-panel')}
        onProfileUpdated={handleRefreshAll}
      />

      <NotificationsModal
        isOpen={isNotifModalOpen}
        isAr={isAr}
        notifications={notifications}
        onClose={() => setIsNotifModalOpen(false)}
        onMarkAllRead={() => setNotifications([])}
      />
    </AppShell>
  );
};

export const App: FC<AppContentProps> = props => {
  return (
    <AppPreferencesProvider>
      <AuthProvider>
        <AppContent {...props} />
      </AuthProvider>
    </AppPreferencesProvider>
  );
};
