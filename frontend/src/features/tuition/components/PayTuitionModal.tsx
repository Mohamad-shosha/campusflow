import { type FC, type SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, AlertCircle } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { tuitionApi } from '../api/tuitionApi';
import type { TuitionInvoiceResponse, TuitionReceiptResponse } from '../types/tuition';

export interface PayTuitionModalProps {
  isOpen: boolean;
  invoice: TuitionInvoiceResponse | null;
  walletBalance: number;
  onClose: () => void;
  onSuccess: (receipt: TuitionReceiptResponse) => void;
  onOpenTopUp?: (() => void) | undefined;
}

export const PayTuitionModal: FC<PayTuitionModalProps> = ({
  isOpen,
  invoice,
  walletBalance,
  onClose,
  onSuccess,
  onOpenTopUp,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const [paymentMode, setPaymentMode] = useState<'FULL' | 'CUSTOM'>('FULL');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!invoice) return null;

  const remaining = Number(invoice.remainingAmount);
  const effectiveAmount = paymentMode === 'FULL' ? remaining : parseFloat(customAmount);
  const hasEnoughBalance = walletBalance >= (effectiveAmount || 0);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!effectiveAmount || effectiveAmount <= 0) {
      setErrorMessage(
        isAr ? 'الرجاء إدخال مبلغ سداد صحيح.' : 'Please enter a valid payment amount.'
      );
      return;
    }

    if (effectiveAmount > remaining) {
      setErrorMessage(
        isAr
          ? `المبلغ المدخل (${effectiveAmount} ر.س) يتجاوز الرصيد المتبقي على الفاتورة (${remaining} ر.س).`
          : `Payment amount (${effectiveAmount} SAR) exceeds remaining invoice balance (${remaining} SAR).`
      );
      return;
    }

    if (effectiveAmount > walletBalance) {
      setErrorMessage(
        isAr
          ? `رصيد المحفظة الحالي (${walletBalance.toFixed(2)} ر.س) غير كافٍ لسداد هذا المبلغ.`
          : `Wallet balance (${walletBalance.toFixed(2)} SAR) is insufficient for this settlement.`
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const idempotencyKey =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? `tuition-pay-${crypto.randomUUID()}`
        : `tuition-pay-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    try {
      const receipt = await tuitionApi.payTuition({
        invoiceId: invoice.id,
        amount: effectiveAmount,
        idempotencyKey,
      });
      onSuccess(receipt);
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string; message?: string } } };
      const detail = axiosErr.response?.data?.detail || axiosErr.response?.data?.message;
      setErrorMessage(
        detail ||
          (isAr
            ? 'فشلت عملية سداد الرسوم. يرجى مراجعة الرصيد والمحاولة مرة أخرى.'
            : 'Tuition payment failed. Please check wallet balance and try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAr ? 'سداد الرسوم الدراسية من المحفظة' : 'Pay Tuition via Digital Wallet'}
      testId="pay-tuition-modal"
      maxWidth="500px"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >
        {errorMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Invoice Brief Summary */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {isAr ? 'رقم الفاتورة:' : 'Invoice No:'}
            </span>
            <strong
              style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'monospace' }}
            >
              {invoice.invoiceNumber}
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {isAr ? 'الفصل الأكاديمي:' : 'Academic Term:'}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
              {isAr ? invoice.termNameAr : invoice.termNameEn}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '0.5rem',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isAr ? 'المبلغ المتبقي المطلوب:' : 'Remaining Balance Due:'}
            </span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--fbsu-gold)' }}>
              {remaining.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
            </strong>
          </div>
        </div>

        {/* Wallet Balance Status */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            background: hasEnoughBalance ? 'rgba(17, 110, 99, 0.15)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${hasEnoughBalance ? 'rgba(17, 110, 99, 0.35)' : 'rgba(239, 68, 68, 0.3)'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wallet size={16} color={hasEnoughBalance ? 'var(--status-available)' : '#f87171'} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {isAr ? 'رصيد محفظتك المتاح:' : 'Your Wallet Balance:'}
            </span>
          </div>
          <strong style={{ fontSize: '1rem', color: hasEnoughBalance ? '#10b981' : '#f87171' }}>
            {walletBalance.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
          </strong>
        </div>

        {/* Payment Amount Choice */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            {isAr ? 'تحديد خيار السداد' : 'Payment Option'}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                setPaymentMode('FULL');
                setErrorMessage(null);
              }}
              style={{
                padding: '0.75rem 0.5rem',
                borderRadius: '8px',
                border:
                  paymentMode === 'FULL'
                    ? '1.5px solid var(--fbsu-gold)'
                    : '1px solid var(--border-color)',
                background:
                  paymentMode === 'FULL' ? 'rgba(215, 162, 55, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: paymentMode === 'FULL' ? 'var(--fbsu-gold)' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
              data-testid="pay-mode-full"
            >
              {isAr
                ? `سداد كامل (${remaining.toFixed(2)} ر.س)`
                : `Full (${remaining.toFixed(2)} SAR)`}
            </button>

            <button
              type="button"
              onClick={() => {
                setPaymentMode('CUSTOM');
                setErrorMessage(null);
              }}
              style={{
                padding: '0.75rem 0.5rem',
                borderRadius: '8px',
                border:
                  paymentMode === 'CUSTOM'
                    ? '1.5px solid var(--fbsu-gold)'
                    : '1px solid var(--border-color)',
                background:
                  paymentMode === 'CUSTOM'
                    ? 'rgba(215, 162, 55, 0.18)'
                    : 'rgba(255, 255, 255, 0.03)',
                color: paymentMode === 'CUSTOM' ? 'var(--fbsu-gold)' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
              data-testid="pay-mode-custom"
            >
              {isAr ? 'سداد دفعة جزئية' : 'Partial Installment'}
            </button>
          </div>
        </div>

        {paymentMode === 'CUSTOM' && (
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              {isAr ? 'أدخل مبلغ الدفعة (ر.س)' : 'Installment Amount (SAR)'}
            </label>
            <input
              type="number"
              min="1"
              max={Math.min(remaining, walletBalance)}
              step="any"
              placeholder={isAr ? 'أدخل المبلغ...' : 'Enter installment amount...'}
              value={customAmount}
              onChange={e => {
                setCustomAmount(e.target.value);
                setErrorMessage(null);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
              data-testid="input-tuition-custom-amount"
            />
          </div>
        )}

        {/* Warning if insufficient balance */}
        {!hasEnoughBalance && onOpenTopUp && (
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                fontSize: '0.82rem',
                color: '#f87171',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              {isAr ? 'رصيدك لا يكفي لإتمام هذه العملية.' : 'Insufficient wallet balance.'}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onOpenTopUp();
              }}
            >
              {isAr ? 'شحن المحفظة الآن' : 'Top Up Wallet Now'}
            </Button>
          </div>
        )}

        {/* Submit Button */}
        <div style={{ marginTop: '0.5rem' }}>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={!hasEnoughBalance && effectiveAmount > walletBalance}
            testId="btn-confirm-tuition-pay"
          >
            {isAr
              ? `تأكيد سداد ${effectiveAmount || 0} ر.س من المحفظة`
              : `Confirm Payment: ${effectiveAmount || 0} SAR`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
