import { api } from './api';

export const paymentService = {
  initiatePayment: async (data: { bookingId: number; amount: number; method: string; returnUrl?: string }) => {
    const response = await api.post<any>('/payments/initiate', data);
    return response;
  },

  verifyEsewa: async (encodedData: string) => {
    const response = await api.get<any>(`/payments/verify-esewa?data=${encodedData}`);
    return response;
  },

  verifyKhalti: async (data: { pidx: string; transaction_id?: string; purchase_order_id?: string }) => {
    const response = await api.post<any>('/payments/verify-khalti', data);
    return response;
  },

  getAllPayments: async (params: any) => {
    const response = await api.get<any>('/payments', { params });
    return response;
  }
};
