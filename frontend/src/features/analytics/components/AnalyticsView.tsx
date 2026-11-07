import { FC } from 'react';
import { BarChart3 } from 'lucide-react';

export interface AnalyticsViewProps {
  isAr: boolean;
}

export const AnalyticsView: FC<AnalyticsViewProps> = ({ isAr }) => {
  const peakData = [
    { time: '08:00', load: 85, color: '#f59e0b', label: isAr ? 'ذروة 1' : 'Peak 1' },
    { time: '09:00', load: 95, color: '#ef4444', label: isAr ? 'ذروة قصوى' : 'Max Peak' },
    { time: '10:00', load: 70, color: '#10b981', label: isAr ? 'فترة خروج البريك' : 'Break Exit' },
    { time: '11:00', load: 90, color: '#ef4444', label: isAr ? 'محاضرات الظهر' : 'Midday' },
    { time: '12:00', load: 80, color: '#f59e0b', label: isAr ? 'صلاة الظهر' : 'Prayer' },
    { time: '01:00', load: 65, color: '#10b981', label: isAr ? 'تبادل المواقف' : 'Flex Swap' },
    { time: '02:00', load: 75, color: '#f59e0b', label: isAr ? 'عودة الطلاب' : 'Return' },
    { time: '03:00', load: 50, color: '#10b981', label: isAr ? 'هدوء' : 'Calm' },
    { time: '04:00', load: 25, color: '#10b981', label: isAr ? 'نهاية الدوام' : 'Dismissal' },
  ];

  return (
    <div data-testid="analytics-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <BarChart3 size={16} color="var(--fbsu-gold)" />
          <span>{isAr ? 'لوحة تحليلات الذكاء الاصطناعي' : 'AI Analytics'}</span>
        </span>
        <h3 className="section-title">
          {isAr
            ? 'مؤشرات الأداء والكفاءة التشغيلية لمواقف الجامعة'
            : 'FBSU Smart Parking Efficiency & Forecast'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'بيانات حية توضح التحسن الناتج عن خوارزمية التبادل الذكي في زيادة السعة الاستيعابية وخفض الازدحام.'
            : 'Real-time metrics demonstrating how AI flex swapping increases capacity and eliminates traffic congestion.'}
        </p>
      </div>

      <div className="analytics-kpi-grid">
        <div className="stat-chip" style={{ padding: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--status-available)' }}>
              +42%
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '0.35rem 0',
              }}
            >
              {isAr ? 'زيادة في سعة المواقف الفعلية' : 'Net Capacity Gain'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isAr
                ? 'دون بناء أي خرسانات أو مساحات إضافية'
                : 'Zero additional concrete or real estate'}
            </div>
          </div>
        </div>

        <div className="stat-chip" style={{ padding: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--fbsu-gold)' }}>
              {isAr ? '14.2 دقيقة' : '14.2 Mins'}
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '0.35rem 0',
              }}
            >
              {isAr ? 'توفير في وقت كل طالب' : 'Time Saved per Student'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isAr ? 'اختفاء ظاهرة الدوران والبحث عن موقف' : 'Eliminates campus cruising time'}
            </div>
          </div>
        </div>

        <div className="stat-chip" style={{ padding: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--fbsu-primary)' }}>
              98.8%
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '0.35rem 0',
              }}
            >
              {isAr ? 'مستوى رضا طلاب ودكاترة الجامعة' : 'Campus Satisfaction Rate'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isAr
                ? 'وفق استبيان عمادة شؤون الطلاب بتبوك'
                : 'Student Affairs Deanship Survey (Tabuk)'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Hourly Heatmap */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h4
          style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <BarChart3 size={18} color="var(--fbsu-primary)" />
          <span>
            {isAr
              ? 'التوزيع الذكي للطلب على المواقف حسب ساعات الدوام الجامعي (FBSU Daily Peak Hours)'
              : 'Dynamic Parking Demand Distribution across Campus Schedule (FBSU Peak Hours)'}
          </span>
        </h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))',
            gap: '0.75rem',
            textAlign: 'center',
          }}
        >
          {peakData.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}
              >
                {item.time}
              </div>
              <div
                style={{
                  height: '120px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: `${item.load}%`,
                    background: item.color,
                    borderRadius: '4px',
                    boxShadow: `0 0 10px ${item.color}50`,
                    transition: 'height 1s',
                  }}
                ></div>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {item.load}%
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: item.color,
                  fontWeight: 700,
                  marginTop: '0.25rem',
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
