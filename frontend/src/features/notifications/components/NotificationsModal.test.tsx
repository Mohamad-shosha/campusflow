import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationsModal } from './NotificationsModal';
import type { NotificationResponse } from '../types/notification';

const mockNotifications: NotificationResponse[] = [
  {
    id: 'notif-1',
    senderNameAr: 'إدارة المواقف الذكية',
    senderNameEn: 'Smart Parking System',
    titleAr: 'تأكيد حجز موقف مسبق',
    titleEn: 'Parking Bay Reserved',
    messageAr: 'تم تأكيد حجز الموقف A-12 للفترة المحددة.',
    messageEn: 'Parking bay A-12 confirmed for time window.',
    type: 'PARKING',
    badgeAr: 'موقف',
    badgeEn: 'Parking',
    targetRoute: '/parking/booking',
    read: false,
    readAt: null,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
  },
  {
    id: 'notif-2',
    senderNameAr: 'المحفظة الرقمية',
    senderNameEn: 'Digital Wallet',
    titleAr: 'شحن رصيد المحفظة',
    titleEn: 'Wallet Top-Up',
    messageAr: 'تم إيداع 100 ر.س في محفظتك بنجاح.',
    messageEn: 'SAR 100 deposited into your wallet.',
    type: 'WALLET',
    badgeAr: 'محفظة',
    badgeEn: 'Wallet',
    targetRoute: '/wallet',
    read: true,
    readAt: new Date(Date.now() - 60 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
  },
];

describe('NotificationsModal Component (P7-03)', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <NotificationsModal
        isOpen={false}
        isAr={true}
        notifications={mockNotifications}
        onClose={vi.fn()}
        onMarkAllRead={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal dialog with notification list and unread count badge in Arabic', () => {
    render(
      <NotificationsModal
        isOpen={true}
        isAr={true}
        notifications={mockNotifications}
        unreadCount={1}
        onClose={vi.fn()}
        onMarkAllRead={vi.fn()}
      />
    );

    expect(screen.getByTestId('notifications-modal')).toBeInTheDocument();
    expect(screen.getByText('صندوق الإشعارات المباشرة')).toBeInTheDocument();
    expect(screen.getByText('تأكيد حجز موقف مسبق')).toBeInTheDocument();
    expect(screen.getByText('شحن رصيد المحفظة')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-unread-pill')).toHaveTextContent('1 جديد');
  });

  it('renders notifications in English when isAr is false', () => {
    render(
      <NotificationsModal
        isOpen={true}
        isAr={false}
        notifications={mockNotifications}
        unreadCount={1}
        onClose={vi.fn()}
        onMarkAllRead={vi.fn()}
      />
    );

    expect(screen.getByText('Direct Campus Alerts')).toBeInTheDocument();
    expect(screen.getByText('Parking Bay Reserved')).toBeInTheDocument();
    expect(screen.getByText('Wallet Top-Up')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-unread-pill')).toHaveTextContent('1 new');
  });

  it('filters notifications by Unread tab when clicked', () => {
    render(
      <NotificationsModal
        isOpen={true}
        isAr={true}
        notifications={mockNotifications}
        unreadCount={1}
        onClose={vi.fn()}
        onMarkAllRead={vi.fn()}
      />
    );

    // Both are visible initially
    expect(screen.getByText('تأكيد حجز موقف مسبق')).toBeInTheDocument();
    expect(screen.getByText('شحن رصيد المحفظة')).toBeInTheDocument();

    // Click Unread tab
    fireEvent.click(screen.getByTestId('notifications-tab-unread'));

    // Only unread notification is shown
    expect(screen.getByText('تأكيد حجز موقف مسبق')).toBeInTheDocument();
    expect(screen.queryByText('شحن رصيد المحفظة')).not.toBeInTheDocument();

    // Switch back to All Alerts tab
    fireEvent.click(screen.getByTestId('notifications-tab-all'));
    expect(screen.getByText('تأكيد حجز موقف مسبق')).toBeInTheDocument();
    expect(screen.getByText('شحن رصيد المحفظة')).toBeInTheDocument();
  });

  it('calls onMarkRead when an unread notification item is clicked', () => {
    const handleMarkRead = vi.fn();

    render(
      <NotificationsModal
        isOpen={true}
        isAr={true}
        notifications={mockNotifications}
        onClose={vi.fn()}
        onMarkRead={handleMarkRead}
        onMarkAllRead={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('notification-item-notif-1'));
    expect(handleMarkRead).toHaveBeenCalledWith('notif-1');

    // Clicking already read notification should not call handleMarkRead
    handleMarkRead.mockClear();
    fireEvent.click(screen.getByTestId('notification-item-notif-2'));
    expect(handleMarkRead).not.toHaveBeenCalled();
  });

  it('calls onMarkAllRead when Mark All Read button is clicked', () => {
    const handleMarkAllRead = vi.fn();

    render(
      <NotificationsModal
        isOpen={true}
        isAr={true}
        notifications={mockNotifications}
        unreadCount={1}
        onClose={vi.fn()}
        onMarkAllRead={handleMarkAllRead}
      />
    );

    fireEvent.click(screen.getByTestId('notifications-mark-all-btn'));
    expect(handleMarkAllRead).toHaveBeenCalledTimes(1);
  });

  it('navigates to target route and marks read when action button is clicked', () => {
    const handleNavigate = vi.fn();
    const handleMarkRead = vi.fn();

    render(
      <NotificationsModal
        isOpen={true}
        isAr={true}
        notifications={mockNotifications}
        onClose={vi.fn()}
        onMarkRead={handleMarkRead}
        onMarkAllRead={vi.fn()}
        onNavigate={handleNavigate}
      />
    );

    fireEvent.click(screen.getByTestId('navigate-btn-notif-1'));
    expect(handleNavigate).toHaveBeenCalledWith('/parking/booking');
    expect(handleMarkRead).toHaveBeenCalledWith('notif-1');
  });

  it('displays empty state when there are no notifications', () => {
    render(
      <NotificationsModal
        isOpen={true}
        isAr={true}
        notifications={[]}
        onClose={vi.fn()}
        onMarkAllRead={vi.fn()}
      />
    );

    expect(screen.getByTestId('notifications-empty-state')).toBeInTheDocument();
    expect(screen.getByText('صندوق الإشعارات فارغ')).toBeInTheDocument();
  });

  it('displays loading indicator when isLoading is true', () => {
    render(
      <NotificationsModal
        isOpen={true}
        isAr={true}
        notifications={[]}
        isLoading={true}
        onClose={vi.fn()}
        onMarkAllRead={vi.fn()}
      />
    );

    expect(screen.getByText('جاري تحديث صندوق الإشعارات...')).toBeInTheDocument();
  });

  it('invokes onClose when close button or backdrop is clicked', () => {
    const handleClose = vi.fn();

    render(
      <NotificationsModal
        isOpen={true}
        isAr={true}
        notifications={mockNotifications}
        onClose={handleClose}
        onMarkAllRead={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('notifications-close-btn'));
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('notifications-modal'));
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
