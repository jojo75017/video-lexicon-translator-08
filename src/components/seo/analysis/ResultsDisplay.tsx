
import React from 'react';
import { SeoAnalysis } from '@/types/seo';

interface ResultsDisplayProps {
  seoAnalysis: SeoAnalysis | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ seoAnalysis }) => {
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

  if (!seoAnalysis) return null;

  return (
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
                {keyword.keyword}
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
  );
};

export default ResultsDisplay;
