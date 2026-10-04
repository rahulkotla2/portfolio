"use client";

import { motion, AnimatePresence } from "framer-motion";

export function MobileToast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-20 left-4 right-4 z-[70] rounded-xl bg-black/85 px-4 py-3 text-center text-[13px] text-white backdrop-blur-md"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
