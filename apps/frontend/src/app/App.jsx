import { useEffect, useState } from "react";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { HomePage } from "../pages/HomePage";
import { AdminReviewsPage } from "../pages/AdminReviewsPage";
import { CallbackModal } from "../components/CallbackModal";
import { ReviewModal } from "../components/ReviewModal";
import { WhatsAppButton } from "../components/WhatsAppButton";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Stories" },
  { href: "#contact", label: "Contact" }
];

function getAdminRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash === "admin/reviews" ? "admin/reviews" : null;
}

export function App() {
  const [adminRoute, setAdminRoute] = useState(getAdminRoute);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    function onHashChange() {
      setAdminRoute(getAdminRoute());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function openModal() {
    setIsModalOpen(true);
    setIsMenuOpen(false);
  }

  function openReview() {
    setIsReviewOpen(true);
    setIsMenuOpen(false);
  }

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
      />
      <HomePage onOpenModal={openModal} onOpenReview={openReview} />
      <SiteFooter />
      <CallbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
      <WhatsAppButton />
    </>
  );
}
