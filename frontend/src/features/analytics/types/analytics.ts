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

export interface AnalyticsSummary {
  netCapacityGainPercent: number;
  timeSavedMinutes: number;
  satisfactionRatePercent: number;
  totalSpots: number;
  availableSpots: number;
  occupiedSpots: number;
  flexSharesActive: number;
  totalGatePassages: number;
  totalLedgerRevenue: number;
  hourlyLoad: HourlyLoadPoint[];
  zoneStats: ZoneOccupancyStat[];
}
