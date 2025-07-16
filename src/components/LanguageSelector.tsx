import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const handleLanguageChange = (value: string) => {
    console.log("Langue sélectionnée:", value); // Pour le débogage
    onLanguageChange(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Choisir la langue</label>
      <Select onValueChange={handleLanguageChange} defaultValue="fr">
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sélectionner une langue" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="en">Anglais</SelectItem>
          <SelectItem value="es">Espagnol</SelectItem>
          <SelectItem value="de">Allemand</SelectItem>
          <SelectItem value="it">Italien</SelectItem>
          <SelectItem value="pt">Portugais</SelectItem>
          <SelectItem value="ru">Russe</SelectItem>
          <SelectItem value="zh">Chinois</SelectItem>
          <SelectItem value="ja">Japonais</SelectItem>
          <SelectItem value="ko">Coréen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;