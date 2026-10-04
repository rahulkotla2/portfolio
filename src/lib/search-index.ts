import { APPS, type AppId } from "@/types/desktop";
import { projects, profile } from "@/data/portfolio";
import { RESUME_PATH } from "@/lib/constants";

export type SearchResultType = "app" | "project" | "command" | "link" | "document";

export interface SearchResult {
  id: string;
  label: string;
  description?: string;
  type: SearchResultType;
  keywords: string[];
  action: () => void;
}

type SearchContext = {
  openApp: (appId: AppId) => void;
  openExplorerProject: (projectId: string) => void;
  closeStartMenu: () => void;
};

export function buildSearchIndex(ctx: SearchContext): SearchResult[] {
  const { openApp, openExplorerProject, closeStartMenu } = ctx;

  const appResults: SearchResult[] = (Object.keys(APPS) as AppId[]).map((appId) => ({
    id: `app-${appId}`,
    label: APPS[appId].title.split("—")[0].trim(),
    description: `Open ${appId === "vscode" ? "VS Code" : appId}`,
    type: "app" as const,
    keywords: [appId, APPS[appId].title, "open", "app"],
    action: () => {
      openApp(appId);
      closeStartMenu();
    },
  }));

  const projectResults: SearchResult[] = projects.map((p) => ({
    id: `project-${p.id}`,
    label: p.name,
    description: `${p.company} · ${p.domain}`,
    type: "project" as const,
    keywords: [p.id, p.folder, p.name, p.company, ...p.stack, "project", "case"],
    action: () => {
      openExplorerProject(p.id);
      closeStartMenu();
    },
  }));

  const commandResults: SearchResult[] = [
    {
      id: "cmd-contact",
      label: "Contact Me",
      description: "Open terminal with contact info",
      type: "command",
      keywords: ["contact", "email", "hire", "reach"],
      action: () => {
        openApp("terminal");
        closeStartMenu();
      },
    },
    {
      id: "cmd-hire",
      label: "npm run hire-me",
      description: "Let's work together",
      type: "command",
      keywords: ["hire", "npm", "job", "opportunity"],
      action: () => {
        openApp("terminal");
        closeStartMenu();
      },
    },
    {
      id: "cmd-skills",
      label: "View Skills",
      description: "Open widgets panel",
      type: "command",
      keywords: ["skills", "stack", "tech", "widgets"],
      action: () => {
        openApp("widgets");
        closeStartMenu();
      },
    },
    {
      id: "cmd-resume",
      label: "Download Resume",
      description: "Rahul Kotla — PDF",
      type: "command",
      keywords: ["resume", "cv", "pdf", "download"],
      action: () => {
        const a = document.createElement("a");
        a.href = RESUME_PATH;
        a.download = "Rahul-Kotla-Resume.pdf";
        a.click();
        closeStartMenu();
      },
    },
  ];

  const linkResults: SearchResult[] = [
    {
      id: "link-email",
      label: "Email",
      description: profile.email,
      type: "link",
      keywords: ["email", "mail", profile.email],
      action: () => {
        window.location.href = `mailto:${profile.email}`;
        closeStartMenu();
      },
    },
    {
      id: "link-linkedin",
      label: "LinkedIn",
      description: profile.linkedin,
      type: "link",
      keywords: ["linkedin", "social", "profile"],
      action: () => {
        window.open(profile.linkedin, "_blank", "noopener,noreferrer");
        closeStartMenu();
      },
    },
    {
      id: "link-github",
      label: "GitHub",
      description: profile.github,
      type: "link",
      keywords: ["github", "code", "repos"],
      action: () => {
        window.open(profile.github, "_blank", "noopener,noreferrer");
        closeStartMenu();
      },
    },
  ];

  const documentResults: SearchResult[] = [
    {
      id: "doc-resume",
      label: "Rahul-Kotla-Resume.pdf",
      description: "C:\\Users\\rahul-kotla\\Documents",
      type: "document",
      keywords: ["resume", "cv", "pdf", "document"],
      action: () => {
        const a = document.createElement("a");
        a.href = RESUME_PATH;
        a.download = "Rahul-Kotla-Resume.pdf";
        a.click();
        closeStartMenu();
      },
    },
    {
      id: "doc-quantrium",
      label: "quantrium.md",
      description: "C:\\Users\\rahul-kotla\\work",
      type: "document",
      keywords: ["quantrium", "experience", "work", "markdown"],
      action: () => {
        openApp("explorer");
        closeStartMenu();
      },
    },
    {
      id: "doc-education",
      label: "education.md",
      description: "C:\\Users\\rahul-kotla\\work",
      type: "document",
      keywords: ["education", "degree", "college"],
      action: () => {
        openApp("explorer");
        closeStartMenu();
      },
    },
  ];

  return [...appResults, ...projectResults, ...documentResults, ...commandResults, ...linkResults];
}

export function filterSearchResults(results: SearchResult[], query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return results;

  return results
    .map((result) => {
      const labelMatch = result.label.toLowerCase().includes(q);
      const descMatch = result.description?.toLowerCase().includes(q);
      const keywordMatch = result.keywords.some((k) => k.toLowerCase().includes(q));
      const score =
        (result.label.toLowerCase().startsWith(q) ? 3 : 0) +
        (labelMatch ? 2 : 0) +
        (descMatch ? 1 : 0) +
        (keywordMatch ? 1 : 0);
      return { result, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ result }) => result);
}
