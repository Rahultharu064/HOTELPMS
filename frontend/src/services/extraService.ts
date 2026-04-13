import { api } from './api';
import type { ApiResponse } from './api';

export interface ServiceOrderItem {
  serviceId: number;
  quantity: number;
  notes?: string;
  price?: number;
}

export interface ServiceOrderData {
  bookingId?: number;
  guestId?: number;
  roomId?: number;
  notes?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  requestedBy?: string;
  items: ServiceOrderItem[];
}

export const extraService = {
  getServiceCategories: async (): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/service-categories');
  },

  getServices: async (categoryId?: number): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/services', { params: { categoryId } });
  },

  createOrder: async (data: ServiceOrderData): Promise<ApiResponse<any>> => {
    return await api.post<ApiResponse<any>>('/service-orders', data);
  },

  getOrders: async (params?: any): Promise<ApiResponse<any>> => {
    return await api.get<ApiResponse<any>>('/service-orders', { params });
  },

  updateOrderStatus: async (id: number, status: string, assignedTo?: string): Promise<ApiResponse<any>> => {
    return await api.patch<ApiResponse<any>>(`/service-orders/${id}/status`, { status, assignedTo });
  }
};
