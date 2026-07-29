import { FRAMEWORK_LAYERS } from "../../constants/siteContent.js";

export function FrameworkLayerCards() {
  return (
    <div className="framework-cards">
      {FRAMEWORK_LAYERS.map((layer) => (
        <article key={layer.id} className="framework-card">
          <h3 className="framework-card-title">{layer.title}</h3>
        </article>
      ))}
    </div>
  );
}
