import { useState, FC } from 'react';
import { UserCheck, Bell, MapPin, Calendar } from 'lucide-react';
import type { FacultyMember } from '../data/campusData';
import { BookOfficeHoursModal } from './BookOfficeHoursModal';
import { soundFX } from '../../../shared/utils/sound';

export interface OfficeHoursViewProps {
  facultyList: FacultyMember[];
  isAr: boolean;
  isAuthenticated?: boolean | undefined;
  currentUser: {
    id: string;
    name: string;
  };
  onOpenAuth?: (() => void) | undefined;
  onBookSuccess?: (
    facultyId: string,
    slotTime: string,
    notes: string,
    updatedFaculty?: FacultyMember
  ) => void;
}

export const OfficeHoursView: FC<OfficeHoursViewProps> = ({
  facultyList,
  isAr,
  isAuthenticated = false,
  currentUser,
  onOpenAuth = () => {},
  onBookSuccess,
}) => {
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [preselectedSlotTime, setPreselectedSlotTime] = useState<string | undefined>(undefined);

  const handleOpenModal = (f: FacultyMember, slotTime?: string) => {
    soundFX.playClick();
    setPreselectedSlotTime(slotTime);
    setSelectedFaculty(f);
  };

  return (
    <div data-testid="office-hours-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <UserCheck size={16} color="var(--fbsu-gold)" />
          <span>{isAr ? 'الساعات المكتبية والتواصل الأكاديمي' : 'Faculty Office Hours'}</span>
        </span>
        <h3 className="section-title">
          {isAr
            ? 'حجز الساعات المكتبية للعمداء ورؤساء الأقسام'
            : 'FBSU Academic Leadership & Faculty Office Hours'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'احجز موعداً مباشراً في الساعات المكتبية لرئيسة قسم كلية الحاسبات (د. رغد النفيعي) أو عميد كلية الحاسب (د. محمد مزهر) لمناقشة مشروع التخرج أو استفسار مادة Logic Design. يرسل النظام إشعاراً فورياً للعميد أو رئيسة القسم بالموعد وتفاصيل الطالب!'
            : 'Book an office hour slot with Chairperson Dr. Raghad Al-Nefaie or Dean Dr. Mohammad Mezher for project reviews or Logic Design questions with instant notifications!'}
        </p>
      </div>

      {/* Direct Notification Alert Banner */}
      <div className="direct-alert-banner">
        <Bell size={18} color="var(--fbsu-gold)" />
        <div>
          <strong>{isAr ? 'إشعار فوري مباشر:' : 'Instant Direct Notification:'}</strong>
          {isAr
            ? ' فور تأكيد حجزك، يرسل النظام تنبيهاً مباشراً مع بيانات الطالب والموضوع إلى لوحة رئيسة القسم د. رغد النفيعي أو العميد د. محمد مزهر.'
            : ' Instant alert is dispatched to the Dean or Dept Chair dashboard upon booking confirmation.'}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="faculty-grid">
        {facultyList.map(f => {
          const displayName = isAr ? f.name : f.nameEn || f.name;
          const displayBadge = isAr ? f.badge : f.badgeEn || f.badge;
          const displayRank = isAr ? f.rank : f.rankEn || f.rank;
          const displayDays = isAr ? f.daysText : f.daysTextEn || f.daysText;
          const displayNext = isAr ? f.nextAvailable : f.nextAvailableEn || f.nextAvailable;
          const avatarChar = f.name.split(' ')[1] ? f.name.split(' ')[1]!.charAt(0) : 'د';

          return (
            <div key={f.id} className="faculty-card" data-testid={`faculty-card-${f.id}`}>
              <div>
                <div className="faculty-header-pod">
                  <div className="faculty-avatar-circle" style={{ background: f.avatarColor }}>
                    {avatarChar}
                  </div>
                  <div className="faculty-meta-col">
                    <span className="faculty-rank-badge">{displayBadge}</span>
                    <h4 className="faculty-name">{displayName}</h4>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        fontWeight: 700,
                        marginBottom: '0.25rem',
                      }}
                    >
                      {displayRank}
                    </div>
                    <div className="faculty-office-location">
                      <MapPin size={13} color="var(--fbsu-primary)" />
                      <span>{f.office}</span>
                    </div>
                  </div>
                </div>

                {/* Supervised courses */}
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: 'var(--text-dim)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {isAr ? 'المقررات والمجالات المتاحة للنقاش:' : 'Supervised Topics & Courses:'}
                </div>
                <div className="faculty-subjects-tag-list">
                  {f.coursesSupervised.map((subj, idx) => (
                    <span key={idx} className="faculty-subject-chip">
                      {subj}
                    </span>
                  ))}
                </div>

                {/* Slots container */}
                <div className="slots-container-card">
                  <div className="slots-subhead">
                    <span>
                      {isAr ? 'مواعيد الساعات المكتبية:' : 'Office Hours Available:'} {displayDays}
                    </span>
                    <span style={{ color: 'var(--status-available)', fontWeight: 800 }}>
                      {displayNext}
                    </span>
                  </div>

                  <div className="time-slots-picker-grid">
                    {f.timeSlots.map((slot, sIdx) => (
                      <button
                        key={slot.id || `${slot.time}-${sIdx}`}
                        className={`time-slot-btn ${slot.available ? '' : 'disabled'}`}
                        disabled={!slot.available}
                        title={slot.bookedNote || ''}
                        onClick={() => handleOpenModal(f, slot.time)}
                        type="button"
                      >
                        <div>{isAr ? slot.time : slot.timeEn || slot.time}</div>
                        <div
                          style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-dim)',
                            fontWeight: 600,
                          }}
                        >
                          {isAr ? slot.duration : slot.durationEn || slot.duration}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking trigger CTA */}
              <button
                className="btn-primary open-faculty-booking-btn"
                data-testid={`open-book-faculty-${f.id}`}
                onClick={() => handleOpenModal(f)}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.85rem',
                  fontSize: '0.9rem',
                }}
                type="button"
              >
                <Calendar size={16} color="#ffffff" />
                <span>
                  {isAr
                    ? `حجز موعد ساعة مكتبية مع ${f.name.split(' ')[0]} ${f.name.split(' ')[1] || ''}`
                    : `Book Office Hour with ${displayName}`}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <BookOfficeHoursModal
        isOpen={selectedFaculty !== null}
        faculty={selectedFaculty}
        initialSlotTime={preselectedSlotTime}
        isAr={isAr}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onClose={() => {
          setSelectedFaculty(null);
          setPreselectedSlotTime(undefined);
        }}
        onOpenAuth={onOpenAuth}
        onConfirm={(facId, slot, notes, updatedFac) =>
          onBookSuccess?.(facId, slot, notes, updatedFac)
        }
      />
    </div>
  );
};
