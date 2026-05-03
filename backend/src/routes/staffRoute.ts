import { Router } from 'express';
import { StaffManagementController } from '../controllers/staffManagementController';
import { authenticateAdmin, authorizeRoles } from '../middlewares/adminAuthMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { z } from 'zod';

const router = Router();
const controller = new StaffManagementController();

// Only Superadmins or Admins can manage staff
router.use(authenticateAdmin as any);
router.use(authorizeRoles('superadmin', 'admin') as any);

const createStaffSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().optional(),
    role: z.enum(['front_office', 'housekeeping', 'manager'], {
      errorMap: () => ({ message: "Invalid role selected" })
    })
  })
});

router.post('/', validate(createStaffSchema), controller.createStaff);
router.get('/', controller.getAllStaff);
router.patch('/:id/status', controller.toggleStatus);

export default router;
