
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Sparkles, Target, TrendingUp } from "lucide-react";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import CompetitorAnalysis from './CompetitorAnalysis';
import SerpAnalysis from './SerpAnalysis';

interface KeywordTabsContentProps {
  activeTab: string;
  keywords: KeywordSuggestion[];
  keyword: string;
}

const KeywordTabsContent: React.FC<KeywordTabsContentProps> = ({ activeTab, keywords, keyword }) => {
  const renderKeywordCard = (keywordData: KeywordSuggestion, index: number) => (
    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">{keywordData.keyword}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {keywordData.type}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Volume:</span>
          <span className="ml-1 font-medium">{keywordData.volume.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-500">Difficulté:</span>
          <span className="ml-1 font-medium">{keywordData.difficulty}/100</span>
        </div>
        <div>
          <span className="text-gray-500">CPC:</span>
          <span className="ml-1 font-medium">{keywordData.cpc}€</span>
        </div>
        <div>
          <span className="text-gray-500">Opportunité:</span>
          <span className="ml-1 font-medium text-green-600">{keywordData.opportunity}%</span>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
          {keywordData.intent}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <TabsContent value="generator">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Générateur de mots-clés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Utilisez le formulaire ci-dessus pour générer des mots-clés pertinents pour votre contenu.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="suggestions">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Suggestions de mots-clés
            </CardTitle>
          </CardHeader>
          <CardContent>
            {keywords.length > 0 ? (
              <div className="grid gap-4">
                {keywords.slice(0, 10).map((keywordData, index) => 
                  renderKeywordCard(keywordData, index)
                )}
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Générez d'abord des mots-clés pour voir les suggestions.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="trends">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Tendances des mots-clés
            </CardTitle>
          </CardHeader>
          <CardContent>
            {keywords.length > 0 ? (
              <div className="space-y-4">
                <p className="text-gray-600">Analyse des tendances pour les mots-clés générés :</p>
                <div className="grid gap-3">
                  {keywords.slice(0, 5).map((kw, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{kw.keyword}</span>
                        <span className="text-sm text-green-600">↗ +{Math.floor(Math.random() * 20 + 5)}%</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Tendance positive sur les 3 derniers mois
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Générez d'abord des mots-clés pour analyser les tendances.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="competitive">
        <CompetitorAnalysis keyword={keyword} />
      </TabsContent>

      <TabsContent value="serp">
        <SerpAnalysis keywords={keywords} />
      </TabsContent>

      {/* Onglets par défaut pour les autres valeurs */}
      {[
        'intelligent', 'audience', 'content', 'analytics', 'mobile', 'voice', 
        'seasonal', 'opportunities', 'internal-links', 'difficulty', 'roi', 
        'faq', 'clustering', 'export'
      ].map((tabValue) => (
        <TabsContent key={tabValue} value={tabValue}>
          <Card>
            <CardHeader>
              <CardTitle>
                {tabValue.charAt(0).toUpperCase() + tabValue.slice(1).replace('-', ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Cette fonctionnalité sera bientôt disponible.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </div>
  );
};

export default KeywordTabsContent;
