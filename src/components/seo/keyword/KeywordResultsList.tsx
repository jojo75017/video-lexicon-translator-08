
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { Heart, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface KeywordResultsListProps {
  keywords: KeywordSuggestion[];
  isLoading: boolean;
}

const KeywordResultsList: React.FC<KeywordResultsListProps> = ({
  keywords,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <p>Génération des mots-clés en cours...</p>
      </Card>
    );
  }

  if (!keywords || keywords.length === 0) {
    return null;
  }

  const handleCopyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success('Mot-clé copié !');
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Suggestions de mots-clés</h2>
      
      <div className="space-y-4">
        {keywords.map((keyword, index) => (
          <Card key={index} className="p-4 border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-lg">{keyword.keyword}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-50">
                    Volume: {keyword.volume}
                  </Badge>
                  <Badge variant="outline" className={`
                    ${keyword.difficulty && keyword.difficulty < 30 ? 'bg-green-50' : 
                      keyword.difficulty && keyword.difficulty < 60 ? 'bg-yellow-50' : 'bg-red-50'}
                  `}>
                    Difficulté: {keyword.difficulty}/100
                  </Badge>
                  {keyword.cpc !== undefined && (
                    <Badge variant="outline" className="bg-purple-50">
                      CPC: {keyword.cpc.toFixed(2)}€
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCopyKeyword(keyword.keyword)}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copier</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Favoris</span>
                </Button>
              </div>
            </div>
            
            {keyword.suggestedTitle && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-sm font-medium mb-1">Suggestion de titre:</div>
                <div className="text-sm bg-gray-50 p-2 rounded">{keyword.suggestedTitle}</div>
              </div>
            )}
            
            {keyword.suggestedDescription && (
              <div className="mt-2">
                <div className="text-sm font-medium mb-1">Suggestion de description:</div>
                <div className="text-sm bg-gray-50 p-2 rounded">{keyword.suggestedDescription}</div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default KeywordResultsList;
