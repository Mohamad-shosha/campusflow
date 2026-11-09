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

/**
 * Authentic automotive color palette:
 * - emerald: Matches user reference image (#10695e) — rich British Racing / Saudi Royal Green
 * - navy: Deep Sapphire Navy metallic (#1e3a8a)
 * - crimson: Ruby Crimson metallic (#b91c1c)
 * - silver: Titanium Slate Silver (#64748b)
 * - white: Alpine / Pearl White (#f1f5f9)
 * - black: Obsidian Midnight Black (#18181b)
 * - amber: Saudi Desert Amber / Gold (#d97706) — used for AI Flex-Share
 * - cyan: Electric Cyan / Aqua (#0284c7) — used for EVs (Lucid, Tesla, Taycan)
 * - charcoal: Off-Road Slate Charcoal (#334155) — used for Prado / Land Cruiser / Patrol SUVs
 */
export const CAR_PALETTES: Record<
  string,
  { base: string; start: string; mid: string; end: string }
> = {
  emerald: {
    base: '#10695e',
    start: '#0a423b',
    mid: '#147e71',
    end: '#062823',
  },
  navy: {
    base: '#1e3a8a',
    start: '#172554',
    mid: '#2563eb',
    end: '#0f172a',
  },
  crimson: {
    base: '#b91c1c',
    start: '#7f1d1d',
    mid: '#dc2626',
    end: '#450a0a',
  },
  silver: {
    base: '#64748b',
    start: '#334155',
    mid: '#94a3b8',
    end: '#1e293b',
  },
  white: {
    base: '#f1f5f9',
    start: '#cbd5e1',
    mid: '#ffffff',
    end: '#94a3b8',
  },
  black: {
    base: '#18181b',
    start: '#09090b',
    mid: '#27272a',
    end: '#000000',
  },
  amber: {
    base: '#d97706',
    start: '#92400e',
    mid: '#f59e0b',
    end: '#451a03',
  },
  cyan: {
    base: '#0284c7',
    start: '#0369a1',
    mid: '#38bdf8',
    end: '#0c4a6e',
  },
  charcoal: {
    base: '#334155',
    start: '#1e293b',
    mid: '#475569',
    end: '#0f172a',
  },
};

/**
 * Extracts or assigns authentic color and body type for any parking spot.
 */
export function getCarVisualTheme(spot: ParkingSpot): CarVisualTheme {
  const carText = `${spot.car || ''} ${(spot as any).carColor || ''} ${spot.occupant || ''}`.toLowerCase();
  const occupant = (spot.occupant || '').toLowerCase();

  // 1. Check explicit color keywords in description or carColor prop
  let explicitPaletteKey: string | null = null;
  if (carText.includes('أخضر') || carText.includes('زمرد') || carText.includes('green') || carText.includes('emerald')) {
    explicitPaletteKey = 'emerald';
  } else if (carText.includes('أحمر') || carText.includes('عنابي') || carText.includes('قرمزي') || carText.includes('red') || carText.includes('crimson')) {
    explicitPaletteKey = 'crimson';
  } else if (carText.includes('أزرق') || carText.includes('كحلي') || carText.includes('بحري') || carText.includes('blue') || carText.includes('navy')) {
    explicitPaletteKey = 'navy';
  } else if (carText.includes('فضي') || carText.includes('رصاصي') || carText.includes('رمادي') || carText.includes('silver') || carText.includes('gray')) {
    explicitPaletteKey = 'silver';
  } else if (carText.includes('أبيض') || carText.includes('لؤلؤي') || carText.includes('white') || carText.includes('pearl')) {
    explicitPaletteKey = 'white';
  } else if (carText.includes('أسود') || carText.includes('ملكي') || carText.includes('ليلي') || carText.includes('black')) {
    explicitPaletteKey = 'black';
  } else if (carText.includes('ذهبي') || carText.includes('كهرمان') || carText.includes('gold') || carText.includes('amber')) {
    explicitPaletteKey = 'amber';
  } else if (carText.includes('سماوي') || carText.includes('تركواز') || carText.includes('cyan') || carText.includes('aqua')) {
    explicitPaletteKey = 'cyan';
  }

  // 2. EV Charging Zone or Electric Vehicle
  if (
    spot.isEV ||
    spot.zone === 'D' ||
    carText.includes('تسلا') ||
    carText.includes('tesla') ||
    carText.includes('لوسيد') ||
    carText.includes('lucid') ||
    carText.includes('تايكان') ||
    carText.includes('taycan') ||
    carText.includes('ev')
  ) {
    const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['cyan']!;
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

  // 3. Faculty & Staff Dedicated Spots
  if (spot.isFaculty || spot.status === 'faculty' || spot.status === 'faculty-spot') {
    // Dr. Reem: BMW X5 (White SUV)
    if (carText.includes('bmw') || carText.includes('x5') || spot.id === 22) {
      const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['white']!;
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
    // Dr. Samir: Mercedes E300 (Emerald Green — Signature Reference Color)
    if (carText.includes('مرسيدس') || carText.includes('mercedes') || spot.id === 20) {
      const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['emerald']!;
      return {
        color: palette.base,
        gradientStart: palette.start,
        gradientMid: palette.mid,
        gradientEnd: palette.end,
        type: 'luxury',
        modelLabel: spot.car || 'Mercedes-Benz E300',
        plateLabel: spot.plate || 'س م ر 2020',
      };
    }
    // Dr. Tariq: Audi A6 (Black Luxury Sedan)
    if (carText.includes('audi') || spot.id === 24) {
      const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['black']!;
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
    // Dr. Abdullah: Genesis G80 (Navy Luxury Sedan)
    if (carText.includes('جينيسيس') || spot.id === 19) {
      const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['navy']!;
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

    const palette = explicitPaletteKey
      ? CAR_PALETTES[explicitPaletteKey]!
      : spot.id % 2 === 0
        ? CAR_PALETTES['emerald']!
        : CAR_PALETTES['black']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'luxury',
      modelLabel: spot.car || 'Lexus ES 350',
      plateLabel: spot.plate || 'د ك ت 2020',
    };
  }

  // 4. SUVs & 4x4s
  if (
    carText.includes('لاند كروزر') ||
    carText.includes('land cruiser') ||
    carText.includes('باترول') ||
    carText.includes('patrol') ||
    carText.includes('جيب') ||
    carText.includes('برادو') ||
    carText.includes('prado') ||
    carText.includes('suv') ||
    spot.id === 29
  ) {
    const palette = explicitPaletteKey
      ? CAR_PALETTES[explicitPaletteKey]!
      : spot.id === 29
        ? CAR_PALETTES['charcoal']!
        : CAR_PALETTES['white']!;
    return {
      color: palette.base,
      gradientStart: palette.start,
      gradientMid: palette.mid,
      gradientEnd: palette.end,
      type: 'suv',
      modelLabel: spot.car || (spot.id === 29 ? 'Toyota Prado TXL' : 'Toyota Land Cruiser'),
      plateLabel: spot.plate || 'أ م ل 1010',
    };
  }

  // 5. Flex-Share Spots (AI Swappable — Warm Amber Gold)
  if (spot.status === 'flex' || spot.status === 'flex-share') {
    const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['amber']!;
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

  // 6. Specific Campus Spots & Drivers
  // Spot 1: Eyad Alharbi (Toyota Camry) — Emerald Green Signature
  if (spot.id === 1 || occupant.includes('إياد') || occupant.includes('eyad')) {
    const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['emerald']!;
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

  // Spot 4: Saud Alshehri (Caprice SS) — Ruby Crimson
  if (spot.id === 4 || occupant.includes('سعود') || occupant.includes('shehri')) {
    const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['crimson']!;
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

  // Spot 6: Faisal Alatawi (Lexus ES) — Titanium Silver
  if (spot.id === 6 || occupant.includes('فيصل') || occupant.includes('atawi')) {
    const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['silver']!;
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

  // Spot 10: Omar Albalawi (Ford Taurus) — Obsidian Black
  if (spot.id === 10 || occupant.includes('عمر') || occupant.includes('balawi')) {
    const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['black']!;
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

  // Spot 12: Khaled Alenazi (Honda Accord) — Sapphire Navy
  if (spot.id === 12 || occupant.includes('خالد') || occupant.includes('anazi')) {
    const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['navy']!;
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

  // Spot 16: Majed Alrashidi (Kia K5) — Ruby Crimson
  if (spot.id === 16 || occupant.includes('ماجد') || occupant.includes('rashidi')) {
    const palette = explicitPaletteKey ? CAR_PALETTES[explicitPaletteKey]! : CAR_PALETTES['crimson']!;
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

  // 7. Dynamic Deterministic Palette Rotation for any other spot
  const rotatingPalettes = [
    CAR_PALETTES['emerald']!, // Signature Green
    CAR_PALETTES['navy']!,    // Sapphire Navy
    CAR_PALETTES['crimson']!, // Ruby Crimson
    CAR_PALETTES['silver']!,  // Titanium Silver
    CAR_PALETTES['white']!,   // Pearl White
    CAR_PALETTES['black']!,   // Obsidian Black
    CAR_PALETTES['charcoal']!,// Slate Charcoal
  ];
  const chosenPalette = explicitPaletteKey
    ? CAR_PALETTES[explicitPaletteKey]!
    : rotatingPalettes[spot.id % rotatingPalettes.length]!;

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
