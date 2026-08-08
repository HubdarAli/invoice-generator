"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { InvoiceData } from "@/lib/invoice-types";
import {
  calculateHomeDelivery,
  formatHomeDeliveryMoney,
  formatHomeDeliveryOrderDate,
  formatHomeDeliveryWhole,
  parseDeliveryInfo,
  splitAddressLines,
} from "@/lib/home-delivery-format";
import { thermalPdfPageSize } from "@/lib/pdf-page-size";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#000000",
    backgroundColor: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 10,
    width: 226,
  },
  thinBox: {
    borderWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 6,
  },
  thickBox: {
    borderWidth: 2,
    borderColor: "#000000",
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginBottom: 8,
    alignItems: "center",
  },
  slipLabel: {
    fontSize: 7,
    marginBottom: 2,
    textAlign: "center",
  },
  slipNumber: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  homeDeliveryTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    marginBottom: 3,
    marginTop: 2,
  },
  labelBold: {
    fontFamily: "Helvetica-Bold",
  },
  metaLine: {
    marginBottom: 2,
  },
  deliveryDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  tableSection: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 3,
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
  },
  colDesc: { width: "38%" },
  colPrice: { width: "16%", textAlign: "right" },
  colQty: { width: "14%", textAlign: "right" },
  colDisc: { width: "14%", textAlign: "right" },
  colAmount: { width: "18%", textAlign: "right" },
  itemRow: {
    flexDirection: "row",
    fontSize: 7,
    marginBottom: 1,
  },
  itemSubLine: {
    fontSize: 7,
    textTransform: "uppercase",
    marginBottom: 1,
  },
  grandTotalBox: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
    paddingVertical: 3,
    marginVertical: 4,
  },
  grandTotalRow: {
    flexDirection: "row",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    marginBottom: 2,
  },
  footer: {
    fontSize: 6.5,
    lineHeight: 1.35,
    marginTop: 6,
  },
  footerLine: {
    marginBottom: 2,
  },
  textLine: {
    marginBottom: 1,
    lineHeight: 1.3,
  },
});

interface HomeDeliveryPDFProps {
  data: InvoiceData;
}

export function HomeDeliveryPDF({ data }: HomeDeliveryPDFProps) {
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

  const topAddress =
    addressLines.length > 0 ? addressLines.join("\n") : data.clientAddress || "-";

  return (
    <Document>
      <Page size={thermalPdfPageSize} style={styles.page} wrap={false}>
        <View style={styles.thinBox}>
          <Text style={styles.textLine}>
            <Text style={styles.labelBold}>Client:</Text> {data.clientName || "-"}
          </Text>
          <Text style={styles.textLine}>
            <Text style={styles.labelBold}>Address:</Text> {topAddress}
          </Text>
          <Text style={styles.textLine}>
            <Text style={styles.labelBold}>Contact No#:</Text>{" "}
            {data.clientPhone || "-"}
          </Text>
        </View>

        <View style={styles.thickBox}>
          <Text style={styles.slipLabel}>Temporary Slip</Text>
          <Text style={styles.slipNumber}>{slipNumber}</Text>
        </View>

        <Text style={styles.homeDeliveryTitle}>Home Delivery</Text>
        <Text style={styles.metaLine}>
          <Text style={styles.labelBold}>Order Date:</Text>{" "}
          {data.invoiceDate ? formatHomeDeliveryOrderDate(data.invoiceDate) : "-"}
        </Text>
        <Text style={styles.metaLine}>
          <Text style={styles.labelBold}>Invoice #:</Text>{" "}
          {data.invoiceNumber || "-"}
        </Text>
        <Text style={{ marginBottom: 6 }}>{location}</Text>

        <Text style={styles.sectionTitle}>Client Information</Text>
        <Text style={styles.textLine}>
          <Text style={styles.labelBold}>Name:</Text> {data.clientName || "-"}
        </Text>
        <Text style={styles.textLine}>
          <Text style={styles.labelBold}>Contact #:</Text>{" "}
          {data.clientPhone || "-"}
        </Text>
        <Text style={styles.labelBold}>Address:</Text>
        {addressLines.length > 0 ? (
          addressLines.map((line, index) => (
            <Text key={index} style={styles.textLine}>
              {line}
            </Text>
          ))
        ) : (
          <Text style={styles.textLine}>{data.clientAddress || "-"}</Text>
        )}

        <Text style={styles.sectionTitle}>Delivery Information</Text>
        <Text style={styles.textLine}>
          <Text style={styles.labelBold}>Delivery Branch:</Text>{" "}
          {delivery.branch}
        </Text>
        <Text style={styles.labelBold}>Delivery Date & Time</Text>
        <View style={styles.deliveryDateRow}>
          <Text>{deliveryDate}</Text>
          <Text>{deliveryTime}</Text>
        </View>
        <Text style={{ marginBottom: 6 }}>
          <Text style={styles.labelBold}>Rider Name:</Text>{" "}
          {delivery.riderName || "-"}
        </Text>

        <View style={styles.tableSection}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}> </Text>
            <Text style={styles.colPrice}>Price</Text>
            <Text style={styles.colQty}>Qty/W</Text>
            <Text style={styles.colDisc}>Disc.</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>

          {calc.rows.map((row) => (
            <View key={row.item.id} wrap={false}>
              <View style={styles.itemRow}>
                <Text style={styles.colDesc}>{row.nameLines[0]}</Text>
                <Text style={styles.colPrice}>
                  {formatHomeDeliveryWhole(row.item.unitPrice)}
                </Text>
                <Text style={styles.colQty}>{row.item.quantity}</Text>
                <Text style={styles.colDisc}>
                  {formatHomeDeliveryWhole(row.lineDiscount)}
                </Text>
                <Text style={styles.colAmount}>
                  {formatHomeDeliveryWhole(row.lineAmount)}
                </Text>
              </View>
              {row.nameLines.slice(1).map((line, index) => (
                <Text key={index} style={styles.itemSubLine}>
                  {line}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.grandTotalBox}>
          <View style={styles.grandTotalRow}>
            <Text style={styles.colDesc}>Grand Total:</Text>
            <Text style={styles.colPrice}> </Text>
            <Text style={styles.colQty}>{calc.grandTotalQty}</Text>
            <Text style={styles.colDisc}> </Text>
            <Text style={styles.colAmount}>
              {formatHomeDeliveryWhole(calc.grandTotalAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Text>Gross Amount</Text>
          <Text>{formatHomeDeliveryMoney(calc.grossAmount)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Co.Disc/Discount</Text>
          <Text>{formatHomeDeliveryMoney(calc.coDiscount)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>G.S.T {data.taxRate.toFixed(2)} %</Text>
          <Text>{formatHomeDeliveryMoney(calc.taxAmount)}</Text>
        </View>

        <View style={{ marginTop: 4, marginBottom: 6 }}>
          <View style={styles.summaryRow}>
            <Text>Bill Service Charges</Text>
            <Text>{calc.serviceChargeCount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Total Charges</Text>
            <Text>{calc.totalChargeCount}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          {footerLines.length > 0 ? (
            footerLines.map((line, index) => (
              <Text key={index} style={styles.footerLine}>
                {line}
              </Text>
            ))
          ) : (
            <>
              <Text style={styles.footerLine}>
                Invoice Printing:{" "}
                {data.invoiceDate
                  ? formatHomeDeliveryOrderDate(data.invoiceDate)
                  : "-"}
              </Text>
              <Text style={styles.footerLine}>
                First Print:{" "}
                {data.invoiceDate
                  ? formatHomeDeliveryOrderDate(data.invoiceDate)
                  : "-"}
              </Text>
              <Text style={styles.footerLine}>
                Software Developed by Technosys [ 0321-2401579 ]
              </Text>
              <Text style={styles.footerLine}>
                www.technosysbd.com [ 0341-2479931 ]
              </Text>
            </>
          )}
        </View>
      </Page>
    </Document>
  );
}
