
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Search, 
  Link2, 
  Network, 
  FileSymlink, 
  Layers,
  Share2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SeoAnalysisForm from "@/components/seo/analysis/SeoAnalysisForm";
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import InternalLinkAnalyzer from '@/components/seo/InternalLinkAnalyzer';
import { analyzeInternalLinks } from '@/utils/seo/internalLinkAnalyzer';
import { toast } from "sonner";

const InternalLinkingPage = () => {
  const {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    analyzeSite,
    error,
    handleActivateProxy,
    proxyEnabled
  } = useSiteAnalyzer();
  
  const [selectedTab, setSelectedTab] = useState("analyze");
  const [internalLinkAnalysis, setInternalLinkAnalysis] = useState<any>(null);
  const [sourcePage, setSourcePage] = useState("");
  const [targetPage, setTargetPage] = useState("");
  const [linkText, setLinkText] = useState("");

  // Run internal link analysis when SEO analysis completes
  React.useEffect(() => {
    if (seoAnalysis && seoAnalysis.url && !internalLinkAnalysis) {
      // If SEO analysis has been completed, try to get internal link data
      if (seoAnalysis.sourceCode) {
        try {
          console.log("Analyzing internal links...");
          const analysis = analyzeInternalLinks(seoAnalysis.sourceCode, seoAnalysis.url);
          setInternalLinkAnalysis(analysis);
          console.log("Internal link analysis completed:", analysis);
          
          toast.success("Analyse des liens internes terminée", {
            description: `${analysis.totalLinks} liens internes analysés`
          });
        } catch (error) {
          console.error("Error during internal link analysis:", error);
          toast.error("Erreur d'analyse des liens internes", {
            description: "Impossible d'analyser les liens internes du site"
          });
        }
      } else {
        console.warn("No source code available for internal link analysis");
      }
    }
  }, [seoAnalysis]);

  const handleAnalyzeInternalLinks = () => {
    if (!seoAnalysis) {
      analyzeSite();
    } else {
      // If we already have SEO analysis, just reuse it
      if (seoAnalysis.sourceCode) {
        try {
          const analysis = analyzeInternalLinks(seoAnalysis.sourceCode, seoAnalysis.url);
          setInternalLinkAnalysis(analysis);
          toast.success("Analyse des liens internes terminée");
        } catch (error) {
          console.error("Error during internal link analysis:", error);
          toast.error("Erreur d'analyse des liens internes");
        }
      } else {
        // Need to re-run analysis to get source code
        analyzeSite();
      }
    }
  };

  const handleCreateLink = () => {
    if (!sourcePage || !targetPage || !linkText) {
      toast.warning("Veuillez remplir tous les champs", {
        description: "La page source, la page cible et le texte du lien sont requis"
      });
      return;
    }
    
    try {
      // Validate URLs
      new URL(sourcePage);
      new URL(targetPage);
      
      toast.success("Lien interne créé", {
        description: `Lien de "${sourcePage}" vers "${targetPage}" avec le texte "${linkText}"`
      });
      
      // Reset form
      setLinkText("");
    } catch (error) {
      toast.error("URLs invalides", {
        description: "Veuillez entrer des URLs valides pour les pages source et cible"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/seo">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux outils SEO
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold flex items-center">
            <Link2 className="h-5 w-5 mr-2 text-blue-600" />
            Analyse des liens internes
          </h1>
          
          <div className="ml-auto flex items-center gap-2">
            {proxyEnabled ? (
              <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Proxy actif
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={handleActivateProxy} className="text-xs">
                Activer le proxy
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <div className="container mx-auto">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="analyze" className="flex-1 gap-2">
              <Search className="h-4 w-4" />
              <span>Analyse des liens</span>
            </TabsTrigger>
            <TabsTrigger value="visualize" className="flex-1 gap-2">
              <Network className="h-4 w-4" />
              <span>Visualisation</span>
            </TabsTrigger>
            <TabsTrigger value="optimize" className="flex-1 gap-2">
              <FileSymlink className="h-4 w-4" />
              <span>Créer des liens</span>
            </TabsTrigger>
            <TabsTrigger value="silo" className="flex-1 gap-2">
              <Layers className="h-4 w-4" />
              <span>Structure en silo</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyze">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Link2 className="h-6 w-6 mr-2 text-blue-600" />
                Analyse des liens internes
              </h2>
              <p className="text-gray-600 mb-6">
                Analysez en profondeur la structure des liens internes de votre site web pour identifier les problèmes et les opportunités d'optimisation.
              </p>
              
              <SeoAnalysisForm
                url={url}
                setUrl={setUrl}
                isLoading={isLoading}
                showCorsWarning={showCorsWarning}
                analyzeSite={handleAnalyzeInternalLinks}
                error={error}
                handleActivateProxy={handleActivateProxy}
              />
              
              {internalLinkAnalysis && url && (
                <div className="mt-8">
                  <InternalLinkAnalyzer analysis={internalLinkAnalysis} url={url} />
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="visualize">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Network className="h-6 w-6 mr-2 text-purple-600" />
                Visualisation des liens internes
              </h2>
              <p className="text-gray-600 mb-6">
                Visualisez graphiquement la structure des liens internes de votre site pour mieux comprendre les relations entre vos pages.
              </p>
              
              {!internalLinkAnalysis && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Analyse requise</h3>
                  <p className="text-blue-700 mb-4">
                    Veuillez d'abord analyser votre site dans l'onglet "Analyse des liens" pour utiliser la visualisation.
                  </p>
                  <Button onClick={() => setSelectedTab("analyze")} variant="default">
                    <Search className="h-4 w-4 mr-2" />
                    Aller à l'analyse
                  </Button>
                </div>
              )}
              
              {internalLinkAnalysis && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  {internalLinkAnalysis.totalLinks > 0 ? (
                    <div className="aspect-video bg-gray-50 rounded-lg border flex items-center justify-center">
                      <div className="text-gray-500 text-center">
                        <Network className="h-12 w-12 mx-auto mb-4 text-blue-300" />
                        <p>Graphe de visualisation des liens internes</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {internalLinkAnalysis.uniquePages} pages et {internalLinkAnalysis.totalLinks} liens
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-10 text-gray-500">
                      <Share2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun lien interne trouvé pour ce site</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="optimize">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FileSymlink className="h-6 w-6 mr-2 text-green-600" />
                Créer des liens internes
              </h2>
              <p className="text-gray-600 mb-6">
                Générez des suggestions pour ajouter des liens internes entre vos pages et créer des connexions pertinentes.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-page">Page source</Label>
                    <Input 
                      id="source-page" 
                      placeholder="https://example.com/page1" 
                      value={sourcePage}
                      onChange={(e) => setSourcePage(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">La page qui contiendra le lien</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target-page">Page cible</Label>
                    <Input 
                      id="target-page" 
                      placeholder="https://example.com/page2" 
                      value={targetPage}
                      onChange={(e) => setTargetPage(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">La page vers laquelle pointer</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="link-text">Texte du lien</Label>
                    <Input 
                      id="link-text" 
                      placeholder="Texte d'ancrage" 
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Utilisez des mots-clés pertinents pour le texte d'ancrage
                    </p>
                  </div>
                  
                  <Button onClick={handleCreateLink} className="w-full">
                    <Link2 className="h-4 w-4 mr-2" />
                    Créer le lien
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-4">Bonnes pratiques</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <div className="min-w-[20px] h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">1</div>
                      <span>Utilisez un texte d'ancrage descriptif et pertinent</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="min-w-[20px] h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">2</div>
                      <span>Liez des pages thématiquement liées</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="min-w-[20px] h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">3</div>
                      <span>Pointez vers des pages importantes depuis votre contenu</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="min-w-[20px] h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">4</div>
                      <span>Évitez l'excès de liens sur une même page</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="min-w-[20px] h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">5</div>
                      <span>Assurez-vous que les pages orphelines reçoivent des liens</span>
                    </li>
                  </ul>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-xs text-gray-500">
                    <p>À éviter: "cliquez ici", "en savoir plus", "lire la suite"</p>
                    <p className="mt-1">Préférez: "stratégies SEO pour e-commerce", "guide d'optimisation mobile"</p>
                  </div>
                </div>
              </div>
              
              {internalLinkAnalysis && internalLinkAnalysis.recommendations && internalLinkAnalysis.recommendations.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Suggestions de liens à créer</h3>
                  <div className="space-y-3">
                    {internalLinkAnalysis.recommendations
                      .filter(rec => rec.type === 'add' && rec.source && rec.target)
                      .map((rec, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <FileSymlink className="h-5 w-5 text-green-600" />
                            <span className="font-medium">{rec.description}</span>
                            <Badge variant="outline" className="ml-auto">
                              Impact: {rec.impact}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                          <div className="flex items-center gap-2 mt-3 text-sm">
                            <span className="bg-blue-50 px-2 py-1 rounded truncate max-w-[200px]">
                              {formatUrl(rec.source)}
                            </span>
                            <ArrowLeft className="h-4 w-4" />
                            <span className="bg-green-50 px-2 py-1 rounded truncate max-w-[200px]">
                              {formatUrl(rec.target)}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" className="mt-3" onClick={() => {
                            setSourcePage(rec.source || '');
                            setTargetPage(rec.target || '');
                            setLinkText(extractKeywords(rec.target || ''));
                          }}>
                            Utiliser cette suggestion
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="silo">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Layers className="h-6 w-6 mr-2 text-amber-600" />
                Structure en silo
              </h2>
              <p className="text-gray-600 mb-6">
                Planifiez une architecture de site optimisée avec une structure en silo pour améliorer l'autorité thématique et le classement de vos pages.
              </p>
              
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-amber-800 mb-2">Qu'est-ce qu'une structure en silo ?</h3>
                <p className="text-amber-700">
                  Une structure en silo organise votre contenu en groupes thématiques distincts, avec une page pilier et des pages de support liées entre elles. Cette méthode améliore l'autorité thématique et aide les moteurs de recherche à comprendre la structure de votre site.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium mb-4">Créer un silo de contenu</h3>
                  
                  <div className="space-y-4 mb-5">
                    <div className="space-y-2">
                      <Label htmlFor="silo-name">Nom du silo</Label>
                      <Input id="silo-name" placeholder="ex: Marketing Digital" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pillar-page">Page pilier</Label>
                      <Input id="pillar-page" placeholder="https://example.com/marketing-digital" />
                      <p className="text-xs text-gray-500">La page principale qui couvre le sujet en profondeur</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supporting-pages">Pages de support</Label>
                      <Textarea id="supporting-pages" placeholder="https://example.com/seo&#10;https://example.com/social-media&#10;https://example.com/email-marketing" />
                      <p className="text-xs text-gray-500">Une page par ligne (sous-sujets qui soutiennent votre page pilier)</p>
                    </div>
                  </div>
                  
                  <Button>
                    <Layers className="h-4 w-4 mr-2" />
                    Créer le silo
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-4">Avantages de la structure en silo</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <div className="text-green-600">✓</div>
                        <span>Améliore l'autorité thématique</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="text-green-600">✓</div>
                        <span>Facilite l'indexation par les moteurs de recherche</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="text-green-600">✓</div>
                        <span>Réduit la cannibalisation de mots-clés</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="text-green-600">✓</div>
                        <span>Améliore l'expérience utilisateur</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="text-green-600">✓</div>
                        <span>Concentre le pouvoir des liens internes</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-4">Schéma de liaison recommandé</h3>
                    <ol className="space-y-3 text-sm">
                      <li className="flex gap-2">
                        <div className="min-w-[20px] h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium">1</div>
                        <span>Liez la page d'accueil vers toutes les pages pilier</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="min-w-[20px] h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium">2</div>
                        <span>Liez chaque page pilier vers ses pages de support</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="min-w-[20px] h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium">3</div>
                        <span>Liez les pages de support entre elles au sein du même silo</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="min-w-[20px] h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium">4</div>
                        <span>Liez chaque page de support vers sa page pilier</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="min-w-[20px] h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium">5</div>
                        <span>Limitez les liens entre différents silos</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Helper function to format URLs for display
const formatUrl = (fullUrl: string): string => {
  try {
    const url = new URL(fullUrl);
    return url.pathname;
  } catch {
    return fullUrl;
  }
};

// Helper function to extract potential anchor text from a URL
const extractKeywords = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    // Get the last part of the path and convert to readable text
    const lastSegment = pathname.split('/').filter(Boolean).pop() || '';
    return lastSegment
      .replace(/-/g, ' ')
      .replace(/\.(html|php|aspx?)$/, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch {
    return '';
  }
};

export default InternalLinkingPage;
