import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Page Not Found",
  description: "The page you are looking for could not be found on VIZMAAR.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground">Page not found</h1>
      <p className="mt-3 text-muted">
        The page you requested does not exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
        <Link href="/tools">
          <Button variant="secondary">Browse Tools</Button>
        </Link>
      </div>
    </div>
  );
}
