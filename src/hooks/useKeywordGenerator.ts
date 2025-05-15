
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { KeywordSuggestion, KeywordIntent } from '@/types/seo';
import { OpenAIService } from '@/utils/seo/openaiService';

interface ContentIdea {
  title: string;
  type: string;
}

interface KeywordResults {
  mainKeywords: KeywordSuggestion[];
  longTail: KeywordSuggestion[];
  questions: KeywordSuggestion[];
  related: KeywordSuggestion[];
  semantic: string[];
  competitors: {name: string, url: string, strength: number}[];
  byIntent: KeywordIntent;
  contentIdeas: ContentIdea[];
}

export const useKeywordGenerator = () => {
  // État pour les entrées du formulaire
  const [keyword, setKeyword] = useState<string>('');
  const [language, setLanguage] = useState<string>('fr');
  const [niche, setNiche] = useState<string>('');
  const [objective, setObjective] = useState<string>('blog');
  const [region, setRegion] = useState<string>('FR');
  
  // État pour le chargement et les résultats
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keywordResults, setKeywordResults] = useState<KeywordResults | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // État pour la clé API OpenAI
  const [openaiKey, setOpenaiKey] = useState<string>(() => localStorage.getItem('openaiKey') || '');
  const [useAI, setUseAI] = useState<boolean>(false);
  
  useEffect(() => {
    // Vérifier si une clé API existe et activer l'option AI si c'est le cas
    const storedKey = localStorage.getItem('openaiKey');
    if (storedKey && storedKey.trim() !== '') {
      setOpenaiKey(storedKey);
      setUseAI(true);
    }
  }, []);

  const generateKeywordResults = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      toast.error("Veuillez saisir un mot-clé principal");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Si l'option AI est activée et qu'une clé API est fournie
      if (useAI && openaiKey) {
        await generateWithOpenAI();
      } else {
        // Sinon, utiliser les données simulées
        generateSimulatedData();
      }
    } catch (error) {
      console.error("Erreur lors de la génération des suggestions:", error);
      setIsLoading(false);
      toast.error("Erreur de génération", {
        description: "Un problème est survenu. Veuillez réessayer plus tard."
      });
    }
  };
  
  const generateWithOpenAI = async () => {
    try {
      const openaiService = new OpenAIService(openaiKey);
      
      // Valider la clé API
      const isValid = await openaiService.validateApiKey();
      if (!isValid) {
        setIsLoading(false);
        toast.error("Clé API OpenAI invalide", {
          description: "Veuillez vérifier votre clé API dans les paramètres."
        });
        return;
      }
      
      // Générer la stratégie complète de mots-clés avec OpenAI
      const keywordStrategy = await openaiService.generateComprehensiveKeywordStrategy(
        keyword,
        language,
        niche,
        objective
      );
      
      // Mettre à jour l'état avec les résultats de l'API
      setKeywordResults(keywordStrategy);
      setIsLoading(false);
      toast.success(`Analyse complète pour "${keyword}" générée avec succès`, {
        description: `Données générées par IA`
      });
    } catch (error) {
      console.error("Erreur lors de l'utilisation d'OpenAI:", error);
      setIsLoading(false);
      
      // En cas d'échec, revenir à la génération simulée
      toast.warning("Problème avec l'API OpenAI", {
        description: "Utilisation des données simulées à la place."
      });
      generateSimulatedData();
    }
  };
  
  const generateSimulatedData = () => {
    // Simuler un délai de chargement
    setTimeout(() => {
      // Données simulées basées sur l'entrée
      const baseVolume = Math.floor(Math.random() * 5000 + 1000);
      
      // Générer les mots-clés principaux
      const mainKeywords: KeywordSuggestion[] = [
        {
          keyword: keyword,
          volume: baseVolume,
          difficulty: Math.floor(Math.random() * 70 + 30),
          cpc: parseFloat((Math.random() * 3 + 1).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 100
        },
        {
          keyword: `meilleur ${keyword}`,
          volume: Math.floor(baseVolume * 0.7),
          difficulty: Math.floor(Math.random() * 80 + 20),
          cpc: parseFloat((Math.random() * 4 + 2).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 90
        },
        {
          keyword: `${keyword} pas cher`,
          volume: Math.floor(baseVolume * 0.6),
          difficulty: Math.floor(Math.random() * 60 + 20),
          cpc: parseFloat((Math.random() * 3 + 1).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 85
        },
        {
          keyword: `${keyword} prix`,
          volume: Math.floor(baseVolume * 0.5),
          difficulty: Math.floor(Math.random() * 50 + 20),
          cpc: parseFloat((Math.random() * 2 + 1).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 80
        },
        {
          keyword: `${keyword} avis`,
          volume: Math.floor(baseVolume * 0.45),
          difficulty: Math.floor(Math.random() * 40 + 20),
          cpc: parseFloat((Math.random() * 1 + 0.5).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 75
        }
      ];
      
      // Générer des mots-clés longue traîne
      const longTail: KeywordSuggestion[] = [
        {
          keyword: `${keyword} pour débutant`,
          volume: Math.floor(baseVolume * 0.3),
          difficulty: Math.floor(Math.random() * 40 + 10),
          cpc: parseFloat((Math.random() * 1.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.6).toFixed(2)),
          relevance: 70
        },
        {
          keyword: `${keyword} en famille`,
          volume: Math.floor(baseVolume * 0.25),
          difficulty: Math.floor(Math.random() * 35 + 10),
          cpc: parseFloat((Math.random() * 1.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.5).toFixed(2)),
          relevance: 65
        },
        {
          keyword: `${keyword} dernière minute`,
          volume: Math.floor(baseVolume * 0.2),
          difficulty: Math.floor(Math.random() * 30 + 10),
          cpc: parseFloat((Math.random() * 2).toFixed(2)),
          competition: parseFloat((Math.random() * 0.6).toFixed(2)),
          relevance: 60
        },
        {
          keyword: `${keyword} tout compris`,
          volume: Math.floor(baseVolume * 0.18),
          difficulty: Math.floor(Math.random() * 25 + 15),
          cpc: parseFloat((Math.random() * 1.8).toFixed(2)),
          competition: parseFloat((Math.random() * 0.5).toFixed(2)),
          relevance: 55
        }
      ];
      
      // Générer des questions fréquentes
      const questions: KeywordSuggestion[] = [
        {
          keyword: `comment organiser ${keyword}`,
          volume: Math.floor(baseVolume * 0.15),
          difficulty: Math.floor(Math.random() * 40),
          cpc: parseFloat((Math.random() * 1).toFixed(2)),
          competition: parseFloat((Math.random() * 0.4).toFixed(2)),
          relevance: 80
        },
        {
          keyword: `pourquoi choisir ${keyword}`,
          volume: Math.floor(baseVolume * 0.12),
          difficulty: Math.floor(Math.random() * 35),
          cpc: parseFloat((Math.random() * 0.8).toFixed(2)),
          competition: parseFloat((Math.random() * 0.3).toFixed(2)),
          relevance: 75
        },
        {
          keyword: `quand partir pour ${keyword}`,
          volume: Math.floor(baseVolume * 0.14),
          difficulty: Math.floor(Math.random() * 38),
          cpc: parseFloat((Math.random() * 0.9).toFixed(2)),
          competition: parseFloat((Math.random() * 0.35).toFixed(2)),
          relevance: 85
        },
        {
          keyword: `où loger pendant ${keyword}`,
          volume: Math.floor(baseVolume * 0.1),
          difficulty: Math.floor(Math.random() * 30),
          cpc: parseFloat((Math.random() * 0.7).toFixed(2)),
          competition: parseFloat((Math.random() * 0.25).toFixed(2)),
          relevance: 70
        }
      ];
      
      // Générer des mots-clés liés
      const related: KeywordSuggestion[] = [
        {
          keyword: keyword.includes("voyage") ? "circuit touristique" : `${keyword} guide`,
          volume: Math.floor(baseVolume * 0.4),
          difficulty: Math.floor(Math.random() * 50 + 20),
          cpc: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.7).toFixed(2)),
          relevance: 60
        },
        {
          keyword: keyword.includes("voyage") ? "activités touristiques" : `alternatives à ${keyword}`,
          volume: Math.floor(baseVolume * 0.35),
          difficulty: Math.floor(Math.random() * 45 + 15),
          cpc: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.65).toFixed(2)),
          relevance: 55
        },
        {
          keyword: keyword.includes("voyage") ? "hébergement" : `${keyword} comparatif`,
          volume: Math.floor(baseVolume * 0.3),
          difficulty: Math.floor(Math.random() * 40 + 15),
          cpc: parseFloat((Math.random() * 1.2 + 0.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.6).toFixed(2)),
          relevance: 50
        }
      ];
      
      // Champ sémantique
      const semantic = keyword.includes("voyage") ? 
        ["séjour", "vacances", "tourisme", "excursion", "découverte", "circuit", "visite", "escapade"] :
        ["guide", "comparatif", "avis", "test", "review", "tutoriel", "conseils", "astuces"];
      
      // Sites concurrents (simulés)
      const competitors = [
        {
          name: `Top${keyword.split(' ')[0]}.com`,
          url: `https://www.top${keyword.split(' ')[0].toLowerCase()}.com`,
          strength: Math.floor(Math.random() * 40 + 60)
        },
        {
          name: `Guide${keyword.split(' ')[0]}.fr`,
          url: `https://www.guide${keyword.split(' ')[0].toLowerCase()}.fr`,
          strength: Math.floor(Math.random() * 30 + 50)
        },
        {
          name: `${keyword.split(' ')[0]}Expert.com`,
          url: `https://www.${keyword.split(' ')[0].toLowerCase()}expert.com`,
          strength: Math.floor(Math.random() * 30 + 40)
        },
        {
          name: `Meilleur${keyword.split(' ')[0]}.fr`,
          url: `https://www.meilleur${keyword.split(' ')[0].toLowerCase()}.fr`,
          strength: Math.floor(Math.random() * 20 + 40)
        }
      ];
      
      // Regroupement par intention
      const byIntent: KeywordIntent = {
        informational: [...questions, {
          keyword: `guide ${keyword}`,
          volume: Math.floor(baseVolume * 0.22),
          difficulty: Math.floor(Math.random() * 45),
          cpc: parseFloat((Math.random() * 1.2).toFixed(2)),
          competition: parseFloat((Math.random() * 0.5).toFixed(2)),
          relevance: 75
        }],
        transactional: [{
          keyword: `réserver ${keyword}`,
          volume: Math.floor(baseVolume * 0.28),
          difficulty: Math.floor(Math.random() * 60 + 20),
          cpc: parseFloat((Math.random() * 3 + 1).toFixed(2)),
          competition: parseFloat((Math.random() * 0.8).toFixed(2)),
          relevance: 85
        }, {
          keyword: `acheter ${keyword}`,
          volume: Math.floor(baseVolume * 0.25),
          difficulty: Math.floor(Math.random() * 55 + 25),
          cpc: parseFloat((Math.random() * 3.5 + 1.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.85).toFixed(2)),
          relevance: 80
        }],
        navigational: [{
          keyword: `${keyword} site officiel`,
          volume: Math.floor(baseVolume * 0.18),
          difficulty: Math.floor(Math.random() * 30 + 10),
          cpc: parseFloat((Math.random() * 1).toFixed(2)),
          competition: parseFloat((Math.random() * 0.4).toFixed(2)),
          relevance: 60
        }]
      };
      
      // Idées de contenu
      const contentIdeas = [
        { title: `Guide complet : tout savoir sur ${keyword}`, type: 'Article de fond' },
        { title: `Les 10 erreurs à éviter lors de ${keyword}`, type: 'Liste' },
        { title: `Comment planifier ${keyword} : le guide étape par étape`, type: 'Tutoriel' },
        { title: `${keyword} vs alternatives : comparatif complet`, type: 'Comparatif' },
        { title: `FAQ : vos questions sur ${keyword} répondues par des experts`, type: 'FAQ' }
      ];
      
      setKeywordResults({
        mainKeywords,
        longTail,
        questions,
        related,
        semantic,
        competitors,
        byIntent,
        contentIdeas
      });
      
      setIsLoading(false);
      toast.success(`Analyse complète pour "${keyword}" générée avec succès`, {
        description: `${mainKeywords.length + longTail.length + questions.length + related.length} mots-clés analysés`
      });
    }, 1000);
  };

  const handleExport = () => {
    if (!keywordResults) return;
    
    let csvContent = "Mot-clé,Volume,Difficulté,CPC,Concurrence\n";
    
    // Ajouter tous les mots-clés au CSV
    [
      ...keywordResults.mainKeywords, 
      ...keywordResults.longTail, 
      ...keywordResults.questions, 
      ...keywordResults.related
    ].forEach(kw => {
      csvContent += `${kw.keyword},${kw.volume},${kw.difficulty},${kw.cpc},${kw.competition}\n`;
    });
    
    // Créer un blob et le télécharger
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `keywords-${keyword.replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Exportation CSV réussie");
  };

  const getAllKeywords = (): KeywordSuggestion[] => {
    if (!keywordResults) return [];
    return [
      ...keywordResults.mainKeywords,
      ...keywordResults.longTail,
      ...keywordResults.questions,
      ...keywordResults.related
    ];
  };

  return {
    // État du formulaire
    keyword,
    setKeyword,
    language,
    setLanguage,
    niche,
    setNiche,
    objective,
    setObjective,
    region,
    setRegion,
    
    // État de l'API OpenAI
    openaiKey,
    setOpenaiKey,
    useAI,
    setUseAI,
    
    // État des résultats
    isLoading,
    keywordResults,
    activeTab,
    setActiveTab,
    
    // Actions
    generateKeywordResults,
    handleExport,
    getAllKeywords
  };
};

export default useKeywordGenerator;
