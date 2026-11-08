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
    carName.includes('لوسيد') ||
    carName.includes('lucid') ||
    carName.includes('ev')
  ) {
    const palette = COLOR_PALETTES['cyan']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'ev',
      modelLabel:
        spot.car ||
        (occupant.includes('لوسيد') || spot.id === 26 ? 'Lucid Air Pure' : 'Tesla Model 3'),
      plateLabel: spot.plate || 'ق هـ ر 2030',
    };
  }

  // 2. Faculty & Staff Dedicated Spots
  if (spot.isFaculty || spot.status === 'faculty' || spot.status === 'faculty-spot') {
    if (carName.includes('bmw') || carName.includes('x5') || spot.id === 22) {
      const palette = COLOR_PALETTES['white']!;
      return {
        color: palette.base,
        gradientStart: palette.start,
        gradientMid: palette.mid,
        gradientEnd: palette.end,
        type: 'suv',
        modelLabel: spot.car || 'BMW X5 xDrive40i',
        plateLabel: spot.plate || 'ر ي م 7070',
      };
    }
    if (carName.includes('audi') || spot.id === 24) {
      const palette = COLOR_PALETTES['black']!;
      return {
        color: palette.base,
        gradientStart: palette.start,
        gradientMid: palette.mid,
        gradientEnd: palette.end,
        type: 'luxury',
        modelLabel: spot.car || 'Audi A6 S-Line',
        plateLabel: spot.plate || 'ط ر ق 1111',
      };
    }
    if (carName.includes('جينيسيس') || spot.id === 19) {
      const palette = COLOR_PALETTES['navy']!;
      return {
        color: palette.base,
        gradientStart: palette.start,
        gradientMid: palette.mid,
        gradientEnd: palette.end,
        type: 'luxury',
        modelLabel: spot.car || 'Genesis G80 Royal',
        plateLabel: spot.plate || 'أ ح م 5501',
      };
    }
    const palette = spot.id % 2 === 0 ? COLOR_PALETTES['purple']! : COLOR_PALETTES['black']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'luxury',
      modelLabel: spot.car || 'Mercedes-Benz E300',
      plateLabel: spot.plate || 'د ك ت 2020',
    };
  }

  // 3. SUVs & 4x4s
  if (
    carName.includes('لاند كروزر') ||
    carName.includes('land cruiser') ||
    carName.includes('باترول') ||
    carName.includes('patrol') ||
    carName.includes('جيب') ||
    carName.includes('برادو') ||
    carName.includes('prado') ||
    carName.includes('suv') ||
    carName.includes('x5') ||
    spot.id === 29
  ) {
    const palette = spot.id % 2 === 0 ? COLOR_PALETTES['white']! : COLOR_PALETTES['silver']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'suv',
      modelLabel: spot.car || (spot.id === 29 ? 'Toyota Prado TXL' : 'Toyota Land Cruiser'),
      plateLabel: spot.plate || 'ص ح ر 9999',
    };
  }

  // 4. Luxury Sedans (Lexus, Mercedes, Genesis, BMW, Audi, Crown)
  if (
    carName.includes('لكزس') ||
    carName.includes('lexus') ||
    carName.includes('مرسيدس') ||
    carName.includes('mercedes') ||
    carName.includes('bmw') ||
    carName.includes('أودي') ||
    carName.includes('audi') ||
    carName.includes('جينيسيس') ||
    carName.includes('genesis') ||
    spot.id === 6 ||
    occupant.includes('شوشه') ||
    occupant.includes('shousha')
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
      plateLabel: spot.plate || 'ط ب ك 2030',
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
      modelLabel: spot.car || (spot.id === 8 ? 'Nissan Altima' : 'Toyota Avalon'),
      plateLabel: spot.plate || 'ر ح ل 7711',
    };
  }

  // 6. Specific Spots & Dynamic Sedan Models
  if (spot.id === 1 || occupant.includes('إياد') || occupant.includes('eyad')) {
    const palette = COLOR_PALETTES['navy']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'sedan',
      modelLabel: spot.car || 'Toyota Camry 2024',
      plateLabel: spot.plate || 'ب ط ك 1234',
    };
  }

  if (spot.id === 4 || occupant.includes('سعود') || occupant.includes('shehri')) {
    const palette = COLOR_PALETTES['crimson']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'sedan',
      modelLabel: spot.car || 'Chevrolet Caprice SS',
      plateLabel: spot.plate || 'ع س ر 4040',
    };
  }

  if (spot.id === 10 || occupant.includes('عمر') || occupant.includes('balawi')) {
    const palette = COLOR_PALETTES['black']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'sedan',
      modelLabel: spot.car || 'Ford Taurus Titanium',
      plateLabel: spot.plate || 'د ر ع 9090',
    };
  }

  if (spot.id === 12 || occupant.includes('خالد') || occupant.includes('anazi')) {
    const palette = COLOR_PALETTES['silver']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'sedan',
      modelLabel: spot.car || 'Honda Accord Sport',
      plateLabel: spot.plate || 'ن ج م 3321',
    };
  }

  if (spot.id === 16 || occupant.includes('ماجد') || occupant.includes('rashidi')) {
    const palette = COLOR_PALETTES['crimson']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'sedan',
      modelLabel: spot.car || 'Kia K5 GT-Line',
      plateLabel: spot.plate || 'س هـ م 1400',
    };
  }

  // 7. Dynamic Palette fallback based on spot id
  const sedanPalettes = [
    COLOR_PALETTES['teal']!,
    COLOR_PALETTES['crimson']!,
    COLOR_PALETTES['navy']!,
    COLOR_PALETTES['silver']!,
    COLOR_PALETTES['white']!,
    COLOR_PALETTES['black']!,
  ];
  const chosenPalette = sedanPalettes[spot.id % sedanPalettes.length]!;

  const defaultModels = [
    'Toyota Camry 2024',
    'Hyundai Sonata',
    'Nissan Altima',
    'Kia K5',
    'Honda Accord',
  ];
  const chosenModel = defaultModels[spot.id % defaultModels.length]!;

  return {
    color: chosenPalette.base,
    gradientStart: chosenPalette.start,
    gradientMid: chosenPalette.mid,
    gradientEnd: chosenPalette.end,
    type: 'sedan',
    modelLabel: spot.car || (occupant ? chosenModel : 'Toyota Camry'),
    plateLabel: spot.plate || 'ب ط ك 1234',
  };
}
