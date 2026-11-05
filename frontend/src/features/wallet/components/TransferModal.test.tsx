import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransferModal } from './TransferModal';
import { walletApi } from '../api/walletApi';

vi.mock('../api/walletApi', () => ({
  walletApi: {
    transfer: vi.fn(),
  },
}));

describe('TransferModal Component', () => {
  it('validates recipient and insufficient balance before submit', async () => {
    render(
      <TransferModal
        isOpen={true}
        availableBalance={100}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('btn-confirm-transfer'));
    expect(screen.getByText(/Please enter recipient university number|الرجاء إدخال الرقم الجامعي للمستلم/)).toBeInTheDocument();

    // Fill recipient and amount exceeding balance
    fireEvent.change(screen.getByTestId('input-transfer-recipient'), {
      target: { value: 'STD-202410102' },
    });
    fireEvent.change(screen.getByTestId('input-transfer-amount'), {
      target: { value: '250' },
    });

    fireEvent.click(screen.getByTestId('btn-confirm-transfer'));

    await waitFor(() => {
      expect(screen.getByText(/Insufficient funds|الرصيد المتاح غير كافٍ/)).toBeInTheDocument();
      expect(walletApi.transfer).not.toHaveBeenCalled();
    });
  });

  it('submits valid transfer successfully', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    vi.mocked(walletApi.transfer).mockResolvedValueOnce({
      id: 'w-1',
      userId: 'u-1',
      balance: 50,
      currency: 'SAR',
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    });

    render(
      <TransferModal
        isOpen={true}
        availableBalance={100}
        currentUniversityNumber="STD-202410101"
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    fireEvent.change(screen.getByTestId('input-transfer-recipient'), {
      target: { value: 'STD-202410102' },
    });
    fireEvent.change(screen.getByTestId('input-transfer-amount'), {
      target: { value: '50' },
    });

    fireEvent.click(screen.getByTestId('btn-confirm-transfer'));

    await waitFor(() => {
      expect(walletApi.transfer).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientIdentifier: 'STD-202410102',
          amount: 50,
        })
      );
      expect(handleSuccess).toHaveBeenCalledTimes(1);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
