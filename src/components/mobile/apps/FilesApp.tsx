"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, experience, profile } from "@/data/portfolio";
import type { Project } from "@/data/portfolio";
import { DemoLinkButton } from "@/components/shared/DemoLinkButton";
import { FILES } from "./app-tokens";

interface FilesAppProps {
  onBack: () => void;
}

type Path = "root" | "rahul-kotla" | "projects" | "work" | "experience" | "education";

const breadcrumbs: Record<Path, string> = {
  root: "Portfolio Drive",
  "rahul-kotla": "rahul-kotla",
  projects: "projects",
  work: "work",
  experience: "quantrium.md",
  education: "education.md",
};

const PORTFOLIO_STORAGE = `${projects.length} case studies · 3+ yrs experience · EdTech & FinTech`;

export function FilesApp({ onBack }: FilesAppProps) {
  const [path, setPath] = useState<Path[]>(["root"]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const current = path[path.length - 1];

  const goTo = (next: Path) => setPath((p) => [...p, next]);
  const goBack = () => {
    if (path.length === 1) onBack();
    else setPath((p) => p.slice(0, -1));
  };

  const pathLabel = path.map((p) => breadcrumbs[p] ?? p).join(" › ");

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: FILES.bg, fontFamily: FILES.font }}>
      <header
        className="flex shrink-0 items-center gap-2 px-2 py-2"
        style={{ backgroundColor: FILES.surface }}
      >
        <button type="button" onClick={goBack} className="p-2" aria-label="Back">
          <FiBack />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[20px] font-normal" style={{ color: FILES.text }}>Files</p>
          <p className="truncate text-[12px]" style={{ color: FILES.secondary }}>{pathLabel}</p>
        </div>
        <button type="button" className="p-2" aria-label="Search">
          <FiSearch />
        </button>
      </header>

      <div className="nothing-scroll flex-1 overflow-y-auto">
        {current === "root" && (
          <>
            <div className="mx-3 mb-2 mt-1 rounded-xl border px-3 py-2.5" style={{ borderColor: FILES.border, backgroundColor: FILES.surface }}>
              <p className="text-[12px] leading-snug" style={{ color: FILES.secondary }}>
                Full project case studies live here. Instagram shows visuals only.
              </p>
            </div>
            <Row icon={<FiStorage />} name="Portfolio Drive" meta={PORTFOLIO_STORAGE} onClick={() => goTo("rahul-kotla")} />
          </>
        )}

        {current === "rahul-kotla" && (
          <>
            <Row icon={<FiFolder />} name="projects" meta={`${projects.length} items`} onClick={() => goTo("projects")} />
            <Row icon={<FiFolder />} name="work" meta="2 items" onClick={() => goTo("work")} />
          </>
        )}

        {current === "projects" &&
          projects.map((p) => (
            <Row
              key={p.id}
              icon={<FiFolder />}
              name={p.folder}
              meta={p.company}
              onClick={() => setSelectedProject(p)}
            />
          ))}

        {current === "work" && (
          <>
            <Row icon={<FiFile />} name="quantrium.md" meta={experience.period} onClick={() => goTo("experience")} />
            <Row icon={<FiFile />} name="education.md" meta={profile.education.period} onClick={() => goTo("education")} />
          </>
        )}

        {current === "experience" && (
          <DocView title={experience.role} subtitle={`${experience.company} · ${experience.period}`} body={experience.highlights.join("\n\n")} />
        )}

        {current === "education" && (
          <DocView title={profile.education.degree} subtitle={profile.education.school} body={`${profile.education.period}\n${profile.education.location}`} />
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/35"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 340 }}
              className="absolute inset-x-0 bottom-0 z-50 max-h-[85%] overflow-hidden rounded-t-[16px] bg-white"
              style={{ fontFamily: FILES.font }}
            >
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: FILES.border }}>
                <p className="truncate text-[16px] font-medium" style={{ color: FILES.text }}>{selectedProject.name}</p>
                <button type="button" onClick={() => setSelectedProject(null)} aria-label="Close">
                  <FiClose />
                </button>
              </div>
              <div className="nothing-scroll overflow-y-auto px-4 py-4">
                <p className="text-[13px]" style={{ color: FILES.primary }}>{selectedProject.company} · {selectedProject.domain}</p>
                <DemoLinkButton projectId={selectedProject.id} className="my-4 w-full" />
                <Section title="Problem" text={selectedProject.problem} />
                <Section title="Solution" text={selectedProject.solution} />
                <Section title="Impact" items={selectedProject.impact} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ icon, name, meta, onClick }: { icon: React.ReactNode; name: string; meta: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 px-4 py-[14px] text-left active:bg-[#F1F3F4]"
    >
      {icon}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px]" style={{ color: FILES.text }}>{name}</p>
        <p className="truncate text-[13px]" style={{ color: FILES.secondary }}>{meta}</p>
      </div>
      <FiChevron />
    </button>
  );
}

function DocView({ title, subtitle, body }: { title: string; subtitle: string; body: string }) {
  return (
    <div className="px-4 py-6">
      <h2 className="text-[20px] font-normal" style={{ color: FILES.text }}>{title}</h2>
      <p className="mt-1 text-[14px]" style={{ color: FILES.secondary }}>{subtitle}</p>
      <pre className="mt-4 whitespace-pre-wrap text-[14px] leading-[22px]" style={{ color: FILES.text }}>{body}</pre>
    </div>
  );
}

function Section({ title, text, items }: { title: string; text?: string; items?: string[] }) {
  return (
    <div className="mb-4">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: FILES.secondary }}>{title}</p>
      {text && <p className="text-[14px] leading-[22px]" style={{ color: FILES.text }}>{text}</p>}
      {items && items.map((item) => (
        <p key={item} className="text-[14px]" style={{ color: FILES.secondary }}>• {item}</p>
      ))}
    </div>
  );
}

function FiBack() {
  return <svg width="24" height="24" fill="none" stroke="#1A73E8" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>;
}

function FiSearch() {
  return <svg width="22" height="22" fill="none" stroke="#5F6368" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>;
}

function FiClose() {
  return <svg width="20" height="20" fill="none" stroke="#5F6368" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>;
}

function FiChevron() {
  return <svg width="18" height="18" fill="none" stroke="#5F6368" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>;
}

function FiFolder() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <path d="M6 10h12l3 3h15v19a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z" fill="#F9AB00" />
      <path d="M18 10v3h15l-3-3H18z" fill="#FDE293" />
    </svg>
  );
}

function FiFile() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <path d="M10 6h14l8 8v20a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="#AECBFA" />
      <path d="M24 6v8h8l-8-8z" fill="#D2E3FC" />
      <path d="M12 22h16v2H12zm0 5h12v2H12z" fill="#4285F4" />
    </svg>
  );
}

function FiStorage() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <rect x="6" y="10" width="28" height="20" rx="3" fill="#5F6368" />
      <circle cx="14" cy="20" r="2" fill="#E8EAED" />
      <rect x="18" y="18" width="12" height="4" rx="1" fill="#E8EAED" />
    </svg>
  );
}
