
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link, TrendingUp, TrendingDown, Globe, Flag } from "lucide-react";
import { BacklinkInfo } from '@/types/seo/Backlinks';
import { eu } from 'react-world-flags/types';

interface BacklinksAnalysisProps {
  backlinks: BacklinkInfo[];
  doFollowBacklinks: number;
  noFollowBacklinks: number;
  topBacklinkDomains: string[];
  region?: string;
  country?: string;
}

const BacklinksAnalysis: React.FC<BacklinksAnalysisProps> = ({
  backlinks,
  doFollowBacklinks,
  noFollowBacklinks,
  topBacklinkDomains,
  region = "Europe",
  country = "France"
}) => {
  const [showAllBacklinks, setShowAllBacklinks] = useState(false);
  
  // Filtrer les backlinks pour mettre en évidence les domaines européens
  // Les Top Level Domains européens courants
  const europeanTLDs = ['.fr', '.de', '.es', '.it', '.eu', '.nl', '.be', '.ch', '.at', '.pl', '.se', '.dk', '.no', '.fi', '.pt', '.cz', '.gr', '.hu'];
  
  // On enrichit les backlinks avec des informations régionales
  const enrichedBacklinks = backlinks.map(backlink => {
    const isEuropean = europeanTLDs.some(tld => backlink.domain.endsWith(tld));
    return {
      ...backlink,
      isEuropean
    };
  });
  
  // Calculer le pourcentage de backlinks européens
  const europeanBacklinks = enrichedBacklinks.filter(link => link.isEuropean).length;
  const europeanPercentage = backlinks.length > 0 ? Math.round((europeanBacklinks / backlinks.length) * 100) : 0;
  
  const displayedBacklinks = showAllBacklinks ? enrichedBacklinks : enrichedBacklinks.slice(0, 10);
  const totalBacklinks = backlinks.length;
  const doFollowPercentage = totalBacklinks > 0 ? Math.round((doFollowBacklinks / totalBacklinks) * 100) : 0;
  
  return (
    <div className="space-y-6">
      {/* Contexte Européen */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Analyse des backlinks - Contexte {region}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Flag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Région principale: {region}</div>
              <div className="text-sm text-gray-600">Pays principal: {country}</div>
              <div className="mt-1">
                <Badge className="bg-blue-100 text-blue-800">
                  {europeanPercentage}% backlinks européens
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="text-sm mt-2 text-gray-700">
            {europeanPercentage < 50 ? (
              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
                <strong>Recommandation:</strong> Augmentez votre nombre de backlinks européens pour améliorer votre positionnement local.
              </div>
            ) : (
              <div className="p-2 bg-green-50 border border-green-200 rounded text-green-800">
                <strong>Bon travail!</strong> Votre profil de backlinks est bien adapté au marché européen.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Backlinks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalBacklinks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">DoFollow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{doFollowBacklinks}</div>
            <div className="text-xs text-gray-500">{doFollowPercentage}% du total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">NoFollow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{noFollowBacklinks}</div>
            <div className="text-xs text-gray-500">{100 - doFollowPercentage}% du total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Domaines référents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{topBacklinkDomains.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Referring Domains */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Principaux domaines référents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {topBacklinkDomains.map((domain, index) => {
              const isEuropeanDomain = europeanTLDs.some(tld => domain.endsWith(tld));
              return (
                <div key={index} className={`flex items-center justify-between p-2 ${isEuropeanDomain ? 'bg-green-50' : 'bg-gray-50'} rounded-md`}>
                  <span className="font-medium">{domain}</span>
                  <div className="flex items-center gap-2">
                    {isEuropeanDomain && (
                      <Badge variant="outline" className="bg-green-100 text-green-700">EU</Badge>
                    )}
                    <Badge variant="outline">{index + 1}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Backlinks List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Liste des backlinks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayedBacklinks.map((backlink, index) => {
              const isEuropean = europeanTLDs.some(tld => backlink.domain.endsWith(tld));
              return (
                <div key={index} className={`border ${isEuropean ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'} rounded-lg p-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="h-4 w-4 text-gray-500" />
                        <a 
                          href={backlink.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {backlink.domain}
                        </a>
                        <Badge 
                          variant={backlink.dofollow || backlink.isDofollow ? "default" : "secondary"}
                          className={backlink.dofollow || backlink.isDofollow ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {backlink.dofollow || backlink.isDofollow ? "DoFollow" : "NoFollow"}
                        </Badge>
                        {backlink.authority && (
                          <Badge variant="outline">
                            DA: {backlink.authority}
                          </Badge>
                        )}
                        {isEuropean && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-700">
                            Européen
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Texte d'ancrage:</strong> {backlink.anchor || backlink.anchorText || "Non spécifié"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        URL: {backlink.url}
                      </div>
                    </div>
                    <div className="ml-4">
                      {backlink.dofollow || backlink.isDofollow ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {!showAllBacklinks && backlinks.length > 10 && (
              <Button 
                variant="outline" 
                onClick={() => setShowAllBacklinks(true)}
                className="w-full"
              >
                Voir tous les {backlinks.length} backlinks
              </Button>
            )}
            
            {showAllBacklinks && (
              <Button 
                variant="outline" 
                onClick={() => setShowAllBacklinks(false)}
                className="w-full"
              >
                Afficher moins
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BacklinksAnalysis;
