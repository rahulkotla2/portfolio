"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useDesktopStore } from "@/store/desktop-store";
import { TASKBAR_HEIGHT, type AppId } from "@/types/desktop";
import { Code2, FolderOpen, Terminal, LayoutGrid } from "lucide-react";
import { StartMenu } from "./StartMenu";
import { SystemTray } from "./SystemTray";

const appIcons: Record<AppId, React.ReactNode> = {
  vscode: <Code2 size={18} />,
  explorer: <FolderOpen size={18} />,
  terminal: <Terminal size={18} />,
  widgets: <LayoutGrid size={18} />,
};

const taskbarApps: { id: AppId; label: string }[] = [
  { id: "vscode", label: "VS Code — README" },
  { id: "explorer", label: "File Explorer — Projects" },
  { id: "terminal", label: "Windows Terminal" },
  { id: "widgets", label: "Widgets — Skills" },
];

export function Taskbar() {
  const {
    windows,
    activeWindowId,
    openApp,
    restoreWindow,
    minimizeWindow,
    toggleStartMenu,
    startMenuOpen,
    setTaskbarIconCenter,
  } = useDesktopStore();
  const startBtnRef = useRef<HTMLButtonElement>(null);
  const iconRefs = useRef<Partial<Record<AppId, HTMLButtonElement | null>>>({});
  const [startAnchorLeft, setStartAnchorLeft] = useState(12);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const updateIconPositions = useCallback(() => {
    const desktop = document.getElementById("desktop-surface");
    if (!desktop) return;
    const dRect = desktop.getBoundingClientRect();
    taskbarApps.forEach(({ id }) => {
      const el = iconRefs.current[id];
      if (!el) return;
      const r = el.getBoundingClientRect();
      setTaskbarIconCenter(id, r.left + r.width / 2 - dRect.left, r.top + r.height / 2 - dRect.top);
    });
  }, [setTaskbarIconCenter]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateIconPositions();
    const onMeasure = () => updateIconPositions();
    window.addEventListener("resize", onMeasure);
    window.addEventListener("taskbar-measure", onMeasure);
    return () => {
      window.removeEventListener("resize", onMeasure);
      window.removeEventListener("taskbar-measure", onMeasure);
    };
  }, [updateIconPositions, startMenuOpen, windows.length]);

  useEffect(() => {
    if (startMenuOpen && startBtnRef.current) {
      const rect = startBtnRef.current.getBoundingClientRect();
      setStartAnchorLeft(rect.left);
    }
  }, [startMenuOpen]);

  const isAppOpen = (appId: AppId) => windows.some((w) => w.appId === appId);
  const isAppActive = (appId: AppId) =>
    windows.some((w) => w.appId === appId && w.id === activeWindowId && !w.minimized);

  const handleAppClick = (appId: AppId) => {
    const win = windows.find((w) => w.appId === appId);
    if (!win) {
      openApp(appId, { center: true });
    } else if (win.minimized || activeWindowId !== win.id) {
      restoreWindow(win.id, false);
    } else {
      minimizeWindow(win.id);
    }
  };

  return (
    <>
      <StartMenu anchorLeft={startAnchorLeft} />
      <div
        className="relative z-[200] flex shrink-0 items-center justify-center border-t border-win-border bg-win-taskbar/95 backdrop-blur-xl"
        style={{ height: TASKBAR_HEIGHT }}
      >
        <div className="flex items-center gap-1 rounded-lg px-2">
          <button
            ref={startBtnRef}
            type="button"
            onClick={toggleStartMenu}
            aria-label="Start menu"
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              startMenuOpen ? "bg-win-accent/20 text-win-accent" : "hover:bg-win-hover text-win-text"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
          </button>

          {taskbarApps.map(({ id: appId, label }) => {
            const open = isAppOpen(appId);
            const active = isAppActive(appId);
            return (
              <button
                key={appId}
                ref={(el) => {
                  iconRefs.current[appId] = el;
                }}
                type="button"
                onClick={() => handleAppClick(appId)}
                aria-label={label}
                title={label}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  active
                    ? "bg-win-accent/15 text-win-accent"
                    : open
                      ? "text-win-text hover:bg-win-hover"
                      : "text-win-muted hover:bg-win-hover hover:text-win-text"
                }`}
              >
                {appIcons[appId]}
                {open && (
                  <span
                    className={`absolute bottom-1 h-0.5 rounded-full transition-all ${
                      active ? "w-4 bg-win-accent" : "w-1 bg-win-muted"
                    }`}
                  />
                )}
                {open && (
                  <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-[300] hidden w-40 -translate-x-1/2 rounded-lg border border-win-border bg-win-surface/95 px-2 py-2 text-center text-[11px] text-win-text shadow-window group-hover:block">
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <SystemTray time={time} date={date} />
      </div>
    </>
  );
}
