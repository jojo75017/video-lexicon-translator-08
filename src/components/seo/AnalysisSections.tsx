
import React from 'react';
import { SeoAnalysis, KeywordSuggestion } from '@/types/seo';
import { Card } from '@/components/ui/card';

interface AnalysisSectionsProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  seoAnalysis: SeoAnalysis | null;
  setSeoAnalysis: (analysis: SeoAnalysis) => void;
  comparisonSite: string;
  setComparisonSite: (site: string) => void;
  generatedKeywords: KeywordSuggestion[];
  setGeneratedKeywords: (keywords: KeywordSuggestion[]) => void;
  generatedContent: {
    title: string;
    intro: string;
    sections: Array<{ heading: string; content: string; }>;
  } | null;
  setGeneratedContent: (content: any) => void;
  contentKeyword: string;
  mockContentIdeas: any[];
  analyzeSite: () => void;
  error: string | null;
  handleActivateProxy: () => void;
  handleContentKeywordChange: (keyword: string) => void;
  handleGeneratedKeywords: (keywords: KeywordSuggestion[]) => void;
  handleContentGenerated: (content: any) => void;
}

const AnalysisSections: React.FC<AnalysisSectionsProps> = ({
  url,
  setUrl,
  isLoading,
  showCorsWarning,
  seoAnalysis,
  comparisonSite,
  setComparisonSite,
  generatedKeywords,
  generatedContent,
  contentKeyword,
  mockContentIdeas,
  analyzeSite,
  error,
  handleActivateProxy,
  handleContentKeywordChange,
  handleGeneratedKeywords,
  handleContentGenerated
}) => {
  // Calculate an overall score based on available metrics
  const calculateOverallScore = (analysis: SeoAnalysis | null): number => {
    if (!analysis) return 0;
    
    let scoreSum = 0;
    let scoreCount = 0;
    
    if (analysis.performance?.score) {
      scoreSum += analysis.performance.score;
      scoreCount++;
    }
    
    if (analysis.mobileAnalysis?.score) {
      scoreSum += analysis.mobileAnalysis.score;
      scoreCount++;
    }
    
    if (analysis.readabilityScore) {
      scoreSum += analysis.readabilityScore;
      scoreCount++;
    }
    
    return scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 0;
  };

  // Generate some sample issues based on seoAnalysis
  const generateIssues = (analysis: SeoAnalysis | null): string[] => {
    if (!analysis) return [];
    
    const issues: string[] = [];
    
    if (analysis.h1Count !== 1) {
      issues.push(analysis.h1Count === 0 
        ? "Aucune balise H1 trouvée - ajoutez une balise H1 principale"
        : "Plusieurs balises H1 détectées - utilisez une seule balise H1");
    }
    
    if (analysis.imgWithoutAlt > 0) {
      issues.push(`${analysis.imgWithoutAlt} image(s) sans attribut alt - ajoutez des descriptions alternatives`);
    }
    
    if (analysis.metaTagsAnalysis && !analysis.metaTagsAnalysis.hasDescriptionTag) {
      issues.push("Meta description manquante - ajoutez une description concise");
    }
    
    if (analysis.metaTagsAnalysis && !analysis.metaTagsAnalysis.hasOpenGraphTags) {
      issues.push("Balises Open Graph manquantes - améliorez le partage sur les réseaux sociaux");
    }
    
    if (analysis.performance && analysis.performance.loadTime > 3000) {
      issues.push("Temps de chargement lent - optimisez la vitesse du site");
    }
    
    if (analysis.technicalSuggestions && analysis.technicalSuggestions.length > 0) {
      issues.push(...analysis.technicalSuggestions.slice(0, 3));
    }
    
    return issues;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
      <p className="text-gray-600 mb-4">
        Cette section contient les analyses SEO pour votre site. 
        Veuillez utiliser le formulaire d'analyse pour commencer.
      </p>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Analyser un site web</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Entrez l'URL du site à analyser"
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={analyzeSite}
              disabled={isLoading || !url}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {isLoading ? 'Analyse en cours...' : 'Analyser'}
            </button>
          </div>
          
          {showCorsWarning && (
            <div className="mt-3 text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
              <p className="text-sm">
                Pour analyser des sites externes, vous devez activer le proxy CORS.
                <button
                  onClick={handleActivateProxy}
                  className="ml-2 text-blue-600 underline"
                >
                  Activer le proxy
                </button>
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-3 text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
        
        {seoAnalysis && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Résultats de l'analyse</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium text-gray-700">Score SEO global</h4>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${calculateOverallScore(seoAnalysis)}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {calculateOverallScore(seoAnalysis)}%
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium text-gray-700">Temps de chargement</h4>
                <p className="text-lg font-semibold mt-1">
                  {seoAnalysis.performance?.loadTime 
                    ? (seoAnalysis.performance.loadTime / 1000).toFixed(2) 
                    : 'N/A'} s
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Mots-clés détectés</h4>
                <div className="flex flex-wrap gap-2">
                  {seoAnalysis.topKeywords?.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Problèmes détectés</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {generateIssues(seoAnalysis).map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Analyse comparative</h3>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="text"
              value={comparisonSite}
              onChange={(e) => setComparisonSite(e.target.value)}
              placeholder="URL du site concurrent à comparer"
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <button
              disabled={isLoading || !comparisonSite}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-300"
            >
              Comparer
            </button>
          </div>
          
          <p className="text-sm text-gray-600">
            Comparez votre site avec vos concurrents pour identifier les opportunités d'amélioration.
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Suggestions de mots-clés</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Obtenez des suggestions de mots-clés pertinents pour votre site.
            </p>
            
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Générer des suggestions
            </button>
          </div>
          
          {generatedKeywords.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Mots-clés suggérés</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {generatedKeywords.map((keyword, index) => (
                  <div key={index} className="flex justify-between bg-gray-50 p-2 rounded-md">
                    <span>{keyword.keyword}</span>
                    <span className="text-gray-500 text-sm">
                      {keyword.volume} recherches/mois
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Générateur de contenu</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot-clé principal
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={contentKeyword}
                onChange={(e) => handleContentKeywordChange(e.target.value)}
                placeholder="Entrez un mot-clé"
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Générer du contenu
              </button>
            </div>
          </div>
          
          {generatedContent && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">{generatedContent.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{generatedContent.intro}</p>
              
              {generatedContent.sections.map((section, index) => (
                <div key={index} className="mb-3">
                  <h5 className="font-medium text-gray-700">{section.heading}</h5>
                  <p className="text-sm text-gray-600">{section.content}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Idées de contenu populaires</h4>
            <div className="space-y-2">
              {mockContentIdeas.map((idea, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <h5 className="font-medium text-gray-700">{idea.title}</h5>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>{idea.visits} visites</span>
                    <span>{idea.backlinks} backlinks</span>
                    <span>{idea.socialShares.facebook + idea.socialShares.pinterest + idea.socialShares.reddit} partages</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnalysisSections;
