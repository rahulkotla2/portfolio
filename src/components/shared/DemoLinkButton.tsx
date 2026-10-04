import { ExternalLink } from "lucide-react";
import { getDemoLink } from "@/lib/demo-links";

interface DemoLinkButtonProps {
  projectId: string;
  className?: string;
  size?: "sm" | "md";
}

export function DemoLinkButton({ projectId, className = "", size = "md" }: DemoLinkButtonProps) {
  const url = getDemoLink(projectId);
  if (!url) return null;

  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-[10px]" : "px-4 py-2 text-xs";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-win-accent/40 bg-win-accent/10 font-medium text-win-accent transition-colors hover:bg-win-accent/20 ${sizeClasses} ${className}`}
    >
      <ExternalLink size={size === "sm" ? 10 : 12} />
      View Demo
    </a>
  );
}
