import { useEffect } from "react";
import { AboutContent } from "./sections/AboutSection.jsx";

export function AboutDrawer({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
        aria-label="Close about panel"
        onClick={onClose}
      />
      <aside
        className="side-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-drawer-title"
      >
        <div className="side-drawer-inner">
          <header className="side-drawer-header">
            <button type="button" className="drawer-close" onClick={onClose} aria-label="Close">
              &#x2715;
            </button>
            <p className="section-kicker">About The Approach</p>
            <h2 id="about-drawer-title">Most Problems Are Not Random</h2>
            <p className="section-intro">
              Most problems are not random. They are structured patterns caused by wrong decisions,
              a misaligned environment, and lack of clarity.
            </p>
          </header>
          <div className="side-drawer-body">
            <AboutContent />
          </div>
        </div>
      </aside>
    </div>
  );
}
