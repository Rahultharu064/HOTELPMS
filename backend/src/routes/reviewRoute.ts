import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController';
import { validate } from '../middlewares/validateMiddleware';
import { 
  createReviewSchema, 
  updateReviewStatusSchema,
  getReviewsSchema
} from '../validation/reviewValidation';

const router = Router();
const reviewController = new ReviewController();

// List and create reviews
router.get('/', validate(getReviewsSchema), reviewController.getAllReviews);
router.post('/', validate(createReviewSchema), reviewController.createReview);

// Specific review details and status management
router.get('/:id', reviewController.getReviewById);
router.patch('/:id/status', validate(updateReviewStatusSchema), reviewController.updateReviewStatus);
router.delete('/:id', reviewController.deleteReview);

// Aggregate rating for specific room types
router.get('/summary/:roomTypeId', reviewController.getRoomTypeRatingSummary);

export default router;
