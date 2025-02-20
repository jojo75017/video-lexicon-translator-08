
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SeoAnalysis } from '@/types/seo';

interface SiteComparisonProps {
  site1: {
    url: string;
    analysis: SeoAnalysis;
  };
  site2?: {
    url: string;
    analysis: SeoAnalysis;
  };
  onCompare: (url: string) => void;
}

const SiteComparison = ({ site1, site2, onCompare }: SiteComparisonProps) => {
  const [competitorUrl, setCompetitorUrl] = React.useState('');

  const getComparisonData = () => {
    if (!site2) return [];

    return [
      {
        metric: 'Score SEO',
        site1: site1.analysis.readabilityScore,
        site2: site2.analysis.readabilityScore,
      },
      {
        metric: 'Temps de chargement',
        site1: site1.analysis.performance.loadTime,
        site2: site2.analysis.performance.loadTime,
      },
      {
        metric: 'Mots clés',
        site1: site1.analysis.keywords.length,
        site2: site2.analysis.keywords.length,
      },
      {
        metric: 'Liens internes',
        site1: site1.analysis.internalLinks,
        site2: site2.analysis.internalLinks,
      },
      {
        metric: 'Liens externes',
        site1: site1.analysis.externalLinks,
        site2: site2.analysis.externalLinks,
      },
    ];
  };

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (competitorUrl) {
      onCompare(competitorUrl);
      setCompetitorUrl('');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Comparaison de sites</h2>
      </div>

      {!site2 ? (
        <form onSubmit={handleCompare} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="competitor-url" className="text-sm font-medium text-gray-700">
              URL du site concurrent
            </label>
            <div className="flex gap-2">
              <Input
                id="competitor-url"
                type="url"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="https://concurrent.com"
                className="flex-1"
              />
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90">
                Comparer
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="text-blue-800 font-semibold mb-1">Votre site</div>
                <div className="text-lg font-bold text-blue-900 break-all">{site1.url}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="text-green-800 font-semibold mb-1">Site concurrent</div>
                <div className="text-lg font-bold text-green-900 break-all">{site2.url}</div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onCompare('')}
                  className="mt-2 text-sm text-green-700 hover:text-green-800 hover:bg-green-100"
                >
                  Changer de concurrent
                </Button>
              </div>
            </div>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getComparisonData()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="metric" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="site1" fill="#3b82f6" name="Votre site" />
                <Bar dataKey="site2" fill="#22c55e" name="Site concurrent" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-sm text-gray-600 flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Votre site</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Site concurrent</span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default SiteComparison;

