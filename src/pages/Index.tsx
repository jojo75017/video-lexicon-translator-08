import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from 'axios';
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import ResourcesAnalyzer from '@/components/ResourcesAnalyzer';
import { Loader2 } from "lucide-react";
import { analyzeResources, Resource } from '@/utils/resourceAnalyzer';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SeoAnalysis {
  title: string;
  description: string;
  h1Count: number;
  imgCount: number;
  imgWithoutAlt: number;
  metaTagsCount: number;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  brokenLinks: number;
}

const Index = () => {
  const [url, setUrl] = useState('');
  const [siteStructure, setSiteStructure] = useState<any>(null);
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysis | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCorsWarning, setShowCorsWarning] = useState(false);

  const analyzeSEO = async (doc: Document, baseUrl: string): Promise<SeoAnalysis> => {
    const title = doc.title;
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const h1Count = doc.getElementsByTagName('h1').length;
    const images = doc.getElementsByTagName('img');
    const imgCount = images.length;
    const imgWithoutAlt = Array.from(images).filter(img => !img.alt).length;
    const metaTagsCount = doc.getElementsByTagName('meta').length;
    const canonicalUrl = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null;
    const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || null;

    // Vérification des liens morts
    const links = Array.from(doc.getElementsByTagName('a'));
    let brokenLinks = 0;
    
    for (const link of links) {
      if (link.href) {
        try {
          const fullUrl = new URL(link.href, baseUrl).href;
          await axios.head(fullUrl);
        } catch {
          brokenLinks++;
        }
      }
    }

    return {
      title,
      description,
      h1Count,
      imgCount,
      imgWithoutAlt,
      metaTagsCount,
      canonicalUrl,
      robotsMeta,
      brokenLinks
    };
  };

  const analyzeSite = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error("Format d'URL invalide. Assurez-vous d'inclure http:// ou https://");
      return;
    }

    setIsLoading(true);
    setShowCorsWarning(false);
    setSiteStructure(null);
    setSeoAnalysis(null);
    setResources([]);
    
    try {
      console.log("Début de l'analyse pour l'URL:", url);
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';
      toast.info("Connexion au proxy CORS en cours...");
      
      console.log("Tentative de connexion au proxy CORS...");
      const response = await axios.get(`${corsProxy}${url}`, {
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest',
        },
        timeout: 10000,
      });
      
      console.log("Réponse du proxy reçue, statut:", response.status);
      console.log("Type de contenu reçu:", response.headers['content-type']);
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');
      console.log("Document HTML parsé avec succès");

      toast.info("Analyse du site en cours...");
      console.log("Début de l'analyse SEO...");

      // Analyse SEO
      const seoResults = await analyzeSEO(doc, url);
      console.log("Résultats de l'analyse SEO:", seoResults);
      setSeoAnalysis(seoResults);

      // Analyse des ressources
      console.log("Début de l'analyse des ressources...");
      const resourcesResults = await analyzeResources(doc, url);
      console.log("Ressources trouvées:", resourcesResults.length);
      setResources(resourcesResults);

      // Analyse des liens
      console.log("Début de l'analyse des liens...");
      const links = Array.from(doc.querySelectorAll('a')).map(link => ({
        url: link.href,
        text: link.textContent?.trim() || ''
      }));
      console.log("Nombre de liens trouvés:", links.length);

      // Création de la structure
      const structure = {
        name: "Site Web",
        children: [
          {
            name: "Page d'accueil",
            path: url,
            children: links.map(link => ({
              name: link.text || 'Lien sans titre',
              path: link.url,
              children: []
            }))
          }
        ]
      };

      setSiteStructure(structure);
      console.log("Structure du site générée avec succès");
      toast.success("Analyse terminée !");
    } catch (error) {
      console.error('Erreur complète:', error);
      
      if (error instanceof AxiosError) {
        console.log("Type d'erreur Axios détecté");
        console.log("Code d'erreur:", error.code);
        console.log("Message d'erreur:", error.message);
        console.log("Statut de la réponse:", error.response?.status);
        console.log("Headers de la réponse:", error.response?.headers);
        
        if (error.response?.status === 403) {
          setShowCorsWarning(true);
        } else if (error.code === 'ERR_NETWORK') {
          toast.error("Erreur de connexion au proxy CORS");
        } else if (error.code === 'ECONNABORTED') {
          toast.error("Le délai d'attente a été dépassé. Veuillez réessayer.");
        } else {
          toast.error(`Erreur réseau : ${error.message}`);
        }
      } else {
        console.error("Erreur non-Axios:", error);
        toast.error("Une erreur inattendue s'est produite lors de l'analyse du site.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Générateur d'Architecture Web</h1>
          <p className="text-lg text-gray-600">Analysez et visualisez la structure de n'importe quel site web</p>
        </div>

        {showCorsWarning && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription>
              Pour utiliser cet outil, vous devez d'abord activer le proxy CORS en visitant{' '}
              <a 
                href="https://cors-anywhere.herokuapp.com/corsdemo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium underline hover:text-blue-600"
              >
                https://cors-anywhere.herokuapp.com/corsdemo
              </a>
              {' '}et en cliquant sur le bouton d'activation.
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL du site</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="https://exemple.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                  onClick={analyzeSite}
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyse...
                    </>
                  ) : (
                    "Analyser"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {isLoading && (
          <Card className="p-6 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Analyse en cours, veuillez patienter...</p>
            </div>
          </Card>
        )}

        {seoAnalysis && !isLoading && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Analyse SEO</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Balises principales</h3>
                <ul className="space-y-2">
                  <li><span className="font-medium">Titre :</span> {seoAnalysis.title}</li>
                  <li><span className="font-medium">Description :</span> {seoAnalysis.description || 'Non définie'}</li>
                  <li><span className="font-medium">URL Canonique :</span> {seoAnalysis.canonicalUrl || 'Non définie'}</li>
                  <li><span className="font-medium">Meta Robots :</span> {seoAnalysis.robotsMeta || 'Non définie'}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Statistiques</h3>
                <ul className="space-y-2">
                  <li><span className="font-medium">Nombre de H1 :</span> {seoAnalysis.h1Count}</li>
                  <li><span className="font-medium">Nombre d'images :</span> {seoAnalysis.imgCount}</li>
                  <li><span className="font-medium">Images sans alt :</span> {seoAnalysis.imgWithoutAlt}</li>
                  <li><span className="font-medium">Nombre de meta tags :</span> {seoAnalysis.metaTagsCount}</li>
                  <li><span className="font-medium">Liens morts détectés :</span> {seoAnalysis.brokenLinks}</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {resources.length > 0 && !isLoading && (
          <ResourcesAnalyzer resources={resources} />
        )}

        {siteStructure && !isLoading && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Structure du Site</h2>
            <SiteStructureVisualizer structure={siteStructure} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;