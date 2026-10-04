"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowUp,
  HardDrive,
  ExternalLink,
  PanelLeft,
  Search,
  Star,
} from "lucide-react";
import { projects, experience, profile } from "@/data/portfolio";
import type { Project } from "@/data/portfolio";
import { useDesktopStore } from "@/store/desktop-store";
import { DemoLinkButton } from "@/components/shared/DemoLinkButton";

type NavPath = "projects" | "work" | "root";
type LayoutMode = "wide" | "medium" | "compact";

const INDENT = 14;

function getLayoutMode(width: number): LayoutMode {
  if (width < 420) return "compact";
  if (width < 680) return "medium";
  return "wide";
}

export function ExplorerApp() {
  const explorerProjectId = useDesktopStore((s) => s.explorerProjectId);
  const openCaseStudy = useDesktopStore((s) => s.openCaseStudy);
  const containerRef = useRef<HTMLDivElement>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("wide");
  const [treeOpen, setTreeOpen] = useState(false);
  const [hist, setHist] = useState<{ stack: NavPath[]; idx: number }>({
    stack: ["projects"],
    idx: 0,
  });
  const navPath = hist.stack[hist.idx];
  const setNavPath = (next: NavPath) => {
    setHist((h) => {
      const cut = h.stack.slice(0, h.idx + 1);
      if (cut[cut.length - 1] === next) return { stack: cut, idx: cut.length - 1 };
      return { stack: [...cut, next], idx: cut.length };
    });
  };
  const canGoBack = hist.idx > 0;
  const canGoForward = hist.idx < hist.stack.length - 1;
  const goBackNav = () => {
    if (!canGoBack) return;
    setHist((h) => ({ ...h, idx: h.idx - 1 }));
  };
  const goForwardNav = () => {
    if (!canGoForward) return;
    setHist((h) => ({ ...h, idx: h.idx + 1 }));
  };
  const goUp = () => {
    if (navPath !== "root") setNavPath("root");
  };
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["rahul-kotla", "projects", "work"])
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [folderQuery, setFolderQuery] = useState("");

  const updateLayout = useCallback(() => {
    const width = containerRef.current?.clientWidth ?? 900;
    setLayoutMode(getLayoutMode(width));
    if (width >= 420) setTreeOpen(false);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateLayout]);

  useEffect(() => {
    if (explorerProjectId) {
      const p = projects.find((pr) => pr.id === explorerProjectId);
      if (p) {
        setNavPath("projects");
        setSelectedProject(p);
        setSelectedFile(null);
        setExpandedFolders((prev) => new Set([...prev, "rahul-kotla", "projects"]));
      }
    }
  }, [explorerProjectId]);

  const toggleFolder = (name: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectProject = (p: Project) => {
    setNavPath("projects");
    setSelectedProject(p);
    setSelectedFile(null);
    if (layoutMode === "compact") setTreeOpen(false);
  };

  const selectFile = (file: string) => {
    setNavPath("work");
    setSelectedFile(file);
    setSelectedProject(null);
    if (layoutMode === "compact") setTreeOpen(false);
  };

  const showSidebar = layoutMode !== "compact" || treeOpen;
  const showPreview = layoutMode === "wide";

  const tree = (
    <>
      <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-win-muted">Quick access</p>
      <TreeRow
        level={0}
        label="Projects"
        icon={<Star size={14} className="shrink-0 text-win-accent" />}
        selected={navPath === "projects"}
        onSelect={() => setNavPath("projects")}
      />
      <TreeRow
        level={0}
        label="Work"
        icon={<Star size={14} className="shrink-0 text-win-accent" />}
        selected={navPath === "work"}
        onSelect={() => setNavPath("work")}
      />
      <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-win-muted">This PC</p>
      <TreeRow
        level={0}
        label="Local Disk (C:)"
        icon={<HardDrive size={14} className="shrink-0 text-win-muted" />}
        selected={navPath === "root"}
        onSelect={() => setNavPath("root")}
      />
      <TreeRow
        level={0}
        label="rahul-kotla"
        icon={<Folder size={14} className="shrink-0 text-[#fcd53f]" />}
        expanded={expandedFolders.has("rahul-kotla")}
        hasChildren
        onToggle={() => toggleFolder("rahul-kotla")}
        onSelect={() => toggleFolder("rahul-kotla")}
      />
      {expandedFolders.has("rahul-kotla") && (
        <>
          <TreeRow
            level={1}
            label="projects"
            icon={<Folder size={14} className="shrink-0 text-[#fcd53f]" />}
            expanded={expandedFolders.has("projects")}
            hasChildren
            selected={navPath === "projects" && !selectedProject}
            onToggle={() => toggleFolder("projects")}
            onSelect={() => {
              setNavPath("projects");
              toggleFolder("projects");
            }}
          />
          {expandedFolders.has("projects") &&
            projects.map((p) => (
              <TreeRow
                key={p.id}
                level={2}
                label={p.folder}
                icon={<Folder size={14} className="shrink-0 text-[#fcd53f]" />}
                selected={navPath === "projects" && selectedProject?.id === p.id}
                onSelect={() => selectProject(p)}
              />
            ))}
          <TreeRow
            level={1}
            label="work"
            icon={<Folder size={14} className="shrink-0 text-[#fcd53f]" />}
            expanded={expandedFolders.has("work")}
            hasChildren
            selected={navPath === "work" && !selectedFile}
            onToggle={() => toggleFolder("work")}
            onSelect={() => {
              setNavPath("work");
              toggleFolder("work");
            }}
          />
          {expandedFolders.has("work") &&
            ["quantrium.md", "education.md"].map((file) => (
              <TreeRow
                key={file}
                level={2}
                label={file}
                icon={<FileText size={14} className="shrink-0 text-win-muted" />}
                selected={navPath === "work" && selectedFile === file}
                onSelect={() => selectFile(file)}
              />
            ))}
        </>
      )}
    </>
  );

  return (
    <div ref={containerRef} className="flex h-full min-w-0 flex-col overflow-hidden">
      <div className="flex h-9 shrink-0 items-center gap-0.5 border-b border-win-border bg-win-surface px-1.5">
        <NavBtn label="Back" disabled={!canGoBack} onClick={goBackNav}>
          <ChevronLeft size={14} />
        </NavBtn>
        <NavBtn label="Forward" disabled={!canGoForward} onClick={goForwardNav}>
          <ChevronRight size={14} />
        </NavBtn>
        <NavBtn label="Up" disabled={navPath === "root"} onClick={goUp}>
          <ArrowUp size={13} />
        </NavBtn>
        {layoutMode === "compact" && (
          <button
            type="button"
            onClick={() => setTreeOpen((v) => !v)}
            className={`shrink-0 rounded p-1 ${treeOpen ? "bg-win-accent/15 text-win-accent" : "text-win-muted hover:text-win-text"}`}
            aria-label="Toggle navigation pane"
          >
            <PanelLeft size={14} />
          </button>
        )}
        <div className="ml-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden rounded border border-win-border bg-win-bg px-2 py-0.5 text-[11px] text-win-muted">
          <HardDrive size={12} className="shrink-0" />
          <span className="shrink-0">C:</span>
          <ChevronRight size={10} className="shrink-0" />
          <span className="shrink-0">Users</span>
          <ChevronRight size={10} className="shrink-0" />
          <button type="button" onClick={() => setNavPath("root")} className="shrink-0 truncate hover:text-win-accent">
            rahul-kotla
          </button>
          {navPath !== "root" && (
            <>
              <ChevronRight size={10} className="shrink-0" />
              <span className="min-w-0 truncate text-win-text">{navPath}</span>
            </>
          )}
        </div>
        <label className="flex h-7 w-[min(160px,32%)] shrink-0 items-center gap-1 rounded border border-win-border bg-win-bg px-1.5">
          <Search size={11} className="shrink-0 text-win-muted" />
          <input
            type="search"
            value={folderQuery}
            onChange={(e) => setFolderQuery(e.target.value)}
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent text-[11px] text-win-text outline-none placeholder:text-win-muted"
            aria-label="Search this folder"
          />
        </label>
      </div>

      <div className="relative flex min-h-0 min-w-0 flex-1">
        {layoutMode === "compact" && treeOpen && (
          <button
            type="button"
            className="absolute inset-0 z-10 bg-black/40"
            onClick={() => setTreeOpen(false)}
            aria-label="Close navigation"
          />
        )}

        {showSidebar && (
          <div
            className={`win-scroll min-w-0 shrink-0 overflow-x-hidden overflow-y-auto border-r border-win-border bg-[#0d1117] py-0.5 ${
              layoutMode === "compact"
                ? "absolute left-0 top-0 z-20 h-full w-[min(220px,85%)] shadow-xl"
                : layoutMode === "medium"
                  ? "w-[32%] max-w-[160px]"
                  : "w-[22%] max-w-[200px]"
            }`}
          >
            {tree}
          </div>
        )}

        <div className="flex min-w-0 flex-1">
          <div className="win-scroll min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3">
            {navPath === "projects" && (
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns:
                    layoutMode === "compact" ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))",
                }}
              >
                {projects
                  .filter((p) =>
                    !folderQuery.trim()
                      ? true
                      : `${p.name} ${p.folder} ${p.company}`.toLowerCase().includes(folderQuery.toLowerCase())
                  )
                  .map((p, i) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => selectProject(p)}
                    onDoubleClick={() => openCaseStudy(p.id)}
                    title={p.name}
                    className={`flex w-full min-w-0 flex-col items-center overflow-hidden rounded-lg border p-2.5 ${
                      selectedProject?.id === p.id
                        ? "border-win-accent bg-win-accent/5"
                        : "border-win-border bg-win-surface hover:border-win-accent/50"
                    }`}
                  >
                    <FolderOpen
                      size={layoutMode === "compact" ? 28 : 36}
                      className="shrink-0 text-[#fcd53f]"
                    />
                    <span className="mt-1.5 w-full px-0.5 text-center text-[11px] leading-snug text-win-text line-clamp-2 [overflow-wrap:anywhere]">
                      {p.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {navPath === "work" && (
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns:
                    layoutMode === "compact" ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))",
                }}
              >
                <FileCard
                  name="quantrium.md"
                  selected={selectedFile === "quantrium.md"}
                  onClick={() => selectFile("quantrium.md")}
                  compact={layoutMode === "compact"}
                />
                <FileCard
                  name="education.md"
                  selected={selectedFile === "education.md"}
                  onClick={() => selectFile("education.md")}
                  compact={layoutMode === "compact"}
                />
              </div>
            )}

            {navPath === "root" && (
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns:
                    layoutMode === "compact" ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))",
                }}
              >
                <FolderCard label="projects" onClick={() => setNavPath("projects")} compact={layoutMode === "compact"} />
                <FolderCard label="work" onClick={() => setNavPath("work")} compact={layoutMode === "compact"} />
              </div>
            )}

            {!showPreview && (selectedProject || selectedFile) && (
              <div className="mt-3 border-t border-win-border pt-3">
                {selectedProject && navPath === "projects" && (
                  <ProjectPreview
                    project={selectedProject}
                    onOpenCaseStudy={() => openCaseStudy(selectedProject.id)}
                    compact
                  />
                )}
                {selectedFile === "quantrium.md" && navPath === "work" && <WorkPreview compact />}
                {selectedFile === "education.md" && navPath === "work" && <EducationPreview compact />}
              </div>
            )}
          </div>

          {showPreview && (
            <div className="win-scroll min-h-0 min-w-0 w-[min(240px,36%)] shrink-0 overflow-x-hidden overflow-y-auto border-l border-win-border bg-win-surface p-3">
              <AnimatePresence mode="wait">
                {selectedProject && navPath === "projects" && (
                  <ProjectPreview
                    key={selectedProject.id}
                    project={selectedProject}
                    onOpenCaseStudy={() => openCaseStudy(selectedProject.id)}
                  />
                )}
                {selectedFile === "quantrium.md" && navPath === "work" && <WorkPreview key="work" />}
                {selectedFile === "education.md" && navPath === "work" && <EducationPreview key="edu" />}
                {!selectedProject && !selectedFile && (
                  <p className="text-xs text-win-muted">Select a file to preview</p>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="flex h-5 shrink-0 items-center justify-between border-t border-win-border bg-win-surface px-2 text-[10px] text-win-muted">
        <span className="truncate">{projects.length} items</span>
        <span className="hidden truncate sm:inline">{showPreview ? "Preview pane" : "Details below"}</span>
      </div>
    </div>
  );
}

function NavBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-win-muted hover:bg-win-hover hover:text-win-text disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function TreeRow({
  level,
  label,
  icon,
  expanded,
  hasChildren,
  selected,
  onToggle,
  onSelect,
}: {
  level: number;
  label: string;
  icon: React.ReactNode;
  expanded?: boolean;
  hasChildren?: boolean;
  selected?: boolean;
  onToggle?: () => void;
  onSelect: () => void;
}) {
  return (
    <div
      className={`flex h-[24px] min-w-0 items-center pr-1 ${
        selected ? "bg-win-accent/15 text-win-accent" : "text-win-muted hover:bg-win-hover/80"
      }`}
      style={{ paddingLeft: 4 + level * INDENT }}
    >
      <button
        type="button"
        onClick={hasChildren ? onToggle : undefined}
        className={`flex h-4 w-4 shrink-0 items-center justify-center ${
          hasChildren ? "text-win-muted hover:text-win-text" : "pointer-events-none opacity-0"
        }`}
        tabIndex={hasChildren ? 0 : -1}
      >
        {hasChildren && (expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />)}
      </button>
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden text-left"
      >
        {icon}
        <span className="truncate text-[11px] leading-none">{label}</span>
      </button>
    </div>
  );
}

function FolderCard({
  label,
  onClick,
  compact,
}: {
  label: string;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full min-w-0 flex-col items-center overflow-hidden rounded-lg border border-win-border bg-win-surface p-2.5 hover:border-win-accent/50"
    >
      <Folder size={compact ? 28 : 36} className="shrink-0 text-[#fcd53f]" />
      <span className="mt-1.5 w-full text-center text-[11px] leading-snug text-win-text line-clamp-2 [overflow-wrap:anywhere]">
        {label}
      </span>
    </button>
  );
}

function FileCard({
  name,
  selected,
  onClick,
  compact,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full min-w-0 flex-col items-center overflow-hidden rounded-lg border p-2.5 ${
        selected ? "border-win-accent bg-win-accent/5" : "border-win-border bg-win-surface hover:border-win-accent/50"
      }`}
    >
      <FileText size={compact ? 28 : 32} className="shrink-0 text-win-accent" />
      <span className="mt-1.5 w-full text-center text-[11px] leading-snug text-win-text line-clamp-2 [overflow-wrap:anywhere]">
        {name}
      </span>
    </button>
  );
}

function ProjectPreview({
  project,
  onOpenCaseStudy,
  compact,
}: {
  project: Project;
  onOpenCaseStudy: () => void;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: compact ? 0 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="min-w-0 space-y-2"
    >
      <h3 className="break-words text-sm font-semibold text-win-text">{project.name}</h3>
      <p className="break-words text-[10px] text-win-muted">{project.company} · {project.domain}</p>
      <button
        type="button"
        onClick={onOpenCaseStudy}
        className="flex w-full items-center justify-center gap-1 rounded border border-win-accent/30 bg-win-accent/10 py-1.5 text-[10px] text-win-accent hover:bg-win-accent/20"
      >
        <ExternalLink size={10} />
        Open full case study
      </button>
      <DemoLinkButton projectId={project.id} size="sm" className="w-full" />
      <div className="flex flex-wrap gap-1">
        {project.stack.slice(0, compact ? 3 : 4).map((s) => (
          <span key={s} className="rounded bg-win-bg px-1.5 py-0.5 text-[9px] text-win-accent">
            {s}
          </span>
        ))}
      </div>
      {!compact && project.metrics && (
        <div className="space-y-1">
          {project.metrics.map((m) => (
            <div key={m} className="break-words rounded border border-win-accent/20 bg-win-accent/5 px-2 py-1 text-[10px] text-win-accent">
              {m}
            </div>
          ))}
        </div>
      )}
      <PreviewBlock label="Problem" text={project.problem} />
      {!compact && <PreviewBlock label="Solution" text={project.solution} />}
    </motion.div>
  );
}

function PreviewBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="min-w-0">
      <h4 className="mb-0.5 text-[10px] font-semibold uppercase text-win-muted">{label}</h4>
      <p className="break-words text-[11px] leading-relaxed text-win-muted">{text}</p>
    </div>
  );
}

function WorkPreview({ compact }: { compact?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0 space-y-2">
      <h3 className="break-words text-sm font-semibold text-win-text">{experience.role}</h3>
      <p className="break-words text-xs text-win-accent">{experience.company}</p>
      <p className="text-[10px] text-win-muted">{experience.period} · {experience.location}</p>
      {!compact && (
        <ul className="space-y-1.5">
          {experience.highlights.map((h) => (
            <li key={h} className="break-words text-[11px] text-win-muted">→ {h}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function EducationPreview({ compact }: { compact?: boolean }) {
  const { education } = profile;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0 space-y-1">
      <h3 className="break-words text-sm font-semibold text-win-text">{education.school}</h3>
      <p className="break-words text-xs text-win-accent">{education.degree}</p>
      <p className="break-words text-[10px] text-win-muted">{education.period}</p>
      {!compact && <p className="break-words text-[10px] text-win-muted">{education.location}</p>}
    </motion.div>
  );
}
