
import React, { useState, useEffect } from 'react';
import { KeywordSuggestion } from '@/types/seo';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OpenAIService } from '@/utils/seo/openaiService';

const KeywordTabContent = () => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleGenerateKeywords = async () => {
    if (!keyword) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = localStorage.getItem('openaiKey');
      if (!apiKey) {
        toast.error("Clé API OpenAI manquante", {
          description: "Veuillez configurer votre clé API dans les paramètres"
        });
        return;
      }

      const openAIService = new OpenAIService(apiKey);
      const results = await openAIService.getKeywordSuggestions(keyword);
      setSuggestions(results);
      console.log("Suggestions générées:", results);
      toast.success("Suggestions générées avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast.error("Erreur de génération", {
        description: "Impossible de générer des suggestions pour ce mot-clé. Vérifiez votre clé API et votre connexion."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertTitle = (value: string) => {
    setTitle(value);
    toast.success("Titre inséré");
  };

  const handleInsertDescription = (value: string) => {
    setDescription(value);
    toast.success("Description insérée");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Entrez votre mot-clé principal"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleGenerateKeywords}
          disabled={isLoading}
        >
          {isLoading ? "Génération..." : "Générer"}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <KeywordSuggestions
          generatedKeywords={suggestions}
          onGenerateClick={handleGenerateKeywords}
          fieldValue={title}
          onInsert={handleInsertTitle}
          maxLength={60}
          descriptionValue={description}
          onInsertDescription={handleInsertDescription}
          maxLengthDescription={155}
          descriptionType="short"
        />
      )}
    </div>
  );
};

export default KeywordTabContent;
