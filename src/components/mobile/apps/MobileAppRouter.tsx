"use client";

import type { MobileAppId } from "./mobile-app-config";
import { WhatsAppApp } from "./WhatsAppApp";
import { InstagramApp } from "./InstagramApp";
import { LinkedInApp } from "./LinkedInApp";
import { SpotifyApp } from "./SpotifyApp";
import { FilesApp } from "./FilesApp";
import { RecruiterApp } from "./RecruiterApp";

interface MobileAppRouterProps {
  appId: MobileAppId;
  onBack: () => void;
  onOpenApp?: (id: MobileAppId) => void;
}

export function MobileAppRouter({ appId, onBack, onOpenApp }: MobileAppRouterProps) {
  switch (appId) {
    case "whatsapp":
      return <WhatsAppApp onBack={onBack} />;
    case "instagram":
      return <InstagramApp onBack={onBack} onOpenApp={onOpenApp} />;
    case "linkedin":
      return <LinkedInApp onBack={onBack} />;
    case "spotify":
      return <SpotifyApp onBack={onBack} />;
    case "files":
      return <FilesApp onBack={onBack} />;
    case "gmail":
      return <GmailApp onBack={onBack} />;
    case "recruiter":
      return <RecruiterApp onBack={onBack} />;
    default:
      return null;
  }
}
