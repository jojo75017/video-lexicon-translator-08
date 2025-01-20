import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';

const Index = () => {
  const [url, setUrl] = useState('');
  const [siteStructure, setSiteStructure] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeSite = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    setIsLoading(true);
    try {
      // Simulation d'analyse pour démonstration
      const mockStructure = {
        name: "Site Web",
        children: [
          {
            name: "Accueil",
            path: "/",
            children: []
          },
          {
            name: "À propos",
            path: "/about",
            children: [
              {
                name: "Notre équipe",
                path: "/about/team",
                children: []
              }
            ]
          },
          {
            name: "Services",
            path: "/services",
            children: [
              {
                name: "Consultation",
                path: "/services/consulting",
                children: []
              },
              {
                name: "Formation",
                path: "/services/training",
                children: []
              }
            ]
          },
          {
            name: "Contact",
            path: "/contact",
            children: []
          }
        ]
      };

      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSiteStructure(mockStructure);
      toast.success("Analyse terminée !");
    } catch (error) {
      toast.error("Erreur lors de l'analyse du site");
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
                >
                  {isLoading ? "Analyse en cours..." : "Analyser"}
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