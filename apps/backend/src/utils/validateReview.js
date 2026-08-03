import { normalizeInternationalPhone } from "./phone.js";

const MIN_REVIEW_LENGTH = 20;
const MAX_REVIEW_LENGTH = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBMISSION_ID_RE = /^[a-zA-Z0-9-]{16,64}$/;

export function validateReviewBody(body) {
  const errors = [];
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const submissionId =
    typeof body?.submissionId === "string" ? body.submissionId.trim() : null;
  const city = typeof body?.city === "string" ? body.city.trim() : "";
  const reviewText = typeof body?.reviewText === "string" ? body.reviewText.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const countryCode =
    typeof body?.countryCode === "string" ? body.countryCode.trim() : "+91";
  const phone = normalizeInternationalPhone(body?.phone, countryCode);
  const rating = Number(body?.rating);

  if (!fullName) errors.push("Your name is required.");
  else if (fullName.length > 255) errors.push("Name is too long.");

  if (submissionId && !SUBMISSION_ID_RE.test(submissionId)) {
    errors.push("Invalid submission identifier.");
  }

  if (!phone) errors.push("Enter a valid mobile number for the selected country code.");

  if (!email) errors.push("Email is required.");
  else if (!EMAIL_RE.test(email) || email.length > 255) {
    errors.push("Enter a valid email address.");
  }

  if (city.length > 255) errors.push("City is too long.");

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push("Please select a rating from 1 to 5 stars.");
  }

  if (!reviewText) errors.push("Please share your experience in a few words.");
  else if (reviewText.length < MIN_REVIEW_LENGTH) {
    errors.push(`Review must be at least ${MIN_REVIEW_LENGTH} characters.`);
  } else if (reviewText.length > MAX_REVIEW_LENGTH) {
    errors.push(`Review must be under ${MAX_REVIEW_LENGTH} characters.`);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      submissionId,
      fullName,
      phone,
      email,
      city: city || null,
      rating,
      reviewText
    }
  };
}
