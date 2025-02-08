import express from "express";
import { loginController, profileController, signupController } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/profile', protect, profileController);

export default router;