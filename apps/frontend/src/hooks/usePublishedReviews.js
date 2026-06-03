import { useEffect, useState } from "react";
import { apiRequest } from "../lib/apiRequest.js";

export function usePublishedReviews() {
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiRequest("/api/reviews/published");
        if (!cancelled) {
          setPublished(Array.isArray(data.reviews) ? data.reviews : []);
        }
      } catch {
        if (!cancelled) {
          setPublished([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { published, loading };
}
