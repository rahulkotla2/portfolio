import type { ReactNode } from "react";
import { RecruiterBodyStyles } from "@/components/recruiter/RecruiterBodyStyles";

export default function RecruiterLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RecruiterBodyStyles />
      {children}
    </>
  );
}
