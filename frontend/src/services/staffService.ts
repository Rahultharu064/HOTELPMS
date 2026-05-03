import { api } from './api';

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

export const staffService = {
  /**
   * Create a new staff member
   */
  createStaff: async (data: {
    name: string;
    email: string;
    phoneNumber?: string;
    role: string;
  }) => {
    const response = await api.post('/admin/staff', data);
    return response.data;
  },

  /**
   * Get all staff members
   */
  getAllStaff: async () => {
    const response = await api.get('/admin/staff');
    return response.data;
  },

  /**
   * Toggle staff active status
   */
  toggleStatus: async (id: number, isActive: boolean) => {
    const response = await api.patch(`/admin/staff/${id}/status`, { isActive });
    return response.data;
  },
};
