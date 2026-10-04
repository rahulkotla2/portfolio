"use client";

import { useEffect, useRef, useState } from "react";
import { Battery, Calendar, ChevronUp, Volume2, Wifi } from "lucide-react";
import { TASKBAR_HEIGHT } from "@/types/desktop";
import { useDesktopStore } from "@/store/desktop-store";

type TrayPanel = "hidden" | "wifi" | "volume" | "battery" | "clock" | "overflow";

const VOLUME_KEY = "portfolio-os-volume";

export function SystemTray({ time, date }: { time: string; date: string }) {
  const [panel, setPanel] = useState<TrayPanel>("hidden");
  const [wifiOn, setWifiOn] = useState(true);
  const [volume, setVolume] = useState(70);
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const setPeekDesktop = useDesktopStore((s) => s.setPeekDesktop);

  useEffect(() => {
    const saved = Number(localStorage.getItem(VOLUME_KEY));
    if (!Number.isNaN(saved) && saved >= 0) setVolume(Math.min(100, saved));
  }, []);

  useEffect(() => {
    document.querySelectorAll("audio, video").forEach((el) => {
      (el as HTMLMediaElement).volume = volume / 100;
    });
    localStorage.setItem(VOLUME_KEY, String(volume));
  }, [volume]);

  useEffect(() => {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{
        level: number;
        charging: boolean;
        addEventListener: (e: string, fn: () => void) => void;
        removeEventListener: (e: string, fn: () => void) => void;
      }>;
    };
    if (!nav.getBattery) return;
    let batt: Awaited<ReturnType<NonNullable<typeof nav.getBattery>>> | null = null;
    const sync = () => {
      if (!batt) return;
      setBattery({ level: Math.round(batt.level * 100), charging: batt.charging });
    };
    nav.getBattery().then((b) => {
      batt = b;
      sync();
      b.addEventListener("levelchange", sync);
      b.addEventListener("chargingchange", sync);
    });
    return () => {
      batt?.removeEventListener("levelchange", sync);
      batt?.removeEventListener("chargingchange", sync);
    };
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setPanel("hidden");
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggle = (id: TrayPanel) => setPanel((p) => (p === id ? "hidden" : id));

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const startWeekday = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  return (
    <div ref={rootRef} className="absolute right-0 flex h-full items-center text-win-muted">
      <button
        type="button"
        onClick={() => toggle("overflow")}
        className="flex h-10 w-8 items-center justify-center rounded-md hover:bg-win-hover"
        aria-label="Hidden icons"
      >
        <ChevronUp size={14} />
      </button>
      <button
        type="button"
        onClick={() => toggle("wifi")}
        className="flex h-10 w-8 items-center justify-center rounded-md hover:bg-win-hover"
        aria-label="Network"
      >
        <Wifi size={14} className={wifiOn ? "text-win-text" : "opacity-40"} />
      </button>
      <button
        type="button"
        onClick={() => toggle("volume")}
        className="flex h-10 w-8 items-center justify-center rounded-md hover:bg-win-hover"
        aria-label="Volume"
      >
        <Volume2 size={14} />
      </button>
      <button
        type="button"
        onClick={() => toggle("battery")}
        className="flex h-10 w-8 items-center justify-center rounded-md hover:bg-win-hover"
        aria-label="Battery"
      >
        <Battery size={14} />
      </button>
      <button
        type="button"
        onClick={() => toggle("clock")}
        className="flex h-10 flex-col items-end justify-center rounded-md px-2 text-right leading-tight hover:bg-win-hover"
        aria-label="Clock and calendar"
      >
        <span className="text-[11px] text-win-text">{time}</span>
        <span className="text-[11px]">{date}</span>
      </button>
      <button
        type="button"
        aria-label="Show desktop"
        className="h-full w-[5px] border-l border-win-border hover:bg-white/20"
        onMouseEnter={() => setPeekDesktop(true)}
        onMouseLeave={() => setPeekDesktop(false)}
        onClick={() => {
          const { windows, minimizeWindow, restoreWindow } = useDesktopStore.getState();
          const visible = windows.filter((w) => !w.minimized);
          if (visible.length) visible.forEach((w) => minimizeWindow(w.id));
          else windows.forEach((w) => restoreWindow(w.id));
        }}
      />

      {panel !== "hidden" && (
        <div
          className="absolute right-2 w-72 overflow-hidden rounded-xl border border-win-border bg-win-surface/95 p-3 shadow-window backdrop-blur-xl"
          style={{ bottom: TASKBAR_HEIGHT + 8 }}
        >
          {panel === "wifi" && (
            <div>
              <p className="text-xs font-semibold text-win-text">Network</p>
              <button
                type="button"
                onClick={() => setWifiOn((v) => !v)}
                className="mt-2 flex w-full items-center justify-between rounded-lg bg-win-bg px-3 py-2 text-sm text-win-text"
              >
                <span>Wi-Fi</span>
                <span className="text-win-muted">{wifiOn ? "On" : "Off"}</span>
              </button>
              {wifiOn && (
                <div className="mt-2 rounded-lg border border-win-accent/40 bg-win-accent/10 px-3 py-2 text-sm text-win-text">
                  Portfolio-Net
                  <p className="text-[11px] text-win-muted">Connected · secured</p>
                </div>
              )}
            </div>
          )}
          {panel === "volume" && (
            <div>
              <p className="mb-2 text-xs font-semibold text-win-text">Volume</p>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-cyan-400"
                aria-label="Master volume"
              />
              <p className="mt-1 text-right text-[11px] text-win-muted">{volume}%</p>
            </div>
          )}
          {panel === "battery" && (
            <div>
              <p className="text-xs font-semibold text-win-text">Battery</p>
              <p className="mt-2 text-sm text-win-text">
                {battery
                  ? `${battery.level}% · ${battery.charging ? "Charging" : "On battery"}`
                  : "Plugged in · AC power"}
              </p>
              <p className="mt-1 text-[11px] text-win-muted">Portfolio desktop · power plan Balanced</p>
            </div>
          )}
          {panel === "clock" && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-win-text">
                <Calendar size={14} />
                <span className="text-xs font-semibold">{monthLabel}</span>
              </div>
              <p className="mb-2 text-lg text-win-text">{time}</p>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-win-muted">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <span key={`${d}-${i}`}>{d}</span>
                ))}
                {Array.from({ length: startWeekday }).map((_, i) => (
                  <span key={`e-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === now.getDate();
                  return (
                    <span
                      key={day}
                      className={isToday ? "rounded-full bg-win-accent text-win-bg" : "text-win-text"}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {panel === "overflow" && (
            <p className="text-xs text-win-muted">No hidden icons. Wi-Fi, volume, and battery are on the taskbar.</p>
          )}
        </div>
      )}
    </div>
  );
}
