import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/payment/failed");
  return { title: "Payment Failed", ...seo };
}

export default function PaymentFailedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
