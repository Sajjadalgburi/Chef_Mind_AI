import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });
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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <>
            <Header />
            {children}
          </>
        </body>
      </html>
    </ClerkProvider>
  );
}
