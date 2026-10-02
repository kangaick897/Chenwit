import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Noto_Sans_Thai, Poppins } from "next/font/google";
import "./globals.css";

import { siteConfig } from "@/config/site";

const sans = Noto_Sans_Thai({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  display: "swap",
});

const latin = Poppins({
  variable: "--font-latin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.companyName}`,
  },
  description: siteConfig.seo.description,
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    type: "website",
    locale: "th_TH",
  },
};

const themeStyle = {
  "--navy": siteConfig.theme.navy,
  "--gold": siteConfig.theme.gold,
  "--ivory": siteConfig.theme.ivory,
  "--cream": siteConfig.theme.cream,
  "--taupe": siteConfig.theme.taupe,
  "--gray-beige": siteConfig.theme.grayBeige,
  "--charcoal": siteConfig.theme.charcoal,
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${sans.variable} ${latin.variable}`} style={themeStyle}>
      <body>{children}</body>
    </html>
  );
}
