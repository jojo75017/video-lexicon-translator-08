
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, BookOpen, Image, Link, Hash, Users, 
  TrendingUp, Calendar, Target, Lightbulb
} from "lucide-react";
import { CompetitorComparison } from "@/types/seo/CompetitorData";

interface ContentAnalysisTabProps {
  analysisResult: CompetitorComparison;
}

const ContentAnalysisTab: React.FC<ContentAnalysisTabProps> = ({ analysisResult }) => {
  const sites = [
    { data: analysisResult.yourSite, label: 'Votre site', color: 'green' },
    { data: analysisResult.competitor1, label: 'Concurrent leader', color: 'red' },
    { data: analysisResult.competitor2, label: 'Concurrent 2', color: 'blue' }
  ];

  const contentMetrics = [
    {
      title: 'Volume de contenu',
      icon: FileText,
      metrics: [
        { label: 'Pages indexées', your: 245, comp1: 892, comp2: 456 },
        { label: 'Articles de blog', your: 48, comp1: 156, comp2: 78 },
        { label: 'Mots par page (moy.)', your: 850, comp1: 1250, comp2: 980 }
      ]
    },
    {
      title: 'Qualité du contenu',
      icon: BookOpen,
      metrics: [
        { label: 'Score lisibilité', your: 72, comp1: 85, comp2: 78 },
        { label: 'Densité mots-clés', your: 2.1, comp1: 1.8, comp2: 2.3 },
        { label: 'Liens internes/page', your: 8, comp1: 15, comp2: 11 }
      ]
    },
    {
      title: 'Contenu multimédia',
      icon: Image,
      metrics: [
        { label: 'Images optimisées', your: 65, comp1: 89, comp2: 72 },
        { label: 'Vidéos intégrées', your: 12, comp1: 45, comp2: 23 },
        { label: 'Infographies', your: 3, comp1: 18, comp2: 8 }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble du contenu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Analyse Comparative du Contenu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contentMetrics.map((category, index) => (
              <div key={index} className="space-y-4">
                <h5 className="font-medium flex items-center gap-2">
                  <category.icon className="h-4 w-4 text-purple-600" />
                  {category.title}
                </h5>
                <div className="space-y-3">
                  {category.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{metric.label}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-bold text-green-600">{metric.your}</div>
                          <div className="text-gray-500">Vous</div>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded">
                          <div className="font-bold text-red-600">{metric.comp1}</div>
                          <div className="text-gray-500">Leader</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-bold text-blue-600">{metric.comp2}</div>
                          <div className="text-gray-500">Concurrent</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analyse par site */}
      {sites.map((site, siteIndex) => (
        <Card key={siteIndex} className={`border-${site.color}-200`}>
          <CardHeader className={`bg-${site.color}-50/50`}>
            <CardTitle className={`text-${site.color}-700`}>
              Stratégie de Contenu - {site.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Types de contenu */}
              <div className="space-y-4">
                <h6 className="font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-600" />
                  Types de Contenu Principaux
                </h6>
                <div className="space-y-2">
                  {[
                    { type: 'Articles informatifs', percentage: 45 },
                    { type: 'Guides pratiques', percentage: 25 },
                    { type: 'Comparatifs produits', percentage: 15 },
                    { type: 'Études de cas', percentage: 10 },
                    { type: 'FAQ et ressources', percentage: 5 }
                  ].map((content, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{content.type}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={content.percentage} className="w-20 h-2" />
                        <Badge variant="outline" className="text-xs">{content.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fréquence de publication */}
              <div className="space-y-4">
                <h6 className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  Rythme de Publication
                </h6>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Articles par mois</span>
                      <Badge className="bg-blue-500 text-white">
                        {Math.floor(Math.random() * 8) + 4}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Mise à jour contenu</span>
                      <Badge variant="outline">
                        {Math.random() > 0.5 ? 'Régulière' : 'Occasionnelle'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Contenu saisonnier</span>
                      <Badge variant="outline">
                        {Math.random() > 0.6 ? 'Présent' : 'Absent'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Points forts du contenu */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h6 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Points Forts Identifiés
              </h6>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Contenu long-format bien structuré avec H2/H3 optimisés</li>
                <li>• Utilisation efficace des appels à l'action dans les articles</li>
                <li>• Intégration de mots-clés sémantiques naturelle</li>
                <li>• Mise à jour régulière des contenus les plus performants</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Opportunités de contenu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Opportunités de Contenu Identifiées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h6 className="font-medium text-orange-600">Gaps de Contenu à Combler</h6>
              <div className="space-y-2">
                {[
                  'Guides débutants pour votre thématique',
                  'Comparatifs détaillés avec concurrents',
                  'Études de cas clients avec ROI',
                  'Contenu vidéo tutoriel',
                  'FAQ secteur spécifique',
                  'Templates et ressources téléchargeables'
                ].map((gap, index) => (
                  <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded">
                    <span className="text-sm text-orange-800">{gap}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h6 className="font-medium text-blue-600">Recommandations Stratégiques</h6>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-medium text-blue-800 text-sm">Créer un hub de ressources</div>
                  <p className="text-xs text-blue-600 mt-1">
                    Centraliser guides, templates et outils pour devenir LA référence
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-medium text-blue-800 text-sm">Développer le contenu social proof</div>
                  <p className="text-xs text-blue-600 mt-1">
                    Témoignages, cas d'usage, retours clients pour renforcer la confiance
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-medium text-blue-800 text-sm">Optimiser pour la recherche vocale</div>
                  <p className="text-xs text-blue-600 mt-1">
                    Adapter le contenu aux requêtes conversationnelles
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

export default ContentAnalysisTab;
