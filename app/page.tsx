"use client";

import { useState, useRef, useEffect } from "react";
import { Printer, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoicePreview } from "@/components/invoice-preview";
import { TemplateSelector } from "@/components/template-selector";
import { PDFDownloadButton } from "@/components/pdf-download-button";
import {
  type InvoiceData,
  type TemplateType,
  defaultInvoiceData,
  createDefaultInvoiceData,
} from "@/lib/invoice-types";

export default function InvoiceGenerator() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("modern");
  const [isInitialized, setIsInitialized] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize with dynamic values on client-side only
  useEffect(() => {
    if (!isInitialized) {
      setInvoiceData(createDefaultInvoiceData());
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const handlePrint = () => {
    window.print();
  };

  // Show loading state until client-side initialization is complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading invoice generator...</span>
        </div>
      </div>
    );
  }

  const formPanel = (
    <div className="bg-background rounded-xl border border-border p-4 sm:p-6 lg:sticky lg:top-[4.5rem] lg:flex lg:flex-col lg:max-h-[calc(100vh-5.5rem)]">
      <div className="shrink-0 mb-3">
        <TemplateSelector
          selected={selectedTemplate}
          onSelect={setSelectedTemplate}
        />
      </div>
      <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
        <InvoiceForm
          data={invoiceData}
          template={selectedTemplate}
          onChange={setInvoiceData}
        />
      </div>
    </div>
  );

  const previewPanel = (
    <div className="h-full min-h-[calc(100vh-8rem)] overflow-auto rounded-xl bg-zinc-200 p-3 sm:p-6 lg:h-[calc(100vh-5.5rem)] lg:min-h-[calc(100vh-5.5rem)] lg:p-8 print:h-auto print:min-h-0 print:overflow-visible print:rounded-none print:bg-transparent print:p-0">
      <div className="flex min-h-full w-full items-center justify-center">
        <div className="w-fit max-w-full shadow-2xl print:shadow-none">
          <InvoicePreview
            ref={previewRef}
            data={invoiceData}
            template={selectedTemplate}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-primary rounded-lg p-2 shrink-0">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                  Invoice Generator
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Create professional invoices in seconds
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 sm:mr-2" />
                Print
              </Button>
              <div className="flex-1 sm:flex-none">
                <PDFDownloadButton
                  data={invoiceData}
                  template={selectedTemplate}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Mobile / tablet: switch between edit & preview */}
        <div className="lg:hidden print:hidden mb-4">
          <Tabs
            value={mobileView}
            onValueChange={(value) =>
              setMobileView(value as "edit" | "preview")
            }
            className="gap-0"
          >
            <TabsList className="w-full grid grid-cols-2 h-10">
              <TabsTrigger value="edit" className="text-sm">
                Edit Invoice
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-sm">
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col gap-4 lg:min-h-[calc(100vh-5.5rem)] lg:flex-row lg:items-stretch lg:gap-6">
          <div
            className={`w-full shrink-0 lg:max-w-[480px] xl:max-w-[520px] print:hidden ${
              mobileView === "preview" ? "hidden lg:block" : ""
            }`}
          >
            {formPanel}
          </div>
          <div
            className={`flex min-h-0 flex-1 flex-col ${
              mobileView === "edit" ? "hidden lg:flex" : ""
            } print:flex`}
          >
            {previewPanel}
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-preview,
          #invoice-preview * {
            visibility: visible;
          }
          #invoice-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
