"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const reviewService_1 = require("../services/reviewService");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../constants");
const reviewService = new reviewService_1.ReviewService();
class ReviewController {
    getAllReviews = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { page, limit, status, roomTypeId, rating } = req.query;
        const result = await reviewService.getAllReviews({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            status: status,
            roomTypeId: roomTypeId ? Number(roomTypeId) : undefined,
            rating: rating ? Number(rating) : undefined
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Reviews retrieved successfully', result));
    });
    getReviewById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const review = await reviewService.getReviewById(Number(req.params.id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Review retrieved successfully', review));
    });
    createReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const reviewData = {
            ...req.body,
            proofImage: req.file ? req.file.path || req.file.url : undefined
        };
        const review = await reviewService.createReview(reviewData);
        const io = req.app.get('io');
        if (io) {
            io.emit('review-created', review);
        }
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Review created successfully. Pending approval.', review));
    });
    updateReviewStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { status, staffReply } = req.body;
        const review = await reviewService.updateReviewStatus(Number(req.params.id), status, staffReply);
        const io = req.app.get('io');
        if (io) {
            io.emit('review-updated', review);
        }
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Review status updated successfully', review));
    });
    deleteReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await reviewService.deleteReview(Number(req.params.id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Review deleted successfully', null));
    });
    getRoomTypeRatingSummary = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const summary = await reviewService.getRoomTypeRating(Number(req.params.roomTypeId));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Room type rating summary retrieved', summary));
    });
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=reviewController.js.map