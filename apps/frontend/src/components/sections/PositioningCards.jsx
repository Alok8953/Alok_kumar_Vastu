import { POSITIONING_POINTS } from "../../constants/siteContent.js";

export function PositioningCards() {
  return (
    <div className="service-showcase-grid service-showcase-grid--in-footer">
      {POSITIONING_POINTS.map((item, index) => (
        <article key={item.id} className="service-showcase-card">
          <div className="service-showcase-media">
            <img src={item.image} alt="" width={400} height={240} loading="lazy" decoding="async" />
            <div className="service-showcase-media-overlay" aria-hidden="true" />
            <span className="service-showcase-step">{String(index + 1).padStart(2, "0")}</span>
            <img
              className="service-showcase-logo"
              src="/assets/vastu-compass-logo.svg"
              alt=""
              width={28}
              height={28}
              aria-hidden="true"
            />
          </div>
          <div className="service-showcase-body">
            <h3 className="service-showcase-title">{item.title}</h3>
            <p className="service-showcase-tagline">{item.tagline}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
