import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/important-days");
}

export default function ImportantDaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
