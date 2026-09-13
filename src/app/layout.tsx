import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

// Bricolage Grotesque is a variable font on three axes: wght, opsz and wdth.
// Pinning `weight: ["800"]` shipped a single static cut, so `font-semibold`
// (the h2 style) had nothing to interpolate to and the optical-size axis was
// left for the browser to guess. Both are design-visible — see the
// font-variation-settings note in globals.css.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tridal — Trade smarter with AI that's on your side",
  description:
    "Open positions on stocks, crypto and forex in seconds — with insights that explain the market in plain language.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${plexMono.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
