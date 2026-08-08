"use client";

import { useState, useRef, useEffect } from "react";
import { Printer, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Invoice Generator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create professional invoices in seconds
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <PDFDownloadButton data={invoiceData} template={selectedTemplate} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Left Panel - Form */}
          <div className="w-[480px] shrink-0 print:hidden">
            <div className="bg-background rounded-xl border border-border p-6 sticky top-24">
              <div className="mb-6">
                <h2 className="text-sm font-medium text-foreground mb-3">
                  Choose Template
                </h2>
                <TemplateSelector
                  selected={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
              </div>
              <div className="h-[calc(100vh-280px)] overflow-y-auto pr-2">
                <InvoiceForm
                  data={invoiceData}
                  template={selectedTemplate}
                  onChange={setInvoiceData}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 min-w-0">
            <div className="bg-zinc-200 rounded-xl p-8 print:p-0 print:bg-transparent print:rounded-none">
              <div className="max-w-[210mm] mx-auto shadow-2xl print:shadow-none print:max-w-none">
                <InvoicePreview
                  ref={previewRef}
                  data={invoiceData}
                  template={selectedTemplate}
                />
              </div>
            </div>
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
