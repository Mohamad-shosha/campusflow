import { FC, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Camera } from 'lucide-react';
import { QR } from '../../../shared/components/QR';
import { soundFX } from '../../../shared/utils/sound';

export interface DigitalPassData {
  spotId: number;
  college: string;
  userName: string;
  userId: string;
  plate: string;
  duration: string;
}

export interface DigitalPassModalProps {
  isOpen: boolean;
  passData: DigitalPassData | null;
  isAr: boolean;
  onClose: () => void;
  onOpenGate?: (() => void) | undefined;
}

export const DigitalPassModal: FC<DigitalPassModalProps> = ({
  isOpen,
  passData,
  isAr,
  onClose,
  onOpenGate,
}) => {
  useEffect(() => {
    if (isOpen && passData) {
      soundFX.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // no-op if confetti unsupported in test environment
      }
    }
  }, [isOpen, passData]);

  if (!isOpen || !passData) return null;

  return (
    <div
      className="modal-overlay open"
      id="pass-modal-backdrop"
      onClick={e => {
        if ((e.target as HTMLElement).id === 'pass-modal-backdrop') onClose();
      }}
      data-testid="digital-pass-modal"
    >
      <div className="modal-content-box" style={{ maxWidth: '480px', padding: '2rem' }}>
        <button className="modal-close-btn" onClick={onClose} type="button" aria-label="Close">
          <X size={16} />
        </button>

        <div className="digital-pass-card">
          <div className="pass-header">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fbsu-gold)', fontWeight: 800 }}>
                FBSU SMART PASS
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                {isAr ? 'تصريح دخول المواقف الذكي' : 'Digital Parking Gate Pass'}
              </h3>
            </div>
            <img
              src="/assets/branding/fbsu-logo.png"
              style={{ height: '36px' }}
              alt="FBSU"
            />
          </div>

          <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isAr ? 'الموقف المخصص' : 'Assigned Bay'}
            </div>
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'var(--fbsu-gold)',
                lineHeight: 1.2,
              }}
            >
              #{String(passData.spotId).padStart(2, '0')}
            </div>
            <span className="badge badge-fbsu">{passData.college}</span>
          </div>

          <div className="pass-qr-box" style={{ margin: '1.25rem 0', display: 'flex', justifyContent: 'center' }}>
            <QR value={`FBSU-PASS-${passData.spotId}-${passData.plate}`} size={160} />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              fontSize: '0.825rem',
              borderTop: '1px dashed rgba(215,162,55,0.3)',
              paddingTop: '1rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>
                {isAr ? 'المستفيد:' : 'Beneficiary:'}
              </span>
              <strong style={{ color: '#ffffff' }}>{passData.userName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>
                {isAr ? 'الرقم الجامعي:' : 'University ID:'}
              </span>
              <strong style={{ color: '#ffffff' }}>{passData.userId}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>
                {isAr ? 'لوحة المركبة:' : 'Vehicle Plate:'}
              </span>
              <strong style={{ color: 'var(--fbsu-gold)' }}>{passData.plate}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>
                {isAr ? 'الصلاحية:' : 'Validity:'}
              </span>
              <strong style={{ color: 'var(--status-available)' }}>{passData.duration}</strong>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                onClose();
                onOpenGate?.();
              }}
              type="button"
            >
              <Camera size={16} color="#ffffff" />
              <span>{isAr ? 'فتح البوابة الذكية تلقائياً (NFC/ALPR)' : 'Trigger Smart Barrier (NFC/ALPR)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
