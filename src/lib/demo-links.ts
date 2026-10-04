/**
 * Project demo URLs — set in .env.local (see .env.example).
 * Leave empty to hide "View Demo" buttons until you have links.
 */
const DEMO_ENV_MAP: Record<string, string | undefined> = {
  "coach-matching": process.env.NEXT_PUBLIC_DEMO_COACH_MATCHING,
  "digital-flex": process.env.NEXT_PUBLIC_DEMO_DIGITAL_FLEX,
  "fintech-kyc": process.env.NEXT_PUBLIC_DEMO_FINTECH_KYC,
  "ai-workflows": process.env.NEXT_PUBLIC_DEMO_AI_WORKFLOWS,
};

export function getDemoLink(projectId: string): string | null {
  const url = DEMO_ENV_MAP[projectId]?.trim();
  if (!url) return null;
  return url;
}

export function hasDemoLink(projectId: string): boolean {
  return getDemoLink(projectId) !== null;
}
