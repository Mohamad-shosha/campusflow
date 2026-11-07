import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PayTuitionModal } from './PayTuitionModal';
import { tuitionApi } from '../api/tuitionApi';
import type { TuitionInvoiceResponse } from '../types/tuition';

vi.mock('../api/tuitionApi', () => ({
  tuitionApi: {
    payTuition: vi.fn(),
  },
}));

describe('PayTuitionModal Component', () => {
  const mockInvoice: TuitionInvoiceResponse = {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-CCIS-001',
    termId: 'term-1',
    termCode: '2026-FALL',
    termNameAr: 'الفصل الدراسي الأول',
    termNameEn: 'Fall Semester',
    totalAmount: 1000.0,
    paidAmount: 0.0,
    remainingAmount: 1000.0,
    status: 'UNPAID',
    dueDate: '2026-11-30',
    createdAt: new Date().toISOString(),
  };

  it('renders modal with full payment preset and wallet balance', () => {
    render(
      <PayTuitionModal
        isOpen={true}
        invoice={mockInvoice}
        walletBalance={1500}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByTestId('pay-tuition-modal')).toBeInTheDocument();
    expect(screen.getByText('INV-2026-CCIS-001')).toBeInTheDocument();
    expect(screen.getByTestId('pay-mode-full')).toBeInTheDocument();
    expect(screen.getByTestId('pay-mode-custom')).toBeInTheDocument();
  });

  it('executes tuition payment and calls onSuccess callback', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    vi.mocked(tuitionApi.payTuition).mockResolvedValueOnce({
      id: 'rct-1',
      receiptNumber: 'FBSU-RCT-2026-123456',
      invoiceNumber: 'INV-2026-CCIS-001',
      termNameEn: 'Fall Semester',
      amountPaid: 1000,
      paymentMethod: 'DIGITAL_WALLET',
      verificationCode: 'FBSU-VERIFY-1234',
      qrContent: 'FBSU-RCT|FBSU-RCT-2026-123456',
      studentNameEn: 'Ahmed Al-Atwi',
      studentUniversityNumber: 'STD-202410101',
      createdAt: new Date().toISOString(),
    });

    render(
      <PayTuitionModal
        isOpen={true}
        invoice={mockInvoice}
        walletBalance={1500}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    fireEvent.click(screen.getByTestId('btn-confirm-tuition-pay'));

    await waitFor(() => {
      expect(tuitionApi.payTuition).toHaveBeenCalledWith(
        expect.objectContaining({
          invoiceId: 'inv-1',
          amount: 1000,
        })
      );
      expect(handleSuccess).toHaveBeenCalledTimes(1);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
