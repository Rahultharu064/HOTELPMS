import { Router } from 'express';
import { FacilityController } from '../controllers/facilityController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createFacilitySchema,
  updateFacilitySchema,
  getFacilitiesSchema,
  facilityImagesSchema,
  facilityVideosSchema,
} from '../validation/facilityValidation';

const router = Router();
const facilityController = new FacilityController();

// Get facility statistics
router.get('/statistics', facilityController.getFacilityStats);

// Get all facilities with filters
router.get(
  '/',
  validate(getFacilitiesSchema),
  facilityController.getAllFacilities
);

// Get facility by ID
router.get('/:id', facilityController.getFacilityById);

// Create facility
router.post(
  '/',
  validate(createFacilitySchema),
  facilityController.createFacility
);

// Update facility
router.put(
  '/:id',
  validate(updateFacilitySchema),
  facilityController.updateFacility
);

// Delete facility
router.delete('/:id', facilityController.deleteFacility);

// Add facility images
router.post(
  '/:id/images',
  validate(facilityImagesSchema),
  facilityController.addFacilityImages
);

// Add facility videos
router.post(
  '/:id/videos',
  validate(facilityVideosSchema),
  facilityController.addFacilityVideos
);

export default router;