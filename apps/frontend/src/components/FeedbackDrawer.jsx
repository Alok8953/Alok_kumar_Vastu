import { useEffect } from "react";
import { TestimonialsContent } from "./sections/TestimonialsSection.jsx";

export function FeedbackDrawer({ isOpen, onClose, onOpenReview }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="drawer-root">
      <button
        type="button"
        className="drawer-backdrop"
        aria-label="Close feedback panel"
        onClick={onClose}
      />
      <aside
        className="side-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-drawer-title"
      >
        <div className="side-drawer-inner">
          <header className="side-drawer-header">
            <button type="button" className="drawer-close" onClick={onClose} aria-label="Close">
              &#x2715;
            </button>
            <p className="section-kicker">Real Results</p>
            <h2 id="feedback-drawer-title">Clients Feedback</h2>
            <p className="section-intro">
              Homes &amp; offices transformed after alignment.
            </p>
          </header>
          <div className="side-drawer-body">
            <TestimonialsContent onOpenReview={onOpenReview} />
          </div>
        </div>
      </aside>
    </div>
  );
}
