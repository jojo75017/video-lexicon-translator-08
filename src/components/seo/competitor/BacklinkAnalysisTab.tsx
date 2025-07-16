
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Link, ExternalLink, Shield, Award, TrendingUp, 
  Users, Globe, Star, AlertTriangle, CheckCircle
} from "lucide-react";
import { CompetitorComparison } from "@/types/seo/CompetitorData";

interface BacklinkAnalysisTabProps {
  analysisResult: CompetitorComparison;
}

const BacklinkAnalysisTab: React.FC<BacklinkAnalysisTabProps> = ({ analysisResult }) => {
  const sites = [
    { data: analysisResult.yourSite, label: 'Votre site', color: 'green' },
    { data: analysisResult.competitor1, label: 'Concurrent leader', color: 'red' },
    { data: analysisResult.competitor2, label: 'Concurrent 2', color: 'blue' }
  ];

  const backlinkSources = [
    { type: 'Blogs sectoriels', percentage: 35, quality: 'high' },
    { type: 'Annuaires spécialisés', percentage: 20, quality: 'medium' },
    { type: 'Sites partenaires', percentage: 15, quality: 'high' },
    { type: 'Médias et presse', percentage: 12, quality: 'high' },
    { type: 'Forums et communautés', percentage: 10, quality: 'medium' },
    { type: 'Réseaux sociaux', percentage: 8, quality: 'low' }
  ];

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Comparaison des profils de backlinks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-blue-600" />
            Comparaison des Profils de Backlinks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sites.map((site, index) => (
              <div key={index} className={`p-4 border-2 border-${site.color}-200 rounded-lg bg-${site.color}-50/30`}>
                <h4 className={`font-semibold text-${site.color}-700 mb-4`}>{site.label}</h4>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {site.data.backlinksCount?.toLocaleString() || '1,250'}
                    </div>
                    <div className="text-sm text-gray-600">Total backlinks</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center p-2 bg-white rounded">
                      <div className="font-bold text-green-600">
                        {Math.floor((site.data.backlinksCount || 1250) * 0.65)}
                      </div>
                      <div className="text-gray-500">Follow</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="font-bold text-blue-600">
                        {Math.floor((site.data.backlinksCount || 1250) * 0.35)}
                      </div>
                      <div className="text-gray-500">NoFollow</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Autorité moyenne</span>
                      <span className="font-bold">{site.data.domainAuthority || 65}/100</span>
                    </div>
                    <Progress value={site.data.domainAuthority || 65} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analyse détaillée par site */}
      {sites.map((site, siteIndex) => (
        <Card key={siteIndex} className={`border-${site.color}-200`}>
          <CardHeader className={`bg-${site.color}-50/50`}>
            <CardTitle className={`text-${site.color}-700`}>
              Analyse des Backlinks - {site.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Distribution par type de source */}
              <div className="space-y-4">
                <h6 className="font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  Sources des Backlinks
                </h6>
                <div className="space-y-2">
                  {backlinkSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{source.type}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={source.percentage} className="w-16 h-2" />
                        <Badge className={getQualityColor(source.quality)} variant="outline">
                          {source.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métriques de qualité */}
              <div className="space-y-4">
                <h6 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Qualité du Profil
                </h6>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Score toxicité</span>
                      <Badge className="bg-green-500 text-white">
                        {Math.floor(Math.random() * 10) + 5}%
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Diversité des domaines</span>
                      <Badge variant="outline">
                        {Math.floor(Math.random() * 200) + 150} domaines
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Croissance mensuelle</span>
                      <Badge className="bg-blue-500 text-white">
                        +{Math.floor(Math.random() * 15) + 5}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Top domaines référents */}
            <div className="mt-6">
              <h6 className="font-medium mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                Top 5 Domaines Référents
              </h6>
              <div className="space-y-2">
                {[
                  { domain: 'authoritysite.com', authority: 85, links: 45 },
                  { domain: 'industryblog.net', authority: 78, links: 32 },
                  { domain: 'expertreview.org', authority: 72, links: 28 },
                  { domain: 'newsportal.com', authority: 89, links: 22 },
                  { domain: 'resourcehub.info', authority: 65, links: 18 }
                ].map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{domain.domain}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        DA: {domain.authority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {domain.links} liens
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Opportunités de netlinking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Opportunités de Netlinking Identifiées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Domaines cibles */}
            <div className="space-y-4">
              <h6 className="font-medium text-blue-600 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Domaines Cibles Prioritaires
              </h6>
              <div className="space-y-2">
                {[
                  { domain: 'topindustrysite.com', reason: 'Concurrent présent, vous absent', priority: 'high' },
                  { domain: 'sectornews.net', reason: 'Forte autorité, thématique proche', priority: 'high' },
                  { domain: 'expertforum.org', reason: 'Communauté active, liens follow', priority: 'medium' },
                  { domain: 'resourcecenter.info', reason: 'Annuaire spécialisé qualité', priority: 'medium' },
                  { domain: 'influencerblog.com', reason: 'Guest posting possible', priority: 'low' }
                ].map((opportunity, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{opportunity.domain}</span>
                      <Badge 
                        className={
                          opportunity.priority === 'high' ? 'bg-red-500 text-white' :
                          opportunity.priority === 'medium' ? 'bg-yellow-500 text-white' :
                          'bg-gray-500 text-white'
                        }
                      >
                        {opportunity.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{opportunity.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stratégies recommandées */}
            <div className="space-y-4">
              <h6 className="font-medium text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Stratégies Recommandées
              </h6>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium text-green-800 text-sm">Guest Posting Ciblé</div>
                  <p className="text-xs text-green-600 mt-1">
                    Proposer du contenu expert aux blogs sectoriels identifiés
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-medium text-blue-800 text-sm">Relations Presse Digitales</div>
                  <p className="text-xs text-blue-600 mt-1">
                    Créer des communiqués et études pour obtenir des mentions
                  </p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                  <div className="font-medium text-purple-800 text-sm">Partenariats Stratégiques</div>
                  <p className="text-xs text-purple-600 mt-1">
                    Développer des collaborations avec acteurs complémentaires
                  </p>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                  <div className="font-medium text-orange-800 text-sm">Création de Ressources</div>
                  <p className="text-xs text-orange-600 mt-1">
                    Développer des outils/guides qui génèrent naturellement des liens
                  </p>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BacklinkAnalysisTab;
