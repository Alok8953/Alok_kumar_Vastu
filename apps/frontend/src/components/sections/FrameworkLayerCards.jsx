import { FRAMEWORK_LAYERS } from "../../constants/siteContent.js";

export function FrameworkLayerCards() {
  return (
    <div className="framework-cards">
      {FRAMEWORK_LAYERS.map((layer) => (
        <article key={layer.id} className="framework-card">
          <div className="framework-card-top">
            <span className="framework-card-step">{layer.step}</span>
            <div className="framework-card-heading">
              <h3 className="framework-card-title">{layer.title}</h3>
              <p className="framework-card-tagline">{layer.tagline}</p>
            </div>
          </div>
          <ul className="framework-card-points">
            {layer.bullets.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
