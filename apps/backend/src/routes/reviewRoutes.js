import { Router } from "express";
import { reviewController } from "../controllers/reviewController.js";
import {
  sendReviewOtpController,
  verifyReviewOtpController
} from "../controllers/reviewOtpController.js";
import { publishedReviewsController } from "../controllers/publishedReviewsController.js";
import {
  approveReviewEmailController,
  rejectReviewEmailController
} from "../controllers/emailReviewActionController.js";

const router = Router();

router.get("/reviews/approve-email", approveReviewEmailController);
router.get("/reviews/reject-email", rejectReviewEmailController);
router.get("/reviews/published", publishedReviewsController);
router.post("/reviews/otp/send", sendReviewOtpController);
router.post("/reviews/otp/verify", verifyReviewOtpController);
router.post("/reviews", reviewController);

export default router;
