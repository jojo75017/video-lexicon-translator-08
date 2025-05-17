
import { useState } from 'react';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';

const useKeywordGenerator = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [language, setLanguage] = useState<string>('fr');
  const [results, setResults] = useState<KeywordSuggestion[]>([]);
  const [favorites, setFavorites] = useState<KeywordSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('title');
  
  // États pour le title et la description
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);

  // Fonction pour générer des suggestions de mots-clés
  const generateSuggestions = async () => {
    if (!keyword || keyword.trim() === '') {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simule un appel API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Génère des suggestions fictives
      const mockKeywords: KeywordSuggestion[] = [
        {
          keyword: keyword,
          volume: 8500,
          difficulty: 62,
          relevance: 95,
          cpc: 1.25,
          competition: 0.75,
          suggestedTitle: `${keyword} - Guide complet et conseils`,
          suggestedDescription: `Découvrez tout ce que vous devez savoir sur ${keyword}. Conseils d'experts, astuces et stratégies pour optimiser vos résultats.`
        },
        {
          keyword: `meilleur ${keyword}`,
          volume: 5200,
          difficulty: 58,
          relevance: 85,
          cpc: 1.85,
          competition: 0.82,
          suggestedTitle: `Top 10 des meilleurs ${keyword} - Comparatif complet`,
          suggestedDescription: `Notre comparatif des meilleurs ${keyword} pour vous aider à faire le bon choix. Analyses détaillées et avis d'experts.`
        },
        {
          keyword: `comment ${keyword}`,
          volume: 4800,
          difficulty: 45,
          relevance: 90,
          cpc: 0.95,
          competition: 0.65,
          suggestedTitle: `Comment optimiser votre ${keyword} - Guide étape par étape`,
          suggestedDescription: `Apprenez comment améliorer votre ${keyword} avec notre guide pratique. Techniques prouvées et stratégies efficaces.`
        },
        {
          keyword: `${keyword} professionnel`,
          volume: 3200,
          difficulty: 55,
          relevance: 80,
          cpc: 2.15,
          competition: 0.68,
          suggestedTitle: `${keyword} professionnel - Secrets et stratégies avancées`,
          suggestedDescription: `Élevez votre ${keyword} au niveau professionnel. Découvrez les techniques avancées utilisées par les experts du secteur.`
        },
        {
          keyword: `tutoriel ${keyword}`,
          volume: 2900,
          difficulty: 42,
          relevance: 85,
          cpc: 0.85,
          competition: 0.55,
          suggestedTitle: `Tutoriel ${keyword} - De débutant à expert`,
          suggestedDescription: `Notre tutoriel complet sur le ${keyword} vous guidera pas à pas. Parfait pour débutants et utilisateurs avancés.`
        }
      ];
      
      setGeneratedKeywords(mockKeywords);
      setResults(mockKeywords);
      
      toast.success('Suggestions générées avec succès!');
    } catch (error) {
      toast.error('Erreur lors de la génération des suggestions');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFavorite = (keyword: KeywordSuggestion) => {
    const isAlreadyFavorite = favorites.some(fav => fav.keyword === keyword.keyword);
    
    if (isAlreadyFavorite) {
      setFavorites(favorites.filter(fav => fav.keyword !== keyword.keyword));
      toast.info(`"${keyword.keyword}" retiré des favoris`);
    } else {
      setFavorites([...favorites, keyword]);
      toast.success(`"${keyword.keyword}" ajouté aux favoris`);
    }
  };

  const isFavorite = (keyword: string): boolean => {
    return favorites.some(fav => fav.keyword === keyword);
  };

  const getAllKeywords = (): KeywordSuggestion[] => {
    return [...results];
  };

  const handleInsertTitle = (value: string) => {
    setTitle(value);
    toast.success("Titre mis à jour!");
  };
  
  const handleInsertDescription = (value: string) => {
    setDescription(value);
    toast.success("Description mise à jour!");
  };

  return {
    keyword,
    setKeyword,
    language,
    setLanguage,
    results,
    favorites,
    isGenerating,
    generateSuggestions,
    toggleFavorite,
    isFavorite,
    activeTab,
    setActiveTab,
    title,
    setTitle,
    description,
    setDescription,
    generatedKeywords,
    handleInsertTitle,
    handleInsertDescription,
    getAllKeywords
  };
};

export default useKeywordGenerator;
