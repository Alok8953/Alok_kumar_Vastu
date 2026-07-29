import {
  createClientReview,
  markReviewEmailFailed,
  markReviewEmailSent
} from "../repositories/reviewRepository.js";
import { consumeAuthToken } from "../repositories/reviewOtpRepository.js";
import { sendReviewEmail, isEmailConfigured } from "../services/emailService.js";
import { normalizeIndianPhone } from "../utils/phone.js";
import { validateReviewBody } from "../utils/validateReview.js";

const SUCCESS_MESSAGE =
  "Thank you! Your experience has been submitted. It will be reviewed and may be published on the website.";

async function notifyReviewByEmail(reviewId, data, approveToken) {
  if (!isEmailConfigured()) {
    console.warn("Review saved (id=%s) but email is not configured.", reviewId);
    return;
  }

  try {
    await sendReviewEmail({ ...data, approveToken });
    await markReviewEmailSent(reviewId);
  } catch (err) {
    console.error("Review email error:", err.message);
    try {
      await markReviewEmailFailed(reviewId, err.message);
    } catch (logErr) {
      console.error("Could not log review email failure:", logErr.message);
    }
  }
}

export async function reviewController(req, res) {
  const validation = validateReviewBody(req.body);

  if (!validation.ok) {
    return res.status(400).json({ error: validation.errors.join(" ") });
  }

  const phone = normalizeIndianPhone(req.body?.phone);
  const authToken =
    typeof req.body?.authToken === "string" ? req.body.authToken.trim() : "";

  if (!phone) {
    return res.status(401).json({
      error: "Verify your mobile number with OTP before submitting feedback."
    });
  }

  let auth;
  try {
    auth = await consumeAuthToken(phone, authToken);
  } catch (err) {
    console.error("Review auth check error:", err.message);
    return res.status(503).json({ error: "Could not verify authorization. Please try again." });
  }

  if (!auth.ok) {
    return res.status(401).json({ error: auth.error });
  }

  const data = { ...validation.data, phone };
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

  void notifyReviewByEmail(reviewId, data, approveToken);

  return res.status(200).json({
    message: SUCCESS_MESSAGE,
    id: reviewId
  });
}
