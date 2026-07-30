import { useEffect } from "react";
import { lockBodyScroll } from "../lib/bodyScrollLock.js";

export function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    return lockBodyScroll();
  }, [active]);
}
