import { CTA_BUTTON_LABEL } from "../../constants/siteContent.js";

export function SiteHeader({ isMenuOpen, setIsMenuOpen, activeId, navItems, onOpenModal }) {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <a className="brand" href="#home" aria-label="Homepage">
          <img src="/assets/vastu-compass-logo.svg" alt="" width={44} height={44} />
          <span className="brand-text">
            <span className="brand-name">Alok Kumar Mishra</span>
            <span className="brand-role">Vastu Consultant</span>
          </span>
        </a>

        <button
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="site-nav"
          aria-label="Open navigation menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`site-nav ${isMenuOpen ? "open" : ""}`} id="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeId === item.href.replace("#", "") ? "active" : ""}
              onClick={() => {
                if (window.innerWidth <= 980) {
                  setIsMenuOpen(false);
                }
              }}
            >
              {item.label}
            </a>
          ))}
          <button className="btn btn-primary nav-cta" onClick={onOpenModal}>
            {CTA_BUTTON_LABEL}
          </button>
        </nav>
      </div>
    </header>
  );
}
