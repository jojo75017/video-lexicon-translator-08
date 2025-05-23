
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { SeoAnalysis } from '@/types/seo';
import { Card } from '@/components/ui/card';

interface SeoResultsProps {
  seoAnalysis: SeoAnalysis;
}

const calculateSeoScore = (analysis: SeoAnalysis) => {
  let score = 100;

  // Penalties for structure issues
  if (analysis.h1Count !== 1) score -= 10;
  if (analysis.h1Count === 0) score -= 20;
  if (analysis.imgCount === 0) score -= 5;
  
  // Check if metadata exists and has properties
  if (analysis.metadata) {
    if (analysis.metadata.hasTitleTag === false) score -= 15;
    if (analysis.metadata.hasDescriptionTag === false) score -= 10;
  }
  if (!analysis.title) score -= 15;

  // Penalties for performance
  if (analysis.performance?.firstContentfulPaint && analysis.performance.firstContentfulPaint > 2.5) score -= 10;
  if (analysis.performance?.timeToInteractive && analysis.performance.timeToInteractive > 3.8) score -= 10;

  return Math.max(0, Math.min(100, score));
};

const getSeoSuggestions = (analysis: SeoAnalysis) => {
  const suggestions = [];

  if (analysis.h1Count !== 1) {
    suggestions.push("Assurez-vous d'avoir exactement une balise H1");
  }
  if (!analysis.description) {
    suggestions.push("Ajoutez une meta description");
  }
  if (!analysis.title) {
    suggestions.push("Ajoutez un titre à la page");
  }
  if (analysis.imgCount === 0) {
    suggestions.push("Ajoutez des images pertinentes");
  }
  if (analysis.performance?.firstContentfulPaint && analysis.performance.firstContentfulPaint > 2.5) {
    suggestions.push("Améliorez le temps de chargement initial");
  }

  return suggestions;
};

const SeoResults = ({ seoAnalysis }: SeoResultsProps) => {
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  
  useEffect(() => {
    console.log("SeoResults rendering with data:", {
      title: seoAnalysis.title,
      headings: seoAnalysis.headings || {},
      h1Count: seoAnalysis.h1Count,
      h2Count: seoAnalysis.h2Count,
      h3Count: seoAnalysis.h3Count,
      hierarchy: seoAnalysis.headingStructure?.length || 0,
      keywordSuggestions: seoAnalysis.keywordSuggestions?.length || 0
    });
  }, [seoAnalysis]);

  const seoScore = calculateSeoScore(seoAnalysis);
  const suggestions = getSeoSuggestions(seoAnalysis);

  return (
    <Card className="p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Résultats de l'analyse SEO</h2>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Score SEO global</h3>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              {seoScore}
            </div>
            <div className="ml-4">
              <p className="text-gray-700">
                {seoScore >= 80 ? "Excellent" : 
                 seoScore >= 60 ? "Bon" : 
                 seoScore >= 40 ? "Moyen" : 
                 "Nécessite des améliorations"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Basé sur {suggestions.length} recommandations
              </p>
            </div>
          </div>
        </div>
        
        {suggestions.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Recommandations</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Informations sur la page</h3>
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">URL</span>
              <span className="font-medium">{seoAnalysis.url}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">Titre</span>
              <span className="font-medium">{seoAnalysis.title || "Non trouvé"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">Description</span>
              <span className="font-medium">{seoAnalysis.description || "Non trouvée"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">Mots</span>
              <span className="font-medium">{seoAnalysis.wordCount || 0}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">Liens internes</span>
              <span className="font-medium">{seoAnalysis.internalLinks || 0}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Liens externes</span>
              <span className="font-medium">{seoAnalysis.externalLinks || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SeoResults;
