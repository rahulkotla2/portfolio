"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDesktopStore } from "@/store/desktop-store";
import type { AppId } from "@/types/desktop";
import { TASKBAR_HEIGHT } from "@/types/desktop";
import {
  Search,
  FolderOpen,
  Code2,
  Terminal,
  LayoutGrid,
  FileText,
  Mail,
  Github,
  Linkedin,
  Briefcase,
  Command,
  Link2,
} from "lucide-react";
import { profile } from "@/data/portfolio";
import { RecruiterLink } from "@/components/shared/RecruiterLink";
import { motion, AnimatePresence } from "framer-motion";
import { buildSearchIndex, filterSearchResults, type SearchResult } from "@/lib/search-index";
import { RESUME_PATH } from "@/lib/constants";

const pinnedApps: { id: AppId; label: string; icon: React.ReactNode }[] = [
  { id: "vscode", label: "VS Code", icon: <Code2 size={20} /> },
  { id: "explorer", label: "Projects", icon: <FolderOpen size={20} /> },
  { id: "terminal", label: "Terminal", icon: <Terminal size={20} /> },
  { id: "widgets", label: "Widgets", icon: <LayoutGrid size={20} /> },
];

const recommended = [
  { label: "coach-matching.case", app: "explorer" as AppId },
  { label: "digital-flex.case", app: "explorer" as AppId },
  { label: "fintech-kyc.case", app: "explorer" as AppId },
];

const typeIcons: Record<SearchResult["type"], React.ReactNode> = {
  app: <Code2 size={14} />,
  project: <FolderOpen size={14} />,
  document: <FileText size={14} />,
  command: <Command size={14} />,
  link: <Link2 size={14} />,
};

const SEARCH_GROUPS: { label: string; types: SearchResult["type"][] }[] = [
  { label: "Apps", types: ["app"] },
  { label: "Documents", types: ["project", "document"] },
  { label: "Commands", types: ["command"] },
  { label: "Web", types: ["link"] },
];

interface StartMenuProps {
  anchorLeft: number;
}

export function StartMenu({ anchorLeft }: StartMenuProps) {
  const { startMenuOpen, closeStartMenu, openApp, openExplorerProject, lockLockScreen } =
    useDesktopStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const searchIndex = useMemo(
    () => buildSearchIndex({ openApp, openExplorerProject, closeStartMenu }),
    [openApp, openExplorerProject, closeStartMenu]
  );

  const filteredResults = useMemo(
    () => filterSearchResults(searchIndex, query),
    [searchIndex, query]
  );

  const isSearching = query.trim().length > 0;

  useEffect(() => {
    if (startMenuOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [startMenuOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleOpen = useCallback(
    (appId: AppId) => {
      openApp(appId, { center: true });
      closeStartMenu();
    },
    [openApp, closeStartMenu]
  );

  const executeResult = useCallback((result: SearchResult) => {
    result.action();
    setQuery("");
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearching) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
      e.preventDefault();
      executeResult(filteredResults[selectedIndex]);
    } else if (e.key === "Escape") {
      closeStartMenu();
    }
  };

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex, filteredResults]);

  if (!startMenuOpen) return null;

  const menuLeft = Math.max(8, Math.min(anchorLeft, window.innerWidth - 660));

  return (
    <>
      <div className="fixed inset-0 z-[500]" onClick={closeStartMenu} aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[501] w-[min(640px,calc(100vw-1rem))] overflow-hidden rounded-xl mica-panel shadow-2xl"
        style={{ left: menuLeft, bottom: TASKBAR_HEIGHT + 8 }}
        role="dialog"
        aria-label="Start menu"
      >
        <div className="border-b border-win-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-win-bg px-4 py-2.5 ring-1 ring-win-border focus-within:ring-win-accent/50">
            <Search size={16} className="shrink-0 text-win-muted" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search apps, documents, and the web"
              className="flex-1 bg-transparent text-sm text-win-text outline-none placeholder:text-win-muted"
              aria-label="Search portfolio"
              autoComplete="off"
            />
            <kbd className="hidden rounded border border-win-border px-1.5 py-0.5 text-[10px] text-win-muted sm:inline">
              ESC
            </kbd>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-h-72 overflow-y-auto win-scroll p-2"
              ref={listRef}
            >
              {filteredResults.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-win-muted">
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : (
                SEARCH_GROUPS.map((group) => {
                  const items = filteredResults.filter((r) => group.types.includes(r.type));
                  if (!items.length) return null;
                  return (
                    <div key={group.label} className="mb-2">
                      <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-win-muted">
                        {group.label}
                      </p>
                      {items.map((result) => {
                        const index = filteredResults.indexOf(result);
                        return (
                          <button
                            key={result.id}
                            type="button"
                            onClick={() => executeResult(result)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                              index === selectedIndex ? "bg-win-accent/15 text-win-text" : "hover:bg-win-hover"
                            }`}
                          >
                            <span className="text-win-accent">{typeIcons[result.type]}</span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm">{result.label}</p>
                              {result.description && (
                                <p className="truncate text-xs text-win-muted">{result.description}</p>
                              )}
                            </div>
                            <span className="shrink-0 rounded bg-win-bg px-1.5 py-0.5 text-[10px] capitalize text-win-muted">
                              {result.type === "project" ? "document" : result.type}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 p-4 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="mb-3 text-xs font-semibold text-win-muted">Pinned</p>
                <div className="grid gap-2 [grid-template-columns:repeat(4,minmax(0,1fr))]">
                  {pinnedApps.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleOpen(app.id)}
                      className="flex min-w-0 flex-col items-center gap-2 overflow-hidden rounded-lg p-2 transition-colors hover:bg-win-hover"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-win-surface text-win-accent">
                        {app.icon}
                      </div>
                      <span className="w-full truncate text-center text-[10px] text-win-text">{app.label}</span>
                    </button>
                  ))}
                </div>

                <p className="mb-2 mt-4 text-xs font-semibold text-win-muted">Recommended</p>
                <div className="space-y-1">
                  {recommended.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleOpen(item.app)}
                      className="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-lg px-3 py-2 text-left text-xs text-win-muted transition-colors hover:bg-win-hover hover:text-win-text"
                    >
                      <FileText size={14} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden w-44 flex-col gap-2 border-l border-win-border pl-4 sm:flex">
                <p className="mb-1 text-xs font-semibold text-win-muted">Quick Links</p>
                <QuickLink icon={<Mail size={14} />} label="Email" href={`mailto:${profile.email}`} />
                <QuickLink icon={<Linkedin size={14} />} label="LinkedIn" href={profile.linkedin} />
                <QuickLink icon={<Github size={14} />} label="GitHub" href={profile.github} />
                <QuickLink icon={<Briefcase size={14} />} label="Resume" href={RESUME_PATH} download />
                <RecruiterLink className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-win-muted transition-colors hover:bg-win-hover hover:text-win-accent">
                  Recruiter view
                </RecruiterLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between border-t border-win-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-win-accent to-blue-500 text-xs font-bold text-win-bg">
              RK
            </div>
            <div>
              <p className="text-xs font-medium text-win-text">{profile.name}</p>
              <p className="text-[10px] text-win-muted">{profile.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              closeStartMenu();
              lockLockScreen();
            }}
            className="rounded-lg px-3 py-1.5 text-xs text-win-muted hover:bg-win-hover"
          >
            Lock
          </button>
        </div>
      </motion.div>
    </>
  );
}

function QuickLink({
  icon,
  label,
  href,
  download,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      download={download ? "Rahul-Kotla-Resume.pdf" : undefined}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-win-muted transition-colors hover:bg-win-hover hover:text-win-accent"
    >
      {icon}
      {label}
    </a>
  );
}
