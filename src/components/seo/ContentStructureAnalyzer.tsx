
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
                indicatorColor={
                  overallScore >= 80 ? "bg-green-600" :
                  overallScore >= 60 ? "bg-amber-500" : "bg-red-500"
                }
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
                  <span className="text-sm text-gray-500">{h1Count === 1 ? "Parfait" : h1Count === 0 ? "Manquant" : "Trop nombreux"}</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                  <Badge variant={h2Count > 0 ? "default" : "outline"}>H2</Badge>
                  <span>{h2Count}</span>
                  {h2Count > 0 ? 
                    <Check className="h-4 w-4 text-green-600" /> :
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  }
                  <span className="text-sm text-gray-500">{h2Count > 0 ? "Bien" : "Manquant"}</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                  <Badge variant={h3Count > 0 ? "default" : "outline"}>H3</Badge>
                  <span>{h3Count}</span>
                  {h3Count > 0 ? 
                    <Check className="h-4 w-4 text-green-600" /> :
                    <Info className="h-4 w-4 text-amber-600" />
                  }
                  <span className="text-sm text-gray-500">{h3Count > 0 ? "Bien" : "Recommandé"}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-base font-medium mb-2">Détail du contenu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Densité de mots</span>
                    <span className={`text-sm ${wordCount >= 300 ? "text-green-600" : "text-amber-600"}`}>
                      {wordCount >= 300 
                        ? wordCount >= 1000 ? "Excellente" : "Bonne" 
                        : wordCount >= 200 ? "Moyenne" : "Faible"}
                    </span>
                  </div>
                  <Progress 
                    className="h-1.5 mb-1" 
                    value={Math.min(100, wordCount / 10)} 
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0</span>
                    <span>500</span>
                    <span>1000</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Paragraphes</span>
                    <span className={`text-sm ${
                      paragraphCount >= 5 ? "text-green-600" : "text-amber-600"
                    }`}>
                      {paragraphCount >= 10 ? "Nombreux" : 
                       paragraphCount >= 5 ? "Bien" : "Peu"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Mots/paragraphe:</span>
                    <span className="text-xs font-medium">
                      {paragraphCount > 0 ? Math.round(wordCount / paragraphCount) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-base font-medium mb-2">Médias et ressources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Images</span>
                    <span className={`text-sm ${
                      imgCount > 0 ? "text-green-600" : "text-amber-600"
                    }`}>
                      {imgCount > 5 ? "Nombreuses" : 
                       imgCount > 0 ? "Présentes" : "Aucune"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Attributs alt manquants:</span>
                    <span className={`text-xs font-medium ${
                      missingAltCount > 0 ? "text-red-600" : "text-green-600"
                    }`}>
                      {missingAltCount} / {imgCount}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Ratio texte/médias</span>
                    <span className={`text-sm ${
                      imgCount > 0 && paragraphCount / imgCount <= 5 
                        ? "text-green-600" : "text-amber-600"
                    }`}>
                      {imgCount > 0
                        ? paragraphCount / imgCount <= 3
                          ? "Équilibré" 
                          : paragraphCount / imgCount <= 5
                            ? "Bon"
                            : "Trop de texte"
                        : "N/A"}
                    </span>
                  </div>
                  <Progress 
                    className="h-1.5" 
                    value={imgCount > 0 ? Math.min(100, 100 - ((paragraphCount / imgCount - 3) * 10)) : 0} 
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center">
            <ArrowRight className="mr-2 h-5 w-5 text-green-600" />
            Recommandations d'amélioration détaillées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Suggestions prioritaires */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                Améliorations critiques
              </h3>
              
              {suggestions.filter(s => s.priority === "high").length > 0 ? (
                <div className="space-y-3">
                  {suggestions
                    .filter(s => s.priority === "high")
                    .map((suggestion, index) => (
                      <div key={`high-${index}`} className="bg-red-50 border border-red-100 rounded-md p-3">
                        <div className="font-medium text-red-900">{suggestion.title}</div>
                        <p className="text-sm text-red-700 mt-1">{suggestion.description}</p>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="bg-green-50 border border-green-100 rounded-md p-3">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <div className="font-medium text-green-800">Aucun problème critique détecté</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Suggestions moyennes */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Info className="h-4 w-4 mr-2 text-amber-500" />
                Améliorations recommandées
              </h3>
              
              <div className="space-y-3">
                {suggestions
                  .filter(s => s.priority === "medium")
                  .map((suggestion, index) => (
                    <div key={`medium-${index}`} className="bg-amber-50 border border-amber-100 rounded-md p-3">
                      <div className="font-medium text-amber-900">{suggestion.title}</div>
                      <p className="text-sm text-amber-700 mt-1">{suggestion.description}</p>
                    </div>
                  ))
                }
                
                {suggestions.filter(s => s.priority === "medium").length === 0 && (
                  <div className="bg-green-50 border border-green-100 rounded-md p-3">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <div className="font-medium text-green-800">Pas d'améliorations recommandées</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Suggestions secondaires */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Heart className="h-4 w-4 mr-2 text-blue-500" />
                Améliorations optionnelles
              </h3>
              
              <div className="space-y-3">
                {suggestions
                  .filter(s => s.priority === "low")
                  .map((suggestion, index) => (
                    <div key={`low-${index}`} className="bg-blue-50 border border-blue-100 rounded-md p-3">
                      <div className="font-medium text-blue-900">{suggestion.title}</div>
                      <p className="text-sm text-blue-700 mt-1">{suggestion.description}</p>
                    </div>
                  ))
                }
                
                {suggestions.filter(s => s.priority === "low").length === 0 && (
                  <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                    <div className="text-sm text-gray-600">
                      Pas d'améliorations optionnelles suggérées
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Plan d'amélioration */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-3">Plan d'action recommandé</h3>
              <ol className="list-decimal pl-5 space-y-2">
                {h1Count !== 1 && (
                  <li className="text-blue-700">{h1Count === 0 ? "Ajoutez une balise H1 décrivant le sujet principal de la page" : "Gardez uniquement la balise H1 la plus importante et convertissez les autres en H2"}</li>
                )}
                
                {h2Count === 0 && (
                  <li className="text-blue-700">Structurez votre contenu avec des balises H2 pour les sections principales</li>
                )}
                
                {missingAltCount > 0 && (
                  <li className="text-blue-700">Ajoutez des attributs alt descriptifs aux {missingAltCount} images manquantes</li>
                )}
                
                {wordCount < 300 && (
                  <li className="text-blue-700">Augmentez le contenu textuel à au moins 300 mots pour un meilleur référencement</li>
                )}
                
                {!hasSchema && (
                  <li className="text-blue-700">Implémentez des données structurées Schema.org appropriées pour votre type de contenu</li>
                )}
                
                {paragraphCount > 0 && wordCount / paragraphCount > 100 && (
                  <li className="text-blue-700">Divisez les paragraphes trop longs pour améliorer la lisibilité</li>
                )}
                
                {keywordsInHeadings < 3 && (
                  <li className="text-blue-700">Intégrez vos mots-clés principaux dans les titres et sous-titres</li>
                )}
                
                {!hasCanonical && (
                  <li className="text-blue-700">Ajoutez une balise canonique pour éviter les problèmes de contenu dupliqué</li>
                )}
                
                {imgCount === 0 && (
                  <li className="text-blue-700">Ajoutez des images pertinentes pour améliorer l'engagement</li>
                )}
                
                {h3Count === 0 && h2Count > 0 && (
                  <li className="text-blue-700">Ajoutez des sous-titres H3 sous vos sections H2 pour une meilleure organisation</li>
                )}
                
                {suggestions.length === 0 && (
                  <li className="text-green-700">Votre page est bien optimisée! Continuez à maintenir cette qualité.</li>
                )}
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentStructureAnalyzer;
