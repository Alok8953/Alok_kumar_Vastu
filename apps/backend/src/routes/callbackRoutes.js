import { Router } from "express";
import { callbackController } from "../controllers/callbackController.js";

const router = Router();

router.post("/callback", callbackController);

export default router;
