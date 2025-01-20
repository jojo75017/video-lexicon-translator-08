import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import { Loader2 } from "lucide-react";

const Index = () => {
  const [url, setUrl] = useState('');
  const [siteStructure, setSiteStructure] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeSite = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    // Vérification basique du format de l'URL
    try {
      new URL(url);
    } catch {
      toast.error("Format d'URL invalide. Assurez-vous d'inclure http:// ou https://");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(url);
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');

      // Analyse des liens
      const links = Array.from(doc.querySelectorAll('a')).map(link => ({
        url: link.href,
        text: link.textContent?.trim() || ''
      }));

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
      toast.success("Analyse terminée !");
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error("Erreur lors de l'analyse du site. Vérifiez que le site est accessible et autorise les requêtes CORS.");
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

        {siteStructure && (
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