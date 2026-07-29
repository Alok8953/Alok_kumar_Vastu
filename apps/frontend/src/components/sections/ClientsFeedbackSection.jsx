import { useState } from "react";
import { TestimonialsContent } from "./TestimonialsSection.jsx";

/**
 * Clients Feedback — heading only until clicked, then full content.
 */
export function ClientsFeedbackSection({ onOpenReview }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="section panel clients-feedback-section" id="testimonials">
      <div className="container">
        <p className="section-kicker">Real Results</p>
        <button
          type="button"
          className={`clients-feedback-toggle${open ? " is-open" : ""}`}
          aria-expanded={open}
          aria-controls="clients-feedback-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <h2 className="clients-feedback-heading">Clients Feedback</h2>
          <span className="clients-feedback-chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {open ? (
          <div id="clients-feedback-panel" className="clients-feedback-panel">
            <p className="clients-feedback-intro">
              Homes &amp; offices transformed after alignment.
            </p>
            <TestimonialsContent onOpenReview={onOpenReview} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
