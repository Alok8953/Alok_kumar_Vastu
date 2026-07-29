import { useState } from "react";
import { SPECIALIZED_SERVICES } from "../../constants/siteContent.js";

export function SpecializedServiceCards() {
  const [activeId, setActiveId] = useState(null);
  const active = SPECIALIZED_SERVICES.find((s) => s.id === activeId) || null;

  function handleSelect(id) {
    setActiveId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="specialized-interactive">
      <div className="specialized-btn-grid" role="tablist" aria-label="Specialized services">
        {SPECIALIZED_SERVICES.map((service) => {
          const isActive = activeId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="specialized-detail-panel"
              id={`tab-${service.id}`}
              className={`specialized-topic-btn${isActive ? " is-active" : ""}`}
              onClick={() => handleSelect(service.id)}
            >
              <span className="specialized-topic-btn-title">{service.title}</span>
              <span className="specialized-topic-btn-hint">{service.tagline}</span>
              <span className="specialized-topic-btn-action" aria-hidden="true">
                {isActive ? "Close" : "Open"}
              </span>
            </button>
          );
        })}
      </div>

      {active ? (
        <div
          id="specialized-detail-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="specialized-detail-panel"
        >
          <header className="specialized-detail-head">
            <p className="specialized-detail-kicker">{active.title}</p>
            <h3 className="specialized-detail-title">{active.headline}</h3>
          </header>
          <ul className="specialized-detail-list">
            {active.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="specialized-detail-empty">Tap a service above to see what it covers.</p>
      )}
    </div>
  );
}
