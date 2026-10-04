"use client";

import { motion } from "framer-motion";
import { NOTHING } from "./theme";

/** Simplified Glyph Interface strip — Nothing Phone LED aesthetic */
export function NothingGlyphLights({ active = false }: { active?: boolean }) {
  const zones = [
    { w: 4, h: 4, delay: 0 },
    { w: 6, h: 6, delay: 0.1 },
    { w: 8, h: 8, delay: 0.2, red: true },
    { w: 6, h: 6, delay: 0.3 },
    { w: 4, h: 4, delay: 0.4 },
  ];

  return (
    <div className="flex items-end justify-center gap-2 py-4">
      {zones.map((z, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: z.w,
            height: z.h,
            backgroundColor: z.red ? NOTHING.red : NOTHING.dot,
          }}
          animate={
            active
              ? { opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }
              : { opacity: [0.15, 0.5, 0.15] }
          }
          transition={{ duration: 2.5, delay: z.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
