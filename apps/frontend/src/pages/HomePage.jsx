import { WHATSAPP_URL } from "../constants/contact.js";
import { CTA_BUTTON_LABEL } from "../constants/siteContent.js";
import { Accordion } from "../components/Accordion.jsx";
import { ParallaxRevealSection } from "../components/ParallaxRevealSection.jsx";
import { CredentialsBanner } from "../components/sections/CredentialsBanner";
import { TestimonialsSection } from "../components/sections/TestimonialsSection";
import { ConsultationProcessSection } from "../components/sections/ConsultationProcessSection";
import {
  buildAboutAccordionItems,
  buildFrameworkAccordionItems,
  buildPositioningAccordionItems,
  buildServicesAccordionItems,
  buildSpecializedAccordionItems,
  buildWhyAccordionItems
} from "../lib/accordionContent.jsx";

export function HomePage({ onOpenModal, onOpenReview }) {
  return (
    <main id="main-content">
      <section className="hero section panel" id="home">
        <div className="hero-frame">
          <div className="hero-media">
            <img
              className="hero-banner-img"
              src="/assets/vastu-hero-bg.jpg?v=16"
              alt="Alok Kumar Mishra — Vastu Consultant"
              width={1024}
              height={683}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="hero-content-layer">
            <div className="hero-content">
              <h1>TRANSFORM YOUR LIFE THROUGH PRECISION-DRIVEN ASTRO-VASTU GUIDANCE</h1>
              <p className="lead">"This is not prediction. This is alignment."</p>
              <p className="lead">
                Most people struggle not because of lack of effort, but because of misalignment in thinking,
                environment, and decision-making.
              </p>
              <CredentialsBanner />
              <div className="micro-grid">
                <span>Career & Financial Growth</span>
                <span>Relationships & Stability</span>
                <span>Business Direction</span>
                <span>Mental Clarity</span>
              </div>
              <div className="cta-row" id="book">
                <button className="btn btn-primary" onClick={onOpenModal}>
                  {CTA_BUTTON_LABEL}
                </button>
                <a className="btn btn-outline" href="#services">
                  Explore Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ParallaxRevealSection
        id="about"
        kicker="About The Approach"
        title="Most Problems Are Not Random"
        intro="Most problems are not random. They are structured patterns caused by wrong decisions, a misaligned environment, and lack of clarity."
        footer={
          <div className="stats-grid compact">
            <article className="stat-card">
              <h3>4+</h3>
              <p>Years</p>
            </article>
            <article className="stat-card">
              <h3>100+</h3>
              <p>Cases</p>
            </article>
            <article className="stat-card">
              <h3>98%</h3>
              <p>Success</p>
            </article>
            <article className="stat-card">
              <h3>Working Hour</h3>
              <p>9 AM to 9 PM</p>
            </article>
          </div>
        }
      >
        <Accordion items={buildAboutAccordionItems()} />
      </ParallaxRevealSection>

      <ConsultationProcessSection />

      <ParallaxRevealSection
        id="framework"
        kicker="Core Framework"
        title="Every solution is built on three layers"
        footer={
          <div className="highlight-strip">
            When these three layers align, results stop being uncertain and start becoming{" "}
            <strong>predictable</strong>.
          </div>
        }
      >
        <Accordion items={buildFrameworkAccordionItems()} />
      </ParallaxRevealSection>

      <ParallaxRevealSection
        id="services"
        kicker="Services"
        title="Four core service categories"
        intro="The process is designed to diagnose the root issue and deliver structured correction, not surface-level advice."
      >
        <Accordion items={buildServicesAccordionItems()} />
      </ParallaxRevealSection>

      <ParallaxRevealSection
        id="specialized"
        kicker="Specialized Services"
        title="Specialized Vastu & Energy Services"
      >
        <Accordion items={buildSpecializedAccordionItems()} />
      </ParallaxRevealSection>

      <TestimonialsSection onOpenReview={onOpenReview} />

      <ParallaxRevealSection id="why" kicker="Why This Works" title="Five key differentiators">
        <Accordion items={buildWhyAccordionItems()} />
      </ParallaxRevealSection>

      <ParallaxRevealSection
        id="positioning"
        kicker="Positioning"
        title="This is not astrology in the traditional sense"
        footer={
          <div className="highlight-strip">
            This is a structured system for clarity, control, and strategic life alignment.
          </div>
        }
      >
        <Accordion items={buildPositioningAccordionItems()} />
      </ParallaxRevealSection>

      <section className="cta-band section panel" id="contact">
        <div className="container cta-band-wrap">
          <div>
            <p className="section-kicker">Call To Action</p>
            <h2>The Next Step</h2>
            <p>
              If you are serious about clarity, direction, and long-term stability, take the first step
              now.
            </p>
          </div>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={onOpenModal}>
              {CTA_BUTTON_LABEL}
            </button>
            <a
              className="btn btn-outline"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
