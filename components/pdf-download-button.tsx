"use client";

import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InvoiceData, TemplateType } from "@/lib/invoice-types";

interface PDFDownloadButtonProps {
  data: InvoiceData;
  template: TemplateType;
}

export function PDFDownloadButton({ data, template }: PDFDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [PDFComponents, setPDFComponents] = useState<{
    PDFDownloadLink: React.ComponentType<{
      document: React.ReactElement;
      fileName: string;
      children: (props: { loading: boolean }) => React.ReactNode;
    }>;
    ModernPDF: React.ComponentType<{ data: InvoiceData }>;
    CreativePDF: React.ComponentType<{ data: InvoiceData }>;
    RestaurantPDF: React.ComponentType<{ data: InvoiceData }>;
    SaleReceiptPDF: React.ComponentType<{ data: InvoiceData }>;
    ThermalPosPDF: React.ComponentType<{ data: InvoiceData }>;
    HomeDeliveryPDF: React.ComponentType<{ data: InvoiceData }>;
    CustomerBillPDF: React.ComponentType<{ data: InvoiceData }>;
  } | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import PDF components only on client
    Promise.all([
      import("@react-pdf/renderer"),
      import("./pdf-templates/modern-pdf"),
      import("./pdf-templates/creative-pdf"),
      import("./pdf-templates/restaurant-pdf"),
      import("./pdf-templates/sale-receipt-pdf"),
      import("./pdf-templates/thermal-pos-pdf"),
      import("./pdf-templates/home-delivery-pdf"),
      import("./pdf-templates/customer-bill-pdf"),
    ]).then(([pdfRenderer, modernPdf, creativePdf, restaurantPdf, saleReceiptPdf, thermalPosPdf, homeDeliveryPdf, customerBillPdf]) => {
      setPDFComponents({
        PDFDownloadLink: pdfRenderer.PDFDownloadLink,
        ModernPDF: modernPdf.ModernPDF,
        CreativePDF: creativePdf.CreativePDF,
        RestaurantPDF: restaurantPdf.RestaurantPDF,
        SaleReceiptPDF: saleReceiptPdf.SaleReceiptPDF,
        ThermalPosPDF: thermalPosPdf.ThermalPosPDF,
        HomeDeliveryPDF: homeDeliveryPdf.HomeDeliveryPDF,
        CustomerBillPDF: customerBillPdf.CustomerBillPDF,
      });
    });
  }, []);

  if (!isClient || !PDFComponents) {
    return (
      <Button disabled className="w-full sm:w-auto">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  const { PDFDownloadLink, ModernPDF, CreativePDF, RestaurantPDF, SaleReceiptPDF, ThermalPosPDF, HomeDeliveryPDF, CustomerBillPDF } =
    PDFComponents;
  const fileName = `invoice-${data.invoiceNumber || "draft"}.pdf`;

  const pdfMap = {
    modern: <ModernPDF data={data} />,
    creative: <CreativePDF data={data} />,
    restaurant: <RestaurantPDF data={data} />,
    "sale-receipt": <SaleReceiptPDF data={data} />,
    "thermal-pos": <ThermalPosPDF data={data} />,
    "home-delivery": <HomeDeliveryPDF data={data} />,
    "customer-bill": <CustomerBillPDF data={data} />,
  } as const;

  const PDFDocument = pdfMap[template];

  return (
    <PDFDownloadLink document={PDFDocument} fileName={fileName}>
      {({ loading }) =>
        loading ? (
          <Button disabled className="w-full sm:w-auto">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </Button>
        ) : (
          <Button className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        )
      }
    </PDFDownloadLink>
  );
}
