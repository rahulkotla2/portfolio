"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { NOTHING, nothingSpring } from "./theme";

interface NothingAppFrameProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

export function NothingAppFrame({ title, onBack, children }: NothingAppFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={nothingSpring}
      className="absolute inset-0 z-40 flex flex-col bg-black"
    >
      {/* App header — Nothing OS */}
      <div className="shrink-0" style={{ backgroundColor: NOTHING.surface }}>
        <div className="h-[2px] w-full" style={{ backgroundColor: NOTHING.red }} />
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: `1px solid ${NOTHING.border}` }}
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: NOTHING.card }}
            aria-label="Back"
          >
            <ChevronLeft size={20} className="text-white" />
          </motion.button>
          <div>
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: NOTHING.textDim }}>
              Nothing OS
            </p>
          </div>
        </div>
      </div>

      <div className="nothing-app-content min-h-0 flex-1 overflow-hidden">{children}</div>
    </motion.div>
  );
}
