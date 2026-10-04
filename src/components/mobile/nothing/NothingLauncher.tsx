"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AppIcon } from "../apps/AppIcons";
import {
  DOCK_APPS,
  LAUNCHER_APPS,
  MOBILE_APPS,
  type MobileAppId,
} from "../apps/mobile-app-config";
import { nothingSpring } from "./theme";
import { NothingWallpaper } from "./NothingWallpaper";

interface NothingLauncherProps {
  onOpenApp: (id: MobileAppId) => void;
}

const GRID_APPS = LAUNCHER_APPS.filter((id) => !DOCK_APPS.includes(id));

export function NothingLauncher({ onOpenApp }: NothingLauncherProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return LAUNCHER_APPS.filter((id) => MOBILE_APPS[id].label.toLowerCase().includes(q));
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col"
    >
      <NothingWallpaper />

      <div className="relative z-10 flex flex-1 flex-col px-[18px] pb-2 pt-4">
        {filtered ? (
          <div className="grid grid-cols-4 justify-items-center gap-x-[10px] gap-y-[22px]">
            {filtered.map((appId, i) => (
              <motion.button key={appId} type="button" onClick={() => onOpenApp(appId)} className="flex justify-center">
                <AppCell label={MOBILE_APPS[appId].label} icon={<AppIcon appId={appId} size={60} />} delay={i * 0.03} />
              </motion.button>
            ))}
            {filtered.length === 0 && (
              <p
                className="col-span-4 mt-8 text-center text-[14px] text-white/50"
                style={{ fontFamily: "var(--font-roboto), Roboto, sans-serif" }}
              >
                No apps match “{query.trim()}”
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-4 justify-items-center gap-x-[10px] gap-y-[22px]">
            {GRID_APPS.map((appId, i) => (
              <motion.button key={appId} type="button" onClick={() => onOpenApp(appId)} className="flex justify-center">
                <AppCell
                  label={MOBILE_APPS[appId].label}
                  icon={<AppIcon appId={appId} size={60} />}
                  delay={0.04 + i * 0.03}
                />
              </motion.button>
            ))}
          </div>
        )}

        <div className="mt-auto space-y-3">
          <label className="flex items-center gap-3 rounded-full bg-white/[0.15] px-4 py-[12px] backdrop-blur-xl">
            <GoogleG />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent text-[15px] font-normal text-white outline-none placeholder:text-white/50"
              style={{ fontFamily: "var(--font-roboto), Roboto, sans-serif" }}
              aria-label="Search apps"
            />
          </label>

          {!filtered && (
            <div className="flex items-end justify-around rounded-[28px] bg-white/[0.12] px-3 py-3 backdrop-blur-2xl">
              {DOCK_APPS.map((appId) => (
                <button
                  key={appId}
                  type="button"
                  onClick={() => onOpenApp(appId)}
                  className="flex flex-col items-center"
                  aria-label={MOBILE_APPS[appId].label}
                >
                  <AppIcon appId={appId} size={56} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AppCell({
  label,
  icon,
  accent,
  delay,
}: {
  label: string;
  icon: React.ReactNode;
  accent?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, ...nothingSpring }}
      whileTap={{ scale: 0.9 }}
      className="flex w-[72px] flex-col items-center gap-[7px]"
    >
      {icon}
      <span
        className={`w-full truncate text-center text-[12px] font-normal leading-tight drop-shadow-sm ${
          accent ? "text-[#ff6b6b]" : "text-white/80"
        }`}
        style={{ fontFamily: "var(--font-roboto), Roboto, sans-serif" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
