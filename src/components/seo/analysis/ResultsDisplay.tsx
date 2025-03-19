
import React from 'react';
import { SeoAnalysis } from '@/types/seo';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle, Clock, Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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

  const score = calculateOverallScore(seoAnalysis);
  const issues = generateIssues(seoAnalysis);
  const scoreColor = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";

  return (
    <Card className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <Search className="h-5 w-5 mr-2 text-blue-600" />
        Résultats de l'analyse
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Score global</p>
            <Badge 
              variant="outline" 
              className={`${
                score >= 80 ? "bg-green-100 text-green-800 border-green-200" : 
                score >= 60 ? "bg-amber-100 text-amber-800 border-amber-200" : 
                "bg-red-100 text-red-800 border-red-200"
              }`}
            >
              {score}%
            </Badge>
          </div>
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mr-3 border-4 border-white shadow-sm" style={{backgroundColor: scoreColor}}>
              <span className="text-white text-lg font-bold">{score}</span>
            </div>
            <div className="flex-1">
              <Progress value={score} className="h-2 mb-1" />
              <p className="text-xs text-gray-500">
                {score >= 80 ? "Excellent" : score >= 60 ? "Amélioration possible" : "Nécessite attention"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Performance</p>
            <Badge 
              variant="outline" 
              className="bg-blue-100 text-blue-800 border-blue-200"
            >
              {seoAnalysis.performance?.score || 0}%
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold mb-1">
                {seoAnalysis.performance?.loadTime 
                  ? (seoAnalysis.performance.loadTime / 1000).toFixed(2) 
                  : 'N/A'} <span className="text-xs font-normal text-gray-500">sec</span>
              </p>
              <p className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Temps de chargement
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold mb-1">
                {seoAnalysis.performance?.resourceCount || 0}
              </p>
              <p className="text-xs text-gray-500">Ressources</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Contenu</p>
            <Badge 
              variant="outline" 
              className="bg-amber-100 text-amber-800 border-amber-200"
            >
              {seoAnalysis.contentQuality?.score || seoAnalysis.readabilityScore || 0}%
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold mb-1">
                {seoAnalysis.wordCount || 0}
              </p>
              <p className="text-xs text-gray-500">Mots</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold mb-1">
                {(seoAnalysis.h1Count || 0) + (seoAnalysis.h2Count || 0) + (seoAnalysis.h3Count || 0)}
              </p>
              <p className="text-xs text-gray-500">Titres</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Mots-clés</p>
            <Badge 
              variant="outline" 
              className="bg-emerald-100 text-emerald-800 border-emerald-200"
            >
              {(seoAnalysis.topKeywords?.length || 0)} trouvés
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold mb-1">
                {seoAnalysis.topKeywords?.[0]?.keyword || 'N/A'}
              </p>
              <p className="text-xs text-gray-500">Mot-clé principal</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold mb-1 flex items-center justify-end">
                {seoAnalysis.topKeywords?.[0]?.position || 0}
                {seoAnalysis.topKeywords?.[0]?.position < 10 ? (
                  <ArrowUp className="ml-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="ml-1 h-4 w-4 text-red-500" />
                )}
              </p>
              <p className="text-xs text-gray-500">Position</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            Problèmes détectés ({issues.length})
          </h4>
          {issues.length > 0 ? (
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200 text-sm">
                  {issue}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 p-3 rounded-md border border-green-100 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-700">Aucun problème majeur détecté</p>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Mots-clés détectés</h4>
          <div className="flex flex-wrap gap-2">
            {seoAnalysis.topKeywords?.map((keyword, index) => (
              <div 
                key={index} 
                className="group bg-white border border-gray-200 hover:border-blue-300 px-3 py-1.5 rounded-full flex items-center transition-colors"
              >
                <span className="text-sm font-medium">{keyword.keyword}</span>
                <span className="ml-2 text-xs bg-gray-100 group-hover:bg-blue-100 px-1.5 py-0.5 rounded-full transition-colors">
                  {keyword.position}
                </span>
              </div>
            ))}
            {(!seoAnalysis.topKeywords || seoAnalysis.topKeywords.length === 0) && (
              <p className="text-sm text-gray-500">Aucun mot-clé détecté</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultsDisplay;
