"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { InvoiceData } from "@/lib/invoice-types";
import { calculateInvoice } from "@/lib/invoice-calculations";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Courier",
    fontSize: 10,
    color: "#000000",
    backgroundColor: "#ffffff",
    paddingHorizontal: 32,
    paddingVertical: 32,
    maxWidth: 240,
  },

  // Header
  header: {
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
    objectFit: "contain",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Courier-Bold",
    marginBottom: 4,
  },
  companyAddress: {
    fontSize: 8,
  },
  invoiceTitle: {
    fontSize: 12,
    fontFamily: "Courier-Bold",
    marginTop: 4,
  },
  invoiceNumber: {
    fontSize: 8,
  },
  invoiceDate: {
    fontSize: 8,
  },

  // Bill To
  billTo: {
    marginBottom: 8,
  },
  billToLabel: {
    fontSize: 8,
    fontFamily: "Courier-Bold",
  },
  billToText: {
    fontSize: 8,
  },

  // Items
  itemsSection: {
    marginBottom: 8,
  },
  itemsHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 4,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemsHeaderLeft: {
    fontSize: 8,
    fontFamily: "Courier-Bold",
  },
  itemsHeaderRight: {
    fontSize: 8,
    fontFamily: "Courier-Bold",
  },
  itemRow: {
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 8,
  },
  itemAmount: {
    fontSize: 8,
    textAlign: "right",
  },

  // Totals
  totalsSection: {
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    paddingTop: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 8,
  },
  totalValue: {
    fontSize: 8,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    paddingTop: 4,
  },
  grandTotalLabel: {
    fontSize: 8,
    fontFamily: "Courier-Bold",
  },
  grandTotalValue: {
    fontSize: 8,
    fontFamily: "Courier-Bold",
  },

  // Barcode area
  barcodeSection: {
    textAlign: "center",
    marginTop: 8,
    alignItems: "center",
  },
  barcodeText: {
    fontSize: 8,
    letterSpacing: 2,
    fontFamily: "Courier-Bold",
    marginBottom: 2,
  },
  barcodeBars: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: 30,
    gap: 1,
  },
  barcodeValue: {
    fontSize: 7,
    marginTop: 2,
    letterSpacing: 1,
  },

  // Footer
  footer: {
    textAlign: "center",
    marginTop: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
  },
  footerText: {
    fontSize: 8,
  },
});

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Simple barcode renderer using vertical bars
function BarcodeView({ value }: { value: string }) {
  // Generate a simple pseudo-barcode pattern from the value string
  const chars = value.split("");
  const bars: { width: number; height: number }[] = [];

  for (let i = 0; i < Math.min(chars.length * 3, 60); i++) {
    const charCode = chars[i % chars.length]?.charCodeAt(0) ?? 65;
    const isWide = (charCode + i) % 3 === 0;
    const isShort = (charCode + i) % 5 === 0;
    bars.push({
      width: isWide ? 3 : 1,
      height: isShort ? 20 : 30,
    });
    // Add a gap bar
    bars.push({ width: 1, height: 0 });
  }

  return (
    <View style={styles.barcodeSection}>
      <View style={styles.barcodeBars}>
        {bars.map((bar, idx) =>
          bar.height > 0 ? (
            <View
              key={idx}
              style={{
                width: bar.width,
                height: bar.height,
                backgroundColor: "#000000",
              }}
            />
          ) : (
            <View key={idx} style={{ width: bar.width }} />
          )
        )}
      </View>
      <Text style={styles.barcodeValue}>{value}</Text>
    </View>
  );
}

interface CreativePDFProps {
  data: InvoiceData;
}

export function CreativePDF({ data }: CreativePDFProps) {
  const calculations = calculateInvoice(data);

  return (
    <Document>
      <Page
        size={{ width: 226, height: 841 }} // ~80mm thermal width, auto height
        style={styles.page}
        wrap
      >
        {/* Header */}
        <View style={styles.header}>
          {data.companyLogo && (
            <Image src={data.companyLogo} style={styles.logo} />
          )}
          <Text style={styles.companyName}>
            {data.companyName || "Your Company"}
          </Text>
          {data.companyAddress ? (
            <Text style={styles.companyAddress}>{data.companyAddress}</Text>
          ) : null}
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>
            #{data.invoiceNumber || "INV-000000"}
          </Text>
          <Text style={styles.invoiceDate}>
            Date: {data.invoiceDate ? formatDate(data.invoiceDate) : "-"}
          </Text>
        </View>

        {/* Bill To */}
        <View style={styles.billTo}>
          <Text style={styles.billToLabel}>Bill To:</Text>
          <Text style={styles.billToText}>
            {data.clientName || "Client Name"}
          </Text>
          {data.clientAddress ? (
            <Text style={styles.billToText}>{data.clientAddress}</Text>
          ) : null}
          {data.clientPhone ? (
            <Text style={styles.billToText}>{data.clientPhone}</Text>
          ) : null}
        </View>

        {/* Items */}
        <View style={styles.itemsSection}>
          <View style={styles.itemsHeader}>
            <Text style={styles.itemsHeaderLeft}>Item</Text>
            <Text style={styles.itemsHeaderRight}>Qty Price Total</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemDescription}>
                {item.description || `Item ${index + 1}`}
              </Text>
              <Text style={styles.itemAmount}>
                {item.quantity} x {formatCurrency(item.unitPrice)} ={" "}
                {formatCurrency(item.quantity * item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(calculations.subtotal)}
            </Text>
          </View>

          {calculations.discountAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Discount
                {data.discountType === "percentage"
                  ? ` (${data.discountValue}%)`
                  : ""}
                :
              </Text>
              <Text style={styles.totalValue}>
                -{formatCurrency(calculations.discountAmount)}
              </Text>
            </View>
          )}

          {data.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({data.taxRate}%):</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(calculations.taxAmount)}
              </Text>
            </View>
          )}

          {data.deliveryCharges > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery Charges:</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(data.deliveryCharges)}
              </Text>
            </View>
          )}

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(calculations.total)}
            </Text>
          </View>
        </View>

        {/* Barcode */}
        <BarcodeView value={data.invoiceNumber || "INV-000000"} />

        {/* Footer */}
        {data.footerDescription && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>{data.footerDescription}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}