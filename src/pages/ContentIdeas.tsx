
import React, { useState } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, ExternalLink, Copy, Bookmark, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

interface ContentIdea {
  title: string;
  url: string;
  visits: number;
  backlinks: number;
  socialShares: {
    facebook: number;
    pinterest: number;
    reddit: number;
  };
}

const ContentIdeas = () => {
  const [keyword, setKeyword] = useState('');
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateIdeasForKeyword = (searchKeyword: string): ContentIdea[] => {
    const baseUrl = 'https://example.com';
    const slug = searchKeyword.toLowerCase().replace(/\s+/g, '-');
    
    return [
      {
        title: `Guide complet : ${searchKeyword} pour débutants`,
        url: `${baseUrl}/guide-${slug}-debutants`,
        visits: Math.floor(Math.random() * 10000) + 5000,
        backlinks: Math.floor(Math.random() * 50) + 20,
        socialShares: { 
          facebook: Math.floor(Math.random() * 300) + 100, 
          pinterest: Math.floor(Math.random() * 200) + 50, 
          reddit: Math.floor(Math.random() * 150) + 30 
        }
      },
      {
        title: `Les 10 meilleures stratégies de ${searchKeyword}`,
        url: `${baseUrl}/10-strategies-${slug}`,
        visits: Math.floor(Math.random() * 8000) + 3000,
        backlinks: Math.floor(Math.random() * 40) + 15,
        socialShares: { 
          facebook: Math.floor(Math.random() * 250) + 80, 
          pinterest: Math.floor(Math.random() * 180) + 40, 
          reddit: Math.floor(Math.random() * 120) + 25 
        }
      },
      {
        title: `Comment optimiser ${searchKeyword} en 2024`,
        url: `${baseUrl}/optimiser-${slug}-2024`,
        visits: Math.floor(Math.random() * 12000) + 6000,
        backlinks: Math.floor(Math.random() * 60) + 25,
        socialShares: { 
          facebook: Math.floor(Math.random() * 400) + 150, 
          pinterest: Math.floor(Math.random() * 250) + 80, 
          reddit: Math.floor(Math.random() * 180) + 50 
        }
      },
      {
        title: `${searchKeyword} : Tendances et prévisions 2024`,
        url: `${baseUrl}/tendances-${slug}-2024`,
        visits: Math.floor(Math.random() * 9000) + 4000,
        backlinks: Math.floor(Math.random() * 35) + 12,
        socialShares: { 
          facebook: Math.floor(Math.random() * 220) + 70, 
          pinterest: Math.floor(Math.random() * 160) + 45, 
          reddit: Math.floor(Math.random() * 100) + 20 
        }
      },
      {
        title: `Étude de cas : Réussir avec ${searchKeyword}`,
        url: `${baseUrl}/etude-cas-${slug}`,
        visits: Math.floor(Math.random() * 7000) + 2500,
        backlinks: Math.floor(Math.random() * 45) + 18,
        socialShares: { 
          facebook: Math.floor(Math.random() * 190) + 60, 
          pinterest: Math.floor(Math.random() * 140) + 35, 
          reddit: Math.floor(Math.random() * 90) + 15 
        }
      },
      {
        title: `${searchKeyword} : Erreurs à éviter absolument`,
        url: `${baseUrl}/erreurs-${slug}`,
        visits: Math.floor(Math.random() * 6000) + 2000,
        backlinks: Math.floor(Math.random() * 30) + 10,
        socialShares: { 
          facebook: Math.floor(Math.random() * 150) + 50, 
          pinterest: Math.floor(Math.random() * 100) + 30, 
          reddit: Math.floor(Math.random() * 80) + 10 
        }
      }
    ];
  };

  const handleGenerateIdeas = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    toast.info("Génération d'idées en cours...");

    try {
      // Simulation d'un appel API avec délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generatedIdeas = generateIdeasForKeyword(keyword);
      setIdeas(generatedIdeas);
      toast.success(`${generatedIdeas.length} idées générées avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error("Erreur lors de la génération des idées");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiée dans le presse-papier");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerateIdeas();
    }
  };

  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">Idées de Contenu</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Générez des idées de contenu créatives et populaires pour votre stratégie marketing.
          </p>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Entrez un mot-clé pour générer des idées (ex: SEO, marketing digital, voyage Rome)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleGenerateIdeas}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
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

            {ideas.length > 0 && (
              <div className="grid gap-4 mt-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {ideas.length} idées d'articles trouvées pour "{keyword}"
                  </h2>
                  <p className="text-gray-600">
                    Cliquez sur les articles pour les consulter ou copiez leurs URLs
                  </p>
                </div>
                
                {ideas.map((idea, index) => (
                  <Card key={index} className="p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium flex-1 pr-4">
                          <span className="hover:text-blue-600 transition-colors cursor-pointer">
                            {idea.title}
                          </span>
                        </h3>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button variant="ghost" size="sm" className="hover:text-blue-600">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-yellow-600">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{idea.visits.toLocaleString()}</span>
                          <span>visites/mois</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{idea.backlinks.toLocaleString()}</span>
                          <span>backlinks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {Object.values(idea.socialShares).reduce((a, b) => a + b, 0).toLocaleString()}
                          </span>
                          <span>partages sociaux</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyUrl(idea.url)}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copier URL
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => window.open(idea.url, '_blank')}
                          className="gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Voir l'article
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!ideas.length && !isGenerating && (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Aucune idée générée</h3>
                <p>Entrez un mot-clé et cliquez sur "Générer des idées" pour commencer.</p>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Exemples : "SEO", "marketing digital", "voyage Rome", "cuisine italienne"</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default ContentIdeas;
