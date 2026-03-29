import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/booking/success");
  return { title: "Booking Successful", ...seo };
}

export default function BookingSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
