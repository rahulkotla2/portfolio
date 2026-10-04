"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { DotMatrixText } from "./DotMatrixText";
import { nothingSpring } from "./theme";
import { NothingWallpaper } from "./NothingWallpaper";
import { profile } from "@/data/portfolio";

interface NothingLockScreenProps {
  time: string;
  date: string;
  onUnlock: () => void;
}

export function NothingLockScreen({ time, date, onUnlock }: NothingLockScreenProps) {
  const [unlocking, setUnlocking] = useState(false);
  const dragY = useMotionValue(0);
  const hintOpacity = useTransform(dragY, [-100, 0], [0, 1]);

  const triggerUnlock = () => {
    if (unlocking) return;
    setUnlocking(true);
    setTimeout(onUnlock, 480);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -60 || info.velocity.y < -350) triggerUnlock();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col bg-black"
      animate={unlocking ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
    >
      <NothingWallpaper dim={0.35} />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Clock — upper third, Nothing NDot-style matrix */}
        <div className="flex flex-col items-center pt-[12%]">
          <DotMatrixText text={time} dotSize={7} gap={3} charGap={20} blinkColon />
          <p
            className="mt-6 text-[15px] font-normal tracking-[0.01em] text-white/70"
            style={{ fontFamily: "var(--font-roboto), Roboto, sans-serif" }}
          >
            {date}
          </p>
        </div>

        {/* Notification peek */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, ...nothingSpring }}
          className="mx-5 mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white">
              RK
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className="truncate text-[14px] font-medium text-white"
                  style={{ fontFamily: "var(--font-roboto), Roboto, sans-serif" }}
                >
                  Portfolio OS
                </p>
                <span className="shrink-0 text-[11px] text-white/40">now</span>
              </div>
              <p
                className="mt-0.5 text-[13px] leading-snug text-white/55"
                style={{ fontFamily: "var(--font-roboto), Roboto, sans-serif" }}
              >
                {profile.name} · {profile.role}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex-1" />

        {/* Swipe up — Nothing thin bar */}
        <motion.div
          drag="y"
          dragConstraints={{ top: -140, bottom: 0 }}
          dragElastic={0.12}
          style={{ y: dragY }}
          onDragEnd={handleDragEnd}
          onClick={triggerUnlock}
          className="flex cursor-grab flex-col items-center pb-10 pt-6 active:cursor-grabbing"
        >
          <motion.div
            style={{ opacity: hintOpacity }}
            className="mb-4 h-[5px] w-[134px] rounded-full bg-white/40"
          />
          <motion.p
            animate={{ opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="text-[11px] font-normal text-white/35"
            style={{ fontFamily: "var(--font-roboto), Roboto, sans-serif" }}
          >
            Swipe up to unlock
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
