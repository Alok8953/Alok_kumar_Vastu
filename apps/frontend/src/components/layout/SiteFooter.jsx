import { PHONE_DISPLAY } from "../../constants/contact.js";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <h3>Alok Kumar Mishra - Vastu Consultant</h3>
          <p>Precision-driven Astro-Vastu guidance for clarity, stability, and growth through structured correction.</p>
        </section>
        <section>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#process">How It Works</a></li>
            <li><a href="#testimonials">Success Stories</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </section>
        <section>
          <h4>Services</h4>
          <ul>
            <li>Personal Guidance</li>
            <li>Career & Growth</li>
            <li>Relationships</li>
            <li>Business & Prosperity</li>
          </ul>
        </section>
        <section>
          <h4>Contact</h4>
          <ul>
            <li>Phone: {PHONE_DISPLAY}</li>
            <li>Location: India</li>
          </ul>
        </section>
      </div>
      <p className="copyright">© 2026 Alok Kumar Mishra. All rights reserved.</p>
    </footer>
  );
}
