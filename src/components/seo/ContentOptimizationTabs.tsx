
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Search, BarChart, FileCheck, Award, Edit, Check, AlertTriangle, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PerformanceMetrics from '@/components/PerformanceMetrics';

const ContentOptimizationTabs = () => {
  const [readabilityScore, setReadabilityScore] = useState(78);
  const [keywordScore, setKeywordScore] = useState(65);
  const [seoScore, setSeoScore] = useState(82);
  
  // Exemples de suggestions d'optimisation
  const seoSuggestions = [
    { 
      type: 'success', 
      message: 'Votre balise titre est bien optimisée', 
      icon: <Check className="h-4 w-4 text-green-500" /> 
    },
    { 
      type: 'warning', 
      message: 'Ajoutez plus de liens internes vers vos pages importantes', 
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> 
    },
    { 
      type: 'error', 
      message: 'Vos images n\'ont pas toutes un attribut ALT', 
      icon: <AlertTriangle className="h-4 w-4 text-red-500" /> 
    },
  ];
  
  const readabilitySuggestions = [
    { 
      type: 'warning', 
      message: 'Vos phrases sont parfois trop longues (plus de 20 mots)', 
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> 
    },
    { 
      type: 'success', 
      message: 'Bonne utilisation des paragraphes courts', 
      icon: <Check className="h-4 w-4 text-green-500" /> 
    },
  ];
  
  const contentStructure = [
    { type: 'h1', content: 'Comment optimiser son contenu pour le SEO en 2023', score: 95 },
    { type: 'h2', content: 'Les fondamentaux du SEO on-page', score: 90 },
    { type: 'p', content: 'Paragraphe d\'introduction sur les bases du SEO...', score: 85 },
    { type: 'h3', content: 'Optimisation des balises meta', score: 80 },
    { type: 'p', content: 'Paragraphe sur l\'importance des balises meta...', score: 75 },
    { type: 'h2', content: 'La recherche de mots-clés', score: 90 },
    { type: 'p', content: 'Paragraphe sur les techniques de recherche de mots-clés...', score: 80 },
  ];
  
  const keywordAnalysis = [
    { keyword: 'optimisation contenu', density: 1.2, positions: [1, 45, 120, 350], score: 85 },
    { keyword: 'seo', density: 0.8, positions: [10, 80, 200], score: 80 },
    { keyword: 'mots-clés', density: 0.6, positions: [150, 320], score: 70 },
  ];
  
  // Calcul du score d'un élément en fonction de sa couleur
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Optimisation de contenu avancée</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-green-600" />
              <span className="font-medium">Score SEO</span>
            </div>
            <span className="text-lg font-bold">{seoScore}/100</span>
          </div>
          <Progress value={seoScore} className="h-2 mb-1" />
          <p className="text-sm text-green-700">Bon score, quelques optimisations possibles</p>
        </div>
        
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-yellow-600" />
              <span className="font-medium">Lisibilité</span>
            </div>
            <span className="text-lg font-bold">{readabilityScore}/100</span>
          </div>
          <Progress value={readabilityScore} className="h-2 mb-1" />
          <p className="text-sm text-yellow-700">Niveau intermédiaire, accessible au grand public</p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Mots-clés</span>
            </div>
            <span className="text-lg font-bold">{keywordScore}/100</span>
          </div>
          <Progress value={keywordScore} className="h-2 mb-1" />
          <p className="text-sm text-blue-700">Optimisez davantage vos mots-clés secondaires</p>
        </div>
      </div>
      
      <Tabs defaultValue="seo">
        <TabsList className="mb-4">
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>Optimisation SEO</span>
          </TabsTrigger>
          <TabsTrigger value="readability" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <span>Lisibilité</span>
          </TabsTrigger>
          <TabsTrigger value="structure" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Structure</span>
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Mots-clés</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="seo" className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-lg font-medium mb-2">Suggestions d'optimisation SEO</h4>
            <div className="space-y-3">
              {seoSuggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md flex items-start gap-3 ${
                    suggestion.type === 'success' ? 'bg-green-50 border border-green-200' : 
                    suggestion.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 
                    'bg-red-50 border border-red-200'
                  }`}
                >
                  {suggestion.icon}
                  <p className="text-sm">{suggestion.message}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Checklist SEO</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Balise titre optimisée
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Fait</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Meta description
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Fait</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Liens internes
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">À améliorer</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Attributs ALT des images
                  </span>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">À faire</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Actions recommandées</h4>
              <ul className="space-y-2 text-sm">
                <li className="p-2 bg-blue-50 rounded flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>Ajouter 2-3 liens internes vers vos pages principales</span>
                </li>
                <li className="p-2 bg-blue-50 rounded flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>Compléter les attributs ALT manquants sur les images</span>
                </li>
                <li className="p-2 bg-blue-50 rounded flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>Ajouter un sous-titre H2 pour la section conclusion</span>
                </li>
                <li className="p-2 bg-blue-50 rounded flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>Renforcer la présence du mot-clé principal en début de texte</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="readability" className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-lg font-medium mb-2">Analyse de lisibilité</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-md shadow-sm">
                <div className="text-sm text-gray-600">Score Flesch</div>
                <div className="text-xl font-bold">64.5</div>
                <div className="text-xs text-gray-500">Standard, facile à comprendre</div>
              </div>
              <div className="p-3 bg-white rounded-md shadow-sm">
                <div className="text-sm text-gray-600">Longueur moyenne des phrases</div>
                <div className="text-xl font-bold">18.2</div>
                <div className="text-xs text-gray-500">mots par phrase</div>
              </div>
              <div className="p-3 bg-white rounded-md shadow-sm">
                <div className="text-sm text-gray-600">Mots complexes</div>
                <div className="text-xl font-bold">12%</div>
                <div className="text-xs text-gray-500">du texte total</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Suggestions d'amélioration</h4>
            {readabilitySuggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md flex items-start gap-3 ${
                  suggestion.type === 'success' ? 'bg-green-50 border border-green-200' : 
                  suggestion.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 
                  'bg-red-50 border border-red-200'
                }`}
              >
                {suggestion.icon}
                <p className="text-sm">{suggestion.message}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="structure" className="space-y-4">
          <h4 className="font-medium mb-2">Structure du contenu</h4>
          <div className="space-y-3">
            {contentStructure.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className={`w-12 text-center py-1 text-xs font-bold rounded text-white ${
                    item.type === 'h1' ? 'bg-blue-600' : 
                    item.type === 'h2' ? 'bg-blue-500' : 
                    item.type === 'h3' ? 'bg-blue-400' : 'bg-gray-400'
                  }`}
                >
                  {item.type.toUpperCase()}
                </div>
                <div className="flex-1 text-sm">{item.content}</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getScoreColor(item.score)}`}></div>
                  <span className="text-xs">{item.score}/100</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="keywords" className="space-y-4">
          <h4 className="font-medium mb-4">Analyse des mots-clés</h4>
          <div className="space-y-4">
            {keywordAnalysis.map((keyword, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{keyword.keyword}</div>
                  <div className="text-sm text-gray-600">Densité: {keyword.density}%</div>
                </div>
                <div className="relative h-8 bg-gray-200 rounded overflow-hidden mb-2">
                  {keyword.positions.map((pos, i) => (
                    <div 
                      key={i} 
                      className="absolute top-0 bottom-0 w-1 bg-blue-500"
                      style={{ left: `${Math.min((pos / 4), 100)}%` }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getScoreColor(keyword.score)}`}></div>
                    <span>Score: {keyword.score}/100</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Optimiser</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceMetrics 
            performance={{
              responseTime: 780,
              loadTime: 2.4,
              firstContentfulPaint: 1.2,
              domLoadTime: 1.8,
              scriptCount: 8,
              styleCount: 4,
              totalSize: 1205430,
              mediaCount: 6,
              impressions: 3450,
              clickThroughRate: 0.042
            }}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ContentOptimizationTabs;
