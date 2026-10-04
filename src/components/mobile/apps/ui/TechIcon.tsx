import type { ReactNode } from "react";
import { TECH_BRANDS } from "./tech-brands";

function isLightHex(hex: string) {
  const n = Number.parseInt(hex, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.75;
}

/** Marks with no simple-icons entry — drawn to the real brand colors. */
const CUSTOM: Record<string, { bg: string; node: ReactNode }> = {
  AWS: { bg: "#232F3E", node: <AwsMark /> },
  Java: { bg: "#FFFFFF", node: <JavaMark /> },
  "PDF.js": { bg: "#FFFFFF", node: <PdfJsMark /> },
  "REST APIs": { bg: "#4F46E5", node: <RestMark /> },
  SQL: { bg: "#FFFFFF", node: <SqlMark /> },
};

export function TechIcon({ name, size = 40 }: { name: string; size?: number }) {
  const custom = CUSTOM[name];
  if (custom) {
    return (
      <span
        className="flex shrink-0 items-center justify-center overflow-hidden"
        style={{ width: size, height: size, borderRadius: 4, backgroundColor: custom.bg }}
        aria-hidden
      >
        {custom.node}
      </span>
    );
  }

  const brand = TECH_BRANDS[name];
  if (!brand) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-[4px] bg-[#3f3f3f] text-[11px] font-bold text-white"
        style={{ width: size, height: size }}
        aria-hidden
      >
        {name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}
      </span>
    );
  }

  const light = isLightHex(brand.hex);
  const inset = Math.round(size * 0.16);

  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        backgroundColor: light ? "#121212" : "#FFFFFF",
        padding: inset,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <path d={brand.path} fill={`#${brand.hex}`} />
      </svg>
    </span>
  );
}

function AwsMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-[74%] w-[74%]" aria-hidden>
      <text
        x="16"
        y="15"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="11"
        fontWeight="700"
      >
        aws
      </text>
      <path
        d="M6.5 19.2c3.4 2.4 8 3.4 12.2 2.4 1.5-.3 2.8-.9 3.8-1.6"
        fill="none"
        stroke="#FF9900"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M20.6 18.2l2.8 1.1-2.4 2.2"
        fill="none"
        stroke="#FF9900"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function JavaMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-[74%] w-[74%]" aria-hidden>
      <path
        d="M11 7.2c.6 1-.6 1.4-.2 2.3M15 6.2c.6 1-.6 1.4-.2 2.3M13 4.8c.5.9-.5 1.2-.1 2"
        fill="none"
        stroke="#E76F00"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M8.5 12h11.2l-1.1 8.4a3.8 3.8 0 0 1-3.7 3.2h-1.6a3.8 3.8 0 0 1-3.7-3.2L8.5 12z" fill="#5382A1" />
      <path
        d="M19.6 13.4h1.5a2.7 2.7 0 0 1 0 5.4h-1.6"
        fill="none"
        stroke="#F89820"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <ellipse cx="14.2" cy="25.4" rx="6.2" ry="1.35" fill="#E76F00" />
    </svg>
  );
}

function PdfJsMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-[74%] w-[74%]" aria-hidden>
      <path d="M9 5h9.2L23 9.8V25a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="#E4002B" />
      <path d="M18.2 5V10H23" fill="#FF8A80" />
      <text
        x="14"
        y="21"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="6.5"
        fontWeight="700"
      >
        PDF
      </text>
    </svg>
  );
}

function RestMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-[68%] w-[68%]" aria-hidden>
      <path
        d="M7 11h7M7 16h11M7 21h8"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="22.5" cy="11" r="2" fill="#FFFFFF" />
      <circle cx="24.5" cy="21" r="2" fill="#FFFFFF" />
      <path d="M22.5 13v5.2L24.5 21" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SqlMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-[70%] w-[70%]" aria-hidden>
      <ellipse cx="16" cy="8" rx="8" ry="3.1" fill="#336791" />
      <path d="M8 8v8c0 1.7 3.6 3.1 8 3.1s8-1.4 8-3.1V8" fill="#4479A1" />
      <path d="M8 16v6.2c0 1.7 3.6 3.1 8 3.1s8-1.4 8-3.1V16" fill="#336791" />
      <ellipse cx="16" cy="16" rx="8" ry="3.1" fill="#5B9BD5" />
    </svg>
  );
}
