import { useState, type FC } from 'react';
import { MapPin, Building2, ArrowUp, ArrowDown, ShieldCheck, RotateCw } from 'lucide-react';
import type { ParkingSpot } from '../data/parkingData';
import type { BookingResponse } from '../types/parking';
import { SpotCard } from './SpotCard';
import { SpotDetailsModal } from './SpotDetailsModal';
import { DigitalPassModal, type DigitalPassData } from './DigitalPassModal';
import { soundFX } from '../../../shared/utils/sound';
import { parkingApi } from '../api/parkingApi';

export interface ParkingLotViewProps {
  spots: ParkingSpot[];
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
    plate?: string | undefined;
    primarySpot?: number | undefined;
  };
  isAuthenticated?: boolean | undefined;
  onOpenAuth?: (() => void) | undefined;
  onReserveSpot?: ((spotId: number) => void) | undefined;
  onBookingSuccess?: ((booking: BookingResponse) => void) | undefined;
  onBookingCancelled?: (() => void) | undefined;
  onOpenGate?: (() => void) | undefined;
  isLoading?: boolean | undefined;
  onRefresh?: (() => void) | undefined;
  lastUpdated?: Date | null | undefined;
}

export const ParkingLotView: FC<ParkingLotViewProps> = ({
  spots,
  isAr,
  currentUser,
  isAuthenticated,
  onOpenAuth,
  onReserveSpot,
  onBookingSuccess,
  onBookingCancelled,
  onOpenGate,
  isLoading = false,
  onRefresh,
  lastUpdated,
}) => {
  const [activeZone, setActiveZone] = useState<string>('all');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isBookingSpot, setIsBookingSpot] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [digitalPass, setDigitalPass] = useState<DigitalPassData | null>(null);

  const filteredSpots = spots.filter(spot => {
    if (activeZone === 'all') return true;
    return spot.zone === activeZone;
  });

  const handleBookFromModal = async (spot: ParkingSpot) => {
    setBookingError(null);

    // If spot does not have backendId (isolated unit test fallback), use local handler
    if (!spot.backendId) {
      setSelectedSpot(null);
      onReserveSpot?.(spot.id);
      setDigitalPass({
        spotId: spot.id,
        college: isAr ? spot.college : spot.collegeEn,
        userName: currentUser.name,
        userId: currentUser.id,
        plate: currentUser.plate || 'ب ط ك 1234',
        duration: isAr ? '3 ساعات (09:00 - 12:00)' : '3 Hours (09:00 - 12:00)',
      });
      return;
    }

    if (isAuthenticated === false) {
      setBookingError(
        isAr
          ? 'يرجى تسجيل الدخول أولاً لتأكيد الحجز وخصم الرسوم من محفظتك الجامعية.'
          : 'Please sign in first to confirm your booking and debit your campus wallet.'
      );
      onOpenAuth?.();
      return;
    }

    setIsBookingSpot(true);
    try {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

      const booking = await parkingApi.createBooking({
        spotId: spot.backendId,
        durationHours: 3.0,
        autoDebitWallet: true,
        idempotencyKey:
          'map-booking-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      });

      soundFX.playSuccess();
      setSelectedSpot(null);
      setDigitalPass({
        spotId: booking.bayNumber || spot.id,
        college: isAr ? booking.zoneNameAr || spot.college : booking.zoneNameEn || spot.collegeEn,
        userName: currentUser.name,
        userId: currentUser.id,
        plate: booking.vehiclePlate || currentUser.plate || 'ب ط ك 1234',
        duration: `${booking.durationHours} ${isAr ? 'ساعات' : 'Hours'}`,
        bookingId: booking.id,
        passCode: booking.digitalPassCode,
        qrToken: booking.qrToken,
        totalAmount: Number(booking.totalAmount),
      });
      onBookingSuccess?.(booking);
    } catch (err: unknown) {
      soundFX.playError();
      const errorObj = err as {
        response?: { status?: number; data?: { detail?: string; message?: string } };
      };
      if (errorObj?.response?.status === 401) {
        setBookingError(
          isAr
            ? 'يرجى تسجيل الدخول أولاً لتأكيد الحجز وخصم الرصيد من محفظتك.'
            : 'Please sign in to confirm booking and debit your campus wallet.'
        );
        onOpenAuth?.();
      } else {
        setBookingError(
          errorObj?.response?.data?.detail ||
            errorObj?.response?.data?.message ||
            (isAr
              ? 'تعذر إتمام الحجز. يرجى التأكد من رصيد المحفظة وتوفر الموقف.'
              : 'Failed to complete booking. Please verify wallet balance and spot availability.')
        );
      }
    } finally {
      setIsBookingSpot(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    await parkingApi.cancelBooking(bookingId);
    soundFX.playSuccess();
    onBookingCancelled?.();
  };

  return (
    <div data-testid="parking-lot-view">
      <div
        className="section-head"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span className="section-eyebrow">
            <MapPin size={16} color="var(--fbsu-gold)" />
            <span>{isAr ? 'خريطة المواقف التفاعلية' : 'Interactive Map'}</span>
          </span>
          <h3 className="section-title">
            {isAr
              ? `المخطط الرقمي المباشر لمواقف جامعة فهد بن سلطان (${spots.length} موقف)`
              : `FBSU Live Digital Parking Lot (${spots.length} Bays)`}
          </h3>
          <p className="section-subtitle">
            {isAr
              ? 'عرض لحظي لحالة الحساسات الأرضية وكاميرات الرؤية الحاسوبية. اضغط على أي موقف لعرض التفاصيل الكاملة، أو حجزه، أو تفعيل التبادل الذكي!'
              : 'Real-time sensor & computer vision status. Click any bay to view details, reserve, or initiate AI flex exchange!'}
          </p>
        </div>

        {onRefresh && (
          <button
            type="button"
            className="btn-glass"
            onClick={() => {
              soundFX.playClick();
              onRefresh();
            }}
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'center' }}
            title={isAr ? 'تحديث فوري من قاعدة البيانات' : 'Sync live with PostgreSQL'}
          >
            <RotateCw size={15} className={isLoading ? 'spin-anim' : ''} />
            <span>
              {isAr
                ? isLoading
                  ? 'جاري المزامنة...'
                  : 'تحديث مباشر'
                : isLoading
                  ? 'Syncing...'
                  : 'Live Sync'}
            </span>
          </button>
        )}
      </div>

      {/* Parking Toolbar: Filters & Legend */}
      <div className="parking-toolbar">
        <div className="zone-filter-tabs">
          <button
            className={`zone-btn ${activeZone === 'all' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('all');
            }}
            type="button"
          >
            <Building2 size={14} />
            <span>
              {isAr ? `جميع القطاعات (${spots.length} موقف)` : `All Zones (${spots.length})`}
            </span>
          </button>
          <button
            className={`zone-btn ${activeZone === 'A' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('A');
            }}
            type="button"
          >
            <span>{isAr ? 'قطاع A - الحاسب والهندسة' : 'Zone A - Computing & Eng'}</span>
          </button>
          <button
            className={`zone-btn ${activeZone === 'B' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('B');
            }}
            type="button"
          >
            <span>{isAr ? 'قطاع B - إدارة الأعمال والطب' : 'Zone B - Business & Med'}</span>
          </button>
          <button
            className={`zone-btn ${activeZone === 'C' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('C');
            }}
            type="button"
          >
            <span>{isAr ? 'قطاع C - كادر التدريس' : 'Zone C - Faculty VIP'}</span>
          </button>
          <button
            className={`zone-btn ${activeZone === 'D' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('D');
            }}
            type="button"
          >
            <span>{isAr ? 'قطاع D - شحن كهربائي EV' : 'Zone D - EV Charging'}</span>
          </button>
          <button
            className={`zone-btn ${activeZone === 'E' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveZone('E');
            }}
            type="button"
          >
            <span>{isAr ? 'قطاع E - البوابة المركزية' : 'Zone E - Main Gate'}</span>
          </button>
        </div>

        <div className="legend-list">
          <div className="legend-item">
            <span className="legend-chip avail"></span> {isAr ? 'متاح' : 'Available'}
          </div>
          <div className="legend-item">
            <span className="legend-chip occ"></span> {isAr ? 'مشغول' : 'Occupied'}
          </div>
          <div className="legend-item">
            <span className="legend-chip flx"></span>{' '}
            {isAr ? 'تبادل ذكي (بريك)' : 'AI Flex (Break)'}
          </div>
          <div className="legend-item">
            <span className="legend-chip res"></span> {isAr ? 'محجوز لك' : 'Your Spot'}
          </div>
          <div className="legend-item">
            <span className="legend-chip fac"></span> {isAr ? 'أعضاء التدريس' : 'Faculty'}
          </div>
        </div>
      </div>

      {/* 2D/3D Parking Lot Canvas */}
      <div className="parking-lot-canvas">
        <div className="campus-road-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUp size={14} color="var(--fbsu-primary)" />
            <span>
              {isAr
                ? 'طريق الملك خالد - بوابة الحرم الجامعي الرئيسية'
                : 'King Khalid Road - Main Gate'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--fbsu-gold)',
            }}
          >
            <ShieldCheck size={14} color="var(--fbsu-gold)" />
            <span>
              {isAr
                ? lastUpdated
                  ? `مزامنة حية نشطة مع قاعدة البيانات (${lastUpdated.toLocaleTimeString('ar-SA')})`
                  : 'مزامنة إنترنت الأشياء IoT نشطة'
                : lastUpdated
                  ? `Live Database Sync (${lastUpdated.toLocaleTimeString()})`
                  : 'IoT Real-time Sync Active'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowDown size={14} color="var(--fbsu-primary)" />
            <span>
              {isAr ? 'مبنى كلية الهندسة والحاسب الآلي' : 'College of Engineering & Computing'}
            </span>
          </div>
        </div>

        {/* Bays Grid */}
        <div
          className="parking-bays-container"
          style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s ease' }}
        >
          {filteredSpots.map(spot => (
            <SpotCard
              key={spot.id}
              spot={spot}
              isAr={isAr}
              isCurrentUserSpot={currentUser.primarySpot === spot.id}
              onClick={s => {
                setBookingError(null);
                setSelectedSpot(s);
              }}
            />
          ))}
        </div>
      </div>

      {/* Spot Details Modal */}
      <SpotDetailsModal
        isOpen={selectedSpot !== null}
        spot={selectedSpot}
        isAr={isAr}
        onClose={() => {
          setBookingError(null);
          setSelectedSpot(null);
        }}
        onBook={handleBookFromModal}
        isBooking={isBookingSpot}
        bookingError={bookingError}
      />

      {/* Digital Pass Modal */}
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
