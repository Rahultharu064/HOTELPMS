import { Router } from 'express';
import { ServiceOrderController } from '../controllers/serviceOrderController';
import { validate } from '../middlewares/validateMiddleware';
import { 
  createServiceOrderSchema, 
  updateServiceOrderStatusSchema,
  getServiceOrdersSchema
} from '../validation/serviceOrderValidation';

const router = Router();
const serviceOrderController = new ServiceOrderController();

router.get('/', validate(getServiceOrdersSchema), serviceOrderController.getAllOrders);
router.get('/:id', serviceOrderController.getOrderById);
router.post('/', validate(createServiceOrderSchema), serviceOrderController.createOrder);
router.patch('/:id/status', validate(updateServiceOrderStatusSchema), serviceOrderController.updateOrderStatus);
router.delete('/:id', serviceOrderController.deleteOrder);

export default router;
