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
import { getResponseForQuestion } from './QuoraConstants';

// Define suggestionsByCategory directly here since it's missing from import
const suggestedQuestionsByCategory = {
  seo: [
    "Comment améliorer le référencement de mon site e-commerce en 2024?",
    "Quelles sont les meilleures stratégies de backlinks pour un nouveau site web?",
    "Comment optimiser mon contenu pour le featured snippet de Google?",
    "Comment mettre en place une stratégie SEO efficace pour un site local?",
    "Quelles sont les tendances SEO à suivre absolument cette année?",
    "Comment optimiser mes images pour améliorer mon SEO?"
  ],
  marketing: [
    "Comment mesurer le ROI de mes campagnes marketing digital?",
    "Quelles sont les meilleures stratégies d'email marketing pour augmenter les conversions?",
    "Comment créer un plan marketing efficace avec un petit budget?",
    "Quels KPIs privilégier pour mesurer l'efficacité de ma stratégie marketing?",
    "Comment adapter ma stratégie marketing à la génération Z?",
    "Quels outils utiliser pour automatiser mon marketing digital?"
  ],
  ecommerce: [
    "Comment réduire le taux d'abandon de panier sur mon site e-commerce?",
    "Quelles sont les tendances e-commerce à suivre en 2024?",
    "Comment améliorer l'expérience utilisateur sur un site de vente en ligne?",
    "Comment optimiser les fiches produit pour maximiser les conversions?",
    "Quelles fonctionnalités privilégier pour un site e-commerce B2B?",
    "Comment mettre en place une stratégie de cross-selling efficace?"
  ],
  contenu: [
    "Comment créer un calendrier éditorial efficace pour mon blog?",
    "Quelles sont les meilleures pratiques pour la rédaction SEO?",
    "Comment mesurer l'impact de ma stratégie de contenu?",
    "Quelle longueur idéale pour mes articles de blog en 2024?",
    "Comment réutiliser intelligemment mon contenu sur différents canaux?",
    "Comment créer des contenus evergreen qui performent sur le long terme?"
  ],
  reseaux_sociaux: [
    "Comment augmenter mon engagement organique sur Instagram?",
    "Quelles sont les meilleures heures pour poster sur LinkedIn?",
    "Comment créer une stratégie TikTok efficace pour mon entreprise?",
    "Faut-il privilégier la qualité ou la quantité sur les réseaux sociaux?",
    "Comment mesurer le ROI de ma présence sur les réseaux sociaux?",
    "Quels types de contenu fonctionnent le mieux sur chaque plateforme?"
  ],
  voyage: [
    "Comment voyager en Europe avec un petit budget?",
    "Quelles sont les destinations tendance pour 2024?",
    "Comment planifier un voyage éco-responsable?",
    "Quelles assurances voyage sont vraiment indispensables?",
    "Comment trouver des hébergements authentiques hors des sentiers battus?",
    "Quels sont les meilleurs moments pour réserver des vols à prix réduits?"
  ],
  sante: [
    "Quels sont les meilleurs exercices pour renforcer son dos?",
    "Comment adopter une alimentation équilibrée sans se priver?",
    "Quelles techniques de méditation pour réduire le stress quotidien?",
    "Comment améliorer la qualité de son sommeil naturellement?",
    "Quels compléments alimentaires sont vraiment utiles?",
    "Comment maintenir une routine fitness même en déplacement?"
  ],
  technologie: [
    "Comment implémenter l'IA dans une petite entreprise?",
    "Quels langages de programmation apprendre en 2024?",
    "Comment protéger efficacement ses données personnelles en ligne?",
    "Quelles sont les applications de la blockchain au-delà des cryptomonnaies?",
    "Comment se former efficacement aux nouvelles technologies sans formation technique?",
    "Quels outils no-code recommander pour créer une application?"
  ],
  business: [
    "Comment créer un pitch deck efficace pour lever des fonds?",
    "Quelles sont les étapes clés pour lancer une startup?",
    "Comment développer une stratégie de croissance durable?",
    "Quelles métriques suivre pendant les premières années de son business?",
    "Comment valider son idée de business avant de se lancer?",
    "Quelles sont les meilleures pratiques pour gérer une équipe à distance?"
  ]
};

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
    
    // Générer de nouvelles questions suggérées à chaque recherche
    // Sélection aléatoire de questions pour le thème détecté
    if (suggestedQuestionsByCategory[theme]) {
      const allQuestions = [...suggestedQuestionsByCategory[theme]];
      const randomQuestions = shuffleArray(allQuestions).slice(0, 3);
      
      // Ajouter quelques questions d'autres catégories pour plus de diversité
      const otherCategories = Object.keys(suggestedQuestionsByCategory).filter(cat => cat !== theme);
      const randomCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)];
      const additionalQuestions = shuffleArray(suggestedQuestionsByCategory[randomCategory as keyof typeof suggestedQuestionsByCategory]).slice(0, 2);
      
      setSuggestedQuestions([...randomQuestions, ...additionalQuestions]);
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
    const sentences = response.split(/\.\s+/).filter(s => s.length > 30);
    
    // Ajouter de l'aléatoire dans le nombre de points clés
    const numPoints = Math.min(Math.max(3, Math.floor(sentences.length / 3)), 5 + Math.floor(Math.random() * 3));
    
    const keyPointSentences = [];
    
    if (sentences.length <= numPoints) {
      return sentences.map(s => s.trim() + '.');
    }
    
    // Sélectionner des phrases aléatoires pour plus de variété
    const selectedIndexes = new Set<number>();
    while (selectedIndexes.size < numPoints && selectedIndexes.size < sentences.length) {
      const randomIndex = Math.floor(Math.random() * sentences.length);
      selectedIndexes.add(randomIndex);
    }
    
    // Convertir le Set en array et trier pour garder l'ordre logique du texte
    Array.from(selectedIndexes).sort().forEach(index => {
      keyPointSentences.push(sentences[index].trim() + '.');
    });
    
    return keyPointSentences;
  };

  // Fonction pour générer des mots-clés associés
  const generateRelatedKeywords = (query: string, theme: string): string[] => {
    const baseKeywords = [query];
    let themeKeywords: string[] = [];
    
    // Générer des mots-clés spécifiques au thème
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
          `${query} conversion`,
          `${query} campagne`,
          `${query} objectifs`,
          `${query} budget`
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
          `${query} analytics`,
          `${query} sémantique`,
          `${query} position zéro`,
          `${query} e-réputation`
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
          `${query} ressources`,
          `${query} formation`,
          `${query} expertise`,
          `${query} comparatif`
        ];
    }
    
    const allKeywords = [...baseKeywords, ...themeKeywords];
    
    // Aléatoire dans le nombre de mots-clés retournés (entre 5 et 9)
    const numKeywords = Math.floor(Math.random() * 5) + 5;
    return shuffleArray(allKeywords).slice(0, numKeywords);
  };

  // Fonction pour générer des sources pertinentes
  const generateSources = (query: string, theme: string): { title: string; url: string }[] => {
    const sources = [];
    const queryFormatted = query.replace(/\s+/g, '-').toLowerCase();
    
    // Ajouter de la variété dans la génération des sources
    const currentYear = new Date().getFullYear();
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const dateStr = `${currentYear}-${String(randomMonth).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}`;
    
    // Domains variés pour les sources
    const domains = [
      "example.com",
      "expertguide.org",
      "proinsights.net",
      "industrytrends.io",
      "researchtopics.com",
      "digitalstrategies.co",
      "expertopinion.org",
      "businessanalytics.net"
    ];
    
    // Sélectionner 2 domaines aléatoires différents
    const selectedDomains = shuffleArray([...domains]).slice(0, 3);
    
    sources.push({ 
      title: `Guide complet sur ${query} (${currentYear})`, 
      url: `https://${selectedDomains[0]}/guide/${queryFormatted}?updated=${dateStr}` 
    });
    
    sources.push({ 
      title: `Statistiques et tendances: ${query} en ${currentYear}`, 
      url: `https://${selectedDomains[1]}/stats/${queryFormatted}-${currentYear}` 
    });
    
    // Sources spécifiques au thème
    switch (theme) {
      case 'seo':
        sources.push({ 
          title: `Étude de cas: Amélioration du classement pour "${query}" en ${Math.floor(Math.random() * 3) + 1} mois`, 
          url: `https://${selectedDomains[2]}/case-study/${queryFormatted}` 
        });
        break;
      case 'marketing':
        sources.push({ 
          title: `${Math.floor(Math.random() * 10) + 5} stratégies de ${query} prouvées par les données`, 
          url: `https://${selectedDomains[2]}/strategies/${queryFormatted}` 
        });
        break;
      case 'ecommerce':
        sources.push({
          title: `Optimisation de la conversion pour ${query}`,
          url: `https://${selectedDomains[2]}/conversion/${queryFormatted}`
        });
        break;
      case 'contenu':
        sources.push({
          title: `Stratégie de contenu pour ${query}: Guide étape par étape`,
          url: `https://${selectedDomains[2]}/strategy/${queryFormatted}`
        });
        break;
      case 'reseaux_sociaux':
        sources.push({
          title: `Comment utiliser ${query} sur les réseaux sociaux en ${currentYear}`,
          url: `https://${selectedDomains[2]}/howto/${queryFormatted}`
        });
        break;
      case 'voyage':
        sources.push({
          title: `Les meilleures destinations pour ${query} en ${currentYear}`,
          url: `https://${selectedDomains[2]}/destinations/${queryFormatted}`
        });
        break;
      case 'sante':
        sources.push({
          title: `Études scientifiques sur ${query} et la santé`,
          url: `https://${selectedDomains[2]}/research/${queryFormatted}`
        });
        break;
      case 'technologie':
        sources.push({
          title: `Comment implémenter ${query} dans votre entreprise`,
          url: `https://${selectedDomains[2]}/implementation/${queryFormatted}`
        });
        break;
      case 'business':
        sources.push({
          title: `Étude de cas: Comment ${query} a transformé notre entreprise`,
          url: `https://${selectedDomains[2]}/cases/${queryFormatted}`
        });
        break;
      default:
        sources.push({ 
          title: `FAQ sur ${query}: Réponses aux questions fréquentes`, 
          url: `https://${selectedDomains[2]}/faq/${queryFormatted}` 
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
    
    // Charger des questions suggérées aléatoires au démarrage en sélectionnant 2 catégories aléatoires
    const allCategories = Object.keys(suggestedQuestionsByCategory) as Array<keyof typeof suggestedQuestionsByCategory>;
    const randomCategories = shuffleArray(allCategories).slice(0, 2); // Prend 2 catégories au hasard
    
    let randomQuestions: string[] = [];
    randomCategories.forEach(category => {
      const categoryQuestions = suggestedQuestionsByCategory[category];
      // Ajoute 2-3 questions aléatoires de chaque catégorie
      const numToAdd = Math.floor(Math.random() * 2) + 2; // 2 ou 3 questions
      randomQuestions = [
        ...randomQuestions,
        ...shuffleArray(categoryQuestions).slice(0, numToAdd)
      ];
    });
    
    setSuggestedQuestions(randomQuestions);
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
