import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TuitionInvoiceCard } from './TuitionInvoiceCard';
import type { TuitionInvoiceResponse } from '../types/tuition';

describe('TuitionInvoiceCard Component', () => {
  const mockInvoice: TuitionInvoiceResponse = {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-CCIS-001',
    termId: 'term-1',
    termCode: '2026-FALL',
    termNameAr: 'الفصل الدراسي الأول',
    termNameEn: 'Fall Semester 2026/2027',
    totalAmount: 1200.0,
    paidAmount: 500.0,
    remainingAmount: 700.0,
    status: 'PARTIALLY_PAID',
    dueDate: '2026-11-30',
    createdAt: new Date().toISOString(),
  };

  it('renders invoice details, amounts, and status correctly', () => {
    render(<TuitionInvoiceCard invoice={mockInvoice} onPay={vi.fn()} />);

    expect(screen.getByTestId('tuition-invoice-inv-1')).toBeInTheDocument();
    expect(screen.getByText('INV-2026-CCIS-001')).toBeInTheDocument();
    expect(screen.getByText(/1200\.00/)).toBeInTheDocument();
    expect(screen.getByText(/500\.00/)).toBeInTheDocument();
    expect(screen.getByText(/700\.00/)).toBeInTheDocument();
  });

  it('triggers onPay when pay button is clicked', () => {
    const handlePay = vi.fn();
    render(<TuitionInvoiceCard invoice={mockInvoice} onPay={handlePay} />);

    fireEvent.click(screen.getByTestId('btn-pay-tuition-inv-1'));
    expect(handlePay).toHaveBeenCalledWith(mockInvoice);
  });
});

