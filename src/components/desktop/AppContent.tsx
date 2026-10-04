"use client";

import type { AppId } from "@/types/desktop";
import { VSCodeApp } from "@/components/apps/VSCodeApp";
import { ExplorerApp } from "@/components/apps/ExplorerApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { WidgetsApp } from "@/components/apps/WidgetsApp";

export function AppContent({ appId }: { appId: AppId }) {
  switch (appId) {
    case "vscode":
      return <VSCodeApp />;
    case "explorer":
      return <ExplorerApp />;
    case "terminal":
      return <TerminalApp />;
    case "widgets":
      return <WidgetsApp />;
    default:
      return null;
  }
}
