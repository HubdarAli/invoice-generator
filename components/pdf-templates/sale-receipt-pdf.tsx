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
import { thermalPdfPageSize } from "@/lib/pdf-page-size";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#000000",
    backgroundColor: "#ffffff",
    padding: 10,
    width: 226,
  },
  outerBorder: {
    borderWidth: 1,
    borderColor: "#000000",
    padding: 8,
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  orderBoxWrapper: {
    alignItems: "center",
    marginBottom: 6,
  },
  orderBox: {
    borderWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 18,
    paddingVertical: 2,
    minWidth: 50,
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1,
  },
  invoiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    marginBottom: 4,
  },
  restaurantRow: {
    fontSize: 9,
    marginBottom: 2,
  },
  restaurantLabel: {
    fontSize: 9,
  },
  restaurantName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  serviceType: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    textTransform: "uppercase",
  },
  timeText: {
    fontSize: 9,
    textAlign: "right",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    marginBottom: 2,
  },
  metaLabel: {
    fontSize: 9,
  },
  metaValueBold: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  colQty: { width: "14%" },
  colItem: { width: "46%" },
  colRate: { width: "16%", textAlign: "right" },
  colAmount: { width: "24%", textAlign: "right" },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 1,
    fontSize: 8,
  },
  itemQty: { width: "14%" },
  itemName: { width: "46%", textTransform: "uppercase" },
  itemRate: { width: "16%", textAlign: "right" },
  itemAmount: { width: "24%", textAlign: "right" },
  totalsSection: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 4,
    marginTop: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    marginBottom: 2,
  },
  netBillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 4,
    marginTop: 4,
    marginBottom: 2,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    marginTop: 6,
    paddingTop: 6,
    textAlign: "center",
    fontSize: 8,
    lineHeight: 1.4,
  },
  footerBold: {
    fontFamily: "Helvetica-Bold",
  },
});

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

function formatQty(qty: number): string {
  return qty.toFixed(2);
}

function formatRate(rate: number): string {
  return rate.toLocaleString("en-PK", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

function formatItemAmount(amount: number): string {
  return amount.toFixed(3);
}

function formatSubTotal(amount: number): string {
  return amount.toFixed(3);
}

function formatNetBill(amount: number): string {
  return amount.toFixed(2);
}

function formatCashReceived(amount: number): string {
  return Math.round(amount).toLocaleString("en-PK");
}

interface SaleReceiptPDFProps {
  data: InvoiceData;
}

export function SaleReceiptPDF({ data }: SaleReceiptPDFProps) {
  const calculations = calculateInvoice(data);
  const orderNumber = data.clientPhone || "0";
  const serviceType = data.clientAddress || "DINE IN";
  const server = data.clientName || "-";
  const table = data.companyAddress || "-";

  return (
    <Document>
      <Page size={thermalPdfPageSize} style={styles.page} wrap={false}>
        <View style={styles.outerBorder}>
          <Text style={styles.title}>SALE RECEIPT</Text>

          <View style={styles.orderBoxWrapper}>
            <View style={styles.orderBox}>
              <Text style={styles.orderNumber}>{orderNumber}</Text>
            </View>
          </View>

          <View style={styles.invoiceRow}>
            <Text>Invoice # {data.invoiceNumber || "00000"}</Text>
            <Text>
              DAY{" "}
              {data.invoiceDate ? getDayOfYear(data.invoiceDate) : "00000"}
            </Text>
          </View>

          <Text style={styles.restaurantRow}>
            <Text style={styles.restaurantLabel}>Restaurant: </Text>
            <Text style={styles.restaurantName}>
              {data.companyName || "Restaurant Name"}
            </Text>
          </Text>

          <Text style={styles.serviceType}>{serviceType}</Text>
          <Text style={styles.timeText}>
            {data.invoiceDate ? formatReceiptTime(data.invoiceDate) : "-"}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Server :</Text>
            <Text style={styles.metaValueBold}>{server}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Table :</Text>
            <Text style={styles.metaValue}>{table}</Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colItem}>Item</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>

          {data.items.map((item, index) => {
            const lines = (item.description || `Item ${index + 1}`).split(
              "\n"
            );
            const amount = item.quantity * item.unitPrice;

            return (
              <View key={item.id}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemQty}>{formatQty(item.quantity)}</Text>
                  <Text style={styles.itemName}>{lines[0]}</Text>
                  <Text style={styles.itemRate}>
                    {formatRate(item.unitPrice)}
                  </Text>
                  <Text style={styles.itemAmount}>
                    {formatItemAmount(amount)}
                  </Text>
                </View>
                {lines.slice(1).map((line, lineIndex) => (
                  <View key={lineIndex} style={styles.itemRow}>
                    <Text style={styles.itemQty}> </Text>
                    <Text style={styles.itemName}>{line}</Text>
                    <Text style={styles.itemRate}> </Text>
                    <Text style={styles.itemAmount}> </Text>
                  </View>
                ))}
              </View>
            );
          })}

          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text>SubTotal :</Text>
              <Text>{formatSubTotal(calculations.subtotal)}</Text>
            </View>

            {calculations.discountAmount > 0 && (
              <View style={styles.totalRow}>
                <Text>
                  Discount
                  {data.discountType === "percentage"
                    ? ` (${data.discountValue}%)`
                    : ""}{" "}
                  :
                </Text>
                <Text>-{formatSubTotal(calculations.discountAmount)}</Text>
              </View>
            )}

            {data.taxRate > 0 && (
              <View style={styles.totalRow}>
                <Text>Tax ({data.taxRate}%) :</Text>
                <Text>{formatSubTotal(calculations.taxAmount)}</Text>
              </View>
            )}

            {data.deliveryCharges > 0 && (
              <View style={styles.totalRow}>
                <Text>Delivery :</Text>
                <Text>{formatSubTotal(data.deliveryCharges)}</Text>
              </View>
            )}

            <View style={styles.netBillRow}>
              <Text>Net Bill :</Text>
              <Text>{formatNetBill(calculations.total)}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text>Cash Received:</Text>
              <Text>{formatCashReceived(calculations.total)}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text>Payment Mode :</Text>
              <Text>Cash</Text>
            </View>
          </View>

          <View style={styles.footer}>
            {data.footerDescription ? (
              data.footerDescription.split("\n").map((line, index) => (
                <Text key={index}>{line}</Text>
              ))
            ) : (
              <>
                <Text style={styles.footerBold}>
                  Powered By: DEVAJ TECHNOLOGY.
                </Text>
                {data.companyPhone ? <Text>{data.companyPhone}</Text> : null}
                <Text>www.devajtechnology.com</Text>
              </>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
