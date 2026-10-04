"use client";

import { useRef, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDesktopStore } from "@/store/desktop-store";
import { WindowFrame } from "./WindowFrame";
import { WallpaperLayer } from "./WallpaperLayer";

type DesktopShortcut = "projects" | "readme" | "contact";

export function Desktop() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const { windows, setDesktopSize, openContextMenu } = useDesktopStore();
  const [selected, setSelected] = useState<DesktopShortcut | null>(null);

  useEffect(() => {
    const el = desktopRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setDesktopSize(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(el);
    setDesktopSize(el.clientWidth, el.clientHeight);
    return () => observer.disconnect();
  }, [setDesktopSize]);

  return (
    <div
      id="desktop-surface"
      ref={desktopRef}
      className="absolute inset-0 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).getAttribute("aria-hidden") === "true") {
          setSelected(null);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        openContextMenu(e.clientX, e.clientY);
      }}
    >
      <WallpaperLayer />

      <AnimatePresence>
        {windows.map((win) => (
          <WindowFrame key={win.id} window={win} />
        ))}
      </AnimatePresence>

      <div className="absolute left-3 top-4 z-[20] flex flex-col gap-1">
        <DesktopIcon
          id="projects"
          label="Projects"
          selected={selected === "projects"}
          onSelect={() => setSelected("projects")}
          onOpen={() => useDesktopStore.getState().openApp("explorer", { center: true })}
          kind="folder"
        />
        <DesktopIcon
          id="readme"
          label="README"
          selected={selected === "readme"}
          onSelect={() => setSelected("readme")}
          onOpen={() => useDesktopStore.getState().openApp("vscode", { center: true })}
          kind="code"
        />
        <DesktopIcon
          id="contact"
          label="Contact"
          selected={selected === "contact"}
          onSelect={() => setSelected("contact")}
          onOpen={() => useDesktopStore.getState().openApp("terminal", { center: true })}
          kind="term"
        />
      </div>
    </div>
  );
}

function DesktopIcon({
  label,
  selected,
  onSelect,
  onOpen,
  kind,
}: {
  id: DesktopShortcut;
  label: string;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  kind: "folder" | "code" | "term";
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      className={`flex w-[76px] flex-col items-center gap-1 rounded-sm px-1 py-1.5 text-center ${
        selected ? "bg-[#0078d4]/35 ring-1 ring-[#0078d4]/60" : "hover:bg-white/10"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center drop-shadow-md">
        {kind === "folder" && <FolderGlyph />}
        {kind === "code" && <CodeGlyph />}
        {kind === "term" && <TermGlyph />}
      </div>
      <span className="line-clamp-2 w-full text-[11px] leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </button>
  );
}

function FolderGlyph() {
  return (
    <svg width="40" height="32" viewBox="0 0 40 32" aria-hidden>
      <path fill="#FFC83D" d="M2 8.5A3.5 3.5 0 0 1 5.5 5H14l3 3.5h17.5A3.5 3.5 0 0 1 38 12v13.5A3.5 3.5 0 0 1 34.5 29h-29A3.5 3.5 0 0 1 2 25.5V8.5z" />
      <path fill="#FFE08A" d="M2 12h36v13.5A3.5 3.5 0 0 1 34.5 29h-29A3.5 3.5 0 0 1 2 25.5V12z" />
    </svg>
  );
}

function CodeGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="4" fill="#007ACC" />
      <path fill="#fff" d="M9 16l4-5v3l-2 2 2 2v3l-4-5zm14 0l-4 5v-3l2-2-2-2V9l4 7z" />
    </svg>
  );
}

function TermGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="4" fill="#0C0C0C" stroke="#3d3d3d" />
      <path d="M8 11l6 5-6 5" stroke="#cccccc" strokeWidth="1.6" fill="none" />
      <path d="M16 21h8" stroke="#cccccc" strokeWidth="1.6" />
    </svg>
  );
}
