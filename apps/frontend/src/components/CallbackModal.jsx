import { useEffect, useRef, useState } from "react";
import { postApi } from "../lib/postApi.js";
import {
  CONSULTATION_METHODS,
  CONSULTATION_METHOD_PHONE,
  CONSULTATION_METHOD_WHATSAPP,
  INITIAL_FORM,
  isValidPhoneDigits,
  PHONE_DIGIT_LIMIT,
  PRIMARY_CONCERNS,
  PROPERTY_TYPES,
  REFERRAL_SOURCES,
  sanitizePhoneDigits,
  TIME_SLOTS
} from "../constants/callbackFormOptions.js";

function phoneValidationMessage(label) {
  return `${label} must be exactly ${PHONE_DIGIT_LIMIT} digits.`;
}

function validateForm(form) {
  const errors = [];
  if (!form.fullName.trim()) errors.push("Full Name is required.");
  if (!form.mobile.trim()) errors.push("Mobile Number is required.");
  else if (!isValidPhoneDigits(form.mobile)) {
    errors.push(phoneValidationMessage("Mobile number"));
  }
  if (
    form.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  ) {
    errors.push("Enter a valid email address.");
  }
  if (
    form.consultationContactNumber.trim() &&
    !isValidPhoneDigits(form.consultationContactNumber)
  ) {
    errors.push(
      form.consultationMethod === CONSULTATION_METHOD_PHONE
        ? phoneValidationMessage("Phone number for callback")
        : phoneValidationMessage("WhatsApp number")
    );
  }
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
  const [pendingPropertyType, setPendingPropertyType] = useState(null);
  const firstInputRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      setForm(INITIAL_FORM);
      setStatus("idle");
      setErrorMsg("");
      setPendingPropertyType(null);
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
    const nextValue =
      name === "mobile" || name === "consultationContactNumber"
        ? sanitizePhoneDigits(value)
        : value;
    setForm((prev) => {
      const next = { ...prev, [name]: nextValue };
      if (name === "mobile" && prev.useSameMobileForContact) {
        next.consultationContactNumber = nextValue;
      }
      if (name === "consultationContactNumber") {
        next.useSameMobileForContact = false;
      }
      return next;
    });
  }

  function handleSameAsMobileToggle(checked) {
    setForm((prev) => ({
      ...prev,
      useSameMobileForContact: checked,
      consultationContactNumber: checked ? sanitizePhoneDigits(prev.mobile) : prev.consultationContactNumber
    }));
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

  function handlePropertyTypeToggle(type) {
    setForm((prev) => {
      const exists = prev.propertyTypes.includes(type);
      if (exists) {
        return {
          ...prev,
          propertyTypes: prev.propertyTypes.filter((t) => t !== type)
        };
      }
      if (prev.propertyTypes.length === 1) {
        setPendingPropertyType(type);
        return prev;
      }
      return {
        ...prev,
        propertyTypes: [...prev.propertyTypes, type]
      };
    });
  }

  function confirmMultiProperty() {
    if (!pendingPropertyType) return;
    setForm((prev) => ({
      ...prev,
      propertyTypes: [...prev.propertyTypes, pendingPropertyType]
    }));
    setPendingPropertyType(null);
  }

  function cancelMultiProperty() {
    setPendingPropertyType(null);
  }

  function handleConsultationMethodChange(e) {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      consultationMethod: value,
      consultationContactNumber: "",
      useSameMobileForContact: false
    }));
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
      propertyTypes: form.propertyTypes,
      primaryConcerns: form.primaryConcerns,
      concernDetail: form.concernDetail.trim() || null,
      propertyLocation: form.propertyLocation.trim() || null,
      hasFloorPlan: form.hasFloorPlan === "" ? null : form.hasFloorPlan === "yes",
      preferredTimeSlot: form.preferredTimeSlot || null,
      consultationMethod: form.consultationMethod || null,
      consultationContactNumber: form.consultationContactNumber.trim() || null,
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
                    inputMode="numeric"
                    maxLength={PHONE_DIGIT_LIMIT}
                    value={form.mobile}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
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

              <OptionGroup legend="Property Type (select one or more)">
                <div className="option-grid">
                  {PROPERTY_TYPES.map((type) => (
                    <CheckboxOption
                      key={type}
                      value={type}
                      label={type}
                      checked={form.propertyTypes.includes(type)}
                      onChange={() => handlePropertyTypeToggle(type)}
                    />
                  ))}
                </div>
              </OptionGroup>

              {pendingPropertyType ? (
                <div
                  className="confirm-dialog"
                  role="alertdialog"
                  aria-labelledby="multi-property-title"
                  aria-describedby="multi-property-desc"
                >
                  <p id="multi-property-title" className="confirm-dialog-title">
                    Are you sure you want Vastu consultation for more than one property?
                  </p>
                  <p id="multi-property-desc" className="confirm-dialog-sub">
                    You selected multiple property types. Confirm to proceed with this selection.
                  </p>
                  <div className="confirm-dialog-actions">
                    <button type="button" className="btn btn-outline" onClick={cancelMultiProperty}>
                      No
                    </button>
                    <button type="button" className="btn btn-primary" onClick={confirmMultiProperty}>
                      Yes
                    </button>
                  </div>
                </div>
              ) : null}

              <OptionGroup legend="What is your primary concern?">
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
                  Please describe your concern in detail
                </label>
                <textarea
                  id="cb-concernDetail"
                  name="concernDetail"
                  rows={4}
                  value={form.concernDetail}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cb-propertyLocation">
                  Property Location (City &amp; State)
                </label>
                <input
                  id="cb-propertyLocation"
                  name="propertyLocation"
                  type="text"
                  value={form.propertyLocation}
                  onChange={handleChange}
                />
              </div>

              <OptionGroup legend="Do you have a Floor Plan / Layout of the Property?">
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

              <OptionGroup legend="Preferred Time for Callback">
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

              <OptionGroup legend="Preferred Consultation Method">
                <div className="option-row">
                  {CONSULTATION_METHODS.map((method) => (
                    <RadioOption
                      key={method}
                      name="consultationMethod"
                      value={method}
                      label={method}
                      checked={form.consultationMethod === method}
                      onChange={handleConsultationMethodChange}
                    />
                  ))}
                </div>
              </OptionGroup>

              {form.consultationMethod === CONSULTATION_METHOD_PHONE ? (
                <div className="form-group">
                  <label htmlFor="cb-consultationPhone">
                    Phone Number for Callback
                  </label>
                  <label className="same-as-above">
                    <input
                      type="checkbox"
                      checked={form.useSameMobileForContact}
                      onChange={(e) => handleSameAsMobileToggle(e.target.checked)}
                      disabled={!isValidPhoneDigits(form.mobile)}
                    />
                    <span>Same as above</span>
                  </label>
                  <input
                    id="cb-consultationPhone"
                    name="consultationContactNumber"
                    type="tel"
                    inputMode="numeric"
                    maxLength={PHONE_DIGIT_LIMIT}
                    value={form.consultationContactNumber}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="10-digit phone number"
                    readOnly={form.useSameMobileForContact}
                  />
                </div>
              ) : null}

              {form.consultationMethod === CONSULTATION_METHOD_WHATSAPP ? (
                <div className="form-group">
                  <label htmlFor="cb-consultationWhatsApp">
                    WhatsApp Number
                  </label>
                  <label className="same-as-above">
                    <input
                      type="checkbox"
                      checked={form.useSameMobileForContact}
                      onChange={(e) => handleSameAsMobileToggle(e.target.checked)}
                      disabled={!isValidPhoneDigits(form.mobile)}
                    />
                    <span>Same as above</span>
                  </label>
                  <input
                    id="cb-consultationWhatsApp"
                    name="consultationContactNumber"
                    type="tel"
                    inputMode="numeric"
                    maxLength={PHONE_DIGIT_LIMIT}
                    value={form.consultationContactNumber}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="10-digit WhatsApp number"
                    readOnly={form.useSameMobileForContact}
                  />
                </div>
              ) : null}

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
