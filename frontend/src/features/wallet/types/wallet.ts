export type WalletStatus = 'ACTIVE' | 'FROZEN' | 'SUSPENDED';

export type TransactionType =
  | 'TOP_UP'
  | 'P2P_TRANSFER'
  | 'PEER_TRANSFER'
  | 'TUITION_PAYMENT'
  | 'PARKING_FEE'
  | 'PARKING_REWARD'
  | 'REFUND'
  | 'CAMPUS_PURCHASE'
  | 'CAFETERIA_PURCHASE'
  | 'BOOKSTORE_PURCHASE'
  | 'LIBRARY_FINE'
  | 'ADMIN_ADJUSTMENT';

export type TransactionDirection = 'CREDIT' | 'DEBIT';

export interface WalletResponse {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  status: WalletStatus;
  updatedAt: string;
}

export interface LedgerEntryResponse {
  id: string;
  transactionType: TransactionType;
  direction: TransactionDirection;
  amount: number;
  balanceAfter: number;
  referenceId: string;
  description: string;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface TopUpRequest {
  amount: number;
  paymentMethod: 'MADA' | 'APPLE_PAY' | 'CREDIT_CARD';
  idempotencyKey: string;
}

export interface TransferRequest {
  recipientIdentifier: string;
  amount: number;
  description?: string | undefined;
  idempotencyKey: string;
}
