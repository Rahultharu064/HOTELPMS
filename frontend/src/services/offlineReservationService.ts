import { api } from './api';
import type { ApiResponse } from './api';
import type { Booking } from './bookingService';

export interface OfflineReservationData {
  existingGuestId?: number;
  newGuestDetails?: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    idType?: string;
    idNumber?: string;
    idProofImage?: string;
  };
  roomId: number;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  status?: string;
  specialRequests?: string;
  payment?: {
    amount: number;
    method: 'cash' | 'esewa' | 'khalti';
    transactionId?: string;
  };
}

export const offlineReservationService = {
  async createOfflineReservation(data: OfflineReservationData): Promise<ApiResponse<Booking>> {
    return api.post<ApiResponse<Booking>>('/offline-reservations', data);
  },
};
