"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { ToolLayout } from "./ToolLayout";
import { readFileAsDataUrl, validateImageFile } from "@/lib/security";
import {
  calculateInvoiceTotals,
  CURRENCY_SYMBOLS,
  downloadInvoicePdf,
  formatMoney,
  TEMPLATE_LIST,
  type InvoiceData,
  type InvoiceStatus,
  type InvoiceTemplateId,
  type LineItem,
} from "@/lib/invoice/generate-invoice-pdf";

const EMPTY_BANK = {
  bankName: "",
  accountName: "",
  accountNumber: "",
  routingNumber: "",
  swiftCode: "",
  iban: "",
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface/50 p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

export default function InvoiceGenerator() {
  const [templateId, setTemplateId] = useState<InvoiceTemplateId>("corporate");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [status, setStatus] = useState<InvoiceStatus>("pending");
  const [fromName, setFromName] = useState("");
  const [fromTagline, setFromTagline] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromPhone, setFromPhone] = useState("");
  const [fromWebsite, setFromWebsite] = useState("");
  const [toName, setToName] = useState("");
  const [toCompany, setToCompany] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [bankDetails, setBankDetails] = useState(EMPTY_BANK);
  const [signatureName, setSignatureName] = useState("");
  const [signatureTitle, setSignatureTitle] = useState("");
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0 },
  ]);
  const [currency, setCurrency] = useState("USD");
  const [logo, setLogo] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleLogoUpload = async (file: File | undefined) => {
    setUploadError(null);
    if (!file) return;
    const { dataUrl, error } = await readFileAsDataUrl(file, validateImageFile);
    if (error) {
      setUploadError(error);
      return;
    }
    setLogo(dataUrl);
  };

  const handleSignatureUpload = async (file: File | undefined) => {
    setUploadError(null);
    if (!file) return;
    const { dataUrl, error } = await readFileAsDataUrl(file, validateImageFile);
    if (error) {
      setUploadError(error);
      return;
    }
    setSignatureImage(dataUrl);
  };

  const invoice: InvoiceData = {
    invoiceNumber,
    status,
    date,
    dueDate,
    currency,
    templateId,
    fromName,
    fromTagline,
    fromEmail,
    fromAddress: "",
    fromPhone,
    fromWebsite,
    fromTaxId: "",
    toName,
    toCompany,
    toEmail,
    toAddress,
    toPhone: "",
    items,
    taxRate,
    discountRate,
    bankDetails,
    signatureName,
    signatureTitle,
    signatureImage,
    logo,
  };

  const totals = calculateInvoiceTotals(invoice);

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const updateBank = (field: keyof typeof EMPTY_BANK, value: string) => {
    setBankDetails((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const selectClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground";

  return (
    <ToolLayout>
      {uploadError && (
        <p className="text-sm text-error" role="alert">
          {uploadError}
        </p>
      )}
      <Section title="PDF Template">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEMPLATE_LIST.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setTemplateId(template.id)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                templateId === template.id
                  ? "border-brand bg-brand-light/40 dark:bg-brand-light/10 ring-2 ring-brand/30"
                  : "border-border hover:border-brand/50 hover:bg-surface-hover"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">{template.name}</p>
              <p className="text-xs text-muted mt-1">{template.description}</p>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Company & Branding">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Company Logo</Label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-brand-hover cursor-pointer"
              onChange={(e) => handleLogoUpload(e.target.files?.[0])}
            />
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="Logo" className="h-16 mt-2 object-contain" />
            )}
          </div>
          <div>
            <Label>Company Name</Label>
            <Input value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Acme Inc." />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input value={fromTagline} onChange={(e) => setFromTagline(e.target.value)} placeholder="Your tagline" />
          </div>
        </div>
      </Section>

      <Section title="Invoice Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Invoice Number</Label>
            <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
          </div>
          <div>
            <Label>Status</Label>
            <select value={status} onChange={(e) => setStatus(e.target.value as InvoiceStatus)} className={selectClass}>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <Label>Currency</Label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={selectClass}>
              {Object.keys(CURRENCY_SYMBOLS).map((code) => (
                <option key={code} value={code}>{code} ({CURRENCY_SYMBOLS[code]})</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Issue Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Bill To">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Client Name</Label>
            <Input value={toName} onChange={(e) => setToName(e.target.value)} />
          </div>
          <div>
            <Label>Company</Label>
            <Input value={toCompany} onChange={(e) => setToCompany(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Address</Label>
            <Textarea value={toAddress} onChange={(e) => setToAddress(e.target.value)} rows={2} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={toEmail} onChange={(e) => setToEmail(e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Line Items">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2 mb-2">
            <Input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} className="flex-1" />
            <Input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(i, "quantity", Number(e.target.value))} className="w-full sm:w-20" />
            <Input type="number" min="0" step="0.01" placeholder="Unit Price" value={item.rate} onChange={(e) => updateItem(i, "rate", Number(e.target.value))} className="w-full sm:w-28" />
            <Button variant="ghost" size="sm" onClick={() => removeItem(i)} disabled={items.length === 1}>Remove</Button>
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={addItem}>Add Item</Button>
      </Section>

      <Section title="Tax & Discount">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Tax Rate (%)</Label>
            <Input type="number" min="0" step="0.01" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
          </div>
          <div>
            <Label>Discount (%)</Label>
            <Input type="number" min="0" step="0.01" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} />
          </div>
        </div>
      </Section>

      <Section title="Payment Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Bank Name</Label>
            <Input value={bankDetails.bankName} onChange={(e) => updateBank("bankName", e.target.value)} />
          </div>
          <div>
            <Label>Account Name</Label>
            <Input value={bankDetails.accountName} onChange={(e) => updateBank("accountName", e.target.value)} />
          </div>
          <div>
            <Label>Account Number</Label>
            <Input value={bankDetails.accountNumber} onChange={(e) => updateBank("accountNumber", e.target.value)} />
          </div>
          <div>
            <Label>IBAN</Label>
            <Input value={bankDetails.iban} onChange={(e) => updateBank("iban", e.target.value)} />
          </div>
          <div>
            <Label>Swift Code</Label>
            <Input value={bankDetails.swiftCode} onChange={(e) => updateBank("swiftCode", e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Signature (optional)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Signature Image</Label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-brand-hover cursor-pointer"
              onChange={(e) => handleSignatureUpload(e.target.files?.[0])}
            />
            {signatureImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={signatureImage} alt="Signature" className="h-12 mt-2 object-contain" />
            )}
          </div>
          <div>
            <Label>Signature Name</Label>
            <Input value={signatureName} onChange={(e) => setSignatureName(e.target.value)} placeholder="Or type name" />
          </div>
          <div>
            <Label>Signature Label</Label>
            <Input value={signatureTitle} onChange={(e) => setSignatureTitle(e.target.value)} placeholder="Authorised Sign" />
          </div>
        </div>
      </Section>

      <Section title="Footer">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Website</Label>
            <Input value={fromWebsite} onChange={(e) => setFromWebsite(e.target.value)} placeholder="www.company.com" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} placeholder="billing@company.com" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={fromPhone} onChange={(e) => setFromPhone(e.target.value)} placeholder="+1 555 000 0000" />
          </div>
        </div>
      </Section>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-border pt-4">
        <div className="text-sm text-muted space-y-1">
          <p>Subtotal: {formatMoney(totals.subtotal, currency)}</p>
          {discountRate > 0 && <p>Discount: -{formatMoney(totals.discount, currency)}</p>}
          <p>Tax: {formatMoney(totals.tax, currency)}</p>
          <p className="font-semibold text-foreground text-base">Grand Total: {formatMoney(totals.total, currency)}</p>
        </div>
        <Button onClick={() => downloadInvoicePdf(invoice)} size="lg">
          Download Invoice PDF
        </Button>
      </div>
    </ToolLayout>
  );
}
