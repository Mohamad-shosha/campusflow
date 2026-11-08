export type NotificationType =
  'SYSTEM' | 'PARKING' | 'GATE' | 'WALLET' | 'TUTORING' | 'OFFICE_HOURS' | 'ROOM' | 'SECURITY';

export interface NotificationResponse {
  id: string;
  senderNameAr: string | null;
  senderNameEn: string | null;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  type: NotificationType;
  badgeAr: string | null;
  badgeEn: string | null;
  targetRoute: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface MarkAllReadResponse {
  success: boolean;
  markedCount: number;
  message: string;
}
