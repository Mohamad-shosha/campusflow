import { useState, useEffect, useMemo, FC } from 'react';
import {
  DoorClosed,
  Monitor,
  MapPin,
  CheckCircle2,
  Clock,
  Check,
  Calendar,
  Plus,
  AlertCircle,
  Search,
  RotateCw,
  Cpu,
  ShieldCheck,
  Terminal,
  Users,
  Sparkles,
  X,
} from 'lucide-react';
import type { StudyRoom } from '../data/campusData';
import { BookRoomModal } from './BookRoomModal';
import { roomsApi } from '../api/roomsApi';
import { soundFX } from '../../../shared/utils/sound';

export interface StudyRoomsViewProps {
  rooms: StudyRoom[];
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

export const StudyRoomsView: FC<StudyRoomsViewProps> = ({
  rooms,
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
  const [activeCategory, setActiveCategory] = useState<string>('all');

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

  // Filtered rooms based on Category and Search Query
  const filteredRooms = useMemo(() => {
    return roomList.filter(room => {
      // Category match
      if (activeCategory !== 'all') {
        const code = room.roomCode || room.id;
        if (
          activeCategory === 'software' &&
          !code.startsWith('LAB-101') &&
          !code.startsWith('LAB-102')
        ) {
          return false;
        }
        if (activeCategory === 'cyber' && !code.startsWith('LAB-103')) {
          return false;
        }
        if (
          activeCategory === 'hardware' &&
          !code.startsWith('LAB-104') &&
          !code.startsWith('LAB-205')
        ) {
          return false;
        }
        if (activeCategory === 'discussion' && !code.startsWith('ROOM-')) {
          return false;
        }
        if (activeCategory === 'focus' && !code.startsWith('POD-')) {
          return false;
        }
      }

      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch =
          (room.name && room.name.toLowerCase().includes(q)) ||
          (room.nameEn && room.nameEn.toLowerCase().includes(q));
        const codeMatch =
          (room.roomCode && room.roomCode.toLowerCase().includes(q)) ||
          room.id.toLowerCase().includes(q);
        const bldgMatch =
          (room.building && room.building.toLowerCase().includes(q)) ||
          (room.buildingEn && room.buildingEn.toLowerCase().includes(q));
        const specsMatch =
          (room.specs && room.specs.some(s => s.toLowerCase().includes(q))) ||
          (room.specsEn && room.specsEn.some(s => s.toLowerCase().includes(q)));
        return nameMatch || codeMatch || bldgMatch || specsMatch;
      }

      return true;
    });
  }, [roomList, activeCategory, searchQuery]);

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

    if (!bookingId) {
      // Mock / fallback
      soundFX.playSuccess();
      setCountdownMap(prev => ({ ...prev, [roomId]: (prev[roomId] ?? 10) + 10 }));
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

    if (!bookingId) {
      // Mock / fallback
      soundFX.playSuccess();
      setRoomList(prev =>
        prev.map(r =>
          r.id === roomId ? { ...r, status: 'available', activeBooking: undefined } : r
        )
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

  const activeInUseRoom = roomList.find(r => r.status === 'in-use');

  return (
    <div data-testid="study-rooms-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <DoorClosed size={16} color="var(--fbsu-gold)" />
          <span>{isAr ? 'المعامل والقاعات الدراسية' : 'Study Rooms & Labs Hub'}</span>
        </span>
        <h3 className="section-title">
          {isAr
            ? 'حجز القاعات والمعامل الطلابية للعمل الجماعي'
            : 'FBSU Interactive Study Pods & Specialized Labs'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'مساحات عمل جماعية ومجهزة للطلاب لإنجاز المهام والتكاليف (Classwork, Assignment, Homework). يتم الحجز بوقت دقيق ومحدد (مثلاً من 09:00 ص إلى 09:20 ص) مع عداد تنازلي نشط لضمان إخلاء المعمل في الموعد المحدد!'
            : 'Collaborative spaces for students to finish Classwork, Assignments & Homework with precise reservation windows (e.g. 09:00 to 09:20 AM) and live countdowns!'}
        </p>
      </div>

      {actionError && (
        <div
          data-testid="study-rooms-error-banner"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244,63,94,0.12)',
            border: '1px solid rgba(244,63,94,0.35)',
            color: '#fda4af',
            fontSize: '0.86rem',
            fontWeight: 700,
          }}
        >
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Hub Header Action */}
      <div className="campus-hub-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="pulse-dot-green"></span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 800 }}>
            {activeInUseRoom
              ? isAr
                ? `${activeInUseRoom.name} مشغول حالياً بجلسة عمل جماعي لـ (${activeInUseRoom.activeBooking?.teamLead || 'الطلاب'})`
                : `${activeInUseRoom.nameEn || activeInUseRoom.name} actively in use by ${activeInUseRoom.activeBooking?.teamLeadEn || activeInUseRoom.activeBooking?.teamLead || 'student team'}`
              : isAr
                ? 'جميع القاعات والمعامل جاهزة ومتاحة للحجز الفوري'
                : 'All study pods and specialized labs are ready for immediate reservation'}
          </span>
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
          <Plus size={16} color="#ffffff" />
          <span>{isAr ? 'حجز قاعة أو معمل لمجموعتك' : 'Reserve Room / Lab'}</span>
        </button>
      </div>

      {/* Search, Filter Toolbar & Live Sync */}
      <div
        className="rooms-search-filter-bar"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1.1rem 1.25rem',
          background: 'var(--surface-card, rgba(11, 59, 54, 0.25))',
          borderRadius: 'var(--radius-lg, 14px)',
          border: '1px solid var(--border-subtle, rgba(215, 162, 55, 0.2))',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search Input Box */}
          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '480px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                [isAr ? 'right' : 'left']: '0.85rem',
                color: 'var(--text-dim, #94a3b8)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث باسم المعمل، الرمز (LAB-101)، التجهيزات (RTX 4090، Cisco)...'
                  : 'Search by room code, name, or equipment (RTX 4090, Cisco)...'
              }
              style={{
                width: '100%',
                padding: '0.65rem 2.4rem',
                background: 'rgba(2, 35, 31, 0.65)',
                border: '1px solid rgba(215, 162, 55, 0.25)',
                borderRadius: '8px',
                color: 'var(--text-main, #f8fafc)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  [isAr ? 'left' : 'right']: '0.75rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: 2,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sync Button & Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{ fontSize: '0.82rem', color: 'var(--text-dim, #94a3b8)', fontWeight: 600 }}
            >
              {isAr
                ? `عرض ${filteredRooms.length} من ${roomList.length} مرفق`
                : `Showing ${filteredRooms.length} of ${roomList.length} facilities`}
            </span>
            <button
              type="button"
              className="btn-glass"
              onClick={handleSyncRooms}
              disabled={isSyncing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.9rem',
                fontSize: '0.8rem',
              }}
              title={isAr ? 'تحديث فوري من قاعدة بيانات PostgreSQL' : 'Sync live with PostgreSQL'}
            >
              <RotateCw size={14} className={isSyncing ? 'spin-anim' : ''} />
              <span>
                {isAr
                  ? isSyncing
                    ? 'جاري المزامنة...'
                    : 'تحديث مباشر'
                  : isSyncing
                    ? 'Syncing...'
                    : 'Live Sync'}
              </span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}
        >
          {[
            {
              id: 'all',
              labelAr: `الكل (${roomList.length})`,
              labelEn: `All (${roomList.length})`,
              icon: Sparkles,
            },
            {
              id: 'software',
              labelAr: 'معامل البرمجيات و AI',
              labelEn: 'Software & AI Labs',
              icon: Terminal,
            },
            { id: 'cyber', labelAr: 'أمن سيبراني NOC', labelEn: 'Cyber & NOC', icon: ShieldCheck },
            {
              id: 'hardware',
              labelAr: 'عتاد وروبوتات ودوائر',
              labelEn: 'Robotics & Hardware',
              icon: Cpu,
            },
            {
              id: 'discussion',
              labelAr: 'قاعات عمل ونقاش جماعي',
              labelEn: 'Discussion Pods',
              icon: Users,
            },
            {
              id: 'focus',
              labelAr: 'كبائن تركيز ومقابلات',
              labelEn: 'Quiet & Interview Pods',
              icon: DoorClosed,
            },
          ].map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setActiveCategory(cat.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isActive
                    ? '1px solid var(--fbsu-gold, #d7a237)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isActive ? 'rgba(215, 162, 55, 0.18)' : 'rgba(11, 59, 54, 0.25)',
                  color: isActive ? 'var(--fbsu-gold, #d7a237)' : 'var(--text-dim, #94a3b8)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={13} />
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State when filter yields 0 matches */}
      {filteredRooms.length === 0 && (
        <div
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            background: 'rgba(11, 59, 54, 0.15)',
            border: '1px dashed rgba(215, 162, 55, 0.3)',
            borderRadius: 'var(--radius-lg, 14px)',
            marginBottom: '2rem',
          }}
        >
          <Search
            size={36}
            color="var(--fbsu-gold)"
            style={{ margin: '0 auto 1rem', opacity: 0.7 }}
          />
          <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            {isAr
              ? 'لم يتم العثور على أي قاعة أو معمل يطابق بحثك'
              : 'No study rooms or labs match your criteria'}
          </h4>
          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: '0.85rem',
              maxWidth: '420px',
              margin: '0 auto 1.25rem',
            }}
          >
            {isAr
              ? 'جرّب البحث بكلمات أخرى أو اختر قطاعاً مختلفاً من التصنيفات أعلاه.'
              : 'Try different keywords or clear the category filters to see all available campus spaces.'}
          </p>
          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          >
            {isAr ? 'عرض جميع المعامل والقاعات' : 'Reset All Filters'}
          </button>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="rooms-grid">
        {filteredRooms.map(room => {
          const isInUse = room.status === 'in-use';
          const isReserved = room.status === 'reserved';
          const displayName = isAr ? room.name : room.nameEn || room.name;
          const displayBuilding = isAr ? room.building : room.buildingEn || room.building;
          const displayCapacity = isAr ? room.capacity : room.capacityEn || room.capacity;
          const displayBadge = isAr ? room.typeBadge : room.typeBadgeEn || room.typeBadge;
          const remainingMins = countdownMap[room.id] ?? room.activeBooking?.remainingMinutes ?? 15;
          const totalMins = room.activeBooking?.totalMinutes ?? 20;
          const progressPercent = Math.min(100, Math.max(5, (remainingMins / totalMins) * 100));

          return (
            <div key={room.id} className="room-card" data-testid={`room-card-${room.id}`}>
              <div>
                <div className="room-card-head">
                  <span className="room-badge-type">
                    <Monitor size={13} color="var(--fbsu-primary)" />
                    <span>{displayBadge}</span>
                  </span>

                  <span
                    className={`badge ${
                      isInUse ? 'badge-occupied' : isReserved ? 'badge-flex' : 'badge-available'
                    }`}
                  >
                    {isInUse
                      ? isAr
                        ? 'مشغول حالياً (جلسة نشطة)'
                        : 'In Session'
                      : isReserved
                        ? isAr
                          ? 'محجوز'
                          : 'Reserved'
                        : isAr
                          ? 'شاغر ومتاح الآن'
                          : 'Available Now'}
                  </span>
                </div>

                <h4 className="room-title">{displayName}</h4>
                <div className="room-location-text">
                  <MapPin size={13} color="var(--text-dim)" />
                  <span>
                    {displayBuilding} • {isAr ? 'سعة: ' : 'Cap: '}
                    <strong>{displayCapacity}</strong>
                  </span>
                </div>

                {/* Active countdown for in-use room */}
                {isInUse && room.activeBooking && (
                  <div className="room-active-timer-box">
                    <div className="timer-header-flex">
                      <span className="timer-team-label">{room.activeBooking.purpose}</span>
                      <span className="countdown-digits">
                        {room.activeBooking.timeSlot ||
                          `${room.activeBooking.startLabel} - ${room.activeBooking.endLabel}`}{' '}
                        ({remainingMins} {isAr ? 'د متبقية' : 'min left'})
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {isAr ? 'المجموعة:' : 'Team:'}{' '}
                      <strong>
                        {room.activeBooking.teamMembers && room.activeBooking.teamMembers.length > 0
                          ? room.activeBooking.teamMembers.join(' • ')
                          : room.activeBooking.teamLead}
                      </strong>
                    </div>

                    <div className="timer-progress-track">
                      <div
                        className="timer-progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.72rem',
                        color: 'var(--text-dim)',
                      }}
                    >
                      <span>
                        {isAr
                          ? `وقت الدخول: ${room.activeBooking.startLabel || '09:00 ص'}`
                          : `Start: ${room.activeBooking.startLabel || '09:00 AM'}`}
                      </span>
                      <span style={{ color: '#f43f5e', fontWeight: 800 }}>
                        {isAr
                          ? `موعد الخروج: ${room.activeBooking.endLabel || '09:20 ص'}`
                          : `Exit: ${room.activeBooking.endLabel || '09:20 AM'}`}
                      </span>
                    </div>
                  </div>
                )}

                {!isInUse && !isReserved && (
                  <div className="room-active-timer-box timer-available">
                    <div className="timer-header-flex">
                      <span
                        className="timer-team-label"
                        style={{ color: 'var(--status-available)' }}
                      >
                        {isAr ? 'القاعة جاهزة للحجز الفوري' : 'Pod Ready For Immediate Use'}
                      </span>
                      <span className="countdown-digits avail">{isAr ? 'متاحة' : 'Open'}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {isAr
                        ? 'يمكنك حجزها الآن لأداء واجباتك مع زملائك وتحديد وقت الخروج بدقة.'
                        : 'Book for teamwork with your peers with fixed departure time.'}
                    </div>
                  </div>
                )}

                {/* Specs List */}
                <div
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    color: 'var(--text-dim)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {isAr ? 'التجهيزات والتقنيات المتوفرة:' : 'Included Tech & Equipment:'}
                </div>
                <div className="room-specs-list">
                  {(isAr ? room.specs : room.specsEn || room.specs)?.map(
                    (spec: string, sIdx: number) => (
                      <div key={sIdx} className="room-spec-item">
                        <CheckCircle2 size={13} color="var(--status-available)" />
                        <span>{spec}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {isInUse ? (
                  <>
                    <button
                      className="btn-outline extend-lab-time-btn"
                      data-testid={`extend-room-${room.id}`}
                      disabled={isProcessing}
                      onClick={() => handleExtend(room.id)}
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        padding: '0.75rem',
                        fontSize: '0.8rem',
                      }}
                      type="button"
                    >
                      <Clock size={14} />
                      <span>{isAr ? 'تمديد 10 د' : '+10 Mins'}</span>
                    </button>
                    <button
                      className="btn-primary release-lab-btn"
                      data-testid={`release-room-${room.id}`}
                      disabled={isProcessing}
                      onClick={() => handleRelease(room.id)}
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        padding: '0.75rem',
                        fontSize: '0.8rem',
                        background: 'var(--status-available)',
                        borderColor: 'var(--status-available)',
                      }}
                      type="button"
                    >
                      <Check size={14} />
                      <span>{isAr ? 'إخلاء المعمل الآن' : 'Release Lab'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-primary book-room-now-btn"
                    data-testid={`book-room-btn-${room.id}`}
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedRoom(room);
                    }}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.85rem',
                      fontSize: '0.88rem',
                    }}
                    type="button"
                  >
                    <Calendar size={16} color="#ffffff" />
                    <span>{isAr ? 'حجز هذه القاعة لمجموعتك' : 'Book Room for Your Team'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <BookRoomModal
        isOpen={selectedRoom !== null}
        room={selectedRoom}
        isAr={isAr}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onClose={() => setSelectedRoom(null)}
        onOpenAuth={onOpenAuth}
        onConfirm={(rId, tFrom, tTo, purp, updated) => {
          if (updated) {
            setRoomList(prev => prev.map(r => (r.id === rId ? updated : r)));
            onRoomBooked?.(rId, tFrom, tTo, purp, updated);
            onRoomUpdated?.(updated);
          } else {
            setRoomList(prev =>
              prev.map(r =>
                r.id === rId
                  ? {
                      ...r,
                      status: 'in-use',
                      activeBooking: {
                        teamLead: currentUser.name,
                        teamMembers: [currentUser.name],
                        purpose: purp,
                        timeSlot: `${tFrom} - ${tTo}`,
                      },
                    }
                  : r
              )
            );
            onRoomBooked?.(rId, tFrom, tTo, purp);
          }
        }}
      />
    </div>
  );
};
