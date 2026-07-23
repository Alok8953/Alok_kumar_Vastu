import { useEffect, useId, useState } from "react";

function ChevronIcon() {
  return (
    <svg className="footer-collapsible-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FooterCollapsible({ id, kicker, title, intro, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    function syncFromHash() {
      if (window.location.hash === `#${id}`) {
        setIsOpen(true);
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [id]);

  return (
    <section
      id={id}
      className={`footer-collapsible${isOpen ? " is-open" : ""}`}
    >
      <div className="container">
        <button
          type="button"
          className="footer-collapsible-trigger"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="footer-collapsible-trigger-text">
            {kicker ? <span className="footer-collapsible-kicker">{kicker}</span> : null}
            <span className="footer-collapsible-title">{title}</span>
            {intro && !isOpen ? (
              <span className="footer-collapsible-hint">{intro}</span>
            ) : null}
          </span>
          <ChevronIcon />
        </button>

        {isOpen ? (
          <div id={panelId} className="footer-collapsible-panel">
            {intro && isOpen ? <p className="footer-collapsible-intro">{intro}</p> : null}
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
