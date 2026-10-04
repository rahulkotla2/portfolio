"use client";

import { motion } from "framer-motion";
import { nothingSpring } from "../nothing/theme";

/** Slide-up container — each app brings its own branded chrome */
export function MobileAppShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={nothingSpring}
      className="absolute inset-0 z-40 flex flex-col overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
