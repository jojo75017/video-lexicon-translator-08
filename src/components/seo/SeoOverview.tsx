
// Correction de l'erreur cssCount non existant dans Performance

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SeoAnalysisResult } from '@/types/seo';
import { Zap, FileText, Search, Link, FileImage, AlignLeft, Clock } from 'lucide-react';

interface SeoOverviewProps {
  analysis?: SeoAnalysisResult;
  isLoading?: boolean;
}

const SeoOverview = ({ analysis, isLoading = false }: SeoOverviewProps) => {
  if (isLoading) {
    return (
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            Aperçu SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-24 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 w-48 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            Aperçu SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>Aucune donnée d'analyse disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metaTagsScore = calculateMetaTagsScore(analysis);
  const contentScore = calculateContentScore(analysis);
  const technicalScore = calculateTechnicalScore(analysis);
  const overallScore = Math.round((metaTagsScore + contentScore + technicalScore) / 3);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-500" />
          Aperçu SEO
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}/100
            </div>
            <div className="text-sm text-gray-500">Score global</div>
          </div>
          
          <Separator orientation="vertical" className="h-12" />
          
          <div className="text-center">
            <div className={`text-xl font-semibold ${getScoreColor(metaTagsScore)}`}>
              {metaTagsScore}
            </div>
            <div className="text-xs text-gray-500">Meta tags</div>
          </div>
          
          <div className="text-center">
            <div className={`text-xl font-semibold ${getScoreColor(contentScore)}`}>
              {contentScore}
            </div>
            <div className="text-xs text-gray-500">Contenu</div>
          </div>
          
          <div className="text-center">
            <div className={`text-xl font-semibold ${getScoreColor(technicalScore)}`}>
              {technicalScore}
            </div>
            <div className="text-xs text-gray-500">Technique</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Title</span>
            <Badge 
              variant="outline" 
              className={`ml-auto ${analysis.title && analysis.title.length > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {analysis.title ? `${analysis.title.length} caractères` : 'Absent'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Description</span>
            <Badge 
              variant="outline" 
              className={`ml-auto ${analysis.description && analysis.description.length > 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              {analysis.description ? `${analysis.description.length} caractères` : 'Absente'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <FileImage className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Images</span>
            <Badge 
              variant="outline" 
              className={`ml-auto ${analysis.imageCount && analysis.imageCount > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              {analysis.imageCount || 0} images
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Link className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Backlinks</span>
            <Badge 
              variant="outline" 
              className={`ml-auto ${analysis.backlinks && analysis.backlinks > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              {analysis.backlinks || 0} liens
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Performance</span>
            <Badge 
              variant="outline" 
              className={`ml-auto ${analysis.loadTime && analysis.loadTime < 3000 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              {analysis.loadTime ? `${(analysis.loadTime / 1000).toFixed(1)}s` : 'N/A'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Temps de réponse</span>
            <Badge
              variant="outline" 
              className={`ml-auto bg-blue-100 text-blue-800`}
            >
              {analysis.loadTime ? `${Math.floor(analysis.loadTime / 20)}ms` : 'N/A'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Fonctions de calcul de score
const calculateMetaTagsScore = (analysis: SeoAnalysisResult): number => {
  let score = 70; // Score de base
  
  if (analysis.title && analysis.title.length >= 30 && analysis.title.length <= 60) {
    score += 10;
  }
  
  if (analysis.description && analysis.description.length >= 120 && analysis.description.length <= 160) {
    score += 10;
  }
  
  if (analysis.hasCanonical) {
    score += 5;
  }
  
  if (analysis.hasRobots) {
    score += 5;
  }
  
  return Math.min(100, score);
};

const calculateContentScore = (analysis: SeoAnalysisResult): number => {
  let score = 60; // Score de base
  
  if (analysis.wordCount && analysis.wordCount >= 300) {
    score += 10;
  }
  
  if (analysis.h1Count === 1) {
    score += 10;
  }
  
  if (analysis.h2Count && analysis.h2Count >= 2) {
    score += 5;
  }
  
  if (analysis.h3Count && analysis.h3Count >= 2) {
    score += 5;
  }
  
  if (analysis.imageCount && analysis.imageCount >= 1) {
    score += 5;
  }
  
  if (analysis.readabilityScore && analysis.readabilityScore >= 60) {
    score += 5;
  }
  
  return Math.min(100, score);
};

const calculateTechnicalScore = (analysis: SeoAnalysisResult): number => {
  let score = 65; // Score de base
  
  if (analysis.loadTime && analysis.loadTime < 3000) {
    score += 10;
  } else if (analysis.loadTime && analysis.loadTime < 5000) {
    score += 5;
  }
  
  if (analysis.secureConnection) {
    score += 10;
  }
  
  if (analysis.mobileCompatible) {
    score += 10;
  }
  
  if (!analysis.brokenLinksCount || analysis.brokenLinksCount === 0) {
    score += 5;
  }
  
  return Math.min(100, score);
};

export default SeoOverview;
