"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-[#0d1117] p-4 font-sans text-win-text">
      <div className="w-full max-w-lg rounded-xl border border-red-500/30 bg-win-surface p-8 shadow-window">
        <h1 className="mb-2 text-lg font-semibold text-red-400">Something went wrong</h1>
        <p className="mb-2 text-sm text-win-muted">
          Windows encountered a problem and needs to recover this window.
        </p>
        <p className="mb-6 font-mono text-xs text-win-muted/70">
          STOP: PORTFOLIO_EXCEPTION
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-win-accent px-4 py-2 text-sm font-medium text-win-bg hover:bg-win-accent/90"
        >
          Restart Application
        </button>
      </div>
    </div>
  );
}
