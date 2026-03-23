import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';

const paymentService = new PaymentService();

export class PaymentController {
  initiatePayment = asyncHandler(async (req: Request, res: Response) => {
    const { bookingId, amount, method, returnUrl } = req.body;
    const result = await paymentService.initiatePayment({
      bookingId: Number(bookingId),
      amount: Number(amount),
      method,
      returnUrl
    });

    const io = req.app.get('io');
    if (io && result.method === 'cash') {
      io.emit('payment-processed', { bookingId, method: 'cash', status: 'completed' });
    }

    res.status(HttpStatus.CREATED).json(
      ApiResponse.success('Payment initiated successfully', result)
    );
  });

  verifyEsewa = asyncHandler(async (req: Request, res: Response) => {
    const encodedData = req.query.data as string || req.body.data;
    
    if (!encodedData) {
       res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error('Missing data for eSewa Verification'));
       return;
    }

    const result = await paymentService.verifyEsewa(encodedData);

    res.status(HttpStatus.OK).json(
      ApiResponse.success('eSewa payment verified', result)
    );
  });

  verifyKhalti = asyncHandler(async (req: Request, res: Response) => {
    const { idx, amount, transaction_id, status } = req.body;
    const result = await paymentService.verifyKhalti({ idx, amount, transaction_id, status });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Khalti payment verification complete', result)
    );
  });

  getAllPayments = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, bookingId, status, method, startDate, endDate } = req.query;
    const result = await paymentService.getAllPayments({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      bookingId: bookingId ? Number(bookingId) : undefined,
      status: status as string,
      method: method as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Payments retrieved successfully', result)
    );
  });
}
