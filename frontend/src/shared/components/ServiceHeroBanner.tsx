import { type FC, type ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { soundFX } from '../utils/sound';

export interface ServiceStatChip {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
}

export interface ServiceHeroBannerProps {
  isAr: boolean;
  serviceTag: string;
  tagIcon: LucideIcon;
  title: string;
  highlightText: string;
  description: string;
  statChips: ServiceStatChip[];
  primaryAction?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
  };
  badgeSlot?: ReactNode;
}

export const ServiceHeroBanner: FC<ServiceHeroBannerProps> = ({
  isAr,
  serviceTag,
  tagIcon: TagIcon,
  title,
  highlightText,
  description,
  statChips,
  primaryAction,
  secondaryAction,
  badgeSlot,
}) => {
  return (
    <section className="service-hero-banner" data-testid="service-hero-banner" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="service-hero-backdrop" />
      <div className="container">
        <div className="service-hero-content-grid">
          <div className="service-hero-text">
            <div className="service-hero-tag">
              <TagIcon size={14} color="var(--fbsu-gold, #d7a237)" />
              <span>{serviceTag}</span>
            </div>

            <h2 className="service-hero-title">
              {title} <span className="highlight-gold">{highlightText}</span>
            </h2>

            <p className="service-hero-desc">{description}</p>

            {(primaryAction || secondaryAction) && (
              <div className="service-hero-actions">
                {primaryAction && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      soundFX.playClick();
                      primaryAction.onClick();
                    }}
                  >
                    <primaryAction.icon size={16} />
                    <span>{primaryAction.label}</span>
                  </button>
                )}
                {secondaryAction && (
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      soundFX.playClick();
                      secondaryAction.onClick();
                    }}
                  >
                    <secondaryAction.icon size={16} />
                    <span>{secondaryAction.label}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {badgeSlot && <div className="service-hero-badge-wrap">{badgeSlot}</div>}
        </div>

        {/* Dynamic Quick Stat Chips */}
        {statChips.length > 0 && (
          <div className="service-hero-stats-row">
            {statChips.map((chip, idx) => {
              const ChipIcon = chip.icon;
              return (
                <div key={idx} className="service-stat-card">
                  <div
                    className="service-stat-icon-wrap"
                    style={{ color: chip.color || 'var(--fbsu-gold, #d7a237)' }}
                  >
                    <ChipIcon size={20} />
                  </div>
                  <div className="service-stat-info">
                    <span className="service-stat-value">{chip.value}</span>
                    <span className="service-stat-label">{chip.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
