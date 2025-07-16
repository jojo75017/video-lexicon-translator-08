
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MessageSquare, Search } from 'lucide-react';

interface VoiceSearchData {
  keyword: string;
  isVoiceOptimized: boolean;
  questionFormat: string;
  conversationalVariants: string[];
  voiceScore: number;
  naturalLanguageQueries: string[];
  conversationalKeywords: string[];
  avgQuestionLength: number;
  featuredSnippetChance: number;
}

const VoiceSearchAnalysis: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceData, setVoiceData] = useState<VoiceSearchData[]>([]);

  const mockVoiceData: VoiceSearchData[] = [
    {
      keyword: 'comment faire du SEO',
      isVoiceOptimized: true,
      questionFormat: 'Comment',
      conversationalVariants: ['Comment optimiser mon site', 'Comment améliorer mon référencement'],
      voiceScore: 85,
      naturalLanguageQueries: ['Comment puis-je améliorer mon SEO ?', 'Quelle est la meilleure façon de faire du SEO ?'],
      conversationalKeywords: ['comment', 'pourquoi', 'où', 'quand'],
      avgQuestionLength: 8,
      featuredSnippetChance: 75
    }
  ];

  const analyzeVoiceSearch = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setVoiceData(mockVoiceData);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Analyse recherche vocale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-6">
            <Input
              placeholder="Entrez un mot-clé à analyser..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button onClick={analyzeVoiceSearch} disabled={isAnalyzing || !keyword}>
              {isAnalyzing ? 'Analyse...' : 'Analyser'}
            </Button>
          </div>

          {voiceData.length > 0 && (
            <div className="space-y-4">
              {voiceData.map((data, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold">{data.keyword}</h3>
                    <Badge variant={data.isVoiceOptimized ? "default" : "secondary"}>
                      {data.isVoiceOptimized ? "Optimisé vocal" : "Non optimisé"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-gray-500">Score vocal</label>
                      <p className="font-medium">{data.voiceScore}/100</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Format question</label>
                      <p className="font-medium">{data.questionFormat}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Chance snippet</label>
                      <p className="font-medium">{data.featuredSnippetChance}%</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Requêtes en langage naturel
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {data.naturalLanguageQueries.map((query, i) => (
                          <Badge key={i} variant="outline">{query}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Variantes conversationnelles</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {data.conversationalVariants.map((variant, i) => (
                          <Badge key={i} variant="secondary">{variant}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceSearchAnalysis;
