import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";

const Features = dynamic(() =>
  import("@/components/home/Features").then((m) => ({ default: m.Features }))
);
const ToolsGrid = dynamic(() =>
  import("@/components/home/ToolsGrid").then((m) => ({ default: m.ToolsGrid }))
);
const BlogPreview = dynamic(() =>
  import("@/components/home/BlogPreview").then((m) => ({ default: m.BlogPreview }))
);
const CTA = dynamic(() =>
  import("@/components/home/CTA").then((m) => ({ default: m.CTA }))
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <ToolsGrid />
      <BlogPreview />
      <CTA />
    </>
  );
}
