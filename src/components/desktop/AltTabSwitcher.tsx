"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDesktopStore } from "@/store/desktop-store";
import { APPS } from "@/types/desktop";
import { Code2, FolderOpen, Terminal, LayoutGrid } from "lucide-react";

const icons = {
  vscode: Code2,
  explorer: FolderOpen,
  terminal: Terminal,
  widgets: LayoutGrid,
};

export function AltTabSwitcher() {
  const { altTabOpen, altTabIndex, windows, closeAltTab } = useDesktopStore();

  const visible = windows
    .filter((w) => !w.minimized && !w.isClosing)
    .sort((a, b) => b.zIndex - a.zIndex);

  if (!altTabOpen || visible.length < 2) return null;

  const selected = visible[altTabIndex % visible.length];
  const Icon = selected ? icons[selected.appId] : Code2;

  return (
    <>
      <div className="fixed inset-0 z-[600] bg-black/40 backdrop-blur-sm" onClick={closeAltTab} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed left-1/2 top-1/2 z-[601] w-[min(480px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl mica-panel p-6 shadow-2xl"
      >
        <p className="mb-4 text-center text-xs text-win-muted">Alt + Tab — release to switch</p>
        <div className="flex justify-center gap-3">
          {visible.map((win, i) => {
            const WinIcon = icons[win.appId];
            const active = win.id === selected?.id;
            return (
              <div
                key={win.id}
                className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${
                  active ? "bg-win-accent/20 ring-2 ring-win-accent" : "bg-win-surface opacity-60"
                }`}
              >
                <WinIcon size={28} className={active ? "text-win-accent" : "text-win-muted"} />
                <span className="max-w-[80px] truncate text-[10px]">{APPS[win.appId].title.split("—")[0]}</span>
              </div>
            );
          })}
        </div>
        {selected && (
          <p className="mt-4 text-center text-sm text-win-text">
            <Icon size={14} className="mr-1 inline text-win-accent" />
            {selected.title}
          </p>
        )}
      </motion.div>
    </>
  );
}
