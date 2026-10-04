"use client";

import { useEffect } from "react";

/** Unlocks global body scroll lock while recruiter route is mounted. */
export function RecruiterBodyStyles() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.add("recruiter-route");
    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;

    html.style.overflow = "auto";
    html.style.height = "auto";
    body.style.overflow = "auto";
    body.style.height = "auto";

    return () => {
      html.classList.remove("recruiter-route");
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
    };
  }, []);

  return null;
}
