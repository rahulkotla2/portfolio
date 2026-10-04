"use client";

import { useWallpaper } from "@/hooks/useWallpaper";

interface WallpaperLayerProps {
  className?: string;
  overlay?: "desktop" | "lock" | "none";
}

export function WallpaperLayer({ className = "", overlay = "desktop" }: WallpaperLayerProps) {
  const background = useWallpaper();

  return (
    <>
      <div
        className={`absolute inset-0 ${className}`}
        style={{ background }}
        aria-hidden
      />
      {overlay === "desktop" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 25%, rgba(0,0,0,0.08) 100%)",
          }}
          aria-hidden
        />
      )}
      {overlay === "lock" && (
        <div className="pointer-events-none absolute inset-0 bg-black/25 backdrop-blur-[2px]" aria-hidden />
      )}
    </>
  );
}
