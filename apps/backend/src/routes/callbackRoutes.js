import { Router } from "express";
import { callbackController } from "../controllers/callbackController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.post("/callback", asyncHandler(callbackController));

export default router;
