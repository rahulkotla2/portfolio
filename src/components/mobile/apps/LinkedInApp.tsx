"use client";

import { useState } from "react";
import { profile, experience } from "@/data/portfolio";
import { LI } from "./app-tokens";
import { MobileToast } from "./ui/MobileToast";
import { LINKEDIN_POSTS } from "./app-content";

interface LinkedInAppProps {
  onBack: () => void;
}

export function LinkedInApp({ onBack }: LinkedInAppProps) {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: LI.bg, fontFamily: LI.font }}>
      <header
        className="flex h-[48px] shrink-0 items-center gap-3 border-b px-3"
        style={{ backgroundColor: LI.white, borderColor: LI.border }}
      >
        <button type="button" onClick={onBack} aria-label="Back home">
          <LiBack />
        </button>
        <LiLogo />
        <div className="flex-1" />
        <LiSearch />
        <LiMessage />
      </header>

      <div className="nothing-scroll flex-1 overflow-y-auto pb-4">
        <div className="h-[54px]" style={{ background: `linear-gradient(135deg, ${LI.primary}, #004182)` }} />

        <div
          className="mx-3 -mt-[34px] rounded-lg border p-4 shadow-sm"
          style={{ backgroundColor: LI.white, borderColor: LI.border }}
        >
          <div
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 text-[22px] font-semibold text-white"
            style={{ borderColor: LI.white, backgroundColor: LI.primary }}
          >
            RK
          </div>
          <h1 className="mt-2 text-[20px] font-semibold leading-tight" style={{ color: LI.text }}>
            {profile.name}
          </h1>
          <p className="mt-1 text-[14px] leading-snug" style={{ color: LI.text }}>
            {profile.role}
          </p>
          <p className="mt-1 text-[13px]" style={{ color: LI.secondary }}>
            {profile.tagline} · {profile.location}
          </p>
          <div className="mt-3 flex gap-2">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center rounded-full py-[6px] text-[14px] font-semibold text-white"
              style={{ backgroundColor: LI.primary }}
            >
              Connect
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="flex flex-1 items-center justify-center rounded-full border py-[6px] text-[14px] font-semibold"
              style={{ borderColor: LI.primary, color: LI.primary }}
            >
              Message
            </a>
          </div>
        </div>

        {LINKEDIN_POSTS.map((post) => (
          <section key={post.id} className="mx-3 mt-3 rounded-lg border p-4" style={{ backgroundColor: LI.white, borderColor: LI.border }}>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: LI.primary }}>RK</div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: LI.text }}>{post.author}</p>
                <p className="text-[12px]" style={{ color: LI.secondary }}>{post.headline}</p>
              </div>
            </div>
            <p className="mt-3 text-[14px] leading-[20px]" style={{ color: LI.text }}>{post.text}</p>
            <div className="mt-3 flex gap-4 border-t pt-3" style={{ borderColor: LI.border }}>
              <button type="button" onClick={() => setLikes((p) => ({ ...p, [post.id]: (p[post.id] ?? post.likes) + 1 }))} className="text-[13px]" style={{ color: LI.secondary }}>
                👍 {(likes[post.id] ?? post.likes)}
              </button>
              <button type="button" onClick={() => showToast("Comment: Great profile!")} className="text-[13px]" style={{ color: LI.secondary }}>
                💬 {post.comments}
              </button>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px]"
                style={{ color: LI.secondary }}
              >
                ↗ Share
              </a>
            </div>
          </section>
        ))}

        <Section title="About">
          <p className="text-[14px] leading-[20px]" style={{ color: LI.text }}>{profile.summary}</p>
        </Section>

        <Section title="Analytics">
          <div className="grid grid-cols-2 gap-2">
            {profile.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border p-3 text-center"
                style={{ borderColor: LI.border, backgroundColor: LI.white }}
              >
                <p className="text-[18px] font-semibold" style={{ color: LI.primary }}>{s.value}</p>
                <p className="text-[12px]" style={{ color: LI.secondary }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Experience">
          <div className="flex gap-3">
            <div
              className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded text-[13px] font-bold"
              style={{ backgroundColor: "#E8F0FE", color: LI.primary }}
            >
              QT
            </div>
            <div>
              <p className="text-[16px] font-semibold" style={{ color: LI.text }}>{experience.role}</p>
              <p className="text-[14px]" style={{ color: LI.text }}>{experience.company}</p>
              <p className="text-[12px]" style={{ color: LI.secondary }}>
                {experience.period} · {experience.location}
              </p>
              <ul className="mt-2 space-y-2">
                {experience.highlights.map((h) => (
                  <li key={h} className="text-[14px] leading-[20px]" style={{ color: LI.secondary }}>
                    • {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section title="Education">
          <div className="flex gap-3">
            <div
              className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded text-[10px] font-bold"
              style={{ backgroundColor: "#E8F0FE", color: LI.primary }}
            >
              IIIT
            </div>
            <div>
              <p className="text-[16px] font-semibold" style={{ color: LI.text }}>
                {profile.education.school}
              </p>
              <p className="text-[14px]" style={{ color: LI.text }}>{profile.education.degree}</p>
              <p className="text-[12px]" style={{ color: LI.secondary }}>
                {profile.education.period}
              </p>
            </div>
          </div>
        </Section>

        <p className="mx-3 mt-4 text-center text-[12px]" style={{ color: LI.secondary }}>
          Projects & case studies → Files app · Skills → Spotify app
        </p>
      </div>
      <MobileToast message={toast} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="mx-3 mt-3 rounded-lg border p-4"
      style={{ backgroundColor: LI.white, borderColor: LI.border }}
    >
      <h2 className="text-[16px] font-semibold" style={{ color: LI.text }}>{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function LiBack() {
  return (
    <svg width="24" height="24" fill="none" stroke="#191919" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function LiLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden>
      <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 1 1 8.25 6.5 1.75 1.75 0 0 1 6.5 8.25zM19 19h-3v-4.64c0-1.1-.02-2.53-1.54-2.53-1.54 0-1.78 1.2-1.78 2.44V19H9v-9h2.84v1.3h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56V19z" />
    </svg>
  );
}

function LiSearch() {
  return (
    <svg width="22" height="22" fill="none" stroke="#191919" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function LiMessage() {
  return (
    <svg width="22" height="22" fill="none" stroke="#191919" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-8.4-8.4 8.4 8.4 0 0 1 8.4-8.4c2.5 0 4.7 1.1 6.3 2.8L21 3v8.5z" />
    </svg>
  );
}
