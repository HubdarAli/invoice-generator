"use client";

import type { ReactNode } from "react";
import type { InvoiceData } from "@/lib/invoice-types";
import {
  calculateHomeDelivery,
  formatHomeDeliveryMoney,
  formatHomeDeliveryOrderDate,
  formatHomeDeliveryWhole,
  parseDeliveryInfo,
  splitAddressLines,
} from "@/lib/home-delivery-format";

interface HomeDeliveryTemplateProps {
  data: InvoiceData;
}

const thermalFont =
  'Tahoma, "Segoe UI", "Arial Narrow", Arial, Helvetica, sans-serif';

function LabelValue({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <p className="leading-[1.25] m-0">
      <span className="font-normal">{label}</span>
      {children}
    </p>
  );
}

export function HomeDeliveryTemplate({ data }: HomeDeliveryTemplateProps) {
  const calc = calculateHomeDelivery(data);
  const delivery = parseDeliveryInfo(data.companyAddress);
  const addressLines = splitAddressLines(data.clientAddress);
  const location = data.companyName || "MACHS";
  const slipNumber = data.companyPhone || "HD-0";
  const footerLines = (data.footerDescription || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const deliveryDate =
    delivery.deliveryDate ||
    (data.invoiceDate
      ? new Date(data.invoiceDate).toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "");
  const deliveryTime =
    delivery.deliveryTime ||
    (data.invoiceDate
      ? new Date(data.invoiceDate)
          .toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .toLowerCase()
      : "");

  return (
    <div
      className="bg-white mx-auto text-black print:shadow-none antialiased"
      style={{
        fontFamily: thermalFont,
        fontSize: "9px",
        lineHeight: 1.2,
        width: "288px",
        padding: "8px 6px",
      }}
    >
      {/* Top client box */}
      <div
        className="mb-[6px] space-y-[2px]"
        style={{ border: "1px solid #000", padding: "4px 5px" }}
      >
        <LabelValue label="Client:">
          {" "}
          {data.clientName || "-"}
        </LabelValue>
        <p className="leading-[1.25] m-0">
          <span className="font-normal">Address:</span>{" "}
          {addressLines.length > 0 ? (
            <span className="inline-block align-top">
              {addressLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </span>
          ) : (
            data.clientAddress || "-"
          )}
        </p>
        <LabelValue label="Contact No#:">
          {" "}
          {data.clientPhone || "-"}
        </LabelValue>
      </div>

      {/* Slip box */}
      <div
        className="mb-[8px] text-center"
        style={{ border: "2px solid #000", padding: "5px 4px 6px" }}
      >
        <p
          className="m-0 mb-[3px] text-center"
          style={{ fontSize: "8px", lineHeight: 1.1 }}
        >
          Temporary Slip
        </p>
        <p
          className="m-0 font-bold leading-none"
          style={{ fontSize: "24px", letterSpacing: "0.02em" }}
        >
          {slipNumber}
        </p>
      </div>

      {/* Order header */}
      <p
        className="m-0 mb-[5px] font-bold leading-none"
        style={{ fontSize: "14px" }}
      >
        Home Delivery
      </p>
      <p className="m-0 mb-[2px] leading-[1.25]">
        <span>Order Date:</span>{" "}
        {data.invoiceDate ? formatHomeDeliveryOrderDate(data.invoiceDate) : "-"}
      </p>
      <p className="m-0 mb-[2px] leading-[1.25]">
        <span>Invoice #:</span> {data.invoiceNumber || "-"}
      </p>
      <p className="m-0 mb-[8px] leading-[1.25]">{location}</p>

      {/* Client information */}
      <p className="m-0 mb-[3px] font-bold" style={{ fontSize: "9px" }}>
        Client Information
      </p>
      <div className="mb-[8px] space-y-[2px]">
        <LabelValue label="Name:"> {data.clientName || "-"}</LabelValue>
        <LabelValue label="Contact #:"> {data.clientPhone || "-"}</LabelValue>
        <p className="m-0 font-bold leading-[1.25]">Address:</p>
        {addressLines.length > 0 ? (
          addressLines.map((line, index) => (
            <p key={index} className="m-0 leading-[1.25] pl-0">
              {line}
            </p>
          ))
        ) : (
          <p className="m-0 leading-[1.25]">{data.clientAddress || "-"}</p>
        )}
      </div>

      {/* Delivery information */}
      <p className="m-0 mb-[3px] font-bold" style={{ fontSize: "9px" }}>
        Delivery Information
      </p>
      <div className="mb-[8px] space-y-[2px]">
        <p className="m-0 leading-[1.25]">
          <span>Delivery Branch:</span> {delivery.branch}
        </p>
        <p className="m-0 font-bold leading-[1.25]">Delivery Date &amp; Time</p>
        <div className="flex justify-between leading-[1.25]">
          <span>{deliveryDate}</span>
          <span>{deliveryTime}</span>
        </div>
        <p className="m-0 leading-[1.25]">
          <span>Rider Name:</span> {delivery.riderName || "-"}
        </p>
      </div>

      {/* Items table */}
      <div style={{ borderTop: "1px solid #000", paddingTop: "3px" }}>
        <div
          className="grid font-bold mb-[2px] pb-[2px]"
          style={{
            gridTemplateColumns: "1fr 38px 34px 34px 46px",
            columnGap: "2px",
            fontSize: "8px",
            borderBottom: "1px solid #000",
          }}
        >
          <span> </span>
          <span className="text-right">Price</span>
          <span className="text-right">Qty/W</span>
          <span className="text-right">Disc.</span>
          <span className="text-right">Amount</span>
        </div>

        {calc.rows.map((row) => (
          <div key={row.item.id} className="mb-[3px]">
            <div
              className="grid leading-[1.2]"
              style={{
                gridTemplateColumns: "1fr 38px 34px 34px 46px",
                columnGap: "2px",
                fontSize: "8.5px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span className="uppercase pr-1">{row.nameLines[0]}</span>
              <span className="text-right">
                {formatHomeDeliveryWhole(row.item.unitPrice)}
              </span>
              <span className="text-right">{row.item.quantity}</span>
              <span className="text-right">
                {formatHomeDeliveryWhole(row.lineDiscount)}
              </span>
              <span className="text-right">
                {formatHomeDeliveryWhole(row.lineAmount)}
              </span>
            </div>
            {row.nameLines.slice(1).map((line, index) => (
              <p
                key={index}
                className="m-0 uppercase leading-[1.2]"
                style={{ fontSize: "8.5px" }}
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Grand total */}
      <div
        className="py-[3px] mb-[6px]"
        style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000" }}
      >
        <div
          className="grid font-bold"
          style={{
            gridTemplateColumns: "1fr 38px 34px 34px 46px",
            columnGap: "2px",
            fontSize: "9px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>Grand Total:</span>
          <span />
          <span className="text-right">{calc.grandTotalQty}</span>
          <span />
          <span className="text-right">
            {formatHomeDeliveryWhole(calc.grandTotalAmount)}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-[2px] mb-[6px]" style={{ fontSize: "9px" }}>
        <div className="flex justify-between">
          <span>Gross Amount</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatHomeDeliveryMoney(calc.grossAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Co.Disc/Discount</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatHomeDeliveryMoney(calc.coDiscount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>G.S.T {data.taxRate.toFixed(2)} %</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatHomeDeliveryMoney(calc.taxAmount)}
          </span>
        </div>
      </div>

      {/* Charges */}
      <div className="space-y-[2px] mb-[8px]" style={{ fontSize: "9px" }}>
        <div className="flex justify-between">
          <span>Bill Service Charges</span>
          <span>{calc.serviceChargeCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Charges</span>
          <span>{calc.totalChargeCount}</span>
        </div>
      </div>

      {/* Footer */}
      <div
        className="space-y-[2px] leading-[1.3]"
        style={{ fontSize: "7.5px" }}
      >
        {footerLines.length > 0 ? (
          footerLines.map((line, index) => (
            <p key={index} className="m-0">
              {line}
            </p>
          ))
        ) : (
          <>
            <p className="m-0">
              Invoice Printing:{" "}
              {data.invoiceDate
                ? formatHomeDeliveryOrderDate(data.invoiceDate)
                : "-"}
            </p>
            <p className="m-0">
              First Print:{" "}
              {data.invoiceDate
                ? formatHomeDeliveryOrderDate(data.invoiceDate)
                : "-"}
            </p>
            <p className="m-0">
              Software Developed by Technosys [ 0321-2401579 ]
            </p>
            <p className="m-0">www.technosysbd.com [ 0341-2479931 ]</p>
          </>
        )}
      </div>
    </div>
  );
}
