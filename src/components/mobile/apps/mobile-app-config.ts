export type MobileAppId =
  | "whatsapp"
  | "instagram"
  | "linkedin"
  | "spotify"
  | "files"
  | "gmail"
  | "recruiter";

/** Unique responsibility per app — no overlapping content */
export const MOBILE_APPS: Record<
  MobileAppId,
  {
    label: string;
    role: string;
  }
> = {
  whatsapp: { label: "WhatsApp", role: "Contact & chat only" },
  instagram: { label: "Instagram", role: "Visual project showcase" },
  linkedin: { label: "LinkedIn", role: "Career profile & connect" },
  spotify: { label: "Spotify", role: "Skills as playlists" },
  files: { label: "Files", role: "Full project case studies" },
  gmail: { label: "Gmail", role: "Resume & hiring email" },
  recruiter: { label: "Recruiter", role: "Hiring brief" },
};

export const LAUNCHER_APPS: MobileAppId[] = [
  "whatsapp",
  "instagram",
  "linkedin",
  "spotify",
  "files",
  "gmail",
  "recruiter",
];

export const DOCK_APPS: MobileAppId[] = ["whatsapp", "instagram", "gmail", "files"];

export const APP_STATUS_CHROME: Record<MobileAppId, { ink: "light" | "dark"; bg: string }> = {
  whatsapp: { ink: "light", bg: "#1F2C34" },
  instagram: { ink: "light", bg: "#000000" },
  linkedin: { ink: "dark", bg: "#FFFFFF" },
  spotify: { ink: "light", bg: "#121212" },
  files: { ink: "dark", bg: "#F8F9FA" },
  gmail: { ink: "dark", bg: "#FFFFFF" },
  recruiter: { ink: "dark", bg: "#FFFFFF" },
};
