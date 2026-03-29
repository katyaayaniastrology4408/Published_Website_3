import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/contact");
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
