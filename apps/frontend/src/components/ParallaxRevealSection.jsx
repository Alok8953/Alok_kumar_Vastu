import { useRef } from "react";
import { useSectionParallax } from "../hooks/useSectionParallax.js";

function ExploreHint({ onReveal }) {
  return (
    <button type="button" className="parallax-explore-hint" onClick={onReveal}>
      <span className="parallax-explore-label">Move cursor or scroll to explore</span>
      <span className="parallax-explore-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

/**
 * Section with scroll/mouse parallax — heading visible first, content reveals on interaction.
 */
export function ParallaxRevealSection({
  id,
  className = "",
  kicker,
  title,
  intro,
  children,
  footer = null
}) {
  const sectionRef = useRef(null);
  const { inView, revealed, scrollProgress, mouseX, mouseY, reveal } =
    useSectionParallax(sectionRef);

  const sectionClass = [
    "section",
    "panel",
    "parallax-section",
    className,
    inView ? "is-inview" : "",
    revealed ? "is-revealed" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={sectionRef}
      id={id}
      className={sectionClass}
      style={{
        "--scroll-p": scrollProgress,
        "--mouse-x": mouseX,
        "--mouse-y": mouseY
      }}
    >
      <div className="parallax-section-bg" aria-hidden="true">
        <span className="parallax-orb parallax-orb--1" />
        <span className="parallax-orb parallax-orb--2" />
      </div>

      <div className="container parallax-section-inner">
        <header
          className="parallax-section-header"
          style={{
            transform: `translate3d(${mouseX * 14}px, ${mouseY * 10 + (1 - scrollProgress) * -24}px, 0)`
          }}
        >
          {kicker ? <p className="section-kicker">{kicker}</p> : null}
          <h2>{title}</h2>
        </header>

        {!revealed && inView ? <ExploreHint onReveal={reveal} /> : null}

        <div className="parallax-section-reveal">
          <div className="parallax-section-reveal-inner">
            {intro ? <p className="section-intro">{intro}</p> : null}
            {children}
            {footer}
          </div>
        </div>
      </div>
    </section>
  );
}
