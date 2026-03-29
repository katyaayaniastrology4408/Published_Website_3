import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/blogs");
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
