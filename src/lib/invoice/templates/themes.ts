import type { InvoiceTheme } from "../types";

const status = {
  paid: { bg: { r: 220, g: 252, b: 231 }, text: { r: 22, g: 101, b: 52 }, label: "PAID" },
  pending: { bg: { r: 254, g: 243, b: 199 }, text: { r: 180, g: 83, b: 9 }, label: "PENDING" },
  overdue: { bg: { r: 254, g: 226, b: 226 }, text: { r: 185, g: 28, b: 28 }, label: "OVERDUE" },
};

export const corporateTheme: InvoiceTheme = {
  accent: { r: 255, g: 210, b: 0 },
  primary: { r: 45, g: 45, b: 45 },
  primaryDark: { r: 23, g: 23, b: 23 },
  text: { r: 30, g: 30, b: 30 },
  textMuted: { r: 110, g: 110, b: 110 },
  border: { r: 220, g: 220, b: 220 },
  surface: { r: 250, g: 250, b: 250 },
  tableHeaderBg: { r: 45, g: 45, b: 45 },
  tableHeaderText: { r: 255, g: 255, b: 255 },
  tableRowAlt: { r: 248, g: 248, b: 248 },
  totalBoxBg: { r: 255, g: 210, b: 0 },
  totalAccent: { r: 30, g: 30, b: 30 },
  status,
};

export const modernTheme: InvoiceTheme = {
  accent: { r: 99, g: 102, b: 241 },
  primary: { r: 79, g: 70, b: 229 },
  primaryDark: { r: 49, g: 46, b: 129 },
  text: { r: 15, g: 23, b: 42 },
  textMuted: { r: 100, g: 116, b: 139 },
  border: { r: 226, g: 232, b: 240 },
  surface: { r: 248, g: 250, b: 252 },
  tableHeaderBg: { r: 79, g: 70, b: 229 },
  tableHeaderText: { r: 255, g: 255, b: 255 },
  tableRowAlt: { r: 248, g: 250, b: 252 },
  totalBoxBg: { r: 238, g: 242, b: 255 },
  totalAccent: { r: 79, g: 70, b: 229 },
  status,
};

export const minimalTheme: InvoiceTheme = {
  accent: { r: 64, g: 64, b: 64 },
  primary: { r: 23, g: 23, b: 23 },
  primaryDark: { r: 0, g: 0, b: 0 },
  text: { r: 23, g: 23, b: 23 },
  textMuted: { r: 115, g: 115, b: 115 },
  border: { r: 212, g: 212, b: 212 },
  surface: { r: 250, g: 250, b: 250 },
  tableHeaderBg: { r: 64, g: 64, b: 64 },
  tableHeaderText: { r: 255, g: 255, b: 255 },
  tableRowAlt: { r: 252, g: 252, b: 252 },
  totalBoxBg: { r: 245, g: 245, b: 245 },
  totalAccent: { r: 23, g: 23, b: 23 },
  status,
};
