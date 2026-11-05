import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface TopRibbonProps {
  flexCount?: number;
  timeString?: string;
}

export const TopRibbon: FC<TopRibbonProps> = ({
  flexCount = 3,
  timeString = '08:45:00',
}) => {
  const { t } = useTranslation();

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
          <span className="ribbon-item" style={{ color: 'var(--fbsu-gold)' }}>
            <span className="pulse-dot-gold"></span>
            {t('ribbon.flexActive', { count: flexCount })}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span className="ribbon-item">
            📅 {t('ribbon.term')}
          </span>
          <span className="ribbon-item">
            ⏰ <span id="live-time-clock">{timeString}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
