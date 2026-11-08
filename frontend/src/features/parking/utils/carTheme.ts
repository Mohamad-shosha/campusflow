import type { ParkingSpot } from '../data/parkingData';

export interface CarVisualTheme {
  color: string;
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  type: 'sedan' | 'suv' | 'luxury' | 'ev';
  modelLabel: string;
  plateLabel: string;
}

const COLOR_PALETTES: Record<string, { base: string; start: string; mid: string; end: string }> = {
  teal: {
    base: '#0d9488',
    start: '#115e59',
    mid: '#14b8a6',
    end: '#042f2e',
  },
  crimson: {
    base: '#b91c1c',
    start: '#7f1d1d',
    mid: '#ef4444',
    end: '#450a0a',
  },
  navy: {
    base: '#1e3a8a',
    start: '#172554',
    mid: '#3b82f6',
    end: '#0f172a',
  },
  silver: {
    base: '#94a3b8',
    start: '#64748b',
    mid: '#cbd5e1',
    end: '#334155',
  },
  white: {
    base: '#f8fafc',
    start: '#e2e8f0',
    mid: '#ffffff',
    end: '#cbd5e1',
  },
  black: {
    base: '#18181b',
    start: '#09090b',
    mid: '#27272a',
    end: '#000000',
  },
  purple: {
    base: '#7c3aed',
    start: '#5b21b6',
    mid: '#a855f7',
    end: '#2e1065',
  },
  amber: {
    base: '#d97706',
    start: '#92400e',
    mid: '#f59e0b',
    end: '#451a03',
  },
  cyan: {
    base: '#06b6d4',
    start: '#0e7490',
    mid: '#22d3ee',
    end: '#164e63',
  },
};

export function getCarVisualTheme(spot: ParkingSpot): CarVisualTheme {
  const carName = (spot.car || '').toLowerCase();
  const occupant = (spot.occupant || '').toLowerCase();

  // 1. EV Charging Zone or Electric Vehicle
  if (
    spot.isEV ||
    spot.zone === 'D' ||
    carName.includes('تسلا') ||
    carName.includes('tesla') ||
    carName.includes('ev')
  ) {
    const palette = COLOR_PALETTES['cyan']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'ev',
      modelLabel: spot.car || 'Tesla Model 3',
      plateLabel: spot.plate || 'ق هـ ر 2030',
    };
  }

  // 2. Faculty & Staff Dedicated Spots
  if (spot.isFaculty || spot.status === 'faculty' || spot.status === 'faculty-spot') {
    const palette = spot.id % 2 === 0 ? COLOR_PALETTES['purple']! : COLOR_PALETTES['navy']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'luxury',
      modelLabel: spot.car || 'Mercedes-Benz E300',
      plateLabel: spot.plate || 'د ك ت 1001',
    };
  }

  // 3. SUVs & 4x4s
  if (
    carName.includes('لاند كروزر') ||
    carName.includes('land cruiser') ||
    carName.includes('باترول') ||
    carName.includes('patrol') ||
    carName.includes('جيب') ||
    carName.includes('suv') ||
    carName.includes('x5') ||
    carName.includes('rx')
  ) {
    const palette = spot.id % 2 === 0 ? COLOR_PALETTES['white']! : COLOR_PALETTES['black']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'suv',
      modelLabel: spot.car || 'Toyota Land Cruiser',
      plateLabel: spot.plate || 'ص ح ر 9999',
    };
  }

  // 4. Luxury Sedans
  if (
    carName.includes('لكزس') ||
    carName.includes('lexus') ||
    carName.includes('مرسيدس') ||
    carName.includes('mercedes') ||
    carName.includes('bmw') ||
    carName.includes('أودي') ||
    carName.includes('audi') ||
    carName.includes('جينيسيس') ||
    carName.includes('genesis')
  ) {
    const palette =
      spot.id % 3 === 0
        ? COLOR_PALETTES['black']!
        : spot.id % 3 === 1
          ? COLOR_PALETTES['white']!
          : COLOR_PALETTES['navy']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'luxury',
      modelLabel: spot.car || 'Lexus ES 350',
      plateLabel: spot.plate || 'ن م ر 3301',
    };
  }

  // 5. Flex-Share Spots
  if (spot.status === 'flex' || spot.status === 'flex-share') {
    const palette = COLOR_PALETTES['amber']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'sedan',
      modelLabel: spot.car || 'Nissan Altima',
      plateLabel: spot.plate || 'ر ح ل 7711',
    };
  }

  // 6. Dynamic Sedans based on spot id for rich visual variety across the lot
  const sedanPalettes = [
    COLOR_PALETTES['teal']!,
    COLOR_PALETTES['crimson']!,
    COLOR_PALETTES['navy']!,
    COLOR_PALETTES['silver']!,
    COLOR_PALETTES['black']!,
  ];
  const chosenPalette = sedanPalettes[spot.id % sedanPalettes.length]!;

  return {
    color: chosenPalette.base,
    gradientStart: chosenPalette.start,
    gradientMid: chosenPalette.mid,
    gradientEnd: chosenPalette.end,
    type: 'sedan',
    modelLabel: spot.car || (occupant ? 'Toyota Camry' : 'Standard Vehicle'),
    plateLabel: spot.plate || 'ب ط ك 1234',
  };
}
