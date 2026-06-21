import jsPDF from "jspdf";
import type { InvoiceData } from "./types";
import { calculateInvoiceTotals } from "./calculations";
import { getInvoiceTemplate } from "./templates";

export function generateInvoicePdf(invoice: InvoiceData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const totals = calculateInvoiceTotals(invoice);
  const template = getInvoiceTemplate(invoice.templateId);
  template.render(doc, invoice, totals);

  return doc;
}

export function downloadInvoicePdf(invoice: InvoiceData, filename?: string) {
  const doc = generateInvoicePdf(invoice);
  const safeName = (filename ?? invoice.invoiceNumber).replace(/[^\w.-]+/g, "_");
  doc.save(`${safeName}.pdf`);
}

export { calculateInvoiceTotals, formatMoney, getCurrencySymbol, CURRENCY_SYMBOLS } from "./calculations";
export { TEMPLATE_LIST, getInvoiceTemplate } from "./templates";
export type {
  InvoiceData,
  InvoiceTemplateId,
  InvoiceStatus,
  LineItem,
  BankDetails,
} from "./types";
