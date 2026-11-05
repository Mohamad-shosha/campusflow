import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LedgerTable } from './LedgerTable';
import type { Page, LedgerEntryResponse } from '../types/wallet';

describe('LedgerTable Component', () => {
  const mockPage: Page<LedgerEntryResponse> = {
    content: [
      {
        id: 'entry-1',
        transactionType: 'TOP_UP',
        direction: 'CREDIT',
        amount: 200,
        balanceAfter: 700,
        referenceId: 'REF-TOP-001',
        description: 'Account top-up via Mada',
        createdAt: '2026-11-05T12:00:00Z',
      },
      {
        id: 'entry-2',
        transactionType: 'TUITION_PAYMENT',
        direction: 'DEBIT',
        amount: 300,
        balanceAfter: 400,
        referenceId: 'INV-2026-CCIS-001',
        description: 'Tuition installment settlement',
        createdAt: '2026-11-05T13:00:00Z',
      },
    ],
    totalPages: 2,
    totalElements: 2,
    size: 15,
    number: 0,
    first: true,
    last: false,
  };

  it('renders ledger entries with credit and debit directions', () => {
    render(<LedgerTable ledgerPage={mockPage} onPageChange={vi.fn()} />);

    expect(screen.getByTestId('ledger-table')).toBeInTheDocument();
    expect(screen.getByTestId('ledger-row-entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('ledger-row-entry-2')).toBeInTheDocument();
    expect(screen.getByText(/\+200\.00/)).toBeInTheDocument();
    expect(screen.getByText(/-300\.00/)).toBeInTheDocument();
  });

  it('filters entries using search input', () => {
    render(<LedgerTable ledgerPage={mockPage} onPageChange={vi.fn()} />);

    const searchInput = screen.getByTestId('input-ledger-search');
    fireEvent.change(searchInput, { target: { value: 'Tuition' } });

    expect(screen.queryByTestId('ledger-row-entry-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('ledger-row-entry-2')).toBeInTheDocument();
  });
});
