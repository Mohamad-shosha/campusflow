import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TopUpModal } from './TopUpModal';
import { walletApi } from '../api/walletApi';

vi.mock('../api/walletApi', () => ({
  walletApi: {
    topUp: vi.fn(),
  },
}));

describe('TopUpModal Component', () => {
  it('renders preset amounts and allows selecting preset', () => {
    render(<TopUpModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByTestId('top-up-modal')).toBeInTheDocument();
    expect(screen.getByTestId('preset-amount-50')).toBeInTheDocument();
    expect(screen.getByTestId('preset-amount-100')).toBeInTheDocument();
    expect(screen.getByTestId('preset-amount-500')).toBeInTheDocument();
  });

  it('submits top up request with selected amount', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    vi.mocked(walletApi.topUp).mockResolvedValueOnce({
      id: 'w-1',
      userId: 'u-1',
      balance: 1000,
      currency: 'SAR',
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    });

    render(<TopUpModal isOpen={true} onClose={handleClose} onSuccess={handleSuccess} />);

    fireEvent.click(screen.getByTestId('preset-amount-200'));
    fireEvent.click(screen.getByTestId('btn-confirm-topup'));

    await waitFor(() => {
      expect(walletApi.topUp).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 200,
          paymentMethod: 'MADA',
        })
      );
      expect(handleSuccess).toHaveBeenCalledTimes(1);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
