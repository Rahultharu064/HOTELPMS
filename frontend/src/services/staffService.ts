import { api, type ApiResponse } from './api';

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  role: 'superadmin' | 'admin' | 'manager' | 'front_office' | 'housekeeping';
  isActive: boolean;
  mustChangePassword: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export interface CreateStaffResponse {
  staff: StaffMember;
  temporaryPassword: string;
}

export const staffService = {
  /**
   * Create a new staff member
   */
  createStaff: async (data: {
    name: string;
    email: string;
    phoneNumber?: string;
    role: string;
  }): Promise<ApiResponse<CreateStaffResponse>> => {
    const response = await api.post<ApiResponse<CreateStaffResponse>>('/admin/staff', data);
    return response;
  },

  /**
   * Get all staff members
   */
  getAllStaff: async (): Promise<ApiResponse<StaffMember[]>> => {
    const response = await api.get<ApiResponse<StaffMember[]>>('/admin/staff');
    return response;
  },

  /**
   * Toggle staff active status
   */
  toggleStatus: async (id: number, isActive: boolean): Promise<ApiResponse<StaffMember>> => {
    const response = await api.patch<ApiResponse<StaffMember>>(`/admin/staff/${id}/status`, { isActive });
    return response;
  },

  /**
   * Update staff member details
   */
  updateStaff: async (id: number, data: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
  }): Promise<ApiResponse<StaffMember>> => {
    const response = await api.put<ApiResponse<StaffMember>>(`/admin/staff/${id}`, data);
    return response;
  },

  /**
   * Reset staff password
   */
  resetPassword: async (id: number): Promise<ApiResponse<{ temporaryPassword: string }>> => {
    const response = await api.post<ApiResponse<{ temporaryPassword: string }>>(`/admin/staff/${id}/reset-password`, {});
    return response;
  },
};
