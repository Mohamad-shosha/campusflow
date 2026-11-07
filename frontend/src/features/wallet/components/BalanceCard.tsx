import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, PlusCircle, Send, RefreshCw } from 'lucide-react';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import type { WalletResponse } from '../types/wallet';

export interface BalanceCardProps {
  wallet: WalletResponse | null;
  isLoading?: boolean;
  onRefresh: () => void;
  onOpenTopUp: () => void;
  onOpenTransfer: () => void;
}

export const BalanceCard: FC<BalanceCardProps> = ({
  wallet,
  isLoading = false,
  onRefresh,
  onOpenTopUp,
  onOpenTransfer,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const balance = wallet ? Number(wallet.balance) : 0;
  const currency = wallet?.currency || (isAr ? 'ر.س' : 'SAR');
  const status = wallet?.status || 'ACTIVE';

  return (
    <div
      className="balance-card-container"
      data-testid="wallet-balance-card"
      style={{
        background:
          'linear-gradient(135deg, rgba(17, 110, 99, 0.45) 0%, rgba(13, 27, 42, 0.9) 100%)',
        border: '1px solid rgba(215, 162, 55, 0.35)',
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          insetInlineEnd: '-40px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(215, 162, 55, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(215, 162, 55, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(215, 162, 55, 0.3)',
            }}
          >
            <Wallet size={20} color="var(--fbsu-gold)" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>
              {isAr ? 'المحفظة الجامعية الرقمية' : 'Campus Digital Wallet'}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              FBSU Financial Ledger
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge variant={status === 'ACTIVE' ? 'available' : 'occupied'} dot>
            {status === 'ACTIVE' ? (isAr ? 'نشط' : 'Active') : isAr ? 'معلق' : 'Suspended'}
          </Badge>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="utility-pill-btn"
            title={isAr ? 'تحديث الرصيد' : 'Refresh Balance'}
            type="button"
            style={{ padding: '0.4rem', borderRadius: '8px' }}
          >
            <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
          </button>
        </div>
      </div>

      {/* Balance display */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}
        >
          {isAr ? 'الرصيد المتاح' : 'Available Balance'}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '2.6rem',
              fontWeight: 900,
              color: 'var(--text-main)',
              letterSpacing: '-0.5px',
              fontVariantNumeric: 'tabular-nums',
            }}
            data-testid="wallet-balance-amount"
          >
            {balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--fbsu-gold)',
            }}
          >
            {currency}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <Button
          variant="gold"
          size="md"
          icon={<PlusCircle size={16} />}
          onClick={onOpenTopUp}
          testId="btn-open-topup"
        >
          {isAr ? 'شحن المحفظة' : 'Top Up'}
        </Button>

        <Button
          variant="outline"
          size="md"
          icon={<Send size={16} />}
          onClick={onOpenTransfer}
          testId="btn-open-transfer"
        >
          {isAr ? 'تحويل رصيد' : 'Transfer'}
        </Button>
      </div>
    </div>
  );
};
