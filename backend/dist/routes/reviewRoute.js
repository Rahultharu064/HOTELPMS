"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const reviewValidation_1 = require("../validation/reviewValidation");
const router = (0, express_1.Router)();
const reviewController = new reviewController_1.ReviewController();
// List and create reviews
router.get('/', (0, validateMiddleware_1.validate)(reviewValidation_1.getReviewsSchema), reviewController.getAllReviews);
router.post('/', (0, validateMiddleware_1.validate)(reviewValidation_1.createReviewSchema), reviewController.createReview);
// Specific review details and status management
router.get('/:id', reviewController.getReviewById);
router.patch('/:id/status', (0, validateMiddleware_1.validate)(reviewValidation_1.updateReviewStatusSchema), reviewController.updateReviewStatus);
router.delete('/:id', reviewController.deleteReview);
// Aggregate rating for specific room types
router.get('/summary/:roomTypeId', reviewController.getRoomTypeRatingSummary);
exports.default = router;
//# sourceMappingURL=reviewRoute.js.map