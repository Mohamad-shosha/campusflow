import { FC } from 'react';

export interface TopRibbonProps {
  isAr: boolean;
  flexCount?: number;
  timeString?: string;
}

export const TopRibbon: FC<TopRibbonProps> = ({
  isAr,
  flexCount = 3,
  timeString = '08:45:00',
}) => {
  return (
    <div className="uni-ribbon" data-testid="top-ribbon">
      <div className="container ribbon-flex-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span className="ribbon-item">
            <span className="pulse-dot-green"></span>
            <strong>{isAr ? 'جامعة فهد بن سلطان - تبوك' : 'Fahad Bin Sultan University - Tabuk'}</strong>
          </span>
          <span className="ribbon-item" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--fbsu-primary)' }}>🛡️</span>
            {isAr ? 'بوابة المواقف الذكية المعتمدة' : 'Official Smart Campus Gateway'}
          </span>
          <span className="ribbon-item" style={{ color: 'var(--fbsu-gold)' }}>
            <span className="pulse-dot-gold"></span>
            {isAr
              ? `التبادل الذكي نشط: ${flexCount} مواقف متاحة للتبادل`
              : `Flex Active: ${flexCount} spots open`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span className="ribbon-item">
            📅 {isAr ? 'الفصل الدراسي الأول 1448 هـ' : 'Academic Term 1448H'}
          </span>
          <span className="ribbon-item">
            ⏰ <span id="live-time-clock">{timeString}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

