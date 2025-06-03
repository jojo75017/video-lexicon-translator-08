
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { Building2, Target, Eye, TrendingUp, ExternalLink } from 'lucide-react';

interface CompetitiveIntelligenceProps {
  keywords: KeywordSuggestion[];
}

interface CompetitorData {
  domain: string;
  strength: number;
  keywords: string[];
  estimatedTraffic: number;
  topKeywords: { keyword: string; position: number; volume: number; }[];
  gaps: string[];
}

const CompetitiveIntelligence: React.FC<CompetitiveIntelligenceProps> = ({ keywords }) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  const competitorAnalysis = useMemo(() => {
    if (keywords.length === 0) return [];

    // Simulation de données concurrentielles
    const competitors: CompetitorData[] = [
      {
        domain: 'concurrent1.com',
        strength: 85,
        keywords: keywords.slice(0, 8).map(kw => kw.keyword),
        estimatedTraffic: 45000,
        topKeywords: keywords.slice(0, 5).map((kw, idx) => ({
          keyword: kw.keyword,
          position: idx + 1,
          volume: kw.volume || 1000
        })),
        gaps: keywords.slice(8, 12).map(kw => kw.keyword)
      },
      {
        domain: 'concurrent2.com',
        strength: 72,
        keywords: keywords.slice(2, 10).map(kw => kw.keyword),
        estimatedTraffic: 28000,
        topKeywords: keywords.slice(2, 7).map((kw, idx) => ({
          keyword: kw.keyword,
          position: idx + 2,
          volume: kw.volume || 800
        })),
        gaps: keywords.slice(10, 14).map(kw => kw.keyword)
      },
      {
        domain: 'concurrent3.com',
        strength: 63,
        keywords: keywords.slice(4, 12).map(kw => kw.keyword),
        estimatedTraffic: 17500,
        topKeywords: keywords.slice(4, 9).map((kw, idx) => ({
          keyword: kw.keyword,
          position: idx + 3,
          volume: kw.volume || 600
        })),
        gaps: keywords.slice(14, 18).map(kw => kw.keyword)
      }
    ];

    return competitors;
  }, [keywords]);

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-red-600 bg-red-50';
    if (strength >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600 bg-green-50';
    if (position <= 10) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  if (keywords.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Aucune donnée concurrentielle disponible</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold">Intelligence concurrentielle</h3>
          <Badge variant="outline">{competitorAnalysis.length} concurrents</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {competitorAnalysis.map((competitor, index) => (
            <Card 
              key={index}
              className={`p-4 cursor-pointer transition-all ${
                selectedCompetitor === competitor.domain ? 'ring-2 ring-red-500' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedCompetitor(
                selectedCompetitor === competitor.domain ? null : competitor.domain
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{competitor.domain}</h4>
                <Badge className={getStrengthColor(competitor.strength)}>
                  Force: {competitor.strength}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trafic estimé:</span>
                  <span className="font-medium">{competitor.estimatedTraffic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mots-clés communs:</span>
                  <span className="font-medium">{competitor.keywords.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Opportunités gaps:</span>
                  <span className="font-medium text-green-600">{competitor.gaps.length}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://${competitor.domain}`, '_blank');
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Visiter
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {selectedCompetitor && (
        <Card className="p-6">
          {(() => {
            const competitor = competitorAnalysis.find(c => c.domain === selectedCompetitor);
            if (!competitor) return null;

            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Analyse détaillée: {competitor.domain}</h4>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Analyser en profondeur
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      Top mots-clés
                    </h5>
                    <div className="space-y-2">
                      {competitor.topKeywords.map((kw, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{kw.keyword}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={getPositionColor(kw.position)}>
                              #{kw.position}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {kw.volume.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Opportunités gaps
                    </h5>
                    <div className="space-y-2">
                      {competitor.gaps.map((gap, idx) => (
                        <div key={idx} className="p-2 border rounded bg-green-50">
                          <span className="text-sm">{gap}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            Non ciblé
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
};

export default CompetitiveIntelligence;
