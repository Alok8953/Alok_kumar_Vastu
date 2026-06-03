import { useEffect, useRef, useState } from "react";
import { postApi } from "../lib/postApi.js";
import {
  CONSULTATION_METHODS,
  INITIAL_FORM,
  PRIMARY_CONCERNS,
  PROPERTY_TYPES,
  REFERRAL_SOURCES,
  TIME_SLOTS
} from "../constants/callbackFormOptions.js";

function validateForm(form) {
  const errors = [];
  if (!form.fullName.trim()) errors.push("Full Name is required.");
  if (!form.mobile.trim()) errors.push("Mobile Number is required.");
  if (!form.propertyType) errors.push("Property Type is required.");
  if (form.primaryConcerns.length === 0) errors.push("Select at least one primary concern.");
  if (!form.concernDetail.trim()) errors.push("Please describe your concern in detail.");
  if (!form.propertyLocation.trim()) errors.push("Property Location is required.");
  if (form.hasFloorPlan === "") errors.push("Floor Plan selection is required.");
  if (!form.preferredTimeSlot) errors.push("Preferred Time for Callback is required.");
  if (!form.consultationMethod) errors.push("Preferred Consultation Method is required.");
  return errors;
}

function OptionGroup({ legend, required, children }) {
  return (
    <fieldset className="form-fieldset">
      <legend>
        {legend}
        {required && <span className="required-mark"> *</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function RadioOption({ name, value, checked, onChange, label }) {
  return (
    <label className="option-label">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

function CheckboxOption({ value, checked, onChange, label }) {
  return (
    <label className="option-label">
      <input type="checkbox" value={value} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

export function CallbackModal({ isOpen, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
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

  function handleConcernToggle(concern) {
    setForm((prev) => {
      const exists = prev.primaryConcerns.includes(concern);
      return {
        ...prev,
        primaryConcerns: exists
          ? prev.primaryConcerns.filter((c) => c !== concern)
          : [...prev.primaryConcerns, concern]
      };
    });
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

    const payload = {
      fullName: form.fullName.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim() || null,
      propertyType: form.propertyType,
      primaryConcerns: form.primaryConcerns,
      concernDetail: form.concernDetail.trim(),
      propertyLocation: form.propertyLocation.trim(),
      hasFloorPlan: form.hasFloorPlan === "yes",
      preferredTimeSlot: form.preferredTimeSlot,
      consultationMethod: form.consultationMethod,
      referralSource: form.referralSource || null
    };

    try {
      await postApi("/api/callback", payload);

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Could not send request. Please try again.");
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
      aria-labelledby="modal-title"
    >
      <div className="modal-card modal-card-wide" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &#x2715;
        </button>

        {status === "success" ? (
          <div className="modal-success">
            <div className="modal-success-icon">&#10003;</div>
            <h2>Thank you for your submission!</h2>
            <p>
              We have received your request. Our team will review your details and contact you
              during your preferred callback time.
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="modal-kicker">Free Vastu Audit</p>
            <h2 id="modal-title">Request Your Checklist PDF</h2>
            <p className="modal-sub">
              Fill in the details below to receive your free Vastu audit checklist and consultation
              callback.
            </p>

            <form className="callback-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="cb-fullName">
                  Full Name <span className="required-mark">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="cb-fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cb-mobile">
                    Mobile Number <span className="required-mark">*</span>
                  </label>
                  <input
                    id="cb-mobile"
                    name="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cb-email">Email Address</label>
                  <input
                    id="cb-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <OptionGroup legend="Property Type" required>
                <div className="option-grid">
                  {PROPERTY_TYPES.map((type) => (
                    <RadioOption
                      key={type}
                      name="propertyType"
                      value={type}
                      label={type}
                      checked={form.propertyType === type}
                      onChange={handleChange}
                    />
                  ))}
                </div>
              </OptionGroup>

              <OptionGroup legend="What is your primary concern?" required>
                <div className="option-grid">
                  {PRIMARY_CONCERNS.map((concern) => (
                    <CheckboxOption
                      key={concern}
                      value={concern}
                      label={concern}
                      checked={form.primaryConcerns.includes(concern)}
                      onChange={() => handleConcernToggle(concern)}
                    />
                  ))}
                </div>
              </OptionGroup>

              <div className="form-group">
                <label htmlFor="cb-concernDetail">
                  Please describe your concern in detail <span className="required-mark">*</span>
                </label>
                <textarea
                  id="cb-concernDetail"
                  name="concernDetail"
                  rows={4}
                  value={form.concernDetail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cb-propertyLocation">
                  Property Location (City &amp; State) <span className="required-mark">*</span>
                </label>
                <input
                  id="cb-propertyLocation"
                  name="propertyLocation"
                  type="text"
                  value={form.propertyLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              <OptionGroup legend="Do you have a Floor Plan / Layout of the Property?" required>
                <div className="option-row">
                  <RadioOption
                    name="hasFloorPlan"
                    value="yes"
                    label="Yes"
                    checked={form.hasFloorPlan === "yes"}
                    onChange={handleChange}
                  />
                  <RadioOption
                    name="hasFloorPlan"
                    value="no"
                    label="No"
                    checked={form.hasFloorPlan === "no"}
                    onChange={handleChange}
                  />
                </div>
              </OptionGroup>

              <OptionGroup legend="Preferred Time for Callback" required>
                <div className="option-grid option-grid-compact">
                  {TIME_SLOTS.map((slot) => (
                    <RadioOption
                      key={slot}
                      name="preferredTimeSlot"
                      value={slot}
                      label={slot}
                      checked={form.preferredTimeSlot === slot}
                      onChange={handleChange}
                    />
                  ))}
                </div>
              </OptionGroup>

              <OptionGroup legend="Preferred Consultation Method" required>
                <div className="option-row">
                  {CONSULTATION_METHODS.map((method) => (
                    <RadioOption
                      key={method}
                      name="consultationMethod"
                      value={method}
                      label={method}
                      checked={form.consultationMethod === method}
                      onChange={handleChange}
                    />
                  ))}
                </div>
              </OptionGroup>

              <OptionGroup legend="How did you hear about us?">
                <div className="option-grid option-grid-compact">
                  {REFERRAL_SOURCES.map((source) => (
                    <RadioOption
                      key={source}
                      name="referralSource"
                      value={source}
                      label={source}
                      checked={form.referralSource === source}
                      onChange={handleChange}
                    />
                  ))}
                </div>
              </OptionGroup>

              {status === "error" && <p className="form-error">{errorMsg}</p>}

              <button
                type="submit"
                className="btn btn-primary form-submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Submitting…" : "Book My Free Callback"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
