
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface LanguageStepProps {
  language: string;
  wordCount: number;
  onLanguageChange: (value: string) => void;
  onWordCountChange: (value: number) => void;
}

const LanguageStep: React.FC<LanguageStepProps> = ({
  language,
  wordCount,
  onLanguageChange,
  onWordCountChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="language">Langue</Label>
        <div className="flex items-center mt-2 space-x-2">
          <Languages className="h-4 w-4" />
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Choisissez une langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="wordCount">Nombre de mots souhaité</Label>
        <Input
          id="wordCount"
          type="number"
          min="100"
          max="2000"
          step="100"
          value={wordCount}
          onChange={(e) => onWordCountChange(Number(e.target.value))}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default LanguageStep;
