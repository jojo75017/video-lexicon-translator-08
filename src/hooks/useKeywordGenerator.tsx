
import { useState } from 'react';
import { KeywordSuggestion } from '@/types/seo';
import { toast } from 'sonner';

const useKeywordGenerator = () => {
  // État pour le mot-clé de recherche
  const [keyword, setKeyword] = useState('');
  // État pour le titre
  const [title, setTitle] = useState('');
  // État pour la description
  const [description, setDescription] = useState('');
  // État pour les suggestions générées
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState('title');
  // État pour indiquer si une génération est en cours
  const [isGenerating, setIsGenerating] = useState(false);

  // Fonction pour générer des suggestions
  const generateSuggestions = async () => {
    if (!keyword.trim()) {
      toast.warning("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);

    try {
      // Simulation d'une génération de suggestions
      setTimeout(() => {
        const mockSuggestions: KeywordSuggestion[] = [
          {
            keyword: `Meilleur ${keyword} pour débutants`,
            volume: 2400,
            difficulty: 45,
            relevance: 95
          },
          {
            keyword: `Comment choisir un ${keyword}`,
            volume: 1800,
            difficulty: 30,
            relevance: 90
          },
          {
            keyword: `${keyword} pas cher`,
            volume: 3200,
            difficulty: 60,
            relevance: 85
          },
          {
            keyword: `${keyword} professionnel`,
            volume: 1200,
            difficulty: 55,
            relevance: 80
          },
        ];

        setGeneratedKeywords(mockSuggestions);
        setIsGenerating(false);
        toast.success("Suggestions générées avec succès");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la génération des suggestions:", error);
      toast.error("Erreur lors de la génération des suggestions");
      setIsGenerating(false);
    }
  };

  // Fonction pour insérer une suggestion dans le titre
  const handleInsertTitle = (suggestion: string) => {
    setTitle(suggestion);
    toast.success("Titre mis à jour");
  };

  // Fonction pour insérer une suggestion dans la description
  const handleInsertDescription = (suggestion: string) => {
    setDescription(suggestion);
    toast.success("Description mise à jour");
  };

  return {
    keyword,
    setKeyword,
    title,
    setTitle,
    description,
    setDescription,
    generatedKeywords,
    activeTab,
    setActiveTab,
    isGenerating,
    generateSuggestions,
    handleInsertTitle,
    handleInsertDescription
  };
};

export default useKeywordGenerator;
