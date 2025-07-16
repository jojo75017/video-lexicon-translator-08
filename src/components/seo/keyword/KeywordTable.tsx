
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Key, Copy, TrendingUp, Target, DollarSign, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface KeywordTableProps {
  keywords: KeywordSuggestion[];
}

const KeywordTable: React.FC<KeywordTableProps> = ({ keywords }) => {
  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success('Mot-clé copié dans le presse-papiers ✨');
  };

  const getIntentColor = (intent?: string) => {
    switch (intent) {
      case 'informational': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'commercial': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'transactional': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return 'text-gray-500';
    if (difficulty < 30) return 'text-green-600 font-semibold';
    if (difficulty < 60) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const getDifficultyIcon = (difficulty?: number) => {
    if (!difficulty) return <Target className="h-4 w-4 text-gray-500" />;
    if (difficulty < 30) return <Zap className="h-4 w-4 text-green-600" />;
    if (difficulty < 60) return <TrendingUp className="h-4 w-4 text-yellow-600" />;
    return <Target className="h-4 w-4 text-red-600" />;
  };

  return (
    <Card className="shadow-xl border-2 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-100">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md">
            <Key className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mots-clés générés ({keywords.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {keywords.map((kw, index) => (
            <div key={index} className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{kw.keyword}</h3>
                  {kw.suggestedTitle && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Titre suggéré</span>
                      <p className="text-sm text-blue-700 font-medium bg-blue-50 p-2 rounded-lg border border-blue-200">{kw.suggestedTitle}</p>
                    </div>
                  )}
                  {kw.suggestedDescription && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Description suggérée</span>
                      <p className="text-sm text-gray-700 bg-green-50 p-2 rounded-lg border border-green-200">{kw.suggestedDescription}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyKeyword(kw.keyword)}
                    className="hover:bg-blue-50 border-blue-200 shadow-sm"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copier
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-gray-600 font-medium">Volume</span>
                  </div>
                  <div className="font-bold text-lg text-blue-600">{kw.volume?.toLocaleString() || 'N/A'}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-2 mb-1">
                    {getDifficultyIcon(kw.difficulty)}
                    <span className="text-xs text-gray-600 font-medium">Difficulté</span>
                  </div>
                  <div className={`font-bold text-lg ${getDifficultyColor(kw.difficulty)}`}>
                    {kw.difficulty || 'N/A'}/100
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-600 font-medium">CPC</span>
                  </div>
                  <div className="font-bold text-lg text-green-600">{kw.cpc ? `${kw.cpc}€` : 'N/A'}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-gray-600 font-medium">Opportunité</span>
                  </div>
                  <div className="font-bold text-lg text-yellow-600">{kw.opportunity || 'N/A'}%</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {kw.intent && (
                  <Badge className={`${getIntentColor(kw.intent)} border shadow-sm font-medium`}>
                    {kw.intent}
                  </Badge>
                )}
                {kw.type && (
                  <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-700 font-medium">
                    {kw.type}
                  </Badge>
                )}
                {kw.relevance && (
                  <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300 font-medium">
                    Pertinence: {kw.relevance}%
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordTable;
