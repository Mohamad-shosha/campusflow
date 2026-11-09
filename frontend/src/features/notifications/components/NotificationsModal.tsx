import { FC, useState, useMemo } from 'react';
import {
  X,
  Bell,
  Car,
  ShieldCheck,
  Wallet,
  BookOpen,
  UserCheck,
  DoorClosed,
  CheckCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import type { NotificationResponse } from '../types/notification';

export interface LegacyNotification {
  id: number | string;
  sender?: string;
  title?: string;
  message?: string;
  time?: string;
  badge?: string;
  target?: string;
}

export type AnyNotification = NotificationResponse | LegacyNotification;

export interface NotificationsModalProps {
  isOpen: boolean;
  isAr: boolean;
  notifications: AnyNotification[];
  unreadCount?: number | undefined;
  isLoading?: boolean | undefined;
  onClose: () => void;
  onMarkRead?: ((id: string) => void) | undefined;
  onMarkAllRead: () => void;
  onNavigate?: ((targetRoute: string) => void) | undefined;
}

function formatNotificationTime(isoStringOrText?: string, isAr = true): string {
  if (!isoStringOrText) return isAr ? 'الآن' : 'Just now';
  // Check if it's already friendly text like "منذ 15 د"
  if (!isoStringOrText.includes('-') && !isoStringOrText.includes('T')) {
    return isoStringOrText;
  }
  try {
    const date = new Date(isoStringOrText);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return isAr ? 'الآن' : 'Just now';
    if (diffMins < 60) return isAr ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    if (diffHours < 24) return isAr ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    if (diffDays === 1) return isAr ? 'أمس' : 'Yesterday';
    return isAr
      ? date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return isAr ? 'مؤخراً' : 'Recently';
  }
}

function getNotificationIcon(type?: string) {
  switch (type?.toUpperCase()) {
    case 'PARKING':
      return <Car size={18} color="var(--fbsu-primary)" />;
    case 'GATE':
      return <ShieldCheck size={18} color="#22c55e" />;
    case 'WALLET':
      return <Wallet size={18} color="var(--fbsu-gold)" />;
    case 'TUTORING':
      return <BookOpen size={18} color="#3b82f6" />;
    case 'OFFICE_HOURS':
      return <UserCheck size={18} color="#8b5cf6" />;
    case 'ROOM':
      return <DoorClosed size={18} color="#ec4899" />;
    default:
      return <Bell size={18} color="var(--fbsu-gold)" />;
  }
}

export const NotificationsModal: FC<NotificationsModalProps> = ({
  isOpen,
  isAr,
  notifications,
  unreadCount = 0,
  isLoading = false,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onNavigate,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');

  // Normalize notifications
  const normalizedList = useMemo(() => {
    return notifications.map(n => {
      const isModern = 'createdAt' in n || 'titleAr' in n;
      const modern = n as NotificationResponse;
      const legacy = n as LegacyNotification;

      const id = String(n.id);
      const title = isAr
        ? modern.titleAr || legacy.title || ''
        : modern.titleEn || legacy.title || '';
      const message = isAr
        ? modern.messageAr || legacy.message || ''
        : modern.messageEn || legacy.message || '';
      const sender = isAr
        ? modern.senderNameAr || legacy.sender || (isAr ? 'نظام الحرم الجامعي' : 'Campus System')
        : modern.senderNameEn || legacy.sender || 'Campus System';
      const badge = isAr
        ? modern.badgeAr || legacy.badge || (isAr ? 'إشعار' : 'Alert')
        : modern.badgeEn || legacy.badge || 'Alert';
      const type = modern.type || 'SYSTEM';
      const read = modern.read !== undefined ? modern.read : false;
      const timeStr = isModern
        ? formatNotificationTime(modern.createdAt, isAr)
        : formatNotificationTime(legacy.time, isAr);
      const targetRoute = modern.targetRoute || legacy.target || null;

      return {
        id,
        title,
        message,
        sender,
        badge,
        type,
        read,
        timeStr,
        targetRoute,
      };
    });
  }, [notifications, isAr]);

  const filteredList = useMemo(() => {
    if (filterTab === 'unread') {
      return normalizedList.filter(n => !n.read);
    }
    return normalizedList;
  }, [normalizedList, filterTab]);

  const effectiveUnreadCount = useMemo(() => {
    if (unreadCount > 0) return unreadCount;
    return normalizedList.filter(n => !n.read).length;
  }, [unreadCount, normalizedList]);

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
      <div
        className="modal-content-box"
        style={{
          maxWidth: '560px',
          width: '92%',
          padding: '1.5rem',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          type="button"
          aria-label="Close"
          data-testid="notifications-close-btn"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--fbsu-gold-light)',
                color: 'var(--gold-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={20} color="var(--fbsu-gold)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    margin: 0,
                  }}
                >
                  {isAr ? 'صندوق الإشعارات المباشرة' : 'Direct Campus Alerts'}
                </h3>
                {effectiveUnreadCount > 0 && (
                  <span
                    className="badge badge-warning"
                    style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
                    data-testid="notifications-unread-pill"
                  >
                    {effectiveUnreadCount} {isAr ? 'جديد' : 'new'}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                {isAr
                  ? 'إشعارات المواقف والمحفظة والساعات والقاعات الأكاديمية'
                  : 'Live parking, wallet, tutoring & facility notifications'}
              </span>
            </div>
          </div>

          {effectiveUnreadCount > 0 && (
            <button
              className="btn-outline"
              onClick={onMarkAllRead}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              type="button"
              data-testid="notifications-mark-all-btn"
            >
              <CheckCheck size={14} />
              <span>{isAr ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.5rem',
          }}
        >
          <button
            type="button"
            className={`pill-btn ${filterTab === 'all' ? 'active' : ''}`}
            onClick={() => setFilterTab('all')}
            style={{
              padding: '0.3rem 0.85rem',
              fontSize: '0.78rem',
              borderRadius: 'var(--radius-full)',
              background: filterTab === 'all' ? 'var(--fbsu-primary)' : 'var(--surface-soft)',
              color: filterTab === 'all' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            data-testid="notifications-tab-all"
          >
            {isAr ? 'جميع الإشعارات' : 'All Alerts'} ({normalizedList.length})
          </button>
          <button
            type="button"
            className={`pill-btn ${filterTab === 'unread' ? 'active' : ''}`}
            onClick={() => setFilterTab('unread')}
            style={{
              padding: '0.3rem 0.85rem',
              fontSize: '0.78rem',
              borderRadius: 'var(--radius-full)',
              background: filterTab === 'unread' ? 'var(--fbsu-gold)' : 'var(--surface-soft)',
              color: filterTab === 'unread' ? '#111' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            data-testid="notifications-tab-unread"
          >
            {isAr ? 'غير المقروءة' : 'Unread'} ({effectiveUnreadCount})
          </button>
        </div>

        {/* Notifications Scroll List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            overflowY: 'auto',
            flex: 1,
            paddingInlineEnd: '0.25rem',
          }}
        >
          {isLoading && (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              <div className="spinner" style={{ margin: '0 auto 0.75rem' }} />
              {isAr ? 'جاري تحديث صندوق الإشعارات...' : 'Updating notifications...'}
            </div>
          )}

          {!isLoading && filteredList.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: 'var(--text-muted)',
              }}
              data-testid="notifications-empty-state"
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'var(--surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Sparkles size={24} color="var(--fbsu-gold)" />
              </div>
              <h4 style={{ margin: '0 0 0.35rem', color: 'var(--text-main)', fontSize: '0.98rem' }}>
                {filterTab === 'unread'
                  ? isAr
                    ? 'لا توجد إشعارات غير مقروءة'
                    : 'No unread notifications'
                  : isAr
                    ? 'صندوق الإشعارات فارغ'
                    : 'No notifications at this time'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.78rem' }}>
                {isAr
                  ? 'ستصلك هنا كافة التنبيهات المتعلقة بحجوزاتك وحسابك فور حدوثها.'
                  : 'You are all caught up! Real-time alerts will appear here.'}
              </p>
            </div>
          )}

          {!isLoading &&
            filteredList.map(n => {
              const isUnread = !n.read;
              return (
                <div
                  key={n.id}
                  style={{
                    background: isUnread ? 'rgba(215, 162, 55, 0.07)' : 'var(--surface-soft)',
                    border: isUnread
                      ? '1px solid rgba(215, 162, 55, 0.35)'
                      : '1px solid var(--border-subtle)',
                    borderInlineStart: isUnread
                      ? '3px solid var(--fbsu-gold)'
                      : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.9rem',
                    display: 'flex',
                    gap: '0.85rem',
                    alignItems: 'flex-start',
                    position: 'relative',
                    cursor: onMarkRead || (n.targetRoute && onNavigate) ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => {
                    if (isUnread && onMarkRead) {
                      onMarkRead(n.id);
                    }
                  }}
                  data-testid={`notification-item-${n.id}`}
                >
                  {/* Category Icon */}
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getNotificationIcon(n.type)}
                  </div>

                  {/* Notification Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem',
                        gap: '0.5rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          minWidth: 0,
                        }}
                      >
                        <strong
                          style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-main)',
                            fontWeight: isUnread ? 800 : 600,
                          }}
                        >
                          {n.title}
                        </strong>
                        {isUnread && (
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: 'var(--fbsu-gold)',
                              flexShrink: 0,
                            }}
                            title={isAr ? 'غير مقروء' : 'Unread'}
                            data-testid={`unread-dot-${n.id}`}
                          />
                        )}
                      </div>
                      <span
                        className="badge"
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.15rem 0.45rem',
                          background: 'var(--surface-soft-2)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {n.badge}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.45,
                        margin: '0 0 0.5rem 0',
                      }}
                    >
                      {n.message}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.72rem',
                        color: 'var(--text-dim)',
                      }}
                    >
                      <span>
                        {isAr ? 'المُرسل:' : 'From:'}{' '}
                        <strong style={{ color: 'var(--text-muted)' }}>{n.sender}</strong>
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span>{n.timeStr}</span>
                        {n.targetRoute && onNavigate && (
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              if (isUnread && onMarkRead) {
                                onMarkRead(n.id);
                              }
                              onNavigate(n.targetRoute as string);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--gold-text)',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              padding: 0,
                            }}
                            data-testid={`navigate-btn-${n.id}`}
                          >
                            <span>{isAr ? 'عرض' : 'View'}</span>
                            <ExternalLink size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
