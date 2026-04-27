import { Router } from 'express';
import { ExtraServiceController } from '../controllers/extraServiceController';
import { validate } from '../middlewares/validateMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import { 
  createExtraServiceSchema, 
  updateExtraServiceSchema, 
  addServiceToBookingSchema,
  bookingParamsSchema,
  idParamSchema
} from '../validation/extraServiceValidation';

const router = Router();
const extraServiceController = new ExtraServiceController();

// Management Routes
router.get('/', extraServiceController.getExtraServices);
router.post('/', upload.single('image'), validate(createExtraServiceSchema), extraServiceController.createExtraService);
router.put('/:id', upload.single('image'), validate(updateExtraServiceSchema), extraServiceController.updateExtraService);
router.delete('/:id', validate(idParamSchema), extraServiceController.deleteExtraService);

// Booking Association Routes
router.get('/booking/:bookingId', validate(bookingParamsSchema), extraServiceController.getBookingExtraServices);
router.post('/booking', validate(addServiceToBookingSchema), extraServiceController.addExtraServiceToBooking);
router.delete('/booking/:id', validate(idParamSchema), extraServiceController.removeExtraServiceFromBooking);

export default router;
