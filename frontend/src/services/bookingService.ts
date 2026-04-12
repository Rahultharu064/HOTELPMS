import { api } from './api';
import type { ApiResponse } from './api';

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentMethod = 'cash' | 'esewa' | 'khalti';

export type Booking = {
  id: number;
  bookingNumber: string;
  guestId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: BookingStatus;
  adults: number;
  children: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
};

export type BookingCreateData = {
  guestId?: number;
  guestDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality?: string;
    idType?: string;
    idNumber?: string;
    idProofImage?: string;
  };
  roomId: number;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  specialRequests?: string;
  payment?: {
    amount: number;
    method: PaymentMethod;
    transactionId?: string;
  };
};

export const bookingService = {
  async getAllBookings(params?: any): Promise<ApiResponse<{ bookings: Booking[], pagination: any }>> {
    return api.get<ApiResponse<{ bookings: Booking[], pagination: any }>>('/bookings', { params });
  },

  async getBookingById(id: number): Promise<ApiResponse<Booking>> {
    return api.get<ApiResponse<Booking>>(`/bookings/${id}`);
  },

  async createBooking(data: BookingCreateData): Promise<ApiResponse<Booking>> {
    return api.post<ApiResponse<Booking>>('/bookings', data);
  },

  async updateBooking(id: number, data: Partial<BookingCreateData>): Promise<ApiResponse<Booking>> {
    return api.put<ApiResponse<Booking>>(`/bookings/${id}`, data);
  },

  async updateBookingStatus(id: number, status: BookingStatus): Promise<ApiResponse<Booking>> {
    return api.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
  },

  async getStatistics(): Promise<ApiResponse<any>> {
    return api.get<ApiResponse<any>>('/bookings/statistics');
  },
};
