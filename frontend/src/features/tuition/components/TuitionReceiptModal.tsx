import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Printer, ShieldCheck } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { QR } from '../../../shared/components/QR';
import type { TuitionReceiptResponse } from '../types/tuition';

export interface TuitionReceiptModalProps {
  isOpen: boolean;
  receipt: TuitionReceiptResponse | null;
  onClose: () => void;
}

export const TuitionReceiptModal: FC<TuitionReceiptModalProps> = ({ isOpen, receipt, onClose }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = (() => {
    try {
      const d = new Date(receipt.createdAt);
      return new Intl.DateTimeFormat(isAr ? 'ar-SA' : 'en-US', {
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(d);
    } catch {
      return receipt.createdAt;
    }
  })();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAr ? 'إيصال سداد مالي معتمد' : 'Verified Tuition Payment Receipt'}
      testId="tuition-receipt-modal"
      maxWidth="560px"
    >
      <div
        className="receipt-printable-container"
        data-testid="tuition-receipt-card"
        style={{
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(13, 27, 42, 0.95) 100%)',
          border: '1.5px solid var(--fbsu-gold-border)',
          borderRadius: '14px',
          padding: '1.75rem',
          position: 'relative',
        }}
      >
        {/* Receipt Header */}
        <div
          style={{
            textAlign: 'center',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.4rem',
            }}
          >
            <img src="/assets/branding/fbsu-logo.png" alt="FBSU" style={{ height: '32px' }} />
            <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>
              {isAr ? 'جامعة فهد بن سلطان' : 'Fahad Bin Sultan University'}
            </span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '0.78rem',
              fontWeight: 800,
            }}
          >
            <ShieldCheck size={14} />
            <span>
              {isAr
                ? 'إيصال إلكتروني معتمد ومسجل بالدفتر المالي'
                : 'Official Digitally Verified Receipt'}
            </span>
          </div>
        </div>

        {/* Receipt Key Info Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.85rem',
            fontSize: '0.86rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>
              {isAr ? 'رقم الإيصال الرسمي' : 'Official Receipt No'}
            </span>
            <strong
              style={{ color: 'var(--fbsu-gold)', fontFamily: 'monospace', fontSize: '0.95rem' }}
              data-testid="receipt-number"
            >
              {receipt.receiptNumber}
            </strong>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>
              {isAr ? 'رقم الفاتورة المرتبطة' : 'Invoice Reference'}
            </span>
            <strong
              style={{ color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.92rem' }}
            >
              {receipt.invoiceNumber}
            </strong>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>
              {isAr ? 'اسم الطالب / المسدد' : 'Student / Payer'}
            </span>
            <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
              {receipt.studentNameEn}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>
              {isAr ? 'الرقم الجامعي' : 'University ID'}
            </span>
            <span style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>
              {receipt.studentUniversityNumber}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>
              {isAr ? 'الفصل الدراسي' : 'Academic Term'}
            </span>
            <span style={{ color: 'var(--text-main)' }}>{receipt.termNameEn}</span>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>
              {isAr ? 'وسيلة السداد' : 'Payment Method'}
            </span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>
              {isAr ? 'المحفظة الجامعية الرقمية' : 'Digital Campus Wallet'}
            </span>
          </div>
        </div>

        {/* Amount Box */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '10px',
            background: 'rgba(215, 162, 55, 0.12)',
            border: '1px solid rgba(215, 162, 55, 0.35)',
            textAlign: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <span
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              display: 'block',
              marginBottom: '0.2rem',
            }}
          >
            {isAr ? 'المبلغ المسدد المعتمد' : 'Amount Settled'}
          </span>
          <div
            style={{
              fontSize: '2.1rem',
              fontWeight: 900,
              color: 'var(--fbsu-gold)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {Number(receipt.amountPaid).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formattedDate}</span>
        </div>

        {/* QR & Verification Code */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>
              {isAr ? 'رمز التحقق الأمني الإلكتروني' : 'Security Verification Code'}
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.88rem',
                color: 'var(--text-main)',
                letterSpacing: '0.5px',
                fontWeight: 700,
              }}
              data-testid="receipt-verification-code"
            >
              {receipt.verificationCode}
            </span>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {isAr
                ? 'امسح الرمز للتحقق من صحة القيد المحاسبي.'
                : 'Scan QR to verify institutional ledger record.'}
            </p>
          </div>

          <div
            style={{
              padding: '0.4rem',
              background: '#fff',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            data-testid="receipt-qr-container"
          >
            <QR value={receipt.qrContent} size={88} />
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={<Printer size={15} />}
            onClick={handlePrint}
            testId="btn-print-receipt"
          >
            {isAr ? 'طباعة الإيصال' : 'Print Receipt'}
          </Button>

          <Button
            type="button"
            variant="gold"
            size="md"
            onClick={onClose}
            testId="btn-close-receipt"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
