
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TreePine, Globe, Search, FileText, Target, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";

interface PageStructureData {
  url: string;
  pageTitle: string;
  headings: {
    level: number;
    text: string;
    keywords: string[];
  }[];
  metaDescription: string;
  keywordDensity: {
    keyword: string;
    density: number;
    count: number;
  }[];
  suggestions: string[];
  seoScore: number;
}

const PageStructurePlanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [structureData, setStructureData] = useState<PageStructureData | null>(null);

  const analyzePageStructure = async () => {
    if (!url) {
      toast.error('Veuillez entrer une URL');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simuler l'analyse de structure de page
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData: PageStructureData = {
        url: url,
        pageTitle: "Guide complet pour optimiser votre SEO",
        headings: [
          { level: 1, text: "Guide SEO complet", keywords: ["seo", "guide"] },
          { level: 2, text: "Qu'est-ce que le SEO ?", keywords: ["seo", "définition"] },
          { level: 3, text: "Les bases du référencement", keywords: ["référencement", "bases"] },
          { level: 2, text: "Optimisation technique", keywords: ["optimisation", "technique"] },
          { level: 3, text: "Vitesse de chargement", keywords: ["vitesse", "performance"] },
          { level: 3, text: "Structure des URLs", keywords: ["url", "structure"] },
          { level: 2, text: "Contenu et mots-clés", keywords: ["contenu", "mots-clés"] }
        ],
        metaDescription: "Découvrez notre guide complet pour optimiser votre SEO et améliorer votre référencement naturel.",
        keywordDensity: [
          { keyword: "seo", density: 2.5, count: 12 },
          { keyword: "référencement", density: 1.8, count: 8 },
          { keyword: "optimisation", density: 1.2, count: 6 },
          { keyword: "guide", density: 0.8, count: 4 }
        ],
        suggestions: [
          "Ajouter plus de sous-titres H3 pour structurer le contenu",
          "Optimiser la densité du mot-clé principal (actuellement trop élevée)",
          "Inclure des mots-clés de longue traîne dans les titres",
          "Améliorer la méta description avec un appel à l'action",
          "Ajouter des liens internes vers d'autres pages pertinentes"
        ],
        seoScore: 78
      };
      
      setStructureData(mockData);
      toast.success('Analyse de structure terminée');
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error('Erreur lors de l\'analyse de la page');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getHeadingIcon = (level: number) => {
    const size = Math.max(6 - level, 1);
    return `H${level}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-teal-500" />
            Analyseur de structure de page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="https://example.com/page"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={analyzePageStructure}
              disabled={isAnalyzing || !url}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>Analyse en cours...</>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
          </div>

          {!structureData && !isAnalyzing && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Entrez l'URL d'une page pour analyser sa structure SEO et obtenir des recommandations d'optimisation.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyse de la structure de la page en cours...</p>
          </CardContent>
        </Card>
      )}

      {structureData && (
        <div className="space-y-6">
          {/* Score SEO */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Score SEO de la page
                </span>
                <Badge className={`${getScoreColor(structureData.seoScore)} text-lg px-3 py-1`}>
                  {structureData.seoScore}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{structureData.url}</span>
                </div>
                <h3 className="font-medium">{structureData.pageTitle}</h3>
                <p className="text-sm text-gray-600 mt-1">{structureData.metaDescription}</p>
              </div>
            </CardContent>
          </Card>

          {/* Structure des titres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Structure des titres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {structureData.headings.map((heading, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Badge variant="outline" className="text-xs">
                      {getHeadingIcon(heading.level)}
                    </Badge>
                    <div className="flex-1">
                      <span className="font-medium">{heading.text}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {heading.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Densité des mots-clés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-500" />
                Densité des mots-clés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {structureData.keywordDensity.map((item, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.keyword}</span>
                      <Badge variant={item.density > 3 ? "destructive" : item.density > 1 ? "default" : "secondary"}>
                        {item.density}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.count} occurrences</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions d'amélioration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-orange-500" />
                Suggestions d'amélioration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {structureData.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <ArrowRight className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PageStructurePlanner;
