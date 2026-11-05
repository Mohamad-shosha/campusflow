import { FC, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'gold' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  testId?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  testId = 'fbsu-btn',
  className = '',
  style,
  ...rest
}) => {
  const getVariantClass = (): string => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'gold':
        return 'btn-gold';
      case 'outline':
        return 'btn-outline';
      case 'danger':
        return 'btn-danger';
      case 'ghost':
        return 'btn-ghost';
      default:
        return 'btn-primary';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.45rem 0.9rem', fontSize: '0.82rem', borderRadius: '6px' };
      case 'lg':
        return { padding: '0.95rem 1.85rem', fontSize: '1.05rem', borderRadius: '10px' };
      case 'md':
      default:
        return {};
    }
  };

  return (
    <button
      className={`${getVariantClass()} ${className}`.trim()}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      data-testid={testId}
      style={{
        width: fullWidth ? '100%' : undefined,
        justifyContent: fullWidth ? 'center' : undefined,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...getSizeStyle(),
        ...style,
      }}
      {...rest}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
        </>
      )}
    </button>
  );
};
