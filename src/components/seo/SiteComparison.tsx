
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Comparaison de sites</h2>
        {!site2 && (
          <Button onClick={() => onCompare('')} variant="outline">
            Ajouter un site à comparer
          </Button>
        )}
      </div>

      {site2 ? (
        <>
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <h3 className="font-semibold">{site1.url}</h3>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <h3 className="font-semibold">{site2.url}</h3>
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
                <Bar dataKey="site1" fill="#3b82f6" name={site1.url} />
                <Bar dataKey="site2" fill="#22c55e" name={site2.url} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="text-center p-8 text-gray-500">
          Ajoutez un second site pour voir la comparaison
        </div>
      )}
    </Card>
  );
};

export default SiteComparison;
