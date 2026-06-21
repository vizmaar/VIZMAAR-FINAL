import { renderInvoiceLayout } from "../pdf-layout";
import { modernTheme } from "./themes";

export const modernTemplate = {
  id: "modern" as const,
  name: "Modern",
  description: "Indigo SaaS-style invoice — single page A4",
  theme: modernTheme,
  render: (doc: import("jspdf").jsPDF, invoice: import("../types").InvoiceData, totals: import("../types").InvoiceTotals) => {
    renderInvoiceLayout(doc, invoice, totals, modernTheme);
  },
};
