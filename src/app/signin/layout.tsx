import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/signin");
}

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
