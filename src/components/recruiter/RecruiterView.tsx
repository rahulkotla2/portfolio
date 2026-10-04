"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { profile, projects, skills, experience } from "@/data/portfolio";
import { RESUME_PATH, RESUME_FILENAME } from "@/lib/constants";
import { DemoLinkButton } from "@/components/shared/DemoLinkButton";
import {
  Mail,
  Linkedin,
  Github,
  Download,
  Monitor,
  MapPin,
  Briefcase,
  ChevronUp,
} from "lucide-react";

const NT = {
  bg: "#ECECEC",
  surface: "#FFFFFF",
  surfaceMuted: "#F5F5F5",
  border: "#D4D4D4",
  text: "#1A1A1A",
  muted: "#6B6B6B",
  accent: "#D71921",
  dot: "#D71921",
};

const SECTIONS = [
  { id: "about", label: "About", shortLabel: "About" },
  { id: "experience", label: "Experience", shortLabel: "Work" },
  { id: "projects", label: "Projects", shortLabel: "Projects" },
  { id: "skills", label: "Skills", shortLabel: "Skills" },
  { id: "education", label: "Education", shortLabel: "Edu" },
] as const;

function DotPattern({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden
      style={{
        backgroundImage: `radial-gradient(circle, ${NT.dot} 1.5px, transparent 1.5px)`,
        backgroundSize: "12px 12px",
      }}
    />
  );
}

export function RecruiterView({
  embedded,
  onExit,
}: {
  embedded?: boolean;
  onExit?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("about");

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setShowTop(el.scrollTop > 400);

    const offset = 140;
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      const section = document.getElementById(SECTIONS[i].id);
      if (section) {
        const top = section.getBoundingClientRect().top;
        const containerTop = el.getBoundingClientRect().top;
        if (top - containerTop <= offset) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scrollTo = (id: string) => {
    const container = scrollRef.current;
    const target = document.getElementById(id);
    if (!container || !target) return;

    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const offset = 112;

    container.scrollTo({
      top: container.scrollTop + (targetTop - containerTop) - offset,
      behavior: "smooth",
    });
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={scrollRef}
      className={
        embedded
          ? "absolute inset-0 overflow-y-auto overscroll-y-contain"
          : "fixed inset-0 z-[200] overflow-y-auto overscroll-y-contain"
      }
      style={{ backgroundColor: NT.bg, color: NT.text }}
    >
      <DotPattern className="pointer-events-none fixed inset-0 -z-10 opacity-[0.12]" />

      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{ borderColor: NT.border, backgroundColor: "rgba(255,255,255,0.92)" }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:max-w-4xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: NT.text }}
            >
              RK
              <span
                className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white"
                style={{ backgroundColor: NT.accent }}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{profile.name}</p>
              <p className="truncate text-xs" style={{ color: NT.muted }}>{profile.role}</p>
            </div>
          </div>
          {embedded && onExit ? (
            <button
              type="button"
              onClick={onExit}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors hover:border-[#D71921]/40"
              style={{ borderColor: NT.border, color: NT.muted }}
            >
              Home
            </button>
          ) : (
            <Link
              href="/"
              className="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors hover:border-[#D71921]/40"
              style={{ borderColor: NT.border, color: NT.muted }}
            >
              <Monitor size={14} />
              <span className="hidden sm:inline">Interactive OS</span>
              <span className="sm:hidden">OS</span>
            </Link>
          )}
        </div>

        <nav
          className="border-t px-2 py-2 sm:px-6"
          style={{ borderColor: `${NT.border}99` }}
          aria-label="Section navigation"
        >
          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-1.5 sm:gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className="rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors sm:px-3.5 sm:text-xs"
                style={
                  activeSection === s.id
                    ? { backgroundColor: `${NT.accent}14`, color: NT.accent }
                    : { color: NT.muted }
                }
              >
                <span className="sm:hidden">{s.shortLabel}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl overflow-x-hidden px-4 pb-32 pt-6 sm:max-w-4xl sm:px-6 sm:pb-16 sm:pt-8">
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 scroll-mt-28 sm:mb-12"
        >
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
            style={{ borderColor: `${NT.accent}40`, backgroundColor: `${NT.accent}0D`, color: NT.accent }}
          >
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: NT.accent }} />
              <span className="h-1.5 w-1.5 rounded-full opacity-60" style={{ backgroundColor: NT.accent }} />
              <span className="h-1.5 w-1.5 rounded-full opacity-30" style={{ backgroundColor: NT.accent }} />
            </span>
            Open to opportunities
          </div>

          <h1 className="mb-2 break-words text-2xl font-bold tracking-tight sm:text-4xl">
            {profile.name}
          </h1>
          <p className="mb-1 break-words text-base sm:text-lg" style={{ color: NT.accent }}>
            {profile.role}
          </p>
          <p className="mb-5 break-words text-sm" style={{ color: NT.muted }}>{profile.tagline}</p>

          <p className="mb-6 max-w-2xl break-words text-sm leading-relaxed sm:text-base" style={{ color: NT.muted }}>
            {profile.summary}
          </p>

          <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-sm" style={{ color: NT.muted }}>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin size={14} className="shrink-0" style={{ color: NT.accent }} />
              <span className="break-words">{profile.location}</span>
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Briefcase size={14} className="shrink-0" style={{ color: NT.accent }} />
              <span className="break-words">{experience.period}</span>
            </span>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {profile.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden rounded-xl border p-3 text-center sm:p-4"
                style={{ borderColor: NT.border, backgroundColor: NT.surface }}
              >
                <DotPattern className="absolute inset-0 opacity-[0.06]" />
                <p className="relative text-lg font-bold sm:text-xl" style={{ color: NT.accent }}>{s.value}</p>
                <p className="relative mt-1 break-words text-[10px] leading-snug sm:text-xs" style={{ color: NT.muted }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="hidden flex-wrap gap-2.5 sm:flex">
            <CtaButton href={`mailto:${profile.email}`} primary icon={<Mail size={16} />}>
              Email Me
            </CtaButton>
            <CtaButton href={RESUME_PATH} download={RESUME_FILENAME} icon={<Download size={16} />}>
              Resume PDF
            </CtaButton>
            <CtaButton href={profile.linkedin} external icon={<Linkedin size={16} />}>
              LinkedIn
            </CtaButton>
            <CtaButton href={profile.github} external icon={<Github size={16} />}>
              GitHub
            </CtaButton>
          </div>
        </motion.section>

        <Section id="experience" title="Experience">
          <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: NT.border, backgroundColor: NT.surface }}>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words text-base font-semibold sm:text-lg">{experience.role}</h3>
                <p className="break-words text-sm" style={{ color: NT.accent }}>{experience.company}</p>
              </div>
              <span
                className="w-fit shrink-0 rounded-full px-3 py-1 text-xs"
                style={{ backgroundColor: NT.surfaceMuted, color: NT.muted }}
              >
                {experience.period}
              </span>
            </div>
            <p className="mb-4 text-xs" style={{ color: NT.muted }}>{experience.location} · Remote</p>
            <ul className="space-y-3">
              {experience.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed" style={{ color: NT.muted }}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: NT.accent }} />
                  <span className="min-w-0 break-words">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section id="projects" title="Featured Projects">
          <div className="space-y-4 sm:space-y-5">
            {projects.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border p-5 transition-colors hover:border-[#D71921]/25 sm:p-6"
                style={{ borderColor: NT.border, backgroundColor: NT.surface }}
              >
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-base font-semibold leading-snug sm:text-lg">{p.name}</h3>
                    <p className="mt-1 break-words text-sm" style={{ color: NT.accent }}>{p.company}</p>
                    <p className="mt-0.5 break-words text-xs" style={{ color: NT.muted }}>{p.domain}</p>
                  </div>
                  <DemoLinkButton projectId={p.id} size="sm" className="w-full shrink-0 sm:w-auto" />
                </div>

                {p.metrics && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {p.metrics.map((m) => (
                      <span
                        key={m}
                        className="max-w-full break-words rounded-lg border px-2.5 py-1 text-[11px] font-medium sm:text-xs"
                        style={{ borderColor: `${NT.accent}30`, backgroundColor: `${NT.accent}0A`, color: NT.accent }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mb-4 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-md px-2 py-0.5 text-[10px] sm:text-[11px]"
                      style={{ backgroundColor: NT.surfaceMuted, color: NT.muted }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 text-sm leading-relaxed">
                  <Block label="Problem" muted>{p.problem}</Block>
                  <Block label="Solution">{p.solution}</Block>
                  <div>
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: NT.muted }}>
                      Impact
                    </p>
                    <ul className="space-y-1.5">
                      {p.impact.map((item) => (
                        <li key={item} className="flex gap-2" style={{ color: NT.muted }}>
                          <span className="shrink-0" style={{ color: NT.accent }}>✓</span>
                          <span className="min-w-0 break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section id="skills" title="Technical Skills">
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {Object.entries(skills).map(([cat, items]) => (
              <div
                key={cat}
                className="rounded-2xl border p-4 sm:p-5"
                style={{ borderColor: NT.border, backgroundColor: NT.surface }}
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: NT.accent }}>
                  {cat}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border px-2.5 py-1 text-xs"
                      style={{ borderColor: NT.border, backgroundColor: NT.surfaceMuted, color: NT.text }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="education" title="Education">
          <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: NT.border, backgroundColor: NT.surface }}>
            <h3 className="break-words text-base font-semibold sm:text-lg">{profile.education.school}</h3>
            <p className="mt-1 break-words text-sm" style={{ color: NT.accent }}>{profile.education.degree}</p>
            <p className="mt-2 break-words text-sm" style={{ color: NT.muted }}>
              {profile.education.period} · {profile.education.location}
            </p>
          </div>
        </Section>

        <footer className="mt-10 border-t pt-8 text-center sm:mt-12" style={{ borderColor: NT.border }}>
          <p className="text-sm" style={{ color: NT.muted }}>Open to full-time frontend & full-stack roles.</p>
          <Link href="/" className="mt-3 inline-flex items-center gap-1.5 text-sm hover:underline" style={{ color: NT.accent }}>
            <Monitor size={14} />
            Try the interactive desktop portfolio
          </Link>
        </footer>
      </main>

      <div
        className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t p-3 backdrop-blur-xl sm:hidden"
        style={{ borderColor: NT.border, backgroundColor: "rgba(255,255,255,0.95)" }}
      >
        <a
          href={`mailto:${profile.email}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white"
          style={{ backgroundColor: NT.accent }}
        >
          <Mail size={16} />
          Email
        </a>
        <a
          href={RESUME_PATH}
          download={RESUME_FILENAME}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm"
          style={{ borderColor: NT.border, backgroundColor: NT.surface, color: NT.text }}
        >
          <Download size={16} />
          Resume
        </a>
      </div>

      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-[4.75rem] right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg transition-colors sm:bottom-6"
          style={{ borderColor: NT.border, backgroundColor: NT.surface, color: NT.muted }}
          aria-label="Back to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-28 sm:mb-12">
      <h2 className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider sm:mb-5" style={{ color: NT.muted }}>
        <span className="h-px flex-1" style={{ backgroundColor: NT.border }} />
        {title}
        <span className="h-px flex-1" style={{ backgroundColor: NT.border }} />
      </h2>
      {children}
    </section>
  );
}

function Block({ label, children, muted }: { label: string; children: React.ReactNode; muted?: boolean }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: NT.muted }}>{label}</p>
      <p className="break-words" style={{ color: muted ? NT.muted : NT.text }}>{children}</p>
    </div>
  );
}

function CtaButton({
  href,
  children,
  icon,
  primary,
  external,
  download,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  primary?: boolean;
  external?: boolean;
  download?: string;
}) {
  const className = primary
    ? "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
    : "inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm transition-colors hover:border-[#D71921]/40";

  const style = primary
    ? { backgroundColor: NT.accent }
    : { borderColor: NT.border, backgroundColor: NT.surface, color: NT.text };

  if (download) {
    return (
      <a href={href} download={download} className={className} style={style}>
        {icon}
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      style={style}
    >
      {icon}
      {children}
    </a>
  );
}
