import { useEffect, useState } from "react";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { FooterExpandableBand } from "../components/layout/FooterExpandableBand";
import { HomePage } from "../pages/HomePage";
import { AdminReviewsPage } from "../pages/AdminReviewsPage";
import { CallbackModal } from "../components/CallbackModal";
import { ReviewModal } from "../components/ReviewModal";
import { ServicesDrawer } from "../components/ServicesDrawer";
import { AboutDrawer } from "../components/AboutDrawer";
import { WhatsAppButton } from "../components/WhatsAppButton";
import {
  clearDrawerHash,
  getDrawerFromHash,
  getHashId,
  isDrawerHash,
  setHash
} from "../lib/hashRouting.js";

const navItems = [
  { href: "#home", label: "Home" },
  { type: "about", label: "About" },
  { type: "services", label: "Services" },
  { href: "#contact", label: "Contact" }
];

function getAdminRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash === "admin/reviews" ? "admin/reviews" : null;
}

export function App() {
  const [adminRoute, setAdminRoute] = useState(() => getAdminRoute());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(() => getDrawerFromHash());

  useEffect(() => {
    function syncHashRoute() {
      setAdminRoute(getAdminRoute());

      const drawerId = getDrawerFromHash();
      setActiveDrawer(drawerId);

      if (!drawerId) {
        const hashId = getHashId();
        if (hashId) {
          requestAnimationFrame(() => {
            document.getElementById(hashId)?.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          });
        }
      }
    }

    syncHashRoute();
    window.addEventListener("hashchange", syncHashRoute);
    return () => window.removeEventListener("hashchange", syncHashRoute);
  }, []);

  function openModal() {
    setIsModalOpen(true);
    setIsMenuOpen(false);
  }

  function openReview() {
    setIsReviewOpen(true);
    setIsMenuOpen(false);
  }

  function handleOpenDrawer(id) {
    setActiveDrawer(id);
    setHash(id);
    setIsMenuOpen(false);
  }

  function closeDrawer() {
    setActiveDrawer(null);
    if (isDrawerHash()) {
      clearDrawerHash();
    }
  }

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll("main section[id], header[id], .footer-collapsible[id]")
    );
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

  function exitAdmin() {
    window.location.hash = "";
    setAdminRoute(null);
  }

  if (adminRoute === "admin/reviews") {
    return <AdminReviewsPage onExit={exitAdmin} />;
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeId={activeId}
        navItems={navItems}
        onOpenModal={openModal}
        activeDrawer={activeDrawer}
        onOpenDrawer={handleOpenDrawer}
      />
      <HomePage
        onOpenModal={openModal}
        onOpenServices={() => handleOpenDrawer("services")}
        onOpenReview={openReview}
      />
      <FooterExpandableBand />
      <SiteFooter
        onOpenAbout={() => handleOpenDrawer("about")}
        onOpenServices={() => handleOpenDrawer("services")}
      />
      <AboutDrawer isOpen={activeDrawer === "about"} onClose={closeDrawer} />
      <ServicesDrawer isOpen={activeDrawer === "services"} onClose={closeDrawer} />
      <CallbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
      <WhatsAppButton />
    </>
  );
}
