import type { TemplateType } from "./invoice-types";

export interface FormFieldDefinition {
  label: string;
  placeholder: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  inputType?: "text" | "date" | "number";
}

export interface TemplateFormSection {
  title: string;
  fields: Array<{
    key:
      | "companyLogo"
      | "companyName"
      | "companyAddress"
      | "companyPhone"
      | "clientName"
      | "clientAddress"
      | "clientPhone"
      | "invoiceNumber"
      | "invoiceDate";
  } & FormFieldDefinition>;
}

export interface TemplateItemsConfig {
  descriptionLabel: string;
  descriptionPlaceholder: string;
  descriptionHint?: string;
  quantityLabel: string;
  unitPriceLabel: string;
}

export interface TemplateFinancialsConfig {
  show: boolean;
  taxLabel?: string;
  discountLabel?: string;
  deliveryChargesLabel?: string;
}

export interface TemplateFormConfig {
  showLogo: boolean;
  sections: TemplateFormSection[];
  items: TemplateItemsConfig;
  financials: TemplateFinancialsConfig;
  footer: FormFieldDefinition;
}

const modernCreativeConfig: TemplateFormConfig = {
  showLogo: true,
  sections: [
    {
      title: "Company Information",
      fields: [
        {
          key: "companyName",
          label: "Company Name",
          placeholder: "Your Company Name",
        },
        {
          key: "companyPhone",
          label: "Phone",
          placeholder: "+92 300 0000000",
        },
        {
          key: "companyAddress",
          label: "Address",
          placeholder: "123 Business St, City",
        },
      ],
    },
    {
      title: "Client Information",
      fields: [
        {
          key: "clientName",
          label: "Client Name",
          placeholder: "Client Name or Company",
        },
        {
          key: "clientPhone",
          label: "Client Phone",
          placeholder: "+92 300 0000000",
        },
        {
          key: "clientAddress",
          label: "Client Address",
          placeholder: "456 Client Ave, City",
        },
      ],
    },
    {
      title: "Invoice Details",
      fields: [
        {
          key: "invoiceNumber",
          label: "Invoice Number",
          placeholder: "INV-000001",
        },
        {
          key: "invoiceDate",
          label: "Invoice Date",
          placeholder: "",
          inputType: "date",
        },
      ],
    },
  ],
  items: {
    descriptionLabel: "Description",
    descriptionPlaceholder: "Item description",
    quantityLabel: "Qty",
    unitPriceLabel: "Price",
  },
  financials: { show: true },
  footer: {
    label: "Footer Description",
    placeholder: "Payment terms, notes, or thank you message...",
    multiline: true,
    rows: 3,
  },
};

export const TEMPLATE_FORM_CONFIG: Record<TemplateType, TemplateFormConfig> = {
  modern: modernCreativeConfig,
  creative: modernCreativeConfig,

  restaurant: {
    showLogo: false,
    sections: [
      {
        title: "Restaurant Information",
        fields: [
          {
            key: "companyName",
            label: "Restaurant Name",
            placeholder: "BROHI BALOCHISTAN",
          },
          {
            key: "companyAddress",
            label: "Location / Hall",
            placeholder: "G.M / HALL 2ND PC",
          },
          {
            key: "companyPhone",
            label: "Contact / Footer Phone",
            placeholder: "+92340-5557609",
          },
        ],
      },
      {
        title: "Order Information",
        fields: [
          {
            key: "clientPhone",
            label: "Order / Ticket Number",
            placeholder: "686",
          },
          {
            key: "clientAddress",
            label: "Service Type",
            placeholder: "DINE IN",
          },
          {
            key: "clientName",
            label: "Server Name",
            placeholder: "otillo",
          },
          {
            key: "invoiceNumber",
            label: "Invoice Number",
            placeholder: "40358",
          },
          {
            key: "invoiceDate",
            label: "Order Date",
            placeholder: "",
            inputType: "date",
          },
        ],
      },
    ],
    items: {
      descriptionLabel: "Item Name",
      descriptionPlaceholder: "CHICKEN RESHMI KABAB PLATE",
      quantityLabel: "Qty",
      unitPriceLabel: "Rate",
    },
    financials: { show: true, taxLabel: "Tax Rate (%)" },
    footer: {
      label: "Footer",
      placeholder: "Powered By: DEVAJ TECHNOLOGY.\n+92340-5557609\nwww.devaj.co",
      multiline: true,
      rows: 3,
    },
  },

  "sale-receipt": {
    showLogo: false,
    sections: [
      {
        title: "Restaurant Information",
        fields: [
          {
            key: "companyName",
            label: "Restaurant Name",
            placeholder: "Al Raheem Kabab House",
          },
          {
            key: "companyAddress",
            label: "Location",
            placeholder: "Branch or area name",
          },
        ],
      },
      {
        title: "Order Information",
        fields: [
          {
            key: "clientPhone",
            label: "Order Number",
            placeholder: "58",
          },
          {
            key: "invoiceNumber",
            label: "Invoice Number",
            placeholder: "60945",
          },
          {
            key: "invoiceDate",
            label: "Order Date",
            placeholder: "",
            inputType: "date",
          },
          {
            key: "clientAddress",
            label: "Service Type",
            placeholder: "DINE IN",
          },
          {
            key: "clientName",
            label: "Server Name",
            placeholder: "HASNAIN",
          },
          {
            key: "companyPhone",
            label: "Table Number",
            placeholder: "10",
          },
        ],
      },
    ],
    items: {
      descriptionLabel: "Item Name",
      descriptionPlaceholder: "GARLIC NAAN",
      descriptionHint: "Use a new line for a second description line.",
      quantityLabel: "Qty",
      unitPriceLabel: "Rate",
    },
    financials: { show: true },
    footer: {
      label: "Footer",
      placeholder:
        "Powered By: DEVAJ TECHNOLOGY.\n+92346 0122791,+92340 5557618\nwww.devajtechnology.com",
      multiline: true,
      rows: 3,
    },
  },

  "thermal-pos": {
    showLogo: false,
    sections: [
      {
        title: "Restaurant Header",
        fields: [
          {
            key: "companyName",
            label: "Brand Name",
            placeholder: "IDEAL",
          },
          {
            key: "companyAddress",
            label: "Header Lines",
            placeholder: "SNACKS REASTAURANT\nM.A.C.H.S\nSNTN# 1050049-9",
            multiline: true,
            rows: 3,
            hint: "One line per row on the receipt.",
          },
        ],
      },
      {
        title: "Order Information",
        fields: [
          {
            key: "companyPhone",
            label: "Table Number",
            placeholder: "102",
          },
          {
            key: "clientAddress",
            label: "Payment Label",
            placeholder: "CREDIT",
          },
          {
            key: "clientName",
            label: "Clerk",
            placeholder: "CLERK 001",
          },
          {
            key: "clientPhone",
            label: "Barcode Line",
            placeholder: "34167777-8888-9999-34531089-03302486666",
          },
          {
            key: "invoiceDate",
            label: "Receipt Date",
            placeholder: "",
            inputType: "date",
          },
        ],
      },
    ],
    items: {
      descriptionLabel: "Item",
      descriptionPlaceholder: "80|CKN KARAHI FULL",
      descriptionHint: "Format: CODE|ITEM NAME or 80c ITEM NAME",
      quantityLabel: "Qty",
      unitPriceLabel: "Rate",
    },
    financials: {
      show: true,
      taxLabel: "SST Rate (%)",
    },
    footer: {
      label: "Footer",
      placeholder: "ALL PRICES INCLUDE 13% SST",
      multiline: true,
      rows: 2,
    },
  },

  "home-delivery": {
    showLogo: false,
    sections: [
      {
        title: "Client (Top Box)",
        fields: [
          {
            key: "clientName",
            label: "Client Name",
            placeholder: "Syed Uzman",
          },
          {
            key: "clientAddress",
            label: "Delivery Address",
            placeholder: "Flat / Apt #, Street, City",
            multiline: true,
            rows: 3,
            hint: "Use line breaks for multi-line address.",
          },
          {
            key: "clientPhone",
            label: "Contact Number",
            placeholder: "03132061040",
          },
        ],
      },
      {
        title: "Order & Delivery",
        fields: [
          {
            key: "companyPhone",
            label: "Slip Number",
            placeholder: "HD-5",
          },
          {
            key: "companyName",
            label: "Location",
            placeholder: "MACHS",
          },
          {
            key: "invoiceNumber",
            label: "Invoice Number",
            placeholder: "SD-4870175",
          },
          {
            key: "invoiceDate",
            label: "Order Date",
            placeholder: "",
            inputType: "date",
          },
          {
            key: "companyAddress",
            label: "Delivery Details",
            placeholder: "Sun, 2 Aug, 2026|02:21 pm\nAbbasRider",
            multiline: true,
            rows: 3,
            hint: "Line 1: branch (optional). Line 2: date|time. Line 3: rider name.",
          },
        ],
      },
    ],
    items: {
      descriptionLabel: "Item",
      descriptionPlaceholder: "00046-CHICKEN FRIED RICE|110",
      descriptionHint: "Append |DISCOUNT for line discount. Use new line for sub-description.",
      quantityLabel: "Qty/W",
      unitPriceLabel: "Price",
    },
    financials: {
      show: true,
      taxLabel: "G.S.T (%)",
      discountLabel: "Co.Disc / Discount",
      deliveryChargesLabel: "Bill Service Charges (count)",
    },
    footer: {
      label: "Footer",
      placeholder:
        "Invoice Printing: 2-Aug-2026 1:36 PM\nFirst Print: 2-Aug-2026 1:36 PM\nSoftware Developed by Technosys [ 0321-2401579 ]",
      multiline: true,
      rows: 4,
    },
  },

  "customer-bill": {
    showLogo: false,
    sections: [
      {
        title: "Business Header",
        fields: [
          {
            key: "companyName",
            label: "Business Name",
            placeholder: "FAJR FOODS",
          },
          {
            key: "companyAddress",
            label: "Header Lines",
            placeholder:
              "SNTN # S-9662561-1\nMAIN WADUWAH ROAD QASIMABAD\nFOR DELIVERY 03142331688",
            multiline: true,
            rows: 3,
            hint: "Line 1: SNTN (shown bold). Lines 2-3: address and phone.",
          },
        ],
      },
      {
        title: "Bill Information",
        fields: [
          {
            key: "clientAddress",
            label: "Service Type",
            placeholder: "Dine In",
          },
          {
            key: "invoiceDate",
            label: "Bill Date",
            placeholder: "",
            inputType: "date",
          },
          {
            key: "clientName",
            label: "User | Order Taker",
            placeholder: "pos2|G M.",
            hint: "Format: username|order taker name",
          },
          {
            key: "clientPhone",
            label: "Token Number",
            placeholder: "200110",
          },
          {
            key: "companyPhone",
            label: "Table Number",
            placeholder: "8",
          },
        ],
      },
    ],
    items: {
      descriptionLabel: "Item Name",
      descriptionPlaceholder: "CHICKEN BROAST",
      quantityLabel: "Qty",
      unitPriceLabel: "Rate",
    },
    financials: { show: false },
    footer: {
      label: "Footer",
      placeholder:
        "Software Developed By|Xenith 0333-2602502|25/07/2024|01:15:52PM",
      multiline: true,
      rows: 2,
      hint: "Format: line1|line2|date|time",
    },
  },
};

export function getTemplateFormConfig(template: TemplateType): TemplateFormConfig {
  return TEMPLATE_FORM_CONFIG[template];
}
