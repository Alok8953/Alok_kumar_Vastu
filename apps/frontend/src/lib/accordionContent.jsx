import {
  ABOUT_POINTS,
  CONSULTATION_STEPS,
  FRAMEWORK_LAYERS,
  POSITIONING_POINTS,
  SERVICE_CATEGORIES,
  SPECIALIZED_SERVICES,
  TESTIMONIALS,
  WHY_DIFFERENTIATORS
} from "../constants/siteContent.js";

export function buildProcessAccordionItems() {
  return CONSULTATION_STEPS.map((item) => ({
    id: `process-${item.step}`,
    badge: `Step ${item.step}`,
    title: item.title,
    content: <p>{item.description}</p>
  }));
}

export function buildAboutAccordionItems() {
  return ABOUT_POINTS.map((item) => ({
    id: item.id,
    title: item.title,
    content: <p>{item.body}</p>
  }));
}

export function buildFrameworkAccordionItems() {
  return FRAMEWORK_LAYERS.map((item) => ({
    id: item.id,
    title: item.title,
    content: (
      <ul className="accordion-list">
        {item.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    )
  }));
}

export function buildServicesAccordionItems() {
  return SERVICE_CATEGORIES.map((item) => ({
    id: item.id,
    title: item.title,
    content: (
      <>
        <p>{item.body}</p>
        <p>
          <strong>Outcome:</strong> {item.outcome}
        </p>
      </>
    )
  }));
}

export function buildSpecializedAccordionItems() {
  return SPECIALIZED_SERVICES.map((item) => ({
    id: item.id,
    title: item.title,
    content: <p>{item.body}</p>
  }));
}

export function buildWhyAccordionItems() {
  return WHY_DIFFERENTIATORS.map((item) => ({
    id: item.id,
    title: item.title,
    content: <p>{item.body}</p>
  }));
}

export function buildPositioningAccordionItems() {
  return POSITIONING_POINTS.map((item) => ({
    id: item.id,
    title: item.title,
    content: <p>{item.body}</p>
  }));
}

function formatStarDisplay(rating) {
  const n = Math.min(5, Math.max(1, Number(rating) || 5));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function testimonialToAccordionItem(item) {
  const rating = item.rating ?? 5;
  return {
    id: item.id,
    title: `${item.name} — ${item.city}`,
    content: (
      <>
        <p
          className="accordion-testimonial-stars"
          aria-label={`${rating} out of 5 stars`}
        >
          {formatStarDisplay(rating)}
        </p>
        <blockquote className="accordion-testimonial-quote">&ldquo;{item.quote}&rdquo;</blockquote>
      </>
    )
  };
}

export function buildTestimonialAccordionItems(publishedReviews = []) {
  const clientItems = publishedReviews.map(testimonialToAccordionItem);
  const staticItems = TESTIMONIALS.map(testimonialToAccordionItem);
  return [...clientItems, ...staticItems];
}
