import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/signup");
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
