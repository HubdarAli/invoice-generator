"use client";

import type { InvoiceData } from "@/lib/invoice-types";
import { calculateInvoice } from "@/lib/invoice-calculations";

interface SaleReceiptTemplateProps {
  data: InvoiceData;
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

function formatQty(qty: number): string {
  return qty.toFixed(2);
}

function formatRate(rate: number): string {
  return rate.toLocaleString("en-PK", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

function formatItemAmount(amount: number): string {
  return amount.toFixed(3);
}

function formatSubTotal(amount: number): string {
  return amount.toFixed(3);
}

function formatNetBill(amount: number): string {
  return amount.toFixed(2);
}

function formatCashReceived(amount: number): string {
  return Math.round(amount).toLocaleString("en-PK");
}

function LabelValueRow({
  label,
  value,
  bold = false,
  uppercase = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
  uppercase?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline leading-snug">
      <span>{label}</span>
      <span
        className={`${bold ? "font-bold" : ""} ${uppercase ? "uppercase" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

export function SaleReceiptTemplate({ data }: SaleReceiptTemplateProps) {
  const calculations = calculateInvoice(data);
  const orderNumber = data.clientPhone || "0";
  const serviceType = data.clientAddress || "DINE IN";
  const server = data.clientName || "-";
  const table = data.companyAddress || "-";

  return (
    <div
      className="bg-white w-[272px] mx-auto text-black print:shadow-none border border-black p-3 font-[Arial,Helvetica,sans-serif] text-[11px] leading-tight"
      style={{ fontFamily: "Arial" }}
    >
      {/* Title */}
      <p className="text-center text-[15px] font-bold tracking-wide mb-2">
        SALE RECEIPT
      </p>

      {/* Order number box */}
      <div className="flex justify-center mb-2">
        <div className="border border-black px-6 py-1 min-w-full text-center">
          <span className="text-[36px] font-bold leading-none block">
            {orderNumber}
          </span>
        </div>
      </div>

      {/* Invoice / Day */}
      <div className="flex justify-between items-baseline mb-1.5 text-[11px]">
        <span>Invoice # {data.invoiceNumber || "00000"}</span>
        <span>
          DAY{" "}
          {data.invoiceDate ? getDayOfYear(data.invoiceDate) : "00000"}
        </span>
      </div>

      {/* Restaurant */}
      <p className="mb-0.5 leading-snug">
        <span>Restaurant: </span>
        <span className="font-bold text-[13px]">
          {data.companyName || "Restaurant Name"}
        </span>
      </p>

      {/* Service type & time */}
      <p className="text-right font-semibold uppercase leading-snug">
        {serviceType}
      </p>
      
      <div className="flex justify-between mb-1 leading-snug">
        <span>
          {data.invoiceDate
            ? (() => {
                const date = new Date(data.invoiceDate);
                const day = date.getDate();
                const month = date.toLocaleString("en-US", { month: "short" });
                const year = String(date.getFullYear()).slice(-2);
                return `${day}-${month}-${year}`;
              })()
            : "-"}
       
        </span>
        <span>
          {data.invoiceDate ? formatReceiptTime(data.invoiceDate) : "-"}
        </span>
      </div>
 

      {/* Server / Table */}
      <div className="space-y-0.5 mb-2">
        <LabelValueRow
          label="Server :"
          value={server}
          bold
          uppercase
        />
        <LabelValueRow label="Table :" value={table} bold />
      </div>

      {/* Items header */}
      <div className="grid grid-cols-[36px_1fr_36px_56px] gap-x-1 border-b border-black pb-0.5 mb-0.5 font-bold text-[10px]">
        <span>Qty</span>
        <span>Item</span>
        <span className="text-right">Rate</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Items */}
      <div className="mb-1">
        {data.items.map((item, index) => {
          const lines = (item.description || `Item ${index + 1}`).split("\n");
          const amount = item.quantity * item.unitPrice;

          return (
            <div key={item.id}>
              <div className="grid grid-cols-[36px_1fr_36px_56px] gap-x-1 py-0.5 text-[10px] leading-snug">
                <span>{formatQty(item.quantity)}</span>
                <span className="uppercase">{lines[0]}</span>
                <span className="text-right">{formatRate(item.unitPrice)}</span>
                <span className="text-right">{formatItemAmount(amount)}</span>
              </div>
              {lines.slice(1).map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className="grid grid-cols-[36px_1fr_36px_56px] gap-x-1 py-0 text-[10px] leading-snug"
                >
                  <span> </span>
                  <span className="uppercase">{line}</span>
                  <span> </span>
                  <span> </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="border-t border-black pt-1 space-y-0.5 text-[11px]">
        <div className="flex justify-between">
          <span>SubTotal :</span>
          <span>{formatSubTotal(calculations.subtotal)}</span>
        </div>

        {calculations.discountAmount > 0 && (
          <div className="flex justify-between">
            <span>
              Discount
              {data.discountType === "percentage"
                ? ` (${data.discountValue}%)`
                : ""}{" "}
              :
            </span>
            <span>-{formatSubTotal(calculations.discountAmount)}</span>
          </div>
        )}

        {data.taxRate > 0 && (
          <div className="flex justify-between">
            <span>Tax ({data.taxRate}%) :</span>
            <span>{formatSubTotal(calculations.taxAmount)}</span>
          </div>
        )}

        {data.deliveryCharges > 0 && (
          <div className="flex justify-between">
            <span>Delivery :</span>
            <span>{formatSubTotal(data.deliveryCharges)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold border-t border-black pt-1 mt-1">
          <span>Net Bill :</span>
          <span>{formatNetBill(calculations.total)}</span>
        </div>

        <div className="flex justify-between">
          <span>Cash Received:</span>
          <span>{formatCashReceived(calculations.total)}</span>
        </div>

        <div className="flex justify-between">
          <span>Payment Mode :</span>
          <span>Cash</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-black mt-2 pt-2 text-center text-[10px] leading-relaxed space-y-0.5">
        {data.footerDescription ? (
          data.footerDescription.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))
        ) : (
          <>
            <p className="font-semibold">Powered By: DEVAJ TECHNOLOGY.</p>
            {data.companyPhone && <p>{data.companyPhone}</p>}
            <p>www.devajtechnology.com</p>
          </>
        )}
      </div>
    </div>
  );
}
