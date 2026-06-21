import type { jsPDF } from "jspdf";
import type { BankDetails, InvoiceData, InvoiceStatus, InvoiceTheme, InvoiceTotals, RGB } from "./types";
import { formatMoney, lineItemAmount } from "./calculations";

const W = 210;
const H = 297;
const M = 12;
const CW = W - M * 2;
const FOOTER_Y = H - M;

function rgb(doc: jsPDF, c: RGB, mode: "text" | "fill" | "draw" = "text") {
  if (mode === "text") doc.setTextColor(c.r, c.g, c.b);
  else if (mode === "fill") doc.setFillColor(c.r, c.g, c.b);
  else doc.setDrawColor(c.r, c.g, c.b);
}

function fmtDate(d: string): string {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  return `${day.padStart(2, "0")} / ${m.padStart(2, "0")} / ${y}`;
}

function imgFmt(src: string): "PNG" | "JPEG" | "WEBP" {
  if (src.includes("image/jpeg") || src.includes("image/jpg")) return "JPEG";
  if (src.includes("image/webp")) return "WEBP";
  return "PNG";
}

function addImg(doc: jsPDF, src: string | null, x: number, y: number, w: number, h: number) {
  if (!src) return;
  try {
    doc.addImage(src, imgFmt(src), x, y, w, h, undefined, "FAST");
  } catch {
    /* skip */
  }
}

function clip(text: string, max = 60): string {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function lineTax(amount: number, taxRate: number): number {
  return amount * (taxRate / 100);
}

function hasBank(b: BankDetails): boolean {
  return [b.bankName, b.accountName, b.accountNumber, b.iban, b.swiftCode].some((v) => v.trim());
}

function hasSig(invoice: InvoiceData): boolean {
  return Boolean(
    invoice.signatureImage ||
      invoice.signatureName.trim() ||
      invoice.signatureTitle.trim()
  );
}

function drawStatusBadge(doc: jsPDF, status: InvoiceStatus, x: number, y: number, theme: InvoiceTheme) {
  const s = theme.status[status];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  const label = s.label;
  const tw = doc.getTextWidth(label);
  const pw = 3;
  const bh = 5.5;
  rgb(doc, s.bg, "fill");
  doc.roundedRect(x - tw - pw * 2, y - bh + 1, tw + pw * 2, bh, 1.2, 1.2, "F");
  rgb(doc, s.text, "text");
  doc.text(label, x - pw, y, { align: "right" });
}

function measureBottomBlock(invoice: InvoiceData): number {
  let h = 10;
  if (hasBank(invoice.bankDetails)) h += 22;
  h += 34;
  if (hasSig(invoice)) h += 16;
  h += 8;
  return h;
}

function drawTopHeader(doc: jsPDF, invoice: InvoiceData, theme: InvoiceTheme): number {
  const y0 = M;
  const logoSize = 14;
  addImg(doc, invoice.logo, M, y0, logoSize, logoSize);

  const brandX = invoice.logo ? M + logoSize + 4 : M;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  rgb(doc, theme.text, "text");
  doc.text(invoice.fromName || "Company Name", brandX, y0 + 5);

  if (invoice.fromTagline.trim()) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    rgb(doc, theme.textMuted, "text");
    doc.text(invoice.fromTagline.toUpperCase(), brandX, y0 + 9.5);
  }

  const rightX = M + CW;
  drawStatusBadge(doc, invoice.status, rightX, y0 + 4, theme);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  rgb(doc, theme.text, "text");
  doc.text("INVOICE", rightX, y0 + 12, { align: "right" });

  const barY = y0 + 16;
  const barH = 3;
  rgb(doc, theme.accent, "fill");
  doc.rect(M, barY, CW * 0.72, barH, "F");

  return y0 + 22;
}

function drawPartiesRow(doc: jsPDF, invoice: InvoiceData, totals: InvoiceTotals, theme: InvoiceTheme, y: number): number {
  const leftW = CW * 0.52;
  const rightX = M + leftW + 6;

  rgb(doc, theme.surface, "fill");
  rgb(doc, theme.border, "draw");
  doc.setLineWidth(0.2);
  doc.roundedRect(M, y, leftW, 30, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  rgb(doc, theme.textMuted, "text");
  doc.text("BILL TO", M + 4, y + 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  rgb(doc, theme.text, "text");
  doc.text(invoice.toName || "Client Name", M + 4, y + 10.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  rgb(doc, theme.textMuted, "text");
  let ly = y + 14.5;
  [invoice.toCompany, clip(invoice.toAddress, 48), invoice.toEmail]
    .filter((l) => l.trim())
    .forEach((line) => {
      doc.text(line, M + 4, ly);
      ly += 4;
    });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  rgb(doc, theme.textMuted, "text");
  doc.text("INVOICE DETAILS", rightX, y + 5);

  const rows: [string, string][] = [
    ["Invoice Number", invoice.invoiceNumber],
    ["Issue Date", fmtDate(invoice.date)],
    ["Due Date", fmtDate(invoice.dueDate)],
    ["Currency", invoice.currency],
    ["Amount Due", formatMoney(totals.total, invoice.currency)],
  ];

  let ry = y + 10;
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    rgb(doc, theme.textMuted, "text");
    doc.text(label, rightX, ry);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    rgb(doc, theme.text, "text");
    doc.text(value, M + CW, ry, { align: "right" });
    ry += 4.5;
  });

  return y + 34;
}

function drawItemsTable(
  doc: jsPDF,
  invoice: InvoiceData,
  theme: InvoiceTheme,
  y: number,
  maxY: number
): number {
  const items = invoice.items.length > 0 ? invoice.items : [{ description: "—", quantity: 0, rate: 0 }];
  const count = items.length;
  const headerH = 7;
  const minRow = 5.2;
  const maxRow = 7.5;
  const rowH = Math.max(minRow, Math.min(maxRow, (maxY - y - headerH) / count));

  const tx = M;
  const tw = CW;
  const cols = {
    desc: { x: tx + 3, w: 72 },
    qty: { x: tx + 78, w: 14 },
    unit: { x: tx + 94, w: 28 },
    tax: { x: tx + 124, w: 24 },
    total: { x: tx + 150, w: tw - 153 },
  };

  rgb(doc, theme.tableHeaderBg, "fill");
  doc.rect(tx, y, tw, headerH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  rgb(doc, theme.tableHeaderText, "text");
  doc.text("Description", cols.desc.x, y + 4.8);
  doc.text("Qty", cols.qty.x + cols.qty.w / 2, y + 4.8, { align: "center" });
  doc.text("Unit Price", cols.unit.x + cols.unit.w, y + 4.8, { align: "right" });
  doc.text("Tax", cols.tax.x + cols.tax.w, y + 4.8, { align: "right" });
  doc.text("Total", cols.total.x + cols.total.w, y + 4.8, { align: "right" });

  const cy = y + headerH;
  rgb(doc, theme.border, "draw");
  doc.setLineWidth(0.25);
  doc.rect(tx, y, tw, headerH + rowH * count, "S");

  items.forEach((item, i) => {
    const rowTop = cy + i * rowH;
    if (i % 2 === 1) {
      rgb(doc, theme.tableRowAlt, "fill");
      doc.rect(tx, rowTop, tw, rowH, "F");
    }

    const amount = lineItemAmount(item);
    const tax = lineTax(amount, invoice.taxRate);
    const fs = rowH < 6 ? 7 : 7.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(fs);
    rgb(doc, theme.text, "text");

    const desc = clip(item.description || "—", 42);
    doc.text(desc, cols.desc.x, rowTop + rowH * 0.65);
    doc.text(String(item.quantity), cols.qty.x + cols.qty.w / 2, rowTop + rowH * 0.65, { align: "center" });
    doc.text(formatMoney(item.rate, invoice.currency), cols.unit.x + cols.unit.w, rowTop + rowH * 0.65, { align: "right" });
    doc.text(formatMoney(tax, invoice.currency), cols.tax.x + cols.tax.w, rowTop + rowH * 0.65, { align: "right" });
    doc.text(formatMoney(amount, invoice.currency), cols.total.x + cols.total.w, rowTop + rowH * 0.65, { align: "right" });
  });

  return y + headerH + rowH * count + 3;
}

function drawPaymentBlock(doc: jsPDF, invoice: InvoiceData, theme: InvoiceTheme, y: number): number {
  if (!hasBank(invoice.bankDetails)) return y;

  const b = invoice.bankDetails;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  rgb(doc, theme.text, "text");
  doc.text("PAYMENT DETAILS", M, y);

  const rows = (
    [
      ["Bank Name", b.bankName],
      ["Account Name", b.accountName],
      ["Account Number", b.accountNumber],
      ["IBAN", b.iban],
      ["Swift Code", b.swiftCode],
    ] as [string, string][]
  ).filter(([, v]) => v.trim());

  let cy = y + 5;
  doc.setFontSize(7);
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    rgb(doc, theme.textMuted, "text");
    doc.text(`${label}:`, M, cy);
    doc.setFont("helvetica", "bold");
    rgb(doc, theme.text, "text");
    doc.text(clip(value, 36), M + 30, cy);
    cy += 3.8;
  });

  return cy + 2;
}

function drawTotalsCard(
  doc: jsPDF,
  invoice: InvoiceData,
  totals: InvoiceTotals,
  theme: InvoiceTheme,
  y: number
): number {
  const boxW = 68;
  const boxX = M + CW - boxW;
  let cy = y;

  rgb(doc, theme.border, "draw");
  doc.setLineWidth(0.2);
  doc.roundedRect(boxX - 3, cy - 3, boxW + 6, 38, 1.5, 1.5, "S");

  const row = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 9 : 8);
    rgb(doc, bold ? theme.text : theme.textMuted, "text");
    doc.text(label, boxX, cy);
    rgb(doc, theme.text, "text");
    doc.text(value, boxX + boxW, cy, { align: "right" });
    cy += bold ? 8 : 5.5;
  };

  row("Subtotal", formatMoney(totals.subtotal, invoice.currency));
  if (invoice.discountRate > 0) {
    row("Discount", `-${formatMoney(totals.discount, invoice.currency)}`);
  }
  row("Tax", formatMoney(totals.tax, invoice.currency));

  rgb(doc, theme.accent, "fill");
  doc.rect(boxX - 3, cy - 1, boxW + 6, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  rgb(doc, theme.totalAccent, "text");
  doc.text("Grand Total", boxX, cy + 5);
  doc.text(formatMoney(totals.total, invoice.currency), boxX + boxW, cy + 5, { align: "right" });

  return cy + 12;
}

function drawSignatureBlock(doc: jsPDF, invoice: InvoiceData, theme: InvoiceTheme, y: number) {
  const sigW = 44;
  const sigH = 14;
  const sigX = M + CW - sigW;

  if (invoice.signatureImage) {
    addImg(doc, invoice.signatureImage, sigX, y - sigH + 2, sigW, sigH);
  } else if (invoice.signatureName.trim()) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    rgb(doc, theme.text, "text");
    doc.text(invoice.signatureName, sigX + sigW / 2, y - 3, { align: "center" });
  } else {
    return;
  }

  rgb(doc, theme.border, "draw");
  doc.setLineWidth(0.3);
  doc.line(sigX, y + 1, sigX + sigW, y + 1);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  rgb(doc, theme.textMuted, "text");
  const label = invoice.signatureTitle.trim() || "Authorised Sign";
  doc.text(label, sigX + sigW / 2, y + 5, { align: "center" });
}

function drawFooterLine(doc: jsPDF, invoice: InvoiceData, theme: InvoiceTheme) {
  rgb(doc, theme.accent, "fill");
  doc.rect(M, FOOTER_Y - 5, CW, 0.8, "F");

  const parts = [
    invoice.fromWebsite.trim(),
    invoice.fromEmail.trim(),
    invoice.fromPhone.trim(),
  ].filter(Boolean);

  if (!parts.length) return;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  rgb(doc, theme.textMuted, "text");
  doc.text(parts.join("   |   "), M + CW / 2, FOOTER_Y, { align: "center" });
}

function stripExtraPages(doc: jsPDF) {
  while (doc.getNumberOfPages() > 1) {
    doc.deletePage(doc.getNumberOfPages());
  }
}

export function renderInvoiceLayout(
  doc: jsPDF,
  invoice: InvoiceData,
  totals: InvoiceTotals,
  theme: InvoiceTheme
) {
  let y = drawTopHeader(doc, invoice, theme);
  y = drawPartiesRow(doc, invoice, totals, theme, y + 2);

  const bottomH = measureBottomBlock(invoice);
  const tableMaxY = FOOTER_Y - bottomH - 6;
  drawItemsTable(doc, invoice, theme, y + 1, tableMaxY);

  const blockY = FOOTER_Y - bottomH + 2;
  drawPaymentBlock(doc, invoice, theme, blockY);
  drawTotalsCard(doc, invoice, totals, theme, blockY);

  if (hasSig(invoice)) {
    drawSignatureBlock(doc, invoice, theme, blockY + 30);
  }

  drawFooterLine(doc, invoice, theme);
  stripExtraPages(doc);
}
