
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Link2, Target, Settings, Search, Globe } from "lucide-react";

interface ProspectData {
  domain: string;
  authority: number;
  relevance: number;
  contactEmail?: string;
  outboundLinks: number;
  category: string;
}

interface TargetingStrategy {
  name: string;
  description: string;
  minimumAuthority: number;
  relevanceThreshold: number;
}

interface TrackingParameter {
  name: string;
  value: string;
  description: string;
}

const LinkBuilding = () => {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prospects, setProspects] = useState<ProspectData[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('authority');

  const targetingStrategies: TargetingStrategy[] = [
    {
      name: 'authority',
      description: 'Cible les sites à forte autorité de domaine',
      minimumAuthority: 40,
      relevanceThreshold: 0.6
    },
    {
      name: 'relevance',
      description: 'Prioritise les sites avec un contenu très pertinent',
      minimumAuthority: 30,
      relevanceThreshold: 0.8
    },
    {
      name: 'balanced',
      description: 'Équilibre entre autorité et pertinence',
      minimumAuthority: 35,
      relevanceThreshold: 0.7
    },
    {
      name: 'quantity',
      description: 'Maximise le nombre de prospects',
      minimumAuthority: 20,
      relevanceThreshold: 0.5
    },
    {
      name: 'quality',
      description: 'Cible uniquement les meilleurs sites',
      minimumAuthority: 50,
      relevanceThreshold: 0.9
    },
    {
      name: 'niche',
      description: 'Focus sur les sites de niche spécialisés',
      minimumAuthority: 25,
      relevanceThreshold: 0.95
    },
    {
      name: 'news',
      description: 'Cible les sites d'actualités et blogs',
      minimumAuthority: 45,
      relevanceThreshold: 0.65
    },
    {
      name: 'local',
      description: 'Optimisé pour le SEO local',
      minimumAuthority: 30,
      relevanceThreshold: 0.75
    },
    {
      name: 'edu',
      description: 'Focus sur les institutions éducatives',
      minimumAuthority: 60,
      relevanceThreshold: 0.8
    },
    {
      name: 'gov',
      description: 'Cible les sites gouvernementaux',
      minimumAuthority: 70,
      relevanceThreshold: 0.85
    }
  ];

  const trackingParameters: TrackingParameter[] = [
    {
      name: 'utm_source',
      value: domain,
      description: 'Source du trafic'
    },
    {
      name: 'utm_medium',
      value: 'backlink',
      description: 'Canal marketing'
    },
    {
      name: 'utm_campaign',
      value: `linkbuilding_${selectedStrategy}`,
      description: 'Nom de la campagne'
    },
    {
      name: 'utm_content',
      value: 'article',
      description: 'Type de contenu'
    }
  ];

  const analyzeDomain = async (domainToAnalyze: string) => {
    setIsLoading(true);
    try {
      // Simuler un appel API avec un délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer des données de test
      const mockProspects: ProspectData[] = Array.from({ length: 10 }, (_, index) => ({
        domain: `prospect${index + 1}.com`,
        authority: Math.floor(Math.random() * 60) + 20,
        relevance: Number((Math.random() * 0.5 + 0.5).toFixed(2)),
        contactEmail: Math.random() > 0.3 ? `contact@prospect${index + 1}.com` : undefined,
        outboundLinks: Math.floor(Math.random() * 100) + 50,
        category: ['Blog', 'News', 'Education', 'Business', 'Technology'][Math.floor(Math.random() * 5)]
      }));
      
      setProspects(mockProspects);
      toast.success('Analyse des prospects de backlinks terminée');
    } catch (error) {
      toast.error("Erreur lors de l'analyse du domaine");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain) {
      analyzeDomain(domain);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Link Building</h2>
        <p className="text-gray-600">
          Un outil puissant pour créer rapidement et facilement des backlinks.
          Trouvez plus de 2 000 prospects pour chaque domaine avec nos 10 stratégies
          de ciblage prédéfinies et 4 paramètres de suivi.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="domain-input" className="block text-sm font-medium text-gray-700 mb-2">
            Saisissez un domaine
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="domain-input"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="exemple.com"
                className="pl-10"
              />
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white min-w-[120px]"
            >
              {isLoading ? (
                <>Analyse...</>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ) : prospects.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-600">Prospects trouvés</div>
                  <div className="text-2xl font-bold text-blue-600">2 000+</div>
                </div>
                <Link2 className="h-6 w-6 text-blue-500" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-600">Stratégies disponibles</div>
                  <div className="text-2xl font-bold text-purple-600">10</div>
                </div>
                <Target className="h-6 w-6 text-purple-500" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-600">Paramètres de suivi</div>
                  <div className="text-2xl font-bold text-green-600">4</div>
                </div>
                <Settings className="h-6 w-6 text-green-500" />
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stratégies de ciblage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {targetingStrategies.map((strategy) => (
                <Button
                  key={strategy.name}
                  variant={selectedStrategy === strategy.name ? "default" : "outline"}
                  className="justify-start h-auto py-4 px-4"
                  onClick={() => setSelectedStrategy(strategy.name)}
                >
                  <div className="text-left">
                    <div className="font-medium">{strategy.name}</div>
                    <div className="text-sm text-gray-500">{strategy.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Paramètres de suivi</h3>
            <div className="space-y-2">
              {trackingParameters.map((param) => (
                <div
                  key={param.name}
                  className="p-3 border rounded-lg bg-white flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{param.name}</div>
                    <div className="text-sm text-gray-500">{param.description}</div>
                  </div>
                  <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {param.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Prospects de backlinks</h3>
            <div className="space-y-2">
              {prospects.map((prospect, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-white"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{prospect.domain}</div>
                      <div className="text-sm text-gray-500">{prospect.category}</div>
                    </div>
                    <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      DA: {prospect.authority}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-600">
                      Pertinence: {(prospect.relevance * 100).toFixed(0)}%
                    </div>
                    <div className="text-gray-600">
                      {prospect.outboundLinks} liens sortants
                    </div>
                    {prospect.contactEmail && (
                      <div className="text-blue-600">
                        {prospect.contactEmail}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

export default LinkBuilding;

