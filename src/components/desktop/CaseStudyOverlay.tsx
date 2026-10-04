"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { projects } from "@/data/portfolio";
import { useDesktopStore } from "@/store/desktop-store";
import { DemoLinkButton } from "@/components/shared/DemoLinkButton";

export function CaseStudyOverlay() {
  const { caseStudyProjectId, closeCaseStudy } = useDesktopStore();
  const project = projects.find((p) => p.id === caseStudyProjectId);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={closeCaseStudy}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="win-scroll max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-win-border bg-win-surface shadow-2xl"
        >
          <div className="sticky top-0 flex min-w-0 items-start justify-between gap-3 border-b border-win-border bg-win-surface px-6 py-4">
            <div className="min-w-0">
              <h2 className="break-words text-lg font-semibold text-win-text">{project.name}</h2>
              <p className="break-words text-xs text-win-accent">{project.company} · {project.domain}</p>
            </div>
            <button
              type="button"
              onClick={closeCaseStudy}
              className="rounded-lg p-2 text-win-muted hover:bg-win-hover hover:text-win-text"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-6 p-6">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="rounded-full bg-win-accent/10 px-3 py-1 text-xs text-win-accent">
                  {s}
                </span>
              ))}
            </div>

            {project.metrics && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {project.metrics.map((m) => (
                  <div
                    key={m}
                    className="min-w-0 break-words rounded-lg border border-win-accent/20 bg-win-accent/5 px-3 py-2 text-center text-xs text-win-accent"
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}

            <DemoLinkButton projectId={project.id} className="w-full sm:w-auto" />

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-win-muted">Problem</h3>
              <p className="text-sm leading-relaxed text-win-text">{project.problem}</p>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-win-muted">Solution</h3>
              <p className="text-sm leading-relaxed text-win-text">{project.solution}</p>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-win-muted">Impact</h3>
              <ul className="space-y-2">
                {project.impact.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-win-muted">
                    <span className="text-win-accent">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
