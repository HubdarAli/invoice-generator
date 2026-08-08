"use client";

import { useCallback } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InvoiceData, InvoiceItem, TemplateType } from "@/lib/invoice-types";
import { getTemplateFormConfig } from "@/lib/template-fields";

interface InvoiceFormProps {
  data: InvoiceData;
  template: TemplateType;
  onChange: (data: InvoiceData) => void;
}

type TextFieldKey =
  | "companyName"
  | "companyAddress"
  | "companyPhone"
  | "clientName"
  | "clientAddress"
  | "clientPhone"
  | "invoiceNumber"
  | "invoiceDate"
  | "footerDescription";

export function InvoiceForm({ data, template, onChange }: InvoiceFormProps) {
  const config = getTemplateFormConfig(template);

  const updateField = useCallback(
    <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange]
  );

  const updateItem = useCallback(
    (index: number, field: keyof InvoiceItem, value: string | number) => {
      const newItems = [...data.items];
      newItems[index] = { ...newItems[index], [field]: value };
      onChange({ ...data, items: newItems });
    },
    [data, onChange]
  );

  const addItem = useCallback(() => {
    onChange({
      ...data,
      items: [
        ...data.items,
        { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0 },
      ],
    });
  }, [data, onChange]);

  const removeItem = useCallback(
    (index: number) => {
      if (data.items.length > 1) {
        const newItems = data.items.filter((_, i) => i !== index);
        onChange({ ...data, items: newItems });
      }
    },
    [data, onChange]
  );

  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateField("companyLogo", reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [updateField]
  );

  const renderField = (field: {
    key: TextFieldKey;
    label: string;
    placeholder: string;
    hint?: string;
    multiline?: boolean;
    rows?: number;
    inputType?: "text" | "date" | "number";
  }) => {
    const value = data[field.key] as string;
    const id = field.key;

    return (
      <div key={field.key} className={field.multiline ? "col-span-2" : undefined}>
        <Label htmlFor={id}>{field.label}</Label>
        {field.multiline ? (
          <Textarea
            id={id}
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows ?? 3}
            className="mt-1.5"
          />
        ) : (
          <Input
            id={id}
            type={field.inputType === "date" ? "date" : "text"}
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="mt-1.5"
          />
        )}
        {field.hint ? (
          <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {config.showLogo ? (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Branding
          </h2>
          <div>
            <Label>Company Logo</Label>
            <div className="mt-2 flex items-center gap-4">
              {data.companyLogo ? (
                <div className="relative">
                  <img
                    src={data.companyLogo}
                    alt="Logo preview"
                    className="h-16 w-16 object-contain rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => updateField("companyLogo", null)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center h-16 w-16 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
              <span className="text-sm text-muted-foreground">
                Upload your company logo (PNG, JPG)
              </span>
            </div>
          </div>
        </section>
      ) : null}

      {config.sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {section.title}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {section.fields.map((field) => renderField(field))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Line Items
        </h2>
        {config.items.descriptionHint ? (
          <p className="text-xs text-muted-foreground mb-3">
            {config.items.descriptionHint}
          </p>
        ) : null}
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <div
              key={item.id}
              className="flex gap-3 items-start p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">
                  {config.items.descriptionLabel}
                </Label>
                <Textarea
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  placeholder={config.items.descriptionPlaceholder}
                  rows={2}
                  className="mt-1 min-h-[60px]"
                />
              </div>
              <div className="w-20">
                <Label className="text-xs text-muted-foreground">
                  {config.items.quantityLabel}
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", parseInt(e.target.value) || 1)
                  }
                  placeholder="1"
                  className="mt-1"
                />
              </div>
              <div className="w-28">
                <Label className="text-xs text-muted-foreground">
                  {config.items.unitPriceLabel}
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "unitPrice",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                disabled={data.items.length === 1}
                className="text-muted-foreground hover:text-destructive mt-6"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </section>

      {config.financials.show ? (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Financial Details
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="taxRate">
                {config.financials.taxLabel ?? "Tax Rate (%)"}
              </Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={data.taxRate}
                onChange={(e) =>
                  updateField("taxRate", parseFloat(e.target.value) || 0)
                }
                placeholder="0"
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={data.discountType}
                  onValueChange={(value: "percentage" | "fixed") =>
                    updateField("discountType", value)
                  }
                >
                  <SelectTrigger id="discountType" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discountValue">
                  {config.financials.discountLabel ??
                    (data.discountType === "percentage"
                      ? "Discount (%)"
                      : "Discount Amount")}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  step={data.discountType === "percentage" ? "1" : "0.01"}
                  value={data.discountValue}
                  onChange={(e) =>
                    updateField("discountValue", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="deliveryCharges">
                {config.financials.deliveryChargesLabel ?? "Delivery Charges"}
              </Label>
              <Input
                id="deliveryCharges"
                type="number"
                min="0"
                step="0.01"
                value={data.deliveryCharges}
                onChange={(e) =>
                  updateField("deliveryCharges", parseFloat(e.target.value) || 0)
                }
                placeholder="0"
                className="mt-1.5"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {config.footer.label}
        </h2>
        {config.footer.hint ? (
          <p className="text-xs text-muted-foreground mb-2">
            {config.footer.hint}
          </p>
        ) : null}
        <Textarea
          value={data.footerDescription}
          onChange={(e) => updateField("footerDescription", e.target.value)}
          placeholder={config.footer.placeholder}
          rows={config.footer.rows ?? 3}
        />
      </section>
    </div>
  );
}
