import { apiClient } from '../../../shared/http/apiClient';
import type {
  WalletResponse,
  LedgerEntryResponse,
  Page,
  TopUpRequest,
  TransferRequest,
} from '../types/wallet';

export const walletApi = {
  getWallet: async (): Promise<WalletResponse> => {
    const response = await apiClient.get<WalletResponse>('/wallet');
    return response.data;
  },

  getLedgerHistory: async (page = 0, size = 15): Promise<Page<LedgerEntryResponse>> => {
    const response = await apiClient.get<Page<LedgerEntryResponse>>('/wallet/ledger', {
      params: { page, size },
    });
    return response.data;
  },

  topUp: async (request: TopUpRequest): Promise<WalletResponse> => {
    const response = await apiClient.post<WalletResponse>('/wallet/top-up', request);
    return response.data;
  },

  transfer: async (request: TransferRequest): Promise<WalletResponse> => {
    const response = await apiClient.post<WalletResponse>('/wallet/transfer', request);
    return response.data;
  },
};

