import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { ToolLoading } from "./ToolLayout";

const load = (loader: () => Promise<{ default: ComponentType }>, ssr = false) =>
  dynamic(loader, { loading: ToolLoading, ssr });

const toolComponents: Record<string, ComponentType> = {
  "invoice-generator": load(() => import("./InvoiceGenerator")),
  "qr-code-generator": load(() => import("./QRCodeGenerator")),
  "pdf-merger": load(() => import("./PDFMerger")),
  "pdf-splitter": load(() => import("./PDFSplitter")),
  "image-compressor": load(() => import("./ImageCompressor")),
  "image-resizer": load(() => import("./ImageResizer")),
  "word-counter": load(() => import("./WordCounter"), true),
  "password-generator": load(() => import("./PasswordGenerator"), true),
  "text-case-converter": load(() => import("./TextCaseConverter"), true),
  "json-formatter": load(() => import("./JSONFormatter"), true),
  "url-encoder-decoder": load(() => import("./URLEncoderDecoder"), true),
  "color-palette-generator": load(() => import("./ColorPaletteGenerator"), true),
  "lorem-ipsum-generator": load(() => import("./LoremIpsumGenerator"), true),
  "age-calculator": load(() => import("./AgeCalculator"), true),
  "unit-converter": load(() => import("./UnitConverter"), true),
  "emi-calculator": load(() => import("./EMICalculator"), true),
  "percentage-calculator": load(() => import("./PercentageCalculator"), true),
  "discount-calculator": load(() => import("./DiscountCalculator"), true),
  "bmi-calculator": load(() => import("./BMICalculator"), true),
  "currency-converter": load(() => import("./CurrencyConverter"), true),
};

export function getToolComponent(slug: string): ComponentType | null {
  return toolComponents[slug] || null;
}
