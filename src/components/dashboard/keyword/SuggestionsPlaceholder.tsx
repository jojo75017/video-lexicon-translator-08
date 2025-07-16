
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface SuggestionsPlaceholderProps {
  keyword: string;
  onGenerateClick: () => void;
}

const SuggestionsPlaceholder = ({ keyword, onGenerateClick }: SuggestionsPlaceholderProps) => {
  return (
    <Card className="p-6 border-dashed border-2 text-center">
      <Button 
        onClick={onGenerateClick}
        variant="outline"
        className="mx-auto flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Générer des suggestions pour "{keyword}"
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </Card>
  );
};

export default SuggestionsPlaceholder;
