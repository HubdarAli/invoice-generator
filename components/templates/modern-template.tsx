"use client";

import type { InvoiceData } from "@/lib/invoice-types";
import {
  calculateInvoice,
  formatCurrency,
  formatDate,
} from "@/lib/invoice-calculations";
import Barcode from "react-barcode";

interface ModernTemplateProps {
  data: InvoiceData;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const calculations = calculateInvoice(data);

  return (
    <div className="bg-white max-w-[320px] mx-auto text-zinc-900 font-sans text-sm print:shadow-none p-6 rounded-xl border border-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        {data.companyLogo && (
          <img
            src={data.companyLogo}
            alt="Company Logo"
            className="h-14 w-14 object-contain mb-3 rounded-2xl shadow-sm"
          />
        )}
        <h1 className="text-xl font-bold tracking-tight text-center">
          {data.companyName || "Your Company"}
        </h1>
        <p className="text-xs text-zinc-500 text-center mt-1 whitespace-pre-line">
          {data.companyAddress}
        </p>
      </div>

      {/* Info Grid */}
      <div className="flex justify-between items-center text-xs text-zinc-500 mb-6 border-b border-zinc-100 pb-4">
        <div>
          <p className="font-medium text-zinc-900 mb-1">Receipt</p>
          <p>#{data.invoiceNumber || "INV-000000"}</p>
        </div>
        <div className="text-right">
          <p className="mb-1">{data.invoiceDate ? formatDate(data.invoiceDate) : "-"}</p>
          <p className="font-medium text-zinc-900">{data.clientName || "Walk-in Customer"}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="mb-6 space-y-4">
        {data.items.map((item, index) => (
          <div key={item.id} className="text-sm">
            <div className="flex justify-between text-zinc-900 font-medium mb-1">
              <span>{item.description || `Item ${index + 1}`}</span>
              <span>{formatCurrency(item.quantity * item.unitPrice)}</span>
            </div>
            <div className="text-xs text-zinc-500">
              {item.quantity} × {formatCurrency(item.unitPrice)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-zinc-100 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-zinc-600">
          <span>Subtotal</span>
          <span>{formatCurrency(calculations.subtotal)}</span>
        </div>
        {calculations.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>
              Discount
              {data.discountType === "percentage" && ` (${data.discountValue}%)`}
            </span>
            <span>-{formatCurrency(calculations.discountAmount)}</span>
          </div>
        )}
        {data.taxRate > 0 && (
          <div className="flex justify-between text-zinc-600">
            <span>Tax ({data.taxRate}%)</span>
            <span>{formatCurrency(calculations.taxAmount)}</span>
          </div>
        )}
        {data.deliveryCharges > 0 && (
          <div className="flex justify-between text-zinc-600">
            <span>Delivery Charges</span>
            <span>{formatCurrency(data.deliveryCharges)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold text-zinc-900 pt-3 border-t border-zinc-100 mt-2">
          <span>Total</span>
          <span>{formatCurrency(calculations.total)}</span>
        </div>
      </div>

      {/* Barcode */}
      <div className="mt-8 flex justify-center">
        <Barcode
          value={data.invoiceNumber || "INV-000000"}
          width={1.2}
          height={40}
          fontSize={10}
          margin={0}
          displayValue={false}
        />
      </div>
      <p className="text-center text-xs text-zinc-400 mt-2 font-medium tracking-widest">{data.invoiceNumber || "INV-000000"}</p>

      {/* Footer Description */}
      {data.footerDescription && (
        <div className="mt-6 text-center text-xs text-zinc-500 bg-zinc-50 p-4 rounded-lg">
          <p className="whitespace-pre-line">{data.footerDescription}</p>
        </div>
      )}
    </div>
  );
}
