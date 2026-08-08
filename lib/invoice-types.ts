export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  // Company Info
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyLogo: string | null;

  // Client Info
  clientName: string;
  clientAddress: string;
  clientPhone: string;

  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;

  // Items
  items: InvoiceItem[];

  // Financials
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  deliveryCharges: number;

  // Footer Description
  footerDescription: string;
}

export interface InvoiceCalculations {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

export type TemplateType =
  | "modern"
  | "creative"
  | "restaurant"
  | "sale-receipt"
  | "thermal-pos"
  | "home-delivery"
  | "customer-bill";

// Function to generate default data - should be called client-side only
export function createDefaultInvoiceData(): InvoiceData {
  return {
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyLogo: null,
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split("T")[0],
    items: [{ id: "1", description: "", quantity: 1, unitPrice: 0 }],
    taxRate: 0,
    discountType: "percentage",
    discountValue: 0,
    deliveryCharges: 0,
    footerDescription: "",
  };
}

// Static default for SSR - uses empty/placeholder values
export const defaultInvoiceData: InvoiceData = {
  companyName: "",
  companyAddress: "",
  companyPhone: "",
  companyLogo: null,
  clientName: "",
  clientAddress: "",
  clientPhone: "",
  invoiceNumber: "",
  invoiceDate: "",
  items: [{ id: "1", description: "", quantity: 1, unitPrice: 0 }],
  taxRate: 0,
  discountType: "percentage",
  discountValue: 0,
  deliveryCharges: 0,
  footerDescription: "",
};
