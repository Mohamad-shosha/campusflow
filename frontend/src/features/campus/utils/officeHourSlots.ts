import type { TimeSlot } from '../data/campusData';

/** Stable identity of a slot. Time labels repeat across days, so never select by label alone. */
export const slotKey = (slot: TimeSlot): string => slot.id ?? slot.time;

/** Slots that have not started yet (slots without a timestamp are kept, e.g. static demo data). */
export const upcomingSlots = (slots: TimeSlot[], now: Date = new Date()): TimeSlot[] =>
  slots.filter(s => !s.startTime || new Date(s.startTime).getTime() > now.getTime());

/** Short day label such as "Tue, 17 Nov" / "الثلاثاء 17 نوفمبر" (Gregorian, Latin digits). */
export const slotDayLabel = (slot: TimeSlot, isAr: boolean): string => {
  if (!slot.startTime) return '';
  const date = new Date(slot.startTime);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(isAr ? 'ar-u-ca-gregory-nu-latn' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Riyadh',
  }).format(date);
};
