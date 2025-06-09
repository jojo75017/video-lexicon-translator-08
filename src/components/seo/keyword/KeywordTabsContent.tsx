
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import KeywordList from './KeywordList';
import KeywordTrendAnalyzer from './KeywordTrendAnalyzer';
import CompetitorAnalysis from './CompetitorAnalysis';
import IntelligentExpansion from './IntelligentExpansion';
import MobileOptimization from './MobileOptimization';
import VoiceSearchAnalysis from './VoiceSearchAnalysis';
import SeasonalAnalysis from './SeasonalAnalysis';
import KeywordOpportunities from './KeywordOpportunities';
import InternalLinkSuggestions from './InternalLinkSuggestions';
import KeywordDifficultyAnalyzer from './KeywordDifficultyAnalyzer';
import RoiCalculator from './RoiCalculator';
import KeywordFAQ from './KeywordFAQ';
import KeywordClusteringTool from './KeywordClusteringTool';
import UrlSeoAnalyzer from '../UrlSeoAnalyzer';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';

interface KeywordTabsContentProps {
  standardKeywords: KeywordSuggestion[];
  longTailKeywords: KeywordSuggestion[];
  allKeywords: KeywordSuggestion[];
  selectedKeywords: string[];
  keyword: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleKeywordSelection: (keyword: string) => void;
  clearSelectedKeywords: () => void;
  exportSelectedKeywords: () => void;
  handleIntelligentKeywords: (keywords: KeywordSuggestion[]) => void;
  handleCompetitorKeywords: (keywords: string[]) => void;
}

const KeywordTabsContent: React.FC<KeywordTabsContentProps> = ({
  standardKeywords,
  longTailKeywords,
  allKeywords,
  selectedKeywords,
  keyword,
  activeTab,
  setActiveTab,
  toggleKeywordSelection,
  clearSelectedKeywords,
  exportSelectedKeywords,
  handleIntelligentKeywords,
  handleCompetitorKeywords
}) => {
  return (
    <>
      <TabsContent value="generator" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Mots-clés standards ({standardKeywords.length})</h3>
            <KeywordList 
              keywords={standardKeywords}
              selectedKeywords={selectedKeywords}
              onToggleSelection={toggleKeywordSelection}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Mots-clés longue traîne ({longTailKeywords.length})</h3>
            <KeywordList 
              keywords={longTailKeywords}
              selectedKeywords={selectedKeywords}
              onToggleSelection={toggleKeywordSelection}
            />
          </div>
        </div>
        
        {selectedKeywords.length > 0 && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm text-blue-800">
              {selectedKeywords.length} mot{selectedKeywords.length > 1 ? 's' : ''}-clé{selectedKeywords.length > 1 ? 's' : ''} sélectionné{selectedKeywords.length > 1 ? 's' : ''}
            </span>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={clearSelectedKeywords}>
                <Trash2 className="w-4 h-4 mr-1" />
                Effacer
              </Button>
              <Button size="sm" onClick={exportSelectedKeywords}>
                <Download className="w-4 h-4 mr-1" />
                Exporter
              </Button>
            </div>
          </div>
        )}

        {/* Nouveau: Analyseur SEO par URL */}
        <UrlSeoAnalyzer />
      </TabsContent>

      <TabsContent value="suggestions">
        <KeywordList 
          keywords={allKeywords}
          selectedKeywords={selectedKeywords}
          onToggleSelection={toggleKeywordSelection}
        />
      </TabsContent>

      <TabsContent value="trends">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analyse des tendances pour "{keyword}"</h3>
          <p className="text-gray-600">Évolution des volumes de recherche et prédictions.</p>
        </div>
      </TabsContent>

      <TabsContent value="competitive">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analyse concurrentielle pour "{keyword}"</h3>
          <p className="text-gray-600">Découverte des concurrents et de leurs stratégies SEO.</p>
        </div>
      </TabsContent>

      <TabsContent value="intelligent">
        <IntelligentExpansion 
          keyword={keyword}
          onKeywordsGenerated={handleIntelligentKeywords}
        />
      </TabsContent>

      <TabsContent value="audience">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analyse d'audience pour "{keyword}"</h3>
          <p className="text-gray-600">Données démographiques et comportementales des utilisateurs.</p>
        </div>
      </TabsContent>

      <TabsContent value="content">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Suggestions de contenu pour "{keyword}"</h3>
          <p className="text-gray-600">Idées d'articles et de pages optimisées SEO.</p>
        </div>
      </TabsContent>

      <TabsContent value="analytics">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analytics pour "{keyword}"</h3>
          <p className="text-gray-600">Métriques détaillées et tableaux de bord.</p>
        </div>
      </TabsContent>

      <TabsContent value="serp">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analyse SERP pour "{keyword}"</h3>
          <p className="text-gray-600">Structure des résultats de recherche et opportunités.</p>
        </div>
      </TabsContent>

      <TabsContent value="mobile">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Optimisation mobile pour "{keyword}"</h3>
          <p className="text-gray-600">Adaptation aux recherches sur appareils mobiles.</p>
        </div>
      </TabsContent>

      <TabsContent value="voice">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recherche vocale pour "{keyword}"</h3>
          <p className="text-gray-600">Optimisation pour les assistants vocaux.</p>
        </div>
      </TabsContent>

      <TabsContent value="seasonal">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analyse saisonnière pour "{keyword}"</h3>
          <p className="text-gray-600">Variations selon les périodes de l'année.</p>
        </div>
      </TabsContent>

      <TabsContent value="opportunities">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Opportunités pour "{keyword}"</h3>
          <p className="text-gray-600">Niches peu exploitées et nouveaux créneaux.</p>
        </div>
      </TabsContent>

      <TabsContent value="internal-links">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Liens internes pour "{keyword}"</h3>
          <p className="text-gray-600">Suggestions de maillage interne optimisé.</p>
        </div>
      </TabsContent>

      <TabsContent value="difficulty">
        <KeywordDifficultyAnalyzer keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="roi">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Calculateur ROI pour "{keyword}"</h3>
          <p className="text-gray-600">Estimation du retour sur investissement.</p>
        </div>
      </TabsContent>

      <TabsContent value="faq">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">FAQ pour "{keyword}"</h3>
          <p className="text-gray-600">Génération automatique de questions-réponses optimisées SEO.</p>
        </div>
      </TabsContent>

      <TabsContent value="clustering">
        <KeywordClusteringTool keywords={allKeywords} />
      </TabsContent>

      <TabsContent value="export">
        <div className="text-center py-8">
          <Download className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Exporter vos mots-clés</h3>
          <p className="text-gray-600 mb-4">
            Sélectionnez les mots-clés dans l'onglet "Générateur" puis exportez-les au format CSV.
          </p>
          <Button onClick={() => setActiveTab('generator')}>
            Retour au générateur
          </Button>
        </div>
      </TabsContent>
    </>
  );
};

export default KeywordTabsContent;
