"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Lightbulb, Info } from "lucide-react";
import { useDesktopStore } from "@/store/desktop-store";
import type { Notification } from "@/types/features";
import { TASKBAR_HEIGHT } from "@/types/desktop";

const AUTO_DISMISS_MS = 4500;

const icons = {
  tip: Lightbulb,
  achievement: Trophy,
  info: Info,
};

export function NotificationCenter() {
  const { notifications, dismissNotification } = useDesktopStore();

  return (
    <div
      className="pointer-events-none fixed right-3 z-[450] flex w-80 flex-col-reverse gap-2"
      style={{ bottom: TASKBAR_HEIGHT + 12 }}
    >
      <AnimatePresence>
        {notifications.map((n) => (
          <NotificationToast
            key={n.id}
            notification={n}
            onDismiss={() => dismissNotification(n.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationToast({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) {
  const Icon = icons[notification.icon ?? "info"];

  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      className="pointer-events-auto flex gap-3 rounded-lg border border-win-border bg-win-surface/95 p-3 shadow-window backdrop-blur-xl"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-win-accent/10">
        <Icon size={16} className="text-win-accent" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-win-text">{notification.title}</p>
        <p className="text-[11px] leading-snug text-win-muted">{notification.message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-win-muted hover:text-win-text"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
