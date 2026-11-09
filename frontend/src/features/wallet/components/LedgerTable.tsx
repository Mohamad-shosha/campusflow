import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  History,
} from 'lucide-react';
import { Badge, type BadgeVariant } from '../../../shared/components/Badge';
import type { LedgerEntryResponse, Page, TransactionType } from '../types/wallet';

export interface LedgerTableProps {
  ledgerPage: Page<LedgerEntryResponse> | null;
  isLoading?: boolean;
  onPageChange: (newPage: number) => void;
}

export const LedgerTable: FC<LedgerTableProps> = ({
  ledgerPage,
  isLoading = false,
  onPageChange,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const entries = ledgerPage?.content || [];
  const filtered = entries.filter(e => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      e.description?.toLowerCase().includes(lower) ||
      e.referenceId?.toLowerCase().includes(lower) ||
      e.transactionType?.toLowerCase().includes(lower)
    );
  });

  const getTransactionLabel = (
    type: TransactionType
  ): { labelAr: string; labelEn: string; variant: BadgeVariant } => {
    switch (type) {
      case 'TOP_UP':
        return { labelAr: 'شحن رصيد', labelEn: 'Top-Up', variant: 'available' };
      case 'TUITION_PAYMENT':
        return { labelAr: 'سداد رسوم دراسية', labelEn: 'Tuition Payment', variant: 'gold' };
      case 'P2P_TRANSFER':
      case 'PEER_TRANSFER':
        return { labelAr: 'تحويل مالي فوري', labelEn: 'P2P Transfer', variant: 'flex' };
      case 'PARKING_FEE':
        return { labelAr: 'رسوم مواقف', labelEn: 'Parking Fee', variant: 'occupied' };
      case 'PARKING_REWARD':
      case 'REFUND':
        return { labelAr: 'مكافأة مشاركة موقف', labelEn: 'Parking Reward', variant: 'available' };
      case 'CAMPUS_PURCHASE':
      case 'CAFETERIA_PURCHASE':
        return { labelAr: 'مشتريات كافتيريا', labelEn: 'Cafeteria', variant: 'neutral' };
      default:
        return { labelAr: type, labelEn: type, variant: 'fbsu' };
    }
  };

  const formatDate = (isoStr: string): string => {
    try {
      const d = new Date(isoStr);
      return new Intl.DateTimeFormat(isAr ? 'ar-SA' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(d);
    } catch {
      return isoStr;
    }
  };

  return (
    <div
      className="glass-panel"
      data-testid="ledger-table-panel"
      style={{
        borderRadius: '16px',
        padding: '1.5rem',
        marginTop: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <History size={18} color="var(--fbsu-gold)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            {isAr ? 'سجل العمليات والقيود المالية' : 'Transaction & Ledger History'}
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ({ledgerPage?.totalElements || 0} {isAr ? 'عملية مسجلة' : 'records'})
          </span>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '220px' }}>
          <input
            type="text"
            placeholder={isAr ? 'بحث في الوصف أو المرجع...' : 'Search description or reference...'}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.8rem',
              paddingInlineStart: '2rem',
              borderRadius: '8px',
              background: 'var(--surface-soft)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
            data-testid="input-ledger-search"
          />
          <Search
            size={14}
            style={{
              position: 'absolute',
              top: '50%',
              insetInlineStart: '0.6rem',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
        </div>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: isAr ? 'right' : 'left',
            fontSize: '0.88rem',
          }}
          data-testid="ledger-table"
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              <th style={{ padding: '0.75rem 0.6rem', fontWeight: 700 }}>
                {isAr ? 'التاريخ والوقت' : 'Date & Time'}
              </th>
              <th style={{ padding: '0.75rem 0.6rem', fontWeight: 700 }}>
                {isAr ? 'نوع الحركة' : 'Type'}
              </th>
              <th style={{ padding: '0.75rem 0.6rem', fontWeight: 700 }}>
                {isAr ? 'البيان والرمز المرجعي' : 'Description / Reference'}
              </th>
              <th style={{ padding: '0.75rem 0.6rem', fontWeight: 700 }}>
                {isAr ? 'المبلغ' : 'Amount'}
              </th>
              <th style={{ padding: '0.75rem 0.6rem', fontWeight: 700 }}>
                {isAr ? 'الرصيد بعد الحركة' : 'Balance After'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}
                >
                  {isLoading
                    ? isAr
                      ? 'جاري تحميل سجل المعاملات...'
                      : 'Loading transaction ledger...'
                    : isAr
                      ? 'لا توجد حركات مالية مسجلة حتى الآن.'
                      : 'No transaction records found.'}
                </td>
              </tr>
            ) : (
              filtered.map(entry => {
                const info = getTransactionLabel(entry.transactionType);
                const isCredit = entry.direction === 'CREDIT';
                return (
                  <tr
                    key={entry.id}
                    style={{
                      borderBottom: '1px solid var(--border-soft)',
                      transition: 'background 0.15s ease',
                    }}
                    data-testid={`ledger-row-${entry.id}`}
                  >
                    {/* Date */}
                    <td
                      style={{
                        padding: '0.75rem 0.6rem',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {formatDate(entry.createdAt)}
                    </td>

                    {/* Type badge */}
                    <td style={{ padding: '0.75rem 0.6rem', whiteSpace: 'nowrap' }}>
                      <Badge variant={info.variant}>{isAr ? info.labelAr : info.labelEn}</Badge>
                    </td>

                    {/* Description & Reference */}
                    <td style={{ padding: '0.75rem 0.6rem' }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          marginBottom: '0.15rem',
                        }}
                      >
                        {entry.description}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'monospace',
                        }}
                      >
                        Ref: {entry.referenceId}
                      </div>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: '0.75rem 0.6rem', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontWeight: 800,
                          color: isCredit ? 'var(--success-text)' : 'var(--danger-text)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {isCredit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        {isCredit ? '+' : '-'}
                        {Number(entry.amount).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
                      </span>
                    </td>

                    {/* Balance After */}
                    <td
                      style={{
                        padding: '0.75rem 0.6rem',
                        color: 'var(--text-main)',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {Number(entry.balanceAfter).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {ledgerPage && ledgerPage.totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span>
            {isAr
              ? `صفحة ${ledgerPage.number + 1} من ${ledgerPage.totalPages}`
              : `Page ${ledgerPage.number + 1} of ${ledgerPage.totalPages}`}
          </span>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onPageChange(ledgerPage.number - 1)}
              disabled={ledgerPage.first || isLoading}
              className="utility-pill-btn"
              type="button"
              style={{ padding: '0.4rem 0.75rem', borderRadius: '6px' }}
            >
              {isAr ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span>{isAr ? 'السابق' : 'Previous'}</span>
            </button>

            <button
              onClick={() => onPageChange(ledgerPage.number + 1)}
              disabled={ledgerPage.last || isLoading}
              className="utility-pill-btn"
              type="button"
              style={{ padding: '0.4rem 0.75rem', borderRadius: '6px' }}
            >
              <span>{isAr ? 'التالي' : 'Next'}</span>
              {isAr ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
