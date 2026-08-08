import type { InvoiceItem } from "./invoice-types";

export const THERMAL_DASH_FULL = "-------------------";
export const THERMAL_DASH_SHORT = "---------";

const DEFAULT_ITEM_CODES = [80, 81, 50, 154, 148, 256, 153];

export function parseThermalItemCode(
  description: string,
  index: number
): { code: string; name: string } {
  const trimmed = description.trim();

  const patterns = [
    /^(\d+)\|(.+)$/,
    /^(\d+)c\s*(.+)$/i,
    /^(\d+):(.+)$/,
    /^(\d+)\s+(.+)$/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      return { code: match[1], name: match[2].trim() };
    }
  }

  return {
    code: String(DEFAULT_ITEM_CODES[index] ?? 80 + index),
    name: trimmed || `ITEM ${index + 1}`,
  };
}

export function formatThermalItemLeft(
  item: InvoiceItem,
  index: number
): { qtyPrefix: string; code: string; name: string; unitPriceSuffix: string } {
  const { code, name } = parseThermalItemCode(item.description, index);
  const qty = item.quantity;
  const unitPrice = Math.round(item.unitPrice);

  return {
    qtyPrefix: qty > 1 ? `${qty}x ` : "",
    code,
    name: name.toUpperCase(),
    unitPriceSuffix: qty > 1 ? ` ${unitPrice}` : "",
  };
}

export function formatThermalItemTotal(item: InvoiceItem): string {
  return String(Math.round(item.quantity * item.unitPrice));
}

export function formatThermalFooterDateTime(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}-R`;
}

export function formatThermalItemLeftText(
  item: InvoiceItem,
  index: number
): string {
  const parts = formatThermalItemLeft(item, index);
  return `${parts.qtyPrefix}${parts.code}c ${parts.name}${parts.unitPriceSuffix}`;
}
