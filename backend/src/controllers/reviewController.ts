import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';
import { ReviewStatus } from '@prisma/client';

const reviewService = new ReviewService();

export class ReviewController {
  getAllReviews = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, roomTypeId, rating } = req.query;
    const result = await reviewService.getAllReviews({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as any,
      roomTypeId: roomTypeId ? Number(roomTypeId) : undefined,
      rating: rating ? Number(rating) : undefined
    });

    res.status(HttpStatus.OK).json(ApiResponse.success('Reviews retrieved successfully', result));
  });

  getReviewById = asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewService.getReviewById(Number(req.params.id));
    res.status(HttpStatus.OK).json(ApiResponse.success('Review retrieved successfully', review));
  });

  createReview = asyncHandler(async (req: Request, res: Response) => {
    const reviewData = {
      ...req.body,
      proofImage: req.file ? (req.file as any).path || (req.file as any).url : undefined
    };
    
    const review = await reviewService.createReview(reviewData);

    const io = req.app.get('io');
    if (io) {
      io.emit('review-created', review);
    }

    res.status(HttpStatus.CREATED).json(ApiResponse.success('Review created successfully. Pending approval.', review));
  });


  updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status, staffReply } = req.body;
    const review = await reviewService.updateReviewStatus(Number(req.params.id), status as ReviewStatus, staffReply);

    const io = req.app.get('io');
    if (io) {
      io.emit('review-updated', review);
    }

    res.status(HttpStatus.OK).json(ApiResponse.success('Review status updated successfully', review));
  });

  deleteReview = asyncHandler(async (req: Request, res: Response) => {
    await reviewService.deleteReview(Number(req.params.id));
    res.status(HttpStatus.OK).json(ApiResponse.success('Review deleted successfully', null));
  });

  getRoomTypeRatingSummary = asyncHandler(async (req: Request, res: Response) => {
    const summary = await reviewService.getRoomTypeRating(Number(req.params.roomTypeId));
    res.status(HttpStatus.OK).json(ApiResponse.success('Room type rating summary retrieved', summary));
  });
}
