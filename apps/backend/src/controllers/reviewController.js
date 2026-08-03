import {
  createClientReview,
  markReviewEmailFailed,
  markReviewEmailSent
} from "../repositories/reviewRepository.js";
import { sendReviewEmail, isEmailConfigured } from "../services/emailService.js";
import { validateReviewBody } from "../utils/validateReview.js";

const SUCCESS_MESSAGE =
  "Thank you! Your experience has been submitted. It will be reviewed and may be published on the website.";

async function notifyReviewByEmail(reviewId, data, approveToken) {
  if (!isEmailConfigured()) {
    console.warn("Review saved (id=%s) but email is not configured.", reviewId);
    return false;
  }

  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      await sendReviewEmail({ ...data, approveToken });
      await markReviewEmailSent(reviewId);
      return true;
    } catch (err) {
      lastError = err;
      console.error(`Review email attempt ${attempt} failed:`, err.message);
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  try {
    await markReviewEmailFailed(reviewId, lastError?.message || "Email delivery failed.");
  } catch (logErr) {
    console.error("Could not log review email failure:", logErr.message);
  }
  return false;
}

export async function reviewController(req, res) {
  const validation = validateReviewBody(req.body);

  if (!validation.ok) {
    return res.status(400).json({ error: validation.errors.join(" ") });
  }

  const data = validation.data;
  let reviewId;
  let approveToken;
  let emailAlreadySent = false;
  let notificationData;

  try {
    const saved = await createClientReview(data);
    reviewId = saved.id;
    approveToken = saved.approve_token;
    emailAlreadySent = Boolean(saved.email_sent_at);
    notificationData = {
      fullName: saved.full_name,
      city: saved.city,
      rating: saved.rating,
      reviewText: saved.review_text,
      phone: saved.phone,
      email: saved.email
    };
  } catch (err) {
    console.error("Review save error:", err.message);
    return res.status(503).json({
      error: "Could not save your review. Please try again in a moment."
    });
  }

  const emailSent =
    emailAlreadySent ||
    (await notifyReviewByEmail(reviewId, notificationData, approveToken));

  if (!emailSent) {
    return res.status(503).json({
      error: "Your review was saved, but the notification could not be sent yet."
    });
  }

  return res.status(200).json({
    message: SUCCESS_MESSAGE,
    id: reviewId,
    emailSent: true
  });
}
