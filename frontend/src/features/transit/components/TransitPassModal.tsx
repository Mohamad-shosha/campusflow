import { FC, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Bus, CheckCircle2, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { QR } from '../../../shared/components/QR';
import { soundFX } from '../../../shared/utils/sound';
import type { TransitPass } from '../types/transit';

export interface TransitPassModalProps {
  isOpen: boolean;
  pass: TransitPass | null;
  isAr: boolean;
  onClose: () => void;
}

export const TransitPassModal: FC<TransitPassModalProps> = ({ isOpen, pass, isAr, onClose }) => {
  useEffect(() => {
    if (isOpen && pass) {
      soundFX.playSuccess();
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // no-op
      }
    }
  }, [isOpen, pass]);

  if (!isOpen || !pass) return null;

  return (
    <div className="transit-scope">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transit-pass-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#071513] text-white shadow-2xl shadow-emerald-950/60"
          onClick={e => e.stopPropagation()}
        >
          {/* Top Header Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-4 bg-emerald-950/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Bus className="h-5 w-5" />
              </div>
              <div>
                <h3 id="transit-pass-title" className="text-base font-bold text-white">
                  {isAr ? 'بطاقة ركوب الحافلة الذكية' : 'Smart Boarding Pass'}
                </h3>
                <p className="text-xs text-emerald-400/80 font-mono">{pass.passCode}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Pass Content */}
          <div className="p-6 space-y-5">
            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-[#0a1f1b]/90 p-5 shadow-inner">
              <div className="rounded-xl bg-white p-3 shadow-md">
                <QR value={pass.qrToken || pass.passCode} size={140} />
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>{isAr ? 'رمز رقمي مشفر وصالح للصعود' : 'Encrypted Token Verified'}</span>
              </div>
              <span className="text-[11px] text-gray-400 font-mono mt-0.5">
                {pass.qrToken || pass.passCode}
              </span>
            </div>

            {/* Passenger & Route Info */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{isAr ? 'الراكب الجامعي:' : 'Passenger:'}</span>
                <span className="font-bold text-white">
                  {pass.userName} ({pass.userUniversityNumber})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{isAr ? 'مسار الحافلة:' : 'Route:'}</span>
                <span
                  className="inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-full text-[11px]"
                  style={{
                    backgroundColor: `${pass.routeColor}20`,
                    color: pass.routeColor,
                    borderColor: `${pass.routeColor}40`,
                    borderWidth: 1,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: pass.routeColor }}
                  />
                  {isAr ? pass.routeNameAr : pass.routeNameEn}
                </span>
              </div>

              {pass.busNumber && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {isAr ? 'رقم الحافلة المخصصة:' : 'Assigned Shuttle:'}
                  </span>
                  <span className="font-semibold text-amber-300 font-mono">{pass.busNumber}</span>
                </div>
              )}
            </div>

            {/* Journey Path */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex flex-col items-center">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <div className="my-1 h-6 w-0.5 bg-emerald-500/30" />
                  <ArrowRight className="h-4 w-4 text-amber-400 rotate-90" />
                </div>
                <div className="flex-1 space-y-2 text-xs">
                  <div>
                    <p className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider">
                      {isAr ? 'محطة الصعود والانطلاق' : 'Boarding Stop'}
                    </p>
                    <p className="font-semibold text-white">
                      {isAr ? pass.pickupStopNameAr : pass.pickupStopNameEn}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">
                      {isAr ? 'محطة النزول والوصول' : 'Drop-off Stop'}
                    </p>
                    <p className="font-semibold text-white">
                      {isAr ? pass.dropoffStopNameAr : pass.dropoffStopNameEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Validity Badge */}
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-300">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span>{isAr ? 'نافذة الصلاحية:' : 'Validity Window:'}</span>
              </div>
              <span className="font-medium text-white">{pass.boardingWindow}</span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-white/10 p-4 bg-emerald-950/30 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isAr ? 'إغلاق وحفظ التذكرة' : 'Done & Save Pass'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
