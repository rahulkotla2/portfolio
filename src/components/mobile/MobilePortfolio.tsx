"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { NothingPhoneFrame } from "./nothing/NothingPhoneFrame";
import { NothingStatusBar } from "./nothing/NothingStatusBar";
import { NothingLockScreen } from "./nothing/NothingLockScreen";
import { NothingLauncher } from "./nothing/NothingLauncher";
import { NothingRecents } from "./nothing/NothingRecents";
import { MobileAppShell } from "./apps/MobileAppShell";
import { MobileAppRouter } from "./apps/MobileAppRouter";
import type { MobileAppId } from "./apps/mobile-app-config";
import { APP_STATUS_CHROME } from "./apps/mobile-app-config";
import { MobileChromeProvider, useMobileChromeOverride } from "./apps/MobileChromeContext";

type Phase = "lock" | "home" | "app" | "recents" | "split";

export function MobilePortfolio() {
  return (
    <MobileChromeProvider>
      <MobilePortfolioInner />
    </MobileChromeProvider>
  );
}

function MobilePortfolioInner() {
  const [phase, setPhase] = useState<Phase>("lock");
  const [activeApp, setActiveApp] = useState<MobileAppId | null>(null);
  const [split, setSplit] = useState<{ top: MobileAppId; bottom: MobileAppId } | null>(null);
  const [recents, setRecents] = useState<MobileAppId[]>([]);
  const [splitPending, setSplitPending] = useState<MobileAppId | null>(null);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const { override } = useMobileChromeOverride();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  const remember = (id: MobileAppId) => {
    setRecents((list) => [id, ...list.filter((x) => x !== id)].slice(0, 8));
  };

  const unlock = () => setPhase("home");

  const openApp = (id: MobileAppId) => {
    remember(id);
    setActiveApp(id);
    setSplit(null);
    setSplitPending(null);
    setPhase("app");
  };

  const goHome = () => {
    setPhase("home");
    setActiveApp(null);
    setSplit(null);
    setSplitPending(null);
  };

  const openRecents = () => {
    setPhase("recents");
  };

  const closeRecent = (id: MobileAppId) => {
    setRecents((list) => list.filter((x) => x !== id));
    if (activeApp === id) setActiveApp(null);
  };

  const onSplitPick = (id: MobileAppId) => {
    if (!splitPending) {
      setSplitPending(id);
      return;
    }
    if (splitPending === id) return;
    setSplit({ top: splitPending, bottom: id });
    remember(splitPending);
    remember(id);
    setSplitPending(null);
    setActiveApp(null);
    setPhase("split");
  };

  const displayTime = time || "00:00";
  const statusChrome =
    override ??
    (phase === "app" && activeApp
      ? APP_STATUS_CHROME[activeApp]
      : phase === "split"
        ? { ink: "light" as const, bg: "#000000" }
        : { ink: "light" as const, bg: "transparent" });

  return (
    <div className="nothing-phone">
      <NothingPhoneFrame
        onHome={phase === "lock" ? undefined : goHome}
        onRecents={phase === "lock" ? undefined : openRecents}
        barTone={statusChrome.ink}
        barBg={statusChrome.bg}
      >
        <NothingStatusBar
          time={displayTime}
          ink={statusChrome.ink}
          background={statusChrome.bg}
        />

        <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
          {phase === "lock" && (
            <NothingLockScreen time={displayTime} date={date} onUnlock={unlock} />
          )}

          {(phase === "home" || phase === "recents") && <NothingLauncher onOpenApp={openApp} />}

          <AnimatePresence>
            {phase === "app" && activeApp && (
              <MobileAppShell key={activeApp}>
                <MobileAppRouter appId={activeApp} onBack={goHome} onOpenApp={openApp} />
              </MobileAppShell>
            )}
          </AnimatePresence>

          {phase === "split" && split && (
            <div className="absolute inset-0 z-40 flex flex-col gap-1 bg-black">
              <div className="min-h-0 flex-1 overflow-hidden rounded-b-2xl">
                <MobileAppRouter appId={split.top} onBack={goHome} onOpenApp={openApp} />
              </div>
              <div className="min-h-0 flex-1 overflow-hidden rounded-t-2xl">
                <MobileAppRouter appId={split.bottom} onBack={goHome} onOpenApp={openApp} />
              </div>
            </div>
          )}

          <AnimatePresence>
            {phase === "recents" && (
              <NothingRecents
                recents={recents}
                splitPending={splitPending}
                onOpen={openApp}
                onClose={closeRecent}
                onSplitPick={onSplitPick}
                onHome={goHome}
              />
            )}
          </AnimatePresence>
        </div>
      </NothingPhoneFrame>
    </div>
  );
}
