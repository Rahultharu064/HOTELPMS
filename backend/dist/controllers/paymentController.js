"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const paymentService_1 = require("../services/paymentService");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../constants");
const paymentService = new paymentService_1.PaymentService();
class PaymentController {
    initiatePayment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { bookingId, serviceOrderId, amount, method, returnUrl } = req.body;
        const result = await paymentService.initiatePayment({
            bookingId: bookingId ? Number(bookingId) : undefined,
            serviceOrderId: serviceOrderId ? Number(serviceOrderId) : undefined,
            amount: Number(amount),
            method,
            returnUrl
        });
        const io = req.app.get('io');
        if (io && result.method === 'cash') {
            io.emit('payment-processed', { bookingId, method: 'cash', status: 'completed' });
        }
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Payment initiated successfully', result));
    });
    verifyEsewa = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const encodedData = req.query.data || req.body.data;
        if (!encodedData) {
            res.status(constants_1.HttpStatus.BAD_REQUEST).json(ApiResponse_1.ApiResponse.error('Missing data for eSewa Verification'));
            return;
        }
        const result = await paymentService.verifyEsewa(encodedData);
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('eSewa payment verified', result));
    });
    verifyKhalti = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { pidx, purchase_order_id } = req.query;
        const result = await paymentService.verifyKhalti({
            pidx: pidx,
            purchase_order_id: purchase_order_id
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Khalti payment verification complete', result));
    });
    getAllPayments = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { page, limit, bookingId, serviceOrderId, status, method, startDate, endDate, type } = req.query;
        const result = await paymentService.getAllPayments({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            bookingId: bookingId ? Number(bookingId) : undefined,
            serviceOrderId: serviceOrderId ? Number(serviceOrderId) : undefined,
            status: status,
            method: method,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            type: type
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Payments retrieved successfully', result));
    });
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=paymentController.js.map