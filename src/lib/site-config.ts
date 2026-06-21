function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://vizmaar.com";
}

export const SITE_CONFIG = {
  name: "VIZMAAR",
  tagline: "Premium Free Online Tools for Everyone",
  description:
    "VIZMAAR offers 20+ free, privacy-first online tools — PDF utilities, image editors, calculators, invoice generator, and productivity helpers. No signup, 100% client-side.",
  url: getSiteUrl(),
  email: "hello@vizmaar.com",
  twitter: "@vizmaar",
  locale: "en_US",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
] as const;

export const FOOTER_LINKS = {
  tools: [
    { href: "/tools/invoice-generator", label: "Invoice Generator" },
    { href: "/tools/pdf-merger", label: "PDF Merger" },
    { href: "/tools/qr-code-generator", label: "QR Code Generator" },
    { href: "/tools/image-compressor", label: "Image Compressor" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
} as const;
