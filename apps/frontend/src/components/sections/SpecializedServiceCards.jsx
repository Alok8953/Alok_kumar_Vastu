import { SPECIALIZED_SERVICES } from "../../constants/siteContent.js";

export function SpecializedServiceCards() {
  return (
    <div className="service-showcase-grid">
      {SPECIALIZED_SERVICES.map((service, index) => (
        <article key={service.id} className="service-showcase-card">
          <div className="service-showcase-media">
            <img src={service.image} alt="" width={400} height={240} loading="lazy" decoding="async" />
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
            <h3 className="service-showcase-title">{service.title}</h3>
            <p className="service-showcase-tagline">{service.tagline}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
