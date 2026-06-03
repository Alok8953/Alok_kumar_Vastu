import {
  createClientReview,
  markReviewEmailFailed,
  markReviewEmailSent
} from "../repositories/reviewRepository.js";
import { sendReviewEmail, isEmailConfigured } from "../services/emailService.js";
import { validateReviewBody } from "../utils/validateReview.js";

export async function reviewController(req, res) {
  const validation = validateReviewBody(req.body);

  if (!validation.ok) {
    return res.status(400).json({ error: validation.errors.join(" ") });
  }

  const data = validation.data;
  let reviewId;
  let approveToken;

  try {
    const saved = await createClientReview(data);
    reviewId = saved.id;
    approveToken = saved.approve_token;
  } catch (err) {
    console.error("Review save error:", err.message);
    return res.status(503).json({
      error: "Could not save your review. Please try again in a moment."
    });
  }

  if (!isEmailConfigured()) {
    return res.status(200).json({
      message:
        "Thank you! Your experience has been submitted. It will be reviewed and may be published on the website.",
      id: reviewId,
      emailSent: false
    });
  }

  try {
    await sendReviewEmail({ ...data, approveToken });
    await markReviewEmailSent(reviewId);

    return res.status(200).json({
      message:
        "Thank you! Your experience has been submitted. It will be reviewed and may be published on the website.",
      id: reviewId,
      emailSent: true
    });
  } catch (err) {
    console.error("Review email error:", err.message);
    await markReviewEmailFailed(reviewId, err.message);

    return res.status(200).json({
      message:
        "Thank you! Your experience has been submitted. It will be reviewed and may be published on the website.",
      id: reviewId,
      emailSent: false
    });
  }
}
