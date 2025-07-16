
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

export interface StyleTemplate {
  id: string;
  name: string;
  textColor: string;
  iconColor: string;
  separatorColor: string;
  font: string;
}

const templates: StyleTemplate[] = [
  {
    id: "modern",
    name: "Moderne",
    textColor: "#1e293b",
    iconColor: "#2563eb",
    separatorColor: "#e2e8f0",
    font: "font-sans"
  },
  {
    id: "elegant",
    name: "Élégant",
    textColor: "#334155",
    iconColor: "#6d28d9",
    separatorColor: "#e2e8f0",
    font: "font-playfair"
  },
  {
    id: "minimal",
    name: "Minimaliste",
    textColor: "#111827",
    iconColor: "#4b5563",
    separatorColor: "#e5e7eb",
    font: "font-sans"
  },
  {
    id: "corporate",
    name: "Corporate",
    textColor: "#0f172a",
    iconColor: "#0284c7",
    separatorColor: "#cbd5e1",
    font: "font-sans"
  },
  {
    id: "creative",
    name: "Créatif",
    textColor: "#4b5563",
    iconColor: "#ec4899",
    separatorColor: "#f3e8ff",
    font: "font-playfair"
  }
];

interface StyleSelectorProps {
  onSelectTemplate: (template: StyleTemplate) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ onSelectTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = React.useState("modern");

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onSelectTemplate(template);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Style de la signature</h3>
      <RadioGroup
        value={selectedTemplate}
        onValueChange={handleTemplateChange}
        className="grid grid-cols-2 gap-4"
      >
        {templates.map((template) => (
          <div key={template.id} className="relative">
            <RadioGroupItem
              value={template.id}
              id={template.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={template.id}
              className={`
                flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4
                hover:bg-accent hover:text-accent-foreground
                peer-data-[state=checked]:border-primary
                cursor-pointer
              `}
            >
              <div 
                className="w-full h-6 mb-2 rounded" 
                style={{ backgroundColor: template.iconColor }}
              />
              <span>{template.name}</span>
              <div className="absolute top-2 right-2 opacity-0 peer-data-[state=checked]:opacity-100">
                <Check className="h-4 w-4" />
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default StyleSelector;
