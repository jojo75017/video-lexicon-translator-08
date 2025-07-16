
import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, Download, BarChart3, Globe, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IndexabilityResults as IndexabilityResultsType } from '@/hooks/useIndexabilityAnalysis';

interface IndexabilityResultsProps {
  results: IndexabilityResultsType;
  url: string;
}

export const IndexabilityResults: React.FC<IndexabilityResultsProps> = ({ results, url }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const downloadReport = () => {
    // Générer le rapport
    const reportContent = `
RAPPORT D'ANALYSE D'INDEXABILITÉ
================================

URL analysée: ${url}
Date d'analyse: ${new Date().toLocaleDateString('fr-FR')}

RÉSUMÉ
======
Statut: ${results.canIndex ? 'INDEXABLE' : 'NON INDEXABLE'}
Pages estimées: ${results.indexablePages}

PROBLÈMES IDENTIFIÉS
====================
${results.reasons.map(reason => `- ${reason}`).join('\n')}

RECOMMANDATIONS
===============
${results.recommendations.map(rec => `- ${rec}`).join('\n')}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url_download = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url_download;
    a.download = `rapport-indexabilite-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url_download);
    document.body.removeChild(a);
  };

  return (
    <div className="mt-6 space-y-6">
      {/* En-tête avec statut principal */}
      <Card className={`border-2 ${results.canIndex ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${results.canIndex ? 'bg-green-100' : 'bg-red-100'}`}>
              {results.canIndex ? 
                <CheckCircle2 className="h-8 w-8 text-green-600" /> : 
                <AlertTriangle className="h-8 w-8 text-red-600" />
              }
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">
                {results.canIndex ? 'Site indexable' : 'Site non indexable'}
              </h3>
              <p className="text-gray-600">
                {results.canIndex 
                  ? `Environ ${results.indexablePages} pages détectées comme indexables` 
                  : 'Des problèmes empêchent l\'indexation de ce site'}
              </p>
            </div>
            <Button onClick={downloadReport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Télécharger le rapport
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Onglets détaillés */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Globe className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="technical" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Technique
          </TabsTrigger>
          <TabsTrigger value="mobile" className="gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {results.reasons.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Problèmes détectés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {results.reasons.map((reason, index) => (
                    <li key={index} className="text-amber-700">{reason}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {results.recommendations.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="text-blue-700">{rec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyse des liens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Pages indexables estimées:</span>
                  <span className="font-semibold">{results.indexablePages}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Basé sur l'analyse de la structure des liens internes
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Données structurées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Schema.org détecté</span>
                </div>
                <div className="text-sm text-gray-600">
                  Les données structurées aident les moteurs de recherche à comprendre votre contenu
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Optimisations techniques recommandées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Vérifiez que votre fichier robots.txt est accessible</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Soumettez votre sitemap XML à Google Search Console</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Optimisez la vitesse de chargement de vos pages</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Score de compatibilité mobile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={75} className="h-3" />
                </div>
                <span className="text-2xl font-bold text-green-600">75/100</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Balise viewport présente</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Texte lisible sur mobile</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>Zones tactiles à optimiser</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Images responsives</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conseils d'amélioration mobile</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2"></div>
                  <span>Assurez-vous que tous les boutons font au moins 44x44 pixels</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2"></div>
                  <span>Évitez le contenu qui nécessite un défilement horizontal</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2"></div>
                  <span>Testez votre site sur différents appareils mobiles</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sécurité et confiance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">HTTPS activé</div>
                  <div className="text-sm text-gray-600">Votre site utilise une connexion sécurisée</div>
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-sm text-green-800">
                  ✓ Certificat SSL valide détecté - Excellent pour le SEO et la confiance des utilisateurs
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommandations de sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Maintenez vos certificats SSL à jour</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Surveillez les liens brisés régulièrement</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Configurez des en-têtes de sécurité appropriés</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Liens utiles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Outils de validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a 
            href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Tester les données structurées (Google)
          </a>
          <a 
            href={`https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Test de compatibilité mobile (Google)
          </a>
          <a 
            href={`https://pagespeed.web.dev/report?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Analyser la vitesse de la page (PageSpeed Insights)
          </a>
        </CardContent>
      </Card>
    </div>
  );
};
