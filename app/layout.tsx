import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/navbar/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Chef Mind",
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
      <SessionProvider>
        <body className={inter.className}>
          <Header />
          {children}
          <Footer />

          <Analytics />
        </body>
      </SessionProvider>
    </html>
  );
}
