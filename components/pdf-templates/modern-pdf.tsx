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
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#27272a",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingVertical: 32,
    maxWidth: 240,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    objectFit: "contain",
    marginBottom: 8,
    borderRadius: 8,
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
    marginBottom: 4,
    textAlign: "center",
  },
  companyAddress: {
    fontSize: 8,
    color: "#71717a",
    textAlign: "center",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    paddingBottom: 12,
    marginBottom: 16,
  },
  infoBlock: {
    flex: 1,
  },
  infoBlockRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  infoLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 8,
    color: "#71717a",
  },
  infoValueBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
  },
  itemsList: {
    marginBottom: 16,
  },
  itemRow: {
    marginBottom: 10,
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
    flex: 1,
    paddingRight: 8,
  },
  itemTotal: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
  },
  itemBottomRow: {
    fontSize: 8,
    color: "#71717a",
  },
  totalsSection: {
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
    paddingTop: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 9,
    color: "#71717a",
  },
  totalValue: {
    fontSize: 9,
    color: "#27272a",
  },
  discountValue: {
    fontSize: 9,
    color: "#10b981", // Emerald 500
    fontFamily: "Helvetica-Bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
    paddingTop: 10,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
  },
  barcodeSection: {
    alignItems: "center",
    marginTop: 24,
  },
  barcodeBars: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: 25,
    gap: 1,
  },
  barcodeValue: {
    fontSize: 7,
    marginTop: 4,
    color: "#a1a1aa",
    letterSpacing: 2,
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    marginTop: 20,
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 6,
  },
  footerText: {
    fontSize: 8,
    color: "#71717a",
    textAlign: "center",
    lineHeight: 1.4,
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
  const chars = value.split("");
  const bars: { width: number; height: number }[] = [];

  for (let i = 0; i < Math.min(chars.length * 4, 70); i++) {
    const charCode = chars[i % chars.length]?.charCodeAt(0) ?? 65;
    const isWide = (charCode + i) % 3 === 0;
    const isShort = (charCode + i) % 7 === 0;
    bars.push({
      width: isWide ? 2 : 1,
      height: isShort ? 20 : 25,
    });
    bars.push({ width: 1, height: 0 }); // Gap
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
                backgroundColor: "#27272a",
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

interface ModernPDFProps {
  data: InvoiceData;
}

export function ModernPDF({ data }: ModernPDFProps) {
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
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Receipt</Text>
            <Text style={styles.infoValue}>
              #{data.invoiceNumber || "INV-000000"}
            </Text>
          </View>
          <View style={styles.infoBlockRight}>
            <Text style={styles.infoValue}>
              {data.invoiceDate ? formatDate(data.invoiceDate) : "-"}
            </Text>
            <Text style={styles.infoValueBold}>
              {data.clientName || "Walk-in Customer"}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.itemsList}>
          {data.items.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemTopRow}>
                <Text style={styles.itemDescription}>
                  {item.description || `Item ${index + 1}`}
                </Text>
                <Text style={styles.itemTotal}>
                  {formatCurrency(item.quantity * item.unitPrice)}
                </Text>
              </View>
              <Text style={styles.itemBottomRow}>
                {item.quantity} x {formatCurrency(item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
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
              </Text>
              <Text style={styles.discountValue}>
                -{formatCurrency(calculations.discountAmount)}
              </Text>
            </View>
          )}

          {data.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({data.taxRate}%)</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(calculations.taxAmount)}
              </Text>
            </View>
          )}

          {data.deliveryCharges > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery Charges</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(data.deliveryCharges)}
              </Text>
            </View>
          )}

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
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
