import { WHATSAPP_URL } from "../constants/contact.js";
import { WhatsAppGlyph } from "./WhatsAppIcon.jsx";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <WhatsAppGlyph className="whatsapp-float-icon" size={26} />
      <span className="whatsapp-float-label">Chat on WhatsApp</span>
    </a>
  );
}
