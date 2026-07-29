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
  const [step, setStep] = useState("phone"); // phone | otp | form | success
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [debugOtp, setDebugOtp] = useState("");
  const [phoneMasked, setPhoneMasked] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
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
      setStep("phone");
      setPhone("");
      setOtp("");
      setDebugOtp("");
      setPhoneMasked("");
      setAuthToken("");
      setVerifiedPhone("");
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

  async function handleSendOtp(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    setDebugOtp("");

    try {
      const data = await postApi("/api/reviews/otp/send", { phone });
      setPhoneMasked(data.phoneMasked || "");
      if (data.debugOtp) setDebugOtp(String(data.debugOtp));
      setOtp("");
      setStep("otp");
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Could not send OTP. Please try again.");
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const data = await postApi("/api/reviews/otp/verify", { phone, otp });
      setAuthToken(data.authToken || "");
      setVerifiedPhone(data.phone || phone.replace(/\D/g, "").slice(-10));
      setStep("form");
      setStatus("idle");
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Incorrect OTP. Please try again.");
    }
  }

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
        reviewText: form.reviewText.trim(),
        phone: verifiedPhone,
        authToken
      });

      setStep("success");
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

        {step === "success" ? (
          <div className="modal-success">
            <div className="modal-success-icon">&#10003;</div>
            <h2>Thank you!</h2>
            <p>Your experience has been submitted. Thank you!</p>
            <button className="btn btn-primary" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : null}

        {step === "phone" ? (
          <>
            <p className="modal-kicker">Verify to continue</p>
            <h2 id="review-modal-title">Share Your Experience</h2>
            <p className="modal-lead">
              Enter your mobile number. We will send an OTP before you can submit feedback.
            </p>
            {status === "error" && <p className="form-error">{errorMsg}</p>}
            <form onSubmit={handleSendOtp} noValidate>
              <div className="form-group">
                <label htmlFor="review-phone">
                  Mobile Number <span className="required-mark">*</span>
                </label>
                <input
                  id="review-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  ref={firstInputRef}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit Indian mobile"
                  autoComplete="tel"
                  required
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Sending OTP…" : "Send OTP"}
              </button>
            </form>
          </>
        ) : null}

        {step === "otp" ? (
          <>
            <p className="modal-kicker">OTP verification</p>
            <h2 id="review-modal-title">Enter OTP</h2>
            <p className="modal-lead">
              OTP sent to {phoneMasked || "your number"}. Valid for 10 minutes.
            </p>
            {debugOtp ? (
              <p className="otp-debug-hint">
                Test OTP: <strong>{debugOtp}</strong>
              </p>
            ) : null}
            {status === "error" && <p className="form-error">{errorMsg}</p>}
            <form onSubmit={handleVerifyOtp} noValidate>
              <div className="form-group">
                <label htmlFor="review-otp">
                  6-digit OTP <span className="required-mark">*</span>
                </label>
                <input
                  id="review-otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  ref={firstInputRef}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  autoComplete="one-time-code"
                  required
                />
              </div>
              <div className="otp-actions">
                <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Verifying…" : "Verify & Continue"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={status === "loading"}
                  onClick={() => {
                    setStep("phone");
                    setErrorMsg("");
                    setDebugOtp("");
                    setOtp("");
                  }}
                >
                  Change number
                </button>
              </div>
            </form>
          </>
        ) : null}

        {step === "form" ? (
          <>
            <p className="modal-kicker">Share Your Story</p>
            <h2 id="review-modal-title">Share Your Experience</h2>
            <p className="modal-lead otp-verified-note">
              Verified: {verifiedPhone.slice(0, 2)}******{verifiedPhone.slice(-2)}
            </p>
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

              <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          </>
        ) : null}
      </div>
    </div>
  );
}
