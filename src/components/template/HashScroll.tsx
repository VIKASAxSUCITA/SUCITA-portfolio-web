"use client";

import { useEffect } from "react";
import { scrollToSection } from "@/lib/scrollToSection";

/** Scroll to hash target after navigating to home from another page */
export default function HashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      // Wait a tick for layout/images
      window.setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
}
