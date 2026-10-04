"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDesktopStore } from "@/store/desktop-store";
import { profile } from "@/data/portfolio";
import { RecruiterLink } from "@/components/shared/RecruiterLink";
import { WallpaperLayer } from "./WallpaperLayer";

export function LockScreen() {
  const unlockLockScreen = useDesktopStore((s) => s.unlockLockScreen);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      );
      setDate(
        now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = useCallback(() => {
    if (signingIn) return;
    setSigningIn(true);
    setTimeout(() => unlockLockScreen(), 900);
  }, [signingIn, unlockLockScreen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleUnlock();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleUnlock]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <WallpaperLayer overlay="lock" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-light tracking-tight text-white drop-shadow-lg sm:text-7xl"
        >
          {time}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-lg text-white/80 drop-shadow"
        >
          {date}
        </motion.p>
      </div>

      <div className="relative z-10 flex flex-col items-center pb-16">
        <motion.button
          type="button"
          onClick={handleUnlock}
          disabled={signingIn}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group flex flex-col items-center gap-3 rounded-xl p-4 transition-colors hover:bg-white/10"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-win-accent to-blue-500 text-2xl font-bold text-win-bg shadow-xl ring-2 ring-white/30 transition-transform group-hover:scale-105">
            RK
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-white drop-shadow">{profile.name}</p>
            <p className="text-sm text-white/70">
            {signingIn ? "Signing in..." : "Click or press Enter to sign in"}
            </p>
          </div>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-xs text-white/50"
        >
          Portfolio OS · rahulkotla.in
        </motion.p>

        <RecruiterLink
          className="relative z-20 mt-4 text-xs text-white/60 underline-offset-2 hover:text-win-accent hover:underline"
        >
          Recruiter? Quick view →
        </RecruiterLink>
      </div>
    </motion.div>
  );
}
