import type { InvoiceData, InvoiceTotals, LineItem } from "./types";

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  PKR: "Rs",
  EUR: "€",
  GBP: "£",
  AED: "AED",
  SAR: "SAR",
  INR: "₹",
  CAD: "C$",
  AUD: "A$",
};

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

export function formatMoney(amount: number, currency: string): string {
  const sym = getCurrencySymbol(currency);
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (sym.length <= 1) return `${sym}${formatted}`;
  return `${sym} ${formatted}`;
}

export function lineItemAmount(item: LineItem): number {
  return item.quantity * item.rate;
}

export function lineItemTax(item: LineItem, taxRate: number): number {
  return lineItemAmount(item) * (taxRate / 100);
}

export function calculateInvoiceTotals(invoice: InvoiceData): InvoiceTotals {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + lineItemAmount(item),
    0
  );
  const discount = subtotal * (invoice.discountRate / 100);
  const taxableAmount = Math.max(subtotal - discount, 0);
  const tax = taxableAmount * (invoice.taxRate / 100);
  const total = taxableAmount + tax;

  return { subtotal, discount, taxableAmount, tax, total };
}
