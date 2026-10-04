"use client";

import { useRef } from "react";
import { NOTHING } from "./theme";

interface NothingPhoneFrameProps {
  children: React.ReactNode;
  onHome?: () => void;
  onRecents?: () => void;
  barTone?: "light" | "dark";
  barBg?: string;
}

/** Nothing Phone 2–style device chassis */
export function NothingPhoneFrame({
  children,
  onHome,
  onRecents,
  barTone = "light",
  barBg = "transparent",
}: NothingPhoneFrameProps) {
  const pillClass =
    barTone === "dark"
      ? "bg-black/35 active:bg-black/55"
      : "bg-white/35 active:bg-white/55";

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#050505] p-0 sm:p-4">
      <div
        className="relative flex h-dvh w-full max-w-[100vw] flex-col overflow-hidden max-sm:pt-[env(safe-area-inset-top)] max-sm:pb-[env(safe-area-inset-bottom)] sm:h-[min(844px,calc(100dvh-32px))] sm:max-w-[390px] sm:rounded-[44px] sm:border-[3px]"
        style={{
          backgroundColor: NOTHING.black,
          borderColor: "#1f1f1f",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 24px 80px rgba(0,0,0,0.8)",
        }}
      >
        <div className="absolute -left-[3px] top-28 hidden h-8 w-[3px] rounded-l bg-[#2a2a2a] sm:block" />
        <div className="absolute -left-[3px] top-44 hidden h-14 w-[3px] rounded-l bg-[#2a2a2a] sm:block" />
        <div className="absolute -right-[3px] top-36 hidden h-12 w-[3px] rounded-r bg-[#2a2a2a] sm:block" />

        {children}

        <div
          className="relative z-30 flex shrink-0 justify-center pb-[10px] pt-[6px]"
          style={{ backgroundColor: barBg }}
        >
          {onHome || onRecents ? (
            <GesturePill className={pillClass} onHome={onHome} onRecents={onRecents} />
          ) : (
            <div className={`h-[5px] w-[120px] rounded-full ${barTone === "dark" ? "bg-black/25" : "bg-white/25"}`} />
          )}
        </div>
      </div>
    </div>
  );
}

function GesturePill({
  className,
  onHome,
  onRecents,
}: {
  className: string;
  onHome?: () => void;
  onRecents?: () => void;
}) {
  const startY = useRef(0);
  const swiped = useRef(false);

  return (
    <button
      type="button"
      aria-label="Home. Swipe up for recents"
      className={`h-[5px] w-[120px] touch-none rounded-full transition-colors ${className}`}
      onPointerDown={(e) => {
        startY.current = e.clientY;
        swiped.current = false;
        (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (startY.current - e.clientY > 48) swiped.current = true;
      }}
      onPointerUp={() => {
        if (swiped.current && onRecents) onRecents();
        else onHome?.();
      }}
    />
  );
}
