import { Accordion } from "../Accordion.jsx";
import { buildServicesAccordionItems } from "../../lib/accordionContent.jsx";

export function ServicesContent() {
  return <Accordion items={buildServicesAccordionItems()} />;
}
