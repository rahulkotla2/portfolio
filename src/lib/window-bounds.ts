/** Minimum visible pixels that must stay on-screen (title bar area). */
const MIN_VISIBLE = 64;
const DESKTOP_PADDING = 12;

export function getWindowDragBounds(
  width: number,
  height: number,
  desktopWidth: number,
  desktopHeight: number
) {
  return {
    top: -height + MIN_VISIBLE,
    left: -width + MIN_VISIBLE,
    right: desktopWidth - MIN_VISIBLE,
    bottom: desktopHeight - MIN_VISIBLE,
  };
}

export function clampWindowPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  desktopWidth: number,
  desktopHeight: number
) {
  const bounds = getWindowDragBounds(width, height, desktopWidth, desktopHeight);
  return {
    x: Math.min(bounds.right, Math.max(bounds.left, x)),
    y: Math.min(bounds.bottom, Math.max(bounds.top, y)),
  };
}

/** Fit window size and position fully inside the desktop work area (above taskbar). */
export function fitWindowToDesktop(
  width: number,
  height: number,
  desktopWidth: number,
  desktopHeight: number,
  preferredX?: number,
  preferredY?: number
) {
  const maxW = Math.max(280, desktopWidth - DESKTOP_PADDING * 2);
  const maxH = Math.max(200, desktopHeight - DESKTOP_PADDING * 2);
  const w = Math.min(width, maxW);
  const h = Math.min(height, maxH);

  let x = preferredX ?? Math.round((desktopWidth - w) / 2);
  let y = preferredY ?? Math.round((desktopHeight - h) / 2);

  x = Math.max(DESKTOP_PADDING, Math.min(x, desktopWidth - w - DESKTOP_PADDING));
  y = Math.max(DESKTOP_PADDING, Math.min(y, desktopHeight - h - DESKTOP_PADDING));

  return { x, y, width: w, height: h };
}

export function ensureWindowVisible(
  x: number,
  y: number,
  width: number,
  height: number,
  desktopWidth: number,
  desktopHeight: number
) {
  return fitWindowToDesktop(width, height, desktopWidth, desktopHeight, x, y);
}
