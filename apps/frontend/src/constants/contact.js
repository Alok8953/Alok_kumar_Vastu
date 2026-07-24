/** Single source of truth — WhatsApp Business: +91 6394 222 876 */
export const PHONE_DIGITS = "6394222876";

export const WHATSAPP_INTL = `91${PHONE_DIGITS}`;

if (WHATSAPP_INTL !== "916394222876") {
  throw new Error(`WhatsApp number misconfigured: expected 916394222876, got ${WHATSAPP_INTL}`);
}

export const PHONE_NUMBER = `+${WHATSAPP_INTL}`;
export const PHONE_DISPLAY = `+91 6394 222 876`;

const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I would like to know more about Vastu consultation.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;
