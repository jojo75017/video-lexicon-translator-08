
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { Lightbulb, TrendingUp, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface KeywordInsightsAnalyzerProps {
  keywords: KeywordSuggestion[];
}

interface Insight {
  type: 'opportunity' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  keywords: string[];
  action: string;
  impact: 'Élevé' | 'Moyen' | 'Faible';
}

const KeywordInsightsAnalyzer: React.FC<KeywordInsightsAnalyzerProps> = ({ keywords }) => {
  const insights = useMemo(() => {
    if (keywords.length === 0) return [];

    const analysisInsights: Insight[] = [];

    // Analyse 1: Mots-clés à faible concurrence
    const lowCompetitionKeywords = keywords.filter(kw => (kw.difficulty || 0) < 30 && (kw.volume || 0) > 500);
    if (lowCompetitionKeywords.length > 0) {
      analysisInsights.push({
        type: 'opportunity',
        title: 'Opportunités à faible concurrence détectées',
        description: `${lowCompetitionKeywords.length} mots-clés avec un bon volume et une faible difficulté`,
        keywords: lowCompetitionKeywords.slice(0, 3).map(kw => kw.keyword),
        action: 'Créez du contenu prioritaire sur ces mots-clés',
        impact: 'Élevé'
      });
    }

    // Analyse 2: Mots-clés à fort volume mais haute difficulté
    const highVolumeHighDifficulty = keywords.filter(kw => (kw.volume || 0) > 2000 && (kw.difficulty || 0) > 70);
    if (highVolumeHighDifficulty.length > 0) {
      analysisInsights.push({
        type: 'warning',
        title: 'Mots-clés très concurrentiels identifiés',
        description: `${highVolumeHighDifficulty.length} mots-clés à fort volume mais très difficiles à positionner`,
        keywords: highVolumeHighDifficulty.slice(0, 3).map(kw => kw.keyword),
        action: 'Concentrez-vous sur des variantes longue traîne',
        impact: 'Moyen'
      });
    }

    // Analyse 3: Équilibre des intentions de recherche
    const intentDistribution = keywords.reduce((acc, kw) => {
      const intent = kw.intent || 'informational';
      acc[intent] = (acc[intent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalKeywords = keywords.length;
    const informationalPercentage = (intentDistribution.informational || 0) / totalKeywords * 100;

    if (informationalPercentage > 80) {
      analysisInsights.push({
        type: 'info',
        title: 'Stratégie orientée contenu informatif',
        description: `${informationalPercentage.toFixed(0)}% de vos mots-clés sont informationnels`,
        keywords: [],
        action: 'Équilibrez avec des mots-clés commerciaux et transactionnels',
        impact: 'Moyen'
      });
    }

    // Analyse 4: Mots-clés saisonniers
    const seasonalKeywords = keywords.filter(kw => 
      kw.keyword.toLowerCase().includes('noël') ||
      kw.keyword.toLowerCase().includes('été') ||
      kw.keyword.toLowerCase().includes('vacances') ||
      kw.keyword.toLowerCase().includes('rentrée')
    );

    if (seasonalKeywords.length > 0) {
      analysisInsights.push({
        type: 'info',
        title: 'Mots-clés saisonniers détectés',
        description: `${seasonalKeywords.length} mots-clés avec des pics saisonniers identifiés`,
        keywords: seasonalKeywords.slice(0, 3).map(kw => kw.keyword),
        action: 'Planifiez votre contenu en fonction des saisons',
        impact: 'Moyen'
      });
    }

    // Analyse 5: Mots-clés longue traîne
    const longTailKeywords = keywords.filter(kw => kw.keyword.split(' ').length >= 4);
    if (longTailKeywords.length > keywords.length * 0.4) {
      analysisInsights.push({
        type: 'success',
        title: 'Bonne stratégie longue traîne',
        description: `${longTailKeywords.length} mots-clés longue traîne identifiés (${(longTailKeywords.length/keywords.length*100).toFixed(0)}%)`,
        keywords: longTailKeywords.slice(0, 3).map(kw => kw.keyword),
        action: 'Continuez à développer des variantes spécifiques',
        impact: 'Élevé'
      });
    }

    // Analyse 6: Potentiel de trafic
    const totalPotentialTraffic = keywords.reduce((sum, kw) => sum + (kw.volume || 0) * 0.1, 0); // 10% du volume
    if (totalPotentialTraffic > 5000) {
      analysisInsights.push({
        type: 'opportunity',
        title: 'Fort potentiel de trafic identifié',
        description: `Potentiel estimé de ${Math.round(totalPotentialTraffic).toLocaleString()} visiteurs/mois`,
        keywords: [],
        action: 'Optimisez votre stratégie de contenu pour maximiser ce potentiel',
        impact: 'Élevé'
      });
    }

    return analysisInsights;
  }, [keywords]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default: return <Lightbulb className="h-5 w-5 text-purple-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-orange-500 bg-orange-50';
      case 'success': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-purple-500 bg-purple-50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Élevé': return 'bg-red-100 text-red-800';
      case 'Moyen': return 'bg-orange-100 text-orange-800';
      case 'Faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (keywords.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Lightbulb className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Aucune analyse disponible</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-600" />
        <h3 className="text-lg font-semibold">Insights et recommandations</h3>
        <Badge variant="outline">{insights.length} analyses</Badge>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <Card key={index} className={`p-4 border-l-4 ${getInsightColor(insight.type)}`}>
            <div className="flex items-start gap-3">
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge className={getImpactColor(insight.impact)} variant="outline">
                    Impact {insight.impact}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                
                {insight.keywords.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500">Exemples: </span>
                    <span className="text-xs text-gray-600">
                      {insight.keywords.join(', ')}
                    </span>
                  </div>
                )}
                
                <div className="bg-white p-2 rounded border text-sm">
                  <span className="font-medium text-blue-600">💡 Action recommandée: </span>
                  {insight.action}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Aucun insight spécifique détecté</p>
          <p className="text-sm">Générez plus de mots-clés pour obtenir des analyses détaillées</p>
        </div>
      )}
    </Card>
  );
};

export default KeywordInsightsAnalyzer;
