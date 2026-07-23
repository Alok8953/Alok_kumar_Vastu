import { Accordion } from "../Accordion.jsx";
import { buildProcessAccordionItems } from "../../lib/accordionContent.jsx";

export function ConsultationProcessContent() {
  return <Accordion className="accordion--process" items={buildProcessAccordionItems()} />;
}
