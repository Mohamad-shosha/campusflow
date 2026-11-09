import { FC, useCallback, useState, useEffect } from 'react';
import { BarChart3, Layers, RotateCw } from 'lucide-react';
import { analyticsApi } from '../api/analyticsApi';
import type { AnalyticsSummary } from '../types/analytics';
import type { ResourceStatus } from '../../../shared/types/resource';

export interface AnalyticsViewProps {
  isAr: boolean;
}

/**
 * Shows only metrics the backend derives from real records (spots, flex offers,
 * gate logs, zone occupancy). The summary endpoint also returns
 * netCapacityGainPercent / timeSavedMinutes / satisfactionRatePercent /
 * totalLedgerRevenue / hourlyLoad, but those are currently hardcoded in
 * AnalyticsService, so they are intentionally not displayed.
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
          labelAr: 'عروض التبادل (الإجمالي)',
          labelEn: 'Flex offers (all time)',
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

  return (
    <div data-testid="analytics-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <BarChart3 size={16} color="var(--fbsu-gold)" />
          <span>{isAr ? 'لوحة تحليلات الذكاء الاصطناعي' : 'AI Analytics'}</span>
        </span>
        <h3 className="section-title">
          {isAr ? 'مؤشرات تشغيل مواقف الجامعة' : 'FBSU Parking Operations Overview'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'مؤشرات محسوبة من سجلات المواقف والبوابات وعروض التبادل في قاعدة البيانات.'
            : 'Indicators computed from parking, gate and flex-share records in the database.'}
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
