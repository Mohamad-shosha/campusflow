import { FC } from 'react';
import { X, Bell } from 'lucide-react';
import type { CampusNotification } from '../../campus/data/campusData';

export interface NotificationsModalProps {
  isOpen: boolean;
  isAr: boolean;
  notifications: CampusNotification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

export const NotificationsModal: FC<NotificationsModalProps> = ({
  isOpen,
  isAr,
  notifications,
  onClose,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay open"
      id="notif-modal-backdrop"
      onClick={e => {
        if ((e.target as HTMLElement).id === 'notif-modal-backdrop') onClose();
      }}
      data-testid="notifications-modal"
    >
      <div className="modal-content-box" style={{ maxWidth: '540px' }}>
        <button className="modal-close-btn" onClick={onClose} type="button" aria-label="Close">
          <X size={16} />
        </button>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--fbsu-gold-light)',
                color: 'var(--fbsu-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={20} color="var(--fbsu-gold)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {isAr ? 'صندوق الإشعارات المباشرة' : 'Direct Campus Alerts'}
              </h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                {isAr ? 'إشعارات حجز الساعات المكتبية والشروحات والقاعات' : 'Faculty & Student Alerts'}
              </span>
            </div>
          </div>
          <button
            className="btn-outline"
            onClick={onMarkAllRead}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            type="button"
          >
            {isAr ? 'تحديد الكل كمقروء' : 'Mark all read'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
          {notifications.map(n => (
            <div
              key={n.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                display: 'flex',
                gap: '0.85rem',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--fbsu-primary-light)',
                  color: 'var(--fbsu-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bell size={18} color="var(--fbsu-primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{n.title}</strong>
                  <span className="badge badge-available" style={{ fontSize: '0.65rem' }}>
                    {n.badge || (isAr ? 'جديد' : 'New')}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '0.4rem' }}>
                  {n.message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <span>
                    {isAr ? 'المُرسل:' : 'From:'} <strong>{n.sender}</strong>
                  </span>
                  <span>{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

