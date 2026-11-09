import { useState, useEffect, useCallback, type FC } from 'react';
import { AppShell } from '../shared/layout/AppShell';
import { AppPreferencesProvider, useAppPreferences } from '../shared/context/AppPreferencesContext';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { AuthModal } from '../features/auth/components/AuthModal';
import { ProfileModal } from '../features/auth/components/ProfileModal';
import { WalletPage } from '../features/wallet';
import { TuitionPage } from '../features/tuition';
import { AdminDashboard } from '../features/admin/components/AdminDashboard';
import { walletApi } from '../features/wallet/api/walletApi';
import { Toast, type ToastType } from '../shared/components/Toast';
import type { AppUser } from '../shared/types/navigation';
import { INITIAL_PARKING_SPOTS, type ParkingSpot } from '../features/parking/data/parkingData';
import { parkingApi } from '../features/parking/api/parkingApi';
import { mapBackendSpotToUi, type ParkingSummaryResponse } from '../features/parking/types/parking';
import {
  INITIAL_TUTORING_SESSIONS,
  FACULTY_MEMBERS,
  type TutoringSession,
  type FacultyMember,
  type StudyRoom,
} from '../features/campus/data/campusData';

import { HeroSection } from '../features/parking/components/HeroSection';
import { CategorySubnav } from '../features/parking/components/CategorySubnav';
import { ParkingLotView } from '../features/parking/components/ParkingLotView';
import { BookingWizardView } from '../features/parking/components/BookingWizardView';
import { AlprGateView } from '../features/parking/components/AlprGateView';
import { ShareSpotView } from '../features/parking/components/ShareSpotView';
import { ServiceHeroBanner } from '../shared/components/ServiceHeroBanner';
import { ServiceExplainerSections } from '../shared/components/ServiceExplainerSections';
import {
  Cpu,
  BookOpen,
  UserCheck,
  Camera,
  RefreshCw,
  Calendar,
  CreditCard,
  Wallet as WalletIcon,
  BarChart3,
  Car,
  ShieldCheck,
  Sparkles,
  Award,
  Zap,
  Users,
  Bus,
} from 'lucide-react';

import { TransitView } from '../features/transit/components/TransitView';

import { TutoringView } from '../features/campus/components/TutoringView';
import { tutoringApi } from '../features/campus/api/tutoringApi';
import { OfficeHoursView } from '../features/campus/components/OfficeHoursView';
import { officeHoursApi } from '../features/campus/api/officeHoursApi';
import { StudyRoomsView } from '../features/campus/components/StudyRoomsView';
import { roomsApi } from '../features/campus/api/roomsApi';
import { AnalyticsView } from '../features/analytics/components/AnalyticsView';
import { NotificationsModal } from '../features/notifications/components/NotificationsModal';
import { notificationsApi } from '../features/notifications/api/notificationsApi';
import type { NotificationResponse } from '../features/notifications/types/notification';

import '../shared/i18n/i18n';
import '../styles/main.css';
import '../styles/rooms-hub.css';
import '../styles/transit-utilities.css';

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
  // Rooms & labs come from the backend only; no mock fallback is rendered.
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([]);
  const [isRoomsLoading, setIsRoomsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState<boolean>(false);

  const [activeToast, setActiveToast] = useState<{
    message: string;
    type: ToastType;
    title?: string | undefined;
  } | null>(null);

  const { isAr } = useAppPreferences();
  const { user, isAuthenticated, logout } = useAuth();

  // Fetch live notifications and unread count from backend
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setIsNotificationsLoading(true);
    try {
      const [list, countRes] = await Promise.all([
        notificationsApi.getMyNotifications().catch(() => []),
        notificationsApi.getUnreadCount().catch(() => ({ unreadCount: 0 })),
      ]);
      setNotifications(list);
      setUnreadCount(countRes.unreadCount);
    } catch {
      // Non-blocking
    } finally {
      setIsNotificationsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    const interval = setInterval(() => {
      notificationsApi
        .getUnreadCount()
        .then(res => setUnreadCount(res.unreadCount))
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications, user?.id]);

  const handleMarkNotificationRead = useCallback(async (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await notificationsApi.markAsRead(id);
    } catch {
      // Non-blocking
    }
  }, []);

  const handleMarkAllNotificationsRead = useCallback(async () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() }))
    );
    setUnreadCount(0);
    try {
      await notificationsApi.markAllAsRead();
    } catch {
      // Non-blocking
    }
  }, []);

  const handleNavigateFromNotification = useCallback((route: string) => {
    if (route.includes('booking')) setActiveTab('booking');
    else if (route.includes('gate')) setActiveTab('gate');
    else if (route.includes('tutoring')) setActiveTab('tutoring');
    else if (route.includes('office-hours')) setActiveTab('office-hours');
    else if (route.includes('rooms')) setActiveTab('rooms');
    else if (route.includes('tuition')) setActiveTab('tuition');
    else if (route.includes('wallet')) setActiveTab('wallet');
    else if (route.includes('admin')) setActiveTab('admin-panel');
    setIsNotifModalOpen(false);
  }, []);

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
      if (Array.isArray(liveRooms)) {
        setStudyRooms(liveRooms);
      }
    } catch {
      // Keep the last known rooms; StudyRoomsView shows an empty/retry state if none
    } finally {
      setIsRoomsLoading(false);
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
      fetchNotifications(),
    ]);
  }, [
    fetchParkingData,
    fetchWalletBalance,
    fetchTutoringSessions,
    fetchFacultyOfficeHours,
    fetchStudyRooms,
    fetchNotifications,
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

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      currentUser={currentUser}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
      notificationCount={isAuthenticated ? unreadCount : 0}
      flexCount={flexCount}
      onOpenNotifications={() => {
        setIsNotifModalOpen(true);
        if (isAuthenticated) {
          fetchNotifications();
        }
      }}
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

      {/* Dedicated Service Hero Banners for each page */}
      {activeTab === 'map' && (
        <HeroSection
          isAr={isAr}
          totalSpots={totalSpots}
          availableCount={availableCount}
          flexCount={flexCount}
          onNavigate={tab => setActiveTab(tab)}
        />
      )}

      {activeTab === 'booking' && (
        <ServiceHeroBanner
          isAr={isAr}
          serviceTag={
            isAr
              ? 'منظومة التصاريح والحجوزات الرقمية - جامعة فهد بن سلطان'
              : 'Digital Permits & Advance Reservations - FBSU'
          }
          tagIcon={Calendar}
          title={isAr ? 'بوابة حجز المواقف' : 'Advance Parking Booking'}
          highlightText={isAr ? 'والتصاريح المسبقة' : '& Digital Pass Wizard'}
          description={
            isAr
              ? 'احجز موقفك الجامعي مسبقاً وفق جدولك الدراسي (ساعي، يومي، أو فصلي) مع إصدار تصريح رقمي فوري مشفر برمز QR معتمد على كافة بوابات الحرم الجامعي.'
              : 'Reserve your parking space in advance according to your lecture schedule, with encrypted QR digital passes recognized across all campus gates.'
          }
          statChips={[
            {
              label: isAr ? 'نوع التصريح الصادر' : 'Pass Format',
              value: 'QR مشفر',
              icon: ShieldCheck,
              color: 'var(--gold-text)',
            },
            {
              label: isAr ? 'باقات حجز مرنة' : 'Booking Plans',
              value: 'ساعي / يومي / فصلي',
              icon: Calendar,
              color: 'var(--fbsu-primary)',
            },
            {
              label: isAr ? 'سداد فوري من المحفظة' : 'Wallet Settlement',
              value: 'فوري',
              icon: CreditCard,
              color: 'var(--accent-text)',
            },
            {
              label: isAr ? 'سياسة استرداد الرصيد' : 'Instant Refund Policy',
              value: 'مضمونة',
              icon: Award,
              color: 'var(--gold-text)',
            },
          ]}
        />
      )}

      {activeTab === 'gate' && (
        <ServiceHeroBanner
          isAr={isAr}
          serviceTag={
            isAr
              ? 'نظام البوابات الذكية والحواجز الآلية - جامعة فهد بن سلطان'
              : 'Smart Automated Gate System - FBSU'
          }
          tagIcon={Camera}
          title={isAr ? 'بوابة التعرف الذكي' : 'Automated ALPR Plate'}
          highlightText={isAr ? 'على لوحات المركبات (ALPR)' : 'Recognition Gate'}
          description={
            isAr
              ? 'منظومة بوابات آلية تعتمد على كاميرات عالية السرعة وخوارزميات الذكاء الاصطناعي لقراءة اللوحات السعودية والتحقق من التصاريح وفتح الحواجز التلقائية في أقل من 300 مللي ثانية دون توقف.'
              : 'High-speed automated barriers utilizing computer vision to read Saudi license plates, verify permits, and lift gates in sub-300ms.'
          }
          statChips={[
            {
              label: isAr ? 'زمن المعالجة والاستجابة' : 'Processing Latency',
              value: '< 300 ms',
              icon: Zap,
              color: 'var(--gold-text)',
            },
            {
              label: isAr ? 'دقة الذكاء الاصطناعي' : 'OCR Vision Accuracy',
              value: '99.4%',
              icon: ShieldCheck,
              color: 'var(--fbsu-primary)',
            },
            {
              label: isAr ? 'دعم اللوحات الرسمية' : 'Plate Recognition',
              value: 'عربي وإنجليزي',
              icon: Car,
              color: 'var(--accent-text)',
            },
            {
              label: isAr ? 'فتح الحواجز تلقائياً' : 'Automated Barrier',
              value: 'دون توقف',
              icon: Award,
              color: 'var(--gold-text)',
            },
          ]}
        />
      )}

      {activeTab === 'share' && (
        <ServiceHeroBanner
          isAr={isAr}
          serviceTag={
            isAr
              ? 'مبادرة استثمار المواقف والتبادل المرن - جامعة فهد بن سلطان'
              : 'Smart Parking Monetization & Flex Sharing - FBSU'
          }
          tagIcon={RefreshCw}
          title={isAr ? 'برنامج التبادل الذكي' : 'AI Flex Share &'}
          highlightText={isAr ? 'واستثمار المواقف الشاغرة' : 'Monetization Portal'}
          description={
            isAr
              ? 'استثمر موقفك أثناء مغادرتك للجامعة خلال فترات البريك، وأتحه لزملائك القادمين للمحاضرات، واكسب رصيداً مالياً في محفظتك الجامعية عن كل ساعة يظل فيها موقفك متاحاً مع ضمان إخلائه قبل عودتك.'
              : 'Monetize your bay during off-campus break hours by allocating it to arriving peers, earning wallet credits with guaranteed prompt vacancy upon your return.'
          }
          statChips={[
            {
              label: isAr ? 'عائد نقدي في المحفظة' : 'Direct Wallet Reward',
              value: '+17.25 ر.س',
              icon: Award,
              color: 'var(--gold-text)',
            },
            {
              label: isAr ? 'ضمان إخلاء الموقف' : 'Vacancy Guarantee',
              value: 'قبل موعدك بـ 15 د',
              icon: ShieldCheck,
              color: 'var(--fbsu-primary)',
            },
            {
              label: isAr ? 'زيادة السعة الاستيعابية' : 'Capacity Elevation',
              value: '+35%',
              icon: Zap,
              color: 'var(--accent-text)',
            },
            {
              label: isAr ? 'تنبيهات وتذكير آلي' : 'Smart Evacuation Alerts',
              value: 'نشط',
              icon: Sparkles,
              color: 'var(--gold-text)',
            },
          ]}
        />
      )}

      {activeTab === 'tutoring' && (
        <ServiceHeroBanner
          isAr={isAr}
          serviceTag={
            isAr
              ? 'مبادرة التكافل الأكاديمي والتمويل الذاتي للطلاب'
              : 'Academic Peer Mentorship & Self-Funding'
          }
          tagIcon={BookOpen}
          title={isAr ? 'برنامج التدريس بالأقران' : 'Peer Tutoring &'}
          highlightText={isAr ? 'ومكافآت التميز الأكاديمي' : 'Merit Rewards Program'}
          description={
            isAr
              ? 'منظومة طلابية رائدة تتيح للطلاب المتفوقين تدريس زملائهم وتحقيق دخل فوري (70 ر.س/ساعة) يُحوّل مباشرة إلى حسابهم الجامعي لسداد الرسوم الدراسية، مما يرسخ التفوق العلمي ويوفر تمويلاً ذاتياً للطلاب.'
              : 'A student-led framework where high achievers tutor peers at 70 SAR/hour, credited directly to university accounts to pay tuition fees.'
          }
          statChips={[
            {
              label: isAr ? 'مكافأة ساعة التدريس' : 'Hourly Tutor Reward',
              value: '70 ر.س',
              icon: Award,
              color: 'var(--gold-text)',
            },
            {
              label: isAr ? 'سداد فوري للرسوم' : 'Direct Tuition Offset',
              value: '100%',
              icon: CreditCard,
              color: 'var(--fbsu-primary)',
            },
            {
              label: isAr ? 'تغطية المقررات التخصصية' : 'Course Disciplines',
              value: 'CS & ENG',
              icon: BookOpen,
              color: 'var(--accent-text)',
            },
            {
              label: isAr ? 'متوسط تقييم المعلمين' : 'Average Peer Rating',
              value: '4.92 ★',
              icon: Sparkles,
              color: 'var(--gold-text)',
            },
          ]}
        />
      )}

      {activeTab === 'office-hours' && (
        <ServiceHeroBanner
          isAr={isAr}
          serviceTag={
            isAr
              ? 'منظومة التواصل والتوجيه الأكاديمي المباشر'
              : 'Direct Academic Advising & Leadership'
          }
          tagIcon={UserCheck}
          title={isAr ? 'الساعات المكتبية والاستشارات' : 'Faculty Office Hours &'}
          highlightText={isAr ? 'مع عمداء الكليات والأساتذة' : 'Deanery Mentorship'}
          description={
            isAr
              ? 'احجز موعداً استشارياً مباشراً مع أعضاء هيئة التدريس والقيادات الأكاديمية لمناقشة خطتك الدراسية، مشاريع التخرج، أبحاث النشر، وفرص التدريب الصيفي لدى الشركاء في نيوم والمشاريع الكبرى.'
              : 'Schedule one-on-one advising sessions with deans, department chairs, and faculty to discuss graduation projects and cooperative training.'
          }
          statChips={[
            {
              label: isAr ? 'تأكيد وحجز فوري' : 'Instant Confirmation',
              value: 'مباشر',
              icon: UserCheck,
              color: 'var(--fbsu-primary)',
            },
            {
              label: isAr ? 'إشعار لحظي للعمادة' : 'Deanery Notification',
              value: 'آلي',
              icon: ShieldCheck,
              color: 'var(--gold-text)',
            },
            {
              label: isAr ? 'جلسات حضورية وعن بعد' : 'Session Modalities',
              value: 'حضوري / عن بعد',
              icon: BookOpen,
              color: 'var(--accent-text)',
            },
            {
              label: isAr ? 'مشاريع التخرج والتدريب' : 'Capstone & Internships',
              value: 'NEOM & Red Sea',
              icon: Award,
              color: 'var(--gold-text)',
            },
          ]}
        />
      )}

      {activeTab === 'rooms' && (
        <ServiceHeroBanner
          isAr={isAr}
          serviceTag={
            isAr
              ? 'مختبرات الأبحاث والذكاء الاصطناعي - جامعة فهد بن سلطان'
              : 'Research Labs & AI Infrastructure - FBSU'
          }
          tagIcon={Cpu}
          title={isAr ? 'المعامل والقاعات الذكية' : 'Smart Laboratories &'}
          highlightText={isAr ? 'ومراكز الحوسبة الفائقة' : 'Supercomputing Hubs'}
          description={
            isAr
              ? 'استكشف واحجز أحدث بيئات العمل الهندسية ومختبرات الحوسبة الفائقة المزودة بوحدات NVIDIA RTX 4090 وشبكات Cisco وغرف الدراسة المعزولة صوتياً لدعم مسيرتك البحثية والأكاديمية.'
              : 'Explore and reserve top-tier engineering facilities, NVIDIA RTX 4090 GPU clusters, Cisco CyberOps sandboxes, and acoustically isolated study pods.'
          }
          statChips={[
            {
              label: isAr ? 'مرفقاً بحثياً متقدماً' : 'Advanced Facilities',
              value: '10',
              icon: Cpu,
              color: 'var(--gold-text)',
            },
            {
              label: isAr ? 'محطات معالجة RTX 4090' : 'NVIDIA GPU Stations',
              value: '20',
              icon: Zap,
              color: 'var(--accent-text)',
            },
            {
              label: isAr ? 'راوترات وسويتشات Cisco' : 'Cisco Enterprise Racks',
              value: 'Catalyst',
              icon: ShieldCheck,
              color: 'var(--fbsu-primary)',
            },
            {
              label: isAr ? 'عزل صوتي لكبائن التركيز' : 'Acoustic Soundproofing',
              value: '42 dB',
              icon: Award,
              color: 'var(--gold-text)',
            },
          ]}
        />
      )}

      {activeTab === 'analytics' && (
        <ServiceHeroBanner
          isAr={isAr}
          serviceTag={
            isAr
              ? 'لوحة القيادة والتحليلات الذكية بالذكاء الاصطناعي'
              : 'AI Campus Analytics & Predictive Intelligence'
          }
          tagIcon={BarChart3}
          title={isAr ? 'التحليلات والمؤشرات الذكية' : 'Campus Intelligence &'}
          highlightText={isAr ? 'لقيادة الحرم الجامعي' : 'Performance Analytics'}
          description={
            isAr
              ? 'مؤشرات أداء لحظية تعتمد على تقنيات الذكاء الاصطناعي وإنترنت الأشياء لمتابعة كفاءة إشغال المواقف، حركة بوابات ALPR، ونشاط المرافق الأكاديمية والتدريس.'
              : 'Real-time performance metrics powered by AI & IoT to track bay occupancy, ALPR traffic throughput, and academic facility utilization.'
          }
          statChips={[
            {
              label: isAr ? 'مستشعرات IoT متصلة' : 'Connected IoT Sensors',
              value: '40 حساس',
              icon: Cpu,
              color: 'var(--gold-text)',
            },
            {
              label: isAr ? 'معدل التبادل الذكي Flex' : 'Flex Sharing Rate',
              value: '35%',
              icon: Zap,
              color: 'var(--fbsu-primary)',
            },
            {
              label: isAr ? 'زمن اتخاذ القرار' : 'Gate AI Decision Time',
              value: '< 0.3 ث',
              icon: ShieldCheck,
              color: 'var(--accent-text)',
            },
            {
              label: isAr ? 'دقة التنبؤ بالطلب' : 'Demand Forecasting',
              value: '98.2%',
              icon: Award,
              color: 'var(--gold-text)',
            },
          ]}
        />
      )}

      {activeTab === 'wallet' && (
        <ServiceHeroBanner
          isAr={isAr}
          serviceTag={
            isAr ? 'منظومة الدفع الموحدة لجامعة فهد بن سلطان' : 'FBSU Unified Campus Digital Wallet'
          }
          tagIcon={WalletIcon}
          title={isAr ? 'المحفظة الرقمية الجامعية' : 'Campus Digital Wallet &'}
          highlightText={isAr ? 'والمدفوعات الفورية' : 'Instant P2P Settlements'}
          description={
            isAr
              ? 'محفظتك الرقمية المتكاملة لإدارة جميع العمليات المالية داخل الحرم الجامعي: شحن الرصيد، سداد المواقف، استقبال مكافآت التدريس، التحويل بين الزملاء، وسداد الرسوم الدراسية بأعلى درجات الأمان.'
              : 'Your central digital wallet for all on-campus transactions: balance top-up, parking, tutoring payouts, peer transfers, and tuition settlements.'
          }
          statChips={[
            {
              label: isAr ? 'تحويل فوري بين الطلاب' : 'Peer-to-Peer Transfers',
              value: 'P2P فوري',
              icon: Users,
              color: 'var(--gold-text)',
            },
            {
              label: isAr ? 'سجل محاسبي موثق' : 'Immutable Audit Ledger',
              value: '100% موثق',
              icon: ShieldCheck,
              color: 'var(--fbsu-primary)',
            },
            {
              label: isAr ? 'وسائل شحن متعددة' : 'Top-Up Gateways',
              value: 'مدى / فيزا / أبل باي',
              icon: CreditCard,
              color: 'var(--accent-text)',
            },
            {
              label: isAr ? 'أمان مصرفي عالي' : 'Security Standards',
              value: 'مشفر 256-bit',
              icon: Zap,
              color: 'var(--gold-text)',
            },
          ]}
        />
      )}

      {activeTab === 'tuition' && (
        <ServiceHeroBanner
          isAr={isAr}
          serviceTag={
            isAr
              ? 'منظومة السداد الأكاديمي المعتمدة - جامعة فهد بن سلطان'
              : 'Official Academic Billing & Settlements - FBSU'
          }
          tagIcon={CreditCard}
          title={isAr ? 'الرسوم الدراسية والفواتير' : 'Tuition Fees &'}
          highlightText={isAr ? 'والإيصالات الرقمية المعتمدة' : 'Verified QR Receipts'}
          description={
            isAr
              ? 'استعرض وسدد فواتيرك الأكاديمية مباشرة من رصيد محفظتك الجامعية أو عبر وسائل الدفع الرسمية، مع إصدار إيصالات إلكترونية معتمدة برمز QR تحقق فوري لعمادة القبول والتسجيل.'
              : 'Review and pay university tuition invoices seamlessly from your digital wallet with official QR-verified electronic receipts.'
          }
          statChips={[
            {
              label: isAr ? 'سداد من عوائد التدريس' : 'Peer Tutoring Offset',
              value: 'تلقائي',
              icon: Award,
              color: 'var(--gold-text)',
            },
            {
              label: isAr ? 'إيصالات رسمية بـ QR' : 'Cryptographic Receipts',
              value: 'معتمدة',
              icon: ShieldCheck,
              color: 'var(--fbsu-primary)',
            },
            {
              label: isAr ? 'خطط تقسيط مجدولة' : 'Flexible Installments',
              value: 'ميسرة',
              icon: CreditCard,
              color: 'var(--accent-text)',
            },
            {
              label: isAr ? 'التحديث اللحظي للعمادة' : 'Registrar Sync',
              value: 'فوري',
              icon: Sparkles,
              color: 'var(--gold-text)',
            },
          ]}
        />
      )}

      {(activeTab === 'bus' || activeTab === 'transit') && (
        <ServiceHeroBanner
          isAr={isAr}
          serviceTag={
            isAr
              ? 'منظومة النقل الترددي والحافلات الذكية - جامعة فهد بن سلطان'
              : 'Smart Campus Transit & Eco-Shuttle Fleet - FBSU'
          }
          tagIcon={Bus}
          title={isAr ? 'أسطول الحافلات الجامعية' : 'Campus Transit Fleet &'}
          highlightText={isAr ? 'والنقل الذكي الصديق للبيئة' : 'Smart Eco-Shuttle Network'}
          description={
            isAr
              ? 'تتبع فوري لأسطول الحافلات الكهربائية داخل الحرم الجامعي، مواعيد التردد بين الكليات ومواقف السيارات، وإصدار تذاكر الصعود الفورية عبر رمز QR الموحد.'
              : 'Real-time GPS tracking for electric campus shuttles, live timetable between faculties and parking zones, and instant QR boarding pass issuance.'
          }
          statChips={[
            {
              label: isAr ? 'أسطول كهربائي 100%' : '100% Electric Fleet',
              value: 'صفر انبعاثات',
              icon: Zap,
              color: '#10B981',
            },
            {
              label: isAr ? 'معدل التردد بين المحطات' : 'Transit Frequency',
              value: '10 دقائق',
              icon: Sparkles,
              color: 'var(--gold-text)',
            },
            {
              label: isAr ? 'خطوط تغطي الحرم' : 'Active Campus Lines',
              value: '3 مسارات',
              icon: ShieldCheck,
              color: 'var(--fbsu-primary)',
            },
            {
              label: isAr ? 'الركوب لجميع الطلاب' : 'Student Access',
              value: 'مجاني بالكامل',
              icon: Award,
              color: 'var(--gold-text)',
            },
          ]}
        />
      )}

      <div
        className="container"
        style={{ marginTop: '2.5rem', minHeight: '60vh', paddingBottom: '3rem' }}
      >
        {/* Category Subnav chips */}
        <CategorySubnav activeTab={activeTab} isAr={isAr} onTabChange={setActiveTab} />

        {/* Tab 1: Live Parking Map (Dedicated Parking Service Portal) */}
        {activeTab === 'map' && (
          <>
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

            {/* Dedicated Parking Explainer Sections */}
            <ServiceExplainerSections service="parking" isAr={isAr} onNavigate={setActiveTab} />
          </>
        )}

        {/* Tab 2: Booking Wizard (Dedicated Booking Service Portal) */}
        {activeTab === 'booking' && (
          <>
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
            <ServiceExplainerSections service="booking" isAr={isAr} onNavigate={setActiveTab} />
          </>
        )}

        {/* Tab 4: Gate ALPR (Dedicated Gate Service Portal) */}
        {activeTab === 'gate' && (
          <>
            <AlprGateView isAr={isAr} />
            <ServiceExplainerSections service="gate" isAr={isAr} onNavigate={setActiveTab} />
          </>
        )}

        {/* Tab 5: Share Spot (Dedicated Flex Share Service Portal) */}
        {activeTab === 'share' && (
          <>
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
            <ServiceExplainerSections service="share" isAr={isAr} onNavigate={setActiveTab} />
          </>
        )}

        {/* Tab 6: Peer Tutoring (Dedicated Tutoring Service Portal) */}
        {activeTab === 'tutoring' && (
          <>
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
            <ServiceExplainerSections service="tutoring" isAr={isAr} onNavigate={setActiveTab} />
          </>
        )}

        {/* Tab 7: Faculty Office Hours (Dedicated Office Hours Service Portal) */}
        {activeTab === 'office-hours' && (
          <>
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
            <ServiceExplainerSections
              service="office-hours"
              isAr={isAr}
              onNavigate={setActiveTab}
            />
          </>
        )}

        {/* Tab 8: Study Rooms & Labs (Dedicated Smart Labs & Pods Service Portal) */}
        {activeTab === 'rooms' && (
          <>
            <StudyRoomsView
              rooms={studyRooms}
              isLoading={isRoomsLoading}
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
            <ServiceExplainerSections service="rooms" isAr={isAr} onNavigate={setActiveTab} />
          </>
        )}

        {/* Tab 9: Analytics (Dedicated Analytics Portal) */}
        {activeTab === 'analytics' && <AnalyticsView isAr={isAr} />}

        {/* Tab 10: Wallet Page (Dedicated Wallet Portal) */}
        {activeTab === 'wallet' && (
          <>
            <div style={{ marginTop: '1rem' }}>
              <WalletPage
                onBalanceUpdate={b => setLiveBalance(b)}
                onNavigateToTuition={() => setActiveTab('tuition')}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            </div>
            <ServiceExplainerSections service="wallet" isAr={isAr} onNavigate={setActiveTab} />
          </>
        )}

        {/* Tab 11: Tuition Page (Dedicated Tuition Portal) */}
        {activeTab === 'tuition' && (
          <>
            <div style={{ marginTop: '1rem' }}>
              <TuitionPage
                onBalanceUpdate={b => setLiveBalance(b)}
                onOpenTopUp={() => setActiveTab('wallet')}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            </div>
            <ServiceExplainerSections service="tuition" isAr={isAr} onNavigate={setActiveTab} />
          </>
        )}

        {/* Tab 13: Transit & Eco-Shuttle (Dedicated Transit Service Portal) */}
        {(activeTab === 'bus' || activeTab === 'transit') && (
          <>
            <div style={{ marginTop: '1rem' }}>
              <TransitView isAr={isAr} />
            </div>
            <ServiceExplainerSections service="bus" isAr={isAr} onNavigate={setActiveTab} />
          </>
        )}

        {/* Tab 12: Admin Panel */}
        {activeTab === 'admin-panel' && (
          <ProtectedRoute requiredRoles={['CAMPUS_ADMIN']}>
            <AdminDashboard isAr={isAr} onRefreshAll={handleRefreshAll} />
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
        unreadCount={unreadCount}
        isLoading={isNotificationsLoading}
        onClose={() => setIsNotifModalOpen(false)}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onNavigate={handleNavigateFromNotification}
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
