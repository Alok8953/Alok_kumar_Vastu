import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { postApi } from "../lib/postApi.js";

const INITIAL_FORM = {
  fullName: "",
  countryCode: "+91",
  phone: "",
  email: "",
  city: "",
  rating: "",
  reviewText: ""
};

const COUNTRY_OPTIONS = [
  { code: "+91", label: "India", digits: 10, pattern: /^[6-9]\d{9}$/, placeholder: "10-digit mobile" },
  { code: "+1", label: "US/Canada", digits: 10, pattern: /^\d{10}$/, placeholder: "10-digit number" },
  { code: "+44", label: "UK", digits: 10, pattern: /^\d{10}$/, placeholder: "10-digit number" },
  { code: "+61", label: "Australia", digits: 9, pattern: /^\d{9}$/, placeholder: "9-digit number" },
  { code: "+971", label: "UAE", digits: 9, pattern: /^\d{9}$/, placeholder: "9-digit number" },
  { code: "+65", label: "Singapore", digits: 8, pattern: /^\d{8}$/, placeholder: "8-digit number" }
];

function getCountryOption(countryCode) {
  return COUNTRY_OPTIONS.find((option) => option.code === countryCode) || COUNTRY_OPTIONS[0];
}

function createSubmissionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `review-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function submitReviewWithRetry(payload) {
  const retryDelays = [0, 1500, 4000];
  let lastError;

  for (const delay of retryDelays) {
    if (delay) await wait(delay);
    try {
      return await postApi("/api/reviews", payload);
    } catch (error) {
      lastError = error;
      if (!error?.isTransient) throw error;
    }
  }

  throw lastError;
}

function validateForm(form) {
  const errors = [];
  if (!form.fullName.trim()) errors.push("Your name is required.");

  const country = getCountryOption(form.countryCode);
  const phone = form.phone.replace(/\D/g, "");
  if (!country.pattern.test(phone)) {
    errors.push(`Enter a valid ${country.digits}-digit mobile number for ${country.label}.`);
  }

  const email = form.email.trim();
  if (!email) errors.push("Email is required.");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Enter a valid email address.");
  }

  const rating = Number(form.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push("Please select a star rating.");
  }
  if (!form.reviewText.trim()) errors.push("Please write your experience.");
  else if (form.reviewText.trim().length < 20) {
    errors.push("Review must be at least 20 characters.");
  }
  return errors;
}

export function ReviewModal({ isOpen, onClose, onSubmitted }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const firstInputRef = useRef(null);
  const overlayRef = useRef(null);
  const submissionIdRef = useRef(createSubmissionId());

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      setForm(INITIAL_FORM);
      setStatus("idle");
      setErrorMsg("");
      setHoverRating(0);
      submissionIdRef.current = createSubmissionId();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "countryCode") {
        const country = getCountryOption(value);
        return {
          ...prev,
          countryCode: country.code,
          phone: prev.phone.replace(/\D/g, "").slice(0, country.digits)
        };
      }
      if (name === "phone") {
        const country = getCountryOption(prev.countryCode);
        return {
          ...prev,
          phone: value.replace(/\D/g, "").slice(0, country.digits)
        };
      }
      return { ...prev, [name]: value };
    });
  }

  function setRating(value) {
    setForm((prev) => ({ ...prev, rating: String(value) }));
  }

  const activeRating = hoverRating || Number(form.rating) || 0;

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validateForm(form);
    if (errors.length > 0) {
      setStatus("error");
      setErrorMsg(errors.join(" "));
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      await submitReviewWithRetry({
        submissionId: submissionIdRef.current,
        fullName: form.fullName.trim(),
        countryCode: form.countryCode,
        phone: form.phone,
        email: form.email.trim(),
        city: form.city.trim() || null,
        rating: Number(form.rating),
        reviewText: form.reviewText.trim()
      });

      setStatus("success");
      onSubmitted?.();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.message ||
          "We could not submit your feedback right now. Please try again in a moment."
      );
    }
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &#x2715;
        </button>

        {status === "success" ? (
          <div className="modal-success">
            <div className="modal-success-icon">&#10003;</div>
            <h2>Thank you!</h2>
            <p>Your experience has been submitted. Thank you!</p>
            <button className="btn btn-primary" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="modal-kicker">Share Your Story</p>
            <h2 id="review-modal-title">Share Your Experience</h2>
            <p className="modal-lead">Please enter your mobile number and email with your feedback.</p>
            {status === "error" && <p className="form-error">{errorMsg}</p>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="review-name">
                  Your Name <span className="required-mark">*</span>
                </label>
                <input
                  id="review-name"
                  name="fullName"
                  type="text"
                  ref={firstInputRef}
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="review-phone">
                  Mobile Number <span className="required-mark">*</span>
                </label>
                <div className="phone-input-group">
                  <select
                    className="phone-country-select"
                    id="review-country-code"
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                    aria-label="Country code"
                  >
                    {COUNTRY_OPTIONS.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} {country.label}
                      </option>
                    ))}
                  </select>
                  <input
                    id="review-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={getCountryOption(form.countryCode).digits}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={getCountryOption(form.countryCode).placeholder}
                    autoComplete="tel-national"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="review-email">
                  Email Address <span className="required-mark">*</span>
                </label>
                <input
                  id="review-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="review-city">City (optional)</label>
                <input
                  id="review-city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                />
              </div>

              <div className="form-group">
                <span className="form-label" id="review-rating-label">
                  Rating <span className="required-mark">*</span>
                </span>
                <div
                  className="star-rating"
                  role="radiogroup"
                  aria-labelledby="review-rating-label"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`star-rating-btn${value <= activeRating ? " is-active" : ""}`}
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      onFocus={() => setHoverRating(value)}
                      onBlur={() => setHoverRating(0)}
                      aria-label={`Rate ${value} out of 5 stars`}
                      aria-checked={form.rating === String(value)}
                      role="radio"
                    >
                      ★
                    </button>
                  ))}
                </div>
                {form.rating ? (
                  <p className="star-rating-hint">{form.rating} out of 5</p>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="review-text">
                  Your Experience <span className="required-mark">*</span>
                </label>
                <textarea
                  id="review-text"
                  name="reviewText"
                  rows={5}
                  value={form.reviewText}
                  onChange={handleChange}
                  placeholder="Share what changed for you after the consultation (minimum 20 characters)..."
                  required
                />
              </div>

              <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
