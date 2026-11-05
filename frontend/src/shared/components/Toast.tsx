import { useEffect, useState, type FC, type ComponentType } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id?: string | undefined;
  title?: string | undefined;
  message: string;
  type?: ToastType | undefined;
  duration?: number | undefined;
  onClose?: (() => void) | undefined;
}

const icons: Record<ToastType, ComponentType<{ size?: number; className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export const Toast: FC<ToastProps> = ({
  title,
  message,
  type = 'info',
  duration = 4500,
  onClose,
}) => {
  const [isDismissing, setIsDismissing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const IconComponent = icons[type];

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setIsDismissing(true);
      setTimeout(() => {
        onClose?.();
      }, 280);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, isPaused, onClose]);

  const handleManualClose = () => {
    setIsDismissing(true);
    setTimeout(() => {
      onClose?.();
    }, 280);
  };

  return (
    <div
      role="alert"
      className={`fbsu-toast fbsu-toast-${type} ${isDismissing ? 'dismissing' : ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-testid="fbsu-toast"
    >
      <div className="fbsu-toast-icon-wrap">
        <IconComponent size={20} />
      </div>
      <div className="fbsu-toast-body">
        {title && <div className="fbsu-toast-title">{title}</div>}
        <div className="fbsu-toast-message">{message}</div>
      </div>
      <button
        type="button"
        className="fbsu-toast-close"
        onClick={handleManualClose}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
      <div
        className="fbsu-toast-progress"
        style={{
          animationDuration: `${duration}ms`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      />
    </div>
  );
};
