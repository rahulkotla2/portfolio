"use client";

import { useEffect, useState } from "react";

export type OsShell = "mobile" | "desktop";

/**
 * Phone OS vs Windows is based on the device, not the Tailwind `md` breakpoint.
 * Handsets (coarse pointer + short side ≤ 700px) stay on mobile in landscape.
 * Mice / trackpads always get Windows, even in a narrow browser window.
 */
export function detectOsShell(): OsShell {
  if (typeof window === "undefined") return "desktop";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const shortSide = Math.min(window.innerWidth, window.innerHeight);
  return coarse && shortSide <= 700 ? "mobile" : "desktop";
}

export function useOsShell(): OsShell | null {
  const [shell, setShell] = useState<OsShell | null>(null);

  useEffect(() => {
    const compute = () => setShell(detectOsShell());
    compute();
    window.addEventListener("resize", compute);
    const coarse = window.matchMedia("(pointer: coarse)");
    coarse.addEventListener("change", compute);
    return () => {
      window.removeEventListener("resize", compute);
      coarse.removeEventListener("change", compute);
    };
  }, []);

  return shell;
}
