
import React, { useState } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TreePine, Globe, Search, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { FirecrawlService } from '@/utils/FirecrawlService';
import { analyzeHeadings } from '@/utils/seo/headingAnalyzer';
import { Alert, AlertDescription } from "@/components/ui/alert";
import SiteStructureAnalyzer from '@/components/seo/keyword/SiteStructureAnalyzer';

const StructurePage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedUrl, setAnalyzedUrl] = useState('');
  const [structureData, setStructureData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeStructure = async () => {
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
      setStructureData(null);
      
      toast.info("Analyse en cours", {
        description: "Récupération de la structure du site..."
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
        
        // Analyse de la structure
        const headingStructure = analyzeHeadings(doc);
        const allLinks = Array.from(doc.querySelectorAll('a[href]'));
        const images = Array.from(doc.querySelectorAll('img'));
        
        const structureAnalysis = {
          url: formattedUrl,
          title: result.data.title || doc.querySelector('title')?.textContent || 'Sans titre',
          headings: headingStructure?.headings || [],
          links: {
            total: allLinks.length,
            internal: allLinks.filter(a => {
              const href = a.getAttribute('href');
              return href && (href.startsWith('/') || href.includes(window.location.hostname));
            }).length,
            external: allLinks.filter(a => {
              const href = a.getAttribute('href');
              return href && !href.startsWith('/') && !href.includes(window.location.hostname) && href.startsWith('http');
            }).length
          },
          images: {
            total: images.length,
            withAlt: images.filter(img => img.hasAttribute('alt') && img.getAttribute('alt')?.trim()).length,
            withoutAlt: images.filter(img => !img.hasAttribute('alt') || !img.getAttribute('alt')?.trim()).length
          },
          depth: Math.max(...allLinks.map(a => {
            const href = a.getAttribute('href') || '';
            return href.split('/').filter(Boolean).length;
          }), 1)
        };
        
        setStructureData(structureAnalysis);
        setAnalyzedUrl(formattedUrl);
        toast.success("Analyse terminée avec succès");
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
    <UnifiedDashboard>
      <div className="container mx-auto py-4">
        <Card className="p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <TreePine className="h-5 w-5 mr-2 text-green-600" />
            Analyse de Structure du Site
          </h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Analysez la structure et l'organisation d'un site web pour améliorer son référencement et son architecture.
            </p>
            
            <div className="flex flex-col md:flex-row gap-3 mb-4">
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
                onClick={analyzeStructure}
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
                    Analyser la structure
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}. Essayez à nouveau ou utilisez une autre URL.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {structureData ? (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Site analysé: {structureData.title}</h3>
                <p className="text-blue-700 text-sm">{structureData.url}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Titres (H1-H6)</h4>
                  <p className="text-2xl font-bold text-blue-600">{structureData.headings.length}</p>
                  <p className="text-gray-600 text-sm">
                    H1: {structureData.headings.filter((h: any) => h.level === 1).length}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Liens</h4>
                  <p className="text-2xl font-bold text-green-600">{structureData.links.total}</p>
                  <p className="text-gray-600 text-sm">
                    Internes: {structureData.links.internal} | Externes: {structureData.links.external}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Images</h4>
                  <p className="text-2xl font-bold text-purple-600">{structureData.images.total}</p>
                  <p className="text-gray-600 text-sm">
                    Avec ALT: {structureData.images.withAlt} | Sans ALT: {structureData.images.withoutAlt}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Profondeur max</h4>
                  <p className="text-2xl font-bold text-orange-600">{structureData.depth}</p>
                  <p className="text-gray-600 text-sm">niveaux de navigation</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">Structure des titres</h4>
                <div className="space-y-2">
                  {structureData.headings.slice(0, 10).map((heading: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium mr-3 ${
                        heading.level === 1 ? 'bg-blue-100 text-blue-800' :
                        heading.level === 2 ? 'bg-green-100 text-green-800' :
                        heading.level === 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        H{heading.level}
                      </span>
                      <span className="text-sm">{heading.text}</span>
                    </div>
                  ))}
                  {structureData.headings.length > 10 && (
                    <p className="text-gray-500 text-sm">... et {structureData.headings.length - 10} autres titres</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Analyse de Structure du Site Web</h3>
                <p className="text-blue-700 text-sm">
                  Entrez une URL ci-dessus pour analyser la structure, la hiérarchie et l'organisation d'un site web.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Hiérarchie des Pages</h4>
                  <p className="text-gray-600 text-sm">
                    Visualisez la hiérarchie de vos pages et optimisez la navigation.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Liens Internes</h4>
                  <p className="text-gray-600 text-sm">
                    Analysez la distribution des liens internes pour améliorer le PageRank.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Profondeur des Pages</h4>
                  <p className="text-gray-600 text-sm">
                    Vérifiez que toutes vos pages importantes sont accessibles en 3 clics maximum.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Architecture SEO</h4>
                  <p className="text-gray-600 text-sm">
                    Optimisez l'architecture de votre site pour les moteurs de recherche.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
        
        <SiteStructureAnalyzer />
      </div>
    </UnifiedDashboard>
  );
};

export default StructurePage;
