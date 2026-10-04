"use client";

import { RecruiterView } from "@/components/recruiter/RecruiterView";

export function RecruiterApp({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative h-full min-h-0 overflow-hidden" style={{ fontFamily: "var(--font-roboto), Roboto, sans-serif" }}>
      <RecruiterView embedded onExit={onBack} />
    </div>
  );
}
