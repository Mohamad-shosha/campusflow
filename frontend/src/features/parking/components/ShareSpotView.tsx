import { useState, FC } from 'react';
import { RefreshCw, Clock, Wallet } from 'lucide-react';
import { soundFX } from '../../../shared/utils/sound';

export interface ShareSpotViewProps {
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
    role: string;
    primarySpot?: number;
    walletBalance: number;
  };
  onShareConfirmed?: (hours: number, earnAmount: number) => void;
}

export const ShareSpotView: FC<ShareSpotViewProps> = ({
  isAr,
  currentUser,
  onShareConfirmed,
}) => {
  const [breakHours, setBreakHours] = useState<number>(3);
  const [isShared, setIsShared] = useState<boolean>(false);

  const earnAmount = breakHours * 5.75;

  const handleActivate = () => {
    soundFX.playSuccess();
    setIsShared(true);
    onShareConfirmed?.(breakHours, earnAmount);
  };

  return (
    <div data-testid="share-spot-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <RefreshCw size={16} color="var(--fbsu-gold)" />
          <span>{isAr ? 'بوابة التبادل الذكي' : 'Flex Share Portal'}</span>
        </span>
        <h3 className="section-title">
          {isAr
            ? 'شارك موقفك في أوقات البريك واربح رصيداً في محفظتك'
            : 'Share Your Spot During Breaks & Earn Credits'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'الميزة الجوهرية للمشروع: بدل ترك موقفك فارغاً أثناء خروجك في بريك، فعّل وضع المغادرة وسيقوم النظام بتأجيره لزميل يحتاجه ويحوّل الأرباح فوراً لمحفظتك!'
            : 'The core innovation: instead of leaving your spot vacant during long breaks, activate flex share and AI will allocate it to a peer, crediting your wallet immediately!'}
        </p>
      </div>

      <div
        className="glass-panel"
        style={{ maxWidth: '850px', margin: '0 auto', padding: '2.5rem' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {currentUser.name} ({currentUser.role})
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {isAr ? 'الموقف المسجل لك حالياً: ' : 'Your Assigned Spot: '}
              <strong style={{ color: 'var(--fbsu-gold)' }}>
                {isAr
                  ? `موقف رقم #${currentUser.primarySpot || '01'}`
                  : `Bay #${currentUser.primarySpot || '01'}`}
              </strong>
            </p>
          </div>

          <div style={{ textAlign: 'start' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isAr ? 'رصيدك الحالي' : 'Current Balance'}
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--fbsu-gold)' }}>
              {currentUser.walletBalance.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
            </div>
          </div>
        </div>

        {/* Break Selector */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.95rem' }}>
            <Clock size={16} color="var(--fbsu-primary)" />
            <span>
              {isAr
                ? 'كم مدة البريك المتوقعة التي ستغادر فيها الجامعة؟'
                : 'Expected Break Duration Outside Campus:'}
            </span>
          </label>
          <div className="break-hours-grid">
            <div
              className={`pattern-option ${breakHours === 1 ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setBreakHours(1);
              }}
              role="button"
              tabIndex={0}
            >
              <h5>{isAr ? '1 ساعة' : '1 Hour'}</h5>
              <span>{isAr ? 'بريك قصير' : 'Short Break'}</span>
            </div>
            <div
              className={`pattern-option ${breakHours === 2 ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setBreakHours(2);
              }}
              role="button"
              tabIndex={0}
            >
              <h5>{isAr ? '2 ساعتان' : '2 Hours'}</h5>
              <span>{isAr ? 'بريك متوسط' : 'Medium Break'}</span>
            </div>
            <div
              className={`pattern-option ${breakHours === 3 ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setBreakHours(3);
              }}
              role="button"
              tabIndex={0}
            >
              <h5>{isAr ? '3 ساعات' : '3 Hours'}</h5>
              <span style={{ color: 'var(--fbsu-gold)' }}>
                {isAr ? 'نموذج البريك المعتاد' : 'Standard Break'}
              </span>
            </div>
            <div
              className={`pattern-option ${breakHours === 4 ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setBreakHours(4);
              }}
              role="button"
              tabIndex={0}
            >
              <h5>{isAr ? '4 ساعات' : '4 Hours'}</h5>
              <span>{isAr ? 'بريك طويل' : 'Long Break'}</span>
            </div>
          </div>
        </div>

        {/* Calculation Card */}
        <div
          style={{
            background: 'var(--fbsu-gold-light)',
            border: '1px solid var(--fbsu-gold-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            margin: '1.75rem 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h5
                style={{
                  color: 'var(--fbsu-gold)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <Wallet size={18} color="var(--fbsu-gold)" />
                <span>
                  {isAr
                    ? 'العائد المالي المضاف لمحفظتك الجامعية فوراً:'
                    : 'Direct Wallet Cashback Earning:'}
                </span>
              </h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.35rem' }}>
                {isAr
                  ? 'محسوب وفق تعرفة 5.75 ر.س/ساعة مع ضمان توفير الموقف لك فور عودتك بنسبة 100%.'
                  : 'Calculated at standard 5.75 SAR/hr with guaranteed vacancy upon your return.'}
              </p>
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: 'var(--fbsu-gold)',
                fontFamily: 'var(--font-en)',
              }}
            >
              {earnAmount.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
            </div>
          </div>
        </div>

        {/* Activation CTA */}
        {isShared ? (
          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(56, 194, 176, 0.1)',
              border: '1px solid var(--status-available)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              color: 'var(--status-available)',
              fontWeight: 800,
            }}
          >
            ✓{' '}
            {isAr
              ? `تم تفعيل التبادل الذكي لموقفك بنجاح! تم إيداع ${earnAmount.toFixed(2)} ر.س في محفظتك الجامعية.`
              : `Spot successfully placed in AI Flex Mode! ${earnAmount.toFixed(2)} SAR credited to your wallet.`}
          </div>
        ) : (
          <button
            className="btn-gold"
            onClick={handleActivate}
            style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
            type="button"
            data-testid="activate-flex-share-btn"
          >
            <RefreshCw size={18} color="#0b1a17" />
            <span>
              {isAr
                ? 'أنا مغادر الآن - إتاحة موقفي للزملاء وإيداع المكافأة'
                : 'I am Leaving Now - Activate Flex Share & Earn'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

