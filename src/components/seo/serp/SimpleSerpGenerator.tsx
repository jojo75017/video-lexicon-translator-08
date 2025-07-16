import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Globe, 
  ExternalLink, 
  Loader2,
  Copy,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface SerpResult {
  position: number;
  title: string;
  url: string;
  domain: string;
  description: string;
}

const SimpleSerpGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serpResults, setSerpResults] = useState<SerpResult[]>([]);

  const frenchTravelSites = [
    {
      domain: 'carrefourvoyages.fr',
      name: 'Carrefour Voyages',
      description: 'Séjours et circuits au meilleur prix'
    },
    {
      domain: 'voyages.leclerc',
      name: 'Leclerc Voyages',
      description: 'Offres exceptionnelles et prix garantis'
    },
    {
      domain: 'voyage-privé.com',
      name: 'Voyage Privé',
      description: 'Ventes flash et séjours de luxe'
    },
    {
      domain: 'promovacances.com',
      name: 'Promovacances',
      description: 'Vacances pas chères, tout compris'
    },
    {
      domain: 'lastminute.com',
      name: 'Last Minute',
      description: 'Séjours de dernière minute'
    },
    {
      domain: 'booking.com',
      name: 'Booking.com',
      description: 'Réservation d\'hôtels dans le monde entier'
    },
    {
      domain: 'expedia.fr',
      name: 'Expedia France',
      description: 'Vols, hôtels et séjours combinés'
    },
    {
      domain: 'kayak.fr',
      name: 'KAYAK',
      description: 'Comparateur de voyages et vols'
    },
    {
      domain: 'opodo.fr',
      name: 'Opodo',
      description: 'Vols, hôtels et voitures de location'
    },
    {
      domain: 'tripadvisor.fr',
      name: 'TripAdvisor',
      description: 'Avis et conseils de voyage'
    }
  ];

  const generateSerpResults = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simuler un délai d'API  
      await new Promise(resolve => setTimeout(resolve, 1000));

      const results: SerpResult[] = frenchTravelSites.map((site, index) => {
        return {
          position: index + 1,
          title: `${site.name} - ${keyword} | Réservation en ligne`,
          url: `https://${site.domain}`,
          domain: site.domain,
          description: `Découvrez nos offres ${keyword.toLowerCase()} sur ${site.name}. ${site.description}. Réservation sécurisée et service client français.`
        };
      });

      setSerpResults(results);
      toast.success(`✅ ${results.length} résultats SERP générés pour "${keyword}"`);
      
    } catch (error) {
      console.error('Erreur génération SERP:', error);
      toast.error('❌ Erreur lors de la génération des résultats');
    } finally {
      setIsLoading(false);
    }
  };

  const copyUrls = () => {
    const urls = serpResults.map(result => result.url).join('\n');
    navigator.clipboard.writeText(urls);
    toast.success('URLs copiées dans le presse-papier');
  };

  const exportData = () => {
    const data = {
      keyword,
      timestamp: new Date().toISOString(),
      results: serpResults,
      totalResults: serpResults.length
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serp-${keyword.replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Données exportées');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            Générateur SERP - Sites Français
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Générez automatiquement les URLs des principaux sites français pour votre mot-clé
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Entrez votre mot-clé (ex: voyage Dubai, séjour Bali)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && generateSerpResults()}
              />
              <Button onClick={generateSerpResults} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Générer SERP
                  </>
                )}
              </Button>
            </div>
            
            {serpResults.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyUrls}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier URLs ({serpResults.length})
                </Button>
                <Button variant="outline" size="sm" onClick={exportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter JSON
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Résultats SERP */}
      {serpResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Résultats SERP - "{keyword}"
              <Badge variant="outline">{serpResults.length} résultats</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {serpResults.map((result) => (
                <div key={result.position} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="w-8 h-6 flex items-center justify-center text-xs">
                          {result.position}
                        </Badge>
                        <span className="text-sm text-green-600 font-medium">{result.domain}</span>
                      </div>
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h3 className="font-medium text-blue-600 hover:underline cursor-pointer mb-2">
                          {result.title}
                        </h3>
                      </a>
                      <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline font-mono bg-muted px-2 py-1 rounded inline-block"
                      >
                        {result.url}
                      </a>
                    </div>
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2"
                    >
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimpleSerpGenerator;