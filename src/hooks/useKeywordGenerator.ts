
import { useState } from 'react';
import { toast } from "sonner";
import { KeywordSuggestion } from '@/types/seo';
import { OpenAIService } from '@/utils/seo/openaiService';
import { generateSeoDescription } from '@/utils/seo/generators/descriptionGenerator';

export const useKeywordGenerator = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<string>('title');

  const generateSuggestions = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez saisir un mot-clé");
      return;
    }

    setIsGenerating(true);

    try {
      // Vérifier si une clé API est disponible
      const hasApiKey = localStorage.getItem('openaiKey');
      
      if (!hasApiKey) {
        toast.warning("Clé API non configurée", {
          description: "Les suggestions seront limitées. Configurez une clé API pour de meilleurs résultats."
        });
      }

      // Activer le proxy CORS
      OpenAIService.enableProxy();

      // Génération de suggestions adaptées au contexte du mot-clé
      setTimeout(() => {
        // Génération de suggestions fictives pour la démo
        const mockSuggestions: KeywordSuggestion[] = [
          {
            keyword: keyword,
            searchVolume: Math.floor(Math.random() * 5000) + 1000,
            difficulty: Math.floor(Math.random() * 100),
            cpc: Math.random() * 5,
            competition: Math.random(),
            relevance: 90,
            suggestedTitle: `${keyword} - Guide Complet et Conseils | Expert 2024`,
            suggestedDescription: generateSeoDescription(keyword, 155),
            suggestedShortDescription: generateSeoDescription(keyword, 120),
            suggestedLongDescription: generateSeoDescription(keyword, 500)
          },
          {
            keyword: keyword.includes("à") ? 
              `${keyword.split(" à ")[0]} à l'étranger` : 
              `${keyword} en ligne`,
            searchVolume: Math.floor(Math.random() * 3000) + 500,
            difficulty: Math.floor(Math.random() * 100),
            cpc: Math.random() * 4,
            competition: Math.random(),
            relevance: 75,
            suggestedTitle: `${keyword.includes("à") ? 
              `${keyword.split(" à ")[0]} à l'étranger` : 
              `${keyword} en ligne`} - Solutions et Stratégies | Guide 2024`,
            suggestedDescription: generateSeoDescription(
              keyword.includes("à") ? 
              `${keyword.split(" à ")[0]} à l'étranger` : 
              `${keyword} en ligne`, 
              155),
            suggestedShortDescription: generateSeoDescription(
              keyword.includes("à") ? 
              `${keyword.split(" à ")[0]} à l'étranger` : 
              `${keyword} en ligne`, 
              120),
            suggestedLongDescription: generateSeoDescription(
              keyword.includes("à") ? 
              `${keyword.split(" à ")[0]} à l'étranger` : 
              `${keyword} en ligne`, 
              500)
          },
          {
            keyword: `meilleur ${keyword}`,
            searchVolume: Math.floor(Math.random() * 2000) + 300,
            difficulty: Math.floor(Math.random() * 100),
            cpc: Math.random() * 6,
            competition: Math.random(),
            relevance: 85,
            suggestedTitle: `Meilleur ${keyword} - Comparatif Complet | Choix 2024`,
            suggestedDescription: generateSeoDescription(`meilleur ${keyword}`, 155),
            suggestedShortDescription: generateSeoDescription(`meilleur ${keyword}`, 120),
            suggestedLongDescription: generateSeoDescription(`meilleur ${keyword}`, 500)
          }
        ];

        setGeneratedKeywords(mockSuggestions);
        
        // Utiliser notre générateur amélioré pour le titre et la description initiale
        setTitle(mockSuggestions[0].suggestedTitle || '');
        setDescription(mockSuggestions[0].suggestedDescription || '');
        setIsGenerating(false);

        toast.success("Suggestions générées", {
          description: "Découvrez les titres et descriptions optimisés pour votre mot-clé"
        });
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la génération des suggestions:", error);
      setIsGenerating(false);
      toast.error("Erreur de génération", {
        description: "Un problème est survenu. Veuillez réessayer plus tard."
      });
    }
  };

  const handleInsertTitle = (newTitle: string) => {
    setTitle(newTitle);
    setActiveTab('title');
  };

  const handleInsertDescription = (newDescription: string) => {
    setDescription(newDescription);
    setActiveTab('description');
  };

  return {
    keyword,
    setKeyword,
    isGenerating,
    title,
    setTitle,
    description,
    setDescription,
    generatedKeywords,
    activeTab,
    setActiveTab,
    generateSuggestions,
    handleInsertTitle,
    handleInsertDescription
  };
};

export default useKeywordGenerator;
