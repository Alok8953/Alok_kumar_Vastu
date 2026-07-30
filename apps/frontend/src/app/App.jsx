import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { FooterExpandableBand } from "../components/layout/FooterExpandableBand";
import { HomePage } from "../pages/HomePage";
import { AdminReviewsPage } from "../pages/AdminReviewsPage";
import { CallbackModal } from "../components/CallbackModal";
import { ReviewModal } from "../components/ReviewModal";
import { ServicesDrawer } from "../components/ServicesDrawer";
import { AboutDrawer } from "../components/AboutDrawer";
import { FeedbackDrawer } from "../components/FeedbackDrawer";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock.js";
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
  { href: "#contact", label: "Contact" },
  { type: "feedback", label: "Feedback" }
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
  const isOverlayOpen = isModalOpen || isReviewOpen || activeDrawer !== null;
  const isModalOpenRef = useRef(isModalOpen);
  const isReviewOpenRef = useRef(isReviewOpen);

  useBodyScrollLock(isOverlayOpen);

  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
  }, [isModalOpen]);

  useEffect(() => {
    isReviewOpenRef.current = isReviewOpen;
  }, [isReviewOpen]);

  useEffect(() => {
    function syncHashRoute() {
      setAdminRoute(getAdminRoute());

      const drawerId = getDrawerFromHash();
      if (drawerId && (isModalOpenRef.current || isReviewOpenRef.current)) {
        clearDrawerHash();
        setActiveDrawer(null);
      } else {
        setActiveDrawer(drawerId);
      }

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
    closeDrawer();
    setIsReviewOpen(false);
    setIsModalOpen(true);
    setIsMenuOpen(false);
  }

  function openReview() {
    closeDrawer();
    setIsModalOpen(false);
    setIsReviewOpen(true);
    setIsMenuOpen(false);
  }

  function openReviewFromFeedback() {
    closeDrawer();
    setIsModalOpen(false);
    setIsReviewOpen(true);
    setIsMenuOpen(false);
  }

  function handleOpenDrawer(id) {
    setIsModalOpen(false);
    setIsReviewOpen(false);
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
      />
      <FooterExpandableBand />
      <SiteFooter
        onOpenAbout={() => handleOpenDrawer("about")}
        onOpenServices={() => handleOpenDrawer("services")}
        onOpenFeedback={() => handleOpenDrawer("feedback")}
      />
      <AboutDrawer isOpen={activeDrawer === "about"} onClose={closeDrawer} />
      <ServicesDrawer isOpen={activeDrawer === "services"} onClose={closeDrawer} />
      <FeedbackDrawer
        isOpen={activeDrawer === "feedback" && !isReviewOpen}
        onClose={closeDrawer}
        onOpenReview={openReviewFromFeedback}
      />
      <CallbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSubmitted={closeDrawer}
      />
      <WhatsAppButton />
    </>
  );
}
