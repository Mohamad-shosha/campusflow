import { useState, type FC, type SyntheticEvent } from 'react';
import { X, BookOpen, Plus } from 'lucide-react';
import type { TutoringSession } from '../data/campusData';
import { soundFX } from '../../../shared/utils/sound';

export interface CreateTutoringModalProps {
  isOpen: boolean;
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
  onClose: () => void;
  onSubmit: (newSession: TutoringSession) => void;
}

export const CreateTutoringModal: FC<CreateTutoringModalProps> = ({
  isOpen,
  isAr,
  currentUser,
  onClose,
  onSubmit,
}) => {
  const [courseCode, setCourseCode] = useState<string>('CS 210');
  const [courseName, setCourseName] = useState<string>(
    'هياكل البيانات والخوارزميات (Data Structures)'
  );
  const [coveredLectures, setCoveredLectures] = useState<string>(
    'المحاضرات 3 إلى 6 (Trees & Graphs)'
  );
  const [coveredScope, setCoveredScope] = useState<string>(
    'حل أسئلة الواجبات وتطبيقات عملية على شجرة البحث الثنائية.'
  );
  const [hourlyRate] = useState<number>(70); // Fixed 70 SAR as required!
  const [dateTime, setDateTime] = useState<string>('الأربعاء القادم - 03:00 م');
  const [location, setLocation] = useState<string>('معمل الحاسب 102 (Computer Lab 102)');
  const [category, setCategory] = useState<string>('programming');

  if (!isOpen) return null;

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    soundFX.playSuccess();
    const newSession: TutoringSession = {
      id: `TUT-${Date.now()}`,
      tutorId: currentUser.id,
      tutorName: currentUser.name,
      tutorRole: currentUser.role,
      tutorAvatarColor: '#116E63',
      courseCode,
      courseName,
      courseNameEn: courseName,
      coveredLectures,
      coveredScope,
      hourlyRate,
      durationHours: 1,
      totalPrice: hourlyRate,
      dateTime,
      location,
      category,
      rating: 5.0,
      reviewsCount: 1,
      status: 'open',
      enrolledStudents: [],
    };
    onSubmit(newSession);
    onClose();
  };

  return (
    <div
      className="modal-overlay open"
      id="create-tutoring-backdrop"
      onClick={e => {
        if ((e.target as HTMLElement).id === 'create-tutoring-backdrop') onClose();
      }}
      data-testid="create-tutoring-modal"
    >
      <div className="modal-content-box" style={{ maxWidth: '540px' }}>
        <button className="modal-close-btn" onClick={onClose} type="button" aria-label="Close">
          <X size={16} />
        </button>

        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--fbsu-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={24} color="var(--fbsu-primary)" />
          </div>
          <div>
            <h3
              style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}
            >
              {isAr ? 'طرح جلسة شرح أكاديمي جديدة' : 'Post New Peer Tutoring Session'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isAr
                ? 'الرصيد المكتسب يُضاف تلقائياً لمحفظتك الجامعية'
                : 'Earnings credited to tuition balance'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{isAr ? 'رمز المقرر:' : 'Course Code:'}</label>
            <input
              type="text"
              className="form-control"
              value={courseCode}
              onChange={e => setCourseCode(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isAr ? 'اسم المقرر الأكاديمي:' : 'Course Name:'}</label>
            <input
              type="text"
              className="form-control"
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{isAr ? 'التصنيف:' : 'Category:'}</label>
              <select
                className="form-control"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="programming">{isAr ? 'برمجة وحاسب' : 'Programming'}</option>
                <option value="math">{isAr ? 'رياضيات وهندسة' : 'Math & Eng'}</option>
                <option value="hardware">{isAr ? 'تصميم منطقي' : 'Hardware / Logic'}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                {isAr ? 'سعر الساعة (رسمي):' : 'Rate (Official):'}
              </label>
              <input
                type="text"
                className="form-control"
                value={`${hourlyRate} SAR`}
                disabled
                style={{ opacity: 0.8 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {isAr ? 'المحاضرات والشباتر المشمولة:' : 'Covered Scope / Lectures:'}
            </label>
            <input
              type="text"
              className="form-control"
              value={coveredLectures}
              onChange={e => setCoveredLectures(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {isAr ? 'تفاصيل ونقاط الشرح:' : 'Description & Objectives:'}
            </label>
            <textarea
              className="form-control"
              rows={2}
              value={coveredScope}
              onChange={e => setCoveredScope(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{isAr ? 'الموعد والتاريخ:' : 'Date & Time:'}</label>
              <input
                type="text"
                className="form-control"
                value={dateTime}
                onChange={e => setDateTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{isAr ? 'المكان / القاعة:' : 'Location:'}</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '1rem',
              padding: '0.95rem',
            }}
            type="submit"
          >
            <Plus size={16} color="#ffffff" />
            <span>{isAr ? 'نشر الجلسة وإتاحتها للطلاب' : 'Publish Tutoring Session'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
