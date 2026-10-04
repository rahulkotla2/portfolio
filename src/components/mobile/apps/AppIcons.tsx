import { BrandLauncherIcon } from "./ui/BrandLauncherIcon";
import type { LauncherBrandId } from "./ui/launcher-icon-data";

function LauncherIcon({ id, size, alt }: { id: LauncherBrandId | "recruiter"; size: number; alt: string }) {
  return (
    <div role="img" aria-label={alt}>
      <BrandLauncherIcon id={id} size={size} />
    </div>
  );
}

export function WhatsAppIcon({ size = 56 }: { size?: number }) {
  return <LauncherIcon id="whatsapp" size={size} alt="WhatsApp" />;
}
export function InstagramIcon({ size = 56 }: { size?: number }) {
  return <LauncherIcon id="instagram" size={size} alt="Instagram" />;
}
export function LinkedInIcon({ size = 56 }: { size?: number }) {
  return <LauncherIcon id="linkedin" size={size} alt="LinkedIn" />;
}
export function SpotifyIcon({ size = 56 }: { size?: number }) {
  return <LauncherIcon id="spotify" size={size} alt="Spotify" />;
}
export function FilesIcon({ size = 56 }: { size?: number }) {
  return <LauncherIcon id="files" size={size} alt="Files" />;
}
export function GmailIcon({ size = 56 }: { size?: number }) {
  return <LauncherIcon id="gmail" size={size} alt="Gmail" />;
}
export function RecruiterIcon({ size = 56 }: { size?: number }) {
  return <LauncherIcon id="recruiter" size={size} alt="Recruiter" />;
}

const ICON_MAP = {
  whatsapp: WhatsAppIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  spotify: SpotifyIcon,
  files: FilesIcon,
  gmail: GmailIcon,
  recruiter: RecruiterIcon,
} as const;

export function AppIcon({ appId, size = 56 }: { appId: keyof typeof ICON_MAP; size?: number }) {
  const Icon = ICON_MAP[appId];
  return <Icon size={size} />;
}
