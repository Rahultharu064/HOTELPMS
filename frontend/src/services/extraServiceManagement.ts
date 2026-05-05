import { api } from './api';
import type { ApiResponse } from './api';

export interface ExtraService {
  id: number;
  name: string;
  description: string;
  price: string | number;
  categoryId: number;
  image?: string;
  discountPercentage: number;
  discountAllowed: boolean;
  active: boolean;
  category?: {
    id: number;
    name: string;
  };
}

export interface BookingExtraService {
  id: number;
  bookingId: number;
  extraServiceId: number;
  quantity: number;
  unitPrice: number;
  basePrice: number;
  discountAmount: number;
  serviceChargeAmount: number;
  totalPrice: number;
  extraService: ExtraService;
}

export const extraServiceManagement = {
  getAll: async (): Promise<ApiResponse<ExtraService[]>> => {
    return await api.get<ApiResponse<ExtraService[]>>('/extra-services');
  },

  create: async (data: FormData): Promise<ApiResponse<ExtraService>> => {
    return await api.post<ApiResponse<ExtraService>>('/extra-services', data);
  },

  update: async (id: number, data: FormData): Promise<ApiResponse<ExtraService>> => {
    return await api.put<ApiResponse<ExtraService>>(`/extra-services/${id}`, data);
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete<ApiResponse<void>>(`/extra-services/${id}`);
  },

  getBookingServices: async (bookingId: number): Promise<ApiResponse<BookingExtraService[]>> => {
    return await api.get<ApiResponse<BookingExtraService[]>>(`/extra-services/booking/${bookingId}`);
  },

  addToBooking: async (data: { bookingId: number; extraServiceId: number; quantity: number; paymentMethod?: string }): Promise<ApiResponse<BookingExtraService>> => {
    return await api.post<ApiResponse<BookingExtraService>>('/extra-services/booking', data);
  },

  removeFromBooking: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete<ApiResponse<void>>(`/extra-services/booking/${id}`);
  }
};
