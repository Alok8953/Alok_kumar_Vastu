import { Accordion } from "../Accordion.jsx";
import { buildTestimonialAccordionItems } from "../../lib/accordionContent.jsx";
import { usePublishedReviews } from "../../hooks/usePublishedReviews.js";

export function TestimonialsContent({ onOpenReview }) {
  const { published } = usePublishedReviews();
  const accordionItems = buildTestimonialAccordionItems(published);

  return (
    <>
      <div className="testimonials-cta-row">
        <button type="button" className="btn btn-outline" onClick={onOpenReview}>
          Share Your Experience
        </button>
        <p className="testimonials-cta-note">
          Had a consultation? Share your feedback with mobile &amp; email
        </p>
      </div>
      <Accordion className="accordion--testimonials" items={accordionItems} />
    </>
  );
}
