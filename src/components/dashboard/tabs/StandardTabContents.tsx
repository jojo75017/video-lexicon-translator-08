
// Correction de l'erreur SiteStructure avec la propriété 'path' manquante

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code, 
         Settings, Map, HardDrive,
         Link2, PieChart, BarChart2 } from 'lucide-react';

export const SeoTabContent = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Analyse SEO</h2>
    <Card>
      <CardHeader>
        <CardTitle>Optimisation pour les moteurs de recherche</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Contenu de l'analyse SEO - En cours de développement</p>
        <Button className="mt-4">Analyser</Button>
      </CardContent>
    </Card>
  </div>
);

export const StructureTabContent = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Structure du Site</h2>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Analyse de l'architecture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Structure de site détectée</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* Simulation d'une structure de site */}
            <ul className="space-y-2">
              <li className="font-medium">Accueil
                <ul className="ml-4 mt-1 space-y-1 text-sm text-gray-600">
                  <li>À propos
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-gray-500">
                      <li>Notre équipe</li>
                      <li>Notre histoire</li>
                    </ul>
                  </li>
                  <li>Services
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-gray-500">
                      <li>Service 1</li>
                      <li>Service 2</li>
                      <li>Service 3</li>
                    </ul>
                  </li>
                  <li>Blog</li>
                  <li>Contact</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Recommandations</h3>
          <ul className="list-disc ml-5 space-y-1 text-gray-600">
            <li>Structure claire avec une hiérarchie logique</li>
            <li>Assurez-vous que toutes les pages importantes sont accessibles en 3 clics maximum</li>
            <li>Utilisez des URL descriptives et optimisées pour le SEO</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const BacklinksTabContent = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Analyse des Backlinks</h2>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Liens entrants
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Contenu de l'analyse des backlinks - En cours de développement</p>
        <Button className="mt-4">Voir les détails</Button>
      </CardContent>
    </Card>
  </div>
);

export const MetricsTabContent = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Métriques SEO</h2>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Indicateurs clés de performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Contenu des métriques - En cours de développement</p>
        <Button className="mt-4">Actualiser les données</Button>
      </CardContent>
    </Card>
  </div>
);

export const AdvancedTabContent = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Options Avancées</h2>
    <Card>
      <CardHeader>
        <CardTitle>Paramètres avancés</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Contenu des options avancées - En cours de développement</p>
        <Button className="mt-4">Configurer</Button>
      </CardContent>
    </Card>
  </div>
);

export const IntegrationsTabContent = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Intégrations</h2>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Connexions API
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Contenu des intégrations - En cours de développement</p>
        <Button className="mt-4">Gérer les intégrations</Button>
      </CardContent>
    </Card>
  </div>
);

export const AnalyticsTabContent = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Analytiques</h2>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Données statistiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Contenu des analytiques - En cours de développement</p>
        <Button className="mt-4">Voir le tableau de bord</Button>
      </CardContent>
    </Card>
  </div>
);

// Simulation structure site pour l'exemple
const sampleSiteStructure = {
  name: "Site web",
  path: "/", // Ajout de la propriété path manquante
  children: [
    {
      name: "Accueil",
      path: "/",
      children: [
        {
          name: "À propos",
          path: "/about",
          children: [
            {
              name: "Notre équipe",
              path: "/about/team",
              children: []
            },
            {
              name: "Histoire",
              path: "/about/history",
              children: []
            }
          ]
        },
        {
          name: "Services",
          path: "/services",
          children: [
            {
              name: "Service 1",
              path: "/services/service1",
              children: []
            },
            {
              name: "Service 2",
              path: "/services/service2",
              children: []
            }
          ]
        }
      ]
    }
  ]
};

// Export du composant qui utilise la structure
export const SiteStructureExample = () => {
  return (
    <div>
      <h3>Structure du site</h3>
      <pre>{JSON.stringify(sampleSiteStructure, null, 2)}</pre>
    </div>
  );
};
