import { useState, useEffect, useMemo, FC } from 'react';
import {
  DoorClosed,
  FlaskConical,
  MapPin,
  CheckCircle2,
  Clock,
  Check,
  Calendar,
  Plus,
  AlertCircle,
  Search,
  RotateCw,
  Users,
  Sparkles,
  X,
  LayoutGrid,
  Table as TableIcon,
  Building2,
  Info,
} from 'lucide-react';
import type { StudyRoom } from '../data/campusData';
import { BookRoomModal } from './BookRoomModal';
import { roomsApi } from '../api/roomsApi';
import { soundFX } from '../../../shared/utils/sound';
import {
  ROOM_KINDS,
  ROOM_KIND_LABELS,
  type RoomKind,
  collectLocations,
  getRoomKind,
  getRoomLocation,
  matchesRoomQuery,
} from '../utils/roomTaxonomy';

export interface StudyRoomsViewProps {
  rooms: StudyRoom[];
  /** True while the initial rooms request is in flight */
  isLoading?: boolean | undefined;
  isAr: boolean;
  isAuthenticated?: boolean | undefined;
  currentUser: {
    id: string;
    name: string;
  };
  onOpenAuth?: (() => void) | undefined;
  onRoomBooked?: (
    roomId: string,
    timeFrom: string,
    timeTo: string,
    purpose: string,
    updatedRoom?: StudyRoom
  ) => void;
  onRoomUpdated?: (updatedRoom: StudyRoom) => void;
}

type LabViewMode = 'grid' | 'table' | 'colleges';

export const StudyRoomsView: FC<StudyRoomsViewProps> = ({
  rooms,
  isLoading = false,
  isAr,
  isAuthenticated = false,
  currentUser,
  onOpenAuth = () => {},
  onRoomBooked,
  onRoomUpdated,
}) => {
  const [roomList, setRoomList] = useState<StudyRoom[]>(rooms);
  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [countdownMap, setCountdownMap] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeKind, setActiveKind] = useState<RoomKind | 'all'>('all');
  const [activeLocation, setActiveLocation] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<LabViewMode>('grid');

  useEffect(() => {
    setRoomList(rooms);
    const initialCounts: Record<string, number> = {};
    rooms.forEach(r => {
      if (r.activeBooking) {
        initialCounts[r.id] = r.activeBooking.remainingMinutes ?? 15;
      }
    });
    setCountdownMap(initialCounts);
  }, [rooms]);

  const handleSyncRooms = async () => {
    setIsSyncing(true);
    setActionError(null);
    try {
      const live = await roomsApi.getRooms();
      if (live && live.length > 0) {
        setRoomList(live);
        soundFX.playSuccess();
      }
    } catch {
      setActionError(isAr ? 'تعذر مزامنة بيانات المعامل من الخادم.' : 'Unable to sync live rooms.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Filters are derived from the room data itself (code prefix, type, building)
  const filteredRooms = useMemo(
    () =>
      roomList.filter(room => {
        if (activeKind !== 'all' && getRoomKind(room) !== activeKind) return false;
        if (activeLocation !== 'all' && getRoomLocation(room).key !== activeLocation) return false;
        if (onlyAvailable && room.status !== 'available') return false;
        return matchesRoomQuery(room, searchQuery);
      }),
    [roomList, activeKind, activeLocation, onlyAvailable, searchQuery]
  );

  const locations = useMemo(() => collectLocations(roomList), [roomList]);

  const stats = useMemo(() => {
    const byKind: Record<RoomKind, number> = { lab: 0, room: 0, pod: 0 };
    let available = 0;
    let inUse = 0;
    roomList.forEach(room => {
      byKind[getRoomKind(room)] += 1;
      if (room.status === 'available') available += 1;
      if (room.status === 'in-use') inUse += 1;
    });
    return { byKind, available, inUse };
  }, [roomList]);

  // Grouped by building / college, preserving first-seen order
  const locationGroups = useMemo(() => {
    const groups = new Map<string, { key: string; ar: string; en: string; rooms: StudyRoom[] }>();
    filteredRooms.forEach(room => {
      const loc = getRoomLocation(room);
      const key = loc.key || 'other';
      const group = groups.get(key);
      if (group) group.rooms.push(room);
      else
        groups.set(key, {
          key,
          ar: loc.ar || 'أخرى',
          en: loc.en || 'Other',
          rooms: [room],
        });
    });
    return Array.from(groups.values());
  }, [filteredRooms]);

  // Live countdown timer for active sessions
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownMap(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if ((next[k] ?? 0) > 1) {
            next[k] = (next[k] ?? 0) - 1;
          }
        });
        return next;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleExtend = async (roomId: string) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    setActionError(null);
    const targetRoom = roomList.find(r => r.id === roomId);
    const bookingId = targetRoom?.activeBooking?.bookingId;

    // Without a real booking id there is nothing to extend; never fake the result
    if (!bookingId) {
      soundFX.playError();
      setActionError(
        isAr
          ? 'لا يوجد حجز مسجل في الخادم لهذه الجلسة. حدّث الصفحة وحاول مجدداً.'
          : 'This session has no booking record on the server. Refresh and try again.'
      );
      return;
    }

    setIsProcessing(true);
    try {
      const updated = await roomsApi.extendBooking(bookingId);
      soundFX.playSuccess();
      setRoomList(prev => prev.map(r => (r.id === roomId ? updated : r)));
      setCountdownMap(prev => ({ ...prev, [roomId]: (prev[roomId] ?? 10) + 10 }));
      onRoomUpdated?.(updated);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setActionError(
        detail || (isAr ? 'تعذر تمديد وقت الجلسة.' : 'Unable to extend study room session.')
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRelease = async (roomId: string) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    setActionError(null);
    const targetRoom = roomList.find(r => r.id === roomId);
    const bookingId = targetRoom?.activeBooking?.bookingId;

    // Without a real booking id there is nothing to release; never fake the result
    if (!bookingId) {
      soundFX.playError();
      setActionError(
        isAr
          ? 'لا يوجد حجز مسجل في الخادم لهذه الجلسة. حدّث الصفحة وحاول مجدداً.'
          : 'This session has no booking record on the server. Refresh and try again.'
      );
      return;
    }

    setIsProcessing(true);
    try {
      const updated = await roomsApi.releaseBooking(bookingId);
      soundFX.playSuccess();
      setRoomList(prev => prev.map(r => (r.id === roomId ? updated : r)));
      onRoomUpdated?.(updated);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setActionError(detail || (isAr ? 'تعذر إخلاء القاعة.' : 'Unable to release study room.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const kindIcon = (kind: RoomKind) =>
    kind === 'lab' ? FlaskConical : kind === 'pod' ? DoorClosed : Users;

  const renderStatusBadge = (room: StudyRoom, compact = false) => {
    const isInUse = room.status === 'in-use';
    const isReserved = room.status === 'reserved';
    const isMaintenance = room.status === 'maintenance';
    const remainingMins = countdownMap[room.id] ?? room.activeBooking?.remainingMinutes;
    const cls = isInUse
      ? 'badge-occupied'
      : isReserved
        ? 'badge-flex'
        : isMaintenance
          ? 'badge-faculty'
          : 'badge-available';
    let label: string;
    if (isInUse) {
      label = isAr ? 'مشغول حالياً' : 'In Session';
      if (compact && remainingMins !== undefined) {
        label += isAr ? ` (${remainingMins} د)` : ` (${remainingMins}m)`;
      }
    } else if (isReserved) {
      label = isAr ? 'محجوز' : 'Reserved';
    } else if (isMaintenance) {
      label = isAr ? 'صيانة' : 'Maintenance';
    } else {
      label = isAr ? 'متاح الآن' : 'Available';
    }
    return <span className={`badge ${cls} room-status-badge`}>{label}</span>;
  };

  const renderActions = (room: StudyRoom, compact = false) => {
    if (room.status === 'in-use') {
      return (
        <>
          <button
            className="btn-outline extend-lab-time-btn"
            data-testid={`extend-room-${room.id}`}
            disabled={isProcessing}
            onClick={() => handleExtend(room.id)}
            type="button"
          >
            <Clock size={14} />
            <span>{isAr ? '+10 د' : '+10 min'}</span>
          </button>
          <button
            className="btn-primary release-lab-btn"
            data-testid={`release-room-${room.id}`}
            disabled={isProcessing}
            onClick={() => handleRelease(room.id)}
            type="button"
          >
            <Check size={14} />
            <span>{isAr ? (compact ? 'إخلاء' : 'إخلاء القاعة') : 'Release'}</span>
          </button>
        </>
      );
    }
    return (
      <button
        className="btn-primary book-room-now-btn"
        data-testid={`book-room-btn-${room.id}`}
        disabled={room.status === 'maintenance'}
        onClick={() => {
          soundFX.playClick();
          setSelectedRoom(room);
        }}
        type="button"
      >
        <Calendar size={14} />
        <span>{isAr ? 'احجز الآن' : 'Reserve'}</span>
      </button>
    );
  };

  // Compact resource card — only shows fields that exist in the room data
  const renderLabCard = (room: StudyRoom) => {
    const isInUse = room.status === 'in-use';
    const kind = getRoomKind(room);
    const KindIcon = kindIcon(kind);
    const displayName = isAr ? room.name : room.nameEn || room.name;
    const displayBuilding = isAr ? room.building : room.buildingEn || room.building;
    const displayCapacity = isAr ? room.capacity : room.capacityEn || room.capacity;
    const displayBadge = isAr ? room.typeBadge : room.typeBadgeEn || room.typeBadge;
    const availableFrom = isAr ? room.availableFrom : room.availableFromEn || room.availableFrom;
    const requirementNote = isAr ? room.requirementNote : room.requirementNoteEn;
    const specs = (isAr ? room.specs : room.specsEn?.length ? room.specsEn : room.specs) ?? [];
    const remainingMins = countdownMap[room.id] ?? room.activeBooking?.remainingMinutes;
    const totalMins = room.activeBooking?.totalMinutes;
    const progressPercent =
      remainingMins !== undefined && totalMins
        ? Math.min(100, Math.max(5, (remainingMins / totalMins) * 100))
        : undefined;

    return (
      <article
        key={room.id}
        className={`room-card room-card--${room.status}`}
        data-testid={`room-card-${room.id}`}
      >
        <header className="room-card-head">
          <span className="room-badge-type">
            <KindIcon size={13} />
            <span>{displayBadge}</span>
          </span>
          {renderStatusBadge(room)}
        </header>

        <h4 className="room-title">{displayName}</h4>

        <div className="room-meta">
          <span className="room-meta-item">
            <MapPin size={13} />
            <span>{displayBuilding}</span>
          </span>
          <span className="room-meta-item">
            <Users size={13} />
            <span>{displayCapacity}</span>
          </span>
          {room.roomCode && <span className="room-code-chip">{room.roomCode}</span>}
        </div>

        {isInUse && room.activeBooking ? (
          <div className="room-active-timer-box">
            <div className="timer-header-flex">
              <span className="timer-team-label">{room.activeBooking.purpose}</span>
              {remainingMins !== undefined && (
                <span className="countdown-digits">
                  {remainingMins} {isAr ? 'د' : 'min'}
                </span>
              )}
            </div>
            {progressPercent !== undefined && (
              <div className="timer-progress-track">
                <div className="timer-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            )}
            <div className="room-timer-meta">
              <span>
                {room.activeBooking.timeSlot ||
                  [room.activeBooking.startLabel, room.activeBooking.endLabel]
                    .filter(Boolean)
                    .join(' - ')}
              </span>
              <span className="room-timer-team">
                {room.activeBooking.teamMembers && room.activeBooking.teamMembers.length > 0
                  ? room.activeBooking.teamMembers.join(' • ')
                  : room.activeBooking.teamLead}
              </span>
            </div>
          </div>
        ) : (
          availableFrom &&
          room.status !== 'available' && (
            <div className="room-availability-line">
              <Clock size={13} />
              <span>
                {isAr ? 'متاح من: ' : 'Available from: '}
                <strong>{availableFrom}</strong>
              </span>
            </div>
          )
        )}

        {typeof room.utilizationPercent === 'number' && (
          <div className="room-utilization">
            <span>{isAr ? 'الإشغال' : 'Utilisation'}</span>
            <div className="room-utilization-track">
              <div
                className="room-utilization-fill"
                style={{ width: `${Math.min(100, Math.max(0, room.utilizationPercent))}%` }}
              />
            </div>
            <strong>{room.utilizationPercent}%</strong>
          </div>
        )}

        {requirementNote && (
          <div className="room-requirement-note">
            <Info size={12} />
            <span>{requirementNote}</span>
          </div>
        )}

        {specs.length > 0 && (
          <ul className="room-spec-chips" aria-label={isAr ? 'التجهيزات' : 'Equipment'}>
            {specs.slice(0, 3).map((spec, idx) => (
              <li key={idx} className="room-spec-chip" title={spec}>
                <CheckCircle2 size={12} />
                <span>{spec}</span>
              </li>
            ))}
            {specs.length > 3 && (
              <li className="room-spec-chip room-spec-more" title={specs.slice(3).join('\n')}>
                +{specs.length - 3}
              </li>
            )}
          </ul>
        )}

        <footer className="room-card-actions">{renderActions(room)}</footer>
      </article>
    );
  };

  const activeInUseRoom = roomList.find(r => r.status === 'in-use');
  const hasActiveFilters =
    searchQuery.trim() !== '' || activeKind !== 'all' || activeLocation !== 'all' || onlyAvailable;

  const resetFilters = () => {
    setSearchQuery('');
    setActiveKind('all');
    setActiveLocation('all');
    setOnlyAvailable(false);
  };

  return (
    <div data-testid="study-rooms-view" className="rooms-hub">
      <div className="rooms-hub-head">
        <div>
          <span className="section-eyebrow">
            <DoorClosed size={15} />
            <span>{isAr ? 'المعامل والقاعات الدراسية' : 'Study Rooms & Labs Hub'}</span>
          </span>
          <h3 className="rooms-hub-title">
            {isAr ? 'حجز القاعات والمعامل والمكتبة' : 'Labs, Study Rooms & Library Pods'}
          </h3>
          <p className="rooms-hub-subtitle">
            {activeInUseRoom ? (
              <>
                <span className="pulse-dot-green" />
                {isAr
                  ? `${activeInUseRoom.name} مشغول حالياً بجلسة لـ ${activeInUseRoom.activeBooking?.teamLead || 'الطلاب'}`
                  : `${activeInUseRoom.nameEn || activeInUseRoom.name} is in use by ${activeInUseRoom.activeBooking?.teamLeadEn || activeInUseRoom.activeBooking?.teamLead || 'a student team'}`}
              </>
            ) : isAr ? (
              'احجز مساحة لفريقك بوقت محدد مع عداد تنازلي لضمان الإخلاء في الموعد.'
            ) : (
              'Reserve a space for your team with a fixed time window and live countdown.'
            )}
          </p>
        </div>

        <div className="rooms-hub-head-actions">
          <div
            className="rooms-view-switch"
            role="tablist"
            aria-label={isAr ? 'طريقة العرض' : 'View mode'}
          >
            {(
              [
                { id: 'grid', icon: LayoutGrid, ar: 'بطاقات', en: 'Cards' },
                { id: 'table', icon: TableIcon, ar: 'جدول', en: 'Table' },
                { id: 'colleges', icon: Building2, ar: 'حسب المبنى', en: 'By building' },
              ] as const
            ).map(v => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={viewMode === v.id}
                className={`rooms-view-btn ${viewMode === v.id ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  setViewMode(v.id);
                }}
              >
                <v.icon size={14} />
                <span>{isAr ? v.ar : v.en}</span>
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            data-testid="hub-reserve-room-btn"
            onClick={() => {
              soundFX.playClick();
              const firstAvail = roomList.find(r => r.status === 'available') || roomList[0];
              if (firstAvail) setSelectedRoom(firstAvail);
            }}
            type="button"
          >
            <Plus size={16} />
            <span>{isAr ? 'حجز سريع' : 'Quick Reserve'}</span>
          </button>
        </div>
      </div>

      {/* Live summary computed from the rooms data */}
      <div className="rooms-kpis">
        <div className="rooms-kpi">
          <span className="rooms-kpi-value">{roomList.length}</span>
          <span className="rooms-kpi-label">{isAr ? 'إجمالي المرافق' : 'Facilities'}</span>
        </div>
        <div className="rooms-kpi rooms-kpi--ok">
          <span className="rooms-kpi-value">{stats.available}</span>
          <span className="rooms-kpi-label">{isAr ? 'متاح الآن' : 'Available now'}</span>
        </div>
        <div className="rooms-kpi rooms-kpi--busy">
          <span className="rooms-kpi-value">{stats.inUse}</span>
          <span className="rooms-kpi-label">{isAr ? 'جلسات نشطة' : 'In session'}</span>
        </div>
        {ROOM_KINDS.map(kind => (
          <div key={kind} className="rooms-kpi">
            <span className="rooms-kpi-value">{stats.byKind[kind]}</span>
            <span className="rooms-kpi-label">
              {isAr ? ROOM_KIND_LABELS[kind].ar : ROOM_KIND_LABELS[kind].en}
            </span>
          </div>
        ))}
      </div>

      {actionError && (
        <div data-testid="study-rooms-error-banner" className="rooms-error-banner" role="alert">
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Search & filters */}
      <div className="rooms-toolbar">
        <div className="rooms-toolbar-row">
          <div className="rooms-search">
            <Search size={16} className="rooms-search-icon" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label={isAr ? 'بحث في المعامل والقاعات' : 'Search rooms and labs'}
              placeholder={
                isAr
                  ? 'ابحث بالاسم أو الرمز أو المبنى أو التجهيزات...'
                  : 'Search by name, code, building or equipment...'
              }
            />
            {searchQuery && (
              <button
                type="button"
                className="rooms-search-clear"
                aria-label={isAr ? 'مسح البحث' : 'Clear search'}
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <label className="rooms-toggle">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={e => setOnlyAvailable(e.target.checked)}
            />
            <span>{isAr ? 'المتاح فقط' : 'Available only'}</span>
          </label>

          <div className="rooms-toolbar-meta">
            <span>
              {isAr
                ? `${filteredRooms.length} من ${roomList.length}`
                : `${filteredRooms.length} of ${roomList.length}`}
            </span>
            <button
              type="button"
              className="btn-glass rooms-sync-btn"
              onClick={handleSyncRooms}
              disabled={isSyncing}
              title={isAr ? 'تحديث من الخادم' : 'Refresh from server'}
            >
              <RotateCw size={14} className={isSyncing ? 'spin-anim' : ''} />
              <span>
                {isAr
                  ? isSyncing
                    ? 'جاري التحديث...'
                    : 'تحديث'
                  : isSyncing
                    ? 'Syncing...'
                    : 'Refresh'}
              </span>
            </button>
          </div>
        </div>

        <div
          className="rooms-filter-group"
          role="group"
          aria-label={isAr ? 'نوع المرفق' : 'Facility type'}
        >
          <button
            type="button"
            className={`rooms-chip ${activeKind === 'all' ? 'active' : ''}`}
            onClick={() => setActiveKind('all')}
          >
            <Sparkles size={13} />
            <span>{isAr ? 'الكل' : 'All'}</span>
            <span className="rooms-chip-count">{roomList.length}</span>
          </button>
          {ROOM_KINDS.filter(kind => stats.byKind[kind] > 0).map(kind => {
            const Icon = kindIcon(kind);
            return (
              <button
                key={kind}
                type="button"
                className={`rooms-chip ${activeKind === kind ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  setActiveKind(kind);
                }}
              >
                <Icon size={13} />
                <span>{isAr ? ROOM_KIND_LABELS[kind].ar : ROOM_KIND_LABELS[kind].en}</span>
                <span className="rooms-chip-count">{stats.byKind[kind]}</span>
              </button>
            );
          })}
        </div>

        {locations.length > 1 && (
          <div
            className="rooms-filter-group rooms-filter-group--sub"
            role="group"
            aria-label={isAr ? 'المبنى' : 'Building'}
          >
            <span className="rooms-filter-label">
              <Building2 size={13} />
              {isAr ? 'المبنى:' : 'Building:'}
            </span>
            <button
              type="button"
              className={`rooms-chip rooms-chip--sm ${activeLocation === 'all' ? 'active' : ''}`}
              onClick={() => setActiveLocation('all')}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
            {locations.map(loc => (
              <button
                key={loc.key}
                type="button"
                className={`rooms-chip rooms-chip--sm ${activeLocation === loc.key ? 'active' : ''}`}
                onClick={() => setActiveLocation(loc.key)}
              >
                <span>{isAr ? loc.ar : loc.en}</span>
                <span className="rooms-chip-count">{loc.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading && roomList.length === 0 && (
        <div className="rooms-grid" aria-busy="true" data-testid="rooms-loading">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="room-card room-card-skeleton" />
          ))}
        </div>
      )}

      {!isLoading && filteredRooms.length === 0 && (
        <div className="rooms-empty">
          <Search size={28} />
          <h4>
            {roomList.length === 0
              ? isAr
                ? 'لا توجد مرافق متاحة حالياً'
                : 'No facilities loaded yet'
              : isAr
                ? 'لا توجد نتائج مطابقة'
                : 'No rooms or labs match your filters'}
          </h4>
          {roomList.length === 0 ? (
            <button
              type="button"
              className="btn-outline"
              onClick={handleSyncRooms}
              disabled={isSyncing}
            >
              <RotateCw size={14} />
              <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
            </button>
          ) : (
            hasActiveFilters && (
              <button type="button" className="btn-outline" onClick={resetFilters}>
                {isAr ? 'مسح عوامل التصفية' : 'Reset filters'}
              </button>
            )
          )}
        </div>
      )}

      {viewMode === 'table' && filteredRooms.length > 0 && (
        <div className="rooms-table-wrap">
          <table className="rooms-table">
            <thead>
              <tr>
                <th>{isAr ? 'المرفق' : 'Facility'}</th>
                <th>{isAr ? 'الموقع' : 'Location'}</th>
                <th>{isAr ? 'السعة' : 'Capacity'}</th>
                <th>{isAr ? 'الحالة' : 'Status'}</th>
                <th>{isAr ? 'متاح من' : 'Next free'}</th>
                <th className="rooms-table-actions-col">{isAr ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map(room => {
                const displayName = isAr ? room.name : room.nameEn || room.name;
                const displayBuilding = isAr ? room.building : room.buildingEn || room.building;
                const displayCapacity = isAr ? room.capacity : room.capacityEn || room.capacity;
                const availableFrom =
                  room.status === 'available'
                    ? isAr
                      ? 'الآن'
                      : 'Now'
                    : (isAr ? room.availableFrom : room.availableFromEn || room.availableFrom) ||
                      '—';
                return (
                  <tr key={room.id} data-testid={`room-card-${room.id}`}>
                    <td>
                      <div className="rooms-table-name">
                        {room.roomCode && <span className="room-code-chip">{room.roomCode}</span>}
                        <strong>{displayName}</strong>
                      </div>
                    </td>
                    <td className="rooms-table-dim">{displayBuilding}</td>
                    <td className="rooms-table-dim">{displayCapacity}</td>
                    <td>{renderStatusBadge(room, true)}</td>
                    <td className="rooms-table-dim">{availableFrom}</td>
                    <td className="rooms-table-actions-col">
                      <div className="rooms-table-actions">{renderActions(room, true)}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'colleges' && filteredRooms.length > 0 && (
        <div className="rooms-groups">
          {locationGroups.map(group => (
            <section key={group.key} className="rooms-group">
              <header className="rooms-group-head">
                <Building2 size={16} />
                <h4>{isAr ? group.ar : group.en}</h4>
                <span className="rooms-group-count">
                  {group.rooms.length} {isAr ? 'مرافق' : 'facilities'}
                </span>
              </header>
              <div className="rooms-grid">{group.rooms.map(room => renderLabCard(room))}</div>
            </section>
          ))}
        </div>
      )}

      {viewMode === 'grid' && filteredRooms.length > 0 && (
        <div className="rooms-grid">{filteredRooms.map(room => renderLabCard(room))}</div>
      )}

      <BookRoomModal
        isOpen={selectedRoom !== null}
        room={selectedRoom}
        isAr={isAr}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onClose={() => setSelectedRoom(null)}
        onOpenAuth={onOpenAuth}
        onConfirm={(rId, tFrom, tTo, purp, updated) => {
          // Only the server's booked room is applied; no locally invented booking
          if (updated) {
            setRoomList(prev => prev.map(r => (r.id === rId ? updated : r)));
            onRoomUpdated?.(updated);
          }
          onRoomBooked?.(rId, tFrom, tTo, purp, updated);
        }}
      />
    </div>
  );
};
