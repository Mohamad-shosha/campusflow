import { FC, useCallback, useState, useEffect } from 'react';
import { BarChart3, Clock, DoorClosed, Layers, RotateCw, Wallet } from 'lucide-react';
import { analyticsApi } from '../api/analyticsApi';
import type { AnalyticsSummary } from '../types/analytics';
import type { ResourceStatus } from '../../../shared/types/resource';

export interface AnalyticsViewProps {
  isAr: boolean;
}

/**
 * Displays live campus operational intelligence derived strictly from persisted
 * database records (parking bays, gate passages, 7-day hourly distribution,
 * double-entry financial ledger, and study rooms / labs bookings).
 * Unmeasured metrics (when null) are omitted rather than estimated.
 */
export const AnalyticsView: FC<AnalyticsViewProps> = ({ isAr }) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [status, setStatus] = useState<ResourceStatus>('loading');

  const fetchAnalytics = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await analyticsApi.getSummary();
      setSummary(data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const kpis = summary
    ? [
        {
          id: 'total-spots',
          value: summary.totalSpots,
          labelAr: 'إجمالي المواقف',
          labelEn: 'Total bays',
          color: 'var(--text-main)',
        },
        {
          id: 'available-spots',
          value: summary.availableSpots,
          labelAr: 'متاحة الآن',
          labelEn: 'Available now',
          color: 'var(--status-available)',
        },
        {
          id: 'occupied-spots',
          value: summary.occupiedSpots,
          labelAr: 'مشغولة أو محجوزة',
          labelEn: 'Occupied or reserved',
          color: 'var(--status-occupied)',
        },
        {
          id: 'flex-offers',
          value: summary.flexSharesActive,
          labelAr: 'عروض التبادل النشطة',
          labelEn: 'Active flex offers',
          color: 'var(--gold-text)',
        },
        {
          id: 'gate-passages',
          value: summary.totalGatePassages,
          labelAr: 'عمليات عبور البوابة المسجلة',
          labelEn: 'Recorded gate passages',
          color: 'var(--accent-text)',
        },
      ]
    : [];

  const revenue = summary?.revenueBreakdown;
  const roomsUtil = summary?.roomsUtilization;

  return (
    <div data-testid="analytics-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <BarChart3 size={16} color="var(--fbsu-gold)" />
          <span>{isAr ? 'لوحة التحليلات التشغيلية' : 'Live Campus Analytics'}</span>
        </span>
        <h3 className="section-title">
          {isAr
            ? 'مؤشرات تشغيل الحرم الجامعي والمواقف والمالية'
            : 'FBSU Campus Operations, Financial & Labs Telemetry'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'أرقام وإحصائيات حية محسوبة مباشرة من سجلات المواقف وبوابات الدخول ودفتر الأستاذ وحجوزات المعامل.'
            : 'Live metrics computed strictly from parking spots, gate logs, double-entry ledger, and study room records.'}
        </p>
      </div>

      {status === 'loading' && !summary && (
        <div className="campus-data-state" role="status" data-testid="analytics-loading">
          {isAr ? 'جاري تحميل المؤشرات...' : 'Loading indicators...'}
        </div>
      )}

      {status === 'error' && !summary && (
        <div className="campus-data-state is-error" role="alert" data-testid="analytics-load-error">
          <span>{isAr ? 'تعذر تحميل المؤشرات من الخادم.' : 'Could not load indicators.'}</span>
          <button type="button" className="btn-outline" onClick={fetchAnalytics}>
            <RotateCw size={14} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      )}

      {kpis.length > 0 && (
        <div className="rooms-kpis" data-testid="analytics-kpis">
          {kpis.map(k => (
            <div key={k.id} className="rooms-kpi" data-testid={`kpi-${k.id}`}>
              <span className="rooms-kpi-value" style={{ color: k.color }}>
                {k.value}
              </span>
              <span className="rooms-kpi-label">{isAr ? k.labelAr : k.labelEn}</span>
            </div>
          ))}
        </div>
      )}

      {/* Financial Ledger Volume & Revenue Breakdown */}
      {revenue && (
        <div
          style={{ marginTop: '1.75rem', marginBottom: '1.75rem' }}
          data-testid="analytics-revenue-panel"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: 'var(--text-main)',
              fontWeight: 800,
              fontSize: '1.05rem',
            }}
          >
            <Wallet size={18} color="var(--fbsu-gold)" />
            <span>
              {isAr
                ? 'تحليل التدفقات المالية من دفتر الأستاذ'
                : 'Financial Ledger Revenue Breakdown'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              className="glass-panel"
              data-testid="rev-parking"
              style={{
                padding: '1.15rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-soft)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAr ? 'صافي إيرادات المواقف' : 'Net Parking Revenue'}
              </div>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--status-available)',
                  marginTop: '0.25rem',
                }}
              >
                {Number(revenue.netParkingRevenue).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
              </div>
            </div>

            <div
              className="glass-panel"
              data-testid="rev-tuition"
              style={{
                padding: '1.15rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-soft)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAr ? 'مدفوعات الرسوم الدراسية' : 'Tuition Settlements'}
              </div>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginTop: '0.25rem',
                }}
              >
                {Number(revenue.tuitionRevenue).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
              </div>
            </div>

            <div
              className="glass-panel"
              data-testid="rev-tutoring"
              style={{
                padding: '1.15rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-soft)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAr ? 'حجم تداولات تدريس الأقران' : 'Peer Tutoring Volume'}
              </div>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--gold-text)',
                  marginTop: '0.25rem',
                }}
              >
                {Number(revenue.tutoringVolume).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
              </div>
            </div>

            <div
              className="glass-panel"
              data-testid="rev-total"
              style={{
                padding: '1.15rem',
                borderRadius: '12px',
                border: '1px solid var(--fbsu-gold-border)',
                background: 'rgba(215, 162, 55, 0.08)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAr ? 'إجمالي حجم المعاملات بالحرم' : 'Total Campus Financial Volume'}
              </div>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--fbsu-gold)',
                  marginTop: '0.25rem',
                }}
              >
                {Number(revenue.totalCampusVolume).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real Study Rooms & Labs Utilization */}
      {roomsUtil && (
        <div
          style={{ marginTop: '1.5rem', marginBottom: '1.75rem' }}
          data-testid="analytics-rooms-panel"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: 'var(--text-main)',
              fontWeight: 800,
              fontSize: '1.05rem',
            }}
          >
            <DoorClosed size={18} color="var(--fbsu-primary)" />
            <span>
              {isAr
                ? 'إحصائيات تشغيل المعامل وقاعات الدراسة'
                : 'Smart Labs & Study Rooms Utilization'}
            </span>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'var(--surface-soft)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAr ? 'نسبة الإشغال الفعلي' : 'Active Utilization'}
              </div>
              <div
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--fbsu-primary)',
                  marginTop: '0.2rem',
                }}
              >
                {roomsUtil.activeUtilizationPercent}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAr ? 'إجمالي المرافق' : 'Total Facilities'}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.2rem' }}>
                {roomsUtil.totalRooms}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAr ? 'متاحة للحجز' : 'Available'}
              </div>
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--status-available)',
                  marginTop: '0.2rem',
                }}
              >
                {roomsUtil.availableRooms}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAr ? 'جلسات نشطة / محجوزة' : 'In Use / Reserved'}
              </div>
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--gold-text)',
                  marginTop: '0.2rem',
                }}
              >
                {roomsUtil.inUseRooms + roomsUtil.reservedRooms} ({roomsUtil.activeBookingsCount}{' '}
                {isAr ? 'حجز' : 'bookings'})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Hourly Gate Load Distribution */}
      {summary && (
        <div
          style={{ marginTop: '1.5rem', marginBottom: '1.75rem' }}
          data-testid="analytics-hourly-panel"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: 'var(--text-main)',
              fontWeight: 800,
              fontSize: '1.05rem',
            }}
          >
            <Clock size={18} color="var(--fbsu-gold)" />
            <span>
              {isAr
                ? 'توزيع حركة الدخول عبر البوابات (آخر 7 أيام)'
                : 'Gate Admittance Hourly Load (Last 7 Days)'}
            </span>
          </div>

          {summary.hourlyLoad && summary.hourlyLoad.length > 0 ? (
            <div
              data-testid="hourly-load-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '0.75rem',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-soft)',
              }}
            >
              {summary.hourlyLoad.map(pt => (
                <div
                  key={pt.time}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                  >
                    <span>{pt.time}</span>
                    <span style={{ color: pt.color }}>{pt.load}%</span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      width: '100%',
                      borderRadius: '4px',
                      background: 'var(--surface-hover)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pt.load}%`,
                        height: '100%',
                        background: pt.color,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isAr ? pt.labelAr : pt.labelEn}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              data-testid="hourly-load-empty"
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px dashed var(--border-color)',
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
              }}
            >
              {isAr
                ? 'لا توجد حركات عبور مصرح بها مسجلة خلال آخر 7 أيام لعرض توزيع الساعات.'
                : 'No granted gate passages have been recorded in the last 7 days.'}
            </div>
          )}
        </div>
      )}

      {/* Real-time Zone Breakdown Grid */}
      {summary?.zoneStats && summary.zoneStats.length > 0 && (
        <div
          style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}
          data-testid="analytics-zones-panel"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: 'var(--text-main)',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}
          >
            <Layers size={18} color="var(--fbsu-primary)" />
            <span>{isAr ? 'معدل إشغال القطاعات اللحظي' : 'Real-Time Zone Occupancy Rates'}</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {summary.zoneStats.map(zone => (
              <div
                key={zone.zoneCode}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  background: 'var(--surface-soft)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                    {isAr ? zone.zoneNameAr : zone.zoneNameEn}
                  </span>
                  <span
                    className={`badge ${
                      zone.occupancyRate > 80
                        ? 'badge-danger'
                        : zone.occupancyRate > 50
                          ? 'badge-warning'
                          : 'badge-success'
                    }`}
                  >
                    {zone.occupancyRate}%
                  </span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--surface-hover)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(zone.occupancyRate, 100)}%`,
                      height: '100%',
                      background:
                        zone.occupancyRate > 80
                          ? '#ef4444'
                          : zone.occupancyRate > 50
                            ? '#f59e0b'
                            : '#10b981',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>
                    {isAr
                      ? `مشغول: ${zone.occupiedSpots} من ${zone.totalSpots}`
                      : `Occupied: ${zone.occupiedSpots} / ${zone.totalSpots}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
