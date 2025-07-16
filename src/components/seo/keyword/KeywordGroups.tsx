
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import { Info, Target, Search, ShoppingCart } from 'lucide-react';

interface KeywordGroupsProps {
  keywords: KeywordSuggestion[];
}

const KeywordGroups: React.FC<KeywordGroupsProps> = ({ keywords }) => {
  const groupKeywordsByIntent = (keywords: KeywordSuggestion[]) => {
    return {
      informational: keywords.filter(k => k.intent === 'informational'),
      transactional: keywords.filter(k => k.intent === 'transactional'),
      navigational: keywords.filter(k => k.intent === 'navigational'),
      commercial: keywords.filter(k => k.intent === 'commercial')
    };
  };

  const grouped = groupKeywordsByIntent(keywords);

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'informational': return <Info className="h-4 w-4" />;
      case 'transactional': return <ShoppingCart className="h-4 w-4" />;
      case 'navigational': return <Search className="h-4 w-4" />;
      case 'commercial': return <Target className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'informational': return 'bg-blue-100 text-blue-800';
      case 'transactional': return 'bg-green-100 text-green-800';
      case 'navigational': return 'bg-purple-100 text-purple-800';
      case 'commercial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([intent, intentKeywords]) => (
        <Card key={intent} className="p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {getIntentIcon(intent)}
              {intent.charAt(0).toUpperCase() + intent.slice(1)} ({intentKeywords.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {intentKeywords.slice(0, 8).map((keyword, index) => (
                <Badge 
                  key={index} 
                  className={getIntentColor(intent)}
                  variant="secondary"
                >
                  {keyword.keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KeywordGroups;
