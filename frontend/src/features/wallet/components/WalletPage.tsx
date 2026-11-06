import { FC, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, LogIn } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { LedgerTable } from './LedgerTable';
import { TopUpModal } from './TopUpModal';
import { TransferModal } from './TransferModal';
import { Toast, type ToastType } from '../../../shared/components/Toast';
import { useAuth } from '../../auth/context/AuthContext';
import { walletApi } from '../api/walletApi';
import type { WalletResponse, LedgerEntryResponse, Page } from '../types/wallet';

export interface WalletPageProps {
  onBalanceUpdate?: (newBalance: number) => void;
  onNavigateToTuition?: () => void;
  onOpenAuth?: () => void;
}

export const WalletPage: FC<WalletPageProps> = ({ onBalanceUpdate, onOpenAuth }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const { user, isAuthenticated } = useAuth();

  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [ledgerPage, setLedgerPage] = useState<Page<LedgerEntryResponse>>({
    content: [],
    totalPages: 1,
    totalElements: 0,
    size: 15,
    number: 0,
    first: true,
    last: true,
  });

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState<boolean>(false);
  const [isTransferOpen, setIsTransferOpen] = useState<boolean>(false);

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    title?: string;
  } | null>(null);

  const fetchWalletData = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        const [walletData, ledgerData] = await Promise.all([
          walletApi.getWallet(),
          walletApi.getLedgerHistory(page, 15),
        ]);
        setWallet(walletData);
        setLedgerPage(ledgerData);
        if (onBalanceUpdate && walletData) {
          onBalanceUpdate(Number(walletData.balance));
        }
      } else {
        // Unauthenticated state: 0.00 SAR, never display hardcoded 720.00 SAR
        const emptyWallet: WalletResponse = {
          id: 'unauthenticated-wallet',
          userId: 'guest',
          balance: 0.0,
          currency: 'SAR',
          status: 'ACTIVE',
          updatedAt: new Date().toISOString(),
        };
        const emptyLedger: Page<LedgerEntryResponse> = {
          content: [],
          totalPages: 1,
          totalElements: 0,
          size: 15,
          number: 0,
          first: true,
          last: true,
        };
        setWallet(emptyWallet);
        setLedgerPage(emptyLedger);
        if (onBalanceUpdate) {
          onBalanceUpdate(0.0);
        }
      }
    } catch (err: unknown) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, onBalanceUpdate]);

  useEffect(() => {
    fetchWalletData(currentPage);
  }, [fetchWalletData, currentPage]);

  const handleTopUpSuccess = (updatedWallet: WalletResponse) => {
    setWallet(updatedWallet);
    if (onBalanceUpdate) {
      onBalanceUpdate(Number(updatedWallet.balance));
    }
    setToast({
      type: 'success',
      title: isAr ? 'نجحت عملية الشحن' : 'Top-Up Successful',
      message: isAr
        ? `تم شحن رصيدك بنجاح! الرصيد الحالي: ${Number(updatedWallet.balance).toFixed(2)} ر.س.`
        : `Your wallet was topped up successfully! Current balance: ${Number(updatedWallet.balance).toFixed(2)} SAR.`,
    });
    fetchWalletData(0);
  };

  const handleTransferSuccess = (updatedWallet: WalletResponse) => {
    setWallet(updatedWallet);
    if (onBalanceUpdate) {
      onBalanceUpdate(Number(updatedWallet.balance));
    }
    setToast({
      type: 'success',
      title: isAr ? 'نجحت عملية التحويل' : 'Transfer Successful',
      message: isAr
        ? `تم تحويل المبلغ بنجاح! الرصيد المتبقي: ${Number(updatedWallet.balance).toFixed(2)} ر.س.`
        : `Funds transferred successfully! Remaining balance: ${Number(updatedWallet.balance).toFixed(2)} SAR.`,
    });
    fetchWalletData(0);
  };

  return (
    <div className="wallet-feature-page" data-testid="wallet-page" style={{ maxWidth: '960px', margin: '0 auto' }}>
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

      {/* Page header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
            {isAr ? 'المحفظة الجامعية والمدفوعات الذكية' : 'Digital Campus Wallet & Smart Payments'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
            {isAr
              ? 'إدارة الأرصدة المؤسسية، الشحن الإلكتروني الفوري، وسجل الحركات غير القابل للتعديل.'
              : 'Institutional balances, real-time top-ups, and immutable financial ledger transactions.'}
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            background: 'rgba(17, 110, 99, 0.15)',
            border: '1px solid rgba(17, 110, 99, 0.35)',
            fontSize: '0.78rem',
            color: '#34d399',
            fontWeight: 700,
          }}
        >
          <ShieldCheck size={15} />
          <span>{isAr ? 'معتمد ومحمي بالقيود المحاسبية' : 'Audited & Immutable Ledger'}</span>
        </div>
      </div>

      {!isAuthenticated && (
        <div
          className="glass-panel"
          style={{
            padding: '1.15rem 1.4rem',
            marginBottom: '1.25rem',
            border: '1px solid var(--fbsu-gold-border)',
            background: 'var(--fbsu-gold-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
          data-testid="wallet-auth-prompt"
        >
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {isAr
              ? 'يرجى تسجيل الدخول بحسابك الجامعي لعرض رصيد محفظتك الفعلي وسجل معاملاتك المالية.'
              : 'Please sign in with your university account to view your actual wallet balance and ledger history.'}
          </span>
          {onOpenAuth && (
            <button
              type="button"
              className="btn-gold"
              onClick={onOpenAuth}
              data-testid="wallet-signin-btn"
            >
              <LogIn size={15} color="#0b1a17" />
              <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
          )}
        </div>
      )}

      {/* Balance Card */}
      <BalanceCard
        wallet={wallet}
        isLoading={isLoading}
        onRefresh={() => fetchWalletData(currentPage)}
        onOpenTopUp={() => {
          if (!isAuthenticated && onOpenAuth) {
            onOpenAuth();
            return;
          }
          setIsTopUpOpen(true);
        }}
        onOpenTransfer={() => {
          if (!isAuthenticated && onOpenAuth) {
            onOpenAuth();
            return;
          }
          setIsTransferOpen(true);
        }}
      />

      {/* Ledger Table */}
      <LedgerTable
        ledgerPage={ledgerPage}
        isLoading={isLoading}
        onPageChange={page => {
          setCurrentPage(page);
          fetchWalletData(page);
        }}
      />

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={handleTopUpSuccess}
      />

      {/* Transfer Modal */}
      <TransferModal
        isOpen={isTransferOpen}
        availableBalance={wallet ? Number(wallet.balance) : 0}
        currentUniversityNumber={user?.universityNumber}
        onClose={() => setIsTransferOpen(false)}
        onSuccess={handleTransferSuccess}
      />
    </div>
  );
};
