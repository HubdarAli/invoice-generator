"use client";

import { forwardRef } from "react";
import type { InvoiceData, TemplateType } from "@/lib/invoice-types";
import {
  ModernTemplate,
  CreativeTemplate,
  RestaurantTemplate,
  SaleReceiptTemplate,
  ThermalPosTemplate,
  HomeDeliveryTemplate,
  CustomerBillTemplate,
} from "./templates";

interface InvoicePreviewProps {
  data: InvoiceData;
  template: TemplateType;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ data, template }, ref) => {
    return (
      <div ref={ref} id="invoice-preview" className="print:m-0 w-full">
        {template === "modern" && <ModernTemplate data={data} />}
        {template === "creative" && <CreativeTemplate data={data} />}
        {template === "restaurant" && <RestaurantTemplate data={data} />}
        {template === "sale-receipt" && <SaleReceiptTemplate data={data} />}
        {template === "thermal-pos" && <ThermalPosTemplate data={data} />}
        {template === "home-delivery" && <HomeDeliveryTemplate data={data} />}
        {template === "customer-bill" && <CustomerBillTemplate data={data} />}
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";
