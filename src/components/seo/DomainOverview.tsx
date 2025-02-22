
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface DomainMetrics {
  authority: number;
  totalPages: number;
  backlinks: number;
  organicTraffic: number;
  performance: number;
  security: number;
}

const DomainOverview = () => {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<DomainMetrics | null>(null);

  const exampleDomains = [
    'worldwildlife.org',
    'unicef.org/stories',
    'edition.cnn.com'
  ];

  const analyzeDomain = async (domainToAnalyze: string) => {
    setIsLoading(true);
    try {
      // Simulation de l'analyse pour la démo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockMetrics: DomainMetrics = {
        authority: Math.floor(Math.random() * 40) + 60,
        totalPages: Math.floor(Math.random() * 50000) + 10000,
        backlinks: Math.floor(Math.random() * 100000) + 5000,
        organicTraffic: Math.floor(Math.random() * 1000000) + 50000,
        performance: Math.floor(Math.random() * 30) + 70,
        security: Math.floor(Math.random() * 20) + 80
      };
      
      setMetrics(mockMetrics);
      toast.success(`Analyse de ${domainToAnalyze} terminée`);
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Vue d'ensemble du domaine</h2>
      <p className="text-gray-600 mb-6">
        Identifiez facilement les atouts et les points faibles de votre concurrent ou client potentiel.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="domain-input" className="block text-sm font-medium text-gray-700 mb-2">
            Entrez le domaine, le sous-domaine ou l'URL
          </label>
          <div className="flex gap-2">
            <Input
              id="domain-input"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="exemple.com"
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              Analyser
            </Button>
          </div>
        </div>
      </form>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Exemples :</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-green-50 to-teal-50">
            <div className="font-semibold text-gray-600">Autorité du domaine</div>
            <div className="text-2xl font-bold text-green-600">{metrics.authority}/100</div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="font-semibold text-gray-600">Pages indexées</div>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.totalPages.toLocaleString()}
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="font-semibold text-gray-600">Backlinks</div>
            <div className="text-2xl font-bold text-purple-600">
              {metrics.backlinks.toLocaleString()}
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50">
            <div className="font-semibold text-gray-600">Trafic organique mensuel</div>
            <div className="text-2xl font-bold text-orange-600">
              {metrics.organicTraffic.toLocaleString()}
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50">
            <div className="font-semibold text-gray-600">Performance</div>
            <div className="text-2xl font-bold text-teal-600">{metrics.performance}/100</div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50">
            <div className="font-semibold text-gray-600">Sécurité</div>
            <div className="text-2xl font-bold text-red-600">{metrics.security}/100</div>
          </Card>
        </div>
      ) : null}
    </Card>
  );
};

export default DomainOverview;
