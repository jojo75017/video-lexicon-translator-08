
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeywordSuggestion } from "@/types/seo";
import { Button } from "@/components/ui/button";
import { MessagesSquare } from "lucide-react";

interface KeywordStepProps {
  selectedKeyword: string;
  keywords: KeywordSuggestion[];
  onKeywordChange: (value: string) => void;
  onQuoraClick?: () => void;
}

const KeywordStep: React.FC<KeywordStepProps> = ({
  selectedKeyword,
  keywords,
  onKeywordChange,
  onQuoraClick,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Sélectionnez un mot-clé</Label>
        {onQuoraClick && (
          <Button
            onClick={onQuoraClick}
            variant="outline"
            className="gap-2"
          >
            <MessagesSquare className="h-4 w-4" />
            Réponses Quora
          </Button>
        )}
      </div>
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
