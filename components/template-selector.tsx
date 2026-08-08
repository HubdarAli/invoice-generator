"use client";

import { cn } from "@/lib/utils";
import type { TemplateType } from "@/lib/invoice-types";

interface TemplateSelectorProps {
  selected: TemplateType;
  onSelect: (template: TemplateType) => void;
}

const templates: { id: TemplateType; name: string; description: string }[] = [
  {
    id: "modern",
    name: "Modern Minimal",
    description: "Clean and professional",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and colorful",
  },
  {
    id: "restaurant",
    name: "Sale Invoice",
    description: "Restaurant POS receipt",
  },
  {
    id: "sale-receipt",
    name: "Sale Receipt",
    description: "POS receipt with bordered ticket",
  },
  {
    id: "thermal-pos",
    name: "Thermal POS",
    description: "Dot-matrix restaurant receipt",
  },
  {
    id: "home-delivery",
    name: "Home Delivery",
    description: "Delivery slip with item table",
  },
  {
    id: "customer-bill",
    name: "Customer Bill",
    description: "Dine-in POS customer bill",
  },
];

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={cn(
            "flex-1 px-4 py-3 rounded-lg border-2 text-left transition-all",
            selected === template.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <span className="block font-medium text-foreground">
            {template.name}
          </span>
          <span className="block text-xs text-muted-foreground mt-0.5">
            {template.description}
          </span>
        </button>
      ))}
    </div>
  );
}
