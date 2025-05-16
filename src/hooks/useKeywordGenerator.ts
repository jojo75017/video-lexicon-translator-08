
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { KeywordSuggestion, KeywordIntent, SerpsResult, CompetitorData } from '@/types/seo';
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
  competitors: CompetitorData[];
  byIntent: KeywordIntent;
  contentIdeas: ContentIdea[];
  serps?: SerpsResult[];
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
      
      // Vérification des données
      console.log("Keywords strategy received:", keywordStrategy);
      console.log("Main keywords count:", keywordStrategy.mainKeywords?.length);
      console.log("Long tail keywords count:", keywordStrategy.longTail?.length);
      console.log("Questions count:", keywordStrategy.questions?.length);
      console.log("Related keywords count:", keywordStrategy.related?.length);
      console.log("Competitors count:", keywordStrategy.competitors?.length);
      
      // Ensure all arrays have at least some elements
      const ensureArray = (arr: any[] | undefined, name: string): any[] => {
        if (!arr || arr.length === 0) {
          console.warn(`No ${name} received, using empty array`);
          return [];
        }
        return arr;
      };
      
      // Mettre à jour l'état avec les résultats de l'API, en s'assurant que les tableaux ne sont pas vides
      setKeywordResults({
        mainKeywords: ensureArray(keywordStrategy.mainKeywords, "mainKeywords"),
        longTail: ensureArray(keywordStrategy.longTail, "longTail"),
        questions: ensureArray(keywordStrategy.questions, "questions"),
        related: ensureArray(keywordStrategy.related, "related"),
        semantic: ensureArray(keywordStrategy.semantic, "semantic"),
        competitors: ensureArray(keywordStrategy.competitors, "competitors"),
        byIntent: keywordStrategy.byIntent || { informational: [], transactional: [], navigational: [] },
        contentIdeas: ensureArray(keywordStrategy.contentIdeas, "contentIdeas"),
        serps: ensureArray(keywordStrategy.serps, "serps")
      });
      
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
          relevance: 100,
          clicks: Math.floor(baseVolume * 0.7),
          position: Math.floor(Math.random() * 10 + 1)
        },
        {
          keyword: `meilleur ${keyword}`,
          volume: Math.floor(baseVolume * 0.7),
          difficulty: Math.floor(Math.random() * 80 + 20),
          cpc: parseFloat((Math.random() * 4 + 2).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 90,
          clicks: Math.floor(baseVolume * 0.5),
          position: Math.floor(Math.random() * 10 + 1)
        },
        {
          keyword: `${keyword} pas cher`,
          volume: Math.floor(baseVolume * 0.6),
          difficulty: Math.floor(Math.random() * 60 + 20),
          cpc: parseFloat((Math.random() * 3 + 1).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 85,
          clicks: Math.floor(baseVolume * 0.4),
          position: Math.floor(Math.random() * 10 + 3)
        },
        {
          keyword: `${keyword} prix`,
          volume: Math.floor(baseVolume * 0.5),
          difficulty: Math.floor(Math.random() * 50 + 20),
          cpc: parseFloat((Math.random() * 2 + 1).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 80,
          clicks: Math.floor(baseVolume * 0.3),
          position: Math.floor(Math.random() * 10 + 3)
        },
        {
          keyword: `${keyword} avis`,
          volume: Math.floor(baseVolume * 0.45),
          difficulty: Math.floor(Math.random() * 40 + 20),
          cpc: parseFloat((Math.random() * 1 + 0.5).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 75,
          clicks: Math.floor(baseVolume * 0.25),
          position: Math.floor(Math.random() * 15 + 5)
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
          relevance: 70,
          clicks: Math.floor(baseVolume * 0.15),
          position: Math.floor(Math.random() * 20 + 5)
        },
        {
          keyword: `${keyword} en famille`,
          volume: Math.floor(baseVolume * 0.25),
          difficulty: Math.floor(Math.random() * 35 + 10),
          cpc: parseFloat((Math.random() * 1.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.5).toFixed(2)),
          relevance: 65,
          clicks: Math.floor(baseVolume * 0.12),
          position: Math.floor(Math.random() * 20 + 10)
        },
        {
          keyword: `${keyword} dernière minute`,
          volume: Math.floor(baseVolume * 0.2),
          difficulty: Math.floor(Math.random() * 30 + 10),
          cpc: parseFloat((Math.random() * 2).toFixed(2)),
          competition: parseFloat((Math.random() * 0.6).toFixed(2)),
          relevance: 60,
          clicks: Math.floor(baseVolume * 0.1),
          position: Math.floor(Math.random() * 25 + 10)
        },
        {
          keyword: `${keyword} tout compris`,
          volume: Math.floor(baseVolume * 0.18),
          difficulty: Math.floor(Math.random() * 25 + 15),
          cpc: parseFloat((Math.random() * 1.8).toFixed(2)),
          competition: parseFloat((Math.random() * 0.5).toFixed(2)),
          relevance: 55,
          clicks: Math.floor(baseVolume * 0.09),
          position: Math.floor(Math.random() * 25 + 15)
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
          relevance: 80,
          clicks: Math.floor(baseVolume * 0.08),
          position: Math.floor(Math.random() * 30 + 5)
        },
        {
          keyword: `pourquoi choisir ${keyword}`,
          volume: Math.floor(baseVolume * 0.12),
          difficulty: Math.floor(Math.random() * 35),
          cpc: parseFloat((Math.random() * 0.8).toFixed(2)),
          competition: parseFloat((Math.random() * 0.3).toFixed(2)),
          relevance: 75,
          clicks: Math.floor(baseVolume * 0.06),
          position: Math.floor(Math.random() * 30 + 10)
        },
        {
          keyword: `quand partir pour ${keyword}`,
          volume: Math.floor(baseVolume * 0.14),
          difficulty: Math.floor(Math.random() * 38),
          cpc: parseFloat((Math.random() * 0.9).toFixed(2)),
          competition: parseFloat((Math.random() * 0.35).toFixed(2)),
          relevance: 85,
          clicks: Math.floor(baseVolume * 0.07),
          position: Math.floor(Math.random() * 35 + 5)
        },
        {
          keyword: `où loger pendant ${keyword}`,
          volume: Math.floor(baseVolume * 0.1),
          difficulty: Math.floor(Math.random() * 30),
          cpc: parseFloat((Math.random() * 0.7).toFixed(2)),
          competition: parseFloat((Math.random() * 0.25).toFixed(2)),
          relevance: 70,
          clicks: Math.floor(baseVolume * 0.05),
          position: Math.floor(Math.random() * 35 + 10)
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
          relevance: 60,
          clicks: Math.floor(baseVolume * 0.2),
          position: Math.floor(Math.random() * 40 + 5)
        },
        {
          keyword: keyword.includes("voyage") ? "activités touristiques" : `alternatives à ${keyword}`,
          volume: Math.floor(baseVolume * 0.35),
          difficulty: Math.floor(Math.random() * 45 + 15),
          cpc: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.65).toFixed(2)),
          relevance: 55,
          clicks: Math.floor(baseVolume * 0.18),
          position: Math.floor(Math.random() * 40 + 10)
        },
        {
          keyword: keyword.includes("voyage") ? "hébergement" : `${keyword} comparatif`,
          volume: Math.floor(baseVolume * 0.3),
          difficulty: Math.floor(Math.random() * 40 + 15),
          cpc: parseFloat((Math.random() * 1.2 + 0.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.6).toFixed(2)),
          relevance: 50,
          clicks: Math.floor(baseVolume * 0.15),
          position: Math.floor(Math.random() * 45 + 5)
        }
      ];
      
      // Champ sémantique
      const semantic = keyword.includes("voyage") ? 
        ["séjour", "vacances", "tourisme", "excursion", "découverte", "circuit", "visite", "escapade"] :
        ["guide", "comparatif", "avis", "test", "review", "tutoriel", "conseils", "astuces"];
      
      // Sites concurrents (simulés mais avec des URLs plus réalistes)
      const competitors: CompetitorData[] = [
        {
          name: `Guide${keyword.split(' ')[0]}.fr`,
          url: `https://www.guide${keyword.split(' ')[0].toLowerCase()}.fr`,
          strength: Math.floor(Math.random() * 40 + 60),
          organic_traffic: Math.floor(Math.random() * 50000 + 10000),
          keywords: Math.floor(Math.random() * 5000 + 1000)
        },
        {
          name: `${keyword.split(' ')[0]}Expert.com`,
          url: `https://www.${keyword.split(' ')[0].toLowerCase()}expert.com`,
          strength: Math.floor(Math.random() * 30 + 50),
          organic_traffic: Math.floor(Math.random() * 40000 + 8000),
          keywords: Math.floor(Math.random() * 4000 + 800)
        },
        {
          name: `Meilleur${keyword.split(' ')[0]}.fr`,
          url: `https://www.meilleur${keyword.split(' ')[0].toLowerCase()}.fr`,
          strength: Math.floor(Math.random() * 30 + 40),
          organic_traffic: Math.floor(Math.random() * 30000 + 5000),
          keywords: Math.floor(Math.random() * 3000 + 600)
        },
        {
          name: `${keyword.split(' ')[0]}Pro.com`,
          url: `https://www.${keyword.split(' ')[0].toLowerCase()}pro.com`,
          strength: Math.floor(Math.random() * 20 + 40),
          organic_traffic: Math.floor(Math.random() * 25000 + 3000),
          keywords: Math.floor(Math.random() * 2500 + 500)
        },
        {
          name: `Top${keyword.split(' ')[0]}.com`,
          url: `https://www.top${keyword.split(' ')[0].toLowerCase()}.com`,
          strength: Math.floor(Math.random() * 20 + 30),
          organic_traffic: Math.floor(Math.random() * 20000 + 2000),
          keywords: Math.floor(Math.random() * 2000 + 400)
        }
      ];

      // Générer des résultats SERP (simulés mais avec des URLs plus réalistes)
      const serps: SerpsResult[] = [
        {
          title: `${keyword} - Guide complet et conseils`,
          url: `https://www.guide${keyword.split(' ')[0].toLowerCase()}.fr/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
          description: `Découvrez tout ce que vous devez savoir sur ${keyword}. Guide complet, conseils d'experts et astuces pour réussir.`,
          position: 1
        },
        {
          title: `Les meilleurs ${keyword} en ${new Date().getFullYear()} - Comparatif complet`,
          url: `https://www.meilleur${keyword.split(' ')[0].toLowerCase()}.fr/comparatif-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
          description: `Comparatif des meilleurs ${keyword} de l'année. Avis, tests et conseils pour faire le bon choix.`,
          position: 2
        },
        {
          title: `${keyword}: tout ce qu'il faut savoir - ${keyword.split(' ')[0]}Expert`,
          url: `https://www.${keyword.split(' ')[0].toLowerCase()}expert.com/guide/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
          description: `Guide complet sur ${keyword}. Découvrez nos conseils d'experts pour optimiser votre expérience.`,
          position: 3
        },
        {
          title: `${keyword} pas cher - Les meilleures offres`,
          url: `https://www.bons-plans-${keyword.split(' ')[0].toLowerCase()}.com/${keyword.replace(/\s+/g, '-').toLowerCase()}-pas-cher`,
          description: `Économisez sur votre ${keyword} avec nos conseils et bons plans. Offres mises à jour quotidiennement.`,
          position: 4
        },
        {
          title: `Avis sur les ${keyword} - Test complet`,
          url: `https://www.avis-${keyword.split(' ')[0].toLowerCase()}.fr/test-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
          description: `Avis détaillés et tests des ${keyword}. Découvrez les avantages, inconvénients et retours d'expérience.`,
          position: 5
        },
        {
          title: `Comment choisir son ${keyword} ? Guide d'achat`,
          url: `https://www.conseils-${keyword.split(' ')[0].toLowerCase()}.com/guide-achat-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
          description: `Guide d'achat pour bien choisir votre ${keyword}. Critères de sélection, comparatifs et conseils personnalisés.`,
          position: 6
        },
        {
          title: `${keyword} - Wikipédia`,
          url: `https://fr.wikipedia.org/wiki/${keyword.replace(/\s+/g, '_')}`,
          description: `${keyword} désigne... Découvrez l'histoire, les caractéristiques et l'évolution du concept de ${keyword} dans cet article.`,
          position: 7
        },
        {
          title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} | Amazon.fr`,
          url: `https://www.amazon.fr/s?k=${keyword.replace(/\s+/g, '+')}`,
          description: `Achetez ${keyword} sur Amazon.fr. Livraison rapide et prix bas garantis. Grand choix parmi des milliers de produits.`,
          position: 8
        },
        {
          title: `Les tendances ${keyword} en ${new Date().getFullYear()}`,
          url: `https://www.tendances-${keyword.split(' ')[0].toLowerCase()}.fr/${new Date().getFullYear()}/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
          description: `Découvrez les dernières tendances ${keyword} pour cette année. Innovations, nouveautés et évolutions à connaître.`,
          position: 9
        },
        {
          title: `Formation ${keyword} - Apprenez avec des experts`,
          url: `https://www.formation-${keyword.split(' ')[0].toLowerCase()}.com/cours-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
          description: `Formez-vous au ${keyword} avec nos cours en ligne. Formation certifiante dispensée par des experts du domaine.`,
          position: 10
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
          relevance: 75,
          clicks: Math.floor(baseVolume * 0.11),
          position: Math.floor(Math.random() * 30 + 5)
        }],
        transactional: [{
          keyword: `réserver ${keyword}`,
          volume: Math.floor(baseVolume * 0.28),
          difficulty: Math.floor(Math.random() * 60 + 20),
          cpc: parseFloat((Math.random() * 3 + 1).toFixed(2)),
          competition: parseFloat((Math.random() * 0.8).toFixed(2)),
          relevance: 85,
          clicks: Math.floor(baseVolume * 0.14),
          position: Math.floor(Math.random() * 15 + 5)
        }, {
          keyword: `acheter ${keyword}`,
          volume: Math.floor(baseVolume * 0.25),
          difficulty: Math.floor(Math.random() * 55 + 25),
          cpc: parseFloat((Math.random() * 3.5 + 1.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.85).toFixed(2)),
          relevance: 80,
          clicks: Math.floor(baseVolume * 0.12),
          position: Math.floor(Math.random() * 15 + 10)
        }],
        navigational: [{
          keyword: `${keyword} site officiel`,
          volume: Math.floor(baseVolume * 0.18),
          difficulty: Math.floor(Math.random() * 30 + 10),
          cpc: parseFloat((Math.random() * 1).toFixed(2)),
          competition: parseFloat((Math.random() * 0.4).toFixed(2)),
          relevance: 60,
          clicks: Math.floor(baseVolume * 0.09),
          position: Math.floor(Math.random() * 20 + 5)
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
        longTail: [], // Vous pouvez générer ces données comme les mainKeywords
        questions: [], // Vous pouvez générer ces données comme les mainKeywords
        related: [], // Vous pouvez générer ces données comme les mainKeywords
        semantic,
        competitors,
        byIntent,
        contentIdeas,
        serps
      });
      
      setIsLoading(false);
      toast.success(`Analyse complète pour "${keyword}" générée avec succès`, {
        description: `${mainKeywords.length} mots-clés analysés, ${competitors.length} concurrents identifiés, ${serps.length} résultats SERP`
      });
    }, 1000);
  };

  const getAllKeywords = (): KeywordSuggestion[] => {
    if (!keywordResults) return [];
    
    const mainKeywords = keywordResults.mainKeywords || [];
    const longTail = keywordResults.longTail || [];
    const questions = keywordResults.questions || [];
    const related = keywordResults.related || [];
    
    return [
      ...mainKeywords,
      ...longTail,
      ...questions,
      ...related
    ];
  };

  const handleExport = () => {
    if (!keywordResults) return;
    
    let csvContent = "Mot-clé,Volume,Difficulté,CPC,Concurrence\n";
    
    // Ajouter tous les mots-clés au CSV
    getAllKeywords().forEach(kw => {
      csvContent += `${kw.keyword},${kw.volume || 0},${kw.difficulty || 0},${kw.cpc || 0},${kw.competition || 0}\n`;
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
