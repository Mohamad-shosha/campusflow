import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface TopRibbonProps {
  flexCount?: number;
  timeString?: string | undefined;
}

export const TopRibbon: FC<TopRibbonProps> = ({ flexCount = 0, timeString }) => {
  const { t } = useTranslation();
  const [liveClock, setLiveClock] = useState<string>(() =>
    new Date().toLocaleTimeString('en-GB', { hour12: false })
  );

  useEffect(() => {
    if (timeString) return;
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeString]);

  return (
    <div className="uni-ribbon" data-testid="top-ribbon">
      <div className="container ribbon-flex-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span className="ribbon-item">
            <span className="pulse-dot-green"></span>
            <strong>{t('ribbon.location')}</strong>
          </span>
          <span className="ribbon-item" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--fbsu-primary)' }}>🛡️</span>
            {t('ribbon.officialBadge')}
          </span>
          <span className="ribbon-item" style={{ color: 'var(--gold-text)' }}>
            <span className="pulse-dot-gold"></span>
            {t('ribbon.flexActive', { count: flexCount })}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span className="ribbon-item">📅 {t('ribbon.term')}</span>
          <span className="ribbon-item">
            ⏰ <span id="live-time-clock">{timeString ?? liveClock}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
