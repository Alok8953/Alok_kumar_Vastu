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

export function maskPhone(phone) {
  if (!phone || phone.length < 4) return "****";
  return `${phone.slice(0, 2)}******${phone.slice(-2)}`;
}
