"use client";

import { useEffect, useState } from "react";
import { getWallpaperBackground, WALLPAPER_PRESETS } from "@/lib/wallpaper";

export function useWallpaper() {
  const [background, setBackground] = useState(WALLPAPER_PRESETS[0].background);

  useEffect(() => {
    const update = () => setBackground(getWallpaperBackground());
    update();
    window.addEventListener("wallpaper-change", update);
    return () => window.removeEventListener("wallpaper-change", update);
  }, []);

  return background;
}
