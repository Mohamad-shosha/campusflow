import { useState, useEffect, FC } from 'react';
import {
  RefreshCw,
  Clock,
  Wallet,
  CheckCircle,
  Car,
  ArrowRight,
  AlertCircle,
  Sparkles,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../../../shared/utils/sound';
import { parkingApi } from '../api/parkingApi';
import type { FlexOfferResponse, ParkingSpotResponse } from '../types/parking';

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
  onOpenAuth?: () => void;
  onRefreshSpots?: () => void;
}

export const ShareSpotView: FC<ShareSpotViewProps> = ({
  isAr,
  currentUser,
  onShareConfirmed,
  onOpenAuth,
  onRefreshSpots,
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'browse'>('share');
  const [breakHours, setBreakHours] = useState<number>(3);
  const [isShared, setIsShared] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [shareError, setShareError] = useState<string | null>(null);

  // Available spots and selected spot for offering
  const [allSpots, setAllSpots] = useState<ParkingSpotResponse[]>([]);
  const [selectedSpotId, setSelectedSpotId] = useState<string>('');

  // Live offers from backend
  const [offers, setOffers] = useState<FlexOfferResponse[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState<boolean>(false);
  const [claimingOfferId, setClaimingOfferId] = useState<string | null>(null);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const earnAmount = breakHours * 5.75;

  // Load spots and offers on mount
  useEffect(() => {
    loadSpots();
    loadOffers();
  }, []);

  const loadSpots = async () => {
    try {
      const spots = await parkingApi.getSpots();
      setAllSpots(spots);
      // Auto-select spot matching currentUser primarySpot, or first occupied/active spot, or first spot
      const matchingSpot = spots.find(s => s.bayNumber === currentUser.primarySpot) || spots[0];
      if (matchingSpot) {
        setSelectedSpotId(matchingSpot.id);
      }
    } catch {
      // Non-blocking in dev/offline
    }
  };

  const loadOffers = async () => {
    setIsLoadingOffers(true);
    try {
      const data = await parkingApi.getFlexOffers();
      setOffers(data);
    } catch {
      // Non-blocking
    } finally {
      setIsLoadingOffers(false);
    }
  };

  const handleActivate = async () => {
    setShareError(null);
    setIsSubmitting(true);

    try {
      const targetSpotId =
        selectedSpotId || (allSpots.length > 0 ? allSpots[0].id : 'spot-fallback-id');
      await parkingApi.createFlexOffer({
        spotId: targetSpotId,
        durationMinutes: breakHours * 60,
      });

      soundFX.playSuccess();
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch {
        // Mock fallback
      }

      setIsShared(true);
      onShareConfirmed?.(breakHours, earnAmount);
      onRefreshSpots?.();
      loadOffers();
    } catch (err: unknown) {
      soundFX.playError();
      const errorObj = err as {
        response?: { status?: number; data?: { detail?: string; message?: string } };
      };
      if (errorObj?.response?.status === 401) {
        setShareError(
          isAr
            ? 'يرجى تسجيل الدخول أولاً لتفعيل التبادل الذكي لموقفك.'
            : 'Please log in first to activate flex share for your spot.'
        );
        onOpenAuth?.();
      } else {
        const detail =
          errorObj?.response?.data?.detail ||
          errorObj?.response?.data?.message ||
          (isAr
            ? 'حدث خطأ أثناء تفعيل التبادل الذكي. تأكد من أن الموقف غير معروض مسبقاً.'
            : 'Error activating flex share. Spot might already have an active offer.');
        setShareError(detail);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaim = async (offer: FlexOfferResponse) => {
    setClaimError(null);
    setClaimSuccessMessage(null);
    setClaimingOfferId(offer.id);

    try {
      await parkingApi.claimFlexOffer(offer.id);
      soundFX.playSuccess();
      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch {
        // Mock fallback
      }

      setClaimSuccessMessage(
        isAr
          ? `تم حجز الموقف #${offer.bayNumber} بنجاح! تم تحويل المكافأة لصاحب الموقف ويمكنك استخدامه الآن.`
          : `Bay #${offer.bayNumber} claimed successfully! Reward transferred to owner.`
      );
      onRefreshSpots?.();
      loadOffers();
    } catch (err: unknown) {
      soundFX.playError();
      const errorObj = err as {
        response?: { status?: number; data?: { detail?: string; message?: string } };
      };
      if (errorObj?.response?.status === 401) {
        setClaimError(
          isAr
            ? 'يرجى تسجيل الدخول أولاً لحجز الموقف المعروض.'
            : 'Please log in first to claim a shared spot.'
        );
        onOpenAuth?.();
      } else {
        const detail =
          errorObj?.response?.data?.detail ||
          errorObj?.response?.data?.message ||
          (isAr
            ? 'تعذر حجز الموقف المعروض. ربما تم حجزه من زميل آخر.'
            : 'Could not claim shared spot. It may have been claimed by another user.');
        setClaimError(detail);
      }
    } finally {
      setClaimingOfferId(null);
    }
  };

  const availableOffers = offers.filter(o => o.status === 'AVAILABLE' || o.status === 'OFFERED');

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

      <div className="glass-panel" style={{ maxWidth: '850px', margin: '0 auto', padding: '2rem' }}>
        {/* Sub-Tabs: Share My Spot vs Browse Available Offers */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '2rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1rem',
          }}
        >
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveTab('share');
            }}
            data-testid="tab-share-my-spot"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'share' ? 'var(--fbsu-gold)' : 'var(--bg-glass)',
              color: activeTab === 'share' ? '#0b1a17' : 'var(--text-main)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshCw size={16} />
            <span>{isAr ? 'عرض موقفي في البريك' : 'Share My Spot (Break)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveTab('browse');
            }}
            data-testid="tab-browse-flex-spots"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'browse' ? 'var(--fbsu-gold)' : 'var(--bg-glass)',
              color: activeTab === 'browse' ? '#0b1a17' : 'var(--text-main)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Car size={16} />
            <span>{isAr ? 'المواقف المعروضة للتبادل' : 'Browse Shared Spots'}</span>
            {availableOffers.length > 0 && (
              <span
                style={{
                  background: activeTab === 'browse' ? '#0b1a17' : 'var(--fbsu-gold)',
                  color: activeTab === 'browse' ? '#fff' : '#0b1a17',
                  borderRadius: '999px',
                  padding: '0.1rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                }}
              >
                {availableOffers.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: SHARE MY SPOT */}
        {activeTab === 'share' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '1.5rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {currentUser.name} ({currentUser.role})
                </h4>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    marginTop: '0.45rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>{isAr ? 'الموقف المخصص:' : 'Assigned Bay:'}</span>
                  {allSpots.length > 0 ? (
                    <select
                      value={selectedSpotId}
                      onChange={e => setSelectedSpotId(e.target.value)}
                      style={{
                        background: 'var(--bg-glass)',
                        color: 'var(--gold-text)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.35rem 0.75rem',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                      data-testid="spot-select"
                    >
                      {allSpots.map(s => (
                        <option
                          key={s.id}
                          value={s.id}
                          style={{ background: '#0b1a17', color: '#fff' }}
                        >
                          {isAr
                            ? `موقف رقم #${s.bayNumber} (${s.zoneNameAr})`
                            : `Bay #${s.bayNumber} (${s.zoneCode})`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <strong style={{ color: 'var(--gold-text)' }}>
                      {isAr
                        ? `موقف رقم #${currentUser.primarySpot || '01'}`
                        : `Bay #${currentUser.primarySpot || '01'}`}
                    </strong>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'start' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {isAr ? 'رصيدك الحالي' : 'Current Balance'}
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold-text)' }}>
                  {currentUser.walletBalance.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
                </div>
              </div>
            </div>

            {/* Error Notification */}
            {shareError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 1.25rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--status-occupied)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--status-occupied)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem',
                }}
                data-testid="share-error-banner"
              >
                <AlertCircle size={20} />
                <span style={{ flex: 1 }}>{shareError}</span>
              </div>
            )}

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
                  data-testid="break-option-1"
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
                  data-testid="break-option-2"
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
                  data-testid="break-option-3"
                >
                  <h5>{isAr ? '3 ساعات' : '3 Hours'}</h5>
                  <span style={{ color: 'var(--gold-text)' }}>
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
                  data-testid="break-option-4"
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
                      color: 'var(--gold-text)',
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
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.825rem',
                      marginTop: '0.35rem',
                    }}
                  >
                    {isAr
                      ? 'محسوب وفق تعرفة 5.75 ر.س/ساعة مع ضمان توفير الموقف لك فور عودتك بنسبة 100%.'
                      : 'Calculated at standard 5.75 SAR/hr with guaranteed vacancy upon your return.'}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: 'var(--gold-text)',
                    fontFamily: 'var(--font-en)',
                  }}
                  data-testid="flex-reward-amount"
                >
                  {earnAmount.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
                </div>
              </div>
            </div>

            {/* Activation CTA */}
            {isShared ? (
              <div
                style={{
                  padding: '1.5rem',
                  background: 'rgba(56, 194, 176, 0.1)',
                  border: '1px solid var(--status-available)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  color: 'var(--status-available)',
                  fontWeight: 800,
                }}
                data-testid="flex-share-success-banner"
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <CheckCircle size={22} />
                  <span style={{ fontSize: '1.1rem' }}>
                    {isAr ? 'تم تفعيل التبادل الذكي لموقفك بنجاح!' : 'Spot Placed in AI Flex Mode!'}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', opacity: 0.9 }}>
                  {isAr
                    ? `أصبح الموقف متاحاً لزملائك لمدة ${breakHours} ساعات، وتم ربط حسابك بالمكافأة النقدية (+${earnAmount.toFixed(2)} ر.س).`
                    : `Bay shared for ${breakHours} hours. Wallet credit (+${earnAmount.toFixed(2)} SAR) recorded.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsShared(false);
                    soundFX.playClick();
                  }}
                  style={{
                    marginTop: '1rem',
                    padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    border: '1px solid var(--status-available)',
                    color: 'var(--status-available)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? 'عرض إعداد جديد' : 'New Flex Share Offer'}
                </button>
              </div>
            ) : (
              <button
                className="btn-gold"
                onClick={handleActivate}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '1rem',
                  fontSize: '1rem',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
                type="button"
                data-testid="activate-flex-share-btn"
              >
                <RefreshCw size={18} color="#0b1a17" className={isSubmitting ? 'spin' : ''} />
                <span>
                  {isSubmitting
                    ? isAr
                      ? 'جارٍ تفعيل التبادل في النظام...'
                      : 'Activating Flex Share...'
                    : isAr
                      ? 'أنا مغادر الآن - إتاحة موقفي للزملاء وإيداع المكافأة'
                      : 'I am Leaving Now - Activate Flex Share & Earn'}
                </span>
              </button>
            )}
          </div>
        )}

        {/* TAB 2: BROWSE & CLAIM AVAILABLE SHARED SPOTS */}
        {activeTab === 'browse' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {isAr ? 'المواقف المتاحة للتبادل الفوري' : 'Available Flex-Share Spots'}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {isAr
                    ? 'مواقف أعضاء هيئة التدريس والطلاب المعروضة أثناء فترة البريك للاستفادة منها'
                    : 'Spots shared by peers and faculty during their campus break windows'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  loadOffers();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
                title={isAr ? 'تحديث' : 'Refresh'}
              >
                <RefreshCw size={14} className={isLoadingOffers ? 'spin' : ''} />
                <span>{isAr ? 'تحديث القائمة' : 'Refresh'}</span>
              </button>
            </div>

            {/* Notification messages */}
            {claimSuccessMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: 'rgba(56, 194, 176, 0.1)',
                  border: '1px solid var(--status-available)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--status-available)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem',
                }}
                data-testid="claim-success-banner"
              >
                <CheckCircle size={20} />
                <span>{claimSuccessMessage}</span>
              </div>
            )}

            {claimError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--status-occupied)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--status-occupied)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem',
                }}
                data-testid="claim-error-banner"
              >
                <AlertCircle size={20} />
                <span>{claimError}</span>
              </div>
            )}

            {/* Offers List */}
            {isLoadingOffers ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <RefreshCw
                  size={32}
                  className="spin"
                  color="var(--fbsu-gold)"
                  style={{ marginBottom: '0.75rem' }}
                />
                <p>
                  {isAr
                    ? 'جارٍ تحميل المواقف المتاحة للتبادل...'
                    : 'Loading available shared spots...'}
                </p>
              </div>
            ) : availableOffers.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1.5rem',
                  background: 'var(--surface-soft)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--border-subtle)',
                }}
              >
                <Sparkles
                  size={40}
                  color="var(--fbsu-gold)"
                  style={{ marginBottom: '1rem', opacity: 0.8 }}
                />
                <h5
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {isAr
                    ? 'لا توجد مواقف معروضة للتبادل حالياً'
                    : 'No Active Flex-Share Spots at This Moment'}
                </h5>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    maxWidth: '450px',
                    margin: '0 auto 1.5rem auto',
                  }}
                >
                  {isAr
                    ? 'يمكنك أن تكون أول من يشارك موقفه أثناء فترة خروجك للبريك لتحصل على رصيد فوري بمحفظتك!'
                    : 'Be the first to share your spot when heading out for a break and earn instant campus wallet credits!'}
                </p>
                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => setActiveTab('share')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <RefreshCw size={16} />
                  <span>{isAr ? 'شارك موقفي الآن' : 'Share My Spot Now'}</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1rem',
                }}
              >
                {availableOffers.map(offer => {
                  const isClaiming = claimingOfferId === offer.id;
                  const reward = offer.rewardAmount ?? offer.rewardAmountSar ?? 5.75;
                  const ownerName = isAr ? offer.offererNameAr : offer.offererNameEn;

                  return (
                    <div
                      key={offer.id}
                      style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        transition: 'transform 0.2s ease, border-color 0.2s ease',
                      }}
                      data-testid={`flex-offer-card-${offer.id}`}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.75rem',
                          }}
                        >
                          <span
                            style={{
                              background: 'var(--fbsu-gold-light)',
                              color: 'var(--gold-text)',
                              fontWeight: 900,
                              fontSize: '1rem',
                              padding: '0.2rem 0.65rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--fbsu-gold-border)',
                            }}
                          >
                            #{offer.bayNumber}
                          </span>
                          <span
                            style={{
                              background: 'rgba(56, 194, 176, 0.1)',
                              color: 'var(--status-available)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '999px',
                            }}
                          >
                            {isAr ? 'متاح للتبادل' : 'Available'}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-main)',
                            marginBottom: '0.35rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          <User size={14} color="var(--text-muted)" />
                          <span>{ownerName || (isAr ? 'عضو جامعي' : 'Campus Member')}</span>
                        </div>

                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          <Clock size={14} color="var(--text-muted)" />
                          <span>
                            {isAr ? 'المكافأة النقدية للطرفين: ' : 'Cashback: '}
                            <strong style={{ color: 'var(--gold-text)' }}>
                              {reward.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleClaim(offer)}
                        disabled={isClaiming}
                        style={{
                          width: '100%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          background: 'var(--fbsu-gold)',
                          color: '#0b1a17',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.65rem 1rem',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: isClaiming ? 'not-allowed' : 'pointer',
                          opacity: isClaiming ? 0.7 : 1,
                        }}
                        data-testid={`claim-offer-btn-${offer.id}`}
                      >
                        {isClaiming ? (
                          <>
                            <RefreshCw size={14} className="spin" />
                            <span>{isAr ? 'جارٍ الحجز...' : 'Claiming...'}</span>
                          </>
                        ) : (
                          <>
                            <span>{isAr ? 'حجز هذا الموقف' : 'Claim Spot'}</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
