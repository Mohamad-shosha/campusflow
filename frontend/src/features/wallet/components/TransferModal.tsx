import { type FC, type SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, AlertCircle } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { walletApi } from '../api/walletApi';
import type { WalletResponse } from '../types/wallet';

export interface TransferModalProps {
  isOpen: boolean;
  availableBalance: number;
  currentUniversityNumber?: string | undefined;
  onClose: () => void;
  onSuccess: (updatedWallet: WalletResponse) => void;
}

export const TransferModal: FC<TransferModalProps> = ({
  isOpen,
  availableBalance,
  currentUniversityNumber,
  onClose,
  onSuccess,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (!recipient.trim()) {
      setErrorMessage(
        isAr ? 'الرجاء إدخال الرقم الجامعي للمستلم.' : 'Please enter recipient university number.'
      );
      return;
    }

    if (
      currentUniversityNumber &&
      recipient.trim().toUpperCase() === currentUniversityNumber.toUpperCase()
    ) {
      setErrorMessage(
        isAr ? 'لا يمكن تحويل رصيد إلى نفس الحساب.' : 'Cannot transfer funds to yourself.'
      );
      return;
    }

    if (!numAmount || numAmount <= 0) {
      setErrorMessage(
        isAr ? 'الرجاء إدخال مبلغ صحيح أكبر من صفر.' : 'Please enter a valid amount greater than 0.'
      );
      return;
    }

    if (numAmount > availableBalance) {
      setErrorMessage(
        isAr
          ? `الرصيد المتاح غير كافٍ. رصيدك الحالي هو ${availableBalance.toFixed(2)} ر.س.`
          : `Insufficient funds. Your current available balance is ${availableBalance.toFixed(2)} SAR.`
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const idempotencyKey =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? `xfer-${crypto.randomUUID()}`
        : `xfer-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    try {
      const updated = await walletApi.transfer({
        recipientIdentifier: recipient.trim(),
        amount: numAmount,
        description: note.trim() || undefined,
        idempotencyKey,
      });
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string; message?: string } } };
      const detail = axiosErr.response?.data?.detail || axiosErr.response?.data?.message;
      setErrorMessage(
        detail ||
          (isAr
            ? 'فشلت عملية التحويل. تأكد من الرقم الجامعي وصلاحية الرصيد.'
            : 'Transfer failed. Please check recipient ID and available balance.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAr ? 'تحويل رصيد فوري إلى مستخدم آخر' : 'Peer-to-Peer Balance Transfer'}
      testId="transfer-modal"
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

        {/* Recipient */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            {isAr
              ? 'الرقم الجامعي للمستلم (طالب / موظف / عضو هيئة تدريس)'
              : 'Recipient University Number (Student/Staff/Faculty)'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder={
                isAr ? 'مثال: STD-202410102 أو 202410102' : 'e.g. STD-202410102 or 202410102'
              }
              value={recipient}
              onChange={e => {
                setRecipient(e.target.value);
                setErrorMessage(null);
              }}
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
              data-testid="input-transfer-recipient"
            />
          </div>
        </div>

        {/* Amount */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isAr ? 'المبلغ المراد تحويله (ر.س)' : 'Transfer Amount (SAR)'}
            </label>
            <span style={{ fontSize: '0.78rem', color: 'var(--gold-text)' }}>
              {isAr
                ? `المتاح: ${availableBalance.toFixed(2)} ر.س`
                : `Available: ${availableBalance.toFixed(2)} SAR`}
            </span>
          </div>
          <input
            type="number"
            min="1"
            max={availableBalance}
            step="any"
            placeholder={isAr ? 'أدخل المبلغ...' : 'Enter amount...'}
            value={amount}
            onChange={e => {
              setAmount(e.target.value);
              setErrorMessage(null);
            }}
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
            data-testid="input-transfer-amount"
          />
        </div>

        {/* Note */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            {isAr ? 'ملاحظة أو بيان التحويل (اختياري)' : 'Transfer Note / Reference (Optional)'}
          </label>
          <input
            type="text"
            placeholder={
              isAr
                ? 'مثال: سداد وجبة، استرداد رسوم، مشاركة...'
                : 'e.g. Lunch split, notes sharing...'
            }
            value={note}
            onChange={e => setNote(e.target.value)}
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
            data-testid="input-transfer-note"
          />
        </div>

        {/* Submit */}
        <div style={{ marginTop: '0.5rem' }}>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            fullWidth
            isLoading={isLoading}
            icon={<Send size={16} />}
            testId="btn-confirm-transfer"
          >
            {isAr ? `تأكيد تحويل ${amount || 0} ر.س` : `Confirm Transfer: ${amount || 0} SAR`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
