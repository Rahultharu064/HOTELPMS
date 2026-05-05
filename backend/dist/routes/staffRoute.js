"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staffManagementController_1 = require("../controllers/staffManagementController");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const controller = new staffManagementController_1.StaffManagementController();
// Only Superadmins or Admins can manage staff
router.use(adminAuthMiddleware_1.authenticateAdmin);
router.use((0, adminAuthMiddleware_1.authorizeRoles)('superadmin', 'admin'));
const createStaffSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Name is too short"),
        email: zod_1.z.string().email("Invalid email address"),
        phoneNumber: zod_1.z.string().optional(),
        role: zod_1.z.enum(['front_office', 'housekeeping', 'manager'], {
            errorMap: () => ({ message: "Invalid role selected" })
        })
    })
});
router.post('/', (0, validateMiddleware_1.validate)(createStaffSchema), controller.createStaff);
router.get('/', controller.getAllStaff);
router.patch('/:id/status', controller.toggleStatus);
exports.default = router;
//# sourceMappingURL=staffRoute.js.map