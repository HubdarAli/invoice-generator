import type { InvoiceData, InvoiceCalculations } from "./invoice-types";

export function calculateInvoice(data: InvoiceData): InvoiceCalculations {
  // Calculate subtotal
  const subtotal = data.items.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);

  // Calculate discount
  let discountAmount = 0;
  if (data.discountValue > 0) {
    if (data.discountType === "percentage") {
      discountAmount = (subtotal * data.discountValue) / 100;
    } else {
      discountAmount = Math.min(data.discountValue, subtotal);
    }
  }

  // Calculate taxable amount (after discount)
  const taxableAmount = subtotal - discountAmount;

  // Calculate tax
  const taxAmount = (taxableAmount * data.taxRate) / 100;

  // Calculate total
  const total = taxableAmount + taxAmount + (data.deliveryCharges || 0);

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total,
  };
}

export function toDatetimeLocalValue(date: Date = new Date()): string {
  const pad = (value: number) => value.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseInvoiceDate(dateString: string): Date | null {
  if (!dateString) return null;

  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function hasInvoiceTime(dateString: string): boolean {
  return /T\d/.test(dateString);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = parseInvoiceDate(dateString);
  if (!date) return "-";

  if (hasInvoiceTime(dateString)) {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
