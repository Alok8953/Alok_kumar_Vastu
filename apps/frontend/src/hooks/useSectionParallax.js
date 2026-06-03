import { useCallback, useEffect, useRef, useState } from "react";

export function useSectionParallax(sectionRef) {
  const revealedLocked = useRef(false);
  const [state, setState] = useState({
    inView: false,
    revealed: false,
    scrollProgress: 0,
    mouseX: 0,
    mouseY: 0
  });

  const reveal = useCallback(() => {
    revealedLocked.current = true;
    setState((s) => ({ ...s, revealed: true }));
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;

    const updateScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const inView = rect.top < vh * 0.82 && rect.bottom > vh * 0.15;
      const travel = vh * 0.65 + rect.height * 0.35;
      const scrolled = vh * 0.55 - rect.top;
      const scrollProgress = Math.min(1, Math.max(0, scrolled / travel));

      let revealed = revealedLocked.current;
      if (!revealed && inView && scrollProgress > 0.32) {
        revealed = true;
        revealedLocked.current = true;
      }

      setState((s) => ({
        ...s,
        inView,
        revealed,
        scrollProgress
      }));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateScroll);
    };

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      const mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (!revealedLocked.current) {
        revealedLocked.current = true;
      }

      setState((s) => ({
        ...s,
        inView: true,
        revealed: true,
        mouseX,
        mouseY
      }));
    };

    const onLeave = () => {
      setState((s) => ({ ...s, mouseX: 0, mouseY: 0 }));
    };

    const onTouch = () => {
      if (!revealedLocked.current) {
        revealedLocked.current = true;
      }
      setState((s) => ({ ...s, inView: true, revealed: true }));
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onTouch);
    };
  }, [sectionRef]);

  return { ...state, reveal };
}
