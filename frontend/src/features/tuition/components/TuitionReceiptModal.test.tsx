import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TuitionReceiptModal } from './TuitionReceiptModal';
import type { TuitionReceiptResponse } from '../types/tuition';

describe('TuitionReceiptModal Component', () => {
  const mockReceipt: TuitionReceiptResponse = {
    id: 'rct-100',
    receiptNumber: 'FBSU-RCT-2026-998877',
    invoiceNumber: 'INV-2026-CCIS-001',
    termNameEn: 'Fall Semester 2026/2027',
    amountPaid: 450.0,
    paymentMethod: 'DIGITAL_WALLET',
    verificationCode: 'FBSU-VERIFY-9988',
    qrContent: 'FBSU-RCT|FBSU-RCT-2026-998877|INV-2026-CCIS-001|450.00|SAR|FBSU-VERIFY-9988',
    studentNameEn: 'Ahmed M. Al-Atwi',
    studentUniversityNumber: 'STD-202410101',
    createdAt: '2026-11-05T14:30:00Z',
  };

  it('renders official receipt details, verification code, and QR barcode', () => {
    render(<TuitionReceiptModal isOpen={true} receipt={mockReceipt} onClose={vi.fn()} />);

    expect(screen.getByTestId('tuition-receipt-modal')).toBeInTheDocument();
    expect(screen.getByTestId('receipt-number')).toHaveTextContent('FBSU-RCT-2026-998877');
    expect(screen.getByTestId('receipt-verification-code')).toHaveTextContent('FBSU-VERIFY-9988');
    expect(screen.getByTestId('receipt-qr-container')).toBeInTheDocument();
    expect(screen.getByText(/450\.00/)).toBeInTheDocument();
  });

  it('triggers window.print when print button is clicked', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<TuitionReceiptModal isOpen={true} receipt={mockReceipt} onClose={vi.fn()} />);

    fireEvent.click(screen.getByTestId('btn-print-receipt'));
    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });
});
