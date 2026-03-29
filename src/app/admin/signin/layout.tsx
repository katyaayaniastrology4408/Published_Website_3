import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Sign In",
    robots: { index: false, follow: false },
  };
}

export default function AdminSigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
