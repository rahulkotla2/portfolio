import type { WindowState } from "@/types/desktop";
import { LAYOUT_STORAGE_KEY } from "@/types/features";

interface SavedLayout {
  windows: WindowState[];
  activeWindowId: string | null;
}

export function saveLayout(windows: WindowState[], activeWindowId: string | null) {
  if (typeof window === "undefined") return;
  const payload: SavedLayout = {
    windows: windows.map((w) => ({
      ...w,
      isClosing: false,
      isMinimizing: false,
    })),
    activeWindowId,
  };
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota errors */
  }
}

export function loadLayout(): SavedLayout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedLayout;
  } catch {
    return null;
  }
}

export function clearLayout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LAYOUT_STORAGE_KEY);
}
