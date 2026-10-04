export interface Notification {
  id: string;
  title: string;
  message: string;
  icon?: "tip" | "achievement" | "info";
  dedupeKey?: string;
}

export const ACHIEVEMENTS_STORAGE_KEY = "portfolio-achievements-unlocked";

export type ContextMenuState = {
  x: number;
  y: number;
} | null;

export const TOUR_STORAGE_KEY = "portfolio-tour-complete";
export const LAYOUT_STORAGE_KEY = "portfolio-window-layout";
export const NOTIFICATIONS_SHOWN_KEY = "portfolio-notifications-shown";
