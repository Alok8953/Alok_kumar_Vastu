import { useCallback, useState } from "react";
import { PHONE_DISPLAY, PHONE_NUMBER } from "../constants/contact.js";

export function PhoneContactLink({ label = "Phone:" }) {
  const [copied, setCopied] = useState(false);

  const copyPhone = useCallback(async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(PHONE_DISPLAY);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = PHONE_DISPLAY;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }, []);

  return (
    <span className="phone-contact">
      <span className="phone-contact-label">{label}</span>
      <a className="phone-contact-call" href={`tel:${PHONE_NUMBER}`} title="Tap to call">
        {PHONE_DISPLAY}
      </a>
      <span className="phone-contact-actions" aria-live="polite">
        <button type="button" className="phone-contact-copy" onClick={copyPhone}>
          {copied ? "Copied!" : "Copy"}
        </button>
        <a className="phone-contact-call-btn" href={`tel:${PHONE_NUMBER}`}>
          Call
        </a>
      </span>
    </span>
  );
}
