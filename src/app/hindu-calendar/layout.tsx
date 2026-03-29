import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/hindu-calendar");
}

export default function HinduCalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
