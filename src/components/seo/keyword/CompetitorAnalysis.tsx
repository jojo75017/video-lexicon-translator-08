
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ExternalLink, TrendingUp } from 'lucide-react';

interface CompetitorAnalysisProps {
  keyword: string;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ keyword }) => {
  const competitors = [
    {
      name: "Competitor 1",
      url: "https://example1.com",
      domain: "example1.com",
      title: `Guide ${keyword} - Site Leader`,
      description: `Description optimisée pour ${keyword}`,
      ranking: 1,
      traffic: 150000,
      strength: 85,
      authority: 90
    },
    {
      name: "Competitor 2", 
      url: "https://example2.com",
      domain: "example2.com",
      title: `${keyword} - Solutions Expertes`,
      description: `Tout savoir sur ${keyword}`,
      ranking: 2,
      traffic: 120000,
      strength: 78,
      authority: 82
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-orange-500" />
          Analyse Concurrentielle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {competitors.map((competitor, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{competitor.title}</h3>
                  <p className="text-sm text-green-600">{competitor.url}</p>
                  <p className="text-sm text-gray-600 mt-1">{competitor.description}</p>
                </div>
                <Badge variant="outline">#{competitor.ranking}</Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Trafic</span>
                  <div className="font-semibold">{competitor.traffic.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Force SEO</span>
                  <div className="font-semibold text-blue-600">{competitor.strength}/100</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Autorité</span>
                  <div className="font-semibold text-purple-600">{competitor.authority}/100</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Position</span>
                  <div className="font-semibold">#{competitor.ranking}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorAnalysis;
