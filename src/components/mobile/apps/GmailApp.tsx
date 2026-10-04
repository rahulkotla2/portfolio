"use client";

import { useState } from "react";
import { profile } from "@/data/portfolio";
import { RESUME_PATH, RESUME_FILENAME } from "@/lib/constants";
import { GM } from "./app-tokens";
import { GMAIL_THREADS } from "./app-content";

interface GmailAppProps {
  onBack: () => void;
}

type GmailTab = "primary" | "promotions";

export function GmailApp({ onBack }: GmailAppProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<GmailTab>("primary");
  const selected = GMAIL_THREADS.find((e) => e.id === selectedId);

  if (selected) {
    return (
      <div className="flex h-full flex-col" style={{ backgroundColor: GM.bg, fontFamily: GM.font }}>
        <header className="flex shrink-0 items-center gap-1 border-b px-1 py-1" style={{ borderColor: GM.border }}>
          <button type="button" onClick={() => setSelectedId(null)} className="p-2.5" aria-label="Back">
            <GmBack />
          </button>
          <div className="flex flex-1 justify-end gap-1 pr-2">
            <GmIconArchive />
            <GmIconTrash />
            <GmIconMail />
            <GmIconMore />
          </div>
        </header>

        <div className="nothing-scroll flex-1 overflow-y-auto px-4 pb-6">
          <h1 className="pt-2 text-[22px] font-normal leading-tight" style={{ color: GM.text }}>
            {selected.subject}
          </h1>
          <div className="mt-5 flex items-start gap-3">
            <GmAvatar letter={selected.avatar} color={selected.color} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] font-medium" style={{ color: GM.text }}>{selected.from}</p>
                <span className="text-[12px]" style={{ color: GM.muted }}>{selected.time}</span>
              </div>
              <p className="text-[12px]" style={{ color: GM.muted }}>to me</p>
            </div>
          </div>

          <pre
            className="mt-6 whitespace-pre-wrap font-sans text-[14px] leading-[22px]"
            style={{ color: GM.secondary }}
          >
            {selected.body}
          </pre>

          {selected.hasAttachment && (
            <a
              href={RESUME_PATH}
              download={RESUME_FILENAME}
              className="mt-6 flex items-center gap-3 rounded-[12px] border p-3"
              style={{ borderColor: GM.border, backgroundColor: GM.surface }}
            >
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-lg bg-[#FEEFE3]">
                <GmPdf />
              </div>
              <div>
                <p className="text-[14px] font-medium" style={{ color: GM.text }}>{RESUME_FILENAME}</p>
                <p className="text-[12px]" style={{ color: GM.muted }}>PDF · Tap to download</p>
              </div>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col" style={{ backgroundColor: GM.bg, fontFamily: GM.font }}>
      {/* Gmail header — matches Android Gmail layout */}
      <header className="shrink-0 px-3 pb-2 pt-1">
        <div className="flex items-center gap-2 py-1">
          <button type="button" onClick={onBack} className="p-2" aria-label="Back home">
            <GmMenu />
          </button>
          <GmailWordmark />
          <div className="flex-1" />
          <GmAvatar letter="R" color="#1A73E8" size={36} />
        </div>

        <div
          className="mt-2 flex h-[48px] items-center gap-3 rounded-full px-4"
          style={{ backgroundColor: GM.searchBg }}
        >
          <GmSearchIcon />
          <span className="text-[16px]" style={{ color: GM.muted }}>Search in mail</span>
        </div>

        <div className="mt-3 flex gap-5 border-b px-1" style={{ borderColor: GM.border }}>
          {(["primary", "promotions"] as GmailTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="relative pb-2 text-[14px] font-medium capitalize"
              style={{ color: tab === t ? GM.primary : GM.muted }}
            >
              {t}
              {tab === t && (
                <span
                  className="absolute inset-x-0 -bottom-[1px] h-[3px] rounded-full"
                  style={{ backgroundColor: GM.primary }}
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="nothing-scroll flex-1 overflow-y-auto pb-20">
        {GMAIL_THREADS.map((email) => (
          <button
            key={email.id}
            type="button"
            onClick={() => setSelectedId(email.id)}
            className="flex w-full gap-3 px-4 py-[12px] text-left active:bg-[#F1F3F4]"
          >
            <GmAvatar letter={email.avatar} color={email.color} />
            <div className="min-w-0 flex-1 border-b pb-[12px]" style={{ borderColor: GM.border }}>
              <div className="flex items-baseline justify-between gap-2">
                <p
                  className={`truncate text-[14px] ${email.starred ? "font-bold" : "font-normal"}`}
                  style={{ color: GM.text }}
                >
                  {email.from}
                </p>
                <span className="shrink-0 text-[12px]" style={{ color: GM.muted }}>{email.time}</span>
              </div>
              <p
                className={`truncate text-[14px] ${email.starred ? "font-bold" : "font-normal"}`}
                style={{ color: GM.text }}
              >
                {email.subject}
              </p>
              <p className="truncate text-[14px]" style={{ color: GM.muted }}>{email.preview}</p>
            </div>
            {email.starred && <GmStar filled />}
          </button>
        ))}
      </div>

      <a
        href={`mailto:${profile.email}`}
        className="absolute bottom-[68px] right-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
        style={{ backgroundColor: GM.compose }}
        aria-label="Compose"
      >
        <GmCompose />
      </a>

      <GmBottomNav />
    </div>
  );
}

function GmAvatar({ letter, color, size = 40 }: { letter: string; color: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-medium text-white"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}
    >
      {letter}
    </div>
  );
}

function GmailWordmark() {
  const letters: { char: string; color: string }[] = [
    { char: "G", color: "#4285F4" },
    { char: "m", color: "#EA4335" },
    { char: "a", color: "#FBBC04" },
    { char: "i", color: "#4285F4" },
    { char: "l", color: "#34A853" },
  ];

  return (
    <span
      className="flex shrink-0 items-baseline text-[22px] font-medium leading-none tracking-tight"
      style={{ fontFamily: "var(--font-roboto), Roboto, 'Google Sans', Arial, sans-serif" }}
      aria-label="Gmail"
    >
      {letters.map(({ char, color }, i) => (
        <span key={i} style={{ color }}>{char}</span>
      ))}
    </span>
  );
}

function GmBottomNav() {
  const items = [
    { label: "Mail", active: true },
    { label: "Chat", active: false },
    { label: "Meet", active: false },
  ];
  return (
    <nav
      className="flex shrink-0 items-center justify-around border-t py-2"
      style={{ borderColor: GM.border, backgroundColor: GM.bg }}
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-0.5 px-4">
          <GmNavIcon label={item.label} active={item.active} />
          <span
            className="text-[12px] font-medium"
            style={{ color: item.active ? GM.primary : GM.muted }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  );
}

function GmNavIcon({ label, active }: { label: string; active: boolean }) {
  const c = active ? GM.primary : GM.muted;
  if (label === "Mail") {
    return (
      <svg width="24" height="24" fill={active ? c : "none"} stroke={c} strokeWidth={active ? 0 : 2} viewBox="0 0 24 24" aria-hidden>
        {active ? <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.5L12 12.5 4 6.5V6h16z" /> : <rect x="3" y="5" width="18" height="14" rx="2" />}
      </svg>
    );
  }
  if (label === "Chat") {
    return (
      <svg width="24" height="24" fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-8.4-8.4 8.4 8.4 0 0 1 8.4-8.4c2.5 0 4.7 1.1 6.3 2.8L21 3v8.5z" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="M17 10l4-2v8l-4-2" />
    </svg>
  );
}

function GmMenu() {
  return (
    <svg width="24" height="24" fill="none" stroke={GM.secondary} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function GmBack() {
  return (
    <svg width="24" height="24" fill="none" stroke={GM.secondary} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function GmSearchIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke={GM.muted} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function GmStar({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" fill={filled ? "#F9AB00" : "none"} stroke="#F9AB00" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2z" />
    </svg>
  );
}

function GmCompose() {
  return (
    <svg width="22" height="22" fill="none" stroke="#001D35" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function GmPdf() {
  return (
    <svg width="20" height="20" fill="#EA4335" viewBox="0 0 24 24" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h2v5H8v-5zm3 0h2c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2h-2v-5zm2 3v-1h-1v1h1zm3-3h2v1h-2v1h2v1h-2v2h-2v-5z" />
    </svg>
  );
}

function GmIconArchive() {
  return <svg width="22" height="22" fill="none" stroke={GM.secondary} strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h18v4H3zM5 11v8h14v-8M10 15h4" /></svg>;
}

function GmIconTrash() {
  return <svg width="22" height="22" fill="none" stroke={GM.secondary} strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>;
}

function GmIconMail() {
  return <svg width="22" height="22" fill="none" stroke={GM.secondary} strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
}

function GmIconMore() {
  return (
    <svg width="22" height="22" fill={GM.secondary} viewBox="0 0 24 24" aria-hidden>
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
    </svg>
  );
}
