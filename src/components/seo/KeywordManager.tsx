
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Search, Sparkles, BarChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { KeywordData } from '@/types/seo';

interface KeywordManagerProps {
  keywords?: string[];
  topKeywords?: KeywordData[];
  onAddKeyword?: (keyword: string) => void;
  onRemoveKeyword?: (keyword: string) => void;
  onAnalyzeKeyword?: (keyword: string) => void;
  readOnly?: boolean;
}

const KeywordManager: React.FC<KeywordManagerProps> = ({
  keywords = [],
  topKeywords = [],
  onAddKeyword,
  onRemoveKeyword,
  onAnalyzeKeyword,
  readOnly = false
}) => {
  const { t } = useTranslation();
  const [newKeyword, setNewKeyword] = useState('');
  
  const handleAddKeyword = () => {
    if (newKeyword.trim() && onAddKeyword) {
      onAddKeyword(newKeyword.trim());
      setNewKeyword('');
    }
  };
  
  // Extraire les mots-clés de l'analyse
  const extractedKeywords = topKeywords.map(k => k.keyword);
  
  // Calculer la densité moyenne des mots-clés
  const getAverageDensity = () => {
    if (topKeywords.length === 0) return 0;
    const totalDensity = topKeywords.reduce((acc, kw) => acc + (kw.density || 0), 0);
    return (totalDensity / topKeywords.length).toFixed(2);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('seo.keywords')}</span>
          {topKeywords.length > 0 && (
            <Badge variant="outline" className="font-normal">
              {t('seo.averageDensity', 'Densité moyenne')}: {getAverageDensity()}%
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!readOnly && (
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder={t('seo.addKeyword', 'Ajouter un mot-clé')}
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleAddKeyword()}
            />
            <Button onClick={handleAddKeyword} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              <span>{t('common.add', 'Ajouter')}</span>
            </Button>
          </div>
        )}
        
        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {keywords.map((keyword, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="pl-2 pr-1 py-1.5 text-sm flex items-center"
              >
                {keyword}
                {!readOnly && onRemoveKeyword && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1 hover:bg-gray-200 rounded-full"
                    onClick={() => onRemoveKeyword(keyword)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">{t('seo.noKeywords')}</p>
        )}
        
        {topKeywords.length > 0 && (
          <>
            <div className="text-sm font-medium mb-2">{t('seo.detectedKeywords', 'Mots-clés détectés')}</div>
            <div className="bg-gray-50 rounded-lg border p-3 space-y-2">
              {topKeywords.slice(0, 5).map((keyword, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm">{keyword.keyword}</span>
                    {keyword.density && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {keyword.density.toFixed(2)}%
                      </Badge>
                    )}
                  </div>
                  
                  {onAnalyzeKeyword && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => onAnalyzeKeyword(keyword.keyword)}
                    >
                      <Search className="h-3 w-3 mr-1" />
                      <span className="text-xs">{t('common.analyze', 'Analyser')}</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {!readOnly && extractedKeywords.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-1 text-indigo-600">
                  <BarChart className="h-4 w-4" />
                  <span>{t('seo.viewKeywordAnalysis', 'Voir l\'analyse complète')}</span>
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordManager;
