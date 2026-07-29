import { useEffect, useId, useState } from "react";
import { ConsultationProcessContent } from "../sections/ConsultationProcessSection.jsx";
import { PositioningContent } from "../sections/PositioningSection.jsx";

const PRIMARY_SECTIONS = [
  {
    id: "process",
    kicker: "Step-by-Step",
    title: "How It Works",
    teaser: "Book → Survey → Report → Follow-up"
  },
  {
    id: "positioning",
    kicker: "Our Approach",
    title: "Not Traditional Astrology",
    teaser: "Structured Vastu system — not prediction"
  }
];

function ExploreCard({ section, isOpen, panelId, onToggle }) {
  return (
    <button
      type="button"
      role="tab"
      id={`tab-${section.id}`}
      aria-selected={isOpen}
      aria-controls={isOpen ? panelId : undefined}
      className={`footer-expandable-card${isOpen ? " is-active" : ""}`}
      onClick={() => onToggle(section.id)}
    >
      <span className="footer-expandable-card-body">
        <span className="footer-expandable-card-title">{section.title}</span>
        <span className="footer-expandable-card-teaser">{section.teaser}</span>
      </span>
      <span className="footer-expandable-card-action">
        {isOpen ? "Close" : "Open"}
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d={isOpen ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </button>
  );
}

/** Catchy expandable cards above the footer — easy to spot, tap to open. */
export function FooterExpandableBand() {
  const [openId, setOpenId] = useState(null);
  const panelId = useId();

  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash.replace(/^#/, "");
      if (PRIMARY_SECTIONS.some((s) => s.id === hash)) {
        setOpenId(hash);
        requestAnimationFrame(() => {
          document.getElementById("footer-explore")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        });
      }
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function toggleSection(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  const active = PRIMARY_SECTIONS.find((s) => s.id === openId);

  return (
    <section className="footer-expandable-band" id="footer-explore">
      <div className="container">
        <header className="footer-expandable-head">
          <p className="footer-expandable-eyebrow">Explore More</p>
          <h2 className="footer-expandable-heading">Everything you need before booking</h2>
          <p className="footer-expandable-sub">
            Process and our approach — pick a card below.
          </p>
        </header>

        <div
          className="footer-expandable-cards footer-expandable-cards--pair"
          role="tablist"
          aria-label="Explore sections"
        >
          {PRIMARY_SECTIONS.map((section) => (
            <ExploreCard
              key={section.id}
              section={section}
              isOpen={openId === section.id}
              panelId={panelId}
              onToggle={toggleSection}
            />
          ))}
        </div>

        {active ? (
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={`tab-${active.id}`}
            className="footer-expandable-panel"
          >
            <header className="footer-panel-banner">
              <span className="footer-panel-badge">{active.kicker}</span>
              <div className="footer-panel-banner-copy">
                <h3 className="footer-panel-banner-title">{active.title}</h3>
                <p className="footer-panel-banner-sub">{active.teaser}</p>
              </div>
            </header>
            {active.id === "process" ? <ConsultationProcessContent /> : null}
            {active.id === "positioning" ? <PositioningContent /> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
