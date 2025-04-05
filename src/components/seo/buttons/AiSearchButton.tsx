
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getResponseForQuestion, suggestedQuestionsByCategory } from './QuoraConstants';

const AiSearchButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<null | {
    summary: string;
    keyPoints: string[];
    relatedKeywords: string[];
    sources: { title: string; url: string }[];
  }>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  // Fonction pour détecter le thème principal de la recherche
  const detectTheme = (query: string): 'seo' | 'marketing' | 'ecommerce' | 'contenu' | 'reseaux_sociaux' | 'voyage' | 'sante' | 'technologie' | 'business' => {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('seo') || queryLower.includes('référencement') || queryLower.includes('google') || 
        queryLower.includes('moteur') || queryLower.includes('classement') || queryLower.includes('position')) {
      return 'seo';
    } 
    else if (queryLower.includes('marketing') || queryLower.includes('stratégie') || queryLower.includes('campagne') || 
             queryLower.includes('publicité') || queryLower.includes('audience')) {
      return 'marketing';
    } 
    else if (queryLower.includes('commerce') || queryLower.includes('boutique') || queryLower.includes('vente') || 
             queryLower.includes('produit') || queryLower.includes('client') || queryLower.includes('achat')) {
      return 'ecommerce';
    } 
    else if (queryLower.includes('contenu') || queryLower.includes('article') || queryLower.includes('blog') || 
             queryLower.includes('rédaction') || queryLower.includes('texte')) {
      return 'contenu';
    }
    else if (queryLower.includes('social') || queryLower.includes('instagram') || queryLower.includes('facebook') || 
             queryLower.includes('linkedin') || queryLower.includes('twitter') || queryLower.includes('tiktok')) {
      return 'reseaux_sociaux';
    }
    else if (queryLower.includes('voyage') || queryLower.includes('destination') || queryLower.includes('tourisme') || 
             queryLower.includes('vacances') || queryLower.includes('hotel')) {
      return 'voyage';
    }
    else if (queryLower.includes('santé') || queryLower.includes('bien-être') || queryLower.includes('nutrition') || 
             queryLower.includes('alimentation') || queryLower.includes('sport')) {
      return 'sante';
    }
    else if (queryLower.includes('tech') || queryLower.includes('ia') || queryLower.includes('intelligence') || 
             queryLower.includes('développement') || queryLower.includes('code')) {
      return 'technologie';
    }
    else if (queryLower.includes('business') || queryLower.includes('entreprise') || queryLower.includes('startup') || 
             queryLower.includes('entrepreneur') || queryLower.includes('financement')) {
      return 'business';
    }
    
    return 'seo'; // Catégorie par défaut
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Veuillez saisir un mot-clé pour la recherche");
      return;
    }

    setIsSearching(true);
    
    // Détecter le thème de la question
    const theme = detectTheme(searchQuery);
    console.log("Thème détecté:", theme);
    
    // Mettre à jour les suggestions de questions basées sur le thème
    if (suggestedQuestionsByCategory[theme]) {
      setSuggestedQuestions(suggestedQuestionsByCategory[theme]);
    }
    
    setTimeout(() => {
      try {
        // Utiliser la fonction getResponseForQuestion pour obtenir une réponse pertinente
        const response = getResponseForQuestion(searchQuery);
        console.log("Réponse générée:", response.substring(0, 50) + "...");
        
        // Extraire des points clés basés sur la réponse
        const keyPoints = extractKeyPoints(response);
        
        // Générer des mots-clés associés
        const relatedKeywords = generateRelatedKeywords(searchQuery, theme);
        
        setSearchResult({
          summary: response,
          keyPoints,
          relatedKeywords,
          sources: generateSources(searchQuery, theme)
        });
        
        toast.success("Recherche terminée avec succès");
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        toast.error("Une erreur s'est produite lors de la recherche");
      } finally {
        setIsSearching(false);
      }
    }, 1500);
  };

  // Fonction pour extraire des points clés à partir d'une longue réponse
  const extractKeyPoints = (response: string): string[] => {
    // Découper la réponse en phrases
    const sentences = response.split(/\.\s+/).filter(s => s.length > 30);
    
    // Sélectionner les phrases les plus pertinentes (entre 3 et 5)
    const numPoints = Math.min(Math.max(3, Math.floor(sentences.length / 3)), 5);
    
    // Prendre des phrases réparties uniformément dans le texte
    const keyPointSentences = [];
    
    if (sentences.length <= numPoints) {
      return sentences.map(s => s.trim() + '.');
    }
    
    const step = Math.floor(sentences.length / numPoints);
    for (let i = 0; i < numPoints; i++) {
      const index = Math.min(i * step, sentences.length - 1);
      keyPointSentences.push(sentences[index].trim() + '.');
    }
    
    return keyPointSentences;
  };

  // Fonction pour générer des mots-clés associés
  const generateRelatedKeywords = (query: string, theme: string): string[] => {
    const baseKeywords = [query];
    let themeKeywords: string[] = [];
    
    switch (theme) {
      case 'marketing':
        themeKeywords = [
          `${query} stratégie`,
          `${query} digital`,
          `${query} ROI`,
          `${query} B2B`,
          `${query} B2C`,
          `${query} automation`,
          `${query} tendances`,
          `${query} analytics`,
          `${query} conversion`
        ];
        break;
      case 'seo':
        themeKeywords = [
          `${query} Google`,
          `${query} optimisation`,
          `${query} backlinks`,
          `${query} mots-clés`,
          `${query} contenu`,
          `${query} technique`,
          `${query} local`,
          `${query} mobile`,
          `${query} analytics`
        ];
        break;
      case 'ecommerce':
        themeKeywords = [
          `${query} conversion`,
          `${query} panier`,
          `${query} checkout`,
          `${query} produit`,
          `${query} prix`,
          `${query} livraison`,
          `${query} UX`,
          `${query} paiement`,
          `${query} marketplace`
        ];
        break;
      case 'contenu':
        themeKeywords = [
          `${query} création`,
          `${query} stratégie`,
          `${query} calendrier`,
          `${query} format`,
          `${query} distribution`,
          `${query} SEO`,
          `${query} engagement`,
          `${query} audience`,
          `${query} médias`
        ];
        break;
      case 'reseaux_sociaux':
        themeKeywords = [
          `${query} engagement`,
          `${query} organique`,
          `${query} payant`,
          `${query} algorithme`,
          `${query} communauté`,
          `${query} content`,
          `${query} analytics`,
          `${query} Instagram`,
          `${query} TikTok`
        ];
        break;
      case 'voyage':
        themeKeywords = [
          `${query} budget`,
          `${query} hébergement`,
          `${query} transport`,
          `${query} expérience`,
          `${query} local`,
          `${query} durable`,
          `${query} conseils`,
          `${query} saison`,
          `${query} guide`
        ];
        break;
      case 'sante':
        themeKeywords = [
          `${query} bienfaits`,
          `${query} nutrition`,
          `${query} exercice`,
          `${query} mental`,
          `${query} habitudes`,
          `${query} sommeil`,
          `${query} stress`,
          `${query} énergie`,
          `${query} équilibre`
        ];
        break;
      case 'technologie':
        themeKeywords = [
          `${query} innovation`,
          `${query} implémentation`,
          `${query} développement`,
          `${query} sécurité`,
          `${query} données`,
          `${query} AI`,
          `${query} cloud`,
          `${query} solutions`,
          `${query} tendances`
        ];
        break;
      case 'business':
        themeKeywords = [
          `${query} stratégie`,
          `${query} croissance`,
          `${query} financement`,
          `${query} modèle`,
          `${query} revenus`,
          `${query} startup`,
          `${query} innovation`,
          `${query} management`,
          `${query} leadership`
        ];
        break;
      default:
        themeKeywords = [
          `${query} guide`,
          `${query} définition`,
          `${query} avantages`,
          `${query} exemples`,
          `${query} techniques`,
          `${query} meilleures pratiques`,
          `${query} tendances`,
          `${query} conseils`,
          `${query} ressources`
        ];
    }
    
    // Fusionner les mots-clés de base avec les mots-clés thématiques
    const allKeywords = [...baseKeywords, ...themeKeywords];
    
    // Mélanger et sélectionner un nombre aléatoire entre 5 et 8
    return shuffleArray(allKeywords).slice(0, Math.floor(Math.random() * 4) + 5);
  };

  // Fonction pour générer des sources pertinentes
  const generateSources = (query: string, theme: string): { title: string; url: string }[] => {
    const sources = [];
    const queryFormatted = query.replace(/\s+/g, '-').toLowerCase();
    
    // Source 1: Article général
    sources.push({ 
      title: `Guide complet sur ${query}`, 
      url: `https://example.com/guide/${queryFormatted}` 
    });
    
    // Source 2: Statistiques/Données
    sources.push({ 
      title: `Statistiques et tendances: ${query} en 2024`, 
      url: `https://research.example.com/stats/${queryFormatted}-2024` 
    });
    
    // Sources spécifiques au thème
    switch (theme) {
      case 'seo':
        sources.push({ 
          title: `Étude de cas: Comment nous avons amélioré le classement pour "${query}"`, 
          url: `https://seostudies.example.com/case-study/${queryFormatted}` 
        });
        sources.push({ 
          title: `Guide technique SEO pour ${query}`, 
          url: `https://developers.google.com/search/docs/advanced/guidelines` 
        });
        break;
      case 'marketing':
        sources.push({ 
          title: `10 stratégies de ${query} qui ont fait leurs preuves`, 
          url: `https://marketing.example.com/strategies/${queryFormatted}` 
        });
        sources.push({ 
          title: `Mesurer le ROI de vos initiatives de ${query}`, 
          url: `https://analytics.example.com/roi/${queryFormatted}` 
        });
        break;
      case 'ecommerce':
        sources.push({ 
          title: `Optimisation de la conversion pour ${query}`, 
          url: `https://ecommerce.example.com/conversion/${queryFormatted}` 
        });
        sources.push({ 
          title: `Tendances ${query} pour les boutiques en ligne`, 
          url: `https://trends.example.com/ecommerce/${queryFormatted}` 
        });
        break;
      case 'contenu':
        sources.push({ 
          title: `Stratégie de contenu pour ${query}: Guide étape par étape`, 
          url: `https://content.example.com/strategy/${queryFormatted}` 
        });
        sources.push({ 
          title: `Exemples inspirants de ${query} qui convertit`, 
          url: `https://inspiration.example.com/content/${queryFormatted}` 
        });
        break;
      case 'reseaux_sociaux':
        sources.push({ 
          title: `Comment utiliser ${query} sur les réseaux sociaux en 2024`, 
          url: `https://social.example.com/howto/${queryFormatted}` 
        });
        sources.push({ 
          title: `Les métriques à suivre pour votre stratégie ${query}`, 
          url: `https://metrics.example.com/social/${queryFormatted}` 
        });
        break;
      case 'voyage':
        sources.push({ 
          title: `Les meilleures destinations pour ${query} en 2024`, 
          url: `https://travel.example.com/destinations/${queryFormatted}` 
        });
        sources.push({ 
          title: `Guide pour voyageurs: Tout savoir sur ${query}`, 
          url: `https://traveler.example.com/guides/${queryFormatted}` 
        });
        break;
      case 'sante':
        sources.push({ 
          title: `Études scientifiques sur ${query} et la santé`, 
          url: `https://health.example.com/research/${queryFormatted}` 
        });
        sources.push({ 
          title: `Plan de 30 jours pour améliorer votre ${query}`, 
          url: `https://wellness.example.com/programs/${queryFormatted}` 
        });
        break;
      case 'technologie':
        sources.push({ 
          title: `Comment implémenter ${query} dans votre entreprise`, 
          url: `https://tech.example.com/implementation/${queryFormatted}` 
        });
        sources.push({ 
          title: `L'avenir de ${query}: Tendances et prévisions`, 
          url: `https://future.example.com/tech/${queryFormatted}` 
        });
        break;
      case 'business':
        sources.push({ 
          title: `Étude de cas: Comment ${query} a transformé notre entreprise`, 
          url: `https://business.example.com/cases/${queryFormatted}` 
        });
        sources.push({ 
          title: `Guide pour entrepreneurs: Maîtriser ${query}`, 
          url: `https://startup.example.com/guides/${queryFormatted}` 
        });
        break;
      default:
        sources.push({ 
          title: `FAQ sur ${query}: Réponses aux questions courantes`, 
          url: `https://example.com/faq/${queryFormatted}` 
        });
        sources.push({ 
          title: `Ressources pour en apprendre plus sur ${query}`, 
          url: `https://example.com/resources/${queryFormatted}` 
        });
    }
    
    return sources;
  };

  // Fonction utilitaire pour mélanger un tableau
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Contenu copié dans le presse-papiers!");
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
    
    // Charger des questions suggérées aléatoires au démarrage
    const allCategories = Object.keys(suggestedQuestionsByCategory) as Array<keyof typeof suggestedQuestionsByCategory>;
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    setSuggestedQuestions(suggestedQuestionsByCategory[randomCategory]);
  };

  const handleSuggestedQuestionClick = (question: string) => {
    setSearchQuery(question);
    handleSearch();
  };

  return (
    <div>
      <Button
        variant="outline"
        className="flex flex-row items-center gap-2 py-3 px-4 text-center border-blue-500 text-blue-500 hover:bg-blue-50"
        onClick={handleOpenDialog}
      >
        <Search className="h-5 w-5" />
        <span>Recherche IA</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <Bot className="h-5 w-5" />
              Recherche IA
            </DialogTitle>
            <DialogDescription>
              Obtenez rapidement des informations complètes sur n'importe quel sujet grâce à l'IA
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="search-query">Votre requête</Label>
              <div className="flex gap-2">
                <Input
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: stratégies SEO, marketing digital, voyager à petit budget..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? "Recherche..." : "Rechercher"}
                </Button>
              </div>
            </div>

            {!searchResult && !isSearching && suggestedQuestions.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Questions suggérées:</h3>
                <div className="space-y-1">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => handleSuggestedQuestionClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse flex flex-col items-center">
                  <Bot className="h-10 w-10 text-blue-500 mb-2" />
                  <p className="text-blue-600">Recherche en cours...</p>
                </div>
              </div>
            )}
            
            {searchResult && (
              <Card className="mt-4">
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium">Résumé</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2" 
                        onClick={() => copyToClipboard(searchResult.summary)}
                      >
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700">{searchResult.summary}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Points clés</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {searchResult.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Mots-clés associés</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.relatedKeywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Sources</h3>
                    <ScrollArea className="h-[120px]">
                      <ul className="space-y-2 text-sm">
                        {searchResult.sources.map((source, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {source.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AiSearchButton;
