import { describe, it, expect } from 'vitest';
import { getCarVisualTheme, CAR_PALETTES } from './carTheme';
import type { ParkingSpot } from '../data/parkingData';

describe('carTheme utility', () => {
  it('maps spot 1 (Eyad Camry) to emerald green signature color', () => {
    const spot: ParkingSpot = {
      id: 1,
      zone: 'A',
      college: 'الحاسب والهندسة',
      collegeEn: 'Computing & Engineering',
      status: 'occupied',
      occupant: 'إياد الحربي',
      car: 'تويوتا كامري',
      plate: 'ب ط ك 1234',
      timeLeft: '15 د',
      distance: '30 م',
    };

    const theme = getCarVisualTheme(spot);
    expect(theme.color).toBe(CAR_PALETTES.emerald.base); // #10695e
    expect(theme.type).toBe('sedan');
  });

  it('maps Dr. Samir (Mercedes E300) to emerald green', () => {
    const spot: ParkingSpot = {
      id: 20,
      zone: 'C',
      college: 'كادر التدريس',
      collegeEn: 'Faculty Members',
      status: 'faculty-spot',
      occupant: 'د. سمير كمال',
      car: 'مرسيدس E300',
      plate: 'س م ر 2020',
      timeLeft: null,
      distance: '20 م',
      isFaculty: true,
    };

    const theme = getCarVisualTheme(spot);
    expect(theme.color).toBe(CAR_PALETTES.emerald.base);
  });

  it('maps Dr. Reem (BMW X5) to white SUV', () => {
    const spot: ParkingSpot = {
      id: 22,
      zone: 'C',
      college: 'كادر التدريس',
      collegeEn: 'Faculty Members',
      status: 'faculty-spot',
      occupant: 'د. ريم العمراني',
      car: 'بي إم دبليو X5',
      plate: 'ر ي م 7070',
      timeLeft: null,
      distance: '20 م',
      isFaculty: true,
    };

    const theme = getCarVisualTheme(spot);
    expect(theme.color).toBe(CAR_PALETTES.white.base);
    expect(theme.type).toBe('suv');
  });

  it('detects explicit color keywords in vehicle name or occupant', () => {
    const redSpot: ParkingSpot = {
      id: 55,
      zone: 'A',
      college: 'الحاسب',
      collegeEn: 'Computing',
      status: 'occupied',
      occupant: 'طالب',
      car: 'هوندا أكورد أحمر عنابي',
      plate: 'أ ب ج 9999',
      timeLeft: null,
      distance: '20 م',
    };

    const theme = getCarVisualTheme(redSpot);
    expect(theme.color).toBe(CAR_PALETTES.crimson.base);
  });

  it('maps EV spots to electric cyan', () => {
    const evSpot: ParkingSpot = {
      id: 26,
      zone: 'D',
      college: 'شحن EV',
      collegeEn: 'EV Charging',
      status: 'occupied',
      occupant: 'طالب',
      car: 'Lucid Air Pure',
      plate: 'ل و س 2024',
      timeLeft: null,
      distance: '50 م',
      isEV: true,
    };

    const theme = getCarVisualTheme(evSpot);
    expect(theme.color).toBe(CAR_PALETTES.cyan.base);
    expect(theme.type).toBe('ev');
  });

  it('maps flex-share spots to Saudi gold amber', () => {
    const flexSpot: ParkingSpot = {
      id: 8,
      zone: 'A',
      college: 'الحاسب',
      collegeEn: 'Computing',
      status: 'flex-share',
      occupant: 'محمد الحويطي',
      car: 'نيسان التيما',
      plate: 'ر ح ل 7711',
      timeLeft: null,
      distance: '50 م',
    };

    const theme = getCarVisualTheme(flexSpot);
    expect(theme.color).toBe(CAR_PALETTES.amber.base);
  });
});

