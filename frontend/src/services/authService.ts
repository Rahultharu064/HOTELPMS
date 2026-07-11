import api from './api';

export const authService = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response;
  },

  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response;
  },

  googleLogin: async (tokenId: string) => {
    const response = await api.post('/auth/google', { tokenId });
    return response;
  },

  verifyOTP: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response;
  },

  resendOTP: async (email: string) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/auth/profile', data);
    return response;
  },

  updateProfileImage: async (formData: FormData) => {
    const response = await api.post('/auth/profile-image', formData);
    return response;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  resetPassword: async (data: any) => {
    const response = await api.post('/auth/reset-password', data);
    return response;
  },

  // Admin-specific methods
  adminUpdateProfile: async (data: any) => {
    const response = await api.put('/admin/auth/profile', data);
    return response;
  },

  adminUpdateProfileImage: async (formData: FormData) => {
    const response = await api.post('/admin/auth/avatar', formData);
    return response;
  },

  adminChangePassword: async (data: any) => {
    const response = await api.post('/admin/auth/change-password', data);
    return response;
  },
};
