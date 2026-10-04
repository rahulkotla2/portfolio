"use client";

import { useState, useRef, useEffect, KeyboardEvent, useMemo } from "react";
import { terminalCommands } from "@/data/portfolio";
import { useDesktopStore } from "@/store/desktop-store";
import { RESUME_PATH, RESUME_FILENAME } from "@/lib/constants";
import { projects } from "@/data/portfolio";

interface HistoryLine {
  type: "input" | "output" | "system" | "error" | "success";
  text: string;
}

const BOOT_LINES = [
  "Windows Terminal v1.0 — Rahul Kotla Portfolio",
  "Copyright (c) 2026 Portfolio OS",
  "",
  "> Initializing workspace...",
  "> Loading modules: Vue.js, React, FastAPI, Java",
  "> Experience: 3+ years | EdTech & FinTech",
  "> Type 'help' for available commands",
  "",
];

const COMMAND_LIST = Object.keys(terminalCommands).concat([
  "whoami",
  "ls",
  "tree",
  "sudo hire-me",
  "run agent --task jira-stories",
  "cat resume.pdf",
]);

export function TerminalApp() {
  const [history, setHistory] = useState<HistoryLine[]>(
    BOOT_LINES.map((text) => ({ type: "system", text }))
  );
  const [input, setInput] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openApp = useDesktopStore((s) => s.openApp);
  const openExplorerProject = useDesktopStore((s) => s.openExplorerProject);
  const addNotification = useDesktopStore((s) => s.addNotification);

  useEffect(() => {
    if (!bootDone) {
      const t = setTimeout(() => setBootDone(true), 800);
      return () => clearTimeout(t);
    }
  }, [bootDone]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const completion = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return null;
    const match = COMMAND_LIST.find((c) => c.startsWith(q));
    return match && match !== input.trim() ? match : null;
  }, [input]);

  const appendLines = (lines: HistoryLine[]) => setHistory((h) => [...h, ...lines]);

  const runAgentDemo = () => {
    const steps = [
      { type: "output" as const, text: "🤖 Agent: jira-story-processor v2.1" },
      { type: "system" as const, text: "> Fetching sprint backlog..." },
      { type: "system" as const, text: "> Analyzing 12 user stories..." },
      { type: "success" as const, text: "✓ Generated acceptance criteria for BL-1847" },
      { type: "success" as const, text: "✓ Added contextual implementation notes" },
      { type: "success" as const, text: "✓ Estimated complexity: Medium (3 pts)" },
      { type: "output" as const, text: "Done. Engineering throughput +23% this sprint." },
    ];
    steps.forEach((line, i) => {
      setTimeout(() => appendLines([line]), (i + 1) * 400);
    });
    addNotification({
      title: "AI Agent Complete",
      message: "Jira story processing finished — 12 stories analyzed",
      icon: "achievement",
    });
  };

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    const cmd = trimmed.toLowerCase();
    const newHistory: HistoryLine[] = [{ type: "input", text: `> ${raw}` }];

    if (!trimmed) {
      setHistory((h) => [...h, ...newHistory]);
      return;
    }

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    if (cmd === "whoami") {
      newHistory.push({ type: "success", text: "rahul@portfolio — Software Engineer (EdTech & FinTech)" });
      appendLines(newHistory);
      setInput("");
      return;
    }

    if (cmd === "ls") {
      projects.forEach((p) =>
        newHistory.push({ type: "output", text: `  📁 ${p.folder}/` })
      );
      newHistory.push({ type: "output", text: "  📄 quantrium.md  📄 education.md" });
      appendLines(newHistory);
      setInput("");
      return;
    }

    if (cmd === "tree") {
      newHistory.push({
        type: "output",
        text: "portfolio/\n├── projects/\n│   ├── coach-matching/\n│   ├── digital-flex/\n│   ├── fintech-kyc/\n│   └── ai-workflows/\n└── work/\n    ├── quantrium.md\n    └── education.md",
      });
      appendLines(newHistory);
      setInput("");
      return;
    }

    if (cmd === "sudo hire-me") {
      newHistory.push({ type: "error", text: "Permission denied... just kidding! 😄" });
      newHistory.push({ type: "success", text: `Let's connect: rahulkotla2@gmail.com` });
      appendLines(newHistory);
      setInput("");
      return;
    }

    if (trimmed === "run agent --task jira-stories") {
      appendLines(newHistory);
      runAgentDemo();
      setInput("");
      return;
    }

    const handler = terminalCommands[trimmed] ?? terminalCommands[cmd];
    if (handler) {
      handler.output.forEach((line) =>
        newHistory.push({ type: line.includes("✓") ? "success" : "output", text: line })
      );
      if (handler.action === "open-explorer") openApp("explorer");
      if (handler.action === "open-vscode") openApp("vscode");
      if (handler.action === "download-resume") {
        const a = document.createElement("a");
        a.href = RESUME_PATH;
        a.download = RESUME_FILENAME;
        a.click();
      }
      if (handler.action === "open-explorer-project" && handler.projectId) {
        openExplorerProject(handler.projectId);
      }
    } else {
      newHistory.push({
        type: "error",
        text: `Command not found: '${raw}'. Type 'help' for available commands.`,
      });
    }

    appendLines(newHistory);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
      return;
    }
    if (e.key === "Tab" && completion) {
      e.preventDefault();
      setInput(completion);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = historyIndex < 0 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(cmdHistory[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < 0) return;
      const next = historyIndex + 1;
      if (next >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(cmdHistory[next]);
      }
    }
  };

  const lineColor = (type: HistoryLine["type"]) => {
    switch (type) {
      case "input":
        return "text-win-text";
      case "system":
        return "text-green-400/80";
      case "error":
        return "text-red-400";
      case "success":
        return "text-win-accent";
      default:
        return "text-win-muted";
    }
  };

  return (
    <div
      className="flex h-full min-w-0 flex-col overflow-hidden bg-[#0c0c0c] font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex h-8 min-w-0 shrink-0 items-center overflow-x-auto border-b border-[#333] bg-[#1a1a1a]">
        <div className="flex shrink-0 items-center gap-2 border-r border-[#333] px-4 py-1.5 text-xs text-win-text">
          <span className="text-green-400">⬛</span>
          contact.sh
        </div>
        <div className="shrink-0 px-4 py-1.5 text-xs text-win-muted">boot.log</div>
        <div className="shrink-0 px-4 py-1.5 text-xs text-win-muted">agent.log</div>
      </div>

      <div className="win-scroll min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4">
        {history.map((line, i) => (
          <div key={`${i}-${line.text.slice(0, 20)}`} className={`break-all leading-relaxed ${lineColor(line.type)}`}>
            {line.text}
          </div>
        ))}

        {bootDone && (
          <div className="mt-1 flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-green-400">rahul@portfolio</span>
            <span className="shrink-0 text-win-muted">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-w-0 flex-1 bg-transparent text-win-text outline-none caret-win-accent"
              autoFocus
              spellCheck={false}
              aria-label="Terminal input"
            />
            {completion && (
              <span className="hidden max-w-[40%] truncate text-xs text-win-muted/50 sm:inline">
                {completion.slice(input.length)}
              </span>
            )}
            <span className="animate-blink inline-block h-4 w-2 shrink-0 bg-win-accent" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
