"use client";

import type { InvoiceData } from "@/lib/invoice-types";
import {
  calculateInvoice,
  formatCurrency,
  formatDate,
} from "@/lib/invoice-calculations";
import Barcode from "react-barcode";

interface CreativeTemplateProps {
  data: InvoiceData;
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const calculations = calculateInvoice(data);

  return (
    <div className="bg-white max-w-xs mx-auto text-black font-mono text-sm print:shadow-none overflow-hidden p-8">
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-2 mb-2">
        {data.companyLogo && (
          <img
            src={data.companyLogo}
            alt="Company Logo"
            className="h-8 w-8 object-contain mx-auto mb-1"
          />
        )}
        <h1 className="text-lg font-bold">{data.companyName || "Your Company"}</h1>
        <p className="text-xs whitespace-pre-line">{data.companyAddress}</p>
        <h2 className="text-base font-bold mt-1">INVOICE</h2>
        <p className="text-xs">#{data.invoiceNumber || "INV-000000"}</p>
        <p className="text-xs">Date: {data.invoiceDate ? formatDate(data.invoiceDate) : "-"}</p>
      </div>

      {/* Bill To */}
      <div className="mb-2">
        <p className="text-xs font-semibold">Bill To:</p>
        <p className="text-xs">{data.clientName || "Client Name"}</p>
        <p className="text-xs whitespace-pre-line">{data.clientAddress}</p>
        {data.clientPhone && <p className="text-xs">{data.clientPhone}</p>}
      </div>

      {/* Items */}
      <div className="mb-2">
        <div className="border-b border-gray-300 pb-1 mb-1">
          <span className="text-xs font-semibold">Item</span>
          <span className="float-right text-xs font-semibold">Qty Price Total</span>
        </div>
        {data.items.map((item, index) => (
          <div key={item.id} className="mb-1">
            <p className="text-xs">{item.description || `Item ${index + 1}`}</p>
            <p className="text-xs text-right">
              {item.quantity} x {formatCurrency(item.unitPrice)} = {formatCurrency(item.quantity * item.unitPrice)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-300 pt-1">
        <div className="flex justify-between text-xs">
          <span>Subtotal:</span>
          <span>{formatCurrency(calculations.subtotal)}</span>
        </div>
        {calculations.discountAmount > 0 && (
          <div className="flex justify-between text-xs">
            <span>Discount{data.discountType === "percentage" ? ` (${data.discountValue}%)` : ""}:</span>
            <span>-{formatCurrency(calculations.discountAmount)}</span>
          </div>
        )}
        {data.taxRate > 0 && (
          <div className="flex justify-between text-xs">
            <span>Tax ({data.taxRate}%):</span>
            <span>{formatCurrency(calculations.taxAmount)}</span>
          </div>
        )}
        {data.deliveryCharges > 0 && (
          <div className="flex justify-between text-xs">
            <span>Delivery Charges:</span>
            <span>{formatCurrency(data.deliveryCharges)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-bold border-t border-gray-300 pt-1">
          <span>Total:</span>
          <span>{formatCurrency(calculations.total)}</span>
        </div>
      </div>

      {/* Barcode */}
      <div className="text-center mt-2 flex justify-center">
        <Barcode
          value={data.invoiceNumber || "INV-000000"}
          width={1}
          height={30}
          fontSize={10}
          margin={0}
        />
      </div>

      {/* Footer */}
      {data.footerDescription && (
        <div className="text-center mt-2 pt-1 border-t border-gray-300">
          <p className="text-xs whitespace-pre-line">{data.footerDescription}</p>
        </div>
      )}
    </div>
  );
}
