import type { InvoiceTemplate, InvoiceTemplateId } from "../types";
import { modernTemplate } from "./modern";
import { corporateTemplate } from "./corporate";
import { minimalTemplate } from "./minimal";

export const INVOICE_TEMPLATES: Record<InvoiceTemplateId, InvoiceTemplate> = {
  modern: modernTemplate,
  corporate: corporateTemplate,
  minimal: minimalTemplate,
};

export const TEMPLATE_LIST: InvoiceTemplate[] = [
  modernTemplate,
  corporateTemplate,
  minimalTemplate,
];

export function getInvoiceTemplate(id: InvoiceTemplateId): InvoiceTemplate {
  return INVOICE_TEMPLATES[id] ?? corporateTemplate;
}
