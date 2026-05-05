"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const facilityController_1 = require("../controllers/facilityController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const facilityValidation_1 = require("../validation/facilityValidation");
const router = (0, express_1.Router)();
const facilityController = new facilityController_1.FacilityController();
// Get facility statistics
router.get('/statistics', facilityController.getFacilityStats);
// Get all facilities with filters
router.get('/', (0, validateMiddleware_1.validate)(facilityValidation_1.getFacilitiesSchema), facilityController.getAllFacilities);
// Get facility by ID
router.get('/:id', facilityController.getFacilityById);
// Create facility
router.post('/', (0, validateMiddleware_1.validate)(facilityValidation_1.createFacilitySchema), facilityController.createFacility);
// Update facility
router.put('/:id', (0, validateMiddleware_1.validate)(facilityValidation_1.updateFacilitySchema), facilityController.updateFacility);
// Delete facility
router.delete('/:id', facilityController.deleteFacility);
// Add facility images
router.post('/:id/images', (0, validateMiddleware_1.validate)(facilityValidation_1.facilityImagesSchema), facilityController.addFacilityImages);
// Add facility videos
router.post('/:id/videos', (0, validateMiddleware_1.validate)(facilityValidation_1.facilityVideosSchema), facilityController.addFacilityVideos);
exports.default = router;
//# sourceMappingURL=facilityRoute.js.map