
import { useState } from 'react';
import { toast } from "sonner";
import { KeywordSuggestion } from '@/types/seo';
import { OpenAIService } from '@/utils/seo/openaiService';

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

      // Simuler un délai pour démonstration
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
            suggestedDescription: `Découvrez tout ce que vous devez savoir sur ${keyword}. Guides pratiques, conseils d'experts et stratégies éprouvées pour optimiser vos résultats.`,
            suggestedShortDescription: `Guide complet sur ${keyword}: conseils pratiques et stratégies d'experts pour 2024.`,
            suggestedLongDescription: `Plongez dans notre guide détaillé sur ${keyword} et découvrez les meilleures pratiques recommandées par les experts du domaine. Que vous soyez débutant ou expérimenté, nos conseils pratiques, astuces et stratégies éprouvées vous aideront à améliorer significativement vos résultats. Mis à jour pour 2024 avec les dernières tendances et innovations dans le domaine.`
          },
          {
            keyword: `${keyword} en ligne`,
            searchVolume: Math.floor(Math.random() * 3000) + 500,
            difficulty: Math.floor(Math.random() * 100),
            cpc: Math.random() * 4,
            competition: Math.random(),
            relevance: 75,
            suggestedTitle: `${keyword} en ligne - Solutions et Stratégies | Guide 2024`,
            suggestedDescription: `Optimisez votre approche de ${keyword} en ligne avec notre guide complet. Découvrez les stratégies qui fonctionnent réellement en 2024.`,
            suggestedShortDescription: `Stratégies efficaces pour ${keyword} en ligne. Guide complet mis à jour pour 2024.`,
            suggestedLongDescription: `Notre guide complet sur ${keyword} en ligne vous présente les stratégies les plus efficaces pour maximiser vos résultats dans l'environnement numérique actuel. Apprenez comment adapter vos techniques aux plateformes en ligne, éviter les pièges courants et exploiter les opportunités uniques qu'offre Internet. Basé sur des études de cas réels et mis à jour pour 2024.`
          },
          {
            keyword: `meilleur ${keyword}`,
            searchVolume: Math.floor(Math.random() * 2000) + 300,
            difficulty: Math.floor(Math.random() * 100),
            cpc: Math.random() * 6,
            competition: Math.random(),
            relevance: 85,
            suggestedTitle: `Meilleur ${keyword} - Comparatif Complet | Choix 2024`,
            suggestedDescription: `Comment choisir le meilleur ${keyword}? Notre comparatif analyse les options disponibles et vous guide vers le choix idéal pour vos besoins.`,
            suggestedShortDescription: `Comparatif des meilleurs ${keyword} en 2024. Critères, analyses et recommandations d'experts.`,
            suggestedLongDescription: `Comment identifier le meilleur ${keyword} parmi toutes les options disponibles sur le marché? Notre comparatif détaillé examine les caractéristiques essentielles, les avantages et les inconvénients de chaque option. Nous avons testé et analysé les produits/services/méthodes les plus populaires pour vous offrir des recommandations impartiales basées sur différents critères: rapport qualité-prix, efficacité, facilité d'utilisation et durabilité.`
          }
        ];

        setGeneratedKeywords(mockSuggestions);
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
