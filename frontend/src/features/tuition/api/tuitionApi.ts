import { apiClient } from '../../../shared/http/apiClient';
import type {
  TuitionInvoiceResponse,
  TuitionReceiptResponse,
  PayTuitionRequest,
} from '../types/tuition';

export const tuitionApi = {
  getStudentInvoices: async (): Promise<TuitionInvoiceResponse[]> => {
    const response = await apiClient.get<TuitionInvoiceResponse[]>('/tuition/invoices');
    return response.data;
  },

  getInvoiceDetails: async (invoiceId: string): Promise<TuitionInvoiceResponse> => {
    const response = await apiClient.get<TuitionInvoiceResponse>(`/tuition/invoices/${invoiceId}`);
    return response.data;
  },

  payTuition: async (request: PayTuitionRequest): Promise<TuitionReceiptResponse> => {
    const response = await apiClient.post<TuitionReceiptResponse>('/tuition/pay', request);
    return response.data;
  },

  getStudentReceipts: async (): Promise<TuitionReceiptResponse[]> => {
    const response = await apiClient.get<TuitionReceiptResponse[]>('/tuition/receipts');
    return response.data;
  },

  getReceiptDetails: async (receiptId: string): Promise<TuitionReceiptResponse> => {
    const response = await apiClient.get<TuitionReceiptResponse>(`/tuition/receipts/${receiptId}`);
    return response.data;
  },
};
