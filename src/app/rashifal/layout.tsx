import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/rashifal");
}

export default function RashifalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
