import { Accordion } from "../Accordion.jsx";
import { ParallaxRevealSection } from "../ParallaxRevealSection.jsx";
import { buildTestimonialAccordionItems } from "../../lib/accordionContent.jsx";
import { usePublishedReviews } from "../../hooks/usePublishedReviews.js";

export function TestimonialsSection({ onOpenReview }) {
  const { published } = usePublishedReviews();
  const accordionItems = buildTestimonialAccordionItems(published);

  return (
    <ParallaxRevealSection
      id="testimonials"
      kicker="Client Success Stories"
      title="What Clients Say After Vastu Alignment"
      intro="Real experiences from people who applied structured Astro-Vastu guidance in their homes and workplaces."
    >
      <div className="testimonials-cta-row">
        <button type="button" className="btn btn-outline" onClick={onOpenReview}>
          Share Your Experience
        </button>
        <p className="testimonials-cta-note">Had a consultation? Submit your review</p>
      </div>
      <Accordion className="accordion--testimonials" items={accordionItems} />
    </ParallaxRevealSection>
  );
}
