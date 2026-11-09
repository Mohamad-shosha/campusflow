import { useState, useRef, useMemo, type FC } from 'react';
import {
  MapPin,
  Building2,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  RotateCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Columns3,
  LayoutGrid,
  Focus,
  Zap,
  Users,
  Compass,
  X,
} from 'lucide-react';
import type { ParkingSpot } from '../data/parkingData';
import type { BookingResponse } from '../types/parking';
import { SpotCard } from './SpotCard';
import { SpotDetailsModal } from './SpotDetailsModal';
import { DigitalPassModal, type DigitalPassData } from './DigitalPassModal';
import { soundFX } from '../../../shared/utils/sound';
import { parkingApi } from '../api/parkingApi';

export interface ParkingLotViewProps {
  spots: ParkingSpot[];
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
    plate?: string | undefined;
    primarySpot?: number | undefined;
  };
  isAuthenticated?: boolean | undefined;
  onOpenAuth?: (() => void) | undefined;
  onReserveSpot?: ((spotId: number) => void) | undefined;
  onBookingSuccess?: ((booking: BookingResponse) => void) | undefined;
  onBookingCancelled?: (() => void) | undefined;
  onOpenGate?: (() => void) | undefined;
  isLoading?: boolean | undefined;
  /** True when the last attempt to load spots from the API failed */
  loadError?: boolean | undefined;
  onRefresh?: (() => void) | undefined;
  lastUpdated?: Date | null | undefined;
}

type ViewMode = 'lanes' | 'focus' | 'grid';
type StatusFilter = 'all' | 'available' | 'flex' | 'ev' | 'faculty';

interface ZoneMeta {
  code: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  gateAr: string;
  gateEn: string;
}

const ZONES_ORDER: ZoneMeta[] = [
  {
    code: 'A',
    nameAr: 'قطاع A - الحاسب والهندسة',
    nameEn: 'Zone A - Computing & Engineering',
    descAr: 'المواقف الذكية بجوار كليتي الهندسة والحاسب الآلي',
    descEn: 'Smart bays adjacent to Engineering & IT colleges',
    gateAr: 'البوابة الشمالية',
    gateEn: 'North Gate',
  },
  {
    code: 'B',
    nameAr: 'قطاع B - إدارة الأعمال والطب',
    nameEn: 'Zone B - Business & Medicine',
    descAr: 'مواقف مظللة قريبة من مباني العلوم الإدارية والطبية',
    descEn: 'Shaded bays near Business & Medical sciences',
    gateAr: 'البوابة الشرقية',
    gateEn: 'East Gate',
  },
  {
    code: 'C',
    nameAr: 'قطاع C - كادر التدريس VIP',
    nameEn: 'Zone C - Faculty VIP',
    descAr: 'مواقف مخصصة للعمداء وأعضاء هيئة التدريس',
    descEn: 'Dedicated bays for deans and academic faculty',
    gateAr: 'بوابة الإدارة المركزية',
    gateEn: 'Admin Gate',
  },
  {
    code: 'D',
    nameAr: 'قطاع D - شحن كهربائي EV',
    nameEn: 'Zone D - EV Charging Stations',
    descAr: 'محطات شحن سريعة وفائقة السرعة للمركبات الكهربائية',
    descEn: 'Fast & ultra-fast EV chargers with smart power distribution',
    gateAr: 'البوابة الغربية',
    gateEn: 'West Gate',
  },
  {
    code: 'E',
    nameAr: 'قطاع E - البوابة المركزية والخدمات',
    nameEn: 'Zone E - Main Gate & Campus Services',
    descAr: 'مواقف قريبة من صالة القبول، المكتبة المركزية والمطاعم',
    descEn: 'Bays close to Admissions, Central Library & Food Court',
    gateAr: 'البوابة الجنوبية الرئيسية',
    gateEn: 'Main South Gate',
  },
];

export const ParkingLotView: FC<ParkingLotViewProps> = ({
  spots,
  isAr,
  currentUser,
  isAuthenticated,
  onOpenAuth,
  onBookingSuccess,
  onBookingCancelled,
  onOpenGate,
  isLoading = false,
  loadError = false,
  onRefresh,
  lastUpdated,
}) => {
  const [activeZone, setActiveZone] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('lanes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [highlightedSpotId, setHighlightedSpotId] = useState<number | null>(null);

  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isBookingSpot, setIsBookingSpot] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [digitalPass, setDigitalPass] = useState<DigitalPassData | null>(null);

  // Lane horizontal scroll containers
  const laneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Active sector index for 'focus' mode
  const [focusZoneIndex, setFocusZoneIndex] = useState<number>(0);

  // Overall quick radar statistics
  const radarStats = useMemo(() => {
    let availableCount = 0;
    let occupiedCount = 0;
    let flexCount = 0;
    let evCount = 0;
    let facultyCount = 0;

    spots.forEach(s => {
      if (s.status === 'available') availableCount++;
      else if (s.status === 'occupied' || s.status === 'reserved') occupiedCount++;
      else if (s.status === 'flex' || s.status === 'flex-share') flexCount++;
      else if (s.status === 'faculty' || s.status === 'faculty-spot') facultyCount++;

      if (s.isEV || s.zone === 'D') evCount++;
    });

    return { availableCount, occupiedCount, flexCount, evCount, facultyCount };
  }, [spots]);

  // Filtered spots based on activeZone, searchQuery, and statusFilter
  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      // Zone filter
      if (activeZone !== 'all' && spot.zone !== activeZone) {
        return false;
      }

      // Status filter
      if (statusFilter === 'available' && spot.status !== 'available') {
        return false;
      }
      if (statusFilter === 'flex' && spot.status !== 'flex' && spot.status !== 'flex-share') {
        return false;
      }
      if (statusFilter === 'ev' && !spot.isEV && spot.zone !== 'D') {
        return false;
      }
      if (
        statusFilter === 'faculty' &&
        spot.status !== 'faculty' &&
        spot.status !== 'faculty-spot' &&
        spot.zone !== 'C'
      ) {
        return false;
      }

      // Search query filter (spot id, occupant name, plate, car, college)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const bayNumStr = spot.id.toString();
        const bayPadded = String(spot.id).padStart(2, '0');
        const matchId =
          bayNumStr.includes(query) ||
          bayPadded.includes(query) ||
          `#${bayNumStr}`.includes(query) ||
          `#${bayPadded}`.includes(query) ||
          `${spot.zone}-${bayPadded}`.toLowerCase().includes(query);

        const matchOccupant = spot.occupant?.toLowerCase().includes(query);
        const matchVehicle = spot.car?.toLowerCase().includes(query);
        const matchPlate = spot.plate?.toLowerCase().includes(query);
        const matchCollege =
          spot.college?.toLowerCase().includes(query) ||
          spot.collegeEn?.toLowerCase().includes(query);

        if (!matchId && !matchOccupant && !matchVehicle && !matchPlate && !matchCollege) {
          return false;
        }
      }

      return true;
    });
  }, [spots, activeZone, statusFilter, searchQuery]);

  // Group spots by zone for Horizontal Lanes mode
  const spotsByZone = useMemo(() => {
    const map: Record<string, ParkingSpot[]> = {
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
    };
    filteredSpots.forEach(s => {
      if (map[s.zone]) {
        map[s.zone].push(s);
      } else {
        map[s.zone] = [s];
      }
    });
    return map;
  }, [filteredSpots]);

  // Scroll a specific lane track horizontally
  const handleScrollLane = (zoneCode: string, direction: 'prev' | 'next') => {
    soundFX.playClick();
    const track = laneRefs.current[zoneCode];
    if (!track) return;
    const scrollAmount = isAr
      ? direction === 'prev'
        ? 340
        : -340
      : direction === 'prev'
        ? -340
        : 340;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Jump from Mini-Radar directly to a specific spot
  const handleRadarSpotClick = (spot: ParkingSpot) => {
    soundFX.playClick();
    setHighlightedSpotId(spot.id);

    // If spot's zone is currently filtered out, switch to all or that zone
    if (activeZone !== 'all' && activeZone !== spot.zone) {
      setActiveZone(spot.zone);
    }

    // Scroll element into view smoothly
    setTimeout(() => {
      const cardEl = document.getElementById(`spot-card-${spot.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }, 100);
  };

  const handleBookFromModal = async (spot: ParkingSpot) => {
    setBookingError(null);

    // A bay can only be booked against its real backend record. Never issue a
    // locally generated pass.
    if (!spot.backendId) {
      setBookingError(
        isAr
          ? 'لا يمكن حجز هذا الموقف حالياً: بياناته غير متزامنة مع الخادم. حدّث الصفحة وحاول مجدداً.'
          : 'This bay cannot be booked right now: it is not synced with the server. Refresh and try again.'
      );
      return;
    }

    if (isAuthenticated === false) {
      setBookingError(
        isAr
          ? 'يرجى تسجيل الدخول أولاً لتأكيد الحجز وخصم الرسوم من محفظتك الجامعية.'
          : 'Please sign in first to confirm your booking and debit your campus wallet.'
      );
      onOpenAuth?.();
      return;
    }

    setIsBookingSpot(true);
    try {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

      const booking = await parkingApi.createBooking({
        spotId: spot.backendId,
        durationHours: 3.0,
        autoDebitWallet: true,
        idempotencyKey:
          'map-booking-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      });

      soundFX.playSuccess();
      setSelectedSpot(null);
      setDigitalPass({
        spotId: booking.bayNumber || spot.id,
        college: isAr ? booking.zoneNameAr || spot.college : booking.zoneNameEn || spot.collegeEn,
        userName: currentUser.name,
        userId: currentUser.id,
        plate: booking.vehiclePlate || currentUser.plate || '',
        duration: `${booking.durationHours} ${isAr ? 'ساعات' : 'Hours'}`,
        bookingId: booking.id,
        passCode: booking.digitalPassCode,
        qrToken: booking.qrToken,
        totalAmount: Number(booking.totalAmount),
      });
      onBookingSuccess?.(booking);
    } catch (err: unknown) {
      soundFX.playError();
      const errorObj = err as {
        response?: { status?: number; data?: { detail?: string; message?: string } };
      };
      if (errorObj?.response?.status === 401) {
        setBookingError(
          isAr
            ? 'يرجى تسجيل الدخول أولاً لتأكيد الحجز وخصم الرصيد من محفظتك.'
            : 'Please sign in to confirm booking and debit your campus wallet.'
        );
        onOpenAuth?.();
      } else {
        setBookingError(
          errorObj?.response?.data?.detail ||
            errorObj?.response?.data?.message ||
            (isAr
              ? 'تعذر إتمام الحجز. يرجى التأكد من رصيد المحفظة وتوفر الموقف.'
              : 'Failed to complete booking. Please verify wallet balance and spot availability.')
        );
      }
    } finally {
      setIsBookingSpot(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    await parkingApi.cancelBooking(bookingId);
    soundFX.playSuccess();
    onBookingCancelled?.();
  };

  // Determine current active zone meta for Sector Focus mode
  const currentFocusZone = ZONES_ORDER[focusZoneIndex] || ZONES_ORDER[0];
  const focusZoneSpots = useMemo(() => {
    return filteredSpots.filter(s => s.zone === currentFocusZone.code);
  }, [filteredSpots, currentFocusZone]);

  return (
    <div data-testid="parking-lot-view" className="parking-view-wrapper">
      {/* Section Header */}
      <div
        className="section-head"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span className="section-eyebrow">
            <MapPin size={16} color="var(--fbsu-gold)" />
            <span>{isAr ? 'خريطة المواقف الذكية' : 'Interactive Smart Map'}</span>
          </span>
          <h3 className="section-title">
            {isAr
              ? `المخطط الرقمي المباشر لمواقف جامعة فهد بن سلطان (${spots.length} موقف)`
              : `FBSU Live Digital Parking Lot (${spots.length} Bays)`}
          </h3>
          <p className="section-subtitle">
            {isAr
              ? 'تصفح مواقف الجامعة الـ 40 بدون الحاجة لتمرير مطول عبر الحارات الأفقية الواقعية أو شريط الرادار المصغر المباشر.'
              : 'Explore all 40 campus bays with zero vertical fatigue using realistic horizontal lanes or the live mini-radar strip.'}
          </p>
        </div>

        {onRefresh && (
          <button
            type="button"
            className="btn-glass"
            onClick={() => {
              soundFX.playClick();
              onRefresh();
            }}
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'center' }}
            title={isAr ? 'تحديث فوري من قاعدة البيانات' : 'Sync live with PostgreSQL'}
          >
            <RotateCw size={15} className={isLoading ? 'spin-anim' : ''} />
            <span>
              {isAr
                ? isLoading
                  ? 'جاري المزامنة...'
                  : 'تحديث مباشر'
                : isLoading
                  ? 'Syncing...'
                  : 'Live Sync'}
            </span>
          </button>
        )}
      </div>

      {/* 1. Interactive 40-Bay Mini-Radar Strip (شريط الرادار المصغر المدمج) */}
      <div className="parking-mini-radar-strip" aria-label="Campus Parking Live Mini-Radar">
        <div className="radar-strip-head">
          <div className="radar-strip-title">
            <Compass size={15} className="radar-icon-spin" />
            <span className="radar-head-text">
              {isAr ? 'رادار المواقف اللحظي الشامل' : 'Full Campus Mini-Radar'}
            </span>
            <span className="radar-chip-count">({spots.length})</span>
          </div>

          <div className="radar-quick-stats">
            <span className="radar-stat-pill avail">
              <span className="pill-dot avail"></span>
              <span>
                {isAr ? `${radarStats.availableCount} متاح` : `${radarStats.availableCount} Avail`}
              </span>
            </span>
            <span className="radar-stat-pill occ">
              <span className="pill-dot occ"></span>
              <span>
                {isAr ? `${radarStats.occupiedCount} مشغول` : `${radarStats.occupiedCount} Occ`}
              </span>
            </span>
            <span className="radar-stat-pill flx">
              <span className="pill-dot flx"></span>
              <span>{isAr ? `${radarStats.flexCount} فليكس` : `${radarStats.flexCount} Flex`}</span>
            </span>
            <span className="radar-stat-pill ev">
              <span className="pill-dot ev"></span>
              <span>{isAr ? `${radarStats.evCount} شاحن EV` : `${radarStats.evCount} EV`}</span>
            </span>
            <span className="radar-stat-pill fac">
              <span className="pill-dot fac"></span>
              <span>
                {isAr ? `${radarStats.facultyCount} كادر` : `${radarStats.facultyCount} Faculty`}
              </span>
            </span>
          </div>
        </div>

        {/* 40 Micro-Bays Strip */}
        <div className="radar-bays-track">
          {spots.map(spot => {
            const isAvail = spot.status === 'available';
            const isOcc = spot.status === 'occupied' || spot.status === 'reserved';
            const isFlx = spot.status === 'flex' || spot.status === 'flex-share';
            const isFac = spot.status === 'faculty' || spot.status === 'faculty-spot';

            let statusClass = 'avail';
            if (isOcc) statusClass = 'occ';
            else if (isFlx) statusClass = 'flx';
            else if (isFac) statusClass = 'fac';

            const isHighlighted = highlightedSpotId === spot.id;

            return (
              <button
                key={spot.id}
                type="button"
                className={`radar-bay-node ${statusClass} ${isHighlighted ? 'highlighted' : ''}`}
                onClick={() => handleRadarSpotClick(spot)}
                onDoubleClick={() => {
                  setSelectedSpot(spot);
                  soundFX.playClick();
                }}
                title={
                  isAr
                    ? `موقف #${String(spot.id).padStart(2, '0')} (${spot.zone}) - ${
                        isAvail
                          ? 'متاح للحجز'
                          : isOcc
                            ? `مشغول: ${spot.occupant || 'محجوز'}`
                            : isFlx
                              ? 'تبادل ذكي Flex'
                              : 'كادر التدريس'
                      } - اضغط للتنقل`
                    : `Bay #${String(spot.id).padStart(2, '0')} (${spot.zone}) - ${
                        isAvail
                          ? 'Available'
                          : isOcc
                            ? `Occupied: ${spot.occupant || 'Reserved'}`
                            : isFlx
                              ? 'AI Flex'
                              : 'Faculty'
                      }`
                }
              >
                <span className="radar-node-num">{String(spot.id).padStart(2, '0')}</span>
                <span className="radar-node-dot"></span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Executive Parking Control Hub: Mode Switcher, Quick Search, Status Filters */}
      <div className="parking-control-hub">
        {/* View Mode Switcher */}
        <div className="view-mode-tabs" role="tablist">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'lanes' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setViewMode('lanes');
            }}
            title={isAr ? 'عرض الحارات الأفقية الواقعية' : 'Horizontal Lanes View'}
          >
            <Columns3 size={15} />
            <span>{isAr ? 'حارات أفقية' : 'Garage Lanes'}</span>
          </button>

          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'focus' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setViewMode('focus');
            }}
            title={isAr ? 'عرض القطاع المركز بدون تمرير' : 'Single Sector Focus View'}
          >
            <Focus size={15} />
            <span>{isAr ? 'تركيز القطاع' : 'Sector Focus'}</span>
          </button>

          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setViewMode('grid');
            }}
            title={isAr ? 'عرض الشبكة الكاملة الموسعة' : 'Full Matrix Grid'}
          >
            <LayoutGrid size={15} />
            <span>{isAr ? 'شبكة موسعة' : 'Full Grid'}</span>
          </button>
        </div>

        {/* Quick Instant Search */}
        <div className="parking-quick-search">
          <Search size={14} className="search-icon-muted" />
          <input
            type="text"
            className="quick-search-input"
            placeholder={
              isAr
                ? 'ابحث برقم الموقف (مثال: 12 أو A-05) أو اسم السائق أو اللوحة...'
                : 'Search bay # (e.g. 12 or A-05), driver name, plate...'
            }
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="quick-search-clear"
              onClick={() => setSearchQuery('')}
              title={isAr ? 'مسح البحث' : 'Clear search'}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Quick Status Filter Chips */}
        <div className="status-filter-group">
          <button
            type="button"
            className={`status-chip ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setStatusFilter('all');
            }}
          >
            <span>{isAr ? `الكل (${spots.length})` : `All (${spots.length})`}</span>
          </button>

          <button
            type="button"
            className={`status-chip avail ${statusFilter === 'available' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setStatusFilter('available');
            }}
          >
            <span className="chip-indicator avail"></span>
            <span>
              {isAr
                ? `متاح (${radarStats.availableCount})`
                : `Avail (${radarStats.availableCount})`}
            </span>
          </button>

          <button
            type="button"
            className={`status-chip flx ${statusFilter === 'flex' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setStatusFilter('flex');
            }}
          >
            <span className="chip-indicator flx"></span>
            <span>
              {isAr ? `فليكس (${radarStats.flexCount})` : `Flex (${radarStats.flexCount})`}
            </span>
          </button>

          <button
            type="button"
            className={`status-chip ev ${statusFilter === 'ev' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setStatusFilter('ev');
            }}
          >
            <Zap size={12} className="chip-icon-ev" />
            <span>{isAr ? `شواحن EV (${radarStats.evCount})` : `EV (${radarStats.evCount})`}</span>
          </button>

          <button
            type="button"
            className={`status-chip fac ${statusFilter === 'faculty' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setStatusFilter('faculty');
            }}
          >
            <Users size={12} className="chip-icon-fac" />
            <span>
              {isAr ? `كادر (${radarStats.facultyCount})` : `Faculty (${radarStats.facultyCount})`}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Parking Toolbar: Zone Filter Tabs & Status Legend */}
      <div className="parking-toolbar">
        <div className="zone-filter-tabs">
          <button
            className={`zone-btn ${activeZone === 'all' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('all');
            }}
            type="button"
          >
            <Building2 size={14} />
            <span>
              {isAr ? `جميع القطاعات (${spots.length} موقف)` : `All Zones (${spots.length})`}
            </span>
          </button>
          <button
            className={`zone-btn ${activeZone === 'A' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('A');
              setFocusZoneIndex(0);
            }}
            type="button"
          >
            <span>{isAr ? 'قطاع A - الحاسب والهندسة' : 'Zone A - Computing & Eng'}</span>
          </button>
          <button
            className={`zone-btn ${activeZone === 'B' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('B');
              setFocusZoneIndex(1);
            }}
            type="button"
          >
            <span>{isAr ? 'قطاع B - إدارة الأعمال والطب' : 'Zone B - Business & Med'}</span>
          </button>
          <button
            className={`zone-btn ${activeZone === 'C' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('C');
              setFocusZoneIndex(2);
            }}
            type="button"
          >
            <span>{isAr ? 'قطاع C - كادر التدريس' : 'Zone C - Faculty VIP'}</span>
          </button>
          <button
            className={`zone-btn ${activeZone === 'D' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('D');
              setFocusZoneIndex(3);
            }}
            type="button"
          >
            <span>{isAr ? 'قطاع D - شحن كهربائي EV' : 'Zone D - EV Charging'}</span>
          </button>
          <button
            className={`zone-btn ${activeZone === 'E' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('E');
              setFocusZoneIndex(4);
            }}
            type="button"
          >
            <span>{isAr ? 'قطاع E - البوابة المركزية' : 'Zone E - Main Gate'}</span>
          </button>
        </div>

        <div className="legend-list">
          <div className="legend-item">
            <span className="legend-chip avail"></span> {isAr ? 'متاح' : 'Available'}
          </div>
          <div className="legend-item">
            <span className="legend-chip occ"></span> {isAr ? 'مشغول' : 'Occupied'}
          </div>
          <div className="legend-item">
            <span className="legend-chip flx"></span>{' '}
            {isAr ? 'تبادل ذكي (بريك)' : 'AI Flex (Break)'}
          </div>
          <div className="legend-item">
            <span className="legend-chip res"></span> {isAr ? 'محجوز لك' : 'Your Spot'}
          </div>
          <div className="legend-item">
            <span className="legend-chip fac"></span> {isAr ? 'أعضاء التدريس' : 'Faculty'}
          </div>
        </div>
      </div>

      {/* 4. Campus Road Orientation Header */}
      <div className="campus-road-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowUp size={14} color="var(--fbsu-primary)" />
          <span>
            {isAr
              ? 'طريق الملك خالد - بوابة الحرم الجامعي الرئيسية'
              : 'King Khalid Road - Main Gate'}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--gold-text)',
          }}
        >
          <ShieldCheck size={14} color="var(--fbsu-gold)" />
          <span>
            {isAr
              ? lastUpdated
                ? `مزامنة حية نشطة مع قاعدة البيانات (${lastUpdated.toLocaleTimeString('ar-SA')})`
                : 'مزامنة إنترنت الأشياء IoT نشطة'
              : lastUpdated
                ? `Live Database Sync (${lastUpdated.toLocaleTimeString()})`
                : 'IoT Real-time Sync Active'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowDown size={14} color="var(--fbsu-primary)" />
          <span>
            {isAr ? 'مبنى كلية الهندسة والحاسب الآلي' : 'College of Engineering & Computing'}
          </span>
        </div>
      </div>

      {/* Data state: loading / error / empty (no mock fallback) */}
      {spots.length === 0 && (
        <div
          className="parking-data-state"
          role={loadError ? 'alert' : 'status'}
          data-testid={
            isLoading ? 'parking-loading' : loadError ? 'parking-load-error' : 'parking-empty'
          }
        >
          <strong>
            {isLoading
              ? isAr
                ? 'جاري تحميل المواقف من الخادم...'
                : 'Loading parking bays from the server...'
              : loadError
                ? isAr
                  ? 'تعذر تحميل بيانات المواقف.'
                  : 'Could not load parking data.'
                : isAr
                  ? 'لا توجد مواقف مسجلة حالياً.'
                  : 'No parking bays are registered yet.'}
          </strong>
          {!isLoading && onRefresh && (
            <button type="button" className="btn-outline" onClick={onRefresh}>
              <RotateCw size={14} />
              <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
            </button>
          )}
        </div>
      )}

      {/* 5. Main Visual Area Depending on ViewMode */}

      {/* MODE 1: Horizontal Driving Lanes (Default) */}
      {viewMode === 'lanes' && (
        <div
          className="parking-lanes-wrapper"
          style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s ease' }}
        >
          {ZONES_ORDER.filter(z => activeZone === 'all' || activeZone === z.code).map(zone => {
            const laneSpots = spotsByZone[zone.code] || [];
            if (laneSpots.length === 0) return null;

            const laneAvail = laneSpots.filter(s => s.status === 'available').length;

            return (
              <div key={zone.code} className="parking-lane-card">
                <div className="lane-header">
                  <div className="lane-meta">
                    <span className="lane-badge">
                      {isAr ? `حارة ${zone.code}` : `Lane ${zone.code}`}
                    </span>
                    <h4 className="lane-title">{isAr ? zone.nameAr : zone.nameEn}</h4>
                    <span className="lane-gate-pill">{isAr ? zone.gateAr : zone.gateEn}</span>
                    <span className="lane-avail-counter">
                      {isAr
                        ? `${laneAvail} متاح من ${laneSpots.length}`
                        : `${laneAvail} / ${laneSpots.length} Available`}
                    </span>
                  </div>

                  {/* Horizontal Scroll Controls */}
                  <div className="lane-nav-controls">
                    <button
                      type="button"
                      className="lane-nav-btn"
                      onClick={() => handleScrollLane(zone.code, 'prev')}
                      title={isAr ? 'تحريك الحارة لليمين' : 'Scroll lane right'}
                    >
                      <ChevronRight size={18} />
                    </button>
                    <button
                      type="button"
                      className="lane-nav-btn"
                      onClick={() => handleScrollLane(zone.code, 'next')}
                      title={isAr ? 'تحريك الحارة لليسار' : 'Scroll lane left'}
                    >
                      <ChevronLeft size={18} />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scrolling Aisle */}
                <div
                  className="lane-track-horizontal"
                  ref={el => {
                    laneRefs.current[zone.code] = el;
                  }}
                >
                  {laneSpots.map(spot => (
                    <div
                      key={spot.id}
                      id={`spot-card-${spot.id}`}
                      className={`lane-card-item ${highlightedSpotId === spot.id ? 'spot-card-highlighted' : ''}`}
                    >
                      <SpotCard
                        spot={spot}
                        isAr={isAr}
                        isCurrentUserSpot={currentUser.primarySpot === spot.id}
                        onClick={s => {
                          setBookingError(null);
                          setSelectedSpot(s);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: Sector Focus (Zero Vertical Scroll Viewport) */}
      {viewMode === 'focus' && (
        <div
          className="parking-sector-focus"
          style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s ease' }}
        >
          {/* Sector Navigation Header */}
          <div className="sector-focus-header">
            <button
              type="button"
              className="sector-arrow-btn"
              onClick={() => {
                soundFX.playClick();
                setFocusZoneIndex(prev => (prev === 0 ? ZONES_ORDER.length - 1 : prev - 1));
              }}
              title={isAr ? 'القطاع السابق' : 'Previous Sector'}
            >
              <ChevronRight size={20} />
              <span>{isAr ? 'القطاع السابق' : 'Prev Sector'}</span>
            </button>

            <div className="sector-info-center">
              <span className="sector-pill-badge">
                {isAr
                  ? `قطاع ${focusZoneIndex + 1} من ${ZONES_ORDER.length}`
                  : `Sector ${focusZoneIndex + 1} of ${ZONES_ORDER.length}`}
              </span>
              <h4 className="sector-focus-title">
                {isAr ? currentFocusZone.nameAr : currentFocusZone.nameEn}
              </h4>
              <p className="sector-focus-desc">
                {isAr ? currentFocusZone.descAr : currentFocusZone.descEn} •{' '}
                <strong style={{ color: 'var(--gold-text)' }}>
                  {isAr ? currentFocusZone.gateAr : currentFocusZone.gateEn}
                </strong>
              </p>
            </div>

            <button
              type="button"
              className="sector-arrow-btn"
              onClick={() => {
                soundFX.playClick();
                setFocusZoneIndex(prev => (prev === ZONES_ORDER.length - 1 ? 0 : prev + 1));
              }}
              title={isAr ? 'القطاع التالي' : 'Next Sector'}
            >
              <span>{isAr ? 'القطاع التالي' : 'Next Sector'}</span>
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Spots for Focused Sector */}
          <div className="parking-bays-container">
            {focusZoneSpots.map(spot => (
              <div
                key={spot.id}
                id={`spot-card-${spot.id}`}
                className={highlightedSpotId === spot.id ? 'spot-card-highlighted' : ''}
              >
                <SpotCard
                  spot={spot}
                  isAr={isAr}
                  isCurrentUserSpot={currentUser.primarySpot === spot.id}
                  onClick={s => {
                    setBookingError(null);
                    setSelectedSpot(s);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: Expanded Full Grid View */}
      {viewMode === 'grid' && (
        <div
          className="parking-bays-container"
          style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s ease' }}
        >
          {filteredSpots.map(spot => (
            <div
              key={spot.id}
              id={`spot-card-${spot.id}`}
              className={highlightedSpotId === spot.id ? 'spot-card-highlighted' : ''}
            >
              <SpotCard
                spot={spot}
                isAr={isAr}
                isCurrentUserSpot={currentUser.primarySpot === spot.id}
                onClick={s => {
                  setBookingError(null);
                  setSelectedSpot(s);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Spot Details Modal */}
      <SpotDetailsModal
        isOpen={selectedSpot !== null}
        spot={selectedSpot}
        isAr={isAr}
        onClose={() => {
          setBookingError(null);
          setSelectedSpot(null);
        }}
        onBook={handleBookFromModal}
        isBooking={isBookingSpot}
        bookingError={bookingError}
      />

      {/* Digital Pass Modal */}
      <DigitalPassModal
        isOpen={digitalPass !== null}
        passData={digitalPass}
        isAr={isAr}
        onClose={() => setDigitalPass(null)}
        onOpenGate={onOpenGate}
        onCancelBooking={digitalPass?.bookingId ? handleCancelBooking : undefined}
      />
    </div>
  );
};
