
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SeoStructure from '@/components/seo/SeoStructure';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StructureKeywordsSection from '@/components/seo/StructureKeywordsSection';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import ContentStructureAnalyzer from '@/components/seo/ContentStructureAnalyzer';

interface HeadingItem {
  text: string;
  level: number;
  position: number;
}

interface ParagraphItem {
  text: string;
  position: number;
}

interface ContentHierarchyProps {
  headings: HeadingItem[];
  paragraphs?: ParagraphItem[];
  hierarchy?: any[];
  url: string;
  recommendations?: string[];
  optimizationStatus?: any;
}

const ContentHierarchy = ({ 
  headings = [], 
  paragraphs = [],
  hierarchy = [], 
  url,
  recommendations = [],
  optimizationStatus
}: ContentHierarchyProps) => {
  // Extract counts
  const h1Count = headings.filter(h => h.level === 1).length;
  const h2Count = headings.filter(h => h.level === 2).length;
  const h3Count = headings.filter(h => h.level === 3).length;
  
  // Generate mock image count
  // In a real app, this would come from the actual page analysis
  const imgCount = 5;
  const missingAltCount = 1;
  
  // Mock data for comprehensive analysis
  const wordCount = paragraphs.reduce((total, p) => {
    return total + (p.text?.split(/\s+/).length || 0);
  }, 0) || 750;
  
  // Generate mock keywords
  const mockKeywords = [
    { keyword: "seo", volume: 10000, cpc: 2.5, difficulty: 65, score: 80 },
    { keyword: "structure de site", volume: 1200, cpc: 1.8, difficulty: 45, score: 85 },
    { keyword: "analyse seo", volume: 3300, cpc: 2.1, difficulty: 55, score: 75 },
    { keyword: "optimisation web", volume: 2700, cpc: 1.9, difficulty: 60, score: 70 }
  ];
  
  // Mock questions based on the headings
  const mockQuestions = headings
    .filter(h => h.level > 1 && h.text.length > 10)
    .slice(0, 3)
    .map(h => `Comment ${h.text.toLowerCase()}?`);
  
  // Add some standard questions
  const standardQuestions = [
    "Quelle est la structure idéale pour un site web?",
    "Pourquoi la hiérarchie des balises HTML est importante pour le SEO?",
    "Comment optimiser les titres de ma page web?"
  ];
  
  const allQuestions = [...mockQuestions, ...standardQuestions].slice(0, 5);

  // Extract top phrases from text content
  const extractPhrases = () => {
    const allText = paragraphs.map(p => p.text).join(' ');
    const words = allText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    const phrases: Record<string, number> = {};
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = words.slice(i, i + 3).join(' ');
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }
    
    return Object.entries(phrases)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([phrase, count]) => ({ phrase, count }));
  };

  // Badge variants pour les compteurs de balises H1, H2, H3
  const getH1BadgeVariant = () => h1Count === 1 ? "default" : "destructive";
  const getH2BadgeVariant = () => h2Count >= 1 ? "default" : "outline";
  const getH3BadgeVariant = () => h3Count >= 1 ? "default" : "outline";
  
  // Messages sur l'état d'optimisation de la page
  const getH1StatusMessage = () => {
    if (h1Count === 0) return "Aucune balise H1 trouvée - à corriger absolument";
    if (h1Count === 1) return "Parfait ! Une seule balise H1 présente";
    return "Attention : plusieurs balises H1 trouvées - à corriger";
  };
  
  const getH2StatusMessage = () => {
    if (h2Count === 0) return "Aucune balise H2 trouvée - à ajouter";
    if (h2Count >= 1 && h2Count <= 5) return "Bonne utilisation des balises H2";
    return `${h2Count} balises H2 trouvées - structure correcte`;
  };

  // Récupérer l'état d'optimisation pour les sections
  const h1Status = optimizationStatus?.h1 || {
    count: h1Count,
    isOptimized: h1Count === 1,
    message: getH1StatusMessage()
  };
  
  const h2Status = optimizationStatus?.h2 || {
    count: h2Count,
    isOptimized: h2Count > 0,
    message: getH2StatusMessage()
  };
  
  const h3Status = optimizationStatus?.h3 || {
    count: h3Count,
    isOptimized: h3Count > 0,
    message: h3Count === 0 ? "Aucune balise H3 trouvée" : "Bonne structure avec balises H3"
  };
  
  const structureStatus = optimizationStatus?.structure || {
    isOptimized: h1Count === 1 && h2Count > 0,
    message: h1Count === 1 && h2Count > 0 ? 
            "Structure hiérarchique correcte" : 
            "Structure hiérarchique à améliorer"
  };
  
  // Calculer le score d'optimisation global
  const calculateOverallScore = () => {
    let score = 0;
    let maxScore = 0;
    
    // Vérification H1
    maxScore += 40;
    if (h1Count === 1) score += 40;
    else if (h1Count > 1) score += 10;
    
    // Vérification H2
    maxScore += 30;
    if (h2Count >= 2 && h2Count <= 8) score += 30;
    else if (h2Count > 0) score += 20;
    
    // Vérification H3
    maxScore += 20;
    if (h3Count > 0) score += 20;
    
    // Vérification hiérarchie
    maxScore += 10;
    if (structureStatus.isOptimized) score += 10;
    
    return Math.round((score / maxScore) * 100);
  };
  
  const overallScore = calculateOverallScore();

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Structure du contenu</h2>
            <p className="text-gray-500 text-sm flex items-center">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              {url}
            </p>
          </div>
          
          <div className="mt-2 sm:mt-0 flex items-center">
            <div className="mr-3 flex flex-col items-end">
              <span className="text-sm text-gray-500">Score structure</span>
              <span className={`font-bold text-lg ${
                overallScore >= 80 ? "text-green-600" : 
                overallScore >= 60 ? "text-amber-600" : 
                "text-red-600"
              }`}>{overallScore}%</span>
            </div>
            <div className="flex">
              <Badge variant={getH1BadgeVariant()} className="mr-2">
                {h1Count} H1
              </Badge>
              <Badge variant={getH2BadgeVariant()} className="mr-2">
                {h2Count} H2
              </Badge>
              <Badge variant={getH3BadgeVariant()}>
                {h3Count} H3
              </Badge>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="analyzer" className="mt-2">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="analyzer">Analyse complète</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyzer">
            <ContentStructureAnalyzer
              h1Count={h1Count}
              h2Count={h2Count}
              h3Count={h3Count}
              imgCount={imgCount}
              missingAltCount={missingAltCount}
              wordCount={wordCount}
              contentLength={wordCount * 6}
              paragraphCount={paragraphs.length || 10}
              hierarchy={hierarchy}
              pageUrl={url}
              score={overallScore}
              isSSR={false}
              hasSchema={false}
              hasCanonical={true}
              keywordsInHeadings={2}
            />
          </TabsContent>
          
          <TabsContent value="structure" className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
              <h3 className="font-medium text-blue-800 mb-2">État de l'optimisation</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 ${h1Status.isOptimized ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {h1Status.isOptimized ? '✓' : '!'}
                  </div>
                  <div>
                    <p className="font-medium">{h1Status.message}</p>
                    <p className="text-sm text-gray-600">Une seule balise H1 est nécessaire pour définir le sujet principal de la page</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 ${h2Status.isOptimized ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {h2Status.isOptimized ? '✓' : '!'}
                  </div>
                  <div>
                    <p className="font-medium">{h2Status.message}</p>
                    <p className="text-sm text-gray-600">Les balises H2 structurent les sections principales de votre contenu</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 ${h3Status.isOptimized ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {h3Status.isOptimized ? '✓' : '!'}
                  </div>
                  <div>
                    <p className="font-medium">{h3Status.message}</p>
                    <p className="text-sm text-gray-600">Les balises H3 organisent les sous-sections pour une meilleure lisibilité</p>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Diagnostic global:</span>
                    <span className={`px-2 py-0.5 rounded text-sm ${
                      structureStatus.isOptimized ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {structureStatus.message}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <SeoStructure 
              h1Count={h1Count} 
              h2Count={h2Count} 
              h3Count={h3Count} 
              imgCount={imgCount}
              headings={headings}
              showHeadingsList={true}
              hierarchy={hierarchy}
              optimizationStatus={optimizationStatus || {
                h1: h1Status,
                h2: h2Status,
                h3: h3Status,
                structure: structureStatus
              }}
            />
          </TabsContent>
          
          <TabsContent value="keywords">
            <StructureKeywordsSection 
              keywords={mockKeywords}
              phrases={extractPhrases()}
              questions={allQuestions}
              isLoading={false}
            />
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium text-blue-900">Diagnostic SEO</h3>
                </div>
                
                <div className="mt-3 space-y-2">
                  {!h1Status.isOptimized && (
                    <div className="flex items-start bg-white bg-opacity-60 p-2 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Problème de balise H1</p>
                        <p className="text-xs text-gray-600">{h1Status.message}</p>
                      </div>
                    </div>
                  )}
                  
                  {!h2Status.isOptimized && (
                    <div className="flex items-start bg-white bg-opacity-60 p-2 rounded">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Structure des sections incomplète</p>
                        <p className="text-xs text-gray-600">{h2Status.message}</p>
                      </div>
                    </div>
                  )}
                  
                  {!h3Status.isOptimized && (
                    <div className="flex items-start bg-white bg-opacity-60 p-2 rounded">
                      <Info className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Détail des sous-sections limité</p>
                        <p className="text-xs text-gray-600">{h3Status.message}</p>
                      </div>
                    </div>
                  )}
                  
                  {h1Status.isOptimized && h2Status.isOptimized && (
                    <div className="flex items-start bg-white bg-opacity-60 p-2 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Structure bien optimisée</p>
                        <p className="text-xs text-gray-600">Votre hiérarchie de contenu est conforme aux bonnes pratiques SEO</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-medium text-green-900">Impact SEO</h3>
                </div>
                
                <ul className="mt-3 space-y-1 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                    <span>Structure claire pour les moteurs de recherche</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                    <span>Améliore l'accessibilité du contenu</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                    <span>Facilite l'extraction des featured snippets</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                    <span>Améliore l'expérience utilisateur</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                    <span>Réduit le taux de rebond</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
              <BookOpen className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Recommandations pour votre structure</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Voici quelques conseils pour améliorer la structure SEO de votre page.
                </p>
                
                <ul className="space-y-2">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                  
                  {h1Count !== 1 && (
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm font-medium">Ajoutez exactement une balise H1 à votre page</span>
                    </li>
                  )}
                  
                  {h2Count === 0 && (
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm font-medium">Ajoutez des balises H2 pour structurer votre contenu</span>
                    </li>
                  )}
                  
                  {h3Count === 0 && h2Count > 0 && (
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">Envisagez d'ajouter des balises H3 sous vos sections H2</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-medium text-green-800 mb-2">Plan d'action</h3>
              <p className="text-green-700 text-sm mb-3">
                Suivez ces étapes pour optimiser la structure de votre page:
              </p>
              <ol className="space-y-2 ml-5 list-decimal">
                {h1Count !== 1 && (
                  <li className="text-sm">
                    <span className="font-medium">{h1Count === 0 ? "Ajoutez une balise H1" : "Gardez uniquement une balise H1"}</span> - 
                    Elle doit contenir votre mot-clé principal et décrire le sujet de la page
                  </li>
                )}
                {h2Count < 2 && (
                  <li className="text-sm">
                    <span className="font-medium">Structurez votre contenu avec des balises H2</span> - 
                    Chaque section principale mérite un titre H2 descriptif
                  </li>
                )}
                <li className="text-sm">
                  <span className="font-medium">Vérifiez que votre hiérarchie est logique</span> - 
                  Les H1 doivent être suivis de H2, puis de H3, sans sauter de niveaux
                </li>
                <li className="text-sm">
                  <span className="font-medium">Intégrez vos mots-clés naturellement</span> - 
                  Placez vos termes importants dans les titres, mais gardez-les lisibles
                </li>
                <li className="text-sm">
                  <span className="font-medium">Utilisez des H3 pour les sous-sections</span> - 
                  Chaque section H2 devrait idéalement contenir des sous-sections H3
                </li>
                <li className="text-sm">
                  <span className="font-medium">Limitez la longueur des titres</span> - 
                  Idéalement entre 40 et 60 caractères pour une meilleure visibilité
                </li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentHierarchy;
