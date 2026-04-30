import api from './api';

export const authService = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  googleLogin: async (tokenId: string) => {
    const response = await api.post('/auth/google', { tokenId });
    return response.data;
  },

  verifyOTP: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  resendOTP: async (email: string) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  updateProfileImage: async (formData: FormData) => {
    const response = await api.post('/auth/profile-image', formData);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
};
