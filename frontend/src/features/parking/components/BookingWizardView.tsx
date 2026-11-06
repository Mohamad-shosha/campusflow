import { useState, useEffect, FC } from 'react';
import { Calendar, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { DigitalPassModal, type DigitalPassData } from './DigitalPassModal';
import { soundFX } from '../../../shared/utils/sound';
import { parkingApi } from '../api/parkingApi';
import type { ParkingSpotResponse, BookingResponse } from '../types/parking';

export interface BookingWizardViewProps {
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
    car?: string;
    plate?: string;
    primarySpot?: number;
  };
  onOpenGate?: () => void;
  onOpenAuth?: () => void;
  onBookingSuccess?: (booking: BookingResponse) => void;
}

export const BookingWizardView: FC<BookingWizardViewProps> = ({
  isAr,
  currentUser,
  onOpenGate,
  onOpenAuth,
  onBookingSuccess,
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

  // Map college to zone
  const targetZone = selectedCollege === 'business' ? 'B' : selectedCollege === 'medicine' ? 'B' : selectedCollege === 'sciences' ? 'C' : 'A';

  useEffect(() => {
    let isMounted = true;
    parkingApi.getSpots(targetZone)
      .then(spots => {
        if (!isMounted) return;
        const available = spots.filter(s => s.status === 'AVAILABLE');
        setAvailableSpots(available);
        if (available.length > 0) {
          setSelectedSpotId(available[0].id);
          setSelectedBayNumber(available[0].bayNumber);
        } else if (spots.length > 0) {
          setSelectedSpotId(spots[0].id);
          setSelectedBayNumber(spots[0].bayNumber);
        }
      })
      .catch(err => {
        console.warn('Could not load spots for zone', targetZone, err);
      });
    return () => {
      isMounted = false;
    };
  }, [targetZone]);

  // Price calculations
  let basePrice = 17.25;
  let discount = 5.75;
  let totalPrice = 11.5;

  if (tariffPlan === 'daily') {
    basePrice = 15.0;
    discount = optInFlex ? 5.0 : 0.0;
    totalPrice = basePrice - discount;
  } else if (tariffPlan === 'monthly') {
    basePrice = 450.0;
    discount = optInFlex ? 225.0 : 0.0;
    totalPrice = basePrice - discount;
  } else {
    // hourly (3 hours default)
    basePrice = 17.25;
    discount = optInFlex ? 5.75 : 0.0;
    totalPrice = basePrice - discount;
  }

  const handleConfirm = async () => {
    setBookingError(null);
    setIsSubmitting(true);

    try {
      // Build ISO timestamps for reservation
      const today = new Date();
      const [fromH, fromM] = timeFrom.split(':').map(Number);
      const [toH, toM] = timeTo.split(':').map(Number);

      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), fromH, fromM, 0);
      let endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), toH, toM, 0);

      // If end time is before or equal to start time, advance by 2 hours
      if (endDate <= startDate) {
        endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
      }

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
        throw new Error(isAr ? 'لم يتم العثور على موقف متاح في هذا القطاع' : 'No available spot found in this zone');
      }

      const booking = await parkingApi.createBooking({
        spotId: targetSpotId,
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
        totalAmount: booking.totalAmount,
      });

      onBookingSuccess?.(booking);
    } catch (err: any) {
      console.error('Booking failed:', err);
      soundFX.playError();
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;

      if (status === 401) {
        setBookingError(isAr ? 'يرجى تسجيل الدخول أولاً لتأكيد الحجز وخصم الرصيد من محفظتك' : 'Please sign in to confirm booking and debit your campus wallet.');
        onOpenAuth?.();
      } else if (status === 409 || detail?.includes('overlap')) {
        setBookingError(isAr ? 'عذراً! هذا الموقف محجوز بالفعل في هذا التوقيت. يرجى اختيار موقف آخر.' : 'This spot is already booked for this time window. Please select another bay.');
      } else if (detail) {
        setBookingError(detail);
      } else {
        setBookingError(isAr ? 'تعذر إتمام الحجز. يرجى التأكد من رصيد المحفظة والاتصال.' : 'Failed to complete booking. Please verify wallet balance and connectivity.');
      }
    } finally {
      setIsSubmitting(false);
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
            ? 'نظام تعرفة ذكي ومرن مطابق لمعايير المواقف الذكية (5.75 ر.س / ساعة، أو سقف يومي 15 ر.س، أو اشتراك شهري مع خصم التبادل الذكي).'
            : 'Flexible tariff structure compliant with smart campus standards (5.75 SAR/hr, 15 SAR daily cap, or monthly pass with 50% sharing discount).'}
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
              {isAr ? '1. نظام الجدول الأكاديمي بجامعة فهد بن سلطان:' : '1. FBSU Class Schedule Pattern:'}
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
              <option value="medicine">{isAr ? 'كلية الطب والعلوم الطبية' : 'College of Medicine'}</option>
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
                <span style={{ color: 'var(--fbsu-gold)' }}>15.00 SAR</span>
              </div>
              <div
                className={`pattern-option ${tariffPlan === 'monthly' ? 'selected' : ''}`}
                onClick={() => setTariffPlan('monthly')}
                role="button"
                tabIndex={0}
              >
                <h5>{isAr ? 'اشتراك شهري' : 'Monthly'}</h5>
                <span style={{ color: 'var(--fbsu-gold)' }}>450 SAR (or 225*)</span>
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
              <div style={{ color: 'var(--status-occupied)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                {isAr ? 'لا توجد مواقف شاغرة حالياً في هذا القطاع، سيتم تخصيص أقرب موقف متاح تلقائياً.' : 'No vacant bays currently in this zone; system will auto-assign closest available.'}
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={optInFlex}
                onChange={e => setOptInFlex(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--fbsu-gold)' }}
              />
              <div>
                <strong style={{ color: 'var(--fbsu-gold)', fontSize: '0.9rem' }}>
                  {isAr
                    ? 'تفعيل ميزة التبادل الذكي التلقائي (اربح حتى 50% خصم)'
                    : 'Opt-in for AI Flex Sharing (Save up to 50%)'}
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
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{bookingError}</span>
            </div>
          )}

          <button
            className="btn-gold"
            onClick={handleConfirm}
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center', padding: '0.95rem', opacity: isSubmitting ? 0.7 : 1 }}
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
        <div className="glass-panel" style={{ padding: '2rem', borderColor: 'var(--fbsu-primary-border)' }}>
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
              {isAr ? `موقف #${String(selectedBayNumber).padStart(2, '0')} (${selectedCollege})` : `Bay #${String(selectedBayNumber).padStart(2, '0')} (${selectedCollege})`}
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
                ? `3 ${isAr ? 'ساعات' : 'Hours'} (${timeFrom} - ${timeTo})`
                : tariffPlan === 'daily'
                  ? isAr
                    ? 'يوم كامل'
                    : 'Full Day'
                  : isAr
                    ? 'شهر كامل'
                    : '1 Month'}
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
            <span>{isAr ? 'خصم التبادل المتوقع:' : 'Flex Discount:'}</span>
            <span style={{ color: 'var(--status-available)' }}>- {discount.toFixed(2)} SAR</span>
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
              {isAr ? 'الإجمالي المستحق:' : 'Total Amount:'}
            </span>
            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: 'var(--fbsu-gold)',
                fontFamily: 'var(--font-en)',
              }}
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

      <DigitalPassModal
        isOpen={digitalPass !== null}
        passData={digitalPass}
        isAr={isAr}
        onClose={() => setDigitalPass(null)}
        onOpenGate={onOpenGate}
      />
    </div>
  );
};

