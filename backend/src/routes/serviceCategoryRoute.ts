import { Router } from 'express';
import { ServiceCategoryController } from '../controllers/serviceCategoryController';
import { validate } from '../middlewares/validateMiddleware';
import { 
  createServiceCategorySchema, 
  updateServiceCategorySchema,
  createServiceSchema,
  updateServiceSchema
} from '../validation/serviceCategoryValidation';

const router = Router();
const serviceCategoryController = new ServiceCategoryController();

// Categories routes
router.get('/categories', serviceCategoryController.getAllCategories);
router.post('/categories', validate(createServiceCategorySchema), serviceCategoryController.createCategory);
router.put('/categories/:id', validate(updateServiceCategorySchema), serviceCategoryController.updateCategory);
router.delete('/categories/:id', serviceCategoryController.deleteCategory);

// Service items routes
router.get('/', serviceCategoryController.getAllServices);
router.get('/:id', serviceCategoryController.getServiceById);
router.post('/', validate(createServiceSchema), serviceCategoryController.createService);
router.put('/:id', validate(updateServiceSchema), serviceCategoryController.updateService);
router.delete('/:id', serviceCategoryController.deleteService);

export default router;
