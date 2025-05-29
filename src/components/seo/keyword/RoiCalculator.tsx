
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Calculator, Target } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import { calculateSeoRoi } from "@/utils/seo/roiCalculator";
import { RoiParameters, RoiResults } from "@/types/seo";

interface RoiCalculatorProps {
  keywords: KeywordSuggestion[];
}

const RoiCalculator: React.FC<RoiCalculatorProps> = ({ keywords }) => {
  const [parameters, setParameters] = useState<RoiParameters>({
    seoInvestment: 5000,
    acquisitionCost: 50,
    conversionRate: 0.025,
    averageOrderValue: 150,
    organicTraffic: 10000,
    timeFrame: 12
  });
  
  const [results, setResults] = useState<RoiResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateRoi = async () => {
    if (parameters.seoInvestment <= 0 || parameters.organicTraffic <= 0) {
      toast.error("Veuillez entrer des valeurs valides");
      return;
    }

    setIsCalculating(true);

    // Simulation de calcul
    setTimeout(() => {
      const roiResults = calculateSeoRoi(parameters);
      setResults(roiResults);
      setIsCalculating(false);
      toast.success("Calcul du ROI terminé !");
    }, 2000);
  };

  const updateParameter = (key: keyof RoiParameters, value: number) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getRoiColor = (roi: number) => {
    if (roi >= 300) return 'text-green-600 font-bold';
    if (roi >= 100) return 'text-green-500 font-medium';
    if (roi >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Calculateur de ROI SEO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="investment">Investissement SEO (€)</Label>
            <Input
              id="investment"
              type="number"
              value={parameters.seoInvestment}
              onChange={(e) => updateParameter('seoInvestment', Number(e.target.value))}
              placeholder="5000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="traffic">Trafic organique mensuel</Label>
            <Input
              id="traffic"
              type="number"
              value={parameters.organicTraffic}
              onChange={(e) => updateParameter('organicTraffic', Number(e.target.value))}
              placeholder="10000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="conversion">Taux de conversion (%)</Label>
            <Input
              id="conversion"
              type="number"
              step="0.1"
              value={parameters.conversionRate * 100}
              onChange={(e) => updateParameter('conversionRate', Number(e.target.value) / 100)}
              placeholder="2.5"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aov">Valeur moyenne commande (€)</Label>
            <Input
              id="aov"
              type="number"
              value={parameters.averageOrderValue}
              onChange={(e) => updateParameter('averageOrderValue', Number(e.target.value))}
              placeholder="150"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cac">Coût acquisition client (€)</Label>
            <Input
              id="cac"
              type="number"
              value={parameters.acquisitionCost}
              onChange={(e) => updateParameter('acquisitionCost', Number(e.target.value))}
              placeholder="50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeframe">Période d'analyse (mois)</Label>
            <Input
              id="timeframe"
              type="number"
              value={parameters.timeFrame}
              onChange={(e) => updateParameter('timeFrame', Number(e.target.value))}
              placeholder="12"
            />
          </div>
        </div>

        <Button 
          onClick={calculateRoi}
          disabled={isCalculating}
          className="w-full gap-2"
        >
          {isCalculating ? (
            <>Calcul en cours...</>
          ) : (
            <>
              <Calculator className="h-4 w-4" />
              Calculer le ROI
            </>
          )}
        </Button>

        {isCalculating && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Analyse des projections...</span>
            </div>
            <Progress value={66} className="w-full" />
          </div>
        )}

        {results && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="text-lg font-medium">Résultats de l'analyse ROI</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">ROI Global</span>
                </div>
                <div className={`text-2xl ${getRoiColor(results.roi)}`}>
                  {results.roi.toFixed(1)}%
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Revenus générés</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(results.totalRevenue)}
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Conversions</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(results.totalConversions)}
                </div>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Économies vs PPC</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(results.costSaved)}
                </div>
              </div>
            </div>
            
            {results.breakEvenMonth && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Point d'équilibre atteint au mois </span>
                <Badge variant="outline">
                  {results.breakEvenMonth}
                </Badge>
              </div>
            )}
            
            <div className="space-y-2">
              <h5 className="font-medium">Projection mensuelle (premiers 6 mois)</h5>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {results.monthlyResults.slice(0, 6).map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                    <span>Mois {month.month}</span>
                    <div className="flex gap-4 text-xs">
                      <span>Trafic: {month.traffic.toLocaleString()}</span>
                      <span>Revenus: {formatCurrency(month.revenue)}</span>
                      <span className={getRoiColor(month.monthlyRoi)}>
                        ROI: {month.monthlyRoi.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoiCalculator;
