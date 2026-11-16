import { describe, it, expect } from 'vitest';
import { localizedSpotText } from './parkingData';
import { mapBackendSpotToUi } from '../types/parking';

describe('bay text in the UI language', () => {
  const backend = {
    id: 'b-1',
    bayNumber: 7,
    zoneCode: 'A',
    zoneNameAr: 'الحاسب',
    zoneNameEn: 'Computing',
    spotType: 'STANDARD',
    status: 'RESERVED',
    distanceMeters: 45,
    flexEligible: false,
    occupantNameAr: 'إياد الحربي',
    occupantNameEn: 'Eyad Al-Harbi',
    timeLeftText: 'محجوز (2 س)',
    timeLeftTextEn: 'Reserved (2h)',
  } as unknown as Parameters<typeof mapBackendSpotToUi>[0];

  it('shows Arabic occupant, status line and distance in Arabic', () => {
    const t = localizedSpotText(mapBackendSpotToUi(backend), true);
    expect(t).toEqual({ occupant: 'إياد الحربي', timeLeft: 'محجوز (2 س)', distance: '45 م' });
  });

  it('shows English occupant, status line and distance in English', () => {
    const t = localizedSpotText(mapBackendSpotToUi(backend), false);
    expect(t).toEqual({ occupant: 'Eyad Al-Harbi', timeLeft: 'Reserved (2h)', distance: '45 m' });
  });

  it('falls back to Arabic when no English text is stored', () => {
    const t = localizedSpotText(
      mapBackendSpotToUi({ ...backend, occupantNameEn: null, timeLeftTextEn: null }),
      false
    );
    expect(t.occupant).toBe('إياد الحربي');
    expect(t.timeLeft).toBe('محجوز (2 س)');
  });
});
