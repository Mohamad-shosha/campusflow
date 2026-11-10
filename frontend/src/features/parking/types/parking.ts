export type BackendSpotStatus =
  'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'FLEX_SHARE' | 'FACULTY_ASSIGNED' | 'MAINTENANCE';

export type BackendSpotType =
  'STANDARD' | 'FACULTY' | 'ACCESSIBLE' | 'EV_CHARGING' | 'VIP' | 'SERVICE';

export interface ParkingSpotResponse {
  id: string; // UUID
  bayNumber: number;
  zoneCode: string;
  zoneNameAr: string;
  zoneNameEn: string;
  spotType: BackendSpotType;
  status: BackendSpotStatus;
  distanceMeters: number;
  flexEligible: boolean;
  currentOccupantId?: string | null;
  occupantNameAr?: string | null;
  occupantNameEn?: string | null;
  vehicleModel?: string | null;
  plateLettersAr?: string | null;
  plateDigits?: string | null;
  timeLeftText?: string | null;
  sessionEndsAt?: string | null;
}

export interface ParkingZoneResponse {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  collegeId?: string | null;
  totalSpots: number;
  availableSpots: number;
  occupiedSpots: number;
  flexSpots: number;
}

export interface ParkingSummaryResponse {
  totalSpots: number;
  availableSpots: number;
  occupiedSpots: number;
  flexSpots: number;
  reservedSpots: number;
  facultySpots: number;
  occupancyRatePercent: number;
}

export interface ParkingTariffResponse {
  id: string;
  userType: 'STUDENT' | 'FACULTY' | 'STAFF' | 'GUEST';
  hourlyRateSar: number;
  dailyCapSar: number;
  flexCashbackSar: number;
}

export interface CreateBookingRequest {
  spotId: string;
  vehicleId?: string;
  durationHours?: number;
  autoDebitWallet?: boolean;
  idempotencyKey: string;
  startTime: string; // ISO-8601
  endTime?: string; // ISO-8601
}

export interface BookingResponse {
  id: string;
  spotId: string;
  bayNumber: number;
  zoneCode: string;
  zoneNameAr: string;
  zoneNameEn: string;
  vehiclePlate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  ratePerHour: number;
  totalAmount: number;
  currency: string;
  status: 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  digitalPassCode: string;
  qrToken: string;
  createdAt: string;
}

export interface DigitalPassResponse {
  bookingId: string;
  passCode: string;
  driverNameAr: string;
  driverNameEn: string;
  universityNumber: string;
  vehiclePlate: string;
  bayNumber: number;
  bayCode: string;
  zoneNameAr: string;
  zoneNameEn: string;
  startTime: string;
  endTime: string;
  qrToken: string;
  status: string;
}

export interface FlexOfferResponse {
  id: string;
  spotId: string;
  bayNumber: number;
  bayCode: string;
  zoneCode?: string;
  zoneNameAr?: string;
  zoneNameEn?: string;
  offererId?: string;
  offererNameAr: string;
  offererNameEn: string;
  claimerId?: string | null;
  claimerNameAr?: string | null;
  claimerNameEn?: string | null;
  startTime: string;
  endTime: string;
  rewardAmount?: number;
  rewardAmountSar?: number;
  currency?: string;
  status: 'AVAILABLE' | 'OFFERED' | 'CLAIMED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  rewardPaid?: boolean;
  createdAt?: string;
}

export interface CreateFlexOfferRequest {
  spotId: string;
  durationMinutes: number;
  startTime?: string;
}

export interface GateScanRequest {
  gateId?: string;
  plateLettersAr: string;
  plateDigits: string;
}

export interface GateDecisionResponse {
  decision: 'GRANTED' | 'DENIED';
  gateAction: 'OPEN_BARRIER' | 'KEEP_CLOSED';
  reasonCode: string;
  displayMessageAr: string;
  displayMessageEn: string;
  bayNumber?: number | null;
  bayCode?: string | null;
  zoneCode?: string | null;
  zoneNameAr?: string | null;
  zoneNameEn?: string | null;
  driverNameAr?: string | null;
  driverNameEn?: string | null;
  userType?: string | null;
  scannedPlate: string;
}

export interface GateEventResponse {
  id: string;
  gateId: string;
  plateLettersAr: string;
  plateDigits: string;
  decision: 'GRANTED' | 'DENIED';
  reason: string;
  bayNumber?: number | null;
  bayCode?: string | null;
  occurredAt: string;
}

export interface GateEventPageResponse {
  content: GateEventResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Maps a backend ParkingSpotResponse to the UI ParkingSpot structure
 */
export function mapBackendSpotToUi(backendSpot: ParkingSpotResponse) {
  let uiStatus:
    'available' | 'occupied' | 'flex' | 'flex-share' | 'reserved' | 'faculty' | 'faculty-spot' =
    'available';
  switch (backendSpot.status) {
    case 'AVAILABLE':
      uiStatus = 'available';
      break;
    case 'OCCUPIED':
      uiStatus = 'occupied';
      break;
    case 'RESERVED':
      uiStatus = 'reserved';
      break;
    case 'FLEX_SHARE':
      uiStatus = 'flex-share';
      break;
    case 'FACULTY_ASSIGNED':
      uiStatus = 'faculty-spot';
      break;
    case 'MAINTENANCE':
      uiStatus = 'occupied';
      break;
  }

  const isFaculty = backendSpot.spotType === 'FACULTY' || backendSpot.status === 'FACULTY_ASSIGNED';
  const isEV = backendSpot.spotType === 'EV_CHARGING';
  const isAccessible = backendSpot.spotType === 'ACCESSIBLE';

  let plateStr: string | null = null;
  if (backendSpot.plateLettersAr && backendSpot.plateDigits) {
    plateStr = `${backendSpot.plateLettersAr} ${backendSpot.plateDigits}`;
  }

  return {
    id: backendSpot.bayNumber,
    backendId: backendSpot.id,
    zone: backendSpot.zoneCode,
    college: backendSpot.zoneNameAr,
    collegeEn: backendSpot.zoneNameEn,
    status: uiStatus,
    occupant: backendSpot.occupantNameAr || null,
    car: backendSpot.vehicleModel || null,
    plate: plateStr,
    timeLeft: backendSpot.timeLeftText || null,
    distance: `${backendSpot.distanceMeters} م`,
    isFlexEligible: backendSpot.flexEligible,
    isFaculty,
    isEV,
    isAccessible,
  };
}
