import { useState, FC } from 'react';
import { MapPin, Building2, ArrowUp, ArrowDown, ShieldCheck } from 'lucide-react';
import type { ParkingSpot } from '../data/parkingData';
import { SpotCard } from './SpotCard';
import { SpotDetailsModal } from './SpotDetailsModal';
import { DigitalPassModal, type DigitalPassData } from './DigitalPassModal';
import { soundFX } from '../../../shared/utils/sound';

export interface ParkingLotViewProps {
  spots: ParkingSpot[];
  isAr: boolean;
  currentUser: {
    id: string;
    name: string;
    plate?: string;
    primarySpot?: number;
  };
  onReserveSpot?: (spotId: number) => void;
  onOpenGate?: () => void;
}

export const ParkingLotView: FC<ParkingLotViewProps> = ({
  spots,
  isAr,
  currentUser,
  onReserveSpot,
  onOpenGate,
}) => {
  const [activeZone, setActiveZone] = useState<string>('all');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [digitalPass, setDigitalPass] = useState<DigitalPassData | null>(null);

  const filteredSpots = spots.filter(spot => {
    if (activeZone === 'all') return true;
    return spot.zone === activeZone;
  });

  const handleBookFromModal = (spot: ParkingSpot) => {
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
  };

  return (
    <div data-testid="parking-lot-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <MapPin size={16} color="var(--fbsu-gold)" />
          <span>{isAr ? 'خريطة المواقف التفاعلية' : 'Interactive Map'}</span>
        </span>
        <h3 className="section-title">
          {isAr
            ? 'المخطط الرقمي المباشر لمواقف جامعة فهد بن سلطان (30 موقف)'
            : 'FBSU Live Digital Parking Lot (30 Bays)'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'عرض لحظي لحالة الحساسات الأرضية وكاميرات الرؤية الحاسوبية. اضغط على أي موقف لعرض التفاصيل الكاملة، أو حجزه، أو تفعيل التبادل الذكي!'
            : 'Real-time sensor & computer vision status. Click any bay to view details, reserve, or initiate AI flex exchange!'}
        </p>
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
            <span>{isAr ? 'جميع القطاعات (30 موقف)' : 'All Zones (30)'}</span>
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
        </div>

        <div className="legend-list">
          <div className="legend-item">
            <span className="legend-chip avail"></span> {isAr ? 'متاح' : 'Available'}
          </div>
          <div className="legend-item">
            <span className="legend-chip occ"></span> {isAr ? 'مشغول' : 'Occupied'}
          </div>
          <div className="legend-item">
            <span className="legend-chip flx"></span> {isAr ? 'تبادل ذكي (بريك)' : 'AI Flex (Break)'}
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
            <span>{isAr ? 'مزامنة إنترنت الأشياء IoT نشطة' : 'IoT Real-time Sync Active'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowDown size={14} color="var(--fbsu-primary)" />
            <span>
              {isAr
                ? 'مبنى كلية الهندسة والحاسب الآلي'
                : 'College of Engineering & Computing'}
            </span>
          </div>
        </div>

        {/* Bays Grid */}
        <div className="parking-bays-container">
          {filteredSpots.map(spot => (
            <SpotCard
              key={spot.id}
              spot={spot}
              isAr={isAr}
              isCurrentUserSpot={currentUser.primarySpot === spot.id}
              onClick={s => setSelectedSpot(s)}
            />
          ))}
        </div>
      </div>

      {/* Spot Details Modal */}
      <SpotDetailsModal
        isOpen={selectedSpot !== null}
        spot={selectedSpot}
        isAr={isAr}
        onClose={() => setSelectedSpot(null)}
        onBook={handleBookFromModal}
      />

      {/* Digital Pass Modal */}
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
