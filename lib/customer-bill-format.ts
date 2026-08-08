export function parseCustomerBillMeta(clientName: string): {
  user: string;
  orderTaker: string;
} {
  if (clientName.includes("|")) {
    const [user, orderTaker] = clientName.split("|").map((part) => part.trim());
    return { user: user || "pos2", orderTaker: orderTaker || "-" };
  }

  return { user: "pos2", orderTaker: clientName || "-" };
}

export function parseCustomerBillFooter(
  footerDescription: string,
  invoiceDate?: string
): {
  developerLine1: string;
  developerLine2: string;
  timestampDate: string;
  timestampTime: string;
} {
  const defaultDeveloper1 = "Software Developed By";
  const defaultDeveloper2 = "Xenith 0333-2602502";
  const defaultDate = invoiceDate
    ? formatCustomerBillDate(invoiceDate)
    : "25/07/2024";
  const defaultTime = invoiceDate
    ? formatCustomerBillFooterTime(invoiceDate)
    : "01:15:52PM";

  const lines = footerDescription
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length >= 4) {
    return {
      developerLine1: lines[0],
      developerLine2: lines[1],
      timestampDate: lines[2],
      timestampTime: lines[3],
    };
  }

  if (footerDescription.includes("|")) {
    const parts = footerDescription.split("|").map((part) => part.trim());
    return {
      developerLine1: parts[0] || defaultDeveloper1,
      developerLine2: parts[1] || defaultDeveloper2,
      timestampDate: parts[2] || defaultDate,
      timestampTime: parts[3] || defaultTime,
    };
  }

  return {
    developerLine1: defaultDeveloper1,
    developerLine2: defaultDeveloper2,
    timestampDate: defaultDate,
    timestampTime: defaultTime,
  };
}

export function formatCustomerBillDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatCustomerBillTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatCustomerBillFooterTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const period = date.getHours() >= 12 ? "PM" : "AM";
  const hour12 = date.getHours() % 12 || 12;
  return `${hour12.toString().padStart(2, "0")}:${minutes}:${seconds}${period}`;
}

export function formatCustomerBillMoney(amount: number): string {
  return amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCustomerBillWhole(amount: number): string {
  return amount.toLocaleString("en-PK", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

export function splitCompanyAddressLines(address: string): string[] {
  return address
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export const CUSTOMER_BILL_SANS_FONT =
  'Arial, Helvetica, "Segoe UI", Tahoma, sans-serif';

export const CUSTOMER_BILL_DEFAULT_ADDRESS = [
  "SNTN # S-9662561-1",
  "MAIN WADUWAH ROAD QASIMABAD",
  "FOR DELIVERY 03142331688",
];
