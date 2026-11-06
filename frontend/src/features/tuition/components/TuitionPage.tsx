import { FC, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, FileCheck2, FileText, RefreshCw } from 'lucide-react';
import { TuitionInvoiceCard } from './TuitionInvoiceCard';
import { PayTuitionModal } from './PayTuitionModal';
import { TuitionReceiptModal } from './TuitionReceiptModal';
import { Button } from '../../../shared/components/Button';
import { Toast, type ToastType } from '../../../shared/components/Toast';
import { useAuth } from '../../auth/context/AuthContext';
import { tuitionApi } from '../api/tuitionApi';
import { walletApi } from '../../wallet/api/walletApi';
import type { TuitionInvoiceResponse, TuitionReceiptResponse } from '../types/tuition';

export interface TuitionPageProps {
  onBalanceUpdate?: ((newBalance: number) => void) | undefined;
  onOpenTopUp?: (() => void) | undefined;
}

export const TuitionPage: FC<TuitionPageProps> = ({ onBalanceUpdate, onOpenTopUp }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'INVOICES' | 'RECEIPTS'>('INVOICES');
  const [invoices, setInvoices] = useState<TuitionInvoiceResponse[]>([]);
  const [receipts, setReceipts] = useState<TuitionReceiptResponse[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0.0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<TuitionInvoiceResponse | null>(null);
  const [selectedReceiptForView, setSelectedReceiptForView] = useState<TuitionReceiptResponse | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    title?: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        const [invoicesData, receiptsData, walletData] = await Promise.all([
          tuitionApi.getStudentInvoices(),
          tuitionApi.getStudentReceipts(),
          walletApi.getWallet(),
        ]);
        setInvoices(invoicesData);
        setReceipts(receiptsData);
        if (walletData) {
          setWalletBalance(Number(walletData.balance));
          if (onBalanceUpdate) onBalanceUpdate(Number(walletData.balance));
        }
      } else {
        setInvoices([]);
        setReceipts([]);
        setWalletBalance(0.0);
      }
    } catch (err: unknown) {
      console.error('Failed to load tuition data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, onBalanceUpdate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePaymentSuccess = (receipt: TuitionReceiptResponse) => {
    setSelectedReceiptForView(receipt);
    setToast({
      type: 'success',
      title: isAr ? 'تم سداد الرسوم بنجاح' : 'Tuition Payment Confirmed',
      message: isAr
        ? `تم خصم ${Number(receipt.amountPaid).toFixed(2)} ر.س من محفظتك وإصدار الإيصال رقم ${receipt.receiptNumber}.`
        : `Successfully deducted ${Number(receipt.amountPaid).toFixed(2)} SAR from your wallet. Official receipt issued.`,
    });
    loadData();
  };

  return (
    <div className="tuition-feature-page" data-testid="tuition-page" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '1.5rem', insetInlineEnd: '1.5rem', zIndex: 999999 }}>
          <Toast
            message={toast.message}
            type={toast.type}
            title={toast.title}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <GraduationCap size={26} color="var(--fbsu-gold)" />
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
              {isAr ? 'الحسابات والرسوم الدراسية' : 'Tuition Accounts & Digital Settlement'}
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
            {isAr
              ? 'متابعة الفواتير الأكاديمية وسدادها فورياً عبر المحفظة الجامعية مع إصدار إيصالات مشفرة معتمدة.'
              : 'Review academic tuition invoices, settle dues instantly from campus wallet, and download verified digital receipts.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="utility-pill-btn"
            title={isAr ? 'تحديث البيانات' : 'Refresh'}
            type="button"
            style={{ padding: '0.45rem 0.8rem', borderRadius: '8px' }}
          >
            <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('INVOICES')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            border: activeTab === 'INVOICES' ? '1px solid var(--fbsu-gold)' : '1px solid transparent',
            background: activeTab === 'INVOICES' ? 'rgba(215, 162, 55, 0.15)' : 'transparent',
            color: activeTab === 'INVOICES' ? 'var(--fbsu-gold)' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
          data-testid="tab-tuition-invoices"
        >
          <FileText size={16} />
          <span>{isAr ? 'الفواتير الأكاديمية' : 'Tuition Invoices'}</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({invoices.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('RECEIPTS')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            border: activeTab === 'RECEIPTS' ? '1px solid var(--fbsu-gold)' : '1px solid transparent',
            background: activeTab === 'RECEIPTS' ? 'rgba(215, 162, 55, 0.15)' : 'transparent',
            color: activeTab === 'RECEIPTS' ? 'var(--fbsu-gold)' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
          data-testid="tab-tuition-receipts"
        >
          <FileCheck2 size={16} />
          <span>{isAr ? 'سجل الإيصالات المعتمدة' : 'Verified Receipts'}</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({receipts.length})</span>
        </button>
      </div>

      {/* Tab 1: Invoices */}
      {activeTab === 'INVOICES' && (
        <div data-testid="invoices-list-container">
          {invoices.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              {isAr ? 'لا توجد فواتير دراسية مسجلة بحسابك حالياً.' : 'No tuition invoices found on your account.'}
            </div>
          ) : (
            invoices.map(invoice => (
              <TuitionInvoiceCard
                key={invoice.id}
                invoice={invoice}
                onPay={inv => setSelectedInvoiceForPayment(inv)}
                onViewReceipts={() => setActiveTab('RECEIPTS')}
              />
            ))
          )}
        </div>
      )}

      {/* Tab 2: Receipts Archive */}
      {activeTab === 'RECEIPTS' && (
        <div data-testid="receipts-list-container">
          {receipts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              {isAr ? 'لا توجد إيصالات سداد مسجلة حتى الآن.' : 'No payment receipts found yet.'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {receipts.map(rct => (
                <div
                  key={rct.id}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                  }}
                  data-testid={`receipt-card-${rct.id}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--fbsu-gold)', fontFamily: 'monospace' }}>
                      {rct.receiptNumber}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                      ✓ {isAr ? 'معتمد' : 'Verified'}
                    </span>
                  </div>

                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem', fontVariantNumeric: 'tabular-nums' }}>
                    {Number(rct.amountPaid).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                    <div>{isAr ? 'الفاتورة:' : 'Invoice:'} {rct.invoiceNumber}</div>
                    <div>{rct.termNameEn}</div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => setSelectedReceiptForView(rct)}
                    testId={`btn-view-receipt-${rct.id}`}
                  >
                    {isAr ? 'عرض وطباعة الإيصال' : 'View & Print Receipt'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pay Tuition Modal */}
      <PayTuitionModal
        isOpen={!!selectedInvoiceForPayment}
        invoice={selectedInvoiceForPayment}
        walletBalance={walletBalance}
        onClose={() => setSelectedInvoiceForPayment(null)}
        onSuccess={handlePaymentSuccess}
        onOpenTopUp={onOpenTopUp}
      />

      {/* Receipt Details Modal */}
      <TuitionReceiptModal
        isOpen={!!selectedReceiptForView}
        receipt={selectedReceiptForView}
        onClose={() => setSelectedReceiptForView(null)}
      />
    </div>
  );
};
