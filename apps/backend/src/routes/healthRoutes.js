import { Router } from "express";
import { healthController } from "../controllers/healthController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.get("/health", asyncHandler(healthController));

export default router;
