
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
    return [
      {
        title: `Guide complet sur ${searchKeyword} pour débutants`,
        url: `https://example.com/guide-${searchKeyword.toLowerCase().replace(/\s+/g, '-')}`,
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
        url: `https://example.com/strategies-${searchKeyword.toLowerCase().replace(/\s+/g, '-')}`,
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
        url: `https://example.com/optimiser-${searchKeyword.toLowerCase().replace(/\s+/g, '-')}`,
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
        url: `https://example.com/tendances-${searchKeyword.toLowerCase().replace(/\s+/g, '-')}`,
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
        url: `https://example.com/etude-cas-${searchKeyword.toLowerCase().replace(/\s+/g, '-')}`,
        visits: Math.floor(Math.random() * 7000) + 2500,
        backlinks: Math.floor(Math.random() * 45) + 18,
        socialShares: { 
          facebook: Math.floor(Math.random() * 190) + 60, 
          pinterest: Math.floor(Math.random() * 140) + 35, 
          reddit: Math.floor(Math.random() * 90) + 15 
        }
      }
    ];
  };

  const handleGenerateIdeas = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    toast.info("Génération d'idées en cours...");

    // Simulation d'un appel API avec génération basée sur le mot-clé
    setTimeout(() => {
      const generatedIdeas = generateIdeasForKeyword(keyword);
      setIdeas(generatedIdeas);
      setIsGenerating(false);
      toast.success(`${generatedIdeas.length} idées générées avec succès !`);
    }, 1500);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiée dans le presse-papier");
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
            Générez des idées de contenu créatives pour votre stratégie marketing.
          </p>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Entrez un mot-clé pour générer des idées..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerateIdeas()}
              />
              <Button 
                onClick={handleGenerateIdeas}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
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
                  <Card key={index} className="p-4 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium flex-1">
                          <a 
                            href={idea.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-blue-600 transition-colors inline-flex items-center gap-2"
                          >
                            {idea.title}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </h3>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="hover:text-blue-600">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-blue-600">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span>{idea.visits.toLocaleString()} visites/mois</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{idea.backlinks.toLocaleString()} backlinks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{Object.values(idea.socialShares).reduce((a, b) => a + b, 0).toLocaleString()} partages</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
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
                          className="gap-2"
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
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Aucune idée générée</h3>
                <p>Entrez un mot-clé et cliquez sur "Générer des idées" pour commencer.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default ContentIdeas;
