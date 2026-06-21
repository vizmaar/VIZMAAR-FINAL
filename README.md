# VIZMAAR

Premium free online tools — PDF utilities, calculators, invoice generator, and productivity helpers. Built with Next.js 15, React 19, and Tailwind CSS 4.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Import the repository in Vercel
2. Set **Root Directory** to `vizmaar`
3. Add environment variables:
   - `NEXT_PUBLIC_SITE_URL` = `https://vizmaar.com`
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` = (optional, from Search Console)
4. Deploy

## AdSense Setup

1. Replace the placeholder in `public/ads.txt` with your Google publisher ID
2. Add the AdSense script after approval (cookie consent is included)
3. Ensure Privacy and Cookie policies remain updated

## Architecture

- `src/app/` — App Router pages and SEO routes (sitemap, robots, manifest)
- `src/components/tools/` — 20 client-side tools with code-splitting
- `src/lib/invoice/` — Enterprise invoice PDF engine (jsPDF)
- `src/lib/seo.ts` — Metadata and JSON-LD schema helpers

## License

Private — All rights reserved.
