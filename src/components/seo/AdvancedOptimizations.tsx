
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { analyzeContentWithAI } from '@/utils/seo/aiContentAnalyzer';
import { checkLinks } from '@/utils/seo/linkChecker';
import { optimizeImage, OptimizedImage } from '@/utils/seo/imageOptimizer';
import { toast } from "sonner";

interface Props {
  content: string;
  links: string[];
}

const AdvancedOptimizations = ({ content, links }: Props) => {
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [brokenLinks, setBrokenLinks] = useState<any[]>([]);
  const [optimizedImages, setOptimizedImages] = useState<OptimizedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    toast.info("Analyse en cours...");
    
    try {
      // Analyse du contenu avec l'IA
      const suggestions = await analyzeContentWithAI(content);
      setAiSuggestions(suggestions);

      // Vérification des liens
      const linkResults = await checkLinks(links);
      setBrokenLinks(linkResults.filter(link => !link.isWorking));

      toast.success("Analyse terminée !");
    } catch (error) {
      toast.error("Erreur lors de l'analyse");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageOptimization = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    toast.info("Optimisation des images en cours...");
    const optimizedResults: OptimizedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const result = await optimizeImage(files[i]);
      optimizedResults.push(result);
    }

    setOptimizedImages(optimizedResults);
    toast.success(`${optimizedResults.length} image(s) optimisée(s)`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Optimisations Avancées</h2>
        
        <div className="space-y-4">
          <Button 
            onClick={runAnalysis} 
            disabled={isAnalyzing}
          >
            Lancer l'analyse avancée
          </Button>

          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageOptimization}
              className="hidden"
              id="image-upload"
            />
            <Button 
              onClick={() => document.getElementById('image-upload')?.click()}
              variant="outline"
              className="gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              Optimiser des images
            </Button>
          </div>
        </div>

        {/* Suggestions IA */}
        {aiSuggestions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Suggestions d'amélioration IA</h3>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <Alert 
                  key={index}
                  variant={suggestion.type === 'erreur' ? "destructive" : "default"}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {suggestion.message}
                    {suggestion.priorité === 'haute' && (
                      <span className="text-red-500 ml-2">(Priorité haute)</span>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Liens cassés */}
        {brokenLinks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Liens cassés détectés</h3>
            <div className="space-y-2">
              {brokenLinks.map((link, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {link.url} - {link.errorMessage}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Images optimisées */}
        {optimizedImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Résultats de l'optimisation des images</h3>
            <div className="space-y-4">
              {optimizedImages.map((image, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Image {index + 1}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>Taille originale : {(image.originalSize / 1024).toFixed(2)} KB</p>
                    <p>Taille optimisée : {(image.optimizedSize / 1024).toFixed(2)} KB</p>
                    <p>Dimensions : {image.width}x{image.height}</p>
                    {image.suggestions.map((suggestion, i) => (
                      <p key={i} className="text-blue-500">{suggestion}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdvancedOptimizations;
