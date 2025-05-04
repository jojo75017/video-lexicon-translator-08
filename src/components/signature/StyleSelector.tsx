
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface StyleTemplate {
  name: string;
  textColor: string;
  iconColor: string;
  separatorColor: string;
  font: string;
}

interface StyleSelectorProps {
  textColor: string;
  setTextColor: (value: string) => void;
  iconColor: string;
  setIconColor: (value: string) => void;
  separatorColor: string;
  setSeparatorColor: (value: string) => void;
  onSelectTemplate: (template: StyleTemplate) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  textColor,
  setTextColor,
  iconColor,
  setIconColor,
  separatorColor,
  setSeparatorColor,
  onSelectTemplate
}) => {
  // Templates prédéfinis
  const templates: StyleTemplate[] = [
    {
      name: "Bleu professionnel",
      textColor: "#1e293b",
      iconColor: "#2563eb",
      separatorColor: "#e2e8f0",
      font: "default"
    },
    {
      name: "Vert nature",
      textColor: "#1e3a1e",
      iconColor: "#16a34a",
      separatorColor: "#dcfce7",
      font: "default"
    },
    {
      name: "Élégant sombre",
      textColor: "#334155",
      iconColor: "#6366f1",
      separatorColor: "#f1f5f9",
      font: "font-playfair"
    },
    {
      name: "Orange créatif",
      textColor: "#422006",
      iconColor: "#f97316",
      separatorColor: "#ffedd5",
      font: "default"
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label>Modèles de style</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          {templates.map((template, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => onSelectTemplate(template)}
              className="h-auto py-2 px-3 flex flex-col items-center justify-center text-center"
              style={{ borderColor: template.iconColor }}
            >
              <div 
                className="w-4 h-4 rounded-full mb-1" 
                style={{ backgroundColor: template.iconColor }}
              ></div>
              <span className="text-xs">{template.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Couleur du texte</Label>
        <div className="flex gap-2 items-center mt-2">
          <Input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-12 h-8 p-1"
          />
          <Input
            type="text"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Couleur des icônes</Label>
        <div className="flex gap-2 items-center mt-2">
          <Input
            type="color"
            value={iconColor}
            onChange={(e) => setIconColor(e.target.value)}
            className="w-12 h-8 p-1"
          />
          <Input
            type="text"
            value={iconColor}
            onChange={(e) => setIconColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Couleur du séparateur</Label>
        <div className="flex gap-2 items-center mt-2">
          <Input
            type="color"
            value={separatorColor}
            onChange={(e) => setSeparatorColor(e.target.value)}
            className="w-12 h-8 p-1"
          />
          <Input
            type="text"
            value={separatorColor}
            onChange={(e) => setSeparatorColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default StyleSelector;
