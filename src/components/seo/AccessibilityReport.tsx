
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Check, Eye, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AccessibilityReportProps {
  score: number;
  errors: string[];
  warnings: string[];
  aria: {
    present: boolean;
    missing: string[];
  };
  contrast: {
    pass: boolean;
    failures: string[];
  };
}

const AccessibilityReport = ({ score, errors, warnings, aria, contrast }: AccessibilityReportProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Eye className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Rapport d'accessibilité</h3>
        <Badge variant={score >= 90 ? "default" : score >= 70 ? "secondary" : "destructive"}>
          {score}/100
        </Badge>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Score global</span>
            <span>{score}/100</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        <div className="grid gap-4">
          {errors.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                <XCircle className="h-4 w-4" />
                <span className="font-medium">{errors.length} Erreurs critiques</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 ml-6 space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="text-red-600">{error}</div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {warnings.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">{warnings.length} Avertissements</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 ml-6 space-y-2">
                {warnings.map((warning, index) => (
                  <div key={index} className="text-yellow-600">{warning}</div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          <div className="flex items-center gap-4">
            <Badge variant={aria.present ? "default" : "destructive"} className="w-24">
              ARIA
            </Badge>
            {aria.present ? (
              <span className="text-green-600 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Correctement implémenté
              </span>
            ) : (
              <span className="text-red-600">Attributs ARIA manquants</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={contrast.pass ? "default" : "destructive"} className="w-24">
              Contraste
            </Badge>
            {contrast.pass ? (
              <span className="text-green-600 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Conforme aux normes WCAG
              </span>
            ) : (
              <span className="text-red-600">Problèmes de contraste détectés</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AccessibilityReport;
