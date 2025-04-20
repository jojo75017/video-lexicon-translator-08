import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlignLeft, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeKeywords, generateKeywordSuggestions } from '@/utils/seo/keywordAnalyzer';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import { KeywordSuggestion } from '@/types/seo';

const KeywordTabContent = () => {
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);

  // Génère le titre et la meta description lorsqu'un mot-clé est entré
  useEffect(() => {
    if (keyword.trim().length > 3) {
      generateSuggestion();
    }
  }, [keyword]);

  const generateSuggestion = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez d'abord entrer un mot-clé");
      return;
    }

    setIsGenerating(true);

    // Simulation d'une analyse de mots-clés basée sur le mot entré
    const keywordAnalysis = analyzeKeywords(`Contenu exemple ${keyword} pour analyse. ${keyword} est un mot-clé important pour le référencement.`);
    
    // Génération de suggestions basées sur l'analyse
    const suggestions = generateKeywordSuggestions(keywordAnalysis);
    setGeneratedKeywords(suggestions);

    // Utilisation de la première suggestion pour remplir le titre et la description
    if (suggestions.length > 0) {
      // Prendre la première suggestion
      const mainSuggestion = suggestions[0];
      setTitle(mainSuggestion.suggestedTitle || '');
      setMetaDescription(mainSuggestion.suggestedDescription || '');
    }

    setIsGenerating(false);
    toast.success("Suggestions générées avec succès");
  };

  const handleGenerateMore = () => {
    generateSuggestion();
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Optimisation des mots-clés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="keyword" className="text-sm font-medium leading-none flex items-center gap-2">
              <Search className="h-4 w-4" />
              Mot-clé principal
            </label>
            <div className="flex gap-2">
              <Input
                id="keyword"
                placeholder="Entrez votre mot-clé principal"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={generateSuggestion} 
                disabled={isGenerating || !keyword.trim()}
                variant="outline"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  "Générer"
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Entrez un mot-clé pour générer automatiquement un titre et une meta description optimisés
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="title" className="text-sm font-medium leading-none flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Balise Title
              </label>
              <Badge variant={title.length > 31 ? "destructive" : "secondary"}>
                {title.length}/31
              </Badge>
            </div>
            <Input
              id="title"
              placeholder="Entrez votre titre (max 31 caractères)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={title.length > 31 ? "border-red-500" : ""}
            />
            {title.length > 31 && (
              <p className="text-xs text-red-500">Le titre dépasse la limite de 31 caractères</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="metaDescription" className="text-sm font-medium leading-none flex items-center gap-2">
                <AlignLeft className="h-4 w-4" />
                Meta Description
              </label>
              <Badge variant={metaDescription.length > 145 ? "destructive" : "secondary"}>
                {metaDescription.length}/145
              </Badge>
            </div>
            <Textarea
              id="metaDescription"
              placeholder="Entrez votre meta description (max 145 caractères)"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className={metaDescription.length > 145 ? "border-red-500" : ""}
              rows={4}
            />
            {metaDescription.length > 145 && (
              <p className="text-xs text-red-500">La description dépasse la limite de 145 caractères</p>
            )}
          </div>
        </CardContent>
      </Card>

      <KeywordSuggestions 
        generatedKeywords={generatedKeywords} 
        onGenerateClick={handleGenerateMore} 
      />
    </div>
  );
};

export default KeywordTabContent;
