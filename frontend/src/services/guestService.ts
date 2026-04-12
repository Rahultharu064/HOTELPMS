import { api } from './api';
import type { ApiResponse } from './api';

export type Guest = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  idType?: string;
  idNumber?: string;
  idProofImage?: string;
  totalSpent?: number;
  totalBookings?: number;
  createdAt?: string;
  updatedAt?: string;
  bookings?: any[]; // You can type this properly if Booking model is available
};

export type PaginatedGuestsResponse = {
  guests: Guest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const guestService = {
  async getAllGuests(filters?: { page?: number; limit?: number; search?: string; sort?: string }): Promise<ApiResponse<PaginatedGuestsResponse>> {
    const queryParams = new URLSearchParams();
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.sort) queryParams.append('sort', filters.sort);

    const queryString = queryParams.toString();
    const endpoint = `/guests${queryString ? `?${queryString}` : ''}`;

    return api.get<ApiResponse<PaginatedGuestsResponse>>(endpoint);
  },

  async getGuestById(id: number): Promise<ApiResponse<Guest>> {
    return api.get<ApiResponse<Guest>>(`/guests/${id}`);
  },

  async createGuest(data: Partial<Guest>): Promise<ApiResponse<Guest>> {
    return api.post<ApiResponse<Guest>>('/guests', data);
  },

  async updateGuest(id: number, data: Partial<Guest>): Promise<ApiResponse<Guest>> {
    return api.put<ApiResponse<Guest>>(`/guests/${id}`, data);
  },

  async deleteGuest(id: number): Promise<ApiResponse<void>> {
    return api.delete(`/guests/${id}`) as any;
  },

  async getGuestStats(): Promise<ApiResponse<any>> {
    return api.get<ApiResponse<any>>('/guests/statistics');
  }
};
