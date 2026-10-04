import type { SnapSide } from "@/types/desktop";

export function detectSnapZone(
  clientX: number,
  clientY: number,
  surface: DOMRect,
  edge = 12
): SnapSide | null {
  const nearL = clientX <= surface.left + edge;
  const nearR = clientX >= surface.right - edge;
  const nearT = clientY <= surface.top + edge;
  const nearB = clientY >= surface.bottom - edge;
  if (nearT && nearL) return "tl";
  if (nearT && nearR) return "tr";
  if (nearB && nearL) return "bl";
  if (nearB && nearR) return "br";
  if (nearT) return "maximize";
  if (nearL) return "left";
  if (nearR) return "right";
  return null;
}

export function snapBounds(side: SnapSide, width: number, height: number) {
  const hw = Math.floor(width / 2);
  const hh = Math.floor(height / 2);
  switch (side) {
    case "left":
      return { x: 0, y: 0, width: hw, height };
    case "right":
      return { x: hw, y: 0, width: width - hw, height };
    case "maximize":
      return { x: 0, y: 0, width, height };
    case "tl":
      return { x: 0, y: 0, width: hw, height: hh };
    case "tr":
      return { x: hw, y: 0, width: width - hw, height: hh };
    case "bl":
      return { x: 0, y: hh, width: hw, height: height - hh };
    case "br":
      return { x: hw, y: hh, width: width - hw, height: height - hh };
  }
}
