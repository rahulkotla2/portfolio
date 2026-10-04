import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-[#0d1117] font-sans text-win-text">
      <div className="w-full max-w-md rounded-xl border border-win-border bg-win-surface p-8 shadow-window">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fcd53f]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a1a1a">
              <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold">File Not Found</h1>
            <p className="text-xs text-win-muted">Error 404 — This PC</p>
          </div>
        </div>
        <p className="mb-6 text-sm text-win-muted">
          Windows cannot find the page you requested. It may have been moved or deleted.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-lg bg-win-accent px-4 py-2 text-sm font-medium text-win-bg hover:bg-win-accent/90"
        >
          Return to Desktop
        </Link>
      </div>
    </div>
  );
}
