import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SPECIALIZED_SERVICES } from "../../constants/siteContent.js";
import { lockBodyScroll } from "../../lib/bodyScrollLock.js";

function SpecializedServiceModal({ service, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const unlock = lockBodyScroll();

    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  return createPortal(
    <div
      className="modal-overlay specialized-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="specialized-modal-title"
    >
      <div className="specialized-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="specialized-modal-hero">
          <img src={service.image} alt="" width={120} height={72} aria-hidden="true" />
          <div className="specialized-modal-hero-glow" aria-hidden="true" />
        </div>

        <div className="specialized-modal-body">
          <div className="specialized-modal-head">
            <div className="specialized-modal-head-copy">
              <p className="modal-kicker">{service.title}</p>
              <h2 id="specialized-modal-title">{service.headline}</h2>
            </div>
            <button
              type="button"
              className="specialized-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              &#x2715;
            </button>
          </div>

          <p className="specialized-modal-tagline">{service.tagline}</p>

          <ul className="specialized-modal-list">
            {service.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function SpecializedServiceCards() {
  const [activeId, setActiveId] = useState(null);
  const active = SPECIALIZED_SERVICES.find((s) => s.id === activeId) || null;

  return (
    <>
      <div className="specialized-interactive">
        <div className="specialized-btn-grid" role="list" aria-label="Specialized services">
          {SPECIALIZED_SERVICES.map((service) => (
            <button
              key={service.id}
              type="button"
              role="listitem"
              className="specialized-topic-btn"
              onClick={() => setActiveId(service.id)}
            >
              <span className="specialized-topic-btn-title">{service.title}</span>
              <span className="specialized-topic-btn-hint">{service.tagline}</span>
              <span className="specialized-topic-btn-action" aria-hidden="true">
                View details
              </span>
            </button>
          ))}
        </div>
        <p className="specialized-detail-empty">Tap any service to explore what it covers.</p>
      </div>

      {active ? (
        <SpecializedServiceModal service={active} onClose={() => setActiveId(null)} />
      ) : null}
    </>
  );
}
