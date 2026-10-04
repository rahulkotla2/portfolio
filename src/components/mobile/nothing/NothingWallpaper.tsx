"use client";

/** Nothing OS wallpaper — CSS background (SVG via Next/Image fails silently) */
export function NothingWallpaper({ dim = 0 }: { dim?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050505]" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/mobile/nothing-wallpaper.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {dim > 0 && <div className="absolute inset-0 bg-black" style={{ opacity: dim }} />}
    </div>
  );
}
