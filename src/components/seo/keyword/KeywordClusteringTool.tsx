
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { FolderTree, Target, TrendingUp, Download } from 'lucide-react';

interface KeywordClusteringToolProps {
  keywords: KeywordSuggestion[];
}

interface KeywordCluster {
  name: string;
  keywords: KeywordSuggestion[];
  avgVolume: number;
  avgDifficulty: number;
  totalVolume: number;
  intent: string;
}

const KeywordClusteringTool: React.FC<KeywordClusteringToolProps> = ({ keywords }) => {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const clusters = useMemo(() => {
    if (keywords.length === 0) return [];

    // Algorithme de clustering simple basé sur les mots communs
    const clusterMap = new Map<string, KeywordSuggestion[]>();
    
    keywords.forEach(kw => {
      const words = kw.keyword.toLowerCase().split(' ');
      let clusterFound = false;
      
      // Chercher un cluster existant avec des mots communs
      for (const [clusterName, clusterKeywords] of clusterMap.entries()) {
        const clusterWords = clusterName.toLowerCase().split(' ');
        const commonWords = words.filter(word => clusterWords.includes(word));
        
        if (commonWords.length > 0 || words.length === 1) {
          clusterKeywords.push(kw);
          clusterFound = true;
          break;
        }
      }
      
      // Si aucun cluster trouvé, créer un nouveau
      if (!clusterFound) {
        const mainWord = words[0] || kw.keyword;
        clusterMap.set(mainWord, [kw]);
      }
    });

    // Convertir en format de cluster avec statistiques
    return Array.from(clusterMap.entries()).map(([name, kwList]): KeywordCluster => {
      const totalVolume = kwList.reduce((sum, kw) => sum + (kw.volume || 0), 0);
      const avgVolume = Math.round(totalVolume / kwList.length);
      const avgDifficulty = Math.round(kwList.reduce((sum, kw) => sum + (kw.difficulty || 0), 0) / kwList.length);
      
      // Déterminer l'intention dominante
      const intentCounts = kwList.reduce((acc, kw) => {
        const intent = kw.intent || 'informational';
        acc[intent] = (acc[intent] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const dominantIntent = Object.entries(intentCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'informational';

      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        keywords: kwList,
        avgVolume,
        avgDifficulty,
        totalVolume,
        intent: dominantIntent
      };
    }).sort((a, b) => b.totalVolume - a.totalVolume);
  }, [keywords]);

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'commercial': return 'bg-blue-100 text-blue-800';
      case 'transactional': return 'bg-green-100 text-green-800';
      case 'navigational': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportCluster = (cluster: KeywordCluster) => {
    const csv = [
      'Mot-clé,Volume,Difficulté,CPC,Intention',
      ...cluster.keywords.map(kw => 
        `"${kw.keyword}",${kw.volume || 'N/A'},${kw.difficulty || 'N/A'},${kw.cpc || 'N/A'},${kw.intent || 'N/A'}`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cluster-${cluster.name.toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (keywords.length === 0) {
    return (
      <Card className="p-6 text-center">
        <FolderTree className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Aucun mot-clé à analyser</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FolderTree className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Clustering de mots-clés</h3>
        <Badge variant="outline">{clusters.length} clusters</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusters.map((cluster, index) => (
          <Card 
            key={index}
            className={`p-4 cursor-pointer transition-all ${
              selectedCluster === cluster.name ? 'ring-2 ring-purple-500' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedCluster(selectedCluster === cluster.name ? null : cluster.name)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{cluster.name}</h4>
              <Badge className={getIntentColor(cluster.intent)}>
                {cluster.intent}
              </Badge>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Mots-clés:</span>
                <span className="font-medium">{cluster.keywords.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Volume total:</span>
                <span className="font-medium">{cluster.totalVolume.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Difficulté moy.:</span>
                <span className="font-medium">{cluster.avgDifficulty}</span>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  exportCluster(cluster);
                }}
                className="flex-1"
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedCluster && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-medium mb-3">Détails du cluster: {selectedCluster}</h4>
          {clusters
            .find(c => c.name === selectedCluster)
            ?.keywords.map((kw, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 border rounded mb-2">
                <span>{kw.keyword}</span>
                <div className="flex gap-2 text-sm text-gray-600">
                  <span>Vol: {kw.volume?.toLocaleString()}</span>
                  <span>Diff: {kw.difficulty}</span>
                  {kw.cpc && <span>CPC: {kw.cpc}€</span>}
                </div>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
};

export default KeywordClusteringTool;
