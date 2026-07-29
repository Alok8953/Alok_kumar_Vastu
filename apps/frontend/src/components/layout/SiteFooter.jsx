import { PhoneContactLink } from "../PhoneContactLink.jsx";

export function SiteFooter({ onOpenAbout, onOpenServices }) {  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <h3>Alok Kumar Mishra - Vastu Consultant</h3>
          <p>
            Precision-driven Astro-Vastu guidance for clarity, stability, and growth through
            structured correction.
          </p>
        </section>
        <section>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <button type="button" className="footer-drawer-link" onClick={onOpenAbout}>
                About
              </button>
            </li>
            <li>
              <button type="button" className="footer-drawer-link" onClick={onOpenServices}>
                Services
              </button>
            </li>
            <li>
              <a href="#process">How It Works</a>
            </li>
            <li>
              <a href="#testimonials">Clients Feedback</a>
            </li>
            <li>
              <a href="#positioning">Our Approach</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </section>
        <section>
          <h4>Contact</h4>
          <ul>
            <li>
              <PhoneContactLink />
            </li>
            <li>Service Area — Pan India</li>
          </ul>
        </section>
      </div>
      <p className="copyright">© 2026 Alok Kumar Mishra. All rights reserved.</p>
    </footer>
  );
}
