"use client";

/** Android 14 / Nothing OS status bar */
export function NothingStatusBar({
  time,
  ink = "light",
  background = "transparent",
}: {
  time: string;
  ink?: "light" | "dark";
  background?: string;
}) {
  const color = ink === "dark" ? "#1F1F1F" : "#FFFFFF";

  return (
    <div
      className="relative z-[60] flex h-[28px] shrink-0 items-center justify-between px-[22px] pt-1"
      style={{ color, backgroundColor: background, fontFamily: "var(--font-roboto), Roboto, sans-serif" }}
    >
      <span className="text-[13px] font-medium tabular-nums tracking-[0.01em]">{time}</span>
      <div className="flex items-center gap-[5px]">
        <AndroidSignal />
        <AndroidWifi />
        <AndroidBattery />
      </div>
    </div>
  );
}

function AndroidSignal() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
      <rect x="0" y="8" width="2.5" height="4" rx="0.5" opacity="0.35" />
      <rect x="4" y="6" width="2.5" height="6" rx="0.5" opacity="0.55" />
      <rect x="8" y="3" width="2.5" height="9" rx="0.5" opacity="0.75" />
      <rect x="12" y="0" width="2.5" height="12" rx="0.5" />
    </svg>
  );
}

function AndroidWifi() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
      <path
        d="M8 10.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z"
        fill="currentColor"
      />
      <path
        d="M4.8 7.8a4.5 4.5 0 0 1 6.4 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M2 5.2a8 8 0 0 1 12 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function AndroidBattery() {
  return (
    <svg width="22" height="11" viewBox="0 0 22 11" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="2" y="2" width="13" height="7" rx="1" fill="currentColor" />
      <path d="M20 3.5v4a1.5 1.5 0 0 0 0-4z" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}
