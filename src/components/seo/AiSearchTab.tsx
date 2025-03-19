
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, RefreshCw, BookOpen, Lightbulb, Link as LinkIcon, Hash } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const AiSearchTab = () => {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  interface SearchResults {
    summary: string;
    keyPoints: string[];
    relatedKeywords: string[];
    sources: {
      title: string;
      url: string;
      relevance: number;
    }[];
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      toast.error("Veuillez saisir un mot-clé");
      return;
    }
    
    setIsLoading(true);
    
    // Simulation d'une recherche IA
    setTimeout(() => {
      const mockResults: SearchResults = {
        summary: `Le mot-clé "${keyword}" est un sujet important dans le domaine du marketing digital et du SEO. D'après notre analyse, ce terme est recherché environ 5 400 fois par mois en France, avec un CPC moyen de 1,20€. Les utilisateurs qui recherchent ce terme sont généralement intéressés par des guides pratiques, des tutoriels et des études de cas. Le contenu qui fonctionne le mieux pour ce mot-clé combine des explications techniques avec des exemples concrets et des visualisations. La concurrence pour ce terme est modérée (difficulté de 62/100), ce qui signifie qu'il y a une opportunité réelle de se positionner avec du contenu de qualité. Les recherches associées à ce terme indiquent une intention d'information plutôt que d'achat, suggerant qu'un contenu éducatif serait plus approprié qu'un contenu commercial.`,
        keyPoints: [
          `"${keyword}" génère environ 5 400 recherches mensuelles en France`,
          `La concurrence est modérée avec un score de difficulté de 62/100`,
          `L'intention de recherche est principalement informative`,
          `Le contenu mixant théorie et pratique obtient les meilleurs résultats`,
          `Les articles de plus de 1 800 mots sont mieux classés pour ce mot-clé`,
          `Les utilisateurs passent en moyenne 4 minutes 30 sur les pages bien positionnées`,
          `73% des recherches proviennent d'appareils mobiles`
        ],
        relatedKeywords: [
          `${keyword} guide`,
          `${keyword} exemple`,
          `comment utiliser ${keyword}`,
          `${keyword} vs ${keyword.split(' ')[0]} traditionnel`,
          `meilleures pratiques ${keyword}`,
          `${keyword} pour débutants`,
          `${keyword} avancé`,
          `outils pour ${keyword}`
        ],
        sources: [
          {
            title: `Guide complet sur ${keyword}`,
            url: "https://example.com/guide",
            relevance: 92
          },
          {
            title: `Les tendances ${keyword} en 2024`,
            url: "https://example.com/trends",
            relevance: 88
          },
          {
            title: `Étude de cas: Comment Entreprise X a réussi avec ${keyword}`,
            url: "https://example.com/case-study",
            relevance: 84
          },
          {
            title: `${keyword}: Statistiques et chiffres clés`,
            url: "https://example.com/stats",
            relevance: 78
          }
        ]
      };
      
      setSearchResults(mockResults);
      setIsLoading(false);
      toast.success(`Recherche IA complétée pour "${keyword}"`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
            <Search className="h-5 w-5 text-purple-600" />
            Recherche IA
          </CardTitle>
          <p className="text-sm text-purple-600">
            Analysez n'importe quel mot-clé pour obtenir des insights approfondis générés par l'IA
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Entrez un mot-clé à analyser..."
              className="flex-1 border-purple-200 focus-visible:ring-purple-500"
            />
            <Button 
              type="submit" 
              className="bg-purple-700 hover:bg-purple-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searchResults && (
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Résumé</span>
              </TabsTrigger>
              <TabsTrigger value="keypoints" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Points clés</span>
              </TabsTrigger>
              <TabsTrigger value="keywords" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                <span className="hidden sm:inline">Mots-clés associés</span>
              </TabsTrigger>
              <TabsTrigger value="sources" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Sources</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analyse IA pour "{keyword}"</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {searchResults.summary}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="keypoints" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Points clés</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {searchResults.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{point}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="keywords" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mots-clés associés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.relatedKeywords.map((kw, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="px-3 py-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 cursor-pointer"
                        onClick={() => {
                          setKeyword(kw);
                          toast.info(`Mot-clé "${kw}" sélectionné. Cliquez sur Analyser pour lancer la recherche.`);
                        }}
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sources" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sources et références</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {searchResults.sources.map((source, index) => (
                        <div key={index} className="flex justify-between items-start p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                            <h3 className="font-medium text-blue-600 hover:underline">
                              <a href={source.url} target="_blank" rel="noopener noreferrer">
                                {source.title}
                              </a>
                            </h3>
                            <p className="text-xs text-gray-500 truncate">{source.url}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Pertinence:</span>
                            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  source.relevance > 85 ? 'bg-green-500' : 
                                  source.relevance > 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${source.relevance}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{source.relevance}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center py-3 px-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              Analyse générée par IA basée sur le mot-clé: <span className="font-semibold">{keyword}</span>
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setKeyword('');
                setSearchResults(null);
              }}
              className="text-purple-700 border-purple-200 hover:bg-purple-100"
            >
              Nouvelle recherche
            </Button>
          </div>
        </div>
      )}
      
      {!searchResults && !isLoading && (
        <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Commencez une recherche IA</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Entrez un mot-clé ci-dessus pour obtenir une analyse détaillée générée par notre IA. Vous recevrez un résumé, des points clés, des mots-clés associés et des sources pertinentes.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["marketing digital", "SEO", "stratégie de contenu", "réseaux sociaux", "e-commerce"].map((suggestion, i) => (
                <Badge 
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setKeyword(suggestion);
                    toast.info(`Mot-clé "${suggestion}" sélectionné. Cliquez sur Analyser pour lancer la recherche.`);
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AiSearchTab;
