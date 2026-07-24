/** 10-digit Indian mobile (no +91 prefix here). */
const PHONE_DIGITS = "6394222876";

export const PHONE_NUMBER = `+91${PHONE_DIGITS}`;
export const PHONE_DISPLAY = `+91 ${PHONE_DIGITS.slice(0, 5)} ${PHONE_DIGITS.slice(5)}`;

const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I would like to know more about Vastu consultation.";

export const WHATSAPP_URL = `https://wa.me/91${PHONE_DIGITS}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;
