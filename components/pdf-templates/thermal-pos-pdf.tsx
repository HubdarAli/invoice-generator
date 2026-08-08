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
import {
  THERMAL_DASH_FULL,
  THERMAL_DASH_SHORT,
  formatThermalFooterDateTime,
  formatThermalItemLeftText,
  formatThermalItemTotal,
} from "@/lib/thermal-pos-format";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Courier",
    fontSize: 9,
    color: "#000000",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 14,
    width: 226,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: "Courier-Bold",
    marginBottom: 2,
  },
  headerLine: {
    fontSize: 9,
    marginBottom: 1,
  },
  dashedFull: {
    fontSize: 9,
    marginVertical: 3,
    letterSpacing: -0.5,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    marginBottom: 1,
  },
  itemLeft: {
    flex: 1,
    paddingRight: 6,
  },
  itemRight: {
    fontSize: 9,
    textAlign: "right",
  },
  dashedShort: {
    fontSize: 9,
    textAlign: "right",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 11,
    fontFamily: "Courier-Bold",
  },
  footer: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 8,
    lineHeight: 1.35,
    textTransform: "uppercase",
  },
  footerLine: {
    marginBottom: 2,
  },
});

interface ThermalPosPDFProps {
  data: InvoiceData;
}

export function ThermalPosPDF({ data }: ThermalPosPDFProps) {
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
    <Document>
      <Page size={{ width: 226, height: 841 }} style={styles.page} wrap>
        <Text style={styles.headerTitle}>
          {(data.companyName || "IDEAL").toUpperCase()}
        </Text>
        {headerLines.length > 0 ? (
          headerLines.map((line, index) => (
            <Text key={index} style={styles.headerLine}>
              {line.toUpperCase()}
            </Text>
          ))
        ) : (
          <>
            <Text style={styles.headerLine}>SNACKS REASTAURANT</Text>
            <Text style={styles.headerLine}>M.A.C.H.S</Text>
            <Text style={styles.headerLine}>SNTN# 1050049-9</Text>
          </>
        )}

        <Text style={styles.dashedFull}>{THERMAL_DASH_FULL}</Text>

        <View style={styles.tableRow}>
          <Text>TABLE</Text>
          <Text>{tableNumber}</Text>
        </View>

        <Text style={styles.dashedFull}>{THERMAL_DASH_FULL}</Text>

        {data.items.map((item, index) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemLeft}>
              {formatThermalItemLeftText(item, index)}
            </Text>
            <Text style={styles.itemRight}>
              {formatThermalItemTotal(item)}
            </Text>
          </View>
        ))}

        <Text style={styles.dashedShort}>{THERMAL_DASH_SHORT}</Text>
        <View style={styles.totalRow}>
          <Text>{paymentLabel}</Text>
          <Text>{Math.round(calculations.total)}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLine}>{clerkLine.toUpperCase()}</Text>
          <Text style={styles.footerLine}>{dateTimeLine}</Text>
          {barcodeLine ? (
            <Text style={styles.footerLine}>{barcodeLine}</Text>
          ) : null}
          {footerLines.length > 0 ? (
            footerLines.map((line, index) => (
              <Text key={index} style={styles.footerLine}>
                {line}
              </Text>
            ))
          ) : (
            <Text style={styles.footerLine}>
              ALL PRICES INCLUDE {data.taxRate || 13}% SST
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
