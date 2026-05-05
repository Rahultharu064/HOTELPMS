"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceCategoryController_1 = require("../controllers/serviceCategoryController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const serviceCategoryValidation_1 = require("../validation/serviceCategoryValidation");
const router = (0, express_1.Router)();
const serviceCategoryController = new serviceCategoryController_1.ServiceCategoryController();
// Categories routes
router.get('/categories', serviceCategoryController.getAllCategories);
router.post('/categories', (0, validateMiddleware_1.validate)(serviceCategoryValidation_1.createServiceCategorySchema), serviceCategoryController.createCategory);
router.put('/categories/:id', (0, validateMiddleware_1.validate)(serviceCategoryValidation_1.updateServiceCategorySchema), serviceCategoryController.updateCategory);
router.delete('/categories/:id', serviceCategoryController.deleteCategory);
// Service items routes
router.get('/', serviceCategoryController.getAllServices);
router.get('/:id', serviceCategoryController.getServiceById);
router.post('/', (0, validateMiddleware_1.validate)(serviceCategoryValidation_1.createServiceSchema), serviceCategoryController.createService);
router.put('/:id', (0, validateMiddleware_1.validate)(serviceCategoryValidation_1.updateServiceSchema), serviceCategoryController.updateService);
router.delete('/:id', serviceCategoryController.deleteService);
exports.default = router;
//# sourceMappingURL=serviceCategoryRoute.js.map