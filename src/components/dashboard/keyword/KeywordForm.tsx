
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";

interface KeywordFormProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  isGenerating: boolean;
  onGenerateClick: () => void;
}

const KeywordForm = ({ keyword, setKeyword, isGenerating, onGenerateClick }: KeywordFormProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-2">
      <div className="flex-1 min-w-[300px]">
        <label className="block text-sm font-medium mb-1">Mot-clé principal</label>
        <div className="flex gap-2">
          <Input 
            placeholder="Entrez votre mot-clé cible"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1"
            disabled={isGenerating}
          />
          <Button 
            onClick={onGenerateClick} 
            disabled={isGenerating || !keyword.trim()} 
            className="whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Générer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeywordForm;
