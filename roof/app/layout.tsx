import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoofAI — Instant Roofing Estimates",
  description:
    "Get accurate roofing estimates in seconds using AI-powered satellite analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-slate-900">{children}</body>
    </html>
  );
}
