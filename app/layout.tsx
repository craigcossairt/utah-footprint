import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Overpass } from "next/font/google";
import { Mountain } from "lucide-react";
import Link from "next/link";
import "./globals.css";

// Overpass is based on Highway Gothic, the US road-sign face. Atkinson Hyperlegible was designed for low-vision readers.
const archivo = Overpass({ variable: "--font-archivo", subsets: ["latin"], weight: ["600", "800", "900"] });
const publicSans = Atkinson_Hyperlegible_Next({ variable: "--font-public-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoSwitch",
  description: "A smarter way to power down. See your water, power and air numbers for your Utah home, and what to change first.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${publicSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="border-b border-line">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 lg:px-8">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
              <Mountain size={22} strokeWidth={2} className="text-sage" aria-hidden />
              EcoSwitch
            </Link>
            <Link href="/sources" className="text-sm text-muted underline underline-offset-4">
              Sources
            </Link>
          </div>
        </header>
        <div className="flex grow flex-col">{children}</div>
      </body>
    </html>
  );
}
