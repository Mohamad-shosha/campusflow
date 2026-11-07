export type InvoiceStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';

export interface TuitionInvoiceResponse {
  id: string;
  invoiceNumber: string;
  termId: string;
  termCode: string;
  termNameAr: string;
  termNameEn: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
}

export interface TuitionReceiptResponse {
  id: string;
  receiptNumber: string;
  invoiceNumber: string;
  termNameEn: string;
  amountPaid: number;
  paymentMethod: string;
  verificationCode: string;
  qrContent: string;
  studentNameEn: string;
  studentUniversityNumber: string;
  createdAt: string;
}

export interface PayTuitionRequest {
  invoiceId: string;
  amount: number;
  idempotencyKey: string;
}
