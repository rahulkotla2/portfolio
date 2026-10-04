export const WALLPAPER_STORAGE_KEY = "portfolio-wallpaper";

export interface WallpaperPreset {
  id: string;
  name: string;
  /** CSS background value (url, gradient, or both) */
  background: string;
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: "win11-blue",
    name: "Windows Blue",
    background:
      "url('/wallpaper.svg') center/cover no-repeat, linear-gradient(135deg, #0a1628 0%, #0f2847 45%, #061018 100%)",
  },
  {
    id: "portfolio-bloom",
    name: "Portfolio Bloom",
    background:
      "url('/wallpaper.svg') center/cover no-repeat, radial-gradient(ellipse 80% 60% at 70% 40%, rgba(56,189,248,0.4) 0%, transparent 55%), linear-gradient(160deg, #0a1628 0%, #0f2847 50%, #061018 100%)",
  },
  {
    id: "win11-bloom",
    name: "Cyan Bloom",
    background:
      "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(34,211,238,0.45) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 30% 70%, rgba(99,102,241,0.35) 0%, transparent 50%), linear-gradient(160deg, #0a0e14 0%, #0d2137 50%, #061018 100%)",
  },
  {
    id: "sunset",
    name: "Sunset",
    background:
      "radial-gradient(ellipse 70% 55% at 60% 30%, rgba(251,146,60,0.4) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(236,72,153,0.25) 0%, transparent 45%), linear-gradient(180deg, #1a0a14 0%, #2d1b3d 40%, #0f172a 100%)",
  },
  {
    id: "forest",
    name: "Forest Night",
    background:
      "radial-gradient(ellipse 60% 50% at 40% 60%, rgba(16,185,129,0.2) 0%, transparent 50%), linear-gradient(180deg, #022c22 0%, #064e3b 30%, #0a0e14 100%)",
  },
  {
    id: "midnight",
    name: "Midnight",
    background:
      "radial-gradient(ellipse 50% 40% at 80% 20%, rgba(139,92,246,0.3) 0%, transparent 50%), linear-gradient(180deg, #0f0a1a 0%, #1e1b4b 50%, #0a0e14 100%)",
  },
];

export function getWallpaperBackground(): string {
  if (typeof window === "undefined") return WALLPAPER_PRESETS[0].background;

  const saved = localStorage.getItem(WALLPAPER_STORAGE_KEY);
  if (!saved) return WALLPAPER_PRESETS[0].background;

  try {
    const parsed = JSON.parse(saved) as { id: string; customUrl?: string };
    if (parsed.id === "custom" && parsed.customUrl) {
      return `url('${parsed.customUrl}') center/cover no-repeat, #0a0e14`;
    }
    const preset = WALLPAPER_PRESETS.find((p) => p.id === parsed.id);
    return preset?.background ?? WALLPAPER_PRESETS[0].background;
  } catch {
    return WALLPAPER_PRESETS[0].background;
  }
}

export function saveWallpaper(id: string, customUrl?: string) {
  localStorage.setItem(WALLPAPER_STORAGE_KEY, JSON.stringify({ id, customUrl }));
  window.dispatchEvent(new CustomEvent("wallpaper-change"));
}

export function getSavedWallpaperId(): string {
  if (typeof window === "undefined") return WALLPAPER_PRESETS[0].id;
  try {
    const saved = localStorage.getItem(WALLPAPER_STORAGE_KEY);
    if (!saved) return WALLPAPER_PRESETS[0].id;
    return (JSON.parse(saved) as { id: string }).id;
  } catch {
    return WALLPAPER_PRESETS[0].id;
  }
}
