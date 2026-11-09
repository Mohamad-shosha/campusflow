export interface TransitStop {
  id: string;
  stopCode: string;
  nameAr: string;
  nameEn: string;
  locationDescAr: string;
  locationDescEn: string;
  stopOrder: number;
  etaMinutesFromStart: number;
  hasShelter: boolean;
  hasAc: boolean;
}

export interface TransitRoute {
  id: string;
  routeCode: string;
  nameAr: string;
  nameEn: string;
  colorHex: string;
  operatingHoursAr: string;
  operatingHoursEn: string;
  frequencyMinutes: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFF_PEAK';
  displayOrder: number;
  stops: TransitStop[];
}

export interface ShuttleBus {
  id: string;
  routeId?: string;
  routeCode?: string;
  routeNameAr?: string;
  routeNameEn?: string;
  routeColor?: string;
  busNumber: string;
  plateLettersAr: string;
  plateDigits: string;
  modelName: string;
  totalCapacity: number;
  occupiedSeats: number;
  availableSeats: number;
  isElectric: boolean;
  driverNameAr: string;
  driverNameEn: string;
  status: 'IN_TRANSIT' | 'BOARDING' | 'ARRIVING' | 'OUT_OF_SERVICE';
  currentStopId?: string;
  currentStopNameAr?: string;
  currentStopNameEn?: string;
  nextStopId?: string;
  nextStopNameAr?: string;
  nextStopNameEn?: string;
  nextStopEtaMins: number;
  batteryPercentage: number;
}

export interface TransitPass {
  id: string;
  passCode: string;
  qrToken: string;
  userName: string;
  userUniversityNumber: string;
  routeId: string;
  routeCode: string;
  routeNameAr: string;
  routeNameEn: string;
  routeColor: string;
  shuttleId?: string;
  busNumber?: string;
  pickupStopId: string;
  pickupStopNameAr: string;
  pickupStopNameEn: string;
  dropoffStopId: string;
  dropoffStopNameAr: string;
  dropoffStopNameEn: string;
  boardingWindow: string;
  fareAmount: number;
  status: 'ACTIVE' | 'BOARDED' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
}

export interface BookTransitPassRequest {
  routeId: string;
  shuttleId?: string;
  pickupStopId: string;
  dropoffStopId: string;
}

