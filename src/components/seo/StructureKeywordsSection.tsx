
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ListTree, CircleDot, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KeywordItem {
  keyword: string;
  volume?: number;
  cpc?: number;
  difficulty?: number;
  score?: number;
}

interface QuestionItem {
  question: string;
  keywords?: string[];
  relevance?: number;
}

interface PhraseItem {
  phrase: string;
  count: number;
}

interface StructureKeywordsSectionProps {
  keywords?: KeywordItem[];
  phrases?: PhraseItem[];
  questions?: string[] | QuestionItem[];
  isLoading: boolean;
}

const StructureKeywordsSection = ({
  keywords = [],
  phrases = [],
  questions = [],
  isLoading
}: StructureKeywordsSectionProps) => {
  // Prepare data for display
  const formattedKeywords = Array.isArray(keywords) ? keywords : [];
  const formattedPhrases = Array.isArray(phrases) ? phrases : [];
  const formattedQuestions = Array.isArray(questions) 
    ? questions.map(q => typeof q === 'string' ? { question: q } : q)
    : [];

  const getKeywordDifficultyColor = (difficulty?: number) => {
    if (difficulty === undefined) return 'bg-gray-100 text-gray-800';
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 60) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Analyse de mots-clés et questions
        </h2>
      </div>
      
      <Tabs defaultValue="keywords" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="keywords" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            Mots-clés
          </TabsTrigger>
          <TabsTrigger value="phrases" className="flex items-center gap-1">
            <ListTree className="h-4 w-4" />
            Expressions
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            Questions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="keywords">
          {formattedKeywords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formattedKeywords.slice(0, 10).map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium text-gray-800">{item.keyword}</div>
                    {item.volume !== undefined && (
                      <div className="text-xs text-gray-500">
                        Vol: {item.volume.toLocaleString()} 
                        {item.cpc !== undefined && ` • CPC: ${item.cpc.toFixed(2)}€`}
                      </div>
                    )}
                  </div>
                  
                  {item.difficulty !== undefined && (
                    <Badge className={getKeywordDifficultyColor(item.difficulty)}>
                      {item.difficulty}/100
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Aucun mot-clé trouvé pour ce site.</p>
              <p className="text-sm">Analysez le site pour voir ses mots-clés.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="phrases">
          {formattedPhrases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formattedPhrases.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center"
                >
                  <div className="font-medium text-gray-800">{item.phrase}</div>
                  <Badge variant="outline">
                    {item.count} {item.count > 1 ? 'fois' : 'fois'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <ListTree className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Aucune expression commune trouvée.</p>
              <p className="text-sm">Analysez le site pour voir ses expressions répétées.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="questions">
          {formattedQuestions.length > 0 ? (
            <div className="space-y-3">
              {formattedQuestions.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                >
                  <div className="font-medium text-gray-800 flex items-start">
                    <CircleDot className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    <div>{item.question}</div>
                  </div>
                  {item.keywords && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.keywords.map((kw, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <HelpCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Aucune question trouvée dans le contenu.</p>
              <p className="text-sm">Analysez le site pour voir les questions potentielles.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default StructureKeywordsSection;
