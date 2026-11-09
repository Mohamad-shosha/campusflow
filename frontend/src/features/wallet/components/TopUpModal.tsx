import { type FC, type SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Smartphone, AlertCircle } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { walletApi } from '../api/walletApi';
import type { WalletResponse } from '../types/wallet';

export interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedWallet: WalletResponse) => void;
}

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000];

export const TopUpModal: FC<TopUpModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'MADA' | 'APPLE_PAY' | 'CREDIT_CARD'>('MADA');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const effectiveAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setErrorMessage(null);
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount <= 0) {
      setErrorMessage(
        isAr ? 'الرجاء إدخال مبلغ صحيح أكبر من صفر.' : 'Please enter a valid amount greater than 0.'
      );
      return;
    }
    if (effectiveAmount > 50000) {
      setErrorMessage(
        isAr
          ? 'الحد الأقصى لعملية الشحن الواحدة هو 50,000 ر.س.'
          : 'Maximum single top-up limit is 50,000 SAR.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const idempotencyKey =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? `topup-${crypto.randomUUID()}`
        : `topup-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    try {
      const updatedWallet = await walletApi.topUp({
        amount: effectiveAmount,
        paymentMethod,
        idempotencyKey,
      });
      onSuccess(updatedWallet);
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string; message?: string } } };
      const detail = axiosErr.response?.data?.detail || axiosErr.response?.data?.message;
      setErrorMessage(
        detail ||
          (isAr ? 'فشلت عملية الشحن. يرجى المحاولة مرة أخرى.' : 'Top-up failed. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAr ? 'شحن رصيد المحفظة الجامعية' : 'Top Up Campus Wallet'}
      testId="top-up-modal"
      maxWidth="480px"
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

        {/* Preset Amounts */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            {isAr ? 'اختر المبلغ (ر.س)' : 'Select Amount (SAR)'}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
            {PRESET_AMOUNTS.map(amt => {
              const isSelected = !customAmount && selectedAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectPreset(amt)}
                  style={{
                    padding: '0.6rem 0.25rem',
                    borderRadius: '8px',
                    border: isSelected
                      ? '1.5px solid var(--fbsu-gold)'
                      : '1px solid var(--border-color)',
                    background: isSelected ? 'rgba(215, 162, 55, 0.2)' : 'var(--surface-soft)',
                    color: isSelected ? 'var(--fbsu-gold)' : 'var(--text-main)',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  data-testid={`preset-amount-${amt}`}
                >
                  {amt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            {isAr ? 'أو أدخل مبلغاً آخر' : 'Or enter custom amount'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              min="1"
              max="50000"
              step="any"
              placeholder={isAr ? 'أدخل المبلغ بالريال السعودي...' : 'Enter amount in SAR...'}
              value={customAmount}
              onChange={e => handleCustomChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--surface-soft)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
              data-testid="input-custom-amount"
            />
          </div>
        </div>

        {/* Payment Channel Selection */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            {isAr ? 'وسيلة الدفع' : 'Payment Method'}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[
              { id: 'MADA', nameAr: 'مدى mada', nameEn: 'Mada', icon: <CreditCard size={18} /> },
              {
                id: 'APPLE_PAY',
                nameAr: 'Apple Pay',
                nameEn: 'Apple Pay',
                icon: <Smartphone size={18} />,
              },
              {
                id: 'CREDIT_CARD',
                nameAr: 'بطاقة ائتمانية',
                nameEn: 'Credit Card',
                icon: <CreditCard size={18} />,
              },
            ].map(m => {
              const active = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as 'MADA' | 'APPLE_PAY' | 'CREDIT_CARD')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: '8px',
                    border: active
                      ? '1.5px solid var(--fbsu-gold)'
                      : '1px solid var(--border-color)',
                    background: active ? 'rgba(215, 162, 55, 0.15)' : 'var(--surface-soft)',
                    color: active ? 'var(--fbsu-gold)' : 'var(--text-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                  data-testid={`payment-method-${m.id.toLowerCase()}`}
                >
                  {m.icon}
                  <span>{isAr ? m.nameAr : m.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary & Submit */}
        <div style={{ marginTop: '0.5rem' }}>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            fullWidth
            isLoading={isLoading}
            testId="btn-confirm-topup"
          >
            {isAr
              ? `تأكيد الشحن بمبلغ ${effectiveAmount || 0} ر.س`
              : `Confirm Top-Up: ${effectiveAmount || 0} SAR`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
