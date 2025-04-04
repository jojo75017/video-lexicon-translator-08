
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
      const theme = detectTheme(searchQuery);
      let summary = '';
      let keyPoints: string[] = [];
      let relatedKeywords: string[] = [];
      
      // Contenus spécifiques par thème
      switch (theme) {
        case 'voyage':
          summary = `${searchQuery} est un domaine passionnant du tourisme qui offre de nombreuses opportunités pour découvrir de nouvelles cultures et destinations. Les experts recommandent de bien planifier son voyage, de comparer les offres, et de rester flexible sur les dates pour obtenir les meilleurs tarifs. Les dernières tendances montrent une préférence pour les expériences authentiques et les voyages responsables.`;
          
          keyPoints = [
            `Planifier à l'avance permet d'économiser jusqu'à 30% sur les tarifs`,
            `Les applications mobiles dédiées au voyage facilitent l'organisation`,
            `La flexibilité des dates peut réduire considérablement les coûts`,
            `L'assurance voyage est essentielle pour voyager l'esprit tranquille`,
            `Les avis en ligne sont précieux pour choisir les bonnes destinations`
          ];
          
          relatedKeywords = [
            `${searchQuery} économique`,
            `${searchQuery} dernière minute`,
            `${searchQuery} tout inclus`,
            `conseils ${searchQuery}`,
            `destinations populaires ${searchQuery}`,
            `${searchQuery} en famille`,
            `${searchQuery} hors saison`
          ];
          break;
          
        case 'marketing':
          summary = `${searchQuery} représente un pilier fondamental du marketing digital moderne. Les stratégies de ${searchQuery} efficaces impliquent une compréhension approfondie de votre audience cible, une analyse régulière des données, et une adaptation continue aux évolutions des algorithmes et des comportements des utilisateurs. L'investissement dans ${searchQuery} génère généralement un ROI supérieur aux méthodes traditionnelles.`;
          
          keyPoints = [
            `L'analyse concurrentielle est essentielle pour définir une stratégie de ${searchQuery} efficace`,
            `Le contenu de qualité reste le facteur n°1 pour réussir en ${searchQuery}`,
            `Les indicateurs clés de performance doivent être alignés avec vos objectifs business`,
            `L'approche mobile-first est désormais incontournable pour ${searchQuery}`,
            `L'optimisation de la vitesse et de l'expérience utilisateur impacte directement les résultats`
          ];
          
          relatedKeywords = [
            `${searchQuery} stratégie`,
            `${searchQuery} outils`,
            `${searchQuery} B2B`,
            `${searchQuery} ROI`,
            `${searchQuery} analytics`,
            `${searchQuery} tendances 2024`,
            `${searchQuery} optimisation`
          ];
          break;
          
        case 'technologie':
          summary = `${searchQuery} représente une avancée technologique significative qui transforme rapidement plusieurs secteurs d'activité. L'adoption de ${searchQuery} par les entreprises augmente de 35% chaque année, selon les dernières études. L'intégration de ${searchQuery} dans les processus existants peut entraîner des gains d'efficacité considérables et ouvrir de nouvelles opportunités d'innovation.`;
          
          keyPoints = [
            `L'investissement dans la formation est crucial pour maximiser le potentiel de ${searchQuery}`,
            `L'interopérabilité avec les systèmes existants reste un défi majeur pour ${searchQuery}`,
            `Les questions éthiques et de confidentialité doivent être adressées en amont`,
            `Le marché de ${searchQuery} devrait atteindre 500 milliards $ d'ici 2028`,
            `Les modèles open-source gagnent en popularité dans l'écosystème de ${searchQuery}`
          ];
          
          relatedKeywords = [
            `${searchQuery} implémentation`,
            `${searchQuery} cas d'usage`,
            `${searchQuery} sécurité`,
            `${searchQuery} dans le cloud`,
            `${searchQuery} vs technologies traditionnelles`,
            `futur de ${searchQuery}`,
            `${searchQuery} pour PME`
          ];
          break;
          
        case 'santé':
          summary = `${searchQuery} joue un rôle essentiel dans le bien-être global et la qualité de vie. Les recherches récentes montrent qu'une approche holistique de ${searchQuery} offre les meilleurs résultats à long terme. Il est recommandé de consulter des professionnels qualifiés avant d'entreprendre tout programme significatif lié à ${searchQuery}.`;
          
          keyPoints = [
            `La personnalisation est la clé du succès dans tout programme de ${searchQuery}`,
            `La cohérence et la régularité sont plus importantes que l'intensité`,
            `L'équilibre entre différents aspects de ${searchQuery} optimise les résultats`,
            `Les nouvelles technologies facilitent le suivi et l'amélioration de ${searchQuery}`,
            `L'approche préventive de ${searchQuery} gagne en reconnaissance scientifique`
          ];
          
          relatedKeywords = [
            `${searchQuery} naturel`,
            `${searchQuery} optimisation`,
            `${searchQuery} recherches récentes`,
            `${searchQuery} et stress`,
            `${searchQuery} pour débutants`,
            `${searchQuery} à domicile`,
            `${searchQuery} technologie`
          ];
          break;
          
        case 'business':
          summary = `${searchQuery} est un aspect fondamental du développement d'entreprise dans l'économie actuelle. Les stratégies de ${searchQuery} efficaces nécessitent une vision claire, une exécution disciplinée et une capacité d'adaptation au changement. Les entreprises leaders intègrent ${searchQuery} à tous les niveaux de leur organisation pour maintenir un avantage concurrentiel.`;
          
          keyPoints = [
            `Une culture d'entreprise alignée avec les objectifs de ${searchQuery} multiplie les chances de succès`,
            `L'analyse de données permet d'optimiser continuellement les stratégies de ${searchQuery}`,
            `Les partenariats stratégiques peuvent accélérer significativement vos initiatives de ${searchQuery}`,
            `La gestion efficace du changement est cruciale pour l'implémentation réussie de ${searchQuery}`,
            `Les modèles de ${searchQuery} agiles surpassent généralement les approches traditionnelles`
          ];
          
          relatedKeywords = [
            `${searchQuery} modèle`,
            `${searchQuery} stratégie`,
            `${searchQuery} innovation`,
            `${searchQuery} financement`,
            `${searchQuery} scalabilité`,
            `${searchQuery} international`,
            `${searchQuery} management`
          ];
          break;
          
        default: // cas général
          summary = `${searchQuery} est un domaine en pleine expansion qui gagne en popularité notamment grâce à ses applications diverses. Les experts recommandent une approche stratégique intégrée pour maximiser les résultats. Les dernières tendances montrent une évolution vers des techniques plus personnalisées et axées sur l'expérience utilisateur.`;
          
          keyPoints = [
            `L'importance de ${searchQuery} dans une stratégie globale`,
            `Les principales méthodes d'optimisation de ${searchQuery} en 2024`,
            `Comment mesurer l'efficacité de vos actions liées à ${searchQuery}`,
            `Les erreurs courantes à éviter dans l'implémentation de ${searchQuery}`,
            `Les tendances futures de ${searchQuery} pour les prochaines années`
          ];
          
          relatedKeywords = [
            `${searchQuery} optimisation`,
            `${searchQuery} stratégie`,
            `${searchQuery} analyse`,
            `tendances ${searchQuery}`,
            `outils ${searchQuery}`,
            `mesurer ${searchQuery}`,
            `${searchQuery} efficacité`
          ];
      }
      
      setSearchResult({
        summary,
        keyPoints,
        relatedKeywords,
        sources: [
          { title: `Guide complet sur ${searchQuery}`, url: "https://example.com/guide" },
          { title: `Étude de cas: Comment ${searchQuery} a transformé notre approche`, url: "https://example.com/case-study" },
          { title: `Les 10 meilleures pratiques pour ${searchQuery} en 2024`, url: "https://example.com/best-practices" }
        ]
      });
      setIsSearching(false);
    }, 1500);
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
                  placeholder="Ex: voyage, trip.com, SEO, e-commerce..."
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
