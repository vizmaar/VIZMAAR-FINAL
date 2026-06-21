import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateSEO,
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
} from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  ...generateSEO({
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    keywords: [
      "free online tools",
      "PDF tools",
      "invoice generator",
      "productivity",
      "calculators",
      "image compressor",
    ],
  }),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen flex flex-col antialiased`}>
        <JsonLd
          data={[
            generateWebsiteSchema(),
            generateOrganizationSchema(),
            generateSoftwareApplicationSchema(),
          ]}
        />
        <ThemeProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
