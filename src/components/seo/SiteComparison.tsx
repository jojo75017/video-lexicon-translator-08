
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, BarChart3, Globe } from "lucide-react";
import { KeywordSuggestion } from '../../types/seo/KeywordSuggestion';
import { toast } from "sonner";

const SiteComparison = () => {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keywords1, setKeywords1] = useState<KeywordSuggestion[]>([]);
  const [keywords2, setKeywords2] = useState<KeywordSuggestion[]>([]);

  const compareKeywords = async () => {
    if (!url1.trim() || !url2.trim()) {
      toast.error('Veuillez entrer les deux URLs');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulation de données pour la comparaison
      const mockKeywords1: KeywordSuggestion[] = [
        { keyword: 'seo analysis', volume: 1200, difficulty: 45, relevance: 85, type: 'primary' },
        { keyword: 'website optimization', volume: 800, difficulty: 35, relevance: 78, type: 'semantic' },
        { keyword: 'digital marketing', volume: 2000, difficulty: 60, relevance: 72, type: 'competitor' }
      ];

      const mockKeywords2: KeywordSuggestion[] = [
        { keyword: 'seo tools', volume: 1500, difficulty: 50, relevance: 88, type: 'primary' },
        { keyword: 'keyword research', volume: 900, difficulty: 40, relevance: 82, type: 'semantic' },
        { keyword: 'content marketing', volume: 1800, difficulty: 55, relevance: 75, type: 'longtail' }
      ];

      setKeywords1(mockKeywords1);
      setKeywords2(mockKeywords2);
      toast.success('Comparaison terminée !');
    } catch (error) {
      toast.error('Erreur lors de la comparaison');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Comparaison de Sites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Site 1</label>
              <Input
                placeholder="https://site1.com"
                value={url1}
                onChange={(e) => setUrl1(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Site 2</label>
              <Input
                placeholder="https://site2.com"
                value={url2}
                onChange={(e) => setUrl2(e.target.value)}
              />
            </div>
          </div>
          
          <Button
            onClick={compareKeywords}
            disabled={isAnalyzing || !url1.trim() || !url2.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Globe className="h-4 w-4 mr-2" />
            )}
            Comparer les Sites
          </Button>
        </CardContent>
      </Card>

      {(keywords1.length > 0 || keywords2.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Site 1 - Mots-clés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keywords1.map((kw, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm font-medium">{kw.keyword}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {kw.volume?.toLocaleString()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {kw.difficulty}/100
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Site 2 - Mots-clés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keywords2.map((kw, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm font-medium">{kw.keyword}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {kw.volume?.toLocaleString()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {kw.difficulty}/100
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SiteComparison;
