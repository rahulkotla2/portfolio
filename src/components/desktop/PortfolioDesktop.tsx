"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useDesktopStore } from "@/store/desktop-store";
import { useOsShell } from "@/hooks/useOsShell";
import { LockScreen } from "./LockScreen";
import { BootScreen } from "./BootScreen";
import { Desktop } from "./Desktop";
import { Taskbar } from "./Taskbar";
import { MobilePortfolio } from "@/components/mobile/MobilePortfolio";
import { AltTabSwitcher } from "./AltTabSwitcher";
import { NotificationCenter } from "./NotificationCenter";
import { GuidedTour } from "./GuidedTour";
import { DesktopContextMenu } from "./DesktopContextMenu";
import { CaseStudyOverlay } from "./CaseStudyOverlay";

export function PortfolioDesktop() {
  const shell = useOsShell();
  const lockScreenUnlocked = useDesktopStore((s) => s.lockScreenUnlocked);
  const bootComplete = useDesktopStore((s) => s.bootComplete);
  const openApp = useDesktopStore((s) => s.openApp);
  const toggleStartMenu = useDesktopStore((s) => s.toggleStartMenu);
  const closeStartMenu = useDesktopStore((s) => s.closeStartMenu);
  const altTabOpen = useDesktopStore((s) => s.altTabOpen);
  const openAltTab = useDesktopStore((s) => s.openAltTab);
  const closeAltTab = useDesktopStore((s) => s.closeAltTab);
  const cycleAltTab = useDesktopStore((s) => s.cycleAltTab);
  const selectAltTab = useDesktopStore((s) => s.selectAltTab);
  const closeContextMenu = useDesktopStore((s) => s.closeContextMenu);

  const altHeld = useRef(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleStartMenu();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "1") {
        e.preventDefault();
        openApp("vscode");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "2") {
        e.preventDefault();
        openApp("explorer");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "3") {
        e.preventDefault();
        openApp("terminal");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "4") {
        e.preventDefault();
        openApp("widgets");
      }
      if (e.key === "Escape") {
        closeStartMenu();
        closeAltTab();
        closeContextMenu();
      }

      if (e.key === "Alt") altHeld.current = true;

      if (e.key === "Tab" && e.altKey) {
        e.preventDefault();
        if (altTabOpen) cycleAltTab(e.shiftKey ? -1 : 1);
        else openAltTab();
      }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Alt" && altTabOpen) {
        selectAltTab();
        altHeld.current = false;
      }
    };

    window.addEventListener("keydown", handler);
    window.addEventListener("keyup", keyUpHandler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [
    openApp,
    toggleStartMenu,
    closeStartMenu,
    altTabOpen,
    openAltTab,
    closeAltTab,
    cycleAltTab,
    selectAltTab,
    closeContextMenu,
  ]);

  if (!shell) {
    return <div className="min-h-dvh bg-black" aria-hidden />;
  }

  if (shell === "mobile") {
    return (
      <div className="min-h-dvh">
        <MobilePortfolio />
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AnimatePresence>
        {!lockScreenUnlocked && <LockScreen key="lock" />}
      </AnimatePresence>

      {lockScreenUnlocked && (
        <>
          <AnimatePresence>
            {!bootComplete && <BootScreen key="boot" />}
          </AnimatePresence>

          {bootComplete && (
            <>
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <Desktop />
              </div>
              <Taskbar />
              <AltTabSwitcher />
              <NotificationCenter />
              <GuidedTour />
              <DesktopContextMenu />
              <CaseStudyOverlay />
            </>
          )}
        </>
      )}
    </div>
  );
}
