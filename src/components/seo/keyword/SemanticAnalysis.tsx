
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target } from 'lucide-react';
import { SemanticCluster } from '@/types/seo/Keyword';

interface SemanticAnalysisProps {
  keyword: string;
}

const SemanticAnalysis: React.FC<SemanticAnalysisProps> = ({ keyword }) => {
  const clusters: SemanticCluster[] = [
    {
      id: '1',
      name: `Guide ${keyword}`,
      mainTopic: `${keyword} guide complet`,
      keywords: [`guide ${keyword}`, `comment ${keyword}`, `${keyword} tutoriel`],
      intent: 'informational',
      difficulty: 35,
      opportunity: 85,
      contentType: 'Guide détaillé'
    },
    {
      id: '2', 
      name: `${keyword} commercial`,
      mainTopic: `${keyword} prix et achat`,
      keywords: [`${keyword} prix`, `acheter ${keyword}`, `${keyword} pas cher`],
      intent: 'commercial',
      difficulty: 55,
      opportunity: 70,
      contentType: 'Page commerciale'
    },
    {
      id: '3',
      name: `${keyword} comparatif`,
      mainTopic: `meilleur ${keyword}`,
      keywords: [`meilleur ${keyword}`, `${keyword} comparatif`, `top ${keyword}`],
      intent: 'transactional',
      difficulty: 65,
      opportunity: 60,
      contentType: 'Comparatif'
    },
    {
      id: '4',
      name: `${keyword} conseils`,
      mainTopic: `${keyword} astuces`,
      keywords: [`${keyword} conseils`, `${keyword} astuces`, `${keyword} tips`],
      intent: 'informational',
      difficulty: 25,
      opportunity: 90,
      contentType: 'Article conseil'
    }
  ];

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'informational': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'transactional': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOpportunityColor = (opportunity: number) => {
    if (opportunity >= 80) return 'text-green-600';
    if (opportunity >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Analyse Sémantique
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{cluster.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{cluster.mainTopic}</p>
                </div>
                <Badge className={getIntentColor(cluster.intent)}>
                  {cluster.intent}
                </Badge>
              </div>
              
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Mots-clés du cluster :</h4>
                <div className="flex flex-wrap gap-2">
                  {cluster.keywords.map((kw, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Difficulté</span>
                  <div className="font-medium">{cluster.difficulty}/100</div>
                </div>
                <div>
                  <span className="text-gray-600">Opportunité</span>
                  <div className={`font-medium ${getOpportunityColor(cluster.opportunity)}`}>
                    {cluster.opportunity}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Type de contenu</span>
                  <div className="font-medium">{cluster.contentType}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SemanticAnalysis;
