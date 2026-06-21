const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const ALLOWED_PDF_BYTES = 25 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Unsupported image format. Use PNG, JPG, WebP, GIF, or SVG.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 5 MB or smaller.";
  }
  return null;
}

export function validatePdfFile(file: File): string | null {
  if (file.type !== "application/pdf") {
    return "Only PDF files are allowed.";
  }
  if (file.size > ALLOWED_PDF_BYTES) {
    return "PDF must be 25 MB or smaller.";
  }
  return null;
}

export function sanitizeText(input: string, maxLength = 5000): string {
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .slice(0, maxLength)
    .trim();
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^\w.\-() ]+/g, "_").slice(0, 120) || "download";
}

export async function readFileAsDataUrl(
  file: File,
  validator?: (file: File) => string | null
): Promise<{ dataUrl: string | null; error: string | null }> {
  if (validator) {
    const err = validator(file);
    if (err) return { dataUrl: null, error: err };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve({ dataUrl: typeof reader.result === "string" ? reader.result : null, error: null });
    reader.onerror = () => resolve({ dataUrl: null, error: "Failed to read file." });
    reader.readAsDataURL(file);
  });
}
