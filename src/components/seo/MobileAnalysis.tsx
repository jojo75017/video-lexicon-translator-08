
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Smartphone, Check, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface MobileAnalysisProps {
  viewportMeta: boolean;
  responsiveImages: boolean;
  touchTargetSize: boolean;
  fontScale: boolean;
  score: number;
}

const MobileAnalysis = ({ viewportMeta, responsiveImages, touchTargetSize, fontScale, score }: MobileAnalysisProps) => {
  const items = [
    {
      label: "Meta viewport",
      value: viewportMeta,
      description: "Configuration de la vue mobile"
    },
    {
      label: "Images responsives",
      value: responsiveImages,
      description: "Optimisation pour différentes tailles d'écran"
    },
    {
      label: "Zones tactiles",
      value: touchTargetSize,
      description: "Taille minimum de 44px pour les éléments cliquables"
    },
    {
      label: "Mise à l'échelle des polices",
      value: fontScale,
      description: "Texte lisible sur mobile"
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Smartphone className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Performance Mobile</h3>
        <Badge variant={score >= 90 ? "default" : score >= 70 ? "secondary" : "destructive"}>
          {score}/100
        </Badge>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Score mobile</span>
            <span>{score}/100</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        <div className="grid gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              {item.value ? (
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MobileAnalysis;
