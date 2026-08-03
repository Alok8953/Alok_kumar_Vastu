import { useCallback, useEffect, useRef, useState } from "react";
import { apiRequest } from "../lib/apiRequest.js";

export function usePublishedReviews() {
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const load = useCallback(async ({ clearOnError = false } = {}) => {
    try {
      const data = await apiRequest("/api/reviews/published");
      if (mountedRef.current) {
        setPublished(Array.isArray(data.reviews) ? data.reviews : []);
      }
    } catch {
      if (clearOnError && mountedRef.current) setPublished([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load({ clearOnError: true });

    const intervalId = window.setInterval(() => load(), 10_000);
    const refreshOnFocus = () => load();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") load();
    };

    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      mountedRef.current = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [load]);

  return { published, loading };
}
