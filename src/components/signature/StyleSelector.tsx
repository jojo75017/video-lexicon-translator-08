
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StyleSelectorProps {
  textColor: string;
  setTextColor: (color: string) => void;
  iconColor: string;
  setIconColor: (color: string) => void;
  separatorColor: string;
  setSeparatorColor: (color: string) => void;
  onSelectTemplate: (template: StyleTemplate) => void;
}

export interface StyleTemplate {
  name: string;
  textColor: string;
  iconColor: string;
  separatorColor: string;
  font: string;
}

const templates: StyleTemplate[] = [
  {
    name: "Moderne",
    textColor: "#2563eb",
    iconColor: "#3b82f6",
    separatorColor: "#e2e8f0",
    font: "font-sans"
  },
  {
    name: "Classique",
    textColor: "#1e293b",
    iconColor: "#475569",
    separatorColor: "#94a3b8",
    font: "font-serif"
  },
  {
    name: "Créatif",
    textColor: "#9333ea",
    iconColor: "#a855f7",
    separatorColor: "#f3e8ff",
    font: "font-playfair"
  },
  {
    name: "Minimaliste",
    textColor: "#18181b",
    iconColor: "#52525b",
    separatorColor: "#e4e4e7",
    font: "font-sans"
  },
  {
    name: "Coloré",
    textColor: "#f97316",
    iconColor: "#f59e0b",
    separatorColor: "#fef3c7",
    font: "font-sans"
  }
];

// Définition des couleurs de fond pour chaque template
const templateColors: Record<string, string> = {
  "Moderne": "bg-blue-500 hover:bg-blue-600 text-white",
  "Classique": "bg-slate-700 hover:bg-slate-800 text-white",
  "Créatif": "bg-purple-500 hover:bg-purple-600 text-white",
  "Minimaliste": "bg-zinc-800 hover:bg-zinc-900 text-white",
  "Coloré": "bg-orange-500 hover:bg-orange-600 text-white",
};

const StyleSelector = ({
  textColor,
  setTextColor,
  iconColor,
  setIconColor,
  separatorColor,
  setSeparatorColor,
  onSelectTemplate
}: StyleSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Templates</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {templates.map((template) => (
            <Button
              key={template.name}
              variant="default"
              className={`h-auto py-3 shadow-md transition-all duration-200 ${templateColors[template.name]}`}
              onClick={() => onSelectTemplate(template)}
            >
              <span className="font-medium">{template.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Couleurs personnalisées</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="textColor" className="text-xs">Texte</Label>
            <div className="flex items-center gap-2">
              <Input
                id="textColor"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-8 p-0"
              />
              <span className="text-sm">{textColor}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="iconColor" className="text-xs">Icônes</Label>
            <div className="flex items-center gap-2">
              <Input
                id="iconColor"
                type="color"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value)}
                className="w-12 h-8 p-0"
              />
              <span className="text-sm">{iconColor}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="separatorColor" className="text-xs">Séparateur</Label>
            <div className="flex items-center gap-2">
              <Input
                id="separatorColor"
                type="color"
                value={separatorColor}
                onChange={(e) => setSeparatorColor(e.target.value)}
                className="w-12 h-8 p-0"
              />
              <span className="text-sm">{separatorColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleSelector;
