"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceOrderController_1 = require("../controllers/serviceOrderController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const serviceOrderValidation_1 = require("../validation/serviceOrderValidation");
const router = (0, express_1.Router)();
const serviceOrderController = new serviceOrderController_1.ServiceOrderController();
router.get('/', (0, validateMiddleware_1.validate)(serviceOrderValidation_1.getServiceOrdersSchema), serviceOrderController.getAllOrders);
router.get('/:id', serviceOrderController.getOrderById);
router.post('/', (0, validateMiddleware_1.validate)(serviceOrderValidation_1.createServiceOrderSchema), serviceOrderController.createOrder);
router.patch('/:id/status', (0, validateMiddleware_1.validate)(serviceOrderValidation_1.updateServiceOrderStatusSchema), serviceOrderController.updateOrderStatus);
router.delete('/:id', serviceOrderController.deleteOrder);
exports.default = router;
//# sourceMappingURL=serviceOrderRoute.js.map