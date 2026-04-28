import { api } from './api';
import type { ApiResponse } from './api';

export const frontOfficeService = {
  getDashboardStats: async (date?: string): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/frontoffice/dashboard', { params: { date } });
  },

  getRoomBoard: async (): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/frontoffice/room-board');
  },

  searchUnified: async (query: string, limit: number = 10): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/frontoffice/search', { params: { query, limit } });
  },

  updateRoomStatus: async (roomId: number, status: string): Promise<ApiResponse<any>> => {
    return await api.patch<ApiResponse<any>>(`/frontoffice/room/${roomId}/status`, { status });
  },

  checkIn: async (bookingId: number, guestData?: any, newRoomId?: number): Promise<ApiResponse<any>> => {
    return await api.post<ApiResponse<any>>(`/frontoffice/booking/${bookingId}/checkin`, { guestData, newRoomId });
  },

  getAlternativeRooms: async (bookingId: number): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>(`/frontoffice/booking/${bookingId}/alternatives`);
  },

  getGuestActiveBookings: async (guestId: number, currentBookingId: number): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/frontoffice/guest/active-bookings', { params: { guestId, currentBookingId } });
  },

  checkOut: async (bookingId: number, paymentMethod?: string): Promise<ApiResponse<any>> => {
    return await api.post<ApiResponse<any>>(`/frontoffice/booking/${bookingId}/checkout`, { paymentMethod, force: !!paymentMethod });
  },

  getTodayArrivals: async (): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/frontoffice/arrivals');
  },

  getTodayDepartures: async (): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/frontoffice/departures');
  },

  verifyIdentity: async (bookingId: number, formData: any): Promise<ApiResponse<any>> => {
    return await api.post<ApiResponse<any>>(`/frontoffice/booking/${bookingId}/verify-identity`, { formData });
  },
  
  getFolio: async (bookingId: number): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>(`/frontoffice/booking/${bookingId}/folio`);
  }
};
