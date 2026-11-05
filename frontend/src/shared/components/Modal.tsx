import { FC, ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | undefined;
  children: ReactNode;
  maxWidth?: string | undefined;
  testId?: string | undefined;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '520px',
  testId = 'fbsu-modal',
}) => {
  const modalBoxRef = useRef<HTMLDivElement>(null);

  // Keyboard Escape listener and Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid={testId}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content-box"
        style={{ maxWidth, position: 'relative' }}
        ref={modalBoxRef}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          data-testid={`${testId}-close`}
        >
          <X size={16} />
        </button>

        {title && (
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            {title}
          </h3>
        )}

        {children}
      </div>
    </div>
  );
};
