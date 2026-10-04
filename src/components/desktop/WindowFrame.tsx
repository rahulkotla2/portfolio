"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Rnd } from "react-rnd";
import { Minus, Square, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useDesktopStore } from "@/store/desktop-store";
import type { SnapSide, WindowState } from "@/types/desktop";
import { detectSnapZone, snapBounds } from "@/lib/snap";
import { AppContent } from "./AppContent";

interface WindowFrameProps {
  window: WindowState;
}

const ANIM_DURATION = 0.26;

export function WindowFrame({ window: win }: WindowFrameProps) {
  const {
    focusWindow,
    closeWindow,
    finalizeClose,
    minimizeWindow,
    finalizeMinimize,
    toggleMaximize,
    updateWindowBounds,
    clearWindowJustOpened,
    activeWindowId,
    desktopSize,
    taskbarIconCenters,
    snapWindow,
  } = useDesktopStore();

  const reduceMotion = useReducedMotion();
  const isActive = activeWindowId === win.id;
  const duration = reduceMotion ? 0.01 : ANIM_DURATION;
  const [snapPreview, setSnapPreview] = useState<SnapSide | null>(null);
  const peekDesktop = useDesktopStore((s) => s.peekDesktop);

  useEffect(() => {
    if (!win.isClosing) return;
    const t = setTimeout(() => finalizeClose(win.id), duration * 1000);
    return () => clearTimeout(t);
  }, [win.isClosing, win.id, finalizeClose, duration]);

  useEffect(() => {
    if (!win.isMinimizing) return;
    const t = setTimeout(() => finalizeMinimize(win.id), duration * 1000);
    return () => clearTimeout(t);
  }, [win.isMinimizing, win.id, finalizeMinimize, duration]);

  useEffect(() => {
    if (!win.justOpened) return;
    const t = setTimeout(() => clearWindowJustOpened(win.id), duration * 1000);
    return () => clearTimeout(t);
  }, [win.justOpened, win.id, clearWindowJustOpened, duration]);

  const iconTransform = useMemo(() => {
    const icon = taskbarIconCenters[win.appId];
    const winCenterX = win.maximized ? desktopSize.width / 2 : win.x + win.width / 2;
    const winCenterY = win.maximized ? desktopSize.height / 2 : win.y + win.height / 2;

    if (icon) {
      return {
        x: icon.x - winCenterX,
        y: icon.y - winCenterY,
        scale: 0.12,
      };
    }
    return {
      x: desktopSize.width / 2 - winCenterX,
      y: desktopSize.height - winCenterY,
      scale: 0.12,
    };
  }, [taskbarIconCenters, win.appId, win.x, win.y, win.width, win.height, win.maximized, desktopSize]);

  const resolveSnap = (e: unknown) => {
    const pt = pointerXY(e);
    const surface = document.getElementById("desktop-surface")?.getBoundingClientRect();
    if (!pt || !surface) return null;
    return detectSnapZone(pt.x, pt.y, surface);
  };

  if (win.minimized && !win.isMinimizing) return null;

  const docked = { opacity: 0, scale: iconTransform.scale, x: iconTransform.x, y: iconTransform.y };
  const shown = { opacity: 1, scale: 1, x: 0, y: 0 };
  const animationState =
    win.isClosing || win.isMinimizing
      ? { ...docked, transition: { duration, ease: "easeIn" as const } }
      : { ...shown, transition: { duration, ease: "easeOut" as const } };

  const content = (
    <div
      className={`flex h-full flex-col overflow-hidden ${
        win.maximized ? "rounded-none shadow-none" : "rounded-lg shadow-window"
      } ${isActive && !win.maximized ? "ring-1 ring-win-accent/30" : ""}`}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div
        className={`window-drag-handle flex h-9 shrink-0 cursor-default items-center justify-between border-b border-win-border px-3 ${
          isActive ? "bg-win-panel" : "bg-win-surface"
        }`}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
          <AppIcon appId={win.appId} size={14} />
          <span className="truncate text-xs text-win-muted">{win.title}</span>
        </div>
        <div className="flex shrink-0 items-center">
          <TitleButton onClick={() => minimizeWindow(win.id)} aria-label="Minimize">
            <Minus size={12} />
          </TitleButton>
          <TitleButton onClick={() => toggleMaximize(win.id)} aria-label={win.maximized ? "Restore" : "Maximize"}>
            {win.maximized ? <RestoreCaption /> : <Square size={10} />}
          </TitleButton>
          <TitleButton onClick={() => closeWindow(win.id)} hover="close" aria-label="Close">
            <X size={12} />
          </TitleButton>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden bg-win-bg">
        <AppContent appId={win.appId} />
      </div>
    </div>
  );

  const overlayHost = typeof document !== "undefined" ? document.getElementById("desktop-surface") : null;
  const overlay =
    snapPreview && overlayHost
      ? createPortal(
          <div
            className="pointer-events-none absolute rounded-lg border-2 border-sky-400/80 bg-sky-400/15"
            style={{ ...snapBounds(snapPreview, desktopSize.width, desktopSize.height), zIndex: 9999 }}
          />,
          overlayHost
        )
      : null;

  if (win.maximized) {
    return (
      <motion.div
        initial={false}
        animate={animationState}
        transition={{ duration, ease: "easeOut" }}
        className="absolute inset-0"
        style={{ zIndex: win.zIndex, transformOrigin: "center center", opacity: peekDesktop ? 0.08 : 1 }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <>
      {overlay}
      <Rnd
      position={{ x: win.x, y: win.y }}
      size={{ width: win.width, height: win.height }}
      minWidth={win.minWidth}
      minHeight={win.minHeight}
      dragHandleClassName="window-drag-handle"
      cancel=".window-no-drag"
      disableDragging={win.isClosing || win.isMinimizing}
      enableResizing={!win.isClosing && !win.isMinimizing}
      onDragStart={() => focusWindow(win.id)}
      onDrag={(e) => setSnapPreview(resolveSnap(e))}
      onDragStop={(e, d) => {
        const zone = resolveSnap(e);
        setSnapPreview(null);
        if (zone) {
          snapWindow(win.id, zone);
          return;
        }
        updateWindowBounds(win.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(_e, _dir, ref, _delta, position) =>
        updateWindowBounds(win.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        })
      }
      style={{ zIndex: win.zIndex, opacity: peekDesktop ? 0.08 : 1 }}
      className="!flex !flex-col !overflow-hidden"
    >
      <motion.div
        className="h-full w-full overflow-hidden"
        style={{ transformOrigin: "center center" }}
        initial={win.justOpened ? docked : false}
        animate={animationState}
        transition={{ duration, ease: "easeOut" }}
      >
        {content}
      </motion.div>
    </Rnd>
    </>
  );
}

function pointerXY(e: unknown): { x: number; y: number } | null {
  const ev = e as MouseEvent | TouchEvent;
  if ("changedTouches" in ev && ev.changedTouches[0]) {
    return { x: ev.changedTouches[0].clientX, y: ev.changedTouches[0].clientY };
  }
  if ("clientX" in ev) return { x: ev.clientX, y: ev.clientY };
  return null;
}

function RestoreCaption() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <rect x="2.2" y="0.8" width="6.8" height="6.8" stroke="currentColor" strokeWidth="1.15" />
      <path d="M0.8 3.2H7v6.2H0.8z" stroke="currentColor" strokeWidth="1.15" />
    </svg>
  );
}

function TitleButton({
  children,
  onClick,
  hover = "default",
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  hover?: "default" | "close";
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`window-no-drag flex h-9 w-11 items-center justify-center text-win-muted transition-colors ${
        hover === "close"
          ? "hover:bg-red-500 hover:text-white"
          : "hover:bg-win-hover hover:text-win-text"
      }`}
    >
      {children}
    </button>
  );
}

function AppIcon({ appId, size }: { appId: string; size: number }) {
  const colors: Record<string, string> = {
    vscode: "bg-[#007acc]",
    explorer: "bg-[#fcd53f]",
    terminal: "bg-[#0c0c0c] border border-win-border",
    widgets: "bg-gradient-to-br from-cyan-500 to-blue-600",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-sm ${colors[appId] ?? "bg-win-border"}`}
      style={{ width: size + 4, height: size + 4 }}
    >
      {appId === "vscode" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
          <path d="M17.5 2.5L8 12l9.5 9.5 2.5-2.5L13 12l7-7-2.5-2.5z" />
        </svg>
      )}
      {appId === "explorer" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#1a1a1a">
          <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
        </svg>
      )}
      {appId === "terminal" && (
        <span className="font-mono text-[8px] text-green-400">{">_"}</span>
      )}
      {appId === "widgets" && <span className="text-[8px] text-white">◫</span>}
    </div>
  );
}
