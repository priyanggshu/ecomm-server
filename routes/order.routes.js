import express from "express";
import { createOrderController, deliverOrderController, fetchOrderController, fetchOrdersController, payOrderController } from "../controllers/orders.controller";
import { admin, protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/', protect ,createOrderController);
router.get('/:id', protect, fetchOrderController);
router.get('/myorders', protect, fetchOrdersController);
router.put('/:id/pay', protect, payOrderController);
router.put('/:id/deliver', protect, admin, deliverOrderController);

export default router;