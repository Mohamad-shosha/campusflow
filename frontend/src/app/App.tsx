import { useState, useEffect, useCallback, type FC } from 'react';
import { AppShell } from '../shared/layout/AppShell';
import { AppPreferencesProvider, useAppPreferences } from '../shared/context/AppPreferencesContext';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { AuthModal } from '../features/auth/components/AuthModal';
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
import { OfficeHoursView } from '../features/campus/components/OfficeHoursView';
import { StudyRoomsView } from '../features/campus/components/StudyRoomsView';
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
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Dynamic campus state
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(INITIAL_PARKING_SPOTS);
  const [isParkingLoading, setIsParkingLoading] = useState<boolean>(false);
  const [parkingLastUpdated, setParkingLastUpdated] = useState<Date | null>(null);
  const [parkingSummary, setParkingSummary] = useState<ParkingSummaryResponse | null>(null);

  const [tutoringSessions, setTutoringSessions] =
    useState<TutoringSession[]>(INITIAL_TUTORING_SESSIONS);
  const [facultyList] = useState<FacultyMember[]>(FACULTY_MEMBERS);
  const [studyRooms] = useState<StudyRoom[]>(INITIAL_STUDY_ROOMS);
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

  useEffect(() => {
    fetchParkingData();
    const interval = setInterval(fetchParkingData, 30000);
    return () => clearInterval(interval);
  }, [fetchParkingData]);

  const handleRefreshAll = useCallback(async () => {
    await Promise.all([fetchParkingData(), fetchWalletBalance()]);
  }, [fetchParkingData, fetchWalletBalance]);

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

  const handleTutoringBooked = (session: TutoringSession) => {
    setLiveBalance(prev => Math.max(0, prev - session.totalPrice));
    setTutoringSessions(prev =>
      prev.map(s =>
        s.id === session.id
          ? {
              ...s,
              enrolledStudents: [...s.enrolledStudents, currentUser.name],
            }
          : s
      )
    );
    setActiveToast({
      title: isAr ? 'تم تأكيد حجز الجلسة' : 'Tutoring Session Confirmed',
      message: isAr
        ? `تم خصم ${session.totalPrice} ر.س وتحويلها كرصيد جامعي للأقران`
        : `Fee of ${session.totalPrice} SAR settled successfully`,
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

  const handleOfficeHoursSuccess = (_facultyId: string, slotTime: string) => {
    setActiveToast({
      title: isAr ? 'تم حجز الموعد' : 'Appointment Confirmed',
      message: isAr
        ? `تم حجز موعد الساعة المكتبية (${slotTime}) وإشعار العمادة فوراً`
        : `Office hour slot (${slotTime}) confirmed`,
      type: 'success',
    });
  };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      currentUser={currentUser}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
      notificationCount={notifications.length}
      onOpenNotifications={() => setIsNotifModalOpen(true)}
      onOpenAuth={() => {
        setAuthModalTab('login');
        setIsAuthModalOpen(true);
      }}
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

        {/* Tab 1: Live Map */}
        {activeTab === 'map' && (
          <ParkingLotView
            spots={parkingSpots}
            isAr={isAr}
            currentUser={{
              id: currentUser.id,
              name: currentUser.name,
              plate: user?.vehicles?.[0]
                ? user.vehicles[0].plateLettersAr + ' ' + user.vehicles[0].plateDigits
                : 'ب ط ك 1234',
              primarySpot: 1,
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
              car: 'تويوتا كامري 2023',
              plate: user?.vehicles?.[0]
                ? user.vehicles[0].plateLettersAr + ' ' + user.vehicles[0].plateDigits
                : 'أ ب ح 1234',
              primarySpot: 2,
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
              primarySpot: 1,
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
            currentUser={{
              id: currentUser.id,
              name: currentUser.name,
              role: currentUser.role,
              walletBalance: currentUser.walletBalance,
            }}
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
            currentUser={{
              id: currentUser.id,
              name: currentUser.name,
            }}
            onBookSuccess={handleOfficeHoursSuccess}
          />
        )}

        {/* Tab 8: Study Rooms & Labs */}
        {activeTab === 'rooms' && (
          <StudyRoomsView
            rooms={studyRooms}
            isAr={isAr}
            currentUser={{
              id: currentUser.id,
              name: currentUser.name,
            }}
            onRoomBooked={() => {
              setActiveToast({
                title: isAr ? 'تم حجز القاعة' : 'Room Reserved',
                message: isAr ? 'تم تفعيل حجز القاعة بنجاح' : 'Room booking active',
                type: 'success',
              });
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
