import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/booking");
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
