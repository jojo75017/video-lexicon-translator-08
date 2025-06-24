
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Search } from "lucide-react";
import { toast } from "sonner";

interface KeywordAnalysis {
  keyword: string;
  count: number;
  density: number;
  positions: number[];
}

const KeywordDensityAnalyzer = () => {
  const [content, setContent] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [analysis, setAnalysis] = useState<KeywordAnalysis[]>([]);
  const [totalWords, setTotalWords] = useState(0);

  const analyzeContent = () => {
    if (!content.trim()) {
      toast.error("Veuillez entrer du contenu à analyser");
      return;
    }

    const words = content.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const wordCount = words.length;
    setTotalWords(wordCount);

    // Compter les occurrences des mots-clés
    const keywordCounts: { [key: string]: { count: number; positions: number[] } } = {};
    
    words.forEach((word, index) => {
      // Nettoyer le mot (enlever la ponctuation)
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 2) {
        if (!keywordCounts[cleanWord]) {
          keywordCounts[cleanWord] = { count: 0, positions: [] };
        }
        keywordCounts[cleanWord].count++;
        keywordCounts[cleanWord].positions.push(index);
      }
    });

    // Créer l'analyse
    const keywordAnalysis: KeywordAnalysis[] = Object.entries(keywordCounts)
      .map(([keyword, data]) => ({
        keyword,
        count: data.count,
        density: (data.count / wordCount) * 100,
        positions: data.positions
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 mots-clés

    setAnalysis(keywordAnalysis);
    toast.success(`Analyse terminée - ${wordCount} mots analysés`);
  };

  const getDensityColor = (density: number) => {
    if (density < 1) return 'text-red-600';
    if (density >= 1 && density <= 3) return 'text-green-600';
    if (density > 3 && density <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDensityBadge = (density: number) => {
    if (density < 1) return { color: 'bg-red-100 text-red-800', text: 'Faible' };
    if (density >= 1 && density <= 3) return { color: 'bg-green-100 text-green-800', text: 'Optimal' };
    if (density > 3 && density <= 5) return { color: 'bg-yellow-100 text-yellow-800', text: 'Élevé' };
    return { color: 'bg-red-100 text-red-800', text: 'Trop élevé' };
  };

  const targetKeywordAnalysis = analysis.find(a => 
    targetKeyword && a.keyword.toLowerCase().includes(targetKeyword.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          Analyseur de Densité de Mots-Clés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Mot-clé cible (optionnel)</label>
            <Input
              placeholder="Ex: formation professionnelle"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={analyzeContent} className="w-full gap-2">
              <Search className="h-4 w-4" />
              Analyser la densité
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Contenu à analyser</label>
          <Textarea
            placeholder="Collez votre contenu ici pour analyser la densité des mots-clés..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {content.split(/\s+/).filter(w => w.length > 0).length} mots
          </p>
        </div>

        {analysis.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{totalWords}</div>
                <div className="text-xs text-gray-600">Mots totaux</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-lg font-bold text-green-600">
                  {analysis.filter(a => a.density >= 1 && a.density <= 3).length}
                </div>
                <div className="text-xs text-gray-600">Densité optimale</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-lg font-bold text-purple-600">{analysis.length}</div>
                <div className="text-xs text-gray-600">Mots-clés analysés</div>
              </Card>
            </div>

            {targetKeywordAnalysis && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">
                  Analyse du mot-clé cible : "{targetKeyword}"
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Occurrences:</span>
                    <span className="font-medium ml-2">{targetKeywordAnalysis.count}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Densité:</span>
                    <span className={`font-medium ml-2 ${getDensityColor(targetKeywordAnalysis.density)}`}>
                      {targetKeywordAnalysis.density.toFixed(2)}%
                    </span>
                  </div>
                  <div>
                    <Badge className={getDensityBadge(targetKeywordAnalysis.density).color}>
                      {getDensityBadge(targetKeywordAnalysis.density).text}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={Math.min(targetKeywordAnalysis.density * 20, 100)} 
                  className="mt-3"
                />
              </Card>
            )}

            <div>
              <h4 className="font-medium mb-3">Top mots-clés par fréquence</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {analysis.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.keyword}</div>
                      <div className="text-xs text-gray-500">
                        {item.count} occurrences • Positions: {item.positions.slice(0, 5).join(', ')}
                        {item.positions.length > 5 && '...'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${getDensityColor(item.density)}`}>
                        {item.density.toFixed(2)}%
                      </div>
                      <Badge 
                        size="sm" 
                        className={getDensityBadge(item.density).color}
                      >
                        {getDensityBadge(item.density).text}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Recommandations SEO:</strong>
                <br />• Densité optimale : 1-3% pour le mot-clé principal
                <br />• Évitez le keyword stuffing (&gt; 5%)
                <br />• Utilisez des synonymes et variantes
                <br />• Répartissez les mots-clés naturellement dans le texte
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordDensityAnalyzer;
