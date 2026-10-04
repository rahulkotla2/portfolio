"use client";

import { create } from "zustand";
import { APPS, type AppId, type OpenAppOptions, type WindowState, type SnapSide } from "@/types/desktop";
import { snapBounds } from "@/lib/snap";
import { clampWindowPosition, ensureWindowVisible, fitWindowToDesktop } from "@/lib/window-bounds";
import type { Notification, ContextMenuState } from "@/types/features";
import { ACHIEVEMENTS_STORAGE_KEY } from "@/types/features";
import { projects } from "@/data/portfolio";
import { loadLayout, saveLayout } from "@/lib/persist-layout";

let windowCounter = 0;
let zIndexCounter = 50;

function createWindow(
  appId: AppId,
  desktopWidth: number,
  desktopHeight: number,
  openCount = 0
): WindowState {
  const app = APPS[appId];
  windowCounter += 1;
  const cascade = openCount % 4;

  const fitted = fitWindowToDesktop(
    app.defaultWidth,
    app.defaultHeight,
    desktopWidth,
    desktopHeight
  );
  const offset = cascade * 28;
  const positioned = fitWindowToDesktop(
    fitted.width,
    fitted.height,
    desktopWidth,
    desktopHeight,
    fitted.x + offset,
    fitted.y + offset
  );

  return {
    id: `${appId}-${Date.now()}-${windowCounter}`,
    appId,
    title: app.title,
    x: positioned.x,
    y: positioned.y,
    width: positioned.width,
    height: positioned.height,
    minWidth: app.minWidth,
    minHeight: app.minHeight,
    minimized: false,
    maximized: false,
    zIndex: ++zIndexCounter,
    isClosing: false,
    isMinimizing: false,
    justOpened: true,
  };
}

function persist(get: () => DesktopStore) {
  const { windows, activeWindowId } = get();
  if (windows.length > 0) saveLayout(windows, activeWindowId);
}

interface DesktopStore {
  windows: WindowState[];
  activeWindowId: string | null;
  bootComplete: boolean;
  lockScreenUnlocked: boolean;
  startMenuOpen: boolean;
  altTabOpen: boolean;
  altTabIndex: number;
  desktopSize: { width: number; height: number };
  taskbarIconCenters: Partial<Record<AppId, { x: number; y: number }>>;
  mobileApp: AppId | null;

  notifications: Notification[];
  explorerProjectId: string | null;
  caseStudyProjectId: string | null;
  contextMenu: ContextMenuState;
  tourStep: number | null;

  setDesktopSize: (width: number, height: number) => void;
  setTaskbarIconCenter: (appId: AppId, x: number, y: number) => void;
  unlockLockScreen: () => void;
  lockLockScreen: () => void;
  completeBoot: () => void;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;

  openApp: (appId: AppId, options?: OpenAppOptions) => void;
  clearWindowJustOpened: (id: string) => void;
  openExplorerProject: (projectId: string) => void;
  openCaseStudy: (projectId: string) => void;
  closeCaseStudy: () => void;
  closeWindow: (id: string) => void;
  finalizeClose: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  finalizeMinimize: (id: string) => void;
  restoreWindow: (id: string, center?: boolean) => void;
  toggleMaximize: (id: string) => void;
  updateWindowBounds: (id: string, bounds: Partial<Pick<WindowState, "x" | "y" | "width" | "height">>) => void;
  snapWindow: (id: string, side: SnapSide) => void;
  peekDesktop: boolean;
  setPeekDesktop: (peek: boolean) => void;

  setMobileApp: (appId: AppId | null) => void;

  addNotification: (n: Omit<Notification, "id">) => void;
  dismissNotification: (id: string) => void;

  openAltTab: () => void;
  closeAltTab: () => void;
  cycleAltTab: (direction: 1 | -1) => void;
  selectAltTab: () => void;

  openContextMenu: (x: number, y: number) => void;
  closeContextMenu: () => void;

  setTourStep: (step: number | null) => void;
  nextTourStep: () => void;
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  bootComplete: false,
  lockScreenUnlocked: false,
  startMenuOpen: false,
  altTabOpen: false,
  altTabIndex: 0,
  desktopSize: { width: 1280, height: 800 },
  taskbarIconCenters: {},
  mobileApp: null,
  notifications: [],
  explorerProjectId: null,
  caseStudyProjectId: null,
  contextMenu: null,
  tourStep: null,
  peekDesktop: false,

  setDesktopSize: (width, height) => {
    if (width < 320 || height < 240) return;
    set((s) => {
      if (s.desktopSize.width === width && s.desktopSize.height === height) return s;
      return {
        desktopSize: { width, height },
        windows: s.windows.map((w) => {
          if (w.maximized || w.snapSide === "maximize") return { ...w, x: 0, y: 0, width, height };
          if (w.snapSide && w.snapSide !== "maximize") {
            return { ...w, ...snapBounds(w.snapSide, width, height) };
          }
          const fitted = ensureWindowVisible(w.x, w.y, w.width, w.height, width, height);
          return { ...w, ...fitted };
        }),
      };
    });
  },

  setTaskbarIconCenter: (appId, x, y) =>
    set((s) => ({
      taskbarIconCenters: { ...s.taskbarIconCenters, [appId]: { x, y } },
    })),

  unlockLockScreen: () => set({ lockScreenUnlocked: true }),
  lockLockScreen: () =>
    set({
      lockScreenUnlocked: false,
      startMenuOpen: false,
      altTabOpen: false,
      contextMenu: null,
    }),

  completeBoot: () => {
    set({ bootComplete: true });
    const saved = loadLayout();
    if (saved && saved.windows.length > 0) {
      const { desktopSize } = get();
      zIndexCounter = Math.max(...saved.windows.map((w) => w.zIndex), 10);
      const sanitized = saved.windows.map((w) => {
        if (w.maximized) return { ...w, x: 0, y: 0, width: desktopSize.width, height: desktopSize.height };
        const fitted = ensureWindowVisible(
          w.x,
          w.y,
          w.width,
          w.height,
          desktopSize.width,
          desktopSize.height
        );
        return { ...w, ...fitted, justOpened: false };
      });
      set({
        windows: sanitized,
        activeWindowId: saved.activeWindowId,
      });
    } else {
      const { desktopSize, openApp } = get();
      if (desktopSize.width >= 768) openApp("vscode");
    }

    setTimeout(() => {
      const shown = localStorage.getItem("portfolio-notifications-shown");
      if (!shown) {
        get().addNotification({
          title: "Welcome!",
          message: "Press Ctrl+K to search. Explore projects in File Explorer.",
          icon: "tip",
        });
        localStorage.setItem("portfolio-notifications-shown", "1");
      }
      const tourDone = localStorage.getItem("portfolio-tour-complete");
      if (!tourDone) set({ tourStep: 0 });
    }, 2500);
  },

  toggleStartMenu: () => set((s) => ({ startMenuOpen: !s.startMenuOpen, altTabOpen: false })),
  closeStartMenu: () => set({ startMenuOpen: false }),

  openApp: (appId, options) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("taskbar-measure"));
    }

    const { windows, desktopSize } = get();
    const existing = windows.find((w) => w.appId === appId && !w.isClosing);
    const shouldCenter = options?.center ?? false;

    if (existing) {
      if (existing.minimized) {
        get().restoreWindow(existing.id, shouldCenter);
        set({ startMenuOpen: false });
      } else {
        set({
          windows: windows.map((w) =>
            w.id === existing.id ? { ...w, zIndex: ++zIndexCounter } : w
          ),
          activeWindowId: existing.id,
          startMenuOpen: false,
        });
      }
      persist(get);
      return;
    }

    const remaining = windows.filter((w) => !(w.appId === appId && w.isClosing));
    const visibleCount = remaining.filter((w) => !w.minimized).length;
    const newWindow = createWindow(appId, desktopSize.width, desktopSize.height, visibleCount);
    set({
      windows: [...remaining, newWindow],
      activeWindowId: newWindow.id,
      startMenuOpen: false,
    });
    persist(get);
  },

  clearWindowJustOpened: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, justOpened: false } : w)),
    })),

  openExplorerProject: (projectId) => {
    get().openApp("explorer", { center: false });
    set({ explorerProjectId: projectId });
  },

  openCaseStudy: (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    set({ caseStudyProjectId: projectId });
    if (!project?.metrics?.[0]) return;

    const unlocked = JSON.parse(
      localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY) ?? "[]"
    ) as string[];
    if (unlocked.includes(projectId)) return;

    localStorage.setItem(
      ACHIEVEMENTS_STORAGE_KEY,
      JSON.stringify([...unlocked, projectId])
    );
    get().addNotification({
      title: "Achievement Unlocked",
      message: project.metrics[0],
      icon: "achievement",
      dedupeKey: `achievement-${projectId}`,
    });
  },

  closeCaseStudy: () => set({ caseStudyProjectId: null }),

  closeWindow: (id) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("taskbar-measure"));
    }
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, isClosing: true } : w)),
    }));
  },

  finalizeClose: (id) => {
    set((s) => {
      const remaining = s.windows.filter((w) => w.id !== id);
      const top = remaining.filter((w) => !w.minimized).sort((a, b) => b.zIndex - a.zIndex)[0];
      return { windows: remaining, activeWindowId: top?.id ?? null };
    });
    persist(get);
  },

  focusWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, zIndex: ++zIndexCounter } : w)),
      activeWindowId: id,
    })),

  minimizeWindow: (id) => {
    window.dispatchEvent(new CustomEvent("taskbar-measure"));
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, isMinimizing: true } : w)),
    }));
  },

  finalizeMinimize: (id) => {
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, minimized: true, isMinimizing: false } : w
      ),
      activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
    }));
    persist(get);
  },

  restoreWindow: (id, center = false) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("taskbar-measure"));
    }
    const { windows, desktopSize } = get();
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    const nextBounds = !win.maximized
      ? center
        ? fitWindowToDesktop(win.width, win.height, desktopSize.width, desktopSize.height)
        : { x: win.x, y: win.y, width: win.width, height: win.height }
      : null;

    set({
      windows: windows.map((w) =>
        w.id === id
          ? {
              ...w,
              minimized: false,
              isMinimizing: false,
              justOpened: true,
              zIndex: ++zIndexCounter,
              snapSide: center ? undefined : w.snapSide,
              ...(center && !win.maximized ? { maximized: false } : {}),
              ...(nextBounds ? nextBounds : {}),
            }
          : w
      ),
      activeWindowId: id,
    });
    persist(get);
  },

  toggleMaximize: (id) => {
    const { windows, desktopSize } = get();
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (win.maximized) {
      const restored = win.preMaximize ?? win;
      set({
        windows: windows.map((w) =>
          w.id === id
            ? {
                ...w,
                maximized: false,
                snapSide: undefined,
                x: restored.x,
                y: restored.y,
                width: restored.width,
                height: restored.height,
                preMaximize: undefined,
                zIndex: ++zIndexCounter,
              }
            : w
        ),
        activeWindowId: id,
      });
    } else {
      set({
        windows: windows.map((w) =>
          w.id === id
            ? {
                ...w,
                maximized: true,
                snapSide: undefined,
                preMaximize: { x: w.x, y: w.y, width: w.width, height: w.height },
                x: 0,
                y: 0,
                width: desktopSize.width,
                height: desktopSize.height,
                zIndex: ++zIndexCounter,
              }
            : w
        ),
        activeWindowId: id,
      });
    }
    persist(get);
  },

  updateWindowBounds: (id, bounds) => {
    const { windows, desktopSize } = get();
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    const nextWidth = bounds.width ?? win.width;
    const nextHeight = bounds.height ?? win.height;
    const nextX = bounds.x ?? win.x;
    const nextY = bounds.y ?? win.y;
    const clamped = clampWindowPosition(
      nextX,
      nextY,
      nextWidth,
      nextHeight,
      desktopSize.width,
      desktopSize.height
    );

    set({
      windows: windows.map((w) =>
        w.id === id
          ? {
              ...w,
              ...bounds,
              x: clamped.x,
              y: clamped.y,
              maximized: false,
              snapSide: undefined,
              preMaximize: undefined,
            }
          : w
      ),
    });
    persist(get);
  },

  snapWindow: (id, side) => {
    const { desktopSize, windows } = get();
    const current = windows.find((w) => w.id === id);
    const bounds = snapBounds(side, desktopSize.width, desktopSize.height);
    const isMax = side === "maximize";
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              ...bounds,
              maximized: isMax,
              snapSide: isMax ? undefined : side,
              preMaximize:
                w.preMaximize ??
                (current && !current.maximized
                  ? { x: current.x, y: current.y, width: current.width, height: current.height }
                  : w.preMaximize),
              zIndex: ++zIndexCounter,
            }
          : w
      ),
      activeWindowId: id,
    }));
    persist(get);
  },

  setPeekDesktop: (peek) => set({ peekDesktop: peek }),

  setMobileApp: (appId) => set({ mobileApp: appId }),

  addNotification: (n) =>
    set((s) => {
      if (n.dedupeKey && s.notifications.some((existing) => existing.dedupeKey === n.dedupeKey)) {
        return s;
      }
      return {
        notifications: [...s.notifications, { ...n, id: `notif-${Date.now()}` }].slice(-4),
      };
    }),

  dismissNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  openAltTab: () => {
    const { windows } = get();
    const visible = windows.filter((w) => !w.minimized && !w.isClosing);
    if (visible.length < 2) return;
    set({ altTabOpen: true, altTabIndex: 0, startMenuOpen: false });
  },

  closeAltTab: () => set({ altTabOpen: false }),

  cycleAltTab: (direction) => {
    const { windows, altTabIndex } = get();
    const visible = windows.filter((w) => !w.minimized && !w.isClosing);
    if (visible.length === 0) return;
    const next = (altTabIndex + direction + visible.length) % visible.length;
    set({ altTabIndex: next });
  },

  selectAltTab: () => {
    const { windows, altTabIndex } = get();
    const visible = windows.filter((w) => !w.minimized && !w.isClosing);
    const target = visible[altTabIndex];
    if (target) get().focusWindow(target.id);
    set({ altTabOpen: false });
  },

  openContextMenu: (x, y) => set({ contextMenu: { x, y } }),
  closeContextMenu: () => set({ contextMenu: null }),

  setTourStep: (step) => set({ tourStep: step }),
  nextTourStep: () => {
    const { tourStep } = get();
    if (tourStep === null) return;
    if (tourStep >= 2) {
      localStorage.setItem("portfolio-tour-complete", "1");
      set({ tourStep: null });
    } else {
      set({ tourStep: tourStep + 1 });
    }
  },
}));
