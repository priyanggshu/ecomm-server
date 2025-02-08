import express from "express";
import { createProductController, deleteProductController, getProductController, getProductsController, updateProductController } from "../controllers/products.controller";
import { admin, protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/', getProductsController);
router.get('/:id', getProductController);
router.post('/', protect, admin, createProductController);
router.put('/:id', protect, admin, updateProductController);
router.delete('/:id', protect, admin, deleteProductController);

export default router;