
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Key, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface KeywordTableProps {
  keywords: KeywordSuggestion[];
}

const KeywordTable: React.FC<KeywordTableProps> = ({ keywords }) => {
  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success('Mot-clé copié');
  };

  const getIntentColor = (intent?: string) => {
    switch (intent) {
      case 'informational': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'transactional': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return 'text-gray-500';
    if (difficulty < 30) return 'text-green-600';
    if (difficulty < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-500" />
          Mots-clés générés ({keywords.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {keywords.map((kw, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{kw.keyword}</h3>
                  {kw.suggestedTitle && (
                    <p className="text-sm text-blue-600 mt-1">{kw.suggestedTitle}</p>
                  )}
                  {kw.suggestedDescription && (
                    <p className="text-sm text-gray-600 mt-1">{kw.suggestedDescription}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyKeyword(kw.keyword)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <span className="text-sm text-gray-600">Volume</span>
                  <div className="font-semibold">{kw.volume?.toLocaleString() || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Difficulté</span>
                  <div className={`font-semibold ${getDifficultyColor(kw.difficulty)}`}>
                    {kw.difficulty || 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">CPC</span>
                  <div className="font-semibold">{kw.cpc ? `${kw.cpc}€` : 'N/A'}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Opportunité</span>
                  <div className="font-semibold text-green-600">{kw.opportunity || 'N/A'}%</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {kw.intent && (
                  <Badge className={getIntentColor(kw.intent)}>
                    {kw.intent}
                  </Badge>
                )}
                {kw.type && (
                  <Badge variant="outline">
                    {kw.type}
                  </Badge>
                )}
                {kw.relevance && (
                  <Badge variant="secondary">
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
