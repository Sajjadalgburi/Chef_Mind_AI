import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snap Cook",
  description:
    "Turn your fridge into a meal with enhanced LLM and image processing and over million recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
