import type { ReactNode } from "react";

const COVERS: Record<string, { bg: string; label: string; sub: string; art: ReactNode }> = {
  frontend: {
    bg: "linear-gradient(135deg, #1DB954 0%, #169c46 100%)",
    label: "Frontend",
    sub: "Vue · React · Nuxt",
    art: <ReactAtom />,
  },
  backend: {
    bg: "linear-gradient(135deg, #509BF5 0%, #1e3a8a 100%)",
    label: "Backend",
    sub: "FastAPI · Node",
    art: <ServerStack />,
  },
  data: {
    bg: "linear-gradient(135deg, #E91429 0%, #991b1b 100%)",
    label: "Data",
    sub: "SQL · AWS",
    art: <CloudDb />,
  },
  languages: {
    bg: "linear-gradient(135deg, #FF6437 0%, #c2410c 100%)",
    label: "Code",
    sub: "TS · Py · Java",
    art: <CodeBrackets />,
  },
};

export function PlaylistCover({
  id,
  size = 56,
  large = false,
}: {
  id: string;
  size?: number;
  large?: boolean;
}) {
  const cover = COVERS[id] ?? COVERS.frontend;
  const artScale = large ? 1.15 : 0.55;

  return (
    <div
      className="relative shrink-0 overflow-hidden shadow-lg"
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        background: cover.bg,
      }}
    >
      {/* Icon centered in the art area — label strip excluded when large */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ bottom: large ? size * 0.22 : 0 }}
      >
        <div
          className="flex items-center justify-center"
          style={{ transform: `scale(${artScale})` }}
        >
          {cover.art}
        </div>
      </div>

      {large && (
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/30 to-transparent px-3 pb-3 pt-10"
          style={{ height: size * 0.38 }}
        >
          <p className="text-[13px] font-bold leading-tight text-white">{cover.label}</p>
          <p className="text-[10px] leading-tight text-white/80">{cover.sub}</p>
        </div>
      )}
    </div>
  );
}

function ReactAtom() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <circle cx="40" cy="40" r="6" fill="#fff" />
      <ellipse cx="40" cy="40" rx="28" ry="10" stroke="#fff" strokeWidth="3" />
      <ellipse cx="40" cy="40" rx="28" ry="10" stroke="#fff" strokeWidth="3" transform="rotate(60 40 40)" />
      <ellipse cx="40" cy="40" rx="28" ry="10" stroke="#fff" strokeWidth="3" transform="rotate(120 40 40)" />
    </svg>
  );
}

function ServerStack() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <rect x="14" y="16" width="52" height="16" rx="3" fill="#fff" opacity=".9" />
      <rect x="14" y="36" width="52" height="16" rx="3" fill="#fff" opacity=".75" />
      <rect x="14" y="56" width="52" height="10" rx="3" fill="#fff" opacity=".6" />
      <circle cx="22" cy="24" r="2" fill="#509BF5" />
      <circle cx="22" cy="44" r="2" fill="#509BF5" />
    </svg>
  );
}

function CloudDb() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <ellipse cx="40" cy="32" rx="24" ry="14" fill="#fff" />
      <rect x="16" y="32" width="48" height="16" fill="#fff" />
      <ellipse cx="40" cy="48" rx="24" ry="14" fill="#fff" />
      <rect x="26" y="54" width="28" height="18" rx="3" fill="#fff" opacity=".85" />
      <rect x="30" y="60" width="20" height="3" rx="1" fill="#E91429" />
      <rect x="30" y="66" width="14" height="3" rx="1" fill="#E91429" opacity=".7" />
    </svg>
  );
}

function CodeBrackets() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <text x="40" y="52" textAnchor="middle" fill="#fff" fontSize="36" fontFamily="ui-monospace, monospace" fontWeight="700">
        {"</>"}
      </text>
    </svg>
  );
}
