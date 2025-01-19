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
  return (
    <Select onValueChange={onLanguageChange} defaultValue="en">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Spanish</SelectItem>
        <SelectItem value="fr">French</SelectItem>
        <SelectItem value="de">German</SelectItem>
        <SelectItem value="it">Italian</SelectItem>
        <SelectItem value="pt">Portuguese</SelectItem>
        <SelectItem value="ru">Russian</SelectItem>
        <SelectItem value="zh">Chinese</SelectItem>
        <SelectItem value="ja">Japanese</SelectItem>
        <SelectItem value="ko">Korean</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;