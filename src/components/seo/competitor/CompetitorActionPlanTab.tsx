
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Trophy, CheckCircle } from "lucide-react";
import { CompetitorComparison } from "@/types/seo/CompetitorData";

interface CompetitorActionPlanTabProps {
  analysisResult: CompetitorComparison;
}

const CompetitorActionPlanTab: React.FC<CompetitorActionPlanTabProps> = ({ analysisResult }) => {
  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Lightbulb className="h-5 w-5" />
            Votre stratégie de dépassement en 30 jours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <h4 className="font-medium text-green-700">Semaine 1-2: Fondations</h4>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Optimiser les 5 pages principales</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Créer du contenu sur les gaps identifiés</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Améliorer la vitesse de chargement</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <h4 className="font-medium text-orange-700">Semaine 3: Contenu</h4>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                  <span>Publier 5 articles ciblés</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                  <span>Optimiser le maillage interne</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                  <span>Créer des pages piliers</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <h4 className="font-medium text-blue-700">Semaine 4: Autorité</h4>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Obtenir 10 backlinks de qualité</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Améliorer les signaux sociaux</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Suivre et ajuster</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h5 className="font-medium mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Résultats attendus après 30 jours
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">+25%</div>
                <div className="text-gray-600">Trafic organique</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">+5-10</div>
                <div className="text-gray-600">Positions gagnées</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">+15</div>
                <div className="text-gray-600">Score SEO</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">Top 10</div>
                <div className="text-gray-600">Nouveaux mots-clés</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            Classement des priorités d'action
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisResult.comparison.opportunities.map((opportunity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={
                    index < 2 ? "bg-red-50 text-red-700" :
                    index < 5 ? "bg-orange-50 text-orange-700" :
                    "bg-green-50 text-green-700"
                  }>
                    {index < 2 ? "URGENT" : index < 5 ? "IMPORTANT" : "MOYEN TERME"}
                  </Badge>
                  <span className="text-sm">{opportunity}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Impact: {index < 2 ? "Élevé" : index < 5 ? "Moyen" : "Progressif"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitorActionPlanTab;
