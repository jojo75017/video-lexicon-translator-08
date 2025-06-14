
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

  const handleGenerateIdeas = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    toast.info("Génération d'idées en cours...");

    // Simulation d'un appel API
    setTimeout(() => {
      const generatedIdeas: ContentIdea[] = [
        {
          title: `Guide complet sur ${keyword} pour débutants`,
          url: `https://example.com/guide-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
          visits: 12500,
          backlinks: 45,
          socialShares: { facebook: 230, pinterest: 180, reddit: 95 }
        },
        {
          title: `Les 10 meilleures stratégies de ${keyword}`,
          url: `https://example.com/strategies-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
          visits: 8200,
          backlinks: 32,
          socialShares: { facebook: 150, pinterest: 120, reddit: 68 }
        },
        {
          title: `Comment optimiser ${keyword} en 2024`,
          url: `https://example.com/optimiser-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
          visits: 15600,
          backlinks: 58,
          socialShares: { facebook: 340, pinterest: 220, reddit: 125 }
        },
        {
          title: `${keyword} : Tendances et prévisions 2024`,
          url: `https://example.com/tendances-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
          visits: 9800,
          backlinks: 28,
          socialShares: { facebook: 190, pinterest: 140, reddit: 85 }
        },
        {
          title: `Étude de cas : Réussir avec ${keyword}`,
          url: `https://example.com/etude-cas-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
          visits: 7400,
          backlinks: 35,
          socialShares: { facebook: 160, pinterest: 110, reddit: 70 }
        }
      ];

      setIdeas(generatedIdeas);
      setIsGenerating(false);
      toast.success("Idées générées avec succès !");
    }, 2000);
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
                          <span>{idea.visits.toLocaleString()} visites</span>
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
              <div className="text-center py-8 text-gray-500">
                Entrez un mot-clé et cliquez sur "Générer des idées" pour commencer.
              </div>
            )}
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default ContentIdeas;
