"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesktopStore } from "@/store/desktop-store";

const BOOT_SEQUENCE = [
  { text: "Starting Portfolio OS...", delay: 0 },
  { text: "Loading kernel modules...", delay: 400 },
  { text: "Mounting /rahul-kotla/portfolio...", delay: 800 },
  { text: "Initializing VS Code, Explorer, Terminal...", delay: 1200 },
  { text: "Welcome, Rahul Kotla", delay: 1600 },
];

export function BootScreen() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const completeBoot = useDesktopStore((s) => s.completeBoot);

  useEffect(() => {
    const timers = BOOT_SEQUENCE.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );
    const skipTimer = setTimeout(() => setShowSkip(true), 600);
    const doneTimer = setTimeout(() => completeBoot(), 2200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(skipTimer);
      clearTimeout(doneTimer);
    };
  }, [completeBoot]);

  const handleSkip = () => completeBoot();

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black font-mono"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-lg px-8">
        {BOOT_SEQUENCE.slice(0, visibleLines).map((line, i) => (
          <motion.p
            key={line.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-1 text-sm text-green-400/90"
          >
            [{new Date().toLocaleTimeString()}] {line.text}
          </motion.p>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="mt-2 inline-block h-4 w-2 bg-green-400"
        />
      </div>

      <AnimatePresence>
        {showSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={handleSkip}
            className="absolute bottom-8 text-xs text-win-muted transition-colors hover:text-win-accent"
          >
            Press to skip →
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
