import { api } from './api';
import type { ApiResponse } from './api';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'esewa' | 'khalti';

export type Payment = {
  id: number;
  bookingId?: number | null;
  serviceOrderId?: number | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  booking?: {
    bookingNumber: string;
    guest?: { firstName: string; lastName: string; email?: string };
  };
  serviceOrder?: {
    orderNumber: string;
    requestedBy?: string;
  };
};

export type PaginatedPaymentsResponse = {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetAllPaymentsParams = {
  page?: number;
  limit?: number;
  bookingId?: number;
  serviceOrderId?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  type?: 'booking' | 'service';
};

export type InitiatePaymentResult = {
  method: PaymentMethod;
  /** Present for redirect-based gateways (eSewa/Khalti) — form fields to submit, including `url` */
  paymentPayload?: Record<string, string>;
};

export const paymentService = {
  initiatePayment: async (data: { bookingId?: number; serviceOrderId?: number; amount: number; method: string; returnUrl?: string }) => {
    const response = await api.post<ApiResponse<InitiatePaymentResult>>('/payments/initiate', data);
    return response;
  },

  verifyEsewa: async (encodedData: string) => {
    const response = await api.get<ApiResponse<unknown>>(`/payments/verify-esewa?data=${encodedData}`);
    return response;
  },

  verifyKhalti: async (data: { pidx: string; transaction_id?: string; purchase_order_id?: string }) => {
    const response = await api.post<ApiResponse<unknown>>('/payments/verify-khalti', data);
    return response;
  },

  getAllPayments: async (params?: GetAllPaymentsParams): Promise<ApiResponse<PaginatedPaymentsResponse>> => {
    const response = await api.get<ApiResponse<PaginatedPaymentsResponse>>('/payments', { params });
    return response;
  }
};
