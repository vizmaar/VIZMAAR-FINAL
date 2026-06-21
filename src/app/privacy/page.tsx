import { generateSEO } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata = generateSEO({
  title: "Privacy Policy",
  description: `Read the ${SITE_CONFIG.name} privacy policy. Learn how we protect your data with client-side processing and transparent advertising practices.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 21, 2026</p>
      <div className="prose-vizmaar">
        <h2>Overview</h2>
        <p>
          At {SITE_CONFIG.name}, privacy is a core product principle. Our tools process data in your
          browser whenever possible. We do not require account registration to use the platform.
        </p>

        <h2>Data Processing</h2>
        <p>
          Tools such as PDF merger, image compressor, and invoice generator run locally in your
          browser. Your files are not uploaded to our servers for processing.
        </p>

        <h2>Information We May Collect</h2>
        <p>
          We may collect limited, non-personal usage data such as page views, device type, and
          general location through analytics providers. If you contact us, we collect the information
          you voluntarily provide (name, email, message).
        </p>

        <h2>Advertising</h2>
        <p>
          We may display advertisements through Google AdSense or similar partners. These services
          may use cookies and similar technologies to serve relevant ads and measure performance.
          You can manage ad personalization in your Google Ads Settings and browser cookie controls.
        </p>

        <h2>Cookies</h2>
        <p>
          We use essential storage for theme preferences and optional cookies for analytics and
          advertising. See our{" "}
          <a href="/cookies">Cookie Policy</a> for details.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          Tool functionality does not depend on paid AI APIs. Third-party services may include
          hosting (Vercel), analytics, and advertising networks subject to their own policies.
        </p>

        <h2>Data Retention</h2>
        <p>
          Client-side tool data remains on your device unless you download or share it. Contact form
          submissions sent by email are retained only as long as needed to respond.
        </p>

        <h2>Your Rights</h2>
        <p>
          Depending on your region, you may have rights to access, correct, or delete personal data
          we hold. Contact us to exercise these rights.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy inquiries, email{" "}
          <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
        </p>
      </div>
    </div>
  );
}
