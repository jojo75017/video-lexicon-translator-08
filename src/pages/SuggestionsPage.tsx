
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageSquarePlus, Lightbulb, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { toast } from "sonner";

const SuggestionsPage = () => {
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<null | {
    topics: Array<{title: string, description: string, difficulty: string, volume: string}>;
    questions: Array<string>;
    trendingTopics: Array<{percentage: string, topic: string}>;
    competitorTopics: Array<{title: string, traffic: string}>;
    opportunities: Array<{title: string, description: string}>;
  }>(null);
  
  const handleGenerateIdeas = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    setIsGenerating(true);
    toast.info(`Génération d'idées pour "${keyword}"...`);
    
    // Simulation d'un appel API avec un délai
    setTimeout(() => {
      // Créer des idées basées sur le mot-clé
      const keywordLower = keyword.toLowerCase();
      
      const generatedData = {
        topics: [
          {
            title: `Guide complet sur ${keyword} en 2024`,
            description: `Tout ce que vous devez savoir pour réussir dans le domaine de ${keyword}.`,
            difficulty: "Moyenne",
            volume: "3.2K"
          },
          {
            title: `Les 10 meilleures stratégies de ${keyword}`,
            description: `Découvrez les techniques éprouvées pour optimiser vos performances en ${keyword}.`,
            difficulty: "Facile",
            volume: "2.4K"
          },
          {
            title: `Comment débuter dans ${keyword} sans budget`,
            description: `Guide pratique pour les débutants qui souhaitent se lancer dans ${keyword}.`,
            difficulty: "Facile",
            volume: "1.8K"
          },
          {
            title: `Analyse comparative des plateformes de ${keyword}`,
            description: `Évaluation détaillée des différentes solutions disponibles pour ${keyword}.`,
            difficulty: "Difficile",
            volume: "1.5K"
          }
        ],
        questions: [
          `Comment optimiser ses revenus avec ${keyword}?`,
          `Quelle est la différence entre ${keyword} et marketing traditionnel?`,
          `Combien peut-on gagner avec ${keyword} en France?`,
          `Quelles sont les meilleures niches pour ${keyword} en 2024?`,
          `Comment créer une stratégie efficace de ${keyword}?`
        ],
        trendingTopics: [
          { percentage: "+73%", topic: `${keyword} pour e-commerce` },
          { percentage: "+52%", topic: `${keyword} sur les réseaux sociaux` },
          { percentage: "+41%", topic: `Outils d'automatisation pour ${keyword}` }
        ],
        competitorTopics: [
          { title: `Guide ultime : Comment maximiser vos gains avec ${keyword}`, traffic: "~4.8K" },
          { title: `Les erreurs à éviter en ${keyword}`, traffic: "~3.2K" },
          { title: `${keyword} vs autres sources de revenus: Analyse comparative`, traffic: "~2.9K" },
          { title: `Étude de cas: Comment nous avons généré 10K€/mois avec ${keyword}`, traffic: "~2.1K" }
        ],
        opportunities: [
          { 
            title: `${keyword} pour les débutants: Guide étape par étape`, 
            description: "Faible concurrence, volume de recherche élevé" 
          },
          { 
            title: `Outils essentiels pour ${keyword} en 2024`, 
            description: "Sujet tendance, concurrence modérée" 
          },
          { 
            title: `${keyword} dans le secteur ${keywordLower.includes('affili') ? 'du voyage' : 'de la santé'}`, 
            description: "Niche spécifique peu exploitée" 
          }
        ]
      };
      
      setGeneratedIdeas(generatedData);
      setIsGenerating(false);
      toast.success(`Idées générées pour "${keyword}"`, {
        description: "Explorez les différents onglets pour découvrir toutes les suggestions"
      });
    }, 1500);
  };
  
  const handleCreateContent = (title: string, description: string) => {
    const prompt = encodeURIComponent(`Rédige un article détaillé sur le sujet suivant: "${title}". 
Description: ${description}

L'article doit être structuré avec une introduction, plusieurs parties détaillées, et une conclusion.`);
    
    // Ouvrir ChatGPT avec le prompt prérempli
    window.open(`https://chat.openai.com/chat?model=text-davinci-002-render-sha&prompt=${prompt}`, '_blank');
    
    toast.success(`Redirection vers ChatGPT pour créer: "${title}"`, {
      description: "Un nouvel onglet s'est ouvert avec votre prompt"
    });
  };
  
  const handleCreateFromQuestion = (question: string) => {
    const prompt = encodeURIComponent(`Réponds de façon détaillée à la question suivante: "${question}"

Ta réponse doit être:
- Complète et informative
- Structurée avec des sous-parties
- Basée sur des informations factuelles`);
    
    // Ouvrir ChatGPT avec le prompt prérempli
    window.open(`https://chat.openai.com/chat?model=text-davinci-002-render-sha&prompt=${prompt}`, '_blank');
    
    toast.success(`Redirection vers ChatGPT pour répondre à: "${question}"`, {
      description: "Un nouvel onglet s'est ouvert avec votre prompt"
    });
  };
  
  const handleCreateFromTrend = (trend: string) => {
    const prompt = encodeURIComponent(`Rédige un article complet sur la tendance suivante: "${trend}"

L'article doit inclure:
- Pourquoi cette tendance est en croissance
- Comment en tirer profit
- Des exemples concrets d'application
- Des prédictions pour l'avenir`);
    
    // Ouvrir ChatGPT avec le prompt prérempli
    window.open(`https://chat.openai.com/chat?model=text-davinci-002-render-sha&prompt=${prompt}`, '_blank');
    
    toast.success(`Redirection vers ChatGPT pour explorer: "${trend}"`, {
      description: "Un nouvel onglet s'est ouvert avec votre prompt"
    });
  };

  return (
    <PageLayout title="Suggestions de Contenu" description="Générez des idées pour votre contenu web">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Suggestions de Contenu</h1>
        
        <Card className="p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="keyword-search" className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher des idées autour d'un sujet
            </label>
            <div className="flex gap-2">
              <Input
                id="keyword-search"
                placeholder="Entrez un mot-clé ou un sujet"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
                disabled={isGenerating}
              />
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={handleGenerateIdeas}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Génération...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Générer des idées
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="topics">
            <TabsList className="mb-4">
              <TabsTrigger value="topics">Sujets</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="trending">Tendances</TabsTrigger>
              <TabsTrigger value="competitors">Concurrents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="topics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedIdeas ? (
                  generatedIdeas.topics.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span>Difficulté: {item.difficulty}</span>
                          <span>•</span>
                          <span>Volume: {item.volume}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                          onClick={() => handleCreateContent(item.title, item.description)}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Créer
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Saisissez un mot-clé et cliquez sur "Générer des idées" pour obtenir des suggestions de sujets.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="questions">
              <div className="space-y-4">
                {generatedIdeas ? (
                  generatedIdeas.questions.map((question, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                            <Lightbulb className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">{question}</h3>
                            <p className="text-gray-600 text-sm">
                              Cette question est recherchée ~{Math.floor(Math.random() * 500 + 300)} fois par mois
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600"
                          onClick={() => handleCreateFromQuestion(question)}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Saisissez un mot-clé et cliquez sur "Générer des idées" pour obtenir des questions fréquemment posées.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="trending">
              <div className="space-y-4">
                {generatedIdeas ? (
                  <>
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
                      <h3 className="text-lg font-medium text-indigo-900 mb-2">Tendances actuelles dans votre secteur</h3>
                      <p className="text-indigo-700 mb-4">
                        Basé sur les recherches populaires des 30 derniers jours
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {generatedIdeas.trendingTopics.map((trend, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="text-xl font-bold text-indigo-600">{trend.percentage}</div>
                            <div className="text-gray-600 text-sm mt-1">
                              {trend.topic}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-medium">
                        Sujets en forte croissance à explorer
                      </div>
                      <div className="divide-y divide-gray-200">
                        {[
                          `${keyword} pour les débutants`,
                          `Optimisation de ${keyword} pour le ROI`,
                          `${keyword} et automatisation`,
                          `Stratégies avancées de ${keyword}`,
                          `Comment mesurer l'efficacité de vos campagnes de ${keyword}`
                        ].map((topic, index) => (
                          <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50">
                            <div>{topic}</div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600"
                              onClick={() => handleCreateFromTrend(topic)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Sélectionner
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Saisissez un mot-clé et cliquez sur "Générer des idées" pour découvrir les tendances actuelles.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="competitors">
              <div className="space-y-6">
                {generatedIdeas ? (
                  <>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="font-medium mb-3">Sujets populaires de vos concurrents</h3>
                      <div className="space-y-3">
                        {generatedIdeas.competitorTopics.map((topic, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium">{topic.title}</div>
                            <div className="text-sm text-gray-500">{topic.traffic} visiteurs/mois</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="font-medium mb-3">Opportunités à saisir</h3>
                      <div className="space-y-3">
                        {generatedIdeas.opportunities.map((opportunity, index) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="font-medium text-green-800">{opportunity.title}</div>
                            <div className="mt-1 text-sm text-green-600">
                              {opportunity.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Saisissez un mot-clé et cliquez sur "Générer des idées" pour analyser ce que font vos concurrents.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SuggestionsPage;
