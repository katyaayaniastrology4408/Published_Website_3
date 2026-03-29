import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/horoscope");
}

export default function HoroscopeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
