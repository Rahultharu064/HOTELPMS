import { api } from './api';
import type { ApiResponse } from './api';

export const housekeepingService = {
  getRoomStatuses: async (): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/housekeeping/rooms');
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/housekeeping/stats');
  },

  updateRoomStatus: async (roomId: number, data: {
    status: string;
    staffId?: string;
    type: string;
    notes?: string;
  }): Promise<ApiResponse<any>> => {
    return await api.patch<ApiResponse<any>>(`/housekeeping/room/${roomId}`, data);
  },

  getLogs: async (params?: any): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/housekeeping/logs', { params });
  },

  getStaff: async (): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/housekeeping/staff');
  },

  addStaff: async (data: any): Promise<ApiResponse<any>> => {
    return await api.post<ApiResponse<any>>('/housekeeping/staff', data);
  }
};

