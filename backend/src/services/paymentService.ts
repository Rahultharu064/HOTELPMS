import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';
import { PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { config } from '../config';
import crypto from 'crypto';

export class PaymentService {
  async initiatePayment(data: { bookingId?: number; serviceOrderId?: number; amount: number; method: string; returnUrl?: string }) {
    if (!data.bookingId && !data.serviceOrderId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Reference ID (Booking or Service) required');
    }

    const amountDecimal = new Prisma.Decimal(data.amount);
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payData: any = {
      amount: amountDecimal,
      method: data.method === 'cod' ? 'cash' : data.method as PaymentMethod,
      status: (data.method === 'cash' || data.method === 'cod') ? 'completed' : 'pending',
      transactionId: (data.method === 'cash' || data.method === 'cod') ? `CASH-${Date.now()}` : transactionId,
      bookingId: data.bookingId,
      serviceOrderId: data.serviceOrderId
    };

    const payment = await prisma.payment.create({ data: payData });

    if (data.method === 'cash' || data.method === 'cod') {
        return { payment, method: 'cash', message: 'Cash settlement confirmed' };
    }

    // Fetch booking details for online payment gateways if needed
    let bookingData = null;
    if (data.bookingId) {
      bookingData = await prisma.booking.findUnique({ 
        where: { id: data.bookingId },
        include: { guest: true }
      });
    }

    if (data.method === 'esewa') {
      const merchantCode = config.payment.esewa.merchantCode || 'EPAYTEST';
      const secretKey = config.payment.esewa.secretKey || '8gBm/:&EnhH.1/q';
      const signaturePayload = `total_amount=${data.amount},transaction_uuid=${transactionId},product_code=${merchantCode}`;
      const hash = crypto.createHmac('sha256', secretKey).update(signaturePayload).digest('base64');

      return {
        payment,
        method: 'esewa',
        paymentPayload: {
          url: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
          amount: data.amount,
          tax_amount: 0,
          total_amount: data.amount,
          transaction_uuid: transactionId,
          product_code: merchantCode,
          product_service_charge: 0,
          product_delivery_charge: 0,
          success_url: `${data.returnUrl || 'http://localhost:5173'}/payment/success`,
          failure_url: `${data.returnUrl || 'http://localhost:5173'}/payment/failure`,
          signed_field_names: 'total_amount,transaction_uuid,product_code',
          signature: hash
        }
      };
    }

    if (data.method === 'khalti') {
      const secretKey = config.payment.khalti.secretKey || 'BhwIWQQADhIYSxILExMcAgFXFhcOBwAKBgAXEQ==';
      
      const payloadObj = {
        return_url: `${data.returnUrl || 'http://localhost:5173'}/payment/success`,
        website_url: data.returnUrl || 'http://localhost:5173',
        amount: Math.round(data.amount * 100), // Khalti dictates paisa and hates decimals
        purchase_order_id: transactionId,
        purchase_order_name: bookingData ? `Booking-${bookingData.bookingNumber}` : 'Hotel Payment',
        customer_info: {
           name: bookingData?.guest?.firstName ? `${bookingData.guest.firstName} ${bookingData.guest.lastName}` : 'Guest',
           email: bookingData?.guest?.email || 'guest@example.com',
           phone: bookingData?.guest?.phone || '9800000000'
        }
      };

      try {
        const response = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
          method: 'POST',
          headers: {
            'Authorization': `Key ${secretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payloadObj)
        });

        const khaltiRes = await response.json() as any;
        
        if (!response.ok) {
          throw new ApiError(HttpStatus.BAD_REQUEST, `Khalti Initialization Failed: ${khaltiRes.detail || 'Unknown error'}`);
        }

        return {
          payment,
          method: 'khalti',
          paymentPayload: {
            url: khaltiRes.payment_url,
            pidx: khaltiRes.pidx
          }
        };
      } catch (err: any) {
        throw new ApiError(HttpStatus.BAD_REQUEST, `Khalti connection failed: ${err.message}`);
      }
    }

    throw new ApiError(HttpStatus.BAD_REQUEST, 'Unsupported payment method');
  }

  async verifyEsewa(encodedData: string) {
    try {
      const decodedStr = Buffer.from(encodedData, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedStr);

      if (payload.status !== 'COMPLETE') {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'eSewa payment not completed');
      }

      const secretKey = config.payment.esewa.secretKey || '8gBm/:&EnhH.1/q';
      
      // Strict eSewa v2 Signature Verification
      if (!payload.signed_field_names || !payload.signature) {
          throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid eSewa callback response structure');
      }

      const signedFieldNames = payload.signed_field_names.split(',');
      const signaturePayloadStr = signedFieldNames.map((field: string) => `${field}=${payload[field] || ''}`).join(',');
      
      const generatedSignature = crypto.createHmac('sha256', secretKey)
                                       .update(signaturePayloadStr)
                                       .digest('base64');
                                      
      if (generatedSignature !== payload.signature) {
          throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid cryptographic payment signature (tampering detected)');
      }

      await prisma.payment.updateMany({
        where: { transactionId: payload.transaction_uuid },
        data: { status: 'completed', paymentData: payload }
      });

      const payment = await prisma.payment.findFirst({ where: { transactionId: payload.transaction_uuid } });
      if (payment) {
         if (payment.bookingId) {
            await prisma.booking.update({ where: { id: payment.bookingId }, data: { status: 'confirmed' } });
         }
         if (payment.serviceOrderId) {
             await prisma.serviceOrder.update({ where: { id: payment.serviceOrderId }, data: { status: 'confirmed' } });
         }
      }

      return { success: true, message: 'eSewa Payment verified successfully' };
    } catch (error) {
       throw new ApiError(HttpStatus.BAD_REQUEST, 'eSewa verification failed');
    }
  }

  async verifyKhalti(data: { pidx: string, transaction_id?: string, purchase_order_id?: string }) {
    const secretKey = config.payment.khalti.secretKey || 'BhwIWQQADhIYSxILExMcAgFXFhcOBwAKBgAXEQ==';
    const pidx = data.pidx;

    if (!pidx) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Missing pidx for Khalti verification');
    }

    try {
      const response = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pidx })
      });

      const verifyData = await response.json() as any;

      if (response.ok && verifyData.status === 'Completed') {
        const targetTransactionId = verifyData.purchase_order_id || data.purchase_order_id;
        await this.markPaymentCompleted(targetTransactionId, verifyData);
        return { success: true, data: verifyData };
      } else {
        throw new ApiError(HttpStatus.BAD_REQUEST, `Khalti Payment ${verifyData.status || 'Failed'}`);
      }
    } catch(err: any) {
        throw new ApiError(HttpStatus.BAD_REQUEST, `Khalti verification failed: ${err.message}`);
    }
  }

  private async markPaymentCompleted(transactionId: string | undefined, data: any) {
    if (!transactionId) return;
    await prisma.payment.updateMany({
      where: { transactionId },
      data: { status: 'completed', paymentData: data }
    });
    const payment = await prisma.payment.findFirst({ where: { transactionId } });
    if (payment) {
       if (payment.bookingId) {
          await prisma.booking.update({ where: { id: payment.bookingId }, data: { status: 'confirmed' } });
       }
       if (payment.serviceOrderId) {
          await prisma.serviceOrder.update({ where: { id: payment.serviceOrderId }, data: { status: 'confirmed' } });
       }
    }
  }

  async getAllPayments(filters: { 
    page?: number; 
    limit?: number; 
    bookingId?: number; 
    serviceOrderId?: number; 
    status?: string; 
    method?: string; 
    startDate?: Date; 
    endDate?: Date;
    type?: 'booking' | 'service' 
  }) {
    const { page = 1, limit = 10, bookingId, serviceOrderId, status, method, startDate, endDate, type } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {};
    if (bookingId) where.bookingId = bookingId;
    if (serviceOrderId) where.serviceOrderId = serviceOrderId;
    if (status) where.status = status as PaymentStatus;
    if (method) where.method = method as PaymentMethod;
    
    if (type === 'booking') where.bookingId = { not: null };
    if (type === 'service') where.serviceOrderId = { not: null };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ 
        where, 
        skip, 
        take: limit, 
        orderBy: { createdAt: 'desc' }, 
        include: { 
            booking: { select: { bookingNumber: true, guest: true } },
            serviceOrder: { select: { orderNumber: true, requestedBy: true } }
        } 
      }),
      prisma.payment.count({ where })
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
