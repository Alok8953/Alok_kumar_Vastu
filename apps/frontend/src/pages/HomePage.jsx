import { WHATSAPP_URL } from "../constants/contact.js";
import { WhatsAppGlyph } from "../components/WhatsAppIcon.jsx";
import { CTA_BUTTON_LABEL, HERO_FOCUS_AREAS } from "../constants/siteContent.js";
import { ParallaxRevealSection } from "../components/ParallaxRevealSection.jsx";
import { CredentialsBanner } from "../components/sections/CredentialsBanner";
import { FrameworkLayerCards } from "../components/sections/FrameworkLayerCards.jsx";
import { SpecializedServiceCards } from "../components/sections/SpecializedServiceCards.jsx";
import { WhyDifferentiatorCards } from "../components/sections/WhyDifferentiatorCards.jsx";
import { TestimonialsContent } from "../components/sections/TestimonialsSection.jsx";

export function HomePage({ onOpenModal, onOpenServices, onOpenReview }) {
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
                {HERO_FOCUS_AREAS.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div className="cta-row" id="book">
                <button className="btn btn-primary" onClick={onOpenModal}>
                  {CTA_BUTTON_LABEL}
                </button>
                <button type="button" className="btn btn-outline" onClick={onOpenServices}>
                  Explore Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ParallaxRevealSection
        id="framework"
        className="parallax-section--compact"
        kicker="Core Framework"
        title="Three layers. One clear system."
        footer={
          <div className="highlight-strip highlight-strip--compact">
            Align all three → results become <strong>predictable</strong>.
          </div>
        }
      >
        <FrameworkLayerCards />
      </ParallaxRevealSection>

      <ParallaxRevealSection
        id="specialized"
        className="parallax-section--compact"
        kicker="Specialized Services"
        title="Specialized Vastu & Energy Services"
      >
        <SpecializedServiceCards />
      </ParallaxRevealSection>

      <ParallaxRevealSection
        id="why"
        className="parallax-section--compact"
        kicker="Why This Works"
        title="Five key differentiators"
      >
        <WhyDifferentiatorCards />
      </ParallaxRevealSection>

      <ParallaxRevealSection
        id="testimonials"
        className="parallax-section--compact"
        kicker="Real Results"
        title="Clients Feedback"
        intro="Homes & offices transformed after alignment."
      >
        <TestimonialsContent onOpenReview={onOpenReview} />
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
            <a
              className="whatsapp-cta"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Now"
              title="WhatsApp Now"
            >
              <WhatsAppGlyph size={22} className="whatsapp-cta-icon" />
              <span className="whatsapp-cta-label">WhatsApp Now</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
