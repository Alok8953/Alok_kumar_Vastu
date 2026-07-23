import { useEffect, useState } from "react";
import { CTA_BUTTON_LABEL } from "../../constants/siteContent.js";

const DRAWER_TYPES = new Set(["about", "services"]);

export function SiteHeader({
  isMenuOpen,
  setIsMenuOpen,
  activeId,
  navItems,
  onOpenModal,
  onOpenDrawer,
  activeDrawer
}) {
  const [isOverlay, setIsOverlay] = useState(true);

  useEffect(() => {
    function syncHeaderMode() {
      setIsOverlay(window.scrollY < 72);
    }

    syncHeaderMode();
    window.addEventListener("scroll", syncHeaderMode, { passive: true });
    return () => window.removeEventListener("scroll", syncHeaderMode);
  }, []);

  const headerClassName = [
    "site-header",
    isOverlay ? "site-header--overlay" : "site-header--solid"
  ].join(" ");

  return (
    <header className={headerClassName}>
      <div className="container nav-wrap">
        <a className="brand" href="#home" aria-label="Homepage">
          <img src="/assets/vastu-compass-logo.svg" alt="" width={52} height={52} />
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
          {navItems.map((item) =>
            DRAWER_TYPES.has(item.type) ? (
              <button
                key={item.type}
                type="button"
                className={`nav-drawer-link${activeDrawer === item.type ? " active" : ""}`}
                onClick={() => {
                  onOpenDrawer(item.type);
                  if (window.innerWidth <= 980) {
                    setIsMenuOpen(false);
                  }
                }}
              >
                {item.label}
              </button>
            ) : (
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
            )
          )}
          <button className="btn btn-primary nav-cta" onClick={onOpenModal}>
            {CTA_BUTTON_LABEL}
          </button>
        </nav>
      </div>
    </header>
  );
}
