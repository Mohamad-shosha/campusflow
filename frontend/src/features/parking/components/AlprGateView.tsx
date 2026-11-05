import { useState, FC } from 'react';
import { Camera, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SaudiPlate } from '../../../shared/components/SaudiPlate';
import { soundFX } from '../../../shared/utils/sound';

export interface AlprGateViewProps {
  isAr: boolean;
}

export const AlprGateView: FC<AlprGateViewProps> = ({ isAr }) => {
  const [selectedPlate, setSelectedPlate] = useState<string>('ب ط ك 1234');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isGranted, setIsGranted] = useState<boolean>(false);
  const [isArmOpen, setIsArmOpen] = useState<boolean>(false);

  const handleScan = () => {
    soundFX.playScan();
    setIsScanning(true);
    setIsGranted(false);
    setIsArmOpen(false);

    setTimeout(() => {
      setIsScanning(false);
      setIsGranted(true);
      setIsArmOpen(true);
      soundFX.playGateOpen();
    }, 1200);
  };

  const parsePlate = (plateStr: string) => {
    const parts = plateStr.split(' ');
    const letters = `${parts[0] || ''} ${parts[1] || ''} ${parts[2] || ''}`;
    const numbers = parts[3] || '1234';
    const enMap: Record<string, string> = {
      'ب': 'B',
      'ط': 'T',
      'ك': 'K',
      'د': 'D',
      'ل': 'L',
      'س': 'S',
      'أ': 'A',
      'ح': 'J',
      'م': 'M',
      'ق': 'G',
      'ر': 'R',
    };
    const lettersEn = letters
      .split(' ')
      .map(l => enMap[l] || l)
      .join(' ');
    return { letters, lettersEn, numbers };
  };

  const { letters, lettersEn, numbers } = parsePlate(selectedPlate);

  return (
    <div data-testid="alpr-gate-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <Camera size={16} color="var(--fbsu-gold)" />
          <span>{isAr ? 'محاكي بوابات الجامعة والذكاء الاصطناعي' : 'Gate & ALPR Computer Vision'}</span>
        </span>
        <h3 className="section-title">
          {isAr
            ? 'نظام التعرف التلقائي على اللوحات (ALPR) وفتح البوابات الذكي'
            : 'Automated License Plate Recognition & Smart Barrier'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'كاميرات عالية الدقة مثبتة على البوابات الرئيسية لجامعة فهد بن سلطان تحلل لوحات السيارات، تتحقق من الحجوزات والتبادل الذكي، وترفع الحواجز دون الحاجة للتوقف أو إبراز بطاقات!'
            : 'High-speed AI cameras at FBSU main gates recognize Saudi license plates, verify schedule permits and flex slots, and lift the barrier seamlessly!'}
        </p>
      </div>

      <div className="sim-viewport-grid">
        {/* Camera Feed Simulated Viewport */}
        <div className="camera-feed-box">
          <div className="camera-header-overlay">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#ff3344',
                fontWeight: 800,
                fontFamily: 'var(--font-en)',
              }}
            >
              <span style={{ width: '8px', height: '8px', background: '#ff3344', borderRadius: '50%' }}></span>
              <span>LIVE: CAM-01 (MAIN_NORTH_GATE_FBSU)</span>
            </div>
            <div style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-en)', fontSize: '0.75rem' }}>
              60 FPS | 4K HDR | MODEL: FBSU-ALPR-v4.2
            </div>
          </div>

          <div className="camera-viewport">
            <div className={`cam-target-bracket ${isGranted ? 'locked' : ''}`}>
              {isScanning && <div className="scan-laser-line"></div>}
              <div
                style={{
                  position: 'absolute',
                  top: '-22px',
                  right: 0,
                  fontSize: '0.7rem',
                  color: 'var(--status-available)',
                  fontFamily: 'var(--font-en)',
                  fontWeight: 800,
                }}
              >
                AI CONFIDENCE: {isScanning ? 'ANALYZING...' : isGranted ? '99.8%' : 'READY'}
              </div>
            </div>

            {/* Saudi Plate Component */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              <SaudiPlate lettersAr={letters} lettersEn={lettersEn} digits={numbers} />
            </div>
          </div>

          {/* Physical Barrier Gate Simulation View */}
          <div className="gate-barrier-stage">
            <div className="barrier-pillar">
              <div className={`barrier-led ${isArmOpen ? 'green' : ''}`}></div>
            </div>
            <div className={`barrier-arm ${isArmOpen ? 'open' : ''}`}></div>
            <div
              style={{
                marginInlineEnd: '2rem',
                marginBottom: '0.75rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: isArmOpen ? 'var(--status-available)' : '#ef4444',
              }}
            >
              {isArmOpen
                ? isAr
                  ? 'البوابة مفتوحة - تفضل بالمرور'
                  : 'GATE OPEN - PASS THROUGH'
                : isAr
                  ? 'البوابة مغلقة - بانتظار الفحص'
                  : 'GATE CLOSED - AWAITING SCAN'}
            </div>
          </div>
        </div>

        {/* Controls & AI Recognition Result */}
        <div
          className="glass-panel"
          style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <h4
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Camera size={18} color="var(--fbsu-primary)" />
              <span>{isAr ? 'لوحة تحكم فحص البوابة' : 'Gate Simulator Controls'}</span>
            </h4>

            <div className="form-group">
              <label className="form-label">
                {isAr ? 'اختر سيارة للتجربة والفحص المباشر:' : 'Select Vehicle to Scan:'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem' }}>
                <button
                  className={`pattern-option ${selectedPlate === 'ب ط ك 1234' ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedPlate('ب ط ك 1234');
                    setIsGranted(false);
                    setIsArmOpen(false);
                  }}
                  type="button"
                  style={{ textAlign: 'start' }}
                >
                  <h5 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    {isAr ? 'سيارة الطالب إياد الحربي (كامري)' : 'Eyad Al-Harbi (Toyota Camry)'}
                  </h5>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    لوحة: <strong>ب ط ك 1234</strong> - موقف #01 (كلية الهندسة)
                  </span>
                </button>

                <button
                  className={`pattern-option ${selectedPlate === 'د ل س 8892' ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedPlate('د ل س 8892');
                    setIsGranted(false);
                    setIsArmOpen(false);
                  }}
                  type="button"
                  style={{ textAlign: 'start' }}
                >
                  <h5 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    {isAr ? 'سيارة الطالب راكان المطيري (سوناتا)' : 'Rakan Al-Mutairi (Hyundai Sonata)'}
                  </h5>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    لوحة: <strong>د ل س 8892</strong> - حجز تبادل ذكي في بريك إياد
                  </span>
                </button>

                <button
                  className={`pattern-option ${selectedPlate === 'أ ح م 5501' ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedPlate('أ ح م 5501');
                    setIsGranted(false);
                    setIsArmOpen(false);
                  }}
                  type="button"
                  style={{ textAlign: 'start' }}
                >
                  <h5 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    {isAr ? 'سيارة د. عبد الله الغامدي (جينيسيس)' : 'Dr. Abdullah Al-Ghamdi (Genesis)'}
                  </h5>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    لوحة: <strong>أ ح م 5501</strong> - كادر التدريس - موقف #19
                  </span>
                </button>

                <button
                  className={`pattern-option ${selectedPlate === 'ق ر ط 9921' ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedPlate('ق ر ط 9921');
                    setIsGranted(false);
                    setIsArmOpen(false);
                  }}
                  type="button"
                  style={{ textAlign: 'start' }}
                >
                  <h5 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    {isAr ? 'سيارة زائر خارجي' : 'Campus Visitor'}
                  </h5>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    لوحة: <strong>ق ر ط 9921</strong> - حجز مسبق عبر المنظومة
                  </span>
                </button>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <button
                className="btn-primary"
                onClick={handleScan}
                disabled={isScanning}
                style={{ width: '100%', justifyContent: 'center' }}
                type="button"
                data-testid="trigger-gate-scan-btn"
              >
                <Camera size={18} color="#ffffff" />
                <span>
                  {isScanning
                    ? isAr
                      ? 'جاري الفحص والمعالجة بالذكاء الاصطناعي...'
                      : 'Scanning with AI...'
                    : isAr
                      ? 'مسح اللوحة والتحقق بالذكاء الاصطناعي'
                      : 'Scan & Validate Plate'}
                </span>
              </button>
            </div>
          </div>

          {/* Result Box */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${isGranted ? 'var(--status-available-border)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginTop: '1rem',
            }}
          >
            {isGranted ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={28} color="var(--status-available)" />
                <div>
                  <h5 style={{ color: 'var(--status-available)', fontWeight: 800, fontSize: '0.95rem' }}>
                    {isAr
                      ? 'تم التحقق بنجاح - مرحباً بك في جامعة فهد بن سلطان'
                      : 'Access Granted - Welcome to FBSU'}
                  </h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {isAr
                      ? 'اللوحة مصرح لها بالدخول. توجه إلى الموقف المخصص وتم تفعيل إضاءة التوجيه الذكية.'
                      : 'Authorized plate. Proceed to assigned spot with dynamic guidance.'}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={28} color="var(--text-dim)" />
                <div>
                  <h5 style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem' }}>
                    {isAr ? 'بانتظار اقتراب السيارة من البوابة' : 'Waiting for vehicle approach'}
                  </h5>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {isAr
                      ? 'اضغط زر المسح أعلاه لتشغيل قارئ الكاميرا ورفع الذراع آلياً.'
                      : 'Click scan above to test ALPR recognition and barrier lifting.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
