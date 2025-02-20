import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/navbar/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { auth } from "@/app/auth";
import { AuthProvider } from "@/context/AuthContext";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const user = {
    id: session?.user?.id,
    email: session?.user?.email,
    name: session?.user?.name,
    image: session?.user?.image,
  };

  return (
    <html lang="en" data-theme="emerald">
      <AuthProvider session={session} user={user}>
        <body className={inter.className}>
          <Header />
          {children}
          <Footer />
          <Analytics />
        </body>
      </AuthProvider>
    </html>
  );
}
