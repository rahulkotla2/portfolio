"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDesktopStore } from "@/store/desktop-store";
import { X } from "lucide-react";

const STEPS = [
  {
    title: "Welcome to my Portfolio OS",
    body: "This desktop is my interactive portfolio. Everything runs like Windows — open apps, resize windows, and explore.",
  },
  {
    title: "Explore Projects",
    body: "Click the folder icon in the taskbar to open File Explorer. Browse EdTech & FinTech case studies with full breakdowns.",
  },
  {
    title: "Quick Search",
    body: "Press Ctrl+K anytime to search apps, projects, and commands. Try Terminal for contact info and easter eggs!",
  },
];

export function GuidedTour() {
  const { tourStep, nextTourStep, setTourStep } = useDesktopStore();

  if (tourStep === null) return null;

  const step = STEPS[tourStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[700] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-md rounded-xl border border-win-border bg-win-surface p-6 shadow-2xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs text-win-accent">
              Step {tourStep + 1} of {STEPS.length}
            </span>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem("portfolio-tour-complete", "1");
                setTourStep(null);
              }}
              className="text-win-muted hover:text-win-text"
              aria-label="Skip tour"
            >
              <X size={16} />
            </button>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-win-text">{step.title}</h2>
          <p className="mb-6 text-sm leading-relaxed text-win-muted">{step.body}</p>
          <div className="flex gap-2">
            {tourStep > 0 && (
              <button
                type="button"
                onClick={() => setTourStep(tourStep - 1)}
                className="rounded-lg border border-win-border px-4 py-2 text-xs text-win-muted hover:bg-win-hover"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={nextTourStep}
              className="flex-1 rounded-lg bg-win-accent px-4 py-2 text-xs font-medium text-win-bg hover:bg-win-accent/90"
            >
              {tourStep >= STEPS.length - 1 ? "Get Started" : "Next"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
