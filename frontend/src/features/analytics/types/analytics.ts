export interface HourlyLoadPoint {
  time: string;
  load: number;
  color: string;
  labelAr: string;
  labelEn: string;
}

export interface ZoneOccupancyStat {
  zoneCode: string;
  zoneNameAr: string;
  zoneNameEn: string;
  totalSpots: number;
  occupiedSpots: number;
  occupancyRate: number;
}

export interface RoomsUtilizationStat {
  totalRooms: number;
  availableRooms: number;
  inUseRooms: number;
  reservedRooms: number;
  maintenanceRooms: number;
  activeUtilizationPercent: number;
  activeBookingsCount: number;
}

export interface RevenueBreakdownStat {
  netParkingRevenue: number;
  tuitionRevenue: number;
  tutoringVolume: number;
  totalCampusVolume: number;
}

export interface AnalyticsSummary {
  netCapacityGainPercent: number | null;
  timeSavedMinutes: number | null;
  satisfactionRatePercent: number | null;
  totalSpots: number;
  availableSpots: number;
  occupiedSpots: number;
  flexSharesActive: number;
  totalGatePassages: number;
  totalLedgerRevenue: number;
  hourlyLoad: HourlyLoadPoint[];
  zoneStats: ZoneOccupancyStat[];
  roomsUtilization?: RoomsUtilizationStat | undefined;
  revenueBreakdown?: RevenueBreakdownStat | undefined;
}
