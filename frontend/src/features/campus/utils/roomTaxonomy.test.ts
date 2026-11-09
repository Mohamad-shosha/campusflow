import { describe, it, expect } from 'vitest';
import type { StudyRoom } from '../data/campusData';
import { collectLocations, getRoomKind, getRoomLocation, matchesRoomQuery } from './roomTaxonomy';

const room = (overrides: Partial<StudyRoom>): StudyRoom => ({
  id: 'X',
  name: 'قاعة',
  nameEn: 'Room',
  building: 'المكتبة المركزية - الدور الأول',
  buildingEn: 'Central Library - 1st Floor',
  capacity: '4',
  typeBadge: 'قاعة',
  status: 'available',
  ...overrides,
});

describe('roomTaxonomy', () => {
  it('classifies by room code prefix, falling back to the type badge', () => {
    expect(getRoomKind(room({ roomCode: 'LAB-999' }))).toBe('lab');
    expect(getRoomKind(room({ roomCode: 'POD-Z9' }))).toBe('pod');
    expect(getRoomKind(room({ roomCode: 'ROOM-Q1' }))).toBe('room');
    expect(getRoomKind(room({ id: 'uuid-1', typeBadgeEn: 'Robotics Workshop' }))).toBe('lab');
    expect(getRoomKind(room({ id: 'uuid-2', typeBadgeEn: 'Seminar Hall' }))).toBe('room');
  });

  it('derives the location from the building name before the floor', () => {
    expect(getRoomLocation(room({})).en).toBe('Central Library');
    expect(getRoomLocation(room({})).ar).toBe('المكتبة المركزية');
  });

  it('collects unique locations with counts in first-seen order', () => {
    const locs = collectLocations([
      room({ id: 'a' }),
      room({
        id: 'b',
        buildingEn: 'College of Computing - Ground Floor',
        building: 'كلية الحاسب - الدور الأرضي',
      }),
      room({ id: 'c' }),
    ]);
    expect(locs.map(l => [l.en, l.count])).toEqual([
      ['Central Library', 2],
      ['College of Computing', 1],
    ]);
  });

  it('searches across name, code, building and equipment', () => {
    const r = room({ roomCode: 'LAB-101', specsEn: ['RTX 4090 GPUs'] });
    expect(matchesRoomQuery(r, 'lab-101')).toBe(true);
    expect(matchesRoomQuery(r, 'rtx')).toBe(true);
    expect(matchesRoomQuery(r, 'library')).toBe(true);
    expect(matchesRoomQuery(r, 'cisco')).toBe(false);
    expect(matchesRoomQuery(r, '  ')).toBe(true);
  });
});
