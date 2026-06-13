import { Router } from 'express';
import { GalleryVenueController } from '../controllers/galleryVenueController';
import { validate } from '../middlewares/validateMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import { authenticateAdmin, authorizeRoles } from '../middlewares/adminAuthMiddleware';
import {
  createGalleryVenueSchema,
  updateGalleryVenueSchema,
  galleryVenueIdSchema,
  galleryVenueSlugSchema,
} from '../validation/galleryVenueValidation';

const router = Router();
const galleryVenueController = new GalleryVenueController();

const adminGuard = [
  authenticateAdmin as any,
  authorizeRoles('superadmin', 'admin', 'manager') as any,
];

// Admin — list all (including inactive)
router.get('/venues/admin/all', ...adminGuard, galleryVenueController.getAllVenues);

// Public — active venues only
router.get('/venues', galleryVenueController.getActiveVenues);
router.get('/venues/slug/:slug', validate(galleryVenueSlugSchema), galleryVenueController.getVenueBySlug);
router.get('/venues/:id', validate(galleryVenueIdSchema), galleryVenueController.getVenueById);

// Admin — CRUD
router.post(
  '/venues',
  ...adminGuard,
  upload.single('image'),
  validate(createGalleryVenueSchema),
  galleryVenueController.createVenue
);

router.put(
  '/venues/:id',
  ...adminGuard,
  upload.single('image'),
  validate(updateGalleryVenueSchema),
  galleryVenueController.updateVenue
);

router.delete(
  '/venues/:id',
  ...adminGuard,
  validate(galleryVenueIdSchema),
  galleryVenueController.deleteVenue
);

export default router;
