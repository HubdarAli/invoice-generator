"use client";

import type { InvoiceData } from "@/lib/invoice-types";
import { calculateInvoice } from "@/lib/invoice-calculations";
import {
  CUSTOMER_BILL_DEFAULT_ADDRESS,
  CUSTOMER_BILL_SANS_FONT,
  formatCustomerBillDate,
  formatCustomerBillMoney,
  formatCustomerBillTime,
  formatCustomerBillWhole,
  parseCustomerBillFooter,
  parseCustomerBillMeta,
  splitCompanyAddressLines,
} from "@/lib/customer-bill-format";

interface CustomerBillTemplateProps {
  data: InvoiceData;
}

const COL_QTY = 24;
const COL_ITEM = 130;
const COL_RATE = 44;
const COL_AMT = 44;

function ThickRule({ className = "" }: { className?: string }) {
  return (
    <hr
      className={`border-0 m-0 ${className}`}
      style={{ borderTop: "2px solid #000" }}
    />
  );
}

export function CustomerBillTemplate({ data }: CustomerBillTemplateProps) {
  const calculations = calculateInvoice(data);
  const addressLines = splitCompanyAddressLines(data.companyAddress);
  const headerLines =
    addressLines.length > 0 ? addressLines : CUSTOMER_BILL_DEFAULT_ADDRESS;
  const serviceType = data.clientAddress || "Dine In";
  const tokenNumber = data.clientPhone || "000000";
  const tableNumber = data.companyPhone || "0";
  const { user, orderTaker } = parseCustomerBillMeta(data.clientName);
  const footer = parseCustomerBillFooter(
    data.footerDescription,
    data.invoiceDate
  );

  return (
    <div
      className="bg-white mx-auto text-black print:shadow-none"
      style={{
        fontFamily: CUSTOMER_BILL_SANS_FONT,
        fontSize: "10px",
        lineHeight: 1.2,
        width: "280px",
        padding: "10px 12px",
      }}
    >
      {/* Header */}
      <div className="text-center">
        <p
          className="m-0 font-bold uppercase"
          style={{ fontSize: "19px", lineHeight: 1.05 }}
        >
          {data.companyName || "FAJR FOODS"}
        </p>
        <p
          className="m-0 font-bold uppercase"
          style={{ fontSize: "12px", lineHeight: 1.15, marginTop: "2px" }}
        >
          {headerLines[0]}
        </p>
        {headerLines.slice(1).map((line, index) => (
          <p
            key={index}
            className="m-0 font-normal uppercase"
            style={{ fontSize: "10px", lineHeight: 1.15 }}
          >
            {line}
          </p>
        ))}
      </div>

      <ThickRule className="my-[6px]" />

      {/* Bill info */}
      <p
        className="m-0 text-center font-bold"
        style={{ fontSize: "11px", marginBottom: "3px" }}
      >
        Customer Bill
      </p>
      <p
        className="m-0 text-center font-bold"
        style={{ fontSize: "11px", marginBottom: "8px" }}
      >
        {serviceType}
      </p>

      <div style={{ fontSize: "10px" }}>
        <div className="flex justify-between mb-[3px]">
          <span>
            Date :&nbsp;&nbsp;&nbsp;&nbsp;
            {data.invoiceDate ? formatCustomerBillDate(data.invoiceDate) : "-"}
          </span>
          <span>
            Time :&nbsp;&nbsp;&nbsp;&nbsp;
            {data.invoiceDate ? formatCustomerBillTime(data.invoiceDate) : "-"}
          </span>
        </div>
        <p className="m-0 mb-[3px]">User :&nbsp;&nbsp;&nbsp;&nbsp;{user}</p>
        <p className="m-0 mb-[3px]">
          Token#:&nbsp;&nbsp;&nbsp;
          <span className="font-bold" style={{ fontSize: "15px" }}>
            {tokenNumber}
          </span>
        </p>
        <p className="m-0 mb-[3px]">
          Order Of :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TABLE {tableNumber}
        </p>
        <p className="m-0 mb-[6px]">
          Order Taker :&nbsp;&nbsp;&nbsp;{orderTaker}
        </p>
      </div>

      <ThickRule className="mb-[4px]" />

      {/* Table headers */}
      <div
        className="flex font-bold mb-[4px]"
        style={{ fontSize: "10px" }}
      >
        <span style={{ width: COL_QTY }}>Qty</span>
        <span style={{ width: COL_ITEM }}>Item Name</span>
        <span style={{ width: COL_RATE, textAlign: "right" }}>Rate</span>
        <span style={{ width: COL_AMT, textAlign: "right" }}>Amt</span>
      </div>

      {/* Items */}
      {data.items.map((item, index) => {
        const name = (item.description || `Item ${index + 1}`).toUpperCase();

        return (
          <div
            key={item.id}
            className="flex mb-[3px] uppercase"
            style={{ fontSize: "10px", fontWeight: 400 }}
          >
            <span style={{ width: COL_QTY }}>{item.quantity}</span>
            <span style={{ width: COL_ITEM }}>{name}</span>
            <span
              style={{
                width: COL_RATE,
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatCustomerBillWhole(item.unitPrice)}
            </span>
            <span
              style={{
                width: COL_AMT,
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatCustomerBillWhole(item.quantity * item.unitPrice)}
            </span>
          </div>
        );
      })}

      <ThickRule className="my-[4px]" />

      {/* Totals */}
      <div style={{ fontSize: "10px" }}>
        <div className="flex items-baseline mb-[4px]">
          <span className="font-bold" style={{ width: COL_QTY + COL_ITEM }}>
            Sub Total
          </span>
          <span
            style={{
              width: COL_RATE,
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatCustomerBillMoney(calculations.discountAmount)}
          </span>
          <span
            className="font-bold"
            style={{
              width: COL_AMT,
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatCustomerBillMoney(calculations.subtotal)}
          </span>
        </div>

        <div className="flex items-baseline">
          <span className="font-bold" style={{ width: COL_QTY + COL_ITEM }}>
            Net Bill :
          </span>
          <span style={{ width: COL_RATE }} />
          <span
            className="font-bold"
            style={{
              width: COL_AMT,
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatCustomerBillMoney(calculations.total)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <p
        className="m-0 text-center font-bold"
        style={{ fontSize: "11px", marginTop: "14px", marginBottom: "8px" }}
      >
        Thank You!
      </p>

      <p
        className="m-0 text-center font-normal"
        style={{ fontSize: "8px", lineHeight: 1.25 }}
      >
        {footer.developerLine1}
      </p>
      <p
        className="m-0 text-center font-normal"
        style={{ fontSize: "8px", lineHeight: 1.25, marginBottom: "10px" }}
      >
        {footer.developerLine2}
      </p>

      <div
        className="text-right"
        style={{ fontSize: "8px", lineHeight: 1.25 }}
      >
        <p className="m-0">{footer.timestampDate}</p>
        <p className="m-0">{footer.timestampTime}</p>
      </div>
    </div>
  );
}
