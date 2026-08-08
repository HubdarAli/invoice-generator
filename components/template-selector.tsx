"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  const [open, setOpen] = useState(false);
  const current = templates.find((template) => template.id === selected);

  const handleSelect = (templateId: TemplateType) => {
    onSelect(templateId);
    setOpen(false);
  };

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-lg border border-border bg-muted/30 overflow-hidden"
    >
      <CollapsibleTrigger className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/50 rounded-lg">
        <div className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">
            Choose Template
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground leading-snug truncate">
            {current?.name ?? "Pick a layout"}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden px-3 pb-3">
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {templates.map((template) => {
            const isSelected = selected === template.id;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelect(template.id)}
                title={`${template.name} — ${template.description}`}
                className={cn(
                  "relative rounded-md border px-2 py-1.5 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
                )}
              >
                {isSelected ? (
                  <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-1.5 w-1.5" strokeWidth={3} />
                  </span>
                ) : null}
                <span className="block text-[11px] font-medium leading-tight text-foreground pr-3 line-clamp-2">
                  {template.name}
                </span>
              </button>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
