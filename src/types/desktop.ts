export type AppId = "vscode" | "explorer" | "terminal" | "widgets";

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  preMaximize?: WindowBounds;
  isClosing?: boolean;
  isMinimizing?: boolean;
  justOpened?: boolean;
  snapSide?: "left" | "right" | "maximize" | "tl" | "tr" | "bl" | "br";
}

export type SnapSide = NonNullable<WindowState["snapSide"]>;

export interface OpenAppOptions {
  center?: boolean;
}

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
}

export const APPS: Record<AppId, AppDefinition> = {
  vscode: {
    id: "vscode",
    title: "README.md — Visual Studio Code",
    icon: "vscode",
    defaultWidth: 720,
    defaultHeight: 520,
    minWidth: 400,
    minHeight: 300,
  },
  explorer: {
    id: "explorer",
    title: "Projects — File Explorer",
    icon: "explorer",
    defaultWidth: 900,
    defaultHeight: 560,
    minWidth: 320,
    minHeight: 280,
  },
  terminal: {
    id: "terminal",
    title: "Windows Terminal",
    icon: "terminal",
    defaultWidth: 680,
    defaultHeight: 420,
    minWidth: 400,
    minHeight: 280,
  },
  widgets: {
    id: "widgets",
    title: "Widgets",
    icon: "widgets",
    defaultWidth: 320,
    defaultHeight: 480,
    minWidth: 280,
    minHeight: 360,
  },
};

export const TASKBAR_HEIGHT = 48;
