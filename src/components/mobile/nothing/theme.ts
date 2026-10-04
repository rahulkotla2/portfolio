export const NOTHING = {
  red: "#D71921",
  black: "#000000",
  surface: "#0d0d0d",
  card: "#1a1a1a",
  cardHover: "#242424",
  border: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.45)",
  textDim: "rgba(255,255,255,0.25)",
  dot: "rgba(255,255,255,0.9)",
  dotDim: "rgba(255,255,255,0.35)",
} as const;

export const nothingSpring = { type: "spring" as const, stiffness: 340, damping: 32 };
export const nothingEase = [0.22, 1, 0.36, 1] as const;
