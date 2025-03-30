
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import ContentHierarchy from '@/components/ContentHierarchy';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Globe } from 'lucide-react';
import { toast } from "sonner";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { analyzeHeadings } from '@/utils/seo/headingAnalyzer';

const HierarchyTabContent = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState('');

  const handleAnalyze = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    // Format URL if needed
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }

    setIsLoading(true);
    
    try {
      // Validate URL format
      new URL(formattedUrl);
      
      toast.info("Analyse en cours", {
        description: "Récupération des données de la page..."
      });
      
      // Activer le proxy pour éviter les problèmes CORS
      FirecrawlService.enableProxy();
      
      // Analyser le site
      const result = await FirecrawlService.crawlWebsite(formattedUrl, true);
      
      if (result.success && result.data) {
        console.log("Données récupérées:", result.data);
        
        // Traitement des données
        const parser = new DOMParser();
        let doc;
        
        if (typeof result.data.sourceCode === 'string') {
          doc = parser.parseFromString(result.data.sourceCode, 'text/html');
        } else if (result.data[0] && typeof result.data[0].sourceCode === 'string') {
          doc = parser.parseFromString(result.data[0].sourceCode, 'text/html');
        } else {
          throw new Error("Format de données invalide");
        }
        
        // Analyse des titres
        const headingStructure = analyzeHeadings(doc);
        
        if (headingStructure) {
          setAnalyzeResult(headingStructure);
          setAnalyzedUrl(formattedUrl);
          toast.success("Analyse terminée avec succès");
        } else {
          throw new Error("Impossible d'analyser la structure des titres");
        }
      } else {
        throw new Error(result.error || "Échec de l'analyse du site");
      }
    } catch (err) {
      console.error("Erreur d'analyse:", err);
      toast.error("Erreur d'analyse", {
        description: err instanceof Error ? err.message : "Une erreur s'est produite"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Analyse de hiérarchie</h2>
        
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemple.com"
              className="pl-10"
              disabled={isLoading}
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button
            onClick={handleAnalyze}
            className="min-w-[180px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyser le site
              </>
            )}
          </Button>
        </div>
      </Card>
      
      <ContentHierarchy 
        headings={analyzeResult?.headings || []} 
        paragraphs={analyzeResult?.paragraphs || []} 
        hierarchy={analyzeResult?.hierarchy || []}
        url={analyzedUrl}
        recommendations={analyzeResult ? [
          "Assurez-vous d'avoir exactement une balise H1",
          "Utilisez des titres H2 et H3 pour structurer votre contenu",
          "Incluez vos mots-clés dans vos titres principaux",
          "Maintenez une structure hiérarchique logique",
          "Évitez les titres trop longs (moins de 70 caractères)"
        ] : []}
      />
    </div>
  );
};

export default HierarchyTabContent;
