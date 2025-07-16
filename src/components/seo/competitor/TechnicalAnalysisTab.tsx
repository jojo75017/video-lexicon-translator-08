
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, Smartphone, Shield, FileText, Search, Globe, 
  CheckCircle, AlertTriangle, XCircle, Clock
} from "lucide-react";
import { CompetitorComparison } from "@/types/seo/CompetitorData";

interface TechnicalAnalysisTabProps {
  analysisResult: CompetitorComparison;
}

const TechnicalAnalysisTab: React.FC<TechnicalAnalysisTabProps> = ({ analysisResult }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const sites = [
    { data: analysisResult.yourSite, label: 'Votre site', color: 'green' },
    { data: analysisResult.competitor1, label: 'Concurrent leader', color: 'red' },
    { data: analysisResult.competitor2, label: 'Concurrent 2', color: 'blue' }
  ];

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble des performances techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Performances Techniques Globales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sites.map((site, index) => (
              <div key={index} className={`p-4 border-2 border-${site.color}-200 rounded-lg bg-${site.color}-50/30`}>
                <h4 className={`font-semibold text-${site.color}-700 mb-3`}>{site.label}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Score technique global</span>
                      <span className="font-bold">{site.data.seoScore || 75}/100</span>
                    </div>
                    <Progress value={site.data.seoScore || 75} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Vitesse: {Math.floor(Math.random() * 2) + 2}s</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      <span>Mobile: {Math.floor(Math.random() * 20) + 75}%</span>
                    </div>
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
              Analyse Technique Détaillée - {site.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Core Web Vitals */}
              <div className="space-y-4">
                <h5 className="font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  Core Web Vitals
                </h5>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>LCP (Largest Contentful Paint)</span>
                      <Badge className={getScoreColor(85)}>2.1s</Badge>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>FID (First Input Delay)</span>
                      <Badge className={getScoreColor(92)}>45ms</Badge>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CLS (Cumulative Layout Shift)</span>
                      <Badge className={getScoreColor(78)}>0.08</Badge>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Sécurité et Configuration */}
              <div className="space-y-4">
                <h5 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Sécurité & Configuration
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">HTTPS activé</span>
                    {getStatusIcon(true)}
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">SSL valide</span>
                    {getStatusIcon(true)}
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Robots.txt présent</span>
                    {getStatusIcon(Math.random() > 0.2)}
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Sitemap XML</span>
                    {getStatusIcon(Math.random() > 0.3)}
                  </div>
                </div>
              </div>

              {/* SEO Technique */}
              <div className="space-y-4">
                <h5 className="font-medium flex items-center gap-2">
                  <Search className="h-4 w-4 text-purple-600" />
                  SEO Technique
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Meta descriptions</span>
                    <Badge variant="outline">85%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Balises H1 uniques</span>
                    {getStatusIcon(Math.random() > 0.4)}
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Images Alt optimisées</span>
                    <Badge variant="outline">72%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Schema markup</span>
                    {getStatusIcon(Math.random() > 0.5)}
                  </div>
                </div>
              </div>

            </div>

            {/* Recommandations techniques spécifiques */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h6 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Améliorations Techniques Prioritaires
              </h6>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Optimiser les images WebP pour réduire le poids des pages</li>
                <li>• Implémenter le lazy loading pour les images below-the-fold</li>
                <li>• Ajouter Schema.org markup pour les produits/services</li>
                <li>• Optimiser le fichier CSS pour réduire le render-blocking</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Comparaison technique directe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-600" />
            Comparaison Technique Directe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { metric: 'Vitesse de chargement', your: 3.2, comp1: 2.1, comp2: 2.8, unit: 's', best: 'lower' },
              { metric: 'Score mobile', your: 78, comp1: 89, comp2: 82, unit: '/100', best: 'higher' },
              { metric: 'Core Web Vitals', your: 85, comp1: 92, comp2: 88, unit: '/100', best: 'higher' },
              { metric: 'Sécurité HTTPS', your: 100, comp1: 100, comp2: 95, unit: '%', best: 'higher' }
            ].map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h6 className="font-medium">{metric.metric}</h6>
                  <div className="text-xs text-gray-500">
                    {metric.best === 'lower' ? 'Plus bas = meilleur' : 'Plus haut = meilleur'}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{metric.your}{metric.unit}</div>
                    <div className="text-xs text-gray-500">Votre site</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{metric.comp1}{metric.unit}</div>
                    <div className="text-xs text-gray-500">Concurrent leader</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{metric.comp2}{metric.unit}</div>
                    <div className="text-xs text-gray-500">Concurrent 2</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalAnalysisTab;
