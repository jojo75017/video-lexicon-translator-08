
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlignLeft, Search, RefreshCw, Key } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeKeywords, generateKeywordSuggestions } from '@/utils/seo/keywordAnalyzer';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import { KeywordSuggestion } from '@/types/seo';
import { generateSeoTitle } from '@/utils/seo/generators/titleGenerator';
import { generateSeoDescription } from '@/utils/seo/generators/descriptionGenerator';

const KeywordTabContent = () => {
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [openAIKey, setOpenAIKey] = useState(localStorage.getItem('openai_key') || '');
  const [useAI, setUseAI] = useState(!!localStorage.getItem('openai_key'));

  // Génère le titre et la meta description lorsqu'un mot-clé est entré
  useEffect(() => {
    if (keyword.trim().length > 3) {
      generateSuggestion();
    }
  }, [keyword]);

  const generateWithOpenAI = async (keyword: string) => {
    if (!openAIKey) return null;
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Tu es un expert SEO spécialisé dans la création de balises title et meta description optimisées. Les titres doivent faire exactement 60 caractères et les descriptions exactement 155 caractères."
            },
            {
              role: "user",
              content: `Crée une balise title et une meta description pour le mot-clé: "${keyword}". Réponds uniquement sous forme d'objet JSON avec les propriétés "title" et "description". Le title doit faire exactement 60 caractères et la description exactement 155 caractères.`
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error("Erreur OpenAI:", data.error);
        toast.error("Erreur lors de la génération avec OpenAI");
        return null;
      }
      
      try {
        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        const parsed = JSON.parse(jsonString);
        
        if (parsed.title && parsed.description) {
          return parsed;
        } else {
          return null;
        }
      } catch (e) {
        console.error("Erreur de parsing JSON:", e);
        return null;
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      toast.error("Erreur de connexion à l'API OpenAI");
      return null;
    }
  };

  const generateSuggestion = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez d'abord entrer un mot-clé");
      return;
    }

    setIsGenerating(true);

    let generatedTitle = '';
    let generatedDescription = '';

    // Utiliser OpenAI si la clé est disponible et l'option activée
    if (useAI && openAIKey) {
      const aiResult = await generateWithOpenAI(keyword);
      
      if (aiResult) {
        generatedTitle = aiResult.title;
        generatedDescription = aiResult.description;
      } else {
        // Fallback to local generation if AI fails
        generatedTitle = generateSeoTitle(keyword);
        generatedDescription = generateSeoDescription(keyword);
      }
    } else {
      // Utiliser la génération locale
      generatedTitle = generateSeoTitle(keyword);
      generatedDescription = generateSeoDescription(keyword);
    }

    setTitle(generatedTitle);
    setMetaDescription(generatedDescription);

    // Simulation d'une analyse de mots-clés basée sur le mot entré
    const keywordAnalysis = analyzeKeywords(`Contenu exemple ${keyword} pour analyse. ${keyword} est un mot-clé important pour le référencement.`);
    
    // Génération de suggestions basées sur l'analyse
    const suggestions = generateKeywordSuggestions(keywordAnalysis);
    
    // Mise à jour des suggestions avec les titres et descriptions générés
    if (suggestions.length > 0) {
      // Pour chaque suggestion, générer un titre et une description spécifiques
      const updatedSuggestions = await Promise.all(
        suggestions.map(async (suggestion) => {
          let suggestedTitle, suggestedDescription;
          
          if (useAI && openAIKey) {
            const aiResult = await generateWithOpenAI(suggestion.keyword);
            if (aiResult) {
              suggestedTitle = aiResult.title;
              suggestedDescription = aiResult.description;
            } else {
              suggestedTitle = generateSeoTitle(suggestion.keyword);
              suggestedDescription = generateSeoDescription(suggestion.keyword);
            }
          } else {
            suggestedTitle = generateSeoTitle(suggestion.keyword);
            suggestedDescription = generateSeoDescription(suggestion.keyword);
          }
          
          return {
            ...suggestion,
            suggestedTitle,
            suggestedDescription
          };
        })
      );
      
      setGeneratedKeywords(updatedSuggestions);
    }

    setIsGenerating(false);
    toast.success("Suggestions générées avec succès");
  };

  const handleGenerateMore = () => {
    generateSuggestion();
  };

  const saveOpenAIKey = () => {
    if (openAIKey) {
      localStorage.setItem('openai_key', openAIKey);
      setUseAI(true);
      toast.success("Clé OpenAI sauvegardée");
    } else {
      localStorage.removeItem('openai_key');
      setUseAI(false);
      toast.info("Génération locale activée");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <label htmlFor="openai-key" className="text-sm font-medium leading-none flex items-center gap-2">
              <Key className="h-4 w-4" />
              Clé API OpenAI (optionnelle)
            </label>
            <div className="flex gap-2">
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-..."
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={saveOpenAIKey}
                variant="outline"
              >
                Sauvegarder
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {useAI 
                ? "OpenAI sera utilisé pour générer des titres et descriptions plus variés" 
                : "Utilisation du générateur local (titres et descriptions moins variés)"}
            </p>
          </div>

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
              <Badge variant={title.length !== 60 ? "destructive" : "secondary"}>
                {title.length}/60
              </Badge>
            </div>
            <Input
              id="title"
              placeholder="Entrez votre titre (exactement 60 caractères)"
              value={title}
              onChange={(e) => {
                const newTitle = e.target.value.slice(0, 60); // Limit to 60 characters
                setTitle(newTitle);
              }}
              className={title.length !== 60 ? "border-red-500" : ""}
            />
            {title.length !== 60 && (
              <p className="text-xs text-red-500">
                Le titre doit faire exactement 60 caractères (actuellement {title.length})
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="metaDescription" className="text-sm font-medium leading-none flex items-center gap-2">
                <AlignLeft className="h-4 w-4" />
                Meta Description
              </label>
              <Badge variant={(metaDescription.length < 150 || metaDescription.length > 155) ? "destructive" : "secondary"}>
                {metaDescription.length}/155
              </Badge>
            </div>
            <Textarea
              id="metaDescription"
              placeholder="Entrez votre meta description (entre 150 et 155 caractères)"
              value={metaDescription}
              onChange={(e) => {
                const newDescription = e.target.value.slice(0, 155); // Limit to 155 characters
                setMetaDescription(newDescription);
              }}
              className={(metaDescription.length < 150 || metaDescription.length > 155) ? "border-red-500" : ""}
              rows={4}
            />
            {(metaDescription.length < 150 || metaDescription.length > 155) && (
              <p className="text-xs text-red-500">
                {metaDescription.length < 150 
                  ? `La description doit faire au moins 150 caractères (actuellement ${metaDescription.length})` 
                  : `La description dépasse 155 caractères (actuellement ${metaDescription.length})`}
              </p>
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
