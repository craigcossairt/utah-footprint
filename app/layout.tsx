import type { Metadata, Viewport } from "next";
import { Archivo, Public_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], weight: ["600", "800"] });
const publicSans = Public_Sans({ variable: "--font-public-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Utah Footprint",
  description: "See your water, power and air numbers for your Utah home, and what to change first.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${publicSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="border-b border-line">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 lg:px-8">
            <Link href="/" className="font-display text-lg font-extrabold tracking-tight">
              My Utah Footprint
            </Link>
            <Link href="/sources" className="text-sm text-muted underline underline-offset-4">
              Sources
            </Link>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
