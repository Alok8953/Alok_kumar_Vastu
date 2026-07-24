/** 10-digit mobile without +91 — must match your WhatsApp Business number. */
export const PHONE_DIGITS = "6394222876";

/** Built from digits so country code cannot get an extra digit (91 + 10 digits = 12). */
export const WHATSAPP_INTL = `91${PHONE_DIGITS}`;

export const PHONE_NUMBER = `+${WHATSAPP_INTL}`;
export const PHONE_DISPLAY = `+91 ${PHONE_DIGITS.slice(0, 4)} ${PHONE_DIGITS.slice(4, 7)} ${PHONE_DIGITS.slice(7)}`;

const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I would like to know more about Vastu consultation.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;
