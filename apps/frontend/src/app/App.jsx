import { useEffect, useState } from "react";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { HomePage } from "../pages/HomePage";
import { useApiHealth } from "../features/health/useApiHealth";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#framework", label: "Framework" },
  { href: "#services", label: "Services" },
  { href: "#specialized", label: "Specialized Work" },
  { href: "#contact", label: "Contact" }
];

export function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const apiStatus = useApiHealth();

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("main section[id], header[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} activeId={activeId} navItems={navItems} />
      <HomePage apiStatus={apiStatus} />
      <SiteFooter />
    </>
  );
}
