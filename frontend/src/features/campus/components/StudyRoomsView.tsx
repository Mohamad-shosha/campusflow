import { useState, useEffect, FC } from 'react';
import {
  DoorClosed,
  Monitor,
  MapPin,
  CheckCircle2,
  Clock,
  Check,
  Calendar,
  Plus,
} from 'lucide-react';
import type { StudyRoom } from '../data/campusData';
import { BookRoomModal } from './BookRoomModal';
import { soundFX } from '../../../shared/utils/sound';

export interface StudyRoomsViewProps {
  rooms: StudyRoom[];
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
  };
  onRoomBooked?: (roomId: string, timeFrom: string, timeTo: string, purpose: string) => void;
}

export const StudyRoomsView: FC<StudyRoomsViewProps> = ({
  rooms,
  isAr,
  currentUser,
  onRoomBooked,
}) => {
  const [countdownMins, setCountdownMins] = useState<number>(14);
  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null);
  const [roomList, setRoomList] = useState<StudyRoom[]>(rooms);

  // Live countdown timer for active lab
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownMins(prev => (prev > 1 ? prev - 1 : 20));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleExtend = (_roomId: string) => {
    soundFX.playSuccess();
    setCountdownMins(prev => prev + 10);
  };

  const handleRelease = (roomId: string) => {
    soundFX.playSuccess();
    setRoomList(prev =>
      prev.map(r =>
        r.id === roomId
          ? {
              ...r,
              status: 'available',
              activeBooking: undefined,
            }
          : r
      )
    );
  };

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

      {/* Hub Header Action */}
      <div className="campus-hub-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="pulse-dot-green"></span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 800 }}>
            {isAr
              ? 'معمل الحاسب 102 مشغول حالياً بجلسة عمل جماعي لـ (إياد وراكان وعبد العزيز)'
              : 'Computer Lab 102 actively in use by student study group'}
          </span>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            soundFX.playClick();
            setSelectedRoom(roomList[1] || roomList[0]);
          }}
          type="button"
        >
          <Plus size={16} color="#ffffff" />
          <span>{isAr ? 'حجز قاعة أو معمل لمجموعتك' : 'Reserve Room / Lab'}</span>
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="rooms-grid">
        {roomList.map(room => {
          const isInUse = room.status === 'in-use';
          const isReserved = room.status === 'reserved';

          return (
            <div key={room.id} className="room-card">
              <div>
                <div className="room-card-head">
                  <span className="room-badge-type">
                    <Monitor size={13} color="var(--fbsu-primary)" />
                    <span>{room.typeBadge}</span>
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

                <h4 className="room-title">{room.name}</h4>
                <div className="room-location-text">
                  <MapPin size={13} color="var(--text-dim)" />
                  <span>
                    {room.building} • {isAr ? 'سعة: ' : 'Cap: '}
                    <strong>{room.capacity}</strong>
                  </span>
                </div>

                {/* Active countdown for in-use room */}
                {isInUse && room.activeBooking && (
                  <div className="room-active-timer-box">
                    <div className="timer-header-flex">
                      <span className="timer-team-label">{room.activeBooking.purpose}</span>
                      <span className="countdown-digits">
                        09:00 - 09:20 ({countdownMins} {isAr ? 'د متبقية' : 'min left'})
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
                        {room.activeBooking.teamMembers
                          ? room.activeBooking.teamMembers.join(' • ')
                          : room.activeBooking.teamLead}
                      </strong>
                    </div>

                    <div className="timer-progress-track">
                      <div
                        className="timer-progress-fill"
                        style={{ width: `${Math.min(100, (countdownMins / 20) * 100)}%` }}
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
                      <span>{isAr ? 'وقت الدخول: 09:00 ص' : 'Start: 09:00 AM'}</span>
                      <span style={{ color: '#f43f5e', fontWeight: 800 }}>
                        {isAr ? 'موعد الخروج الإلزامي: 09:20 ص' : 'Exit: 09:20 AM'}
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
                  {room.specs &&
                    room.specs.map((spec: string, sIdx: number) => (
                      <div key={sIdx} className="room-spec-item">
                        <CheckCircle2 size={13} color="var(--status-available)" />
                        <span>{spec}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {isInUse ? (
                  <>
                    <button
                      className="btn-outline extend-lab-time-btn"
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
        currentUser={currentUser}
        onClose={() => setSelectedRoom(null)}
        onConfirm={(rId, tFrom, tTo, purp) => {
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
        }}
      />
    </div>
  );
};
