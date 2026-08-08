"use client";

import type { InvoiceData } from "@/lib/invoice-types";
import { calculateInvoice } from "@/lib/invoice-calculations";
import {
  THERMAL_DASH_FULL,
  THERMAL_DASH_SHORT,
  formatThermalFooterDateTime,
  formatThermalItemLeft,
  formatThermalItemTotal,
} from "@/lib/thermal-pos-format";

interface ThermalPosTemplateProps {
  data: InvoiceData;
}

function DashedLine({ variant }: { variant: "full" | "short-right" }) {
  if (variant === "short-right") {
    return (
      <div className="flex justify-end mb-0.5">
        <span className="tracking-tight">{THERMAL_DASH_SHORT}</span>
      </div>
    );
  }

  return (
    <p className="overflow-hidden whitespace-nowrap tracking-tight leading-none">
      {THERMAL_DASH_FULL}
    </p>
  );
}

export function ThermalPosTemplate({ data }: ThermalPosTemplateProps) {
  const calculations = calculateInvoice(data);
  const tableNumber = data.companyPhone || "-";
  const paymentLabel = (data.clientAddress || "CREDIT").toUpperCase();
  const headerLines = (data.companyAddress || "").split("\n").filter(Boolean);
  const footerLines = (data.footerDescription || "").split("\n").filter(Boolean);
  const clerkLine = data.clientName || "CLERK 001";
  const barcodeLine = data.clientPhone || "";
  const receiptRef = data.invoiceNumber
    ? `#${data.invoiceNumber}`
    : "#000-000-000000-0000";
  const dateTimeLine = data.invoiceDate
    ? `${receiptRef} ${formatThermalFooterDateTime(data.invoiceDate)}`
    : receiptRef;

  return (
    <div
      className="bg-white w-[260px] mx-auto text-black print:shadow-none px-3 py-4 uppercase font-mono text-[11px] leading-[1.35] tracking-tight"
      style={{ fontFamily: "Courier New, Courier, monospace" }}
    >
      {/* Header */}
      <div className="text-left space-y-0">
        <p className="text-[14px] font-bold leading-none">
          {(data.companyName || "IDEAL").toUpperCase()}
        </p>
        {headerLines.length > 0 ? (
          headerLines.map((line, index) => (
            <p key={index} className="leading-snug">
              {line.toUpperCase()}
            </p>
          ))
        ) : (
          <>
            <p>SNACKS REASTAURANT</p>
            <p>M.A.C.H.S</p>
            <p>SNTN# 1050049-9</p>
          </>
        )}
      </div>

      <div className="my-1">
        <DashedLine variant="full" />
      </div>

      {/* Table row */}
      <div className="flex justify-between items-baseline">
        <span>TABLE</span>
        <span>{tableNumber}</span>
      </div>

      <div className="my-1">
        <DashedLine variant="full" />
      </div>

      {/* Line items */}
      <div className="space-y-0">
        {data.items.map((item, index) => {
          const left = formatThermalItemLeft(item, index);
          const total = formatThermalItemTotal(item);

          return (
            <div
              key={item.id}
              className="flex justify-between items-start gap-2 leading-snug"
            >
              <span className="flex-1 min-w-0 break-words">
                {left.qtyPrefix}
                {left.code}
                <span className="text-[8px] align-baseline">c</span>{" "}
                {left.name}
                {left.unitPriceSuffix}
              </span>
              <span className="shrink-0 text-right">{total}</span>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-2">
        <DashedLine variant="short-right" />
        <div className="flex justify-between items-baseline text-[14px] font-bold leading-none">
          <span>{paymentLabel}</span>
          <span>{Math.round(calculations.total)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-[10px] leading-[1.45] space-y-0.5">
        <p className="uppercase">{clerkLine.toUpperCase()}</p>
        <p className="uppercase tracking-tighter">{dateTimeLine}</p>
        {barcodeLine ? (
          <p className="uppercase tracking-tighter break-all">{barcodeLine}</p>
        ) : null}
        {footerLines.length > 0 ? (
          footerLines.map((line, index) => (
            <p key={index} className="uppercase">
              {line}
            </p>
          ))
        ) : (
          <p className="uppercase">
            ALL PRICES INCLUDE {data.taxRate || 13}% SST
          </p>
        )}
      </div>
    </div>
  );
}
