import { useState, useEffect, FC } from 'react';
import {
  Zap,
  MapPin,
  Camera,
  RefreshCw,
  Clock,
  GraduationCap,
  User,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
} from 'lucide-react';
import { SIMULATOR_STAGES } from '../data/parkingData';
import { CarSvg } from './CarSvg';
import { soundFX } from '../../../shared/utils/sound';

export interface SimulatorViewProps {
  isAr: boolean;
}

export const SimulatorView: FC<SimulatorViewProps> = ({ isAr }) => {
  const [simStep, setSimStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const stage = SIMULATOR_STAGES[simStep];

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setSimStep(prev => {
          const next = (prev + 1) % SIMULATOR_STAGES.length;
          soundFX.playClick();
          return next;
        });
      }, 4000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying]);

  const handleNext = () => {
    soundFX.playClick();
    setSimStep(prev => (prev + 1) % SIMULATOR_STAGES.length);
  };

  const handlePrev = () => {
    if (simStep > 0) {
      soundFX.playClick();
      setSimStep(prev => prev - 1);
    }
  };

  const handleSelectStep = (idx: number) => {
    soundFX.playClick();
    setSimStep(idx);
  };

  const toggleAutoPlay = () => {
    soundFX.playClick();
    setIsAutoPlaying(prev => !prev);
  };

  return (
    <div data-testid="simulator-view">
      <div className="section-head">
        <span className="section-eyebrow">
          <Zap size={16} color="var(--fbsu-gold)" />
          <span>{isAr ? 'المحاكي التفاعلي الذكي' : 'Interactive AI Simulator'}</span>
        </span>
        <h3 className="section-title">
          {isAr
            ? 'المحاكاة الذكية للتبادل المرن بين الطلاب (نموذج إياد وراكان)'
            : 'Smart Student Flex Swapping Simulation'}
        </h3>
        <p className="section-subtitle">
          {isAr
            ? 'محاكاة هندسية دقيقة لكيفية القضاء على الشواغر المهدورة: عندما يغادر الطالب في بريك دراسي، يُعاد تخصيص الموقف تلقائياً لزميله المحتاج مع ضمان عدم حدوث أي تعارض!'
            : 'Zero-conflict automated parking slot reallocation when students depart during campus breaks.'}
        </p>
      </div>

      <div className="simulator-box">
        {/* 5-Step Timeline Navigation */}
        <div className="sim-timeline-bar">
          {SIMULATOR_STAGES.map((s, idx) => {
            const isCurrent = idx === simStep;
            const isCompleted = idx < simStep;
            return (
              <button
                key={s.step}
                className={`sim-step-btn ${isCurrent ? 'current' : isCompleted ? 'completed' : ''}`}
                onClick={() => handleSelectStep(idx)}
                type="button"
                data-testid={`sim-step-${idx}`}
              >
                <span className="sim-time-tag">{s.time}</span>
                <span className="sim-label">
                  {idx + 1}. {isAr ? s.title.split(':')[0] : `Step ${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Simulator Viewport */}
        <div className="sim-viewport-grid">
          {/* Visual Stage: Spot #01 Live State */}
          <div className="sim-visual-stage">
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <span className="badge badge-gold">
                  <MapPin size={13} color="var(--fbsu-gold)" />
                  <span>
                    {isAr
                      ? 'موقف رقم #01 - كلية الهندسة والحاسب'
                      : 'Bay #01 - Engineering & Computing'}
                  </span>
                </span>
                <span
                  className={`badge ${
                    stage.spot1Status === 'occupied' ? 'badge-occupied' : 'badge-flex'
                  }`}
                >
                  {stage.spot1Badge}
                </span>
              </div>

              {/* Spotlight Visual */}
              <div
                className={`sim-spot-spotlight ${
                  stage.spot1Status === 'occupied' ? 'occupied' : 'flex-active'
                }`}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Camera size={14} color="var(--fbsu-primary)" />
                  <span>
                    {isAr ? 'المستشعر الأرضي وكاميرا الرؤية الحاسوبية' : 'IoT Bay Sensor & Vision'}
                  </span>
                </div>

                {stage.carColor ? (
                  <>
                    <div style={{ width: '120px', height: '180px', margin: '0.85rem auto' }}>
                      <CarSvg color={stage.carColor} style={{ width: '100px', height: '160px' }} />
                    </div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        color: 'var(--text-main)',
                        marginTop: '0.35rem',
                      }}
                    >
                      {stage.spot1Occupant}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.25rem',
                      }}
                    >
                      <span>
                        {isAr ? 'اللوحة المسجلة: ' : 'Registered Plate: '}
                        <strong>{stage.spot1Plate}</strong>
                      </span>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      height: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <RefreshCw size={44} color="var(--fbsu-gold)" className="animate-spin-slow" />
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        color: 'var(--gold-text)',
                      }}
                    >
                      {isAr ? 'الموقف شاغر ومتاح للتبادل الذكي' : 'Vacant & Open for AI Flex Share'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {isAr
                        ? 'نافذة التبادل: من 10:00 ص إلى 01:30 م (3.5 ساعات)'
                        : 'Flex Window: 10:00 AM - 01:30 PM (3.5 hrs)'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics inside simulator */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              <div className="stat-chip" style={{ padding: '0.75rem' }}>
                <div>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: 'var(--status-available)',
                    }}
                  >
                    +100%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'استغلال السعة' : 'Capacity Boost'}
                  </div>
                </div>
              </div>
              <div className="stat-chip" style={{ padding: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-text)' }}>
                    {simStep === 4
                      ? isAr
                        ? '17.25 ر.س'
                        : '17.25 SAR'
                      : isAr
                        ? '0.00 ر.س'
                        : '0.00 SAR'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'أرباح إياد (محفظة)' : 'Eyad Cashback'}
                  </div>
                </div>
              </div>
              <div className="stat-chip" style={{ padding: '0.75rem' }}>
                <div>
                  <div
                    style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--fbsu-primary)' }}
                  >
                    {isAr ? '0 دقيقة' : '0 Mins'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'وقت بحث راكان' : 'Search Time for Rakan'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative & Participants Status Panel */}
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div className="sim-narrative-box">
              <div className="sim-narrative-title">
                <Clock size={18} color="var(--fbsu-gold)" />
                <span>
                  {stage.time} - {isAr ? stage.title : stage.titleEn}
                </span>
              </div>
              <p className="sim-narrative-text">{isAr ? stage.desc : stage.descEn}</p>
            </div>

            {/* Participants Status Cards */}
            <div className="sim-participants-row">
              <div
                className={`participant-card ${stage.step === 0 || stage.step === 4 ? 'active' : ''}`}
              >
                <div className="participant-avatar-icon">
                  <GraduationCap size={20} color="#ffffff" />
                </div>
                <div className="participant-info">
                  <h4>{isAr ? 'إياد الحربي (هندسة)' : 'Eyad Al-Harbi (Eng)'}</h4>
                  <p>
                    {isAr ? 'الحالة: ' : 'Status: '}
                    <strong>{stage.eyadStatus}</strong>
                  </p>
                  <p style={{ color: 'var(--gold-text)' }}>
                    {isAr ? 'موقفه الأساسي: #01' : 'Primary Spot: #01'}
                  </p>
                </div>
              </div>

              <div
                className={`participant-card ${stage.step === 2 || stage.step === 3 ? 'active' : ''}`}
              >
                <div className="participant-avatar-icon" style={{ background: '#0b6d87' }}>
                  <User size={20} color="#ffffff" />
                </div>
                <div className="participant-info">
                  <h4>{isAr ? 'راكان المطيري (حاسب)' : 'Rakan Al-Mutairi (Comp)'}</h4>
                  <p>
                    {isAr ? 'الحالة: ' : 'Status: '}
                    <strong>{stage.rakanStatus}</strong>
                  </p>
                  <p style={{ color: 'var(--fbsu-primary)' }}>
                    {isAr ? 'كلاسه: 10:15 ص' : 'Class: 10:15 AM'}
                  </p>
                </div>
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="sim-controls-footer">
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-outline"
                  onClick={handlePrev}
                  disabled={simStep === 0}
                  style={simStep === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  type="button"
                >
                  <ArrowRight size={16} />
                  <span>{isAr ? 'السابق' : 'Previous'}</span>
                </button>
                <button className="btn-gold" onClick={handleNext} type="button">
                  <span>{stage.actionText || (isAr ? 'الخطوة التالية' : 'Next Step')}</span>
                  <ArrowLeft size={16} color="#0b1a17" />
                </button>
              </div>

              <button className="btn-primary" onClick={toggleAutoPlay} type="button">
                {isAutoPlaying ? (
                  <Pause size={16} color="#ffffff" />
                ) : (
                  <Play size={16} color="#ffffff" />
                )}
                <span>
                  {isAutoPlaying
                    ? isAr
                      ? 'إيقاف مؤقت'
                      : 'Pause'
                    : isAr
                      ? 'تشغيل تلقائي'
                      : 'Auto Play'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
