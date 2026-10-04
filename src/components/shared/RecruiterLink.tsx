"use client";

import { useRouter } from "next/navigation";

interface RecruiterLinkProps {
  children: React.ReactNode;
  className?: string;
}

export function RecruiterLink({ children, className }: RecruiterLinkProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/recruiter")}
      className={className}
    >
      {children}
    </button>
  );
}
