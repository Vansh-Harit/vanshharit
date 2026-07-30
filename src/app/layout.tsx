import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vansh Harit | Founder-Engineer & Full-Stack Builder",
  description:
    "Portfolio of Vansh Harit, a computer science student building full-stack products, automation systems, and agentic AI.",
  applicationName: "Vansh Harit Portfolio",
  authors: [{ name: "Vansh Harit" }],
  creator: "Vansh Harit",
  keywords: [
    "Vansh Harit",
    "full-stack developer",
    "Next.js",
    "TypeScript",
    "AI agents",
    "portfolio",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-white bg-black">
        {/* Foreground Content Layer */}
        <main className="relative z-10 flex flex-col flex-1 min-h-full w-full">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
