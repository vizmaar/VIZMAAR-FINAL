import { renderInvoiceLayout } from "../pdf-layout";
import { corporateTheme } from "./themes";

export const corporateTemplate = {
  id: "corporate" as const,
  name: "Corporate",
  description: "Premium yellow-accent enterprise invoice — single page A4",
  theme: corporateTheme,
  render: (doc: import("jspdf").jsPDF, invoice: import("../types").InvoiceData, totals: import("../types").InvoiceTotals) => {
    renderInvoiceLayout(doc, invoice, totals, corporateTheme);
  },
};
