
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ExternalLink, Link, Globe, AlertCircle } from "lucide-react";
import { BrokenLink } from '@/types/seo/Backlinks';

interface BrokenLinksProps {
  brokenLinks: BrokenLink[];
  region?: string;
}

const BrokenLinks: React.FC<BrokenLinksProps> = ({ brokenLinks, region = "Europe" }) => {
  const getStatusColor = (statusCode?: number) => {
    if (!statusCode) return 'bg-gray-100 text-gray-800';
    if (statusCode >= 400 && statusCode < 500) return 'bg-red-100 text-red-800';
    if (statusCode >= 500) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (!brokenLinks || brokenLinks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Link className="h-5 w-5" />
            Liens cassés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-green-600 mb-2">
              <Link className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-green-700 font-medium">Aucun lien cassé détecté</p>
            <p className="text-green-600 text-sm">Tous vos liens semblent fonctionner correctement</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filtrer les liens par type pour avoir des recommandations plus pertinentes
  const internalBrokenLinks = brokenLinks.filter(link => link.url && link.url.startsWith('/'));
  const externalBrokenLinks = brokenLinks.filter(link => link.url && !link.url.startsWith('/'));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Liens cassés ({brokenLinks.length})
          {region && (
            <Badge variant="outline" className="ml-2 text-xs">
              <Globe className="h-3 w-3 mr-1" />
              {region}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {brokenLinks.map((link, index) => (
            <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-700 break-all">{link.url}</span>
                    <Badge className={getStatusColor(link.statusCode)}>
                      {link.statusCode || link.status || "Erreur"}
                    </Badge>
                  </div>
                  
                  {(link.text || link.anchor) && (
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Texte du lien:</strong> {link.text || link.anchor}
                    </div>
                  )}
                  
                  {link.location && (
                    <div className="text-sm text-gray-600">
                      <strong>Emplacement:</strong> {link.location}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Recommandation: {link.url.startsWith('/') 
                      ? "Vérifiez cette URL interne qui semble ne pas fonctionner" 
                      : "Ce lien externe est cassé, vérifiez l'URL ou supprimez le lien"}
                  </div>
                </div>
                <AlertTriangle className="h-5 w-5 text-red-500 ml-4" />
              </div>
            </div>
          ))}
          
          {brokenLinks.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Recommandations pour corriger les liens cassés:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {internalBrokenLinks.length > 0 && (
                  <>
                    <li>• Vérifiez les chemins internes de votre site</li>
                    <li>• Assurez-vous que toutes les pages référencées existent</li>
                  </>
                )}
                {externalBrokenLinks.length > 0 && (
                  <>
                    <li>• Vérifiez si les URLs externes existent toujours</li>
                    <li>• Remplacez les liens vers des ressources qui n'existent plus</li>
                  </>
                )}
                <li>• Utilisez des redirections 301 pour maintenir la valeur SEO</li>
                <li>• Vérifiez régulièrement vos liens avec des outils de monitoring</li>
                <li>• Pour les sites européens, vérifiez que les liens respectent le RGPD</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrokenLinks;
