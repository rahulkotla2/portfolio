"use client";

import { useState, useEffect } from "react";
import { skills, profile } from "@/data/portfolio";
import { SP } from "./app-tokens";
import { TechIcon } from "./ui/TechIcon";
import { PlaylistCover } from "./ui/PlaylistCover";
import { useMobileChromeOverride } from "./MobileChromeContext";

interface SpotifyAppProps {
  onBack: () => void;
}

const playlists = [
  {
    id: "frontend",
    title: "Frontend Hits",
    subtitle: "Vue · React · Nuxt",
    tracks: skills.frontend,
  },
  {
    id: "backend",
    title: "Backend Grooves",
    subtitle: "FastAPI · Node · Java",
    tracks: skills.backend,
  },
  {
    id: "data",
    title: "Data & Cloud",
    subtitle: "PostgreSQL · AWS · Kafka",
    tracks: [...skills.databases, ...skills.cloud],
  },
  {
    id: "languages",
    title: "Languages",
    subtitle: "TypeScript · Python · Java",
    tracks: skills.languages,
  },
];

export function SpotifyApp({ onBack }: SpotifyAppProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const playlist = playlists.find((p) => p.id === activeId);
  const { setOverride } = useMobileChromeOverride();

  useEffect(() => {
    if (playlist) setOverride({ ink: "light", bg: "#2d2d2d" });
    else setOverride(null);
    return () => setOverride(null);
  }, [playlist, setOverride]);

  if (playlist) {
    return (
      <div className="flex h-full flex-col" style={{ backgroundColor: SP.bg, fontFamily: SP.font }}>
        <header className="flex items-center px-4 py-2" style={{ backgroundColor: "#2d2d2d" }}>
          <button type="button" onClick={() => setActiveId(null)} aria-label="Back">
            <SpBack />
          </button>
        </header>

        <div className="flex flex-col items-center px-5 pb-4 text-center">
          <PlaylistCover id={playlist.id} size={232} large />
          <h1 className="mt-5 w-full text-left text-[24px] font-bold leading-tight text-white">{playlist.title}</h1>
          <p className="mt-1 w-full text-left text-[14px] text-[#B3B3B3]">{playlist.subtitle}</p>
          <p className="mt-1 w-full text-left text-[12px] text-[#B3B3B3]">
            {profile.name} · {playlist.tracks.length} songs
          </p>
        </div>

        <div className="nothing-scroll flex-1 overflow-y-auto px-4">
          {playlist.tracks.map((track, i) => (
            <div
              key={track}
              role="button"
              tabIndex={0}
              onClick={() => setNowPlaying(track)}
              onKeyDown={(e) => e.key === "Enter" && setNowPlaying(track)}
              className="flex w-full cursor-pointer items-center gap-3 border-b border-white/5 py-3 text-left active:bg-white/5"
            >
              <span className="w-5 shrink-0 text-center text-[14px] text-[#B3B3B3]">
                {nowPlaying === track ? "▶" : i + 1}
              </span>
              <TechIcon name={track} size={40} />
              <div className="min-w-0 flex-1">
                <p className={`truncate text-[16px] ${nowPlaying === track ? "text-[#1DB954]" : "text-white"}`}>
                  {track}
                </p>
                <p className="truncate text-[13px] text-[#B3B3B3]">{playlist.title}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked((p) => ({ ...p, [track]: !p[track] }));
                }}
                className="shrink-0 p-1"
                aria-label="Like"
              >
                <SpHeart filled={liked[track]} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 justify-center py-4">
          <button
            type="button"
            className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#1DB954] shadow-lg"
            aria-label="Play"
          >
            <SpPlay />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: SP.bg, fontFamily: SP.font }}>
      <header className="flex items-center justify-between px-4 py-3">
        <button type="button" onClick={onBack} aria-label="Back home">
          <SpBack />
        </button>
        <h1 className="text-[22px] font-bold text-white">Your Library</h1>
        <SpSearch />
      </header>

      <div className="nothing-scroll flex-1 overflow-y-auto px-4 pb-2">
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#B3B3B3]">
          Made for {profile.name.split(" ")[0]}
        </p>
        {playlists.map((pl) => (
          <button
            key={pl.id}
            type="button"
            onClick={() => setActiveId(pl.id)}
            className="mb-1 flex w-full items-center gap-3 rounded-[4px] p-2 text-left active:bg-white/10"
          >
            <PlaylistCover id={pl.id} size={56} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-medium text-white">{pl.title}</p>
              <p className="truncate text-[13px] text-[#B3B3B3]">
                Playlist · {pl.tracks.length} songs
              </p>
            </div>
          </button>
        ))}
      </div>

      {nowPlaying && (
        <div className="flex shrink-0 items-center gap-3 border-t border-white/10 bg-[#282828] px-4 py-2">
          <TechIcon name={nowPlaying} size={40} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-white">{nowPlaying}</p>
            <p className="truncate text-[11px] text-[#B3B3B3]">{profile.role}</p>
          </div>
          <SpPlay />
        </div>
      )}
      <SpBottomNav />
    </div>
  );
}

function SpBottomNav() {
  return (
    <nav className="flex h-[56px] shrink-0 items-center justify-around border-t border-white/10 bg-[#121212]">
      <SpNavItem label="Home" active />
      <SpNavItem label="Search" />
      <SpNavItem label="Your Library" />
    </nav>
  );
}

function SpNavItem({ label, active }: { label: string; active?: boolean }) {
  const c = active ? "#FFFFFF" : "#B3B3B3";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="24" height="24" fill={active ? c : "none"} stroke={c} strokeWidth={active ? 0 : 2} viewBox="0 0 24 24" aria-hidden>
        {label === "Home" && (active ? <path d="M12 2L2 9v13h7v-7h6v7h7V9L12 2z" /> : <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />)}
        {label === "Search" && (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></>)}
        {label === "Your Library" && <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z" />}
      </svg>
      <span className={`text-[11px] ${active ? "text-white" : "text-[#B3B3B3]"}`}>{label}</span>
    </div>
  );
}

function SpBack() {
  return (
    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function SpSearch() {
  return (
    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function SpHeart({ filled }: { filled?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={filled ? "#1DB954" : "none"}
        stroke={filled ? "#1DB954" : "#B3B3B3"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpPlay() {
  return (
    <svg width="28" height="28" fill="#000" viewBox="0 0 24 24" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}
