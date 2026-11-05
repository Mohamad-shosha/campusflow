import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, CreditCard, FileText } from 'lucide-react';
import { Badge, type BadgeVariant } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import type { TuitionInvoiceResponse, InvoiceStatus } from '../types/tuition';

export interface TuitionInvoiceCardProps {
  invoice: TuitionInvoiceResponse;
  onPay: (invoice: TuitionInvoiceResponse) => void;
  onViewReceipts?: ((invoice: TuitionInvoiceResponse) => void) | undefined;
}

export const TuitionInvoiceCard: FC<TuitionInvoiceCardProps> = ({
  invoice,
  onPay,
  onViewReceipts,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const getStatusBadge = (status: InvoiceStatus): { textAr: string; textEn: string; variant: BadgeVariant } => {
    switch (status) {
      case 'PAID':
        return { textAr: 'مسدد بالكامل', textEn: 'Fully Paid', variant: 'available' };
      case 'PARTIALLY_PAID':
        return { textAr: 'مسدد جزئياً', textEn: 'Partially Paid', variant: 'gold' };
      case 'UNPAID':
      default:
        return { textAr: 'مستحق السداد', textEn: 'Payment Due', variant: 'occupied' };
    }
  };

  const statusInfo = getStatusBadge(invoice.status);
  const isFullyPaid = invoice.status === 'PAID';
  const termName = isAr ? invoice.termNameAr : invoice.termNameEn;

  return (
    <div
      className="glass-panel"
      data-testid={`tuition-invoice-${invoice.id}`}
      style={{
        borderRadius: '14px',
        padding: '1.5rem',
        marginBottom: '1rem',
        border: '1px solid var(--border-color)',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <FileText size={17} color="var(--fbsu-gold)" />
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {invoice.invoiceNumber}
            </h4>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {termName} ({invoice.termCode})
          </span>
        </div>

        <Badge variant={statusInfo.variant} dot>
          {isAr ? statusInfo.textAr : statusInfo.textEn}
        </Badge>
      </div>

      {/* Financial breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          padding: '1rem',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
            {isAr ? 'إجمالي الرسوم' : 'Total Amount'}
          </span>
          <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
            {Number(invoice.totalAmount).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
          </strong>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
            {isAr ? 'المبلغ المسدد' : 'Paid Amount'}
          </span>
          <strong style={{ fontSize: '1.15rem', color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
            {Number(invoice.paidAmount).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
          </strong>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
            {isAr ? 'المبلغ المتبقي' : 'Remaining Balance'}
          </span>
          <strong
            style={{
              fontSize: '1.15rem',
              color: isFullyPaid ? '#10b981' : 'var(--fbsu-gold)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {Number(invoice.remainingAmount).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
          </strong>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
            {isAr ? 'تاريخ الاستحقاق' : 'Due Date'}
          </span>
          <span style={{ fontSize: '0.92rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} color="var(--text-muted)" />
            {invoice.dueDate}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
        {onViewReceipts && Number(invoice.paidAmount) > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewReceipts(invoice)}
            testId={`btn-view-receipts-${invoice.id}`}
          >
            {isAr ? 'عرض الإيصالات' : 'View Receipts'}
          </Button>
        )}

        {!isFullyPaid && (
          <Button
            variant="gold"
            size="sm"
            icon={<CreditCard size={15} />}
            onClick={() => onPay(invoice)}
            testId={`btn-pay-tuition-${invoice.id}`}
          >
            {isAr ? 'سداد من المحفظة' : 'Pay via Wallet'}
          </Button>
        )}
      </div>
    </div>
  );
};

