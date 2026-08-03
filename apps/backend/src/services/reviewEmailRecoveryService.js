import {
  listPendingReviewEmails,
  markReviewEmailFailed,
  markReviewEmailSent
} from "../repositories/reviewRepository.js";
import {
  isEmailConfigured,
  sendReviewEmail
} from "./emailService.js";

export async function retryPendingReviewEmails() {
  if (!isEmailConfigured()) return;

  const pending = await listPendingReviewEmails();
  for (const review of pending) {
    try {
      await sendReviewEmail({
        fullName: review.full_name,
        city: review.city,
        rating: review.rating,
        reviewText: review.review_text,
        approveToken: review.approve_token,
        phone: review.phone,
        email: review.email
      });
      await markReviewEmailSent(review.id);
      console.log(`Recovered pending review email (id=${review.id})`);
    } catch (error) {
      await markReviewEmailFailed(review.id, error.message);
      console.error(`Pending review email retry failed (id=${review.id}):`, error.message);
    }
  }
}
