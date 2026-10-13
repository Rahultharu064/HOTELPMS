import { api } from './api';
import type { ApiResponse } from './api';

export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'out_of_service';

export type Room = {
  id: number;
  name: string;
  slug: string;
  roomNumber: string;
  roomTypeId: number;
  capacity: number;
  basePrice: number | string;
  floor?: number;
  status: RoomStatus;
  description?: string;
  size?: number;
  bedType?: string;
  view?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  images?: { id: number; url: string; isPrimary: boolean }[];
  videos?: { id: number; url: string; title?: string }[];
  amenities?: { id: number; name: string; icon?: string }[];
  roomType?: { 
    id: number; 
    name: string; 
    reviews?: { 
      id: number; 
      rating: number; 
      comment: string; 
      guest?: { firstName: string; lastName: string } 
    }[] 
  };
  ratingSummary?: { averageRating: number; totalReviews: number };
  _count?: { bookings: number };
};

export const roomService = {
  async getAllRooms(params?: { isFeatured?: boolean; roomTypeId?: number; limit?: number }): Promise<ApiResponse<Room[]>> {
    return api.get<ApiResponse<Room[]>>('/rooms', { params });
  },

  async getGuestFavorites(): Promise<ApiResponse<Room[]>> {
    return api.get<ApiResponse<Room[]>>('/rooms/guest-favorites');
  },

  async getRoomById(id: number | string): Promise<ApiResponse<Room>> {
    return api.get<ApiResponse<Room>>(`/rooms/${id}`);
  },

  async createRoom(data: FormData | Partial<Room>): Promise<ApiResponse<Room>> {
    return api.post<ApiResponse<Room>>('/rooms', data);
  },

  async updateRoom(id: number, data: FormData | Partial<Room>): Promise<ApiResponse<Room>> {
    return api.put<ApiResponse<Room>>(`/rooms/${id}`, data);
  },

  async deleteRoom(id: number): Promise<ApiResponse<null>> {
    return api.delete(`/rooms/${id}`) as any;
  },
};
