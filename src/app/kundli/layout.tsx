import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/kundli");
}

export default function KundliLayout({ children }: { children: React.ReactNode }) {
  return children;
}
