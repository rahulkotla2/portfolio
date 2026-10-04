import { LAUNCHER_BRANDS, type LauncherBrandId } from "./launcher-icon-data";

interface BrandLauncherIconProps {
  id: LauncherBrandId | "recruiter";
  size?: number;
}

export function BrandLauncherIcon({ id, size = 56 }: BrandLauncherIconProps) {
  if (id === "recruiter") {
    return <RecruiterLauncher size={size} />;
  }

  const brand = LAUNCHER_BRANDS[id];
  const pad = size * 0.18;
  const radius = size * 0.22;

  const bg =
    "gradient" in brand && brand.gradient
      ? "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"
      : `#${brand.hex}`;

  return (
    <div
      className="flex items-center justify-center overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
      style={{ width: size, height: size, borderRadius: radius, background: bg }}
      aria-hidden
    >
      {"label" in brand ? (
        <span
          style={{
            color: brand.fg,
            fontSize: size * 0.38,
            fontWeight: 700,
            fontFamily: "Arial, Helvetica, sans-serif",
            letterSpacing: "-1px",
            lineHeight: 1,
          }}
        >
          {brand.label}
        </span>
      ) : (
        <svg viewBox="0 0 24 24" width={size - pad * 2} height={size - pad * 2}>
          <path d={brand.path} fill={brand.fg} />
        </svg>
      )}
    </div>
  );
}

function RecruiterLauncher({ size }: { size: number }) {
  return (
    <div
      className="relative overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        backgroundColor: "#E8E8E8",
        backgroundImage: "radial-gradient(circle, #D7192140 1.2px, transparent 1.2px)",
        backgroundSize: `${Math.round(size * 0.12)}px ${Math.round(size * 0.12)}px`,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-[15%]">
        <div
          className="flex w-full flex-1 flex-col items-center rounded-md border-2 bg-white"
          style={{ borderColor: "#D71921" }}
        >
          <div className="mt-[8%] h-[22%] w-[50%] rounded-t-sm border-2 border-b-0" style={{ borderColor: "#D71921" }} />
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-full" style={{ width: size * 0.12, height: size * 0.12, backgroundColor: "#D71921" }} />
          </div>
        </div>
        <span className="mt-1 font-bold leading-none" style={{ fontSize: size * 0.13, color: "#1A1A1A" }}>
          RK
        </span>
      </div>
    </div>
  );
}
