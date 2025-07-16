
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowUp, TrendingUp, Zap, LineChart } from 'lucide-react';
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface KeywordOpportunitiesProps {
  keywords: KeywordSuggestion[];
  mainKeyword: string;
}

const KeywordOpportunities: React.FC<KeywordOpportunitiesProps> = ({ keywords, mainKeyword }) => {
  // Fonction pour filtrer les mots-clés à forte opportunité
  const getHighOpportunityKeywords = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
    return keywords
      .filter(kw => kw.opportunity && kw.opportunity > 60)
      .sort((a, b) => (b.opportunity || 0) - (a.opportunity || 0))
      .slice(0, 5);
  };

  // Fonction pour filtrer les mots-clés à faible concurrence
  const getLowCompetitionKeywords = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
    return keywords
      .filter(kw => kw.difficulty && kw.difficulty < 30 && (kw.volume || 0) > 100)
      .sort((a, b) => (a.difficulty || 100) - (b.difficulty || 100))
      .slice(0, 5);
  };

  // Mots-clés à forte opportunité
  const highOpportunityKeywords = getHighOpportunityKeywords(keywords);
  
  // Mots-clés à faible concurrence
  const lowCompetitionKeywords = getLowCompetitionKeywords(keywords);

  // Fonction pour formater le volume
  const formatVolume = (volume?: number) => {
    if (!volume) return 'N/A';
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}k`;
    }
    return volume.toString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-500" />
          Opportunités pour "{mainKeyword}"
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Section des mots-clés à forte opportunité */}
          <div>
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Mots-clés à forte opportunité
            </h3>
            
            {highOpportunityKeywords.length > 0 ? (
              <div className="space-y-3">
                {highOpportunityKeywords.map((kw, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{kw.keyword}</span>
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                        {kw.opportunity}% d'opportunité
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Volume: {formatVolume(kw.volume)}
                      </span>
                      <span>Difficulté: {kw.difficulty || 'N/A'}</span>
                    </div>
                    <div className="mt-2">
                      <Progress 
                        value={kw.opportunity} 
                        className="h-1.5 bg-gray-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-2">
                Aucun mot-clé à forte opportunité trouvé.
              </p>
            )}
          </div>
          
          {/* Section des mots-clés à faible concurrence */}
          <div>
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-green-500" />
              Mots-clés faciles à positionner
            </h3>
            
            {lowCompetitionKeywords.length > 0 ? (
              <div className="space-y-3">
                {lowCompetitionKeywords.map((kw, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{kw.keyword}</span>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Difficulté: {kw.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Volume: {formatVolume(kw.volume)}
                      </span>
                      {kw.cpc && <span>CPC: {kw.cpc.toFixed(2)}€</span>}
                    </div>
                    <div className="mt-2">
                      <Progress 
                        value={100 - (kw.difficulty || 0)} 
                        className="h-1.5 bg-gray-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-2">
                Aucun mot-clé à faible concurrence trouvé.
              </p>
            )}
          </div>
          
          {/* Conseils d'experts */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Conseil d'optimisation
            </h3>
            <p className="text-blue-700 text-sm">
              Pour maximiser votre visibilité, concentrez-vous sur les mots-clés à forte opportunité et faible concurrence. 
              Créez du contenu de qualité autour de ces termes et suivez régulièrement votre positionnement.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordOpportunities;
