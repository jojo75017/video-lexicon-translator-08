
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeoAnalysis } from '@/types/seo';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { createDataForSEOService } from '@/services/dataForSeoService';
import ComparisonChart from './comparison/ComparisonChart';
import KeywordSuggestionsTab from './comparison/KeywordSuggestionsTab';
import ComparisonHeader from './comparison/ComparisonHeader';

interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
}

interface SiteComparisonProps {
  site1: {
    url: string;
    analysis: SeoAnalysis;
  };
  site2?: {
    url: string;
    analysis: SeoAnalysis;
  };
  onCompare: (url: string) => void;
}

const SiteComparison = ({ site1, site2, onCompare }: SiteComparisonProps) => {
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [keywordSuggestions, setKeywordSuggestions] = useState<KeywordSuggestion[]>([]);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  const [apiCredentials, setApiCredentials] = useState({
    login: '',
    password: ''
  });

  const fetchKeywordData = async (keyword: string): Promise<KeywordSuggestion> => {
    if (useRealData && apiCredentials.login && apiCredentials.password) {
      const service = createDataForSEOService(apiCredentials.login, apiCredentials.password);
      return service.getKeywordData(keyword);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      keyword,
      volume: Math.floor(Math.random() * 10000),
      difficulty: Math.floor(Math.random() * 100),
      cpc: parseFloat((Math.random() * 5).toFixed(2)),
      competition: Math.random()
    };
  };

  const getKeywordSuggestions = async () => {
    setIsLoadingKeywords(true);
    try {
      const baseKeywords = site1.analysis.keywords || [];
      const keywords = baseKeywords.slice(0, 5);
      
      const suggestions = await Promise.all(
        keywords.map(kw => {
          const keyword = typeof kw === 'string' 
            ? kw 
            : (kw && typeof kw === 'object' && 'keyword' in kw) 
              ? String((kw as { keyword: string }).keyword)
              : String(kw);
              
          return fetchKeywordData(keyword);
        })
      );
      
      setKeywordSuggestions(suggestions);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de mots-clés:', error);
      toast.error("Erreur lors de la récupération des suggestions de mots-clés");
    } finally {
      setIsLoadingKeywords(false);
    }
  };

  React.useEffect(() => {
    if (site1.analysis.keywords?.length) {
      getKeywordSuggestions();
    }
  }, [site1.analysis.keywords]);

  const handleApiCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiCredentials.login && apiCredentials.password) {
      setUseRealData(true);
      toast.success("Identifiants DataForSEO enregistrés");
      getKeywordSuggestions();
    }
  };

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (competitorUrl) {
      onCompare(competitorUrl);
      setCompetitorUrl('');
    }
  };

  if (!site2) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Comparaison de pages</h2>
        </div>

        <form onSubmit={handleCompare} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="competitor-url" className="text-sm font-medium text-gray-700">
              URL de la page à comparer
            </label>
            <div className="flex gap-2">
              <Input
                id="competitor-url"
                type="url"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="https://monsite.com/autre-page"
                className="flex-1"
              />
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90">
                Comparer
              </Button>
            </div>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Comparaison de pages</h2>
      </div>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
          <TabsTrigger value="keywords">Suggestions de mots-clés</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <div className="space-y-6">
            <div className="mb-6">
              <ComparisonHeader
                site1Url={site1.url}
                site2Url={site2.url}
                onChangeSite={() => onCompare('')}
              />
            </div>

            <ComparisonChart site1={site1} site2={site2} />
          </div>
        </TabsContent>

        <TabsContent value="keywords">
          <KeywordSuggestionsTab
            keywordSuggestions={keywordSuggestions}
            isLoadingKeywords={isLoadingKeywords}
            useRealData={useRealData}
            apiCredentials={apiCredentials}
            onApiCredentialsChange={setApiCredentials}
            onApiCredentialsSubmit={handleApiCredentialsSubmit}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SiteComparison;
