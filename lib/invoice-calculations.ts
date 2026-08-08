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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
