import { useState, type FC, type SyntheticEvent } from 'react';
import { X, BookOpen, Plus, AlertCircle } from 'lucide-react';
import type { TutoringSession } from '../data/campusData';
import { tutoringApi } from '../api/tutoringApi';
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
  const [hourlyRate] = useState<number>(70);
  const [durationHours, setDurationHours] = useState<number>(1);
  const [dateTime, setDateTime] = useState<string>('الأربعاء القادم - 03:00 م');
  const [location, setLocation] = useState<string>('معمل الحاسب 102 (Computer Lab 102)');
  const [category, setCategory] = useState<string>('programming');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalPrice = hourlyRate * durationHours;

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const created = await tutoringApi.createSession({
        courseCode,
        courseNameAr: courseName,
        courseNameEn: courseName,
        coveredLectures,
        coveredScope,
        category,
        durationHours,
        scheduleText: dateTime,
        location,
        maxCapacity: 10,
      });
      soundFX.playSuccess();
      onSubmit(created);
      setIsSubmitting(false);
      onClose();
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        (isAr
          ? 'تعذر نشر الجلسة. يُسمح فقط للطلاب المؤهلين بنشر جلسات الشرح.'
          : 'Unable to publish session. Only eligible student accounts may post tutoring sessions.');
      setErrorMsg(detail);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay open"
      id="create-tutoring-backdrop"
      onClick={e => {
        if ((e.target as HTMLElement).id === 'create-tutoring-backdrop') {
          setErrorMsg(null);
          onClose();
        }
      }}
      data-testid="create-tutoring-modal"
    >
      <div className="modal-content-box" style={{ maxWidth: '540px' }}>
        <button
          className="modal-close-btn"
          onClick={() => {
            setErrorMsg(null);
            onClose();
          }}
          type="button"
          aria-label="Close"
        >
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

        {errorMsg && (
          <div
            role="alert"
            style={{
              padding: '0.8rem 1rem',
              marginBottom: '1rem',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            data-testid="create-tutoring-error"
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
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
              <label className="form-label">{isAr ? 'المدة:' : 'Duration:'}</label>
              <select
                className="form-control"
                value={durationHours}
                onChange={e => setDurationHours(Number(e.target.value))}
              >
                <option value={1}>{isAr ? '1 ساعة' : '1.0 Hour'}</option>
                <option value={1.5}>{isAr ? '1.5 ساعة' : '1.5 Hours'}</option>
                <option value={2}>{isAr ? '2 ساعتان' : '2.0 Hours'}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{isAr ? 'إجمالي الجلسة:' : 'Total Fee:'}</label>
              <input
                type="text"
                className="form-control"
                value={`${totalPrice} SAR`}
                disabled
                style={{ opacity: 0.85 }}
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
            disabled={isSubmitting}
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '1rem',
              padding: '0.95rem',
            }}
            type="submit"
            data-testid="publish-tutoring-submit-btn"
          >
            <Plus size={16} color="#ffffff" />
            <span>
              {isSubmitting
                ? isAr
                  ? 'جارٍ النشر...'
                  : 'Publishing...'
                : isAr
                  ? 'نشر الجلسة وإتاحتها للطلاب'
                  : 'Publish Tutoring Session'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
