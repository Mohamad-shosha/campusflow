import { apiClient } from '../../../shared/http/apiClient';
import type {
  ParkingSpotResponse,
  ParkingZoneResponse,
  ParkingSummaryResponse,
  ParkingTariffResponse,
  CreateBookingRequest,
  BookingResponse,
  DigitalPassResponse,
  FlexOfferResponse,
  CreateFlexOfferRequest,
  GateScanRequest,
  GateDecisionResponse,
} from '../types/parking';

export const parkingApi = {
  // Spots & Zones
  getSpots: async (zone?: string, status?: string): Promise<ParkingSpotResponse[]> => {
    const params: Record<string, string> = {};
    if (zone && zone !== 'all') params.zone = zone;
    if (status) params.status = status;
    const response = await apiClient.get<ParkingSpotResponse[]>('/parking/spots', { params });
    return response.data;
  },

  getSpotByBay: async (bayNumber: number): Promise<ParkingSpotResponse> => {
    const response = await apiClient.get<ParkingSpotResponse>(`/parking/spots/${bayNumber}`);
    return response.data;
  },

  getZones: async (): Promise<ParkingZoneResponse[]> => {
    const response = await apiClient.get<ParkingZoneResponse[]>('/parking/zones');
    return response.data;
  },

  getSummary: async (): Promise<ParkingSummaryResponse> => {
    const response = await apiClient.get<ParkingSummaryResponse>('/parking/summary');
    return response.data;
  },

  getTariffs: async (): Promise<ParkingTariffResponse[]> => {
    const response = await apiClient.get<ParkingTariffResponse[]>('/parking/tariffs');
    return response.data;
  },

  // Bookings
  createBooking: async (request: CreateBookingRequest): Promise<BookingResponse> => {
    const response = await apiClient.post<BookingResponse>('/parking/bookings', request);
    return response.data;
  },

  getMyBookings: async (): Promise<BookingResponse[]> => {
    const response = await apiClient.get<BookingResponse[]>('/parking/bookings/my');
    return response.data;
  },

  getDigitalPass: async (bookingId: string): Promise<DigitalPassResponse> => {
    const response = await apiClient.get<DigitalPassResponse>(
      `/parking/bookings/${bookingId}/pass`
    );
    return response.data;
  },

  cancelBooking: async (bookingId: string): Promise<void> => {
    await apiClient.post(`/parking/bookings/${bookingId}/cancel`);
  },

  // Flex Share
  getFlexOffers: async (): Promise<FlexOfferResponse[]> => {
    const response = await apiClient.get<FlexOfferResponse[]>('/parking/flex/offers');
    return response.data;
  },

  createFlexOffer: async (request: CreateFlexOfferRequest): Promise<FlexOfferResponse> => {
    const response = await apiClient.post<FlexOfferResponse>('/parking/flex/offers', request);
    return response.data;
  },

  claimFlexOffer: async (offerId: string): Promise<FlexOfferResponse> => {
    const response = await apiClient.post<FlexOfferResponse>(
      `/parking/flex/offers/${offerId}/claim`
    );
    return response.data;
  },

  cancelFlexOffer: async (offerId: string): Promise<void> => {
    await apiClient.post(`/parking/flex/offers/${offerId}/cancel`);
  },

  // Gate Scanner Simulator
  scanGate: async (request: GateScanRequest): Promise<GateDecisionResponse> => {
    const response = await apiClient.post<GateDecisionResponse>('/parking/gate/scan', request);
    return response.data;
  },
};
