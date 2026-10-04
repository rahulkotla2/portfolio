"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile, experience } from "@/data/portfolio";
import { RESUME_PATH, RESUME_FILENAME } from "@/lib/constants";
import { useDesktopStore } from "@/store/desktop-store";

type Tab = "readme" | "about" | "education";
type EditorView = "source" | "preview";

const FILES: { id: Tab; name: string }[] = [
  { id: "readme", name: "README.md" },
  { id: "about", name: "about.md" },
  { id: "education", name: "education.md" },
];

function fileSource(id: Tab): string {
  if (id === "about") {
    return [
      `# About`,
      ``,
      profile.summary,
      ``,
      `## Highlights`,
      ``,
      ...experience.highlights.map((h) => `- ${h}`),
      ``,
      `## Contact`,
      ``,
      `- Email: [${profile.email}](mailto:${profile.email})`,
      `- LinkedIn: [${profile.linkedin}](${profile.linkedin})`,
      `- GitHub: [${profile.github}](${profile.github})`,
      ``,
    ].join("\n");
  }
  if (id === "education") {
    const { education } = profile;
    return [
      `# Education`,
      ``,
      `## ${education.school}`,
      ``,
      `**${education.degree}**`,
      ``,
      `- ${education.period}`,
      `- ${education.location}`,
      ``,
    ].join("\n");
  }
  return [
    `# ${profile.name}`,
    ``,
    `**${profile.role}**`,
    ``,
    profile.tagline,
    ``,
    `[View Projects](command:explorer) · [Contact Me](command:terminal) · [Download Resume](${RESUME_PATH})`,
    ``,
    `## About`,
    ``,
    profile.summary,
    ``,
    `## Quick Stats`,
    ``,
    "```ts",
    "const rahul = {",
    '  experience: "3+ years",',
    '  domains: ["EdTech", "FinTech"],',
    '  stack: ["Vue", "React", "FastAPI", "Java"],',
    `  location: "${profile.location}",`,
    '  status: "Open to opportunities"',
    "};",
    "```",
    ``,
    `## Current Role`,
    ``,
    `**${experience.role}** at ${experience.company}  `,
    `${experience.period} · ${experience.location}`,
    ``,
  ].join("\n");
}

export function VSCodeApp() {
  const [activeTab, setActiveTab] = useState<Tab>("readme");
  const [view, setView] = useState<EditorView>("source");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const openApp = useDesktopStore((s) => s.openApp);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fit = () => setSidebarOpen(el.clientWidth >= 520);
    fit();
    const obs = new ResizeObserver(fit);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const source = useMemo(() => fileSource(activeTab), [activeTab]);
  const lines = source.split("\n");
  const file = FILES.find((f) => f.id === activeTab)!;

  const runCommand = useCallback(
    (href: string) => {
      if (href === "command:explorer") openApp("explorer", { center: true });
      else if (href === "command:terminal") openApp("terminal", { center: true });
      else if (href === RESUME_PATH) {
        const a = document.createElement("a");
        a.href = RESUME_PATH;
        a.download = RESUME_FILENAME;
        a.click();
      } else if (href.startsWith("mailto:") || href.startsWith("http")) {
        window.open(href, href.startsWith("http") ? "_blank" : undefined, "noopener,noreferrer");
      }
    },
    [openApp]
  );

  return (
    <div ref={containerRef} className="flex h-full min-w-0 overflow-hidden bg-[#1e1e1e] text-[#cccccc]">
      {/* Activity bar — VS Code left strip */}
      <div className="flex w-12 shrink-0 flex-col items-center border-r border-[#2b2b2b] bg-[#181818] py-1">
        <ActivityIcon active title="Explorer" onClick={() => setSidebarOpen((v) => !v)}>
          <FilesGlyph />
        </ActivityIcon>
        <ActivityIcon title="Search">
          <SearchGlyph />
        </ActivityIcon>
        <ActivityIcon title="Source Control">
          <GitGlyph />
        </ActivityIcon>
      </div>

      {sidebarOpen && (
        <div className="flex w-[220px] shrink-0 flex-col overflow-hidden border-r border-[#2b2b2b] bg-[#181818]">
          <div className="flex h-9 items-center px-4 text-[11px] font-semibold tracking-[0.08em] text-[#bbbbbb]">
            EXPLORER
          </div>
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 text-left text-[11px] font-semibold tracking-[0.04em] text-[#bbbbbb]"
          >
            <ChevronDown />
            PORTFOLIO
          </button>
          {FILES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveTab(f.id)}
              className={`flex w-full items-center gap-1.5 py-[3px] pl-6 pr-2 text-left text-[13px] ${
                activeTab === f.id ? "bg-[#37373d] text-white" : "text-[#cccccc] hover:bg-[#2a2d2e]"
              }`}
            >
              <MdGlyph />
              <span className="truncate">{f.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-9 shrink-0 items-stretch overflow-x-auto bg-[#181818]">
          {FILES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveTab(f.id)}
              className={`flex max-w-[180px] items-center gap-1.5 border-r border-[#1e1e1e] px-3 text-[13px] ${
                activeTab === f.id
                  ? "bg-[#1e1e1e] text-[#ffffff] shadow-[inset_0_1px_0_#0078d4]"
                  : "bg-[#2d2d2d] text-[#969696] hover:bg-[#323232]"
              }`}
            >
              <MdGlyph />
              <span className="truncate">{f.name}</span>
            </button>
          ))}
          <div className="ml-auto flex items-center pr-2">
            <button
              type="button"
              onClick={() => setView((v) => (v === "source" ? "preview" : "source"))}
              className={`rounded px-2 py-1 text-[11px] ${
                view === "preview" ? "bg-[#37373d] text-white" : "text-[#cccccc] hover:bg-[#2a2d2e]"
              }`}
              title="Open Preview"
            >
              Preview
            </button>
          </div>
        </div>

        <div className="flex h-[22px] shrink-0 items-center gap-1 border-b border-[#2b2b2b] bg-[#1e1e1e] px-3 text-[12px] text-[#bbbbbb]">
          <span>PORTFOLIO</span>
          <span className="text-[#6b6b6b]">›</span>
          <MdGlyph />
          <span className="text-[#cccccc]">{file.name}</span>
        </div>

        {view === "source" ? (
          <div className="win-scroll min-h-0 flex-1 overflow-auto font-mono text-[13px] leading-[19px]">
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} className="hover:bg-[#2a2d2e]/50">
                    <td className="w-12 select-none pr-3 text-right text-[12px] text-[#6e7681]">
                      {i + 1}
                    </td>
                    <td className="whitespace-pre-wrap break-all py-0 pr-4">
                      <MdLine text={line} onLink={runCommand} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="win-scroll min-h-0 flex-1 overflow-auto bg-[#1e1e1e] px-8 py-6">
            <MarkdownPreview source={source} onLink={runCommand} />
          </div>
        )}

        <div className="flex h-[22px] shrink-0 items-center gap-3 overflow-hidden bg-[#007acc] px-2 text-[12px] text-white">
          <span>main*</span>
          <span className="ml-auto hidden sm:inline">Ln {lines.length}, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>Markdown</span>
        </div>
      </div>
    </div>
  );
}

function MdLine({ text, onLink }: { text: string; onLink: (href: string) => void }) {
  if (text.startsWith("```")) {
    return <span className="text-[#808080]">{text}</span>;
  }
  const heading = text.match(/^(#{1,6})\s+(.*)$/);
  if (heading) {
    return (
      <>
        <span className="text-[#569cd6]">{heading[1]} </span>
        <span className="text-[#569cd6]">{heading[2]}</span>
      </>
    );
  }
  return <>{tokenizeInline(text, onLink)}</>;
}

function tokenizeInline(text: string, onLink: (href: string) => void): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) {
      nodes.push(
        <span key={k++} className="text-[#d4d4d4]">
          {text.slice(last, m.index)}
        </span>
      );
    }
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(
        <span key={k++} className="font-semibold text-[#d7ba7d]">
          {token}
        </span>
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <span key={k++} className="text-[#ce9178]">
          {token}
        </span>
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        nodes.push(
          <button
            key={k++}
            type="button"
            className="text-[#3794ff] underline-offset-2 hover:underline"
            onClick={() => onLink(link[2])}
          >
            [{link[1]}]({link[2]})
          </button>
        );
      }
    }
    last = m.index + token.length;
  }
  if (last < text.length) {
    nodes.push(
      <span key={k++} className="text-[#d4d4d4]">
        {text.slice(last)}
      </span>
    );
  }
  if (text.startsWith("- ")) {
    return [
      <span key="b" className="text-[#d4d4d4]">
        {nodes.length ? nodes : text}
      </span>,
    ];
  }
  return nodes.length ? nodes : [
    <span key="e" className="text-[#d4d4d4]">
      {text || " "}
    </span>,
  ];
}

function MarkdownPreview({ source, onLink }: { source: string; onLink: (href: string) => void }) {
  const blocks = source.split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let inCode = false;
  let code: string[] = [];
  while (i < blocks.length) {
    const line = blocks[i];
    if (line.startsWith("```")) {
      if (inCode) {
        out.push(
          <pre
            key={`c-${i}`}
            className="my-3 overflow-x-auto rounded border border-[#2b2b2b] bg-[#181818] p-3 font-mono text-[13px] text-[#ce9178]"
          >
            {code.join("\n")}
          </pre>
        );
        code = [];
        inCode = false;
      } else {
        inCode = true;
      }
      i += 1;
      continue;
    }
    if (inCode) {
      code.push(line);
      i += 1;
      continue;
    }
    if (line.startsWith("# ")) {
      out.push(
        <h1 key={i} className="mb-3 mt-1 font-sans text-[2rem] font-semibold text-[#cccccc]">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      out.push(
        <h2 key={i} className="mb-2 mt-6 border-b border-[#3c3c3c] pb-1 font-sans text-[1.35rem] text-[#cccccc]">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("- ")) {
      out.push(
        <li key={i} className="ml-5 list-disc text-[14px] leading-6 text-[#cccccc]">
          <PreviewInline text={line.slice(2)} onLink={onLink} />
        </li>
      );
    } else if (line.trim() === "") {
      out.push(<div key={i} className="h-2" />);
    } else {
      out.push(
        <p key={i} className="text-[14px] leading-6 text-[#cccccc]">
          <PreviewInline text={line} onLink={onLink} />
        </p>
      );
    }
    i += 1;
  }
  return <article className="max-w-[780px]">{out}</article>;
}

function PreviewInline({ text, onLink }: { text: string; onLink: (href: string) => void }) {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={k++} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={k++} className="rounded bg-[#181818] px-1 font-mono text-[13px] text-[#ce9178]">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        nodes.push(
          <button
            key={k++}
            type="button"
            className="text-[#3794ff] hover:underline"
            onClick={() => onLink(link[2])}
          >
            {link[1]}
          </button>
        );
      }
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

function ActivityIcon({
  children,
  active,
  title,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`relative flex h-12 w-12 items-center justify-center ${
        active ? "text-white" : "text-[#858585] hover:text-[#cccccc]"
      }`}
    >
      {active && <span className="absolute left-0 top-2 h-8 w-[2px] bg-white" />}
      {children}
    </button>
  );
}

function MdGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" className="shrink-0" aria-hidden>
      <path fill="#519aba" d="M14 3H2v10h12V3zM3.5 11.5v-7l2.2 2.7L8 4.5v7H6.8V7.2L5.7 8.6 4.6 7.2v4.3H3.5zm9 0H11l-1.6-3.3v3.3H8.2v-7h1.7l1.5 3.2V4.5h1.1v7z" />
    </svg>
  );
}

function FilesGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.1L2.5 24h12.2l1.5-1.5V17h4.8l1.5-1.5V1.5L17.5 0zm0 2.1l1.4 1.4v11.5h-4.8V7.5L12.6 6H8.9V2.1h8.6zM14.7 22H3.5V8h9l1.5 1.5V22h.7z" />
    </svg>
  );
}

function SearchGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 21.79l1.06 1.06 8.07-8.07A8.25 8.25 0 1 0 15.25 0zm0 15a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5z" />
    </svg>
  );
}

function GitGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.03 11.07L12.93 3a1.5 1.5 0 0 0-2.12 0l-2.03 2.03 2.58 2.58a2 2 0 0 1 2.24 3.18l2.49 2.49a2 2 0 1 1-1.06.9l-2.32-2.32v6.1a2 2 0 1 1-1.14-.08V11.7a2 2 0 0 1-1.1-3.31L7.36 5.82 2.97 10.2a1.5 1.5 0 0 0 0 2.12l8.1 8.1a1.5 1.5 0 0 0 2.12 0l7.84-7.84a1.5 1.5 0 0 0 0-2.12z" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M3.5 6.5L8 11l4.5-4.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  );
}
