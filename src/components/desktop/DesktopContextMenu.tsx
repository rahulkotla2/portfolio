"use client";

import { useEffect, useState } from "react";
import { useDesktopStore } from "@/store/desktop-store";
import { FolderOpen, Code2, Terminal, RefreshCw, LayoutGrid, ImageIcon, ChevronRight } from "lucide-react";
import { WALLPAPER_PRESETS, saveWallpaper, getSavedWallpaperId } from "@/lib/wallpaper";

export function DesktopContextMenu() {
  const { contextMenu, closeContextMenu, openApp, toggleStartMenu } = useDesktopStore();
  const [showWallpapers, setShowWallpapers] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [activeId, setActiveId] = useState(getSavedWallpaperId());

  useEffect(() => {
    if (!contextMenu) return;
    setShowWallpapers(false);
    setActiveId(getSavedWallpaperId());
    const handler = () => closeContextMenu();
    window.addEventListener("click", handler);
    window.addEventListener("scroll", handler);
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("scroll", handler);
    };
  }, [contextMenu, closeContextMenu]);

  if (!contextMenu) return null;

  const items = [
    { label: "Open VS Code", icon: Code2, action: () => openApp("vscode", { center: true }) },
    { label: "Open Projects", icon: FolderOpen, action: () => openApp("explorer", { center: true }) },
    { label: "Open Terminal", icon: Terminal, action: () => openApp("terminal", { center: true }) },
    { label: "Open Widgets", icon: LayoutGrid, action: () => openApp("widgets", { center: true }) },
    { label: "Search (Ctrl+K)", icon: RefreshCw, action: () => toggleStartMenu() },
  ];

  const applyWallpaper = (id: string, url?: string) => {
    saveWallpaper(id, url);
    setActiveId(id);
    closeContextMenu();
  };

  return (
    <div
      className="fixed z-[550] min-w-[200px] rounded-lg border border-win-border bg-win-surface py-1 shadow-window"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => {
            item.action();
            closeContextMenu();
          }}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-win-text hover:bg-win-hover"
        >
          <item.icon size={14} className="text-win-muted" />
          {item.label}
        </button>
      ))}

      <div className="my-1 border-t border-win-border" />

      <button
        type="button"
        onClick={() => setShowWallpapers((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs text-win-text hover:bg-win-hover"
      >
        <span className="flex items-center gap-2">
          <ImageIcon size={14} className="text-win-muted" />
          Change wallpaper
        </span>
        <ChevronRight size={12} className={`text-win-muted transition-transform ${showWallpapers ? "rotate-90" : ""}`} />
      </button>

      {showWallpapers && (
        <div className="border-t border-win-border px-2 py-2">
          <div className="mb-2 grid grid-cols-3 gap-1.5">
            {WALLPAPER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                title={preset.name}
                onClick={() => applyWallpaper(preset.id)}
                className={`h-10 rounded-md border-2 transition-all ${
                  activeId === preset.id ? "border-win-accent scale-105" : "border-transparent hover:border-win-border"
                }`}
                style={{ background: preset.background }}
              />
            ))}
          </div>
          <p className="mb-1 text-[10px] text-win-muted">Custom image URL</p>
          <div className="flex gap-1">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://..."
              className="min-w-0 flex-1 rounded border border-win-border bg-win-bg px-2 py-1 text-[10px] text-win-text outline-none focus:border-win-accent"
            />
            <button
              type="button"
              onClick={() => customUrl.trim() && applyWallpaper("custom", customUrl.trim())}
              className="shrink-0 rounded bg-win-accent/20 px-2 py-1 text-[10px] text-win-accent hover:bg-win-accent/30"
            >
              Set
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
