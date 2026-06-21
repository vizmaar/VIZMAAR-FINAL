"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { SITE_CONFIG } from "@/lib/site-config";
import { sanitizeText } from "@/lib/security";

export default function ContactPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const name = sanitizeText(String(form.get("name") ?? ""), 120);
    const email = sanitizeText(String(form.get("email") ?? ""), 200);
    const subject = sanitizeText(String(form.get("subject") ?? ""), 200);
    const message = sanitizeText(String(form.get("message") ?? ""), 4000);

    if (!name || !email || !subject || !message) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const body = `Name: ${name}%0D%0AEmail: ${encodeURIComponent(email)}%0D%0A%0D%0A${encodeURIComponent(message)}`;
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Contact Us</h1>
      <p className="text-muted mb-8">
        Have a question, partnership inquiry, or feedback? Send us a message.
      </p>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required maxLength={120} placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                maxLength={200}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" required maxLength={200} placeholder="How can we help?" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required maxLength={4000} rows={5} placeholder="Your message..." />
          </div>
          {error && (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit">
            <Send className="h-4 w-4" /> Send via Email
          </Button>
        </form>
      </Card>

      <p className="text-sm text-muted mt-6 text-center">
        Or email us directly at{" "}
        <a href={`mailto:${SITE_CONFIG.email}`} className="text-brand hover:underline">
          {SITE_CONFIG.email}
        </a>
      </p>
    </div>
  );
}
