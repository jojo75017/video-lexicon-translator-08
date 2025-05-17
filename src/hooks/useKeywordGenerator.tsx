
import { useState } from 'react';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';
import { generateStandardKeywords, generateLongTailKeywords } from '@/utils/keyword/keywordGeneratorUtils';

const useKeywordGenerator = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [language, setLanguage] = useState<string>('fr');
  const [results, setResults] = useState<KeywordSuggestion[]>([]);
  const [favorites, setFavorites] = useState<KeywordSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('title');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  
  // États pour le title et la description
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

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
      
      // Générer des mots-clés standards et longue traîne
      const standardKeywords = generateStandardKeywords(keyword);
      const longTailKeywords = generateLongTailKeywords(keyword);
      
      // Combine les deux types de mots-clés
      const combinedKeywords = [...standardKeywords.slice(0, 5), ...longTailKeywords.slice(0, 3)];
      
      setGeneratedKeywords(combinedKeywords);
      setResults(combinedKeywords);
      
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
