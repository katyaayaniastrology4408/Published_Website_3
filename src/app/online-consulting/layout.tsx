import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/online-consulting");
}

export default function OnlineConsultingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
