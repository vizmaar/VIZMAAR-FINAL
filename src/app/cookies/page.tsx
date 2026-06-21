import { generateSEO } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata = generateSEO({
  title: "Cookie Policy",
  description: `Learn how ${SITE_CONFIG.name} uses cookies, local storage, and advertising technologies.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 21, 2026</p>
      <div className="prose-vizmaar">
        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website. They help
          websites remember preferences and understand how visitors use the site.
        </p>

        <h2>How We Use Cookies</h2>
        <p>{SITE_CONFIG.name} uses the following categories of cookies and storage:</p>
        <ul>
          <li>
            <strong>Essential:</strong> Theme preference stored in localStorage so your light/dark
            mode choice persists.
          </li>
          <li>
            <strong>Analytics (optional):</strong> Anonymous usage statistics to improve performance
            and content, only after consent where required.
          </li>
          <li>
            <strong>Advertising (optional):</strong> Cookies from partners such as Google AdSense
            to serve and measure ads, only after consent where required.
          </li>
        </ul>

        <h2>Google AdSense</h2>
        <p>
          Google, as a third-party vendor, uses cookies to serve ads on {SITE_CONFIG.name}. Google&apos;s
          use of advertising cookies enables it and its partners to serve ads based on your visit to
          this site and other sites on the Internet. You may opt out of personalized advertising by
          visiting{" "}
          <a href="https://www.google.com/settings/ads" rel="noopener noreferrer" target="_blank">
            Google Ads Settings
          </a>
          .
        </p>

        <h2>Managing Cookies</h2>
        <p>
          You can accept or decline non-essential cookies using our consent banner. You may also clear
          cookies and local storage through your browser settings at any time.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
        </p>
      </div>
    </div>
  );
}
