import type { StudyRoom } from '../data/campusData';

/**
 * Derives display groupings for study rooms & labs from the data the rooms API
 * already returns (roomCode, typeBadge, building). Nothing here is hardcoded to
 * specific room codes, so new rooms added in the backend are categorised
 * automatically.
 */

export type RoomKind = 'lab' | 'room' | 'pod';

export const ROOM_KINDS: RoomKind[] = ['lab', 'room', 'pod'];

export const ROOM_KIND_LABELS: Record<RoomKind, { ar: string; en: string }> = {
  lab: { ar: 'المعامل المتخصصة', en: 'Labs' },
  room: { ar: 'قاعات المذاكرة والنقاش', en: 'Study & Seminar Rooms' },
  pod: { ar: 'كبائن فردية', en: 'Solo Pods' },
};

export function getRoomKind(room: StudyRoom): RoomKind {
  const code = (room.roomCode || room.id || '').toUpperCase();
  if (code.startsWith('LAB')) return 'lab';
  if (code.startsWith('POD')) return 'pod';
  if (code.startsWith('ROOM')) return 'room';

  const type = `${room.typeBadgeEn ?? ''} ${room.typeBadge ?? ''}`.toLowerCase();
  if (/\blab\b|workshop|معمل|ورشة/.test(type)) return 'lab';
  if (/\bpod\b|booth|كابينة/.test(type)) return 'pod';
  return 'room';
}

/** "College of Computing - Ground Floor" -> "College of Computing" */
function primaryPart(value: string | undefined): string {
  return (value ?? '').split(/\s+[-–]\s+/)[0]?.trim() ?? '';
}

export interface RoomLocation {
  key: string;
  ar: string;
  en: string;
}

export function getRoomLocation(room: StudyRoom): RoomLocation {
  const en = primaryPart(room.buildingEn) || primaryPart(room.building);
  const ar = primaryPart(room.building) || en;
  return { key: (en || ar).toLowerCase(), ar, en: en || ar };
}

/** Unique locations, in first-seen order, with how many rooms each holds. */
export function collectLocations(rooms: StudyRoom[]): (RoomLocation & { count: number })[] {
  const map = new Map<string, RoomLocation & { count: number }>();
  rooms.forEach(room => {
    const loc = getRoomLocation(room);
    if (!loc.key) return;
    const existing = map.get(loc.key);
    if (existing) existing.count += 1;
    else map.set(loc.key, { ...loc, count: 1 });
  });
  return Array.from(map.values());
}

export function matchesRoomQuery(room: StudyRoom, rawQuery: string): boolean {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return true;
  const haystack = [
    room.name,
    room.nameEn,
    room.roomCode,
    room.id,
    room.building,
    room.buildingEn,
    room.typeBadge,
    room.typeBadgeEn,
    ...(room.specs ?? []),
    ...(room.specsEn ?? []),
  ];
  return haystack.some(v => typeof v === 'string' && v.toLowerCase().includes(q));
}
