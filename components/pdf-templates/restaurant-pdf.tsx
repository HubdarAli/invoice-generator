"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { InvoiceData } from "@/lib/invoice-types";
import { calculateInvoice } from "@/lib/invoice-calculations";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Courier",
    fontSize: 9,
    color: "#000000",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 20,
    maxWidth: 226,
  },
  header: {
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 6,
    marginBottom: 6,
    alignItems: "center",
  },
  title: {
    fontSize: 11,
    fontFamily: "Courier-Bold",
    letterSpacing: 1,
  },
  orderNumber: {
    fontSize: 22,
    fontFamily: "Courier-Bold",
    marginVertical: 4,
  },
  invoiceMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    paddingHorizontal: 2,
  },
  restaurantInfo: {
    textAlign: "center",
    marginBottom: 6,
    alignItems: "center",
  },
  restaurantName: {
    fontSize: 10,
    fontFamily: "Courier-Bold",
    textTransform: "uppercase",
  },
  locationText: {
    fontSize: 8,
    textTransform: "uppercase",
    marginTop: 2,
  },
  serviceType: {
    fontSize: 8,
    fontFamily: "Courier-Bold",
    textTransform: "uppercase",
    marginTop: 2,
  },
  metaSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderStyle: "dashed",
    paddingBottom: 6,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 3,
    marginBottom: 3,
  },
  colQty: { width: "12%", fontFamily: "Courier-Bold", fontSize: 8 },
  colItem: { width: "46%", fontFamily: "Courier-Bold", fontSize: 8 },
  colRate: {
    width: "18%",
    fontFamily: "Courier-Bold",
    fontSize: 8,
    textAlign: "right",
  },
  colAmount: {
    width: "24%",
    fontFamily: "Courier-Bold",
    fontSize: 8,
    textAlign: "right",
  },
  itemRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#999999",
    paddingVertical: 3,
  },
  itemQty: { width: "12%", fontSize: 8 },
  itemName: { width: "46%", fontSize: 8, textTransform: "uppercase" },
  itemRate: { width: "18%", fontSize: 8, textAlign: "right" },
  itemAmount: { width: "24%", fontSize: 8, textAlign: "right" },
  totalsSection: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 6,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    marginBottom: 2,
  },
  totalRowBold: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    fontFamily: "Courier-Bold",
    marginBottom: 2,
  },
  footer: {
    textAlign: "center",
    marginTop: 12,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderStyle: "dashed",
  },
  footerText: {
    fontSize: 7,
    lineHeight: 1.4,
  },
});

function formatReceiptDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
}

function formatReceiptTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getDayOfYear(dateString: string): string {
  const date = new Date(dateString);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return day.toString().padStart(5, "0");
}

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-PK", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

interface RestaurantPDFProps {
  data: InvoiceData;
}

export function RestaurantPDF({ data }: RestaurantPDFProps) {
  const calculations = calculateInvoice(data);
  const orderNumber = data.clientPhone || data.invoiceNumber.slice(-3) || "000";
  const serviceType = data.clientAddress || "DINE IN";
  const location = data.companyAddress;
  const server = data.clientName;

  return (
    <Document>
      <Page size={{ width: 226, height: 841 }} style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SALE INVOICE</Text>
          <Text style={styles.orderNumber}>{orderNumber}</Text>
          <View style={styles.invoiceMeta}>
            <Text>Invoice # {data.invoiceNumber || "00000"}</Text>
            <Text>
              Day:{" "}
              {data.invoiceDate ? getDayOfYear(data.invoiceDate) : "00000"}
            </Text>
          </View>
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>
            {data.companyName || "Restaurant Name"}
          </Text>
          {location ? (
            <Text style={styles.locationText}>{location}</Text>
          ) : null}
          <Text style={styles.serviceType}>{serviceType}</Text>
        </View>

        {/* Date / Server */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <Text>
              Date:{" "}
              {data.invoiceDate ? formatReceiptDate(data.invoiceDate) : "-"}
            </Text>
            <Text>
              Time:{" "}
              {data.invoiceDate ? formatReceiptTime(data.invoiceDate) : "-"}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text>Server: {server || "-"}</Text>
            <Text>Table:</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.tableHeader}>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colItem}>Item</Text>
          <Text style={styles.colRate}>Rate</Text>
          <Text style={styles.colAmount}>Amount</Text>
        </View>
        {data.items.map((item, index) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemQty}>{item.quantity}</Text>
            <Text style={styles.itemName}>
              {item.description || `Item ${index + 1}`}
            </Text>
            <Text style={styles.itemRate}>{formatAmount(item.unitPrice)}</Text>
            <Text style={styles.itemAmount}>
              {formatAmount(item.quantity * item.unitPrice)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text>SubTotal:</Text>
            <Text>{formatAmount(calculations.subtotal)}</Text>
          </View>
          {calculations.discountAmount > 0 && (
            <View style={styles.totalRow}>
              <Text>
                Discount
                {data.discountType === "percentage"
                  ? ` (${data.discountValue}%)`
                  : ""}
                :
              </Text>
              <Text>-{formatAmount(calculations.discountAmount)}</Text>
            </View>
          )}
          {data.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text>Tax ({data.taxRate}%):</Text>
              <Text>{formatAmount(calculations.taxAmount)}</Text>
            </View>
          )}
          {data.deliveryCharges > 0 && (
            <View style={styles.totalRow}>
              <Text>Delivery:</Text>
              <Text>{formatAmount(data.deliveryCharges)}</Text>
            </View>
          )}
          <View style={styles.totalRowBold}>
            <Text>Net Bill:</Text>
            <Text>{formatAmount(calculations.total)}</Text>
          </View>
          <View style={styles.totalRowBold}>
            <Text>Cash Received:</Text>
            <Text>{formatAmount(calculations.total)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Payment Mode:</Text>
            <Text>Cash</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {data.footerDescription ? (
            <Text style={styles.footerText}>{data.footerDescription}</Text>
          ) : data.companyPhone ? (
            <Text style={styles.footerText}>{data.companyPhone}</Text>
          ) : (
            <Text style={styles.footerText}>
              Thank you for dining with us!
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
