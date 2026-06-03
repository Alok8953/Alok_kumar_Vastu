import { useEffect, useRef, useState } from "react";
import { postApi } from "../lib/postApi.js";

const INITIAL_FORM = {
  fullName: "",
  city: "",
  rating: "",
  reviewText: ""
};

function validateForm(form) {
  const errors = [];
  if (!form.fullName.trim()) errors.push("Your name is required.");
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

export function ReviewModal({ isOpen, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const firstInputRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setForm(INITIAL_FORM);
      setStatus("idle");
      setErrorMsg("");
      setHoverRating(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
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
    setForm((prev) => ({ ...prev, [name]: value }));
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
      await postApi("/api/reviews", {
        fullName: form.fullName.trim(),
        city: form.city.trim() || null,
        rating: Number(form.rating),
        reviewText: form.reviewText.trim()
      });

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Could not submit review. Please try again.");
    }
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  if (!isOpen) return null;

  return (
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

              <button
                className="btn btn-primary"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
