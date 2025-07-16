
import React, { useState } from 'react';
import { ArrowLeft, Search, Globe, AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ContentHierarchy from '@/components/ContentHierarchy';
import { toast } from "sonner";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { analyzeHeadings } from '@/utils/seo/headingAnalyzer';
import { Alert, AlertDescription } from "@/components/ui/alert";

const HierarchyPage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedUrl, setAnalyzedUrl] = useState('');
  const [pageData, setPageData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const analyzeSite = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    // Format URL if needed
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }

    try {
      // Validate URL format
      new URL(formattedUrl);
      
      setIsLoading(true);
      setError(null);
      setPageData(null);
      
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
          setPageData(headingStructure);
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
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
      toast.error("Erreur d'analyse", {
        description: err instanceof Error ? err.message : "Une erreur s'est produite"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold">Hiérarchie de contenu</h1>
        </div>
      </header>
      
      <div className="container mx-auto space-y-6">
        <Card className="p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Analyse de hiérarchie
          </h2>
          <p className="text-gray-600 mb-6">
            Analysez la structure et la hiérarchie de contenu d'un site web pour améliorer son SEO.
            Cette analyse vous permettra d'optimiser la disposition de vos titres et sous-titres.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
            <h3 className="text-lg font-medium mb-4">Analysez un site web</h3>
            <div className="flex gap-3">
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
                onClick={analyzeSite}
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
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error}. Essayez à nouveau ou utilisez une autre URL.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Structure des titres</h3>
              <p className="text-gray-600 text-sm mb-4">
                Une hiérarchie de titres bien structurée améliore l'expérience utilisateur et le référencement.
              </p>
              
              <div className="space-y-2">
                <div className="bg-blue-50 p-3 rounded border border-blue-100">
                  <h4 className="font-medium text-sm mb-1">Bonnes pratiques</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Une seule balise H1 par page</li>
                    <li>Structure logique (H1 → H2 → H3...)</li>
                    <li>Mots-clés dans les titres principaux</li>
                    <li>Titres descriptifs et concis</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Densité de contenu</h3>
              <p className="text-gray-600 text-sm mb-4">
                L'équilibre entre le texte et les autres éléments est crucial pour un bon SEO.
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Texte / HTML</span>
                  <span className="text-sm font-medium">24%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '24%' }}></div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Mots / Page</span>
                  <span className="text-sm font-medium">~850</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <div>
          {pageData ? (
            <ContentHierarchy
              headings={pageData.headings}
              paragraphs={pageData.paragraphs}
              hierarchy={pageData.hierarchy}
              url={analyzedUrl}
              recommendations={[
                "Assurez-vous d'avoir exactement une balise H1",
                "Utilisez des titres H2 et H3 pour structurer votre contenu",
                "Incluez vos mots-clés dans vos titres principaux",
                "Maintenez une structure hiérarchique logique",
                "Évitez les titres trop longs (moins de 70 caractères)"
              ]}
            />
          ) : (
            <Card className="p-6 bg-white/50 backdrop-blur-sm text-center">
              <div className="py-12">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">Analyse en cours...</h3>
                    <p className="text-gray-500 max-w-md mt-2">
                      Nous récupérons et analysons les données du site. Veuillez patienter...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">Aucun site analysé</h3>
                    <p className="text-gray-500 max-w-md mt-2">
                      Entrez l'URL d'un site web et cliquez sur "Analyser le site" pour voir sa structure hiérarchique.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HierarchyPage;
