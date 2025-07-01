
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';

interface RoiParameters {
  seoInvestment: number;
  acquisitionCost: number;
  conversionRate: number;
  averageOrderValue: number;
  organicTraffic: number;
  timeFrame: number;
}

const RoiCalculator: React.FC = () => {
  const [params, setParams] = useState<RoiParameters>({
    seoInvestment: 5000,
    acquisitionCost: 50,
    conversionRate: 2.5,
    averageOrderValue: 100,
    organicTraffic: 10000,
    timeFrame: 12
  });

  const calculateRoi = () => {
    const monthlyVisitors = params.organicTraffic;
    const monthlyConversions = (monthlyVisitors * params.conversionRate) / 100;
    const monthlyRevenue = monthlyConversions * params.averageOrderValue;
    const totalRevenue = monthlyRevenue * params.timeFrame;
    const roi = ((totalRevenue - params.seoInvestment) / params.seoInvestment) * 100;
    
    return {
      monthlyRevenue,
      totalRevenue,
      roi,
      paybackPeriod: params.seoInvestment / monthlyRevenue
    };
  };

  const results = calculateRoi();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculateur ROI SEO
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Investissement SEO (€)</label>
              <Input
                type="number"
                value={params.seoInvestment}
                onChange={(e) => setParams({...params, seoInvestment: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Trafic organique mensuel</label>
              <Input
                type="number"
                value={params.organicTraffic}
                onChange={(e) => setParams({...params, organicTraffic: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Taux de conversion (%)</label>
              <Input
                type="number"
                step="0.1"
                value={params.conversionRate}
                onChange={(e) => setParams({...params, conversionRate: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Valeur moyenne commande (€)</label>
              <Input
                type="number"
                value={params.averageOrderValue}
                onChange={(e) => setParams({...params, averageOrderValue: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">Revenus mensuels</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {results.monthlyRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-medium">ROI sur {params.timeFrame} mois</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {results.roi.toFixed(1)}%
              </p>
            </Card>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Période de retour</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {results.paybackPeriod.toFixed(1)} mois
              </p>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoiCalculator;
