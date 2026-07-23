import { useEffect } from "react";
import { ServicesContent } from "./sections/ServicesSection.jsx";

export function ServicesDrawer({ isOpen, onClose }) {
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
        aria-label="Close services panel"
        onClick={onClose}
      />
      <aside
        className="side-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="services-drawer-title"
      >
        <div className="side-drawer-inner">
          <header className="side-drawer-header">
            <button
              type="button"
              className="drawer-close"
              onClick={onClose}
              aria-label="Close"
            >
              &#x2715;
            </button>
            <p className="section-kicker">Services</p>
            <h2 id="services-drawer-title">Four core service categories</h2>
            <p className="section-intro">
              The process is designed to diagnose the root issue and deliver structured correction,
              not surface-level advice.
            </p>
          </header>
          <div className="side-drawer-body">
            <ServicesContent />
          </div>
        </div>
      </aside>
    </div>
  );
}
