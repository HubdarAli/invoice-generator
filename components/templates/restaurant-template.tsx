"use client";

import type { InvoiceData } from "@/lib/invoice-types";
import { calculateInvoice } from "@/lib/invoice-calculations";

interface RestaurantTemplateProps {
  data: InvoiceData;
}

function formatReceiptDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
}

function formatReceiptTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getDayOfYear(dateString: string): string {
  const date = new Date(dateString);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return day.toString().padStart(5, "0");
}

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-PK", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

export function RestaurantTemplate({ data }: RestaurantTemplateProps) {
  const calculations = calculateInvoice(data);
  const orderNumber = data.clientPhone || data.invoiceNumber.slice(-3) || "000";
  const serviceType = data.clientAddress || "DINE IN";
  const location = data.companyAddress;
  const server = data.clientName;

  return (
    <div
      className="bg-white max-w-[280px] mx-auto text-black font-mono text-[11px] leading-tight print:shadow-none p-4"
    >
      {/* Header */}
      <div className="text-center border-b border-black pb-2 mb-2">
        <p className="text-sm font-bold tracking-wide">SALE INVOICE</p>
        <p className="text-3xl font-bold my-1">{orderNumber}</p>
        <div className="flex justify-between text-[10px] px-1">
          <span>Invoice # {data.invoiceNumber || "00000"}</span>
          <span>
            Day:{" "}
            {data.invoiceDate ? getDayOfYear(data.invoiceDate) : "00000"}
          </span>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="text-center mb-2 space-y-0.5">
        <p className="font-bold text-xs uppercase">
          {data.companyName || "Restaurant Name"}
        </p>
        {location && <p className="text-[10px] uppercase">{location}</p>}
        <p className="text-[10px] font-semibold uppercase">{serviceType}</p>
      </div>

      {/* Date / Server / Table */}
      <div className="text-[10px] mb-2 space-y-0.5 border-b border-dashed border-black pb-2">
        <div className="flex justify-between">
          <span>
            Date:{" "}
            {data.invoiceDate ? formatReceiptDate(data.invoiceDate) : "-"}
          </span>
          <span>
            Time:{" "}
            {data.invoiceDate ? formatReceiptTime(data.invoiceDate) : "-"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Server: {server || "-"}</span>
          <span>Table:</span>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-[10px] mb-2 border-collapse">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left font-bold py-1 w-8">Qty</th>
            <th className="text-left font-bold py-1">Item</th>
            <th className="text-right font-bold py-1 w-12">Rate</th>
            <th className="text-right font-bold py-1 w-14">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={item.id} className="border-b border-dotted border-gray-400">
              <td className="py-1 align-top">{item.quantity}</td>
              <td className="py-1 align-top pr-1 uppercase">
                {item.description || `Item ${index + 1}`}
              </td>
              <td className="py-1 text-right align-top">
                {formatAmount(item.unitPrice)}
              </td>
              <td className="py-1 text-right align-top">
                {formatAmount(item.quantity * item.unitPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="text-[10px] space-y-0.5 border-t border-black pt-2">
        <div className="flex justify-between">
          <span>SubTotal:</span>
          <span>{formatAmount(calculations.subtotal)}</span>
        </div>
        {calculations.discountAmount > 0 && (
          <div className="flex justify-between">
            <span>
              Discount
              {data.discountType === "percentage"
                ? ` (${data.discountValue}%)`
                : ""}
              :
            </span>
            <span>-{formatAmount(calculations.discountAmount)}</span>
          </div>
        )}
        {data.taxRate > 0 && (
          <div className="flex justify-between">
            <span>Tax ({data.taxRate}%):</span>
            <span>{formatAmount(calculations.taxAmount)}</span>
          </div>
        )}
        {data.deliveryCharges > 0 && (
          <div className="flex justify-between">
            <span>Delivery:</span>
            <span>{formatAmount(data.deliveryCharges)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold">
          <span>Net Bill:</span>
          <span>{formatAmount(calculations.total)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Cash Received:</span>
          <span>{formatAmount(calculations.total)}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment Mode:</span>
          <span>Cash</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-4 pt-2 border-t border-dashed border-black text-[9px] space-y-0.5">
        {data.footerDescription ? (
          <p className="whitespace-pre-line">{data.footerDescription}</p>
        ) : (
          <>
            {data.companyPhone && <p>{data.companyPhone}</p>}
            <p className="text-[8px] text-gray-600 mt-1">
              Thank you for dining with us!
            </p>
          </>
        )}
      </div>
    </div>
  );
}
