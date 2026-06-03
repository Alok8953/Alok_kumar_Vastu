import { Accordion } from "../Accordion.jsx";
import { ParallaxRevealSection } from "../ParallaxRevealSection.jsx";
import { buildProcessAccordionItems } from "../../lib/accordionContent.jsx";

export function ConsultationProcessSection() {
  return (
    <ParallaxRevealSection
      id="process"
      kicker="How It Works"
      title="How Consultation Works"
      intro="A clear, step-by-step process from booking to follow-up so you always know what happens next."
    >
      <Accordion className="accordion--process" items={buildProcessAccordionItems()} />
    </ParallaxRevealSection>
  );
}
