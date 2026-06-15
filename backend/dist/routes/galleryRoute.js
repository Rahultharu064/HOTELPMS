"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const galleryVenueController_1 = require("../controllers/galleryVenueController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
const galleryVenueValidation_1 = require("../validation/galleryVenueValidation");
const router = (0, express_1.Router)();
const galleryVenueController = new galleryVenueController_1.GalleryVenueController();
const adminGuard = [
    adminAuthMiddleware_1.authenticateAdmin,
    (0, adminAuthMiddleware_1.authorizeRoles)('superadmin', 'admin', 'manager'),
];
// Admin — list all (including inactive)
router.get('/venues/admin/all', ...adminGuard, galleryVenueController.getAllVenues);
// Public — active venues only
router.get('/venues', galleryVenueController.getActiveVenues);
router.get('/venues/slug/:slug', (0, validateMiddleware_1.validate)(galleryVenueValidation_1.galleryVenueSlugSchema), galleryVenueController.getVenueBySlug);
router.get('/venues/:id', (0, validateMiddleware_1.validate)(galleryVenueValidation_1.galleryVenueIdSchema), galleryVenueController.getVenueById);
// Admin — CRUD
router.post('/venues', ...adminGuard, uploadMiddleware_1.upload.single('image'), (0, validateMiddleware_1.validate)(galleryVenueValidation_1.createGalleryVenueSchema), galleryVenueController.createVenue);
router.put('/venues/:id', ...adminGuard, uploadMiddleware_1.upload.single('image'), (0, validateMiddleware_1.validate)(galleryVenueValidation_1.updateGalleryVenueSchema), galleryVenueController.updateVenue);
router.delete('/venues/:id', ...adminGuard, (0, validateMiddleware_1.validate)(galleryVenueValidation_1.galleryVenueIdSchema), galleryVenueController.deleteVenue);
exports.default = router;
//# sourceMappingURL=galleryRoute.js.map