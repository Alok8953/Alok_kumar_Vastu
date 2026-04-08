export function SiteHeader({ isMenuOpen, setIsMenuOpen, activeId, navItems }) {
  return (
    <header className="site-header" id="home">
      <div className="container nav-wrap">
        <a className="brand" href="#home" aria-label="Homepage">
          <img src="/assets/logo-placeholder.svg" alt="Alok Kumar Mishra logo" />
          <span>Alok Kumar Mishra - Vastu Consultant</span>
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
          <a className="btn btn-primary nav-cta" href="#book">
            Book Consultation
          </a>
        </nav>
      </div>
    </header>
  );
}
