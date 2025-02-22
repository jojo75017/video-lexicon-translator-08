
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Link2, LineChart, Award, Search, Globe } from "lucide-react";

interface OrganicMetrics {
  serpRanking: number;
  topKeywords: {
    keyword: string;
    position: number;
    volume: number;
  }[];
  organicVisibility: number;
  competitorGap: {
    competitor: string;
    gap: number;
  }[];
}

const OrganicSearch = () => {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<OrganicMetrics | null>(null);

  const exampleDomains = [
    'worldwildlife.org',
    'unicef.org/stories',
    'edition.cnn.com'
  ];

  const analyzeDomain = async (domainToAnalyze: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockMetrics: OrganicMetrics = {
        serpRanking: Math.floor(Math.random() * 20) + 1,
        topKeywords: [
          {
            keyword: "boutique en ligne",
            position: Math.floor(Math.random() * 10) + 1,
            volume: Math.floor(Math.random() * 10000) + 1000
          },
          {
            keyword: "e-commerce solution",
            position: Math.floor(Math.random() * 10) + 1,
            volume: Math.floor(Math.random() * 8000) + 1000
          },
          {
            keyword: "acheter en ligne",
            position: Math.floor(Math.random() * 10) + 1,
            volume: Math.floor(Math.random() * 6000) + 1000
          }
        ],
        organicVisibility: Math.floor(Math.random() * 50) + 50,
        competitorGap: [
          {
            competitor: "concurrent-1.com",
            gap: Math.floor(Math.random() * 30) - 15
          },
          {
            competitor: "concurrent-2.com",
            gap: Math.floor(Math.random() * 30) - 15
          },
          {
            competitor: "concurrent-3.com",
            gap: Math.floor(Math.random() * 30) - 15
          }
        ]
      };
      
      setMetrics(mockMetrics);
      toast.success(`Analyse du trafic organique de ${domainToAnalyze} terminée`);
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
        <h2 className="text-2xl font-bold">Insights de Trafic Organique</h2>
        <p className="text-gray-600">
          Solution facile pour les mots clés « not provided » qui combine les données de Google Analytics, 
          de Search Console et de Semrush. Découvrez les véritables moteurs de votre trafic organique.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="domain-input" className="block text-sm font-medium text-gray-700 mb-2">
            Saisissez un domaine, sous-domaine ou URL
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

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Exemples de domaines :</p>
        <div className="flex flex-wrap gap-2">
          {exampleDomains.map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              onClick={() => {
                setDomain(example);
                analyzeDomain(example);
              }}
              className="text-xs"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ) : metrics ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-600">Position SERP moyenne</div>
                  <div className="text-2xl font-bold text-green-600">#{metrics.serpRanking}</div>
                </div>
                <Award className="h-6 w-6 text-green-500" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-600">Visibilité organique</div>
                  <div className="text-2xl font-bold text-blue-600">{metrics.organicVisibility}%</div>
                </div>
                <LineChart className="h-6 w-6 text-blue-500" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-600">Backlinks qualifiés</div>
                  <div className="text-2xl font-bold text-purple-600">{Math.floor(Math.random() * 1000) + 100}</div>
                </div>
                <Link2 className="h-6 w-6 text-purple-500" />
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mots-clés principaux (sans « not provided »)</h3>
            <div className="space-y-2">
              {metrics.topKeywords.map((keyword, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg bg-white flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{keyword.keyword}</div>
                    <div className="text-sm text-gray-500">Position: #{keyword.position}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{keyword.volume.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">recherches/mois</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Écart avec les concurrents</h3>
            <div className="space-y-2">
              {metrics.competitorGap.map((competitor, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg bg-white flex justify-between items-center"
                >
                  <div className="font-medium">{competitor.competitor}</div>
                  <div className={`font-semibold ${
                    competitor.gap > 0 
                      ? 'text-green-600' 
                      : competitor.gap < 0 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                  }`}>
                    {competitor.gap > 0 ? '+' : ''}{competitor.gap}%
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

export default OrganicSearch;

