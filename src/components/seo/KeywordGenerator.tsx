import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Copy, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface KeywordSuggestion {
  keyword: string;
  volume?: number;
  competition?: number;
  cpc?: number;
  difficulty?: number;
  trend?: number[];
  type?: 'standard' | 'long-tail';
  selected?: boolean;
  relevance?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  searchVolume?: number;
  clicks?: number;
}

// Nouvelle fonction pour générer des suggestions basées sur le mot-clé de l'utilisateur
const generateKeywordSuggestions = (keyword: string): KeywordSuggestion[] => {
  // Bases des suggestions que nous allons personnaliser
  let suggestions: KeywordSuggestion[] = [];
  
  // Adapter les suggestions en fonction du thème détecté
  const keywordLowerCase = keyword.toLowerCase();
  
  // Mots-clés liés au voyage
  if (keywordLowerCase.includes('voyage') || 
      keywordLowerCase.includes('tourisme') || 
      keywordLowerCase.includes('visiter') ||
      keywordLowerCase.includes('destination') ||
      keywordLowerCase.includes('vacances')) {
    suggestions = [
      { 
        keyword: `${keyword} insolite`, 
        volume: Math.floor(Math.random() * 500) + 500, 
        competition: 0.3, 
        cpc: 1.2 + Math.random() 
      },
      { 
        keyword: `meilleur ${keyword}`, 
        volume: Math.floor(Math.random() * 700) + 800, 
        competition: 0.5, 
        cpc: 1.8 + Math.random() 
      },
      { 
        keyword: `${keyword} pas cher`, 
        volume: Math.floor(Math.random() * 1000) + 1000, 
        competition: 0.6, 
        cpc: 2.0 + Math.random() 
      },
      { 
        keyword: `${keyword} famille`,
        volume: Math.floor(Math.random() * 600) + 400, 
        competition: 0.4, 
        cpc: 1.5 + Math.random() 
      },
      { 
        keyword: `conseils ${keyword}`,
        volume: Math.floor(Math.random() * 400) + 300, 
        competition: 0.2, 
        cpc: 1.0 + Math.random() 
      }
    ];
  } 
  // Mots-clés liés à l'aquariophilie
  else if (keywordLowerCase.includes('aquari') || 
           keywordLowerCase.includes('poisson') || 
           keywordLowerCase.includes('betta') ||
           keywordLowerCase.includes('aquatique')) {
    suggestions = [
      { 
        keyword: `entretien ${keyword}`, 
        volume: Math.floor(Math.random() * 400) + 300, 
        competition: 0.2, 
        cpc: 0.8 + Math.random() 
      },
      { 
        keyword: `${keyword} débutant`, 
        volume: Math.floor(Math.random() * 600) + 500, 
        competition: 0.3, 
        cpc: 0.9 + Math.random() 
      },
      { 
        keyword: `meilleur ${keyword}`, 
        volume: Math.floor(Math.random() * 300) + 200, 
        competition: 0.4, 
        cpc: 1.1 + Math.random() 
      },
      { 
        keyword: `${keyword} prix`,
        volume: Math.floor(Math.random() * 500) + 400, 
        competition: 0.5, 
        cpc: 1.3 + Math.random() 
      },
      { 
        keyword: `alimentation ${keyword}`,
        volume: Math.floor(Math.random() * 350) + 250, 
        competition: 0.2, 
        cpc: 0.7 + Math.random() 
      }
    ];
  }
  // Autres mots-clés plus génériques
  else {
    suggestions = [
      { 
        keyword: `${keyword} guide`, 
        volume: Math.floor(Math.random() * 600) + 500, 
        competition: 0.3, 
        cpc: 1.0 + Math.random() 
      },
      { 
        keyword: `meilleur ${keyword}`, 
        volume: Math.floor(Math.random() * 800) + 700, 
        competition: 0.5, 
        cpc: 1.5 + Math.random() 
      },
      { 
        keyword: `${keyword} comparatif`, 
        volume: Math.floor(Math.random() * 500) + 400, 
        competition: 0.4, 
        cpc: 1.2 + Math.random() 
      },
      { 
        keyword: `${keyword} tutoriel`,
        volume: Math.floor(Math.random() * 400) + 300, 
        competition: 0.2, 
        cpc: 0.8 + Math.random() 
      },
      { 
        keyword: `conseils ${keyword}`,
        volume: Math.floor(Math.random() * 300) + 200, 
        competition: 0.3, 
        cpc: 0.9 + Math.random() 
      }
    ];
  }
  
  // Ajouter des attributs manquants aux suggestions
  return suggestions.map(suggestion => ({
    ...suggestion,
    difficulty: Math.floor(Math.random() * 70) + 10,
    relevance: Math.floor(Math.random() * 30) + 70,
  }));
};

interface KeywordGeneratorProps {
  onGenerateClick?: () => void;
  fieldValue?: string;
  onInsert?: (value: string) => void;
  maxLength?: number;
  descriptionValue?: string;
  onInsertDescription?: (value: string) => void;
  maxLengthDescription?: number;
}

const KeywordGenerator: React.FC<KeywordGeneratorProps> = ({
  onGenerateClick,
  fieldValue = "",
  onInsert,
  maxLength = 60,
  descriptionValue = "",
  onInsertDescription,
  maxLengthDescription = 155
}) => {
  const [keyword, setKeyword] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState(fieldValue);
  const [description, setDescription] = useState(descriptionValue);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(fieldValue);
  }, [fieldValue]);

  useEffect(() => {
    setDescription(descriptionValue);
  }, [descriptionValue]);

  const handleGenerate = async () => {
    if (!keyword) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedKeywords([]);

    // Simulate generating keywords
    const interval = setInterval(() => {
      setGenerationProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 10, 100);
        return newProgress;
      });
    }, 300);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    clearInterval(interval);
    setGenerationProgress(100);

    // Utiliser notre nouvelle fonction pour générer des suggestions pertinentes
    const mockKeywords = generateKeywordSuggestions(keyword);

    setGeneratedKeywords(mockKeywords);
    setIsGenerating(false);
    toast.success("Mots-clés générés avec succès!");
    
    if (onGenerateClick) {
      onGenerateClick();
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papiers!");
  };

  const handleInsertTitle = () => {
    if (onInsert) {
      onInsert(title);
      toast.success("Titre inséré avec succès!");
    }
  };

  const handleInsertDescription = () => {
    if (onInsertDescription) {
      onInsertDescription(description);
      toast.success("Description insérée avec succès!");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTitle(value);

    if (value.length > maxLength) {
      setTitleError(`Le titre ne doit pas dépasser ${maxLength} caractères.`);
    } else {
      setTitleError(null);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);

    if (value.length > maxLengthDescription) {
      setDescriptionError(`La description ne doit pas dépasser ${maxLengthDescription} caractères.`);
    } else {
      setDescriptionError(null);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        Générateur de Mots-clés
      </h3>
      <p className="text-gray-500">
        Entrez un mot-clé principal pour générer des suggestions de mots-clés pertinents.
      </p>

      <div className="flex items-center space-x-3">
        <Input
          type="text"
          placeholder="Mot-clé principal"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "Génération..." : "Générer"}
        </Button>
      </div>

      {generationProgress > 0 && (
        <Progress 
          value={generationProgress} 
          className="h-2 mt-2"
        />
      )}

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="title">Titre SEO ({title ? title.length : 0}/{maxLength})</Label>
        <Textarea
          id="title"
          placeholder="Entrez votre titre SEO"
          value={title || ""}
          onChange={handleTitleChange}
          className="resize-none"
          maxLength={maxLength}
        />
        {titleError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{titleError}</AlertDescription>
          </Alert>
        )}
        <Button size="sm" onClick={handleInsertTitle} disabled={!title || !!titleError}>
          Insérer le titre
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description SEO ({description ? description.length : 0}/{maxLengthDescription})</Label>
        <Textarea
          id="description"
          placeholder="Entrez votre description SEO"
          value={description || ""}
          onChange={handleDescriptionChange}
          className="resize-none"
          maxLength={maxLengthDescription}
        />
        {descriptionError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{descriptionError}</AlertDescription>
          </Alert>
        )}
        <Button size="sm" onClick={handleInsertDescription} disabled={!description || !!descriptionError}>
          Insérer la description
        </Button>
      </div>

      {generatedKeywords.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold">Suggestions de mots-clés:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {generatedKeywords.map((keyword, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md flex items-center justify-between">
                <span>{keyword.keyword}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopyToClipboard(keyword.keyword)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default KeywordGenerator;
