/** Normalize Indian mobile to 10 digits. Accepts +91 / 91 / 0 prefix. */
export function normalizeIndianPhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return digits;
  }
  return null;
}

const COUNTRY_PHONE_RULES = {
  "+91": /^[6-9]\d{9}$/,
  "+1": /^\d{10}$/,
  "+44": /^\d{10}$/,
  "+61": /^\d{9}$/,
  "+971": /^\d{9}$/,
  "+65": /^\d{8}$/
};

/** Validate a selected country code and return an E.164-compatible number. */
export function normalizeInternationalPhone(raw, rawCountryCode = "+91") {
  const countryCode = String(rawCountryCode || "").trim();
  const rule = COUNTRY_PHONE_RULES[countryCode];
  if (!rule) return null;

  const nationalNumber = String(raw || "").replace(/\D/g, "");
  if (!rule.test(nationalNumber)) return null;

  const normalized = `${countryCode}${nationalNumber}`;
  return normalized.length <= 16 ? normalized : null;
}

export function maskPhone(phone) {
  if (!phone || phone.length < 4) return "****";
  return `${phone.slice(0, 2)}******${phone.slice(-2)}`;
}
