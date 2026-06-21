import { renderInvoiceLayout } from "../pdf-layout";
import { minimalTheme } from "./themes";

export const minimalTemplate = {
  id: "minimal" as const,
  name: "Minimal",
  description: "Minimal monochrome enterprise invoice — single page A4",
  theme: minimalTheme,
  render: (doc: import("jspdf").jsPDF, invoice: import("../types").InvoiceData, totals: import("../types").InvoiceTotals) => {
    renderInvoiceLayout(doc, invoice, totals, minimalTheme);
  },
};
