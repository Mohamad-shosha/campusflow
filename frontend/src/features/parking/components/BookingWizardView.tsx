import { useState, useEffect, useCallback, type FC } from 'react';
import {
  Calendar,
  ShieldCheck,
  AlertCircle,
  Loader2,
  RotateCcw,
  QrCode,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { DigitalPassModal, type DigitalPassData } from './DigitalPassModal';
import { soundFX } from '../../../shared/utils/sound';
import { parkingApi } from '../api/parkingApi';
import type { ParkingSpotResponse, BookingResponse } from '../types/parking';

export interface BookingWizardViewProps {
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
    car?: string | undefined;
    plate?: string | undefined;
    primarySpot?: number | undefined;
  };
  isAuthenticated?: boolean | undefined;
  onOpenGate?: (() => void) | undefined;
  onOpenAuth?: (() => void) | undefined;
  onBookingSuccess?: ((booking: BookingResponse) => void) | undefined;
  onBookingCancelled?: (() => void) | undefined;
}

export const BookingWizardView: FC<BookingWizardViewProps> = ({
  isAr,
  currentUser,
  isAuthenticated,
  onOpenGate,
  onOpenAuth,
  onBookingSuccess,
  onBookingCancelled,
}) => {
  const [schedulePattern, setSchedulePattern] = useState<string>('sun-tue');
  const [selectedCollege, setSelectedCollege] = useState<string>('computing');
  const [tariffPlan, setTariffPlan] = useState<'hourly' | 'daily' | 'monthly'>('hourly');
  const [timeFrom, setTimeFrom] = useState<string>('09:00');
  const [timeTo, setTimeTo] = useState<string>('12:00');
  const [optInFlex, setOptInFlex] = useState<boolean>(true);
  const [digitalPass, setDigitalPass] = useState<DigitalPassData | null>(null);

  // Live backend spots for the selected zone
  const [availableSpots, setAvailableSpots] = useState<ParkingSpotResponse[]>([]);
  const [selectedSpotId, setSelectedSpotId] = useState<string>('');
  const [selectedBayNumber, setSelectedBayNumber] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  // User's active and historical bookings
  const [myBookings, setMyBookings] = useState<BookingResponse[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  // Map college to zone
  const targetZone =
    selectedCollege === 'business'
      ? 'B'
      : selectedCollege === 'medicine'
        ? 'B'
        : selectedCollege === 'sciences'
          ? 'C'
          : 'A';

  const loadSpotsForZone = useCallback(async () => {
    try {
      const spots = await parkingApi.getSpots(targetZone);
      const available = spots.filter(s => s.status === 'AVAILABLE');
      setAvailableSpots(available);
      if (available.length > 0) {
        setSelectedSpotId(available[0].id);
        setSelectedBayNumber(available[0].bayNumber);
      } else if (spots.length > 0) {
        setSelectedSpotId(spots[0].id);
        setSelectedBayNumber(spots[0].bayNumber);
      }
    } catch (err) {
      console.warn('Could not load spots for zone', targetZone, err);
    }
  }, [targetZone]);

  const loadMyBookings = useCallback(async () => {
    if (!isAuthenticated || typeof parkingApi.getMyBookings !== 'function') {
      return;
    }
    setIsLoadingBookings(true);
    try {
      const data = await parkingApi.getMyBookings();
      if (Array.isArray(data)) {
        setMyBookings(data);
      }
    } catch {
      // Non-blocking in offline/unit test mode
    } finally {
      setIsLoadingBookings(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadSpotsForZone();
  }, [loadSpotsForZone]);

  useEffect(() => {
    loadMyBookings();
  }, [loadMyBookings]);

  // Compute hours from timeFrom and timeTo
  const [fromH, fromM] = timeFrom.split(':').map(Number);
  const [toH, toM] = timeTo.split(':').map(Number);
  const rawHours = (toH * 60 + (toM || 0) - (fromH * 60 + (fromM || 0))) / 60;
  const computedHours = rawHours > 0 ? Math.max(0.5, Math.min(12.0, rawHours)) : 3.0;
  const durationHours =
    tariffPlan === 'daily' ? 8.0 : tariffPlan === 'monthly' ? 12.0 : computedHours;

  // Price calculations matching backend tariff (5.75 SAR/hr, 25.00 SAR daily cap)
  let basePrice = 17.25;
  let totalPrice = 17.25;

  if (tariffPlan === 'daily') {
    basePrice = 25.0;
    totalPrice = 25.0;
  } else if (tariffPlan === 'monthly') {
    basePrice = 25.0;
    totalPrice = 25.0;
  } else {
    basePrice = Number((durationHours * 5.75).toFixed(2));
    totalPrice = Math.min(25.0, basePrice);
  }

  const handleConfirm = async () => {
    setBookingError(null);
    setCancelMessage(null);

    if (isAuthenticated === false) {
      setBookingError(
        isAr
          ? 'يرجى تسجيل الدخول أولاً لتأكيد الحجز وخصم الرصيد من محفظتك'
          : 'Please sign in to confirm booking and debit your campus wallet.'
      );
      onOpenAuth?.();
      return;
    }

    setIsSubmitting(true);

    try {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

      // If no spot selected yet, fallback to fetching any available
      let targetSpotId = selectedSpotId;
      if (!targetSpotId) {
        const spots = await parkingApi.getSpots(targetZone);
        const avail = spots.find(s => s.status === 'AVAILABLE') || spots[0];
        if (avail) {
          targetSpotId = avail.id;
          setSelectedBayNumber(avail.bayNumber);
        }
      }

      if (!targetSpotId) {
        throw new Error(
          isAr
            ? 'لم يتم العثور على موقف متاح في هذا القطاع'
            : 'No available spot found in this zone'
        );
      }

      const booking = await parkingApi.createBooking({
        spotId: targetSpotId,
        durationHours,
        autoDebitWallet: true,
        idempotencyKey: 'booking-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      });

      soundFX.playSuccess();
      setDigitalPass({
        spotId: booking.bayNumber,
        college: isAr ? booking.zoneNameAr : booking.zoneNameEn,
        userName: currentUser.name,
        userId: currentUser.id,
        plate: booking.vehiclePlate || currentUser.plate || 'أ ب ح 1234',
        duration: `${booking.durationHours} ${isAr ? 'ساعات' : 'Hours'} (${timeFrom} - ${timeTo})`,
        bookingId: booking.id,
        passCode: booking.digitalPassCode,
        qrToken: booking.qrToken,
        totalAmount: Number(booking.totalAmount),
      });

      onBookingSuccess?.(booking);
      await Promise.all([loadSpotsForZone(), loadMyBookings()]);
    } catch (err: unknown) {
      console.error('Booking failed:', err);
      soundFX.playError();
      const apiErr = err as { response?: { status?: number; data?: { detail?: string } } };
      const status = apiErr?.response?.status;
      const detail = apiErr?.response?.data?.detail;

      if (status === 401) {
        setBookingError(
          isAr
            ? 'يرجى تسجيل الدخول أولاً لتأكيد الحجز وخصم الرصيد من محفظتك'
            : 'Please sign in to confirm booking and debit your campus wallet.'
        );
        onOpenAuth?.();
      } else if (status === 409 || detail?.includes('overlap') || detail?.includes('already')) {
        setBookingError(
          isAr
            ? 'عذراً! هذا الموقف محجوز بالفعل في هذا التوقيت. يرجى اختيار موقف آخر.'
            : 'This spot is already booked for this time window. Please select another bay.'
        );
      } else if (detail) {
        setBookingError(detail);
      } else {
        setBookingError(
          isAr
            ? 'تعذر إتمام الحجز. يرجى التأكد من رصيد المحفظة والاتصال.'
            : 'Failed to complete booking. Please verify wallet balance and connectivity.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingBookingId(bookingId);
    setBookingError(null);
    setCancelMessage(null);
    try {
      await parkingApi.cancelBooking(bookingId);
      soundFX.playSuccess();
      setDigitalPass(null);
      setCancelMessage(
        isAr
          ? 'تم إلغاء الحجز بنجاح وإعادة المبلغ كاملاً إلى محفظتك الجامعية وتحرير الموقف.'
          : 'Reservation cancelled! Full amount refunded to your wallet and bay released.'
      );
      onBookingCancelled?.();
      await Promise.all([loadSpotsForZone(), loadMyBookings()]);
    } catch (err: unknown) {
      soundFX.playError();
      const apiErr = err as { response?: { data?: { detail?: string } } };
      setBookingError(
        apiErr?.response?.data?.detail ||
          (isAr ? 'تعذر إلغاء الحجز.' : 'Could not cancel reservation.')
      );
    } finally {
      setCancellingBookingId(null);
    }
  };

  return (
    <div data-testid="booking-wizard-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <Calendar size={16} color="var(--fbsu-gold)" />
          <span>{isAr ? 'حجز موقف جديد' : 'Parking Booking'}</span>
        </span>
        <h3 className="section-title">
          {isAr
            ? 'حجز موقف ذكي متوافق مع جدولك الدراسي'
            : 'Reserve Spot Synchronized with Academic Schedule'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'نظام تعرفة ذكي ومرن مطابق لمعايير المواقف الذكية (5.75 ر.س / ساعة، أو سقف يومي 25 ر.س، مع خصم مباشر من المحفظة الجامعية).'
            : 'Flexible tariff structure compliant with smart campus standards (5.75 SAR/hr, 25 SAR daily cap, with instant campus wallet deduction).'}
        </p>
      </div>

      <div className="booking-split-grid">
        {/* Booking Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Calendar size={18} color="var(--fbsu-primary)" />
            <span>{isAr ? 'بيانات الحجز الأكاديمي' : 'Reservation Details'}</span>
          </h4>

          {/* Academic Schedule Pattern Selector */}
          <div className="form-group">
            <label className="form-label">
              {isAr
                ? '1. نظام الجدول الأكاديمي بجامعة فهد بن سلطان:'
                : '1. FBSU Class Schedule Pattern:'}
            </label>
            <div className="schedule-pattern-picker" id="pattern-picker">
              <div
                className={`pattern-option ${schedulePattern === 'sun-tue' ? 'selected' : ''}`}
                onClick={() => setSchedulePattern('sun-tue')}
                role="button"
                tabIndex={0}
              >
                <h5>{isAr ? 'الأحد / الثلاثاء' : 'Sun / Tue'}</h5>
                <span>{isAr ? 'محاضرات منتظمة' : 'Standard Lectures'}</span>
              </div>
              <div
                className={`pattern-option ${schedulePattern === 'mon-wed' ? 'selected' : ''}`}
                onClick={() => setSchedulePattern('mon-wed')}
                role="button"
                tabIndex={0}
              >
                <h5>{isAr ? 'الاثنين / الأربعاء' : 'Mon / Wed'}</h5>
                <span>{isAr ? 'محاضرات منتظمة' : 'Standard Lectures'}</span>
              </div>
              <div
                className={`pattern-option ${schedulePattern === 'thu-labs' ? 'selected' : ''}`}
                onClick={() => setSchedulePattern('thu-labs')}
                role="button"
                tabIndex={0}
              >
                <h5>{isAr ? 'الخميس (معامل)' : 'Thu (Labs)'}</h5>
                <span>{isAr ? 'أيام اللابات والمختبرات' : 'Lab Sessions'}</span>
              </div>
            </div>
          </div>

          {/* Target College */}
          <div className="form-group">
            <label className="form-label">
              {isAr ? '2. الكلية المستهدفة (لاختيار أقرب موقف):' : '2. Target College:'}
            </label>
            <select
              value={selectedCollege}
              onChange={e => setSelectedCollege(e.target.value)}
              className="form-control"
            >
              <option value="computing">
                {isAr ? 'كلية الحاسب الآلي (علوم حاسب - هندسة حاسب)' : 'College of Computing'}
              </option>
              <option value="engineering">
                {isAr ? 'كلية الهندسة (مدنية - كهربائية - ميكانيكية)' : 'College of Engineering'}
              </option>
              <option value="business">
                {isAr ? 'كلية الأعمال والإدارة (تسويق - لوجستيات - محاسبة)' : 'College of Business'}
              </option>
              <option value="medicine">
                {isAr ? 'كلية الطب والعلوم الطبية' : 'College of Medicine'}
              </option>
              <option value="sciences">
                {isAr ? 'كلية العلوم والدراسات الإنسانية والقانون' : 'Sciences & Humanities'}
              </option>
            </select>
          </div>

          {/* Tariff Plan */}
          <div className="form-group">
            <label className="form-label">
              {isAr ? '3. نوع الباقة / التعرفة:' : '3. Tariff Plan:'}
            </label>
            <div className="tariff-picker-grid">
              <div
                className={`pattern-option ${tariffPlan === 'hourly' ? 'selected' : ''}`}
                onClick={() => setTariffPlan('hourly')}
                role="button"
                tabIndex={0}
              >
                <h5>{isAr ? 'بالساعة' : 'Hourly'}</h5>
                <span style={{ color: 'var(--fbsu-gold)' }}>5.75 SAR/h</span>
              </div>
              <div
                className={`pattern-option ${tariffPlan === 'daily' ? 'selected' : ''}`}
                onClick={() => setTariffPlan('daily')}
                role="button"
                tabIndex={0}
              >
                <h5>{isAr ? 'يومي كامل' : 'Daily Cap'}</h5>
                <span style={{ color: 'var(--fbsu-gold)' }}>25.00 SAR</span>
              </div>
              <div
                className={`pattern-option ${tariffPlan === 'monthly' ? 'selected' : ''}`}
                onClick={() => setTariffPlan('monthly')}
                role="button"
                tabIndex={0}
              >
                <h5>{isAr ? 'اشتراك شهري' : 'Monthly'}</h5>
                <span style={{ color: 'var(--fbsu-gold)' }}>25.00 SAR/day</span>
              </div>
            </div>
          </div>

          {/* Spot Picker */}
          <div className="form-group">
            <label className="form-label">
              {isAr ? '4. اختيار الموقف المطلوب في هذا القطاع:' : '4. Select Parking Bay:'}
            </label>
            {availableSpots.length > 0 ? (
              <select
                value={selectedSpotId}
                onChange={e => {
                  const sId = e.target.value;
                  setSelectedSpotId(sId);
                  const found = availableSpots.find(s => s.id === sId);
                  if (found) setSelectedBayNumber(found.bayNumber);
                }}
                className="form-control"
                data-testid="wizard-spot-select"
              >
                {availableSpots.map(s => (
                  <option key={s.id} value={s.id}>
                    {isAr
                      ? `موقف #${String(s.bayNumber).padStart(2, '0')} (${s.zoneCode} - ${s.zoneNameAr}) — مسافة ${s.distanceMeters}م`
                      : `Bay #${String(s.bayNumber).padStart(2, '0')} (${s.zoneCode} - ${s.zoneNameEn}) — ${s.distanceMeters}m`}
                  </option>
                ))}
              </select>
            ) : (
              <div
                style={{
                  color: 'var(--status-occupied)',
                  fontSize: '0.85rem',
                  padding: '0.5rem 0',
                }}
              >
                {isAr
                  ? 'لا توجد مواقف شاغرة حالياً في هذا القطاع، سيتم تخصيص أقرب موقف متاح تلقائياً.'
                  : 'No vacant bays currently in this zone; system will auto-assign closest available.'}
              </div>
            )}
          </div>

          {/* Time Range */}
          {tariffPlan === 'hourly' && (
            <div className="form-group">
              <label className="form-label">
                {isAr ? '5. الساعات المطلوبة للموقف:' : '5. Required Hours:'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'من الساعة:' : 'From:'}
                  </span>
                  <input
                    type="time"
                    className="form-control"
                    value={timeFrom}
                    onChange={e => setTimeFrom(e.target.value)}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'إلى الساعة:' : 'To:'}
                  </span>
                  <input
                    type="time"
                    className="form-control"
                    value={timeTo}
                    onChange={e => setTimeTo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Smart Share Opt-in Checkbox */}
          <div
            className="form-group"
            style={{
              background: 'var(--fbsu-gold-light)',
              border: '1px solid var(--fbsu-gold-border)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <label
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={optInFlex}
                onChange={e => setOptInFlex(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--fbsu-gold)' }}
              />
              <div>
                <strong style={{ color: 'var(--fbsu-gold)', fontSize: '0.9rem' }}>
                  {isAr
                    ? 'تفعيل ميزة التبادل الذكي التلقائي (اربح كاش باك في البريك)'
                    : 'Opt-in for AI Flex Sharing (Earn break cashback)'}
                </strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {isAr
                    ? 'عند خروجك من الجامعة في أوقات البريك، يُتاح الموقف لزملائك وتُضاف الأرباح فوراً لمحفظتك.'
                    : 'Whenever you leave campus during breaks, your spot is shared and you earn instant credit.'}
                </p>
              </div>
            </label>
          </div>

          {bookingError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.88rem',
                marginBottom: '1rem',
              }}
              data-testid="booking-error-alert"
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{bookingError}</span>
            </div>
          )}

          {cancelMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(56, 194, 176, 0.12)',
                border: '1px solid var(--status-available)',
                color: 'var(--status-available)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
              data-testid="booking-cancel-alert"
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{cancelMessage}</span>
            </div>
          )}

          <button
            className="btn-gold"
            onClick={handleConfirm}
            disabled={isSubmitting}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.95rem',
              opacity: isSubmitting ? 0.7 : 1,
            }}
            type="button"
            data-testid="confirm-booking-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="spin-anim" />
                <span>{isAr ? 'جاري التحقق وحجز الموقف...' : 'Verifying and booking spot...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} color="#0b1a17" />
                <span>
                  {isAr
                    ? 'تأكيد الحجز وإصدار التصريح الرقمي الذكي'
                    : 'Confirm & Generate Digital Gate Pass'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Live Pricing & Order Ticket */}
        <div
          className="glass-panel"
          style={{ padding: '2rem', borderColor: 'var(--fbsu-primary-border)' }}
        >
          <div
            style={{
              textAlign: 'center',
              borderBottom: '1px dashed var(--border-subtle)',
              paddingBottom: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <img
              src="/assets/branding/fbsu-logo.png"
              style={{ height: '38px', marginBottom: '0.5rem' }}
              alt="FBSU"
            />
            <h4 style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '1.05rem' }}>
              {isAr ? 'جامعة فهد بن سلطان' : 'Fahad Bin Sultan University'}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--fbsu-primary)' }}>
              {isAr
                ? 'فاتورة تصريح المواقف الذكية (Smart Pass Receipt)'
                : 'Smart Parking Pass Receipt'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.6rem 0',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>{isAr ? 'المركبة المسجلة:' : 'Vehicle:'}</span>
            <strong style={{ color: 'var(--text-main)' }}>
              {currentUser.car || 'تويوتا كامري 2023'}
            </strong>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.6rem 0',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>{isAr ? 'رقم اللوحة:' : 'License Plate:'}</span>
            <strong style={{ color: 'var(--fbsu-gold)', fontFamily: 'var(--font-en)' }}>
              {currentUser.plate || 'ب ط ك 1234'}
            </strong>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.6rem 0',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>{isAr ? 'الموقف المخصص:' : 'Assigned Spot:'}</span>
            <strong style={{ color: 'var(--status-available)' }}>
              {isAr
                ? `موقف #${String(selectedBayNumber).padStart(2, '0')} (${selectedCollege})`
                : `Bay #${String(selectedBayNumber).padStart(2, '0')} (${selectedCollege})`}
            </strong>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.6rem 0',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>{isAr ? 'فترة الحجز:' : 'Window:'}</span>
            <span>
              {tariffPlan === 'hourly'
                ? `${durationHours} ${isAr ? 'ساعات' : 'Hours'} (${timeFrom} - ${timeTo})`
                : tariffPlan === 'daily'
                  ? isAr
                    ? 'يوم كامل (سقف 25 ر.س)'
                    : 'Full Day (25 SAR Cap)'
                  : isAr
                    ? 'باقة ممتدة'
                    : 'Extended Pass'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.6rem 0',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>{isAr ? 'التعرفة الأساسية:' : 'Base Tariff:'}</span>
            <span>{basePrice.toFixed(2)} SAR</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.6rem 0',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>{isAr ? 'خصم السقف اليومي:' : 'Cap Adjustment:'}</span>
            <span style={{ color: 'var(--status-available)' }}>
              - {(basePrice - totalPrice).toFixed(2)} SAR
            </span>
          </div>

          <div
            style={{
              borderTop: '1px dashed var(--border-subtle)',
              marginTop: '0.75rem',
              paddingTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
              {isAr ? 'الإجمالي المستحق (يُخصم من المحفظة):' : 'Total Amount (Wallet Debit):'}
            </span>
            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: 'var(--fbsu-gold)',
                fontFamily: 'var(--font-en)',
              }}
              data-testid="booking-total-price"
            >
              {totalPrice.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
            </div>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              textAlign: 'center',
            }}
          >
            {isAr
              ? '* متوافق مع نظام الدفع الموحد: مدى، أبل باي، والمحفظة الجامعية.'
              : '* Compatible with Mada, Apple Pay, and University Wallet.'}
          </div>
        </div>
      </div>

      {/* User's Active & Historical Reservations ("My Bookings") */}
      {isAuthenticated && (
        <div
          className="glass-panel"
          style={{ marginTop: '2rem', padding: '1.75rem' }}
          data-testid="my-bookings-section"
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <h4
              style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}
            >
              {isAr ? 'سجل حجوزاتي وتصاريحي النشطة' : 'My Parking Reservations & Passes'}
            </h4>
            <button
              type="button"
              className="utility-pill-btn"
              onClick={loadMyBookings}
              disabled={isLoadingBookings}
              data-testid="refresh-my-bookings-btn"
            >
              <RefreshCw size={14} className={isLoadingBookings ? 'spin-anim' : ''} />
              <span>{isAr ? 'تحديث السجل' : 'Refresh'}</span>
            </button>
          </div>

          {myBookings.length === 0 ? (
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
                textAlign: 'center',
                padding: '1rem 0',
              }}
            >
              {isAr
                ? 'لا توجد حجوزات مسجلة في حسابك حالياً.'
                : 'No reservations found on your account yet.'}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {myBookings.map(booking => {
                const isConfirmed = booking.status === 'CONFIRMED' || booking.status === 'ACTIVE';
                const isCancelling = cancellingBookingId === booking.id;

                return (
                  <div
                    key={booking.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isConfirmed ? 'var(--fbsu-gold-border)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                    }}
                    data-testid={`my-booking-card-${booking.id}`}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <strong style={{ color: 'var(--fbsu-gold)', fontSize: '1rem' }}>
                          {isAr ? `موقف #${booking.bayNumber}` : `Bay #${booking.bayNumber}`} (
                          {isAr ? booking.zoneNameAr : booking.zoneNameEn})
                        </strong>
                        <span
                          className={`badge ${isConfirmed ? 'badge-available' : 'badge-occupied'}`}
                        >
                          {isConfirmed
                            ? isAr
                              ? 'مؤكد ونشط'
                              : 'CONFIRMED'
                            : isAr
                              ? 'ملغي (مسترد)'
                              : booking.status}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.85rem',
                        }}
                      >
                        <span>
                          {isAr ? 'التصريح:' : 'Pass:'} <strong>{booking.digitalPassCode}</strong>
                        </span>
                        <span>
                          {isAr ? 'المدة:' : 'Duration:'} <strong>{booking.durationHours}h</strong>
                        </span>
                        <span>
                          {isAr ? 'المبلغ:' : 'Amount:'}{' '}
                          <strong style={{ color: 'var(--fbsu-gold)' }}>
                            {Number(booking.totalAmount).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {isConfirmed && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="utility-pill-btn"
                          onClick={() =>
                            setDigitalPass({
                              spotId: booking.bayNumber,
                              college: isAr ? booking.zoneNameAr : booking.zoneNameEn,
                              userName: currentUser.name,
                              userId: currentUser.id,
                              plate: booking.vehiclePlate || currentUser.plate || 'أ ب ح 1234',
                              duration: `${booking.durationHours} ${isAr ? 'ساعات' : 'Hours'}`,
                              bookingId: booking.id,
                              passCode: booking.digitalPassCode,
                              qrToken: booking.qrToken,
                              totalAmount: Number(booking.totalAmount),
                            })
                          }
                          data-testid={`view-pass-btn-${booking.id}`}
                        >
                          <QrCode size={14} color="var(--fbsu-gold)" />
                          <span>{isAr ? 'عرض التصريح' : 'View Pass'}</span>
                        </button>
                        <button
                          type="button"
                          className="utility-pill-btn"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={isCancelling}
                          style={{ borderColor: 'rgba(239, 68, 68, 0.45)', color: '#f87171' }}
                          data-testid={`cancel-booking-btn-${booking.id}`}
                        >
                          <RotateCcw size={14} className={isCancelling ? 'spin-anim' : ''} />
                          <span>
                            {isCancelling
                              ? isAr
                                ? 'جاري الإلغاء...'
                                : 'Cancelling...'
                              : isAr
                                ? 'إلغاء واسترداد المبلغ'
                                : 'Cancel & Refund'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <DigitalPassModal
        isOpen={digitalPass !== null}
        passData={digitalPass}
        isAr={isAr}
        onClose={() => setDigitalPass(null)}
        onOpenGate={onOpenGate}
        onCancelBooking={digitalPass?.bookingId ? handleCancelBooking : undefined}
      />
    </div>
  );
};
