import { Router } from "express";
import {
  listAdminReviewsController,
  patchAdminReviewController
} from "../controllers/adminReviewController.js";
import { requireAdminKey } from "../middlewares/requireAdminKey.js";

const router = Router();

router.use(requireAdminKey);
router.get("/reviews", listAdminReviewsController);
router.patch("/reviews/:id", patchAdminReviewController);

export default router;
