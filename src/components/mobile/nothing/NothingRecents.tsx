"use client";

import { motion } from "framer-motion";
import { AppIcon } from "../apps/AppIcons";
import { MOBILE_APPS, type MobileAppId } from "../apps/mobile-app-config";
import { nothingSpring } from "./theme";

interface NothingRecentsProps {
  recents: MobileAppId[];
  splitPending: MobileAppId | null;
  onOpen: (id: MobileAppId) => void;
  onClose: (id: MobileAppId) => void;
  onSplitPick: (id: MobileAppId) => void;
  onHome: () => void;
}

export function NothingRecents({
  recents,
  splitPending,
  onOpen,
  onClose,
  onSplitPick,
  onHome,
}: NothingRecentsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-black/75 px-4 pb-4 pt-6 backdrop-blur-xl"
    >
      <p
        className="mb-4 text-center text-[13px] text-white/55"
        style={{ fontFamily: "var(--font-roboto), Roboto, sans-serif" }}
      >
        {splitPending ? `Split with ${MOBILE_APPS[splitPending].label} — tap another app` : "Recents"}
      </p>

      {recents.length === 0 ? (
        <p className="mt-20 text-center text-[15px] text-white/40">No recent apps</p>
      ) : (
        <div className="nothing-scroll flex flex-1 flex-col gap-4 overflow-y-auto">
          {recents.map((id, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, ...nothingSpring }}
              className="overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.08]"
            >
              <button type="button" onClick={() => onOpen(id)} className="flex w-full items-center gap-3 px-4 py-3">
                <AppIcon appId={id} size={40} />
                <span className="flex-1 text-left text-[15px] text-white">{MOBILE_APPS[id].label}</span>
              </button>
              <div
                className="h-28 bg-gradient-to-br from-white/10 to-black/40"
                onClick={() => onOpen(id)}
                role="presentation"
              />
              <div className="flex border-t border-white/10">
                <button
                  type="button"
                  onClick={() => onClose(id)}
                  className="flex-1 py-2.5 text-[13px] text-white/60"
                >
                  Close
                </button>
                {recents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onSplitPick(id)}
                    className="flex-1 border-l border-white/10 py-2.5 text-[13px] text-white/80"
                  >
                    Split
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onHome}
        className="mt-3 rounded-full bg-white/15 py-2.5 text-[14px] text-white"
      >
        Home
      </button>
    </motion.div>
  );
}
