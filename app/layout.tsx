import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Noto_Sans_Thai, Poppins } from "next/font/google";
import "./globals.css";

import { siteConfig } from "@/config/site";
import { getPublicSiteSettings } from "@/lib/site-settings";

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();

  return {
    metadataBase: new URL("https://example.com"),
    title: {
      default: settings.companyName,
      template: `%s | ${settings.companyName}`,
    },
    description: settings.seo.description,
    openGraph: {
      title: settings.companyName,
      description: settings.seo.description,
      type: "website",
      locale: "th_TH",
    },
  };
}

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
