
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface KeywordExpansionProps {
  mainKeyword: string;
  onKeywordsGenerated: (keywords: string[]) => void;
}

const KeywordExpansion: React.FC<KeywordExpansionProps> = ({ 
  mainKeyword, 
  onKeywordsGenerated 
}) => {
  const [seedKeyword, setSeedKeyword] = useState(mainKeyword);
  const [expandedKeywords, setExpandedKeywords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExpansions = async () => {
    if (!seedKeyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const expansions = [
        `${seedKeyword} gratuit`,
        `${seedKeyword} en ligne`,
        `${seedKeyword} pas cher`,
        `meilleur ${seedKeyword}`,
        `${seedKeyword} professionnel`,
        `${seedKeyword} rapide`,
        `guide ${seedKeyword}`,
        `tutoriel ${seedKeyword}`,
        `astuce ${seedKeyword}`,
        `conseil ${seedKeyword}`
      ];
      
      setExpandedKeywords(expansions);
      onKeywordsGenerated(expansions);
      setIsGenerating(false);
      toast.success(`${expansions.length} variantes générées`);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Extension de mots-clés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Mot-clé à étendre..."
            value={seedKeyword}
            onChange={(e) => setSeedKeyword(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={generateExpansions}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>Génération...</>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Étendre
              </>
            )}
          </Button>
        </div>

        {expandedKeywords.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Variantes générées :</h4>
            <div className="flex flex-wrap gap-2">
              {expandedKeywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    navigator.clipboard.writeText(keyword);
                    toast.success("Mot-clé copié");
                  }}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordExpansion;
