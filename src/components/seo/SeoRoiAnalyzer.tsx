
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, TrendingUp } from "lucide-react";
import { RoiParameters } from '../../types/seo/RoiParameters';

const SeoRoiAnalyzer = () => {
  const [parameters, setParameters] = useState<RoiParameters>({
    seoInvestment: 5000,
    acquisitionCost: 50,
    conversionRate: 2.5,
    averageOrderValue: 100,
    organicTraffic: 10000,
    timeFrame: 12,
    targetKeywords: [],
    averagePosition: 5,
    clickThroughRate: 3.5,
    contentCost: 1000,
    linkBuildingCost: 2000,
    technicalCost: 2000
  });

  const calculateRoi = () => {
    const monthlyRevenue = (parameters.organicTraffic * parameters.conversionRate / 100) * parameters.averageOrderValue;
    const totalRevenue = monthlyRevenue * parameters.timeFrame;
    const totalInvestment = parameters.seoInvestment + parameters.contentCost + parameters.linkBuildingCost + parameters.technicalCost;
    const roi = ((totalRevenue - totalInvestment) / totalInvestment) * 100;
    
    return {
      roi: Math.round(roi),
      monthlyRevenue: Math.round(monthlyRevenue),
      totalRevenue: Math.round(totalRevenue),
      totalInvestment
    };
  };

  const results = calculateRoi();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Calculateur ROI SEO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Investissement SEO (€)</label>
              <Input
                type="number"
                value={parameters.seoInvestment}
                onChange={(e) => setParameters({...parameters, seoInvestment: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Trafic organique mensuel</label>
              <Input
                type="number"
                value={parameters.organicTraffic}
                onChange={(e) => setParameters({...parameters, organicTraffic: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Taux de conversion (%)</label>
              <Input
                type="number"
                step="0.1"
                value={parameters.conversionRate}
                onChange={(e) => setParameters({...parameters, conversionRate: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Panier moyen (€)</label>
              <Input
                type="number"
                value={parameters.averageOrderValue}
                onChange={(e) => setParameters({...parameters, averageOrderValue: Number(e.target.value)})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Résultats ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {results.roi}%
              </div>
              <div className="text-sm text-gray-600">ROI</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {results.monthlyRevenue.toLocaleString()}€
              </div>
              <div className="text-sm text-gray-600">Revenus mensuels</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {results.totalRevenue.toLocaleString()}€
              </div>
              <div className="text-sm text-gray-600">Revenus totaux</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {results.totalInvestment.toLocaleString()}€
              </div>
              <div className="text-sm text-gray-600">Investissement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeoRoiAnalyzer;
