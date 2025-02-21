
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeywordSuggestion } from "@/types/seo";

interface KeywordStepProps {
  selectedKeyword: string;
  keywords: KeywordSuggestion[];
  onKeywordChange: (value: string) => void;
}

const KeywordStep: React.FC<KeywordStepProps> = ({
  selectedKeyword,
  keywords,
  onKeywordChange,
}) => {
  return (
    <div className="space-y-4">
      <Label>Sélectionnez un mot-clé</Label>
      <Select value={selectedKeyword} onValueChange={onKeywordChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choisissez un mot-clé" />
        </SelectTrigger>
        <SelectContent>
          {keywords.map((kw, index) => (
            <SelectItem key={index} value={kw.keyword}>
              {kw.keyword} (Volume: {kw.searchVolume || 0})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default KeywordStep;
