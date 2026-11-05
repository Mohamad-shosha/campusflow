import { FC, ReactNode } from 'react';

export type BadgeVariant =
  | 'fbsu'
  | 'gold'
  | 'available'
  | 'occupied'
  | 'flex'
  | 'faculty'
  | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  icon?: ReactNode;
  dot?: boolean;
  className?: string;
  testId?: string;
}

export const Badge: FC<BadgeProps> = ({
  variant = 'fbsu',
  children,
  icon,
  dot = false,
  className = '',
  testId = 'fbsu-badge',
}) => {
  const getVariantClass = (): string => {
    switch (variant) {
      case 'fbsu':
        return 'badge-fbsu';
      case 'gold':
        return 'badge-gold';
      case 'available':
        return 'badge-available';
      case 'occupied':
        return 'badge-occupied';
      case 'flex':
        return 'badge-flex';
      case 'faculty':
        return 'badge-faculty';
      case 'neutral':
      default:
        return 'badge-fbsu';
    }
  };

  return (
    <span
      className={`badge ${getVariantClass()} ${className}`.trim()}
      data-testid={testId}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            display: 'inline-block',
          }}
          data-testid={`${testId}-dot`}
        />
      )}
      {icon && <span className="badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
