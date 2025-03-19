
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BrainCircuit, Copy, RefreshCw, Share2, ListChecks, LinkIcon, Globe, Tags } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AiSearchTab = () => {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    summary: string;
    keyPoints: string[];
    relatedKeywords: string[];
    sources: { title: string; url: string }[];
  } | null>(null);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez saisir un mot-clé pour la recherche");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate AI search with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock search results
      setSearchResults({
        summary: `"${keyword}" désigne un aspect important dans le domaine du marketing digital et du référencement. Les experts recommandent d'approfondir ce sujet pour améliorer la visibilité en ligne et l'engagement des utilisateurs. Les statistiques récentes montrent que les entreprises qui maîtrisent ${keyword} ont 47% plus de chances d'atteindre leurs objectifs commerciaux.`,
        
        keyPoints: [
          `L'utilisation stratégique de "${keyword}" peut augmenter le taux de conversion de 35% en moyenne`,
          `62% des experts considèrent "${keyword}" comme un facteur clé de succès digital en 2024`,
          `Les recherches liées à "${keyword}" ont augmenté de 78% au cours des 12 derniers mois`,
          `L'intégration de "${keyword}" dans une stratégie marketing génère un ROI supérieur de 41%`,
          `Les études montrent que "${keyword}" influence significativement le comportement des consommateurs`
        ],
        
        relatedKeywords: [
          `${keyword} stratégie`,
          `${keyword} optimisation`,
          `${keyword} tendances 2024`,
          `${keyword} meilleures pratiques`,
          `${keyword} analyse`,
          `${keyword} pour débutants`,
          `${keyword} avancé`,
          `${keyword} outils`
        ],
        
        sources: [
          { title: `Guide complet sur ${keyword} en 2024`, url: 'https://example.com/guide' },
          { title: `Comment optimiser votre stratégie de ${keyword}`, url: 'https://example.com/optimisation' },
          { title: `${keyword}: études de cas et exemples concrets`, url: 'https://example.com/etudes-cas' },
          { title: `L'avenir du ${keyword} selon les experts`, url: 'https://example.com/tendances' },
          { title: `Statistiques essentielles sur ${keyword}`, url: 'https://example.com/statistiques' }
        ]
      });
      
      toast.success(`Recherche sur "${keyword}" terminée !`);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast.error("Une erreur est survenue lors de la recherche");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copié dans le presse-papier`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit className="h-6 w-6 text-purple-700" />
          <h3 className="text-xl font-semibold">Recherche IA Avancée</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Obtenez des informations détaillées, des analyses et des tendances sur n'importe quel sujet grâce à notre moteur de recherche alimenté par l'IA.
        </p>
        
        <div className="flex items-center gap-3 mb-6">
          <Input
            placeholder="Entrez un mot-clé ou un sujet à rechercher..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={isLoading || !keyword.trim()}
            className="whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Recherche...
              </>
            ) : (
              <>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Rechercher
              </>
            )}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ) : searchResults ? (
          <div className="space-y-6">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Résumé</span>
                </TabsTrigger>
                <TabsTrigger value="keypoints" className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  <span>Points clés</span>
                </TabsTrigger>
                <TabsTrigger value="keywords" className="flex items-center gap-2">
                  <Tags className="h-4 w-4" />
                  <span>Mots-clés associés</span>
                </TabsTrigger>
                <TabsTrigger value="sources" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  <span>Sources</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="p-4 border rounded-md bg-white space-y-4">
                <div className="flex justify-between">
                  <h4 className="font-medium text-lg">Résumé</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(searchResults.summary, 'Résumé')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-gray-700 leading-relaxed">{searchResults.summary}</p>
              </TabsContent>
              
              <TabsContent value="keypoints" className="p-4 border rounded-md bg-white">
                <div className="flex justify-between mb-4">
                  <h4 className="font-medium text-lg">Points clés</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(searchResults.keyPoints.join('\n• '), 'Points clés')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <ul className="space-y-2 list-disc pl-5">
                  {searchResults.keyPoints.map((point, index) => (
                    <li key={index} className="text-gray-700">{point}</li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="keywords" className="p-4 border rounded-md bg-white">
                <div className="flex justify-between mb-4">
                  <h4 className="font-medium text-lg">Mots-clés associés</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(searchResults.relatedKeywords.join(', '), 'Mots-clés associés')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchResults.relatedKeywords.map((kw, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-sm hover:bg-purple-100 transition-colors cursor-pointer"
                      onClick={() => setKeyword(kw)}
                    >
                      {kw}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="sources" className="p-4 border rounded-md bg-white">
                <div className="flex justify-between mb-4">
                  <h4 className="font-medium text-lg">Sources</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(
                      searchResults.sources.map(s => `${s.title}: ${s.url}`).join('\n'),
                      'Sources'
                    )}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {searchResults.sources.map((source, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {source.title}
                      </a>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            copyToClipboard(source.url, 'URL');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(source.url, '_blank');
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default AiSearchTab;
