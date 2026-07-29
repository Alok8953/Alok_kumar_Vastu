import { WHY_DIFFERENTIATORS } from "../../constants/siteContent.js";

export function WhyDifferentiatorCards() {
  return (
    <div className="framework-cards framework-cards--five">
      {WHY_DIFFERENTIATORS.map((item) => (
        <article key={item.id} className="framework-card">
          <h3 className="framework-card-title">{item.title}</h3>
        </article>
      ))}
    </div>
  );
}
