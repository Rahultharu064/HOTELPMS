import { api } from './api';
import type { ApiResponse } from './api';

export type RoomType = {
  id: number;
  name: string;
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedResponse<T> = {
  roomTypes: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const roomTypeService = {
  async getAllRoomTypes(): Promise<ApiResponse<PaginatedResponse<RoomType[]>>> {
    return api.get<ApiResponse<PaginatedResponse<RoomType[]>>>('/room-types');
  },

  async getRoomTypeById(id: number): Promise<ApiResponse<RoomType>> {
    return api.get<ApiResponse<RoomType>>(`/room-types/${id}`);
  },

  async createRoomType(data: Partial<RoomType> | FormData): Promise<ApiResponse<RoomType>> {
    return api.post<ApiResponse<RoomType>>('/room-types', data);
  },

  async updateRoomType(id: number, data: Partial<RoomType> | FormData): Promise<ApiResponse<RoomType>> {
    return api.put<ApiResponse<RoomType>>(`/room-types/${id}`, data);
  },

  async deleteRoomType(id: number): Promise<ApiResponse<void>> {
    return api.delete(`/room-types/${id}`) as any;
  },
};
