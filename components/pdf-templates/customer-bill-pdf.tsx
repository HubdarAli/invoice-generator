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
  CUSTOMER_BILL_DEFAULT_ADDRESS,
  formatCustomerBillDate,
  formatCustomerBillMoney,
  formatCustomerBillTime,
  formatCustomerBillWhole,
  parseCustomerBillFooter,
  parseCustomerBillMeta,
  splitCompanyAddressLines,
} from "@/lib/customer-bill-format";
import { thermalPdfPageSize } from "@/lib/pdf-page-size";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#000000",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 226,
  },
  header: {
    textAlign: "center",
  },
  businessName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  sntnLine: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
  },
  headerLine: {
    fontSize: 8,
    marginBottom: 1,
  },
  thickRule: {
    borderTopWidth: 2,
    borderTopColor: "#000000",
    marginVertical: 5,
  },
  billTitle: {
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginBottom: 2,
  },
  serviceType: {
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    fontSize: 8,
  },
  metaLine: {
    marginBottom: 2,
    fontSize: 8,
  },
  tokenNumber: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  tableHeader: {
    flexDirection: "row",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    marginBottom: 3,
  },
  itemRow: {
    flexDirection: "row",
    fontSize: 8,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  colQty: { width: "8%" },
  colItem: { width: "54%" },
  colRate: { width: "19%", textAlign: "right" },
  colAmt: { width: "19%", textAlign: "right" },
  totalsRow: {
    flexDirection: "row",
    fontSize: 8,
    marginBottom: 3,
  },
  boldLabel: {
    width: "62%",
    fontFamily: "Helvetica-Bold",
  },
  boldValue: {
    fontFamily: "Helvetica-Bold",
  },
  thankYou: {
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginTop: 10,
    marginBottom: 6,
  },
  footerCenter: {
    textAlign: "center",
    fontSize: 6.5,
    marginBottom: 1,
  },
  footerTimestamp: {
    textAlign: "right",
    fontSize: 6.5,
    lineHeight: 1.25,
    marginTop: 4,
  },
});

interface CustomerBillPDFProps {
  data: InvoiceData;
}

export function CustomerBillPDF({ data }: CustomerBillPDFProps) {
  const calculations = calculateInvoice(data);
  const addressLines = splitCompanyAddressLines(data.companyAddress);
  const headerLines =
    addressLines.length > 0 ? addressLines : CUSTOMER_BILL_DEFAULT_ADDRESS;
  const serviceType = data.clientAddress || "Dine In";
  const tokenNumber = data.clientPhone || "000000";
  const tableNumber = data.companyPhone || "0";
  const { user, orderTaker } = parseCustomerBillMeta(data.clientName);
  const footer = parseCustomerBillFooter(
    data.footerDescription,
    data.invoiceDate
  );

  return (
    <Document>
      <Page size={thermalPdfPageSize} style={styles.page} wrap={false}>
        <View style={styles.header}>
          <Text style={styles.businessName}>
            {(data.companyName || "FAJR FOODS").toUpperCase()}
          </Text>
          <Text style={styles.sntnLine}>{headerLines[0].toUpperCase()}</Text>
          {headerLines.slice(1).map((line, index) => (
            <Text key={index} style={styles.headerLine}>
              {line.toUpperCase()}
            </Text>
          ))}
        </View>

        <View style={styles.thickRule} />

        <Text style={styles.billTitle}>Customer Bill</Text>
        <Text style={styles.serviceType}>{serviceType}</Text>

        <View style={styles.metaRow}>
          <Text>
            Date :    {data.invoiceDate ? formatCustomerBillDate(data.invoiceDate) : "-"}
          </Text>
          <Text>
            Time :    {data.invoiceDate ? formatCustomerBillTime(data.invoiceDate) : "-"}
          </Text>
        </View>
        <Text style={styles.metaLine}>User :    {user}</Text>
        <Text style={styles.metaLine}>
          Token#:   <Text style={styles.tokenNumber}>{tokenNumber}</Text>
        </Text>
        <Text style={styles.metaLine}>Order Of :      TABLE {tableNumber}</Text>
        <Text style={[styles.metaLine, { marginBottom: 5 }]}>
          Order Taker :   {orderTaker}
        </Text>

        <View style={styles.thickRule} />

        <View style={styles.tableHeader}>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colItem}>Item Name</Text>
          <Text style={styles.colRate}>Rate</Text>
          <Text style={styles.colAmt}>Amt</Text>
        </View>

        {data.items.map((item, index) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colItem}>
              {(item.description || `Item ${index + 1}`).toUpperCase()}
            </Text>
            <Text style={styles.colRate}>
              {formatCustomerBillWhole(item.unitPrice)}
            </Text>
            <Text style={styles.colAmt}>
              {formatCustomerBillWhole(item.quantity * item.unitPrice)}
            </Text>
          </View>
        ))}

        <View style={styles.thickRule} />

        <View style={styles.totalsRow}>
          <Text style={styles.boldLabel}>Sub Total</Text>
          <Text style={styles.colRate}>
            {formatCustomerBillMoney(calculations.discountAmount)}
          </Text>
          <Text style={[styles.colAmt, styles.boldValue]}>
            {formatCustomerBillMoney(calculations.subtotal)}
          </Text>
        </View>

        <View style={styles.totalsRow}>
          <Text style={styles.boldLabel}>Net Bill :</Text>
          <Text style={styles.colRate}> </Text>
          <Text style={[styles.colAmt, styles.boldValue]}>
            {formatCustomerBillMoney(calculations.total)}
          </Text>
        </View>

        <Text style={styles.thankYou}>Thank You!</Text>
        <Text style={styles.footerCenter}>{footer.developerLine1}</Text>
        <Text style={styles.footerCenter}>{footer.developerLine2}</Text>
        <View style={styles.footerTimestamp}>
          <Text>{footer.timestampDate}</Text>
          <Text>{footer.timestampTime}</Text>
        </View>
      </Page>
    </Document>
  );
}
