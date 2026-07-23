import { Accordion } from "../Accordion.jsx";
import { buildAboutAccordionItems } from "../../lib/accordionContent.jsx";

export function AboutContent() {
  return <Accordion items={buildAboutAccordionItems()} />;
}
