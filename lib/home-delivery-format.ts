import type { InvoiceData, InvoiceItem } from "./invoice-types";

export interface HomeDeliveryItemRow {
  item: InvoiceItem;
  nameLines: string[];
  lineDiscount: number;
  lineGross: number;
  lineAmount: number;
}

export interface HomeDeliveryCalculations {
  rows: HomeDeliveryItemRow[];
  grandTotalQty: number;
  grandTotalAmount: number;
  grossAmount: number;
  coDiscount: number;
  taxAmount: number;
  serviceChargeCount: number;
  totalChargeCount: number;
}

export function parseHomeDeliveryItem(description: string): {
  nameLines: string[];
  lineDiscount: number;
} {
  const [namePart, discountPart] = description.split("|");
  const trimmedName = (namePart || "").trim();
  const nameLines = trimmedName
    ? trimmedName.split("\n").map((line) => line.trim())
    : [""];
  const lineDiscount = discountPart ? parseFloat(discountPart) || 0 : 0;

  return { nameLines, lineDiscount };
}

export function calculateHomeDelivery(data: InvoiceData): HomeDeliveryCalculations {
  const rows: HomeDeliveryItemRow[] = data.items.map((item) => {
    const { nameLines, lineDiscount } = parseHomeDeliveryItem(item.description);
    const lineGross = item.quantity * item.unitPrice;
    const lineAmount = lineGross - lineDiscount;

    return {
      item,
      nameLines,
      lineDiscount,
      lineGross,
      lineAmount,
    };
  });

  const grandTotalQty = rows.reduce((sum, row) => sum + row.item.quantity, 0);
  const grandTotalAmount = rows.reduce((sum, row) => sum + row.lineAmount, 0);
  const grossAmount = rows.reduce((sum, row) => sum + row.lineGross, 0);
  const lineDiscountTotal = rows.reduce((sum, row) => sum + row.lineDiscount, 0);

  let coDiscount = lineDiscountTotal;
  if (data.discountValue > 0) {
    if (data.discountType === "percentage") {
      coDiscount = (grossAmount * data.discountValue) / 100;
    } else {
      coDiscount = data.discountValue;
    }
  }

  const taxAmount = (grandTotalAmount * data.taxRate) / 100;
  const serviceChargeCount = Math.max(Math.round(data.deliveryCharges || 0), 0) || 1;
  const totalChargeCount = serviceChargeCount;

  return {
    rows,
    grandTotalQty,
    grandTotalAmount,
    grossAmount,
    coDiscount,
    taxAmount,
    serviceChargeCount,
    totalChargeCount,
  };
}

export function formatHomeDeliveryOrderDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  const time = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  return `${day}-${month}-${year} ${time}`;
}

export function formatHomeDeliveryDeliveryDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatHomeDeliveryDeliveryTime(dateString: string): string {
  const date = new Date(dateString);
  return date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
}

export function formatHomeDeliveryMoney(amount: number, decimals = 2): string {
  return amount.toLocaleString("en-PK", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatHomeDeliveryWhole(amount: number): string {
  return amount.toLocaleString("en-PK", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

export function parseDeliveryInfo(companyAddress: string): {
  branch: string;
  deliveryDate: string;
  deliveryTime: string;
  riderName: string;
} {
  const lines = companyAddress.split("\n").map((line) => line.trim());

  if (lines.length === 0 || (lines.length === 1 && !lines[0])) {
    return { branch: "", deliveryDate: "", deliveryTime: "", riderName: "" };
  }

  const branch = lines[0] || "";
  const dateTimeLine = lines[1] || "";
  const [deliveryDate, deliveryTime] = dateTimeLine.includes("|")
    ? dateTimeLine.split("|").map((part) => part.trim())
    : [dateTimeLine, ""];

  const riderName = lines[2] || "";

  return { branch, deliveryDate, deliveryTime, riderName };
}

export function splitAddressLines(address: string): string[] {
  if (!address.trim()) return [];
  return address.split("\n").map((line) => line.trim()).filter(Boolean);
}
