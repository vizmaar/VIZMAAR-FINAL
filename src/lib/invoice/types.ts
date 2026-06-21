export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

export type InvoiceTemplateId = "modern" | "corporate" | "minimal";

export type InvoiceStatus = "paid" | "pending" | "overdue";

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  iban: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  currency: string;
  templateId: InvoiceTemplateId;

  fromName: string;
  fromEmail: string;
  fromAddress: string;
  fromPhone: string;
  fromWebsite: string;
  fromTaxId: string;
  fromTagline: string;

  toName: string;
  toCompany: string;
  toEmail: string;
  toAddress: string;
  toPhone: string;

  items: LineItem[];
  taxRate: number;
  discountRate: number;

  bankDetails: BankDetails;

  signatureName: string;
  signatureTitle: string;
  signatureImage: string | null;

  logo: string | null;
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  taxableAmount: number;
  tax: number;
  total: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface StatusStyle {
  bg: RGB;
  text: RGB;
  label: string;
}

export interface InvoiceTheme {
  accent: RGB;
  primary: RGB;
  primaryDark: RGB;
  text: RGB;
  textMuted: RGB;
  border: RGB;
  surface: RGB;
  tableHeaderBg: RGB;
  tableHeaderText: RGB;
  tableRowAlt: RGB;
  totalBoxBg: RGB;
  totalAccent: RGB;
  status: Record<InvoiceStatus, StatusStyle>;
}

export interface InvoiceTemplate {
  id: InvoiceTemplateId;
  name: string;
  description: string;
  theme: InvoiceTheme;
  render: (doc: import("jspdf").jsPDF, invoice: InvoiceData, totals: InvoiceTotals) => void;
}
