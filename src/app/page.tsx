import { redirect } from "next/navigation";
import { PortfolioDesktop } from "@/components/desktop/PortfolioDesktop";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;

  if (params.view === "simple" || params.view === "recruiter") {
    redirect("/recruiter");
  }

  return <PortfolioDesktop />;
}
