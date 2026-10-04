"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type StatusChrome = { ink: "light" | "dark"; bg: string };

const MobileChromeContext = createContext<{
  override: StatusChrome | null;
  setOverride: (chrome: StatusChrome | null) => void;
}>({ override: null, setOverride: () => {} });

export function MobileChromeProvider({ children }: { children: React.ReactNode }) {
  const [override, setOverride] = useState<StatusChrome | null>(null);
  const value = useMemo(() => ({ override, setOverride }), [override]);
  return <MobileChromeContext.Provider value={value}>{children}</MobileChromeContext.Provider>;
}

export function useMobileChromeOverride() {
  return useContext(MobileChromeContext);
}
