
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Network, Search, Filter, Download } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface KeywordClusteringToolProps {
  keywords: KeywordSuggestion[];
}

interface KeywordCluster {
  id: string;
  name: string;
  keywords: KeywordSuggestion[];
  totalVolume: number;
  avgDifficulty: number;
  priority: 'haute' | 'moyenne' | 'basse';
  contentType: 'pillar' | 'cluster' | 'support';
}

const KeywordClusteringTool: React.FC<KeywordClusteringToolProps> = ({ keywords }) => {
  const [clusters, setClusters] = useState<KeywordCluster[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'haute' | 'moyenne' | 'basse'>('all');

  const generateClusters = async () => {
    if (keywords.length === 0) {
      toast.error("Aucun mot-clé à analyser");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      // Simulation de clustering intelligent
      const clustersData: KeywordCluster[] = [];
      
      // Grouper les mots-clés par thème
      const themes = ['achat', 'guide', 'comparaison', 'prix', 'avis'];
      
      themes.forEach((theme, index) => {
        const relatedKeywords = keywords.filter(kw => 
          kw.keyword.toLowerCase().includes(theme) || 
          Math.random() > 0.6
        ).slice(0, Math.floor(Math.random() * 5) + 3);

        if (relatedKeywords.length > 0) {
          const totalVolume = relatedKeywords.reduce((sum, kw) => sum + (kw.volume || 0), 0);
          const avgDifficulty = relatedKeywords.reduce((sum, kw) => sum + (kw.difficulty || 50), 0) / relatedKeywords.length;
          
          const priorities: KeywordCluster['priority'][] = ['haute', 'moyenne', 'basse'];
          const contentTypes: KeywordCluster['contentType'][] = ['pillar', 'cluster', 'support'];
          
          clustersData.push({
            id: `cluster-${index}`,
            name: `Cluster ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
            keywords: relatedKeywords,
            totalVolume,
            avgDifficulty: Math.round(avgDifficulty),
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            contentType: contentTypes[Math.floor(Math.random() * contentTypes.length)]
          });
        }
      });

      setClusters(clustersData);
      setIsGenerating(false);
      toast.success(`${clustersData.length} clusters générés`);
    }, 3000);
  };

  const getPriorityColor = (priority: KeywordCluster['priority']) => {
    switch (priority) {
      case 'haute': return 'bg-red-100 text-red-800';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'basse': return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeIcon = (type: KeywordCluster['contentType']) => {
    switch (type) {
      case 'pillar': return '🏛️';
      case 'cluster': return '🌐';
      case 'support': return '🔧';
    }
  };

  const getContentTypeLabel = (type: KeywordCluster['contentType']) => {
    switch (type) {
      case 'pillar': return 'Page Pilier';
      case 'cluster': return 'Cluster Principal';
      case 'support': return 'Contenu Support';
    }
  };

  const exportClusters = () => {
    if (clusters.length === 0) return;
    
    const exportData = clusters.map(cluster => ({
      'Nom du Cluster': cluster.name,
      'Mots-clés': cluster.keywords.map(kw => kw.keyword).join(', '),
      'Volume Total': cluster.totalVolume,
      'Difficulté Moyenne': cluster.avgDifficulty,
      'Priorité': cluster.priority,
      'Type de Contenu': getContentTypeLabel(cluster.contentType)
    }));
    
    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clusters-mots-cles.csv';
    link.click();
    
    toast.success('Clusters exportés en CSV');
  };

  const filteredClusters = clusters.filter(cluster => {
    const matchesSearch = cluster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cluster.keywords.some(kw => kw.keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = selectedPriority === 'all' || cluster.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5 text-blue-500" />
          Clustering de mots-clés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={generateClusters}
            disabled={isGenerating || keywords.length === 0}
            className="gap-2"
          >
            {isGenerating ? (
              <>Génération en cours...</>
            ) : (
              <>
                <Network className="h-4 w-4" />
                Générer les clusters
              </>
            )}
          </Button>
          
          {clusters.length > 0 && (
            <Button variant="outline" onClick={exportClusters} className="gap-2">
              <Download className="h-4 w-4" />
              Exporter CSV
            </Button>
          )}
        </div>

        {clusters.length > 0 && (
          <>
            <div className="flex gap-2">
              <Input
                placeholder="Rechercher dans les clusters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as any)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">Toutes priorités</option>
                <option value="haute">Haute priorité</option>
                <option value="moyenne">Moyenne priorité</option>
                <option value="basse">Basse priorité</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredClusters.map((cluster) => (
                <div key={cluster.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>{getContentTypeIcon(cluster.contentType)}</span>
                      <h4 className="font-medium">{cluster.name}</h4>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(cluster.priority)}>
                        {cluster.priority}
                      </Badge>
                      <Badge variant="outline">
                        {getContentTypeLabel(cluster.contentType)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Mots-clés:</span>
                      <div className="font-medium">{cluster.keywords.length}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Volume total:</span>
                      <div className="font-medium">{cluster.totalVolume.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulté moy.:</span>
                      <div className="font-medium">{cluster.avgDifficulty}/100</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500 block mb-2">Mots-clés du cluster:</span>
                    <div className="flex flex-wrap gap-1">
                      {cluster.keywords.slice(0, 6).map((keyword, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {keyword.keyword}
                        </Badge>
                      ))}
                      {cluster.keywords.length > 6 && (
                        <Badge variant="secondary" className="text-xs">
                          +{cluster.keywords.length - 6} autres
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                    <Button size="sm">
                      Créer contenu
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordClusteringTool;
