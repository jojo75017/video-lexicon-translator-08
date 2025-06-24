
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

const ContentOptimizationSuggestions = () => {
  const [content, setContent] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeContent = async () => {
    if (!content.trim() || !targetKeyword.trim()) {
      toast.error("Veuillez entrer du contenu et un mot-clé cible");
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const words = content.split(/\s+/).length;
      const keywordOccurrences = (content.toLowerCase().match(new RegExp(targetKeyword.toLowerCase(), 'g')) || []).length;
      const density = (keywordOccurrences / words) * 100;

      const mockAnalysis = {
        score: Math.min(85, Math.max(30, 50 + (keywordOccurrences * 10) - Math.abs(density - 2) * 10)),
        wordCount: words,
        keywordDensity: density,
        keywordCount: keywordOccurrences,
        readabilityScore: Math.floor(Math.random() * 40) + 60,
        suggestions: [
          {
            type: 'keyword',
            priority: density < 1 ? 'high' : density > 3 ? 'high' : 'medium',
            title: density < 1 ? 'Augmenter la densité de mots-clés' : density > 3 ? 'Réduire la densité de mots-clés' : 'Densité de mots-clés optimale',
            description: density < 1 ? 
              `Votre densité de mots-clés est de ${density.toFixed(2)}%. Augmentez-la à 1-3% pour une meilleure optimisation.` :
              density > 3 ?
              `Votre densité de mots-clés est de ${density.toFixed(2)}%. Réduisez-la à 1-3% pour éviter le sur-optimisation.` :
              `Votre densité de mots-clés de ${density.toFixed(2)}% est dans la plage optimale.`
          },
          {
            type: 'structure',
            priority: 'medium',
            title: 'Améliorer la structure du contenu',
            description: 'Ajoutez des sous-titres H2 et H3 pour structurer votre contenu et faciliter la lecture.'
          },
          {
            type: 'length',
            priority: words < 300 ? 'high' : words > 2000 ? 'medium' : 'low',
            title: words < 300 ? 'Contenu trop court' : words > 2000 ? 'Contenu très long' : 'Longueur appropriée',
            description: words < 300 ? 
              `Votre contenu fait ${words} mots. Visez au moins 300 mots pour un bon référencement.` :
              words > 2000 ?
              `Votre contenu fait ${words} mots. Considérez le diviser en plusieurs sections ou articles.` :
              `Votre contenu de ${words} mots a une longueur appropriée.`
          },
          {
            type: 'semantic',
            priority: 'medium',
            title: 'Ajouter des mots-clés sémantiques',
            description: 'Incluez des synonymes et des termes connexes pour enrichir le champ sémantique.'
          }
        ],
        semanticKeywords: [
          `${targetKeyword}s`,
          `meilleur ${targetKeyword}`,
          `guide ${targetKeyword}`,
          `${targetKeyword} prix`,
          `${targetKeyword} qualité`
        ]
      };

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      toast.success("Analyse du contenu terminée !");
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Lightbulb;
      case 'low': return CheckCircle;
      default: return FileText;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-600" />
          Optimisation de Contenu IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Input
            placeholder="Mot-clé cible"
            value={targetKeyword}
            onChange={(e) => setTargetKeyword(e.target.value)}
          />
          <Textarea
            placeholder="Coller votre contenu ici pour analyse..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />
        </div>
        
        <Button onClick={analyzeContent} disabled={isAnalyzing} className="w-full">
          {isAnalyzing ? 'Analyse en cours...' : 'Analyser le contenu'}
        </Button>

        {analysis && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <h4 className="font-medium text-gray-600">Score SEO</h4>
                <p className="text-2xl font-bold text-blue-600">{analysis.score}/100</p>
                <Progress value={analysis.score} className="mt-2" />
              </Card>
              <Card className="p-4 text-center">
                <h4 className="font-medium text-gray-600">Mots</h4>
                <p className="text-2xl font-bold text-green-600">{analysis.wordCount}</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="font-medium text-gray-600">Densité KW</h4>
                <p className="text-2xl font-bold text-orange-600">{analysis.keywordDensity.toFixed(1)}%</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="font-medium text-gray-600">Lisibilité</h4>
                <p className="text-2xl font-bold text-purple-600">{analysis.readabilityScore}/100</p>
              </Card>
            </div>

            <div>
              <h3 className="font-medium mb-3">Suggestions d'amélioration</h3>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion: any, index: number) => {
                  const IconComponent = getPriorityIcon(suggestion.priority);
                  return (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <IconComponent className="h-5 w-5 mt-0.5 text-gray-500" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{suggestion.title}</h4>
                            <Badge className={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{suggestion.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Mots-clés sémantiques suggérés</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.semanticKeywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentOptimizationSuggestions;
