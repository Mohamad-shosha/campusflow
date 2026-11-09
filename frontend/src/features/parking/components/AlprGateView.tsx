import { useState, FC } from 'react';
import { Camera, CheckCircle2, ShieldCheck, XCircle, Clock, Shield, Sparkles } from 'lucide-react';
import { SaudiPlate } from '../../../shared/components/SaudiPlate';
import { soundFX } from '../../../shared/utils/sound';
import { parkingApi } from '../api/parkingApi';
import type { GateDecisionResponse } from '../types/parking';

export interface AlprGateViewProps {
  isAr: boolean;
}

interface ScanLogEntry {
  id: string;
  timestamp: string;
  plate: string;
  decision: 'GRANTED' | 'DENIED';
  driverName: string;
  bayInfo: string;
  reason: string;
}

export const AlprGateView: FC<AlprGateViewProps> = ({ isAr }) => {
  const [selectedPlate, setSelectedPlate] = useState<string>('س ع د 7700');
  const [customLetters, setCustomLetters] = useState<string>('');
  const [customDigits, setCustomDigits] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastDecision, setLastDecision] = useState<GateDecisionResponse | null>(null);
  const [isArmOpen, setIsArmOpen] = useState<boolean>(false);
  const [scanHistory, setScanHistory] = useState<ScanLogEntry[]>([]);

  const parsePlate = (plateStr: string) => {
    const parts = plateStr.trim().split(/\s+/);
    const letters = `${parts[0] || 'س'} ${parts[1] || 'ع'} ${parts[2] || 'د'}`;
    const numbers = parts[3] || '7700';
    const enMap: Record<string, string> = {
      أ: 'A',
      ب: 'B',
      ح: 'J',
      د: 'D',
      ر: 'R',
      س: 'S',
      ص: 'X',
      ط: 'T',
      ع: 'E',
      ق: 'G',
      ك: 'K',
      ل: 'L',
      م: 'M',
      ن: 'N',
      ه: 'H',
      و: 'U',
      ي: 'V',
    };
    const lettersEn = letters
      .split(' ')
      .map(l => enMap[l] || l)
      .join(' ');
    return { letters, lettersEn, numbers };
  };

  const { letters, lettersEn, numbers } = parsePlate(selectedPlate);

  const handleScan = async () => {
    soundFX.playScan();
    setIsScanning(true);
    setLastDecision(null);
    setIsArmOpen(false);

    try {
      const parts = selectedPlate.trim().split(/\s+/);
      const plateLettersAr = `${parts[0] || 'س'} ${parts[1] || 'ع'} ${parts[2] || 'د'}`;
      const plateDigits = parts[3] || '7700';

      const decision = await parkingApi.scanGate({
        gateId: 'GATE_MAIN_NORTH_01',
        plateLettersAr,
        plateDigits,
      });

      setLastDecision(decision);

      const isGranted = decision.decision === 'GRANTED';
      if (isGranted) {
        setIsArmOpen(true);
        soundFX.playGateOpen();
      } else {
        setIsArmOpen(false);
        soundFX.playError();
      }

      // Add to log
      const newLog: ScanLogEntry = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        plate: selectedPlate,
        decision: decision.decision,
        driverName:
          (isAr ? decision.driverNameAr : decision.driverNameEn) ||
          (isAr ? 'غير مسجل' : 'Unregistered'),
        bayInfo: decision.bayNumber
          ? isAr
            ? `موقف #${decision.bayNumber}`
            : `Bay #${decision.bayNumber}`
          : '—',
        reason: isAr ? decision.displayMessageAr : decision.displayMessageEn,
      };

      setScanHistory(prev => [newLog, ...prev.slice(0, 7)]);
    } catch {
      soundFX.playError();
      setIsArmOpen(false);
      setLastDecision({
        decision: 'DENIED',
        gateAction: 'KEEP_CLOSED',
        reasonCode: 'NETWORK_ERROR',
        displayMessageAr: 'تعذر الاتصال بمركز معالجة بوابات الجامعة',
        displayMessageEn: 'Failed to contact university gate control center',
        scannedPlate: selectedPlate,
      });
    } finally {
      setIsScanning(false);
    }
  };

  const selectPreset = (plateStr: string) => {
    soundFX.playClick();
    setSelectedPlate(plateStr);
    setIsCustomMode(false);
    setLastDecision(null);
    setIsArmOpen(false);
  };

  const handleApplyCustomPlate = () => {
    if (!customLetters.trim() || !customDigits.trim()) return;
    soundFX.playClick();
    const formatted = `${customLetters.trim()} ${customDigits.trim()}`;
    setSelectedPlate(formatted);
    setIsCustomMode(false);
    setLastDecision(null);
    setIsArmOpen(false);
  };

  return (
    <div data-testid="alpr-gate-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <Camera size={16} color="var(--fbsu-gold)" />
          <span>
            {isAr ? 'محاكي بوابات الجامعة والذكاء الاصطناعي' : 'Gate & ALPR Computer Vision'}
          </span>
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
              <span
                style={{ width: '8px', height: '8px', background: '#ff3344', borderRadius: '50%' }}
              ></span>
              <span>LIVE: CAM-01 (MAIN_NORTH_GATE_FBSU)</span>
            </div>
            <div
              style={{
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-en)',
                fontSize: '0.75rem',
              }}
            >
              60 FPS | 4K HDR | MODEL: FBSU-ALPR-v4.2
            </div>
          </div>

          <div className="camera-viewport">
            <div
              className={`cam-target-bracket ${
                lastDecision?.decision === 'GRANTED' ? 'locked' : ''
              }`}
            >
              {isScanning && <div className="scan-laser-line"></div>}
              <div
                style={{
                  position: 'absolute',
                  top: '-22px',
                  right: 0,
                  fontSize: '0.7rem',
                  color:
                    lastDecision?.decision === 'GRANTED'
                      ? 'var(--status-available)'
                      : 'var(--fbsu-gold)',
                  fontFamily: 'var(--font-en)',
                  fontWeight: 800,
                }}
              >
                AI CONFIDENCE:{' '}
                {isScanning
                  ? 'ANALYZING...'
                  : lastDecision?.decision === 'GRANTED'
                    ? '99.8%'
                    : lastDecision?.decision === 'DENIED'
                      ? '98.5% (DENIED)'
                      : 'READY'}
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
              data-testid="gate-status-text"
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
          style={{
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
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
              <label className="form-label" style={{ marginBottom: '0.65rem' }}>
                {isAr
                  ? 'اختر لوحة اختبار لإرسالها إلى نظام البوابة (القرار يصدر من الخادم):'
                  : 'Choose a test plate to send to the gate service (the server makes the decision):'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem' }}>
                {/* Preset 1: Faculty */}
                <button
                  className={`pattern-option ${selectedPlate === 'س ع د 7700' && !isCustomMode ? 'selected' : ''}`}
                  onClick={() => selectPreset('س ع د 7700')}
                  type="button"
                  style={{ textAlign: 'start' }}
                  data-testid="preset-faculty-btn"
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h5 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                      {isAr ? 'لوحة اختبار: عضو هيئة تدريس' : 'Test plate: faculty vehicle'}
                    </h5>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        background: 'var(--fbsu-gold-light)',
                        color: 'var(--gold-text)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                      }}
                    >
                      {isAr ? 'تصريح هيئة التدريس' : 'Faculty Permit'}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.2rem',
                      display: 'block',
                    }}
                  >
                    {isAr ? 'لوحة:' : 'Plate:'} <strong>س ع د 7700</strong> —{' '}
                    {isAr ? 'النتيجة تُحدد من قاعدة البيانات' : 'Result decided by the database'}
                  </span>
                </button>

                {/* Preset 2: Student */}
                <button
                  className={`pattern-option ${selectedPlate === 'أ ب ح 1234' && !isCustomMode ? 'selected' : ''}`}
                  onClick={() => selectPreset('أ ب ح 1234')}
                  type="button"
                  style={{ textAlign: 'start' }}
                  data-testid="preset-student-btn"
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h5 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                      {isAr ? 'لوحة اختبار: طالب' : 'Test plate: student vehicle'}
                    </h5>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        background: 'rgba(56, 194, 176, 0.1)',
                        color: 'var(--status-available)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                      }}
                    >
                      {isAr ? 'طالب مسجل' : 'Student'}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.2rem',
                      display: 'block',
                    }}
                  >
                    {isAr ? 'لوحة:' : 'Plate:'} <strong>أ ب ح 1234</strong> —{' '}
                    {isAr ? 'يفحص الحجز الفعال في المنظومة' : 'Checks Active Booking in System'}
                  </span>
                </button>

                {/* Preset 3: Unregistered */}
                <button
                  className={`pattern-option ${selectedPlate === 'ق و ل 9999' && !isCustomMode ? 'selected' : ''}`}
                  onClick={() => selectPreset('ق و ل 9999')}
                  type="button"
                  style={{ textAlign: 'start' }}
                  data-testid="preset-unregistered-btn"
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h5 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                      {isAr ? 'مركبة غير مسجلة (غير مصرحة)' : 'Unregistered Vehicle'}
                    </h5>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--status-occupied)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                      }}
                    >
                      {isAr ? 'مرفوض آلياً' : 'Auto Deny'}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.2rem',
                      display: 'block',
                    }}
                  >
                    {isAr ? 'لوحة:' : 'Plate:'} <strong>ق و ل 9999</strong> —{' '}
                    {isAr
                      ? 'يتم منع فتح الحاجز آلياً وتسجيل محاولة الدخول'
                      : 'Barrier stays closed & logs access'}
                  </span>
                </button>

                {/* Custom Plate Button / Expander */}
                <button
                  className={`pattern-option ${isCustomMode ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    setIsCustomMode(prev => !prev);
                  }}
                  type="button"
                  style={{ textAlign: 'start' }}
                  data-testid="toggle-custom-plate-btn"
                >
                  <h5
                    style={{
                      margin: 0,
                      fontSize: '0.92rem',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Sparkles size={14} color="var(--fbsu-gold)" />
                    <span>{isAr ? 'تجربة لوحة مخصصة أخرى' : 'Test Custom License Plate'}</span>
                  </h5>
                </button>

                {isCustomMode && (
                  <div
                    style={{
                      background: 'var(--surface-soft)',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {isAr ? 'الحروف (عربي)' : 'Letters (Ar)'}
                        </label>
                        <input
                          type="text"
                          placeholder={isAr ? 'مثال: أ ح م' : 'e.g. س ع د'}
                          value={customLetters}
                          onChange={e => setCustomLetters(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-strong)',
                            padding: '0.4rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                          }}
                          data-testid="custom-plate-letters"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {isAr ? 'الأرقام' : 'Digits'}
                        </label>
                        <input
                          type="text"
                          placeholder={isAr ? 'مثال: 5501' : 'e.g. 7700'}
                          value={customDigits}
                          onChange={e => setCustomDigits(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-strong)',
                            padding: '0.4rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                          }}
                          data-testid="custom-plate-digits"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-gold"
                      onClick={handleApplyCustomPlate}
                      style={{ padding: '0.45rem', fontSize: '0.82rem', justifyContent: 'center' }}
                      data-testid="apply-custom-plate-btn"
                    >
                      {isAr ? 'تطبيق على الكاميرا' : 'Apply to Camera'}
                    </button>
                  </div>
                )}
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
                <Camera size={18} color="#ffffff" className={isScanning ? 'spin' : ''} />
                <span>
                  {isScanning
                    ? isAr
                      ? 'جارٍ الفحص والمعالجة بالذكاء الاصطناعي...'
                      : 'Scanning with AI & PostgreSQL...'
                    : isAr
                      ? 'مسح اللوحة والتحقق بالذكاء الاصطناعي'
                      : 'Scan & Validate Plate'}
                </span>
              </button>
            </div>
          </div>

          {/* Real AI Decision Result Box */}
          <div
            style={{
              background: 'var(--surface-soft)',
              border: `1px solid ${
                lastDecision?.decision === 'GRANTED'
                  ? 'var(--status-available-border)'
                  : lastDecision?.decision === 'DENIED'
                    ? 'rgba(239, 68, 68, 0.4)'
                    : 'var(--border-subtle)'
              }`,
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginTop: '1rem',
            }}
            data-testid="scan-decision-result"
          >
            {lastDecision?.decision === 'GRANTED' ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2
                  size={26}
                  color="var(--status-available)"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <div>
                  <h5
                    style={{
                      color: 'var(--status-available)',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                    }}
                  >
                    {isAr
                      ? 'تم التحقق بنجاح - مرحباً بك في جامعة فهد بن سلطان'
                      : 'Access Granted - Welcome to FBSU'}
                  </h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {isAr ? lastDecision.displayMessageAr : lastDecision.displayMessageEn}
                  </p>
                  {lastDecision.driverNameAr && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.35rem',
                      }}
                    >
                      {isAr ? 'السائق:' : 'Driver:'}{' '}
                      <strong style={{ color: 'var(--text-main)' }}>
                        {isAr ? lastDecision.driverNameAr : lastDecision.driverNameEn}
                      </strong>
                      {lastDecision.bayNumber && (
                        <span>
                          {' '}
                          | {isAr ? 'الموقف:' : 'Bay:'}{' '}
                          <strong style={{ color: 'var(--gold-text)' }}>
                            #{lastDecision.bayNumber}
                          </strong>{' '}
                          ({isAr ? lastDecision.zoneNameAr : lastDecision.zoneNameEn})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : lastDecision?.decision === 'DENIED' ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <XCircle size={26} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.95rem' }}>
                    {isAr ? 'تم رفض الدخول - الحاجز مغلق' : 'Access Denied - Barrier Kept Closed'}
                  </h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {isAr ? lastDecision.displayMessageAr : lastDecision.displayMessageEn}
                  </p>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.35rem',
                      display: 'block',
                    }}
                  >
                    {isAr ? 'رمز الحالة:' : 'Code:'}{' '}
                    <code style={{ color: 'var(--gold-text)' }}>{lastDecision.reasonCode}</code>
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={26} color="var(--text-dim)" />
                <div>
                  <h5 style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem' }}>
                    {isAr ? 'بانتظار اقتراب السيارة من البوابة' : 'Waiting for vehicle approach'}
                  </h5>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {isAr
                      ? 'اضغط زر المسح أعلاه لتشغيل قارئ الكاميرا وفحص اللوحة في قاعدة البيانات.'
                      : 'Click scan above to test ALPR recognition against real database.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Log / Gate History Section */}
      {scanHistory.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
          >
            <Shield size={16} color="var(--fbsu-gold)" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {isAr
                ? 'سجل عمليات تدقيق البوابة الحي (Gate Access Audit Log)'
                : 'Live Gate Access Audit Log'}
            </h4>
          </div>

          <div
            className="table-responsive glass-panel"
            style={{ padding: '0.75rem', overflowX: 'auto' }}
          >
            <table className="ledger-table" style={{ width: '100%', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} />
                      <span>{isAr ? 'الوقت' : 'Time'}</span>
                    </div>
                  </th>
                  <th style={{ textAlign: 'start' }}>
                    {isAr ? 'اللوحة المفحوصة' : 'Scanned Plate'}
                  </th>
                  <th style={{ textAlign: 'start' }}>
                    {isAr ? 'السائق / العضو' : 'Driver / Member'}
                  </th>
                  <th style={{ textAlign: 'start' }}>{isAr ? 'الموقف' : 'Spot'}</th>
                  <th style={{ textAlign: 'start' }}>{isAr ? 'القرار' : 'Decision'}</th>
                  <th style={{ textAlign: 'start' }}>{isAr ? 'تفاصيل القرار' : 'Reason / Note'}</th>
                </tr>
              </thead>
              <tbody>
                {scanHistory.map(entry => (
                  <tr key={entry.id}>
                    <td style={{ fontFamily: 'var(--font-en)', color: 'var(--text-muted)' }}>
                      {entry.timestamp}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>{entry.plate}</td>
                    <td>{entry.driverName}</td>
                    <td>
                      <span style={{ color: 'var(--gold-text)', fontWeight: 700 }}>
                        {entry.bayInfo}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background:
                            entry.decision === 'GRANTED'
                              ? 'rgba(56, 194, 176, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                          color:
                            entry.decision === 'GRANTED'
                              ? 'var(--status-available)'
                              : 'var(--status-occupied)',
                        }}
                      >
                        {entry.decision === 'GRANTED'
                          ? isAr
                            ? 'مصرّح (فتح الحاجز)'
                            : 'GRANTED (OPEN)'
                          : isAr
                            ? 'مرفوض (إغلاق)'
                            : 'DENIED (CLOSED)'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {entry.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
