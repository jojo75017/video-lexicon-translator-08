
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertTriangle, FileText, ListTree, ArrowRight, Info, Heart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { HierarchyItem, StructureItem } from '@/types/seo/Hierarchy';

interface ContentStructureAnalyzerProps {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imgCount: number;
  missingAltCount?: number;
  wordCount?: number;
  contentLength?: number;
  paragraphCount?: number;
  hierarchy?: HierarchyItem[];
  pageUrl?: string;
  score?: number;
  isSSR?: boolean;
  hasSchema?: boolean;
  hasCanonical?: boolean;
  keywordsInHeadings?: number;
}

const ContentStructureAnalyzer: React.FC<ContentStructureAnalyzerProps> = ({
  h1Count,
  h2Count,
  h3Count,
  imgCount,
  missingAltCount = 0,
  wordCount = 0,
  contentLength = 0,
  paragraphCount = 0,
  hierarchy = [],
  pageUrl = "",
  score = 0,
  isSSR = false,
  hasSchema = false,
  hasCanonical = true,
  keywordsInHeadings = 0
}) => {
  // Calculate scores for different aspects
  const getHeadingScore = () => {
    let score = 0;
    if (h1Count === 1) score += 100;
    else if (h1Count > 1) score += 30;
    
    if (h2Count >= 2 && h2Count <= 8) score += 100;
    else if (h2Count > 0) score += 70;
    else score += 0;
    
    if (h3Count > 0) score += 100;
    else score += 50;
    
    return Math.round((score / 3));
  };
  
  const getMediaScore = () => {
    if (imgCount === 0) return 0;
    
    const altScore = imgCount > 0 ? 100 - (missingAltCount / imgCount * 100) : 100;
    const densityScore = imgCount > 0 && paragraphCount > 0 ? 
      Math.min(100, Math.max(0, 100 - Math.abs((imgCount / paragraphCount * 10) - 3) * 20)) : 50;
    
    return Math.round((altScore + densityScore) / 2);
  };
  
  const getContentScore = () => {
    // Word count score: 300-1500 is ideal
    let wordScore = 0;
    if (wordCount >= 300 && wordCount <= 1500) wordScore = 100;
    else if (wordCount > 1500) wordScore = 80;
    else if (wordCount > 200) wordScore = 70;
    else if (wordCount > 100) wordScore = 50;
    else wordScore = 30;
    
    // Paragraph length: average 40-70 words per paragraph is good
    const avgWordsPerParagraph = paragraphCount > 0 ? wordCount / paragraphCount : 0;
    let paragraphScore = 0;
    if (avgWordsPerParagraph >= 40 && avgWordsPerParagraph <= 70) paragraphScore = 100;
    else if (avgWordsPerParagraph > 25 && avgWordsPerParagraph < 100) paragraphScore = 80;
    else paragraphScore = 60;
    
    return Math.round((wordScore + paragraphScore) / 2);
  };
  
  const getTechScore = () => {
    let score = 0;
    if (isSSR) score += 100; else score += 50;
    if (hasSchema) score += 100; else score += 0;
    if (hasCanonical) score += 100; else score += 0;
    
    return Math.round(score / 3);
  };
  
  const headingScore = getHeadingScore();
  const mediaScore = getMediaScore();
  const contentScore = getContentScore();
  const techScore = getTechScore();
  const overallScore = Math.round((headingScore + mediaScore + contentScore + techScore) / 4);
  
  // Generate improvement suggestions based on scores
  const getSuggestions = () => {
    const suggestions = [];
    
    // Heading suggestions
    if (h1Count === 0) {
      suggestions.push({ 
        title: "Ajoutez une balise H1", 
        description: "Chaque page doit avoir exactement une balise H1 qui décrit le contenu principal de la page.",
        priority: "high"
      });
    }
    else if (h1Count > 1) {
      suggestions.push({ 
        title: "Réduisez à une seule balise H1", 
        description: "Pour le SEO, il est recommandé d'avoir une seule balise H1 sur la page.",
        priority: "high"
      });
    }
    
    if (h2Count === 0) {
      suggestions.push({ 
        title: "Ajoutez des balises H2", 
        description: "Les titres H2 structurent le contenu en sections principales, améliorant la lisibilité et le SEO.",
        priority: "medium"
      });
    }
    
    if (h3Count === 0 && h2Count > 0) {
      suggestions.push({ 
        title: "Ajoutez des balises H3", 
        description: "Les balises H3 pour les sous-sections améliorent la structure et la lisibilité.",
        priority: "low" 
      });
    }
    
    // Content suggestions
    if (wordCount < 300) {
      suggestions.push({ 
        title: "Augmentez la longueur du contenu", 
        description: "Un contenu d'au moins 300 mots est généralement nécessaire pour bien référencer une page.",
        priority: wordCount < 200 ? "high" : "medium"
      });
    }
    
    if (paragraphCount > 0 && wordCount / paragraphCount > 100) {
      suggestions.push({ 
        title: "Divisez les paragraphes trop longs", 
        description: "Des paragraphes plus courts (40-70 mots) améliorent la lisibilité et l'engagement.",
        priority: "medium"
      });
    }
    
    // Media suggestions
    if (imgCount === 0) {
      suggestions.push({ 
        title: "Ajoutez des images", 
        description: "Les images engagent les visiteurs et améliorent le temps passé sur la page.",
        priority: "medium"
      });
    }
    
    if (missingAltCount > 0) {
      suggestions.push({ 
        title: `Ajoutez des attributs alt aux ${missingAltCount} images`, 
        description: "Les attributs alt sont essentiels pour l'accessibilité et le SEO des images.",
        priority: "high"
      });
    }
    
    // Technical suggestions
    if (!isSSR) {
      suggestions.push({ 
        title: "Envisagez d'utiliser le rendu côté serveur (SSR)", 
        description: "Le SSR améliore le temps de chargement perçu et le crawling des moteurs de recherche.",
        priority: "low"
      });
    }
    
    if (!hasSchema) {
      suggestions.push({ 
        title: "Ajoutez des données structurées (Schema.org)", 
        description: "Les données structurées aident les moteurs de recherche à comprendre votre contenu.",
        priority: "medium"
      });
    }
    
    if (!hasCanonical) {
      suggestions.push({ 
        title: "Ajoutez une balise canonique", 
        description: "Une URL canonique prévient les problèmes de contenu dupliqué.",
        priority: "high"
      });
    }
    
    if (keywordsInHeadings < 3) {
      suggestions.push({ 
        title: "Intégrez plus de mots-clés dans vos titres", 
        description: "Les titres contenant des mots-clés ont un impact significatif sur le SEO.",
        priority: "medium"
      });
    }
    
    return suggestions;
  };

  const suggestions = getSuggestions();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center">
            <ListTree className="mr-2 h-5 w-5 text-blue-600" />
            Structure de contenu détaillée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score global</span>
                <span className={`text-lg font-bold ${
                  overallScore >= 80 ? "text-green-600" :
                  overallScore >= 60 ? "text-amber-600" : "text-red-600"
                }`}>{overallScore}/100</span>
              </div>
              <Progress 
                className="h-2" 
                value={overallScore} 
                // Fixed: removed indicatorColor prop and used className for styling
                className={`h-2 ${
                  overallScore >= 80 ? "bg-green-600" :
                  overallScore >= 60 ? "bg-amber-500" : "bg-red-500"
                }`}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-2 rounded-md text-center">
                <span className="text-xs text-blue-600">Structure</span>
                <div className={`text-lg font-bold ${
                  headingScore >= 80 ? "text-green-600" :
                  headingScore >= 60 ? "text-amber-600" : "text-red-600"
                }`}>{headingScore}</div>
              </div>
              
              <div className="bg-green-50 p-2 rounded-md text-center">
                <span className="text-xs text-green-600">Média</span>
                <div className={`text-lg font-bold ${
                  mediaScore >= 80 ? "text-green-600" :
                  mediaScore >= 60 ? "text-amber-600" : "text-red-600"
                }`}>{mediaScore}</div>
              </div>
              
              <div className="bg-amber-50 p-2 rounded-md text-center">
                <span className="text-xs text-amber-600">Contenu</span>
                <div className={`text-lg font-bold ${
                  contentScore >= 80 ? "text-green-600" :
                  contentScore >= 60 ? "text-amber-600" : "text-red-600"
                }`}>{contentScore}</div>
              </div>
              
              <div className="bg-purple-50 p-2 rounded-md text-center">
                <span className="text-xs text-purple-600">Technique</span>
                <div className={`text-lg font-bold ${
                  techScore >= 80 ? "text-green-600" :
                  techScore >= 60 ? "text-amber-600" : "text-red-600"
                }`}>{techScore}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium mb-2">Métriques de la page</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Mots</div>
                  <div className="text-xl font-bold">{wordCount}</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Paragraphes</div>
                  <div className="text-xl font-bold">{paragraphCount}</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Images</div>
                  <div className="text-xl font-bold">{imgCount}</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Titres</div>
                  <div className="text-xl font-bold">{h1Count + h2Count + h3Count}</div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-base font-medium mb-2">Structure des titres</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                  <Badge variant={h1Count === 1 ? "default" : "destructive"}>H1</Badge>
                  <span>{h1Count}</span>
                  {h1Count === 1 ? 
                    <Check className="h-4 w-4 text-green-600" /> :
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  }
                  <span className="text-sm text-gray-500">{h1Count === 1 ? "Parfait" : h1Count > 1 ? "Trop nombreux" : "Manquant"}</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                  <Badge variant={h2Count > 0 ? "default" : "outline"}>H2</Badge>
                  <span>{h2Count}</span>
                  {h2Count > 0 ? 
                    <Check className="h-4 w-4 text-green-600" /> :
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  }
                  <span className="text-sm text-gray-500">{h2Count > 0 ? "Présents" : "Manquants"}</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                  <Badge variant="outline">H3+</Badge>
                  <span>{h3Count}</span>
                  <span className="text-sm text-gray-500">Sous-titres</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-base font-medium mb-2">Suggestions d'amélioration</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className={`p-3 rounded-md border ${
                    suggestion.priority === "high" ? "border-red-200 bg-red-50" :
                    suggestion.priority === "medium" ? "border-amber-200 bg-amber-50" :
                    "border-blue-200 bg-blue-50"
                  }`}>
                    <div className="flex items-start gap-3">
                      {suggestion.priority === "high" ? (
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      ) : suggestion.priority === "medium" ? (
                        <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                      ) : (
                        <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5" />
                      )}
                      <div>
                        <h4 className="text-sm font-medium">{suggestion.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {suggestions.length === 0 && (
                  <div className="p-4 rounded-md bg-green-50 border border-green-200 flex items-center gap-3">
                    <Heart className="h-5 w-5 text-green-600" />
                    <div className="text-green-800">
                      Excellent ! Votre structure de contenu est bien optimisée pour le SEO.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentStructureAnalyzer;
