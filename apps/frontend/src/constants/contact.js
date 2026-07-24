/** 10-digit mobile without +91 — must match your WhatsApp Business number. */
export const PHONE_DIGITS = "6394222876";

/** Full international number for WhatsApp (91 + 10 digits, no + sign). */
export const WHATSAPP_INTL = "9163942222876";

export const PHONE_NUMBER = `+${WHATSAPP_INTL}`;
export const PHONE_DISPLAY = `+91 ${PHONE_DIGITS.slice(0, 4)} ${PHONE_DIGITS.slice(4, 7)} ${PHONE_DIGITS.slice(7)}`;

const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I would like to know more about Vastu consultation.";

/** Official WhatsApp send URL — avoids wa.me parsing issues with repeated digits. */
export const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_INTL}&text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;
