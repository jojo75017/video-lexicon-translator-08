
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

  // Fonction pour détecter le thème principal de la recherche
  const detectTheme = (query: string): 'voyage' | 'marketing' | 'technologie' | 'santé' | 'business' | 'général' => {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('voyage') || queryLower.includes('trip') || queryLower.includes('tour') || 
        queryLower.includes('destination') || queryLower.includes('visiter')) {
      return 'voyage';
    } 
    else if (queryLower.includes('seo') || queryLower.includes('marketing') || queryLower.includes('digital') || 
             queryLower.includes('social') || queryLower.includes('contenu')) {
      return 'marketing';
    } 
    else if (queryLower.includes('tech') || queryLower.includes('ai') || queryLower.includes('ia') || 
             queryLower.includes('intelligence') || queryLower.includes('développement') || 
             queryLower.includes('code') || queryLower.includes('web')) {
      return 'technologie';
    } 
    else if (queryLower.includes('santé') || queryLower.includes('bien') || queryLower.includes('nutrition') || 
             queryLower.includes('régime') || queryLower.includes('fitness')) {
      return 'santé';
    }
    else if (queryLower.includes('business') || queryLower.includes('entreprise') || queryLower.includes('startup') || 
             queryLower.includes('entrepreneur') || queryLower.includes('finance')) {
      return 'business';
    }
    
    return 'général';
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Veuillez saisir un mot-clé pour la recherche");
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      // Utiliser la fonction getResponseForQuestion pour obtenir une réponse pertinente
      const response = getResponseForQuestion(searchQuery);
      
      // Extraire des points clés basés sur la réponse
      const keyPoints = extractKeyPoints(response);
      
      // Générer des mots-clés associés
      const relatedKeywords = generateRelatedKeywords(searchQuery);
      
      setSearchResult({
        summary: response,
        keyPoints,
        relatedKeywords,
        sources: generateSources(searchQuery)
      });
      
      setIsSearching(false);
    }, 1500);
  };

  // Fonction pour extraire des points clés à partir d'une longue réponse
  const extractKeyPoints = (response: string): string[] => {
    // Recherche des points marqués par des puces ou numéros dans la réponse
    const bulletPoints = response.match(/•\s+(.*?)(?=\s+•|\n|$)/g);
    
    if (bulletPoints && bulletPoints.length >= 3) {
      return bulletPoints.map(point => point.replace('• ', '').trim()).slice(0, 5);
    }
    
    // Si pas de points avec puces, extraire des phrases clés
    const sentences = response.split(/\.\s+/);
    const keyPointSentences = sentences
      .filter(sentence => 
        sentence.length > 30 && 
        sentence.length < 150 &&
        !sentence.startsWith('En') &&
        !sentence.startsWith('Il') &&
        !sentence.startsWith('Cette')
      )
      .slice(0, 5);
    
    return keyPointSentences.map(sentence => sentence.trim() + '.');
  };

  // Fonction pour générer des mots-clés associés
  const generateRelatedKeywords = (query: string): string[] => {
    const theme = detectTheme(query);
    const baseKeywords = [query];
    
    switch (theme) {
      case 'marketing':
        baseKeywords.push(
          `${query} stratégie`,
          `${query} outils`,
          `${query} 2024`,
          `${query} tendances`,
          `${query} mesure performance`,
          `${query} vs concurrence`
        );
        break;
      case 'voyage':
        baseKeywords.push(
          `${query} pas cher`,
          `${query} meilleure saison`,
          `${query} conseils`,
          `${query} expériences`,
          `${query} hébergement`,
          `${query} transport local`
        );
        break;
      case 'technologie':
        baseKeywords.push(
          `${query} applications`,
          `${query} formation`,
          `${query} tendances`,
          `${query} comparatif`,
          `${query} implémentation`,
          `${query} coûts`
        );
        break;
      case 'santé':
        baseKeywords.push(
          `${query} bienfaits`,
          `${query} risques`,
          `${query} recherches scientifiques`,
          `${query} témoignages`,
          `${query} alternatives`,
          `${query} routine quotidienne`
        );
        break;
      case 'business':
        baseKeywords.push(
          `${query} modèle`,
          `${query} financement`,
          `${query} scalabilité`,
          `${query} études de cas`,
          `${query} KPIs`,
          `${query} optimisation`
        );
        break;
      default:
        baseKeywords.push(
          `${query} définition`,
          `${query} exemples`,
          `${query} avantages`,
          `${query} inconvénients`,
          `${query} alternatives`,
          `${query} guide`
        );
    }
    
    // Retourner une sélection aléatoire de mots-clés (entre 5 et 7)
    return shuffleArray(baseKeywords).slice(0, Math.floor(Math.random() * 3) + 5);
  };

  // Fonction pour générer des sources pertinentes
  const generateSources = (query: string): { title: string; url: string }[] => {
    const theme = detectTheme(query);
    const sources = [];
    
    // Source 1: Guide général
    sources.push({ 
      title: `Guide complet sur ${query}`, 
      url: "https://example.com/guide" 
    });
    
    // Source 2: Étude de cas
    sources.push({ 
      title: `Étude de cas: L'impact de ${query} sur les résultats d'entreprise`, 
      url: "https://example.com/case-study" 
    });
    
    // Source 3: Tendances
    sources.push({ 
      title: `Les 10 meilleures pratiques pour ${query} en 2024`, 
      url: "https://example.com/best-practices" 
    });
    
    // Sources additionnelles selon le thème
    switch (theme) {
      case 'marketing':
        sources.push({ 
          title: `Comment mesurer le ROI de vos stratégies de ${query}`, 
          url: "https://example.com/roi-measurement" 
        });
        break;
      case 'voyage':
        sources.push({ 
          title: `Témoignages de voyageurs: Expériences de ${query}`, 
          url: "https://example.com/traveler-experiences" 
        });
        break;
      case 'technologie':
        sources.push({ 
          title: `L'avenir de ${query}: Tendances et prévisions`, 
          url: "https://example.com/future-trends" 
        });
        break;
      default:
        sources.push({ 
          title: `FAQ sur ${query}: Réponses aux questions courantes`, 
          url: "https://example.com/faq" 
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

  return (
    <div>
      <Button
        variant="outline"
        className="flex flex-row items-center gap-2 py-3 px-4 text-center border-blue-500 text-blue-500 hover:bg-blue-50"
        onClick={() => setIsOpen(true)}
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
                  placeholder="Ex: voyage, SEO, e-commerce, marketing digital..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? "Recherche..." : "Rechercher"}
                </Button>
              </div>
            </div>
            
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
