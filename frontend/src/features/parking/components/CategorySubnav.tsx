import { FC } from 'react';
import {
  Car,
  BookOpen,
  MapPin,
  Calendar,
  Zap,
  Camera,
  RefreshCw,
  Users,
  UserCheck,
  DoorClosed,
} from 'lucide-react';
import { soundFX } from '../../../shared/utils/sound';

export interface CategorySubnavProps {
  activeTab: string;
  isAr: boolean;
  onTabChange: (tab: string) => void;
}

export const CategorySubnav: FC<CategorySubnavProps> = ({
  activeTab,
  isAr,
  onTabChange,
}) => {
  const isParkingCategory = ['map', 'booking', 'simulator', 'gate', 'share'].includes(activeTab);
  const isCampusCategory = ['tutoring', 'office-hours', 'rooms'].includes(activeTab);

  if (!isParkingCategory && !isCampusCategory) return null;

  return (
    <div className="category-subnav-wrapper" style={{ marginBottom: '2rem' }}>
      {isParkingCategory && (
        <div className="category-subnav-strip">
          <div className="subnav-category-badge">
            <Car size={14} color="var(--fbsu-primary)" />
            <span>{isAr ? 'منظومة المواقف الذكية' : 'Smart Parking Suite'}</span>
          </div>

          <button
            className={`subnav-chip-btn ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              onTabChange('map');
            }}
            type="button"
          >
            <MapPin size={13} />
            <span>{isAr ? 'خريطة المواقف الحية' : 'Live Map'}</span>
          </button>

          <button
            className={`subnav-chip-btn ${activeTab === 'booking' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              onTabChange('booking');
            }}
            type="button"
          >
            <Calendar size={13} />
            <span>{isAr ? 'حجز موقف وتصريح' : 'Book Spot'}</span>
          </button>

          <button
            className={`subnav-chip-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              onTabChange('simulator');
            }}
            type="button"
          >
            <Zap size={13} />
            <span>{isAr ? 'محاكاة التبادل Flex-Share' : 'Flex Swap Demo'}</span>
          </button>

          <button
            className={`subnav-chip-btn ${activeTab === 'gate' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              onTabChange('gate');
            }}
            type="button"
          >
            <Camera size={13} />
            <span>{isAr ? 'بوابة وكاميرات ALPR' : 'Gate ALPR'}</span>
          </button>

          <button
            className={`subnav-chip-btn ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              onTabChange('share');
            }}
            type="button"
          >
            <RefreshCw size={13} />
            <span>{isAr ? 'شارك موقفك واربح' : 'Share & Earn'}</span>
          </button>
        </div>
      )}

      {isCampusCategory && (
        <div className="category-subnav-strip">
          <div className="subnav-category-badge" style={{ borderColor: 'var(--fbsu-gold-border)' }}>
            <BookOpen size={14} color="var(--fbsu-gold)" />
            <span style={{ color: 'var(--fbsu-gold)' }}>
              {isAr ? 'الحرم الجامعي والأنشطة الطلابية' : 'Smart Campus Hub'}
            </span>
          </div>

          <button
            className={`subnav-chip-btn ${activeTab === 'tutoring' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              onTabChange('tutoring');
            }}
            type="button"
          >
            <Users size={13} />
            <span>{isAr ? 'النشاط الطلابي والتدريس (70 ر.س)' : 'Peer Tutoring (70 SAR)'}</span>
          </button>

          <button
            className={`subnav-chip-btn ${activeTab === 'office-hours' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              onTabChange('office-hours');
            }}
            type="button"
          >
            <UserCheck size={13} />
            <span>{isAr ? 'الساعات المكتبية للعمداء والرؤساء' : 'Faculty Office Hours'}</span>
          </button>

          <button
            className={`subnav-chip-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              onTabChange('rooms');
            }}
            type="button"
          >
            <DoorClosed size={13} />
            <span>{isAr ? 'حجز القاعات ومعامل الحاسوب' : 'Labs & Study Pods'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

