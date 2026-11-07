import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BalanceCard } from './BalanceCard';
import type { WalletResponse } from '../types/wallet';

describe('BalanceCard Component', () => {
  const mockWallet: WalletResponse = {
    id: 'w-1',
    userId: 'u-1',
    balance: 850.5,
    currency: 'SAR',
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
  };

  it('renders balance amount and currency correctly', () => {
    render(
      <BalanceCard
        wallet={mockWallet}
        onRefresh={vi.fn()}
        onOpenTopUp={vi.fn()}
        onOpenTransfer={vi.fn()}
      />
    );

    expect(screen.getByTestId('wallet-balance-card')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-balance-amount')).toHaveTextContent('850.50');
  });

  it('triggers onOpenTopUp when Top Up button is clicked', () => {
    const handleTopUp = vi.fn();
    render(
      <BalanceCard
        wallet={mockWallet}
        onRefresh={vi.fn()}
        onOpenTopUp={handleTopUp}
        onOpenTransfer={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('btn-open-topup'));
    expect(handleTopUp).toHaveBeenCalledTimes(1);
  });

  it('triggers onOpenTransfer when Transfer button is clicked', () => {
    const handleTransfer = vi.fn();
    render(
      <BalanceCard
        wallet={mockWallet}
        onRefresh={vi.fn()}
        onOpenTopUp={vi.fn()}
        onOpenTransfer={handleTransfer}
      />
    );

    fireEvent.click(screen.getByTestId('btn-open-transfer'));
    expect(handleTransfer).toHaveBeenCalledTimes(1);
  });
});
