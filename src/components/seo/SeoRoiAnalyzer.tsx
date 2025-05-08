
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, TrendingUp, BarChart2, Calculator } from "lucide-react";
import { calculateSeoRoi } from '@/utils/seo/roiCalculator';

const SeoRoiAnalyzer = () => {
  // États pour les entrées utilisateur
  const [seoInvestment, setSeoInvestment] = useState<number>(5000);
  const [acquisitionCost, setAcquisitionCost] = useState<number>(25);
  const [conversionRate, setConversionRate] = useState<number>(2.5);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(120);
  const [organicTraffic, setOrganicTraffic] = useState<number>(10000);
  const [timeFrame, setTimeFrame] = useState<number>(6);
  
  // États pour les résultats calculés
  const [roiResults, setRoiResults] = useState<any>(null);
  
  // Calculer le ROI
  const handleCalculateRoi = () => {
    const results = calculateSeoRoi({
      seoInvestment,
      acquisitionCost,
      conversionRate: conversionRate / 100, // Convertir en décimal
      averageOrderValue,
      organicTraffic,
      timeFrame
    });
    
    setRoiResults(results);
  };
  
  // Générer des données historiques pour le graphique (simule l'évolution sur plusieurs mois)
  const generateHistoricalData = () => {
    if (!roiResults) return [];
    
    return Array.from({ length: timeFrame }, (_, i) => {
      const month = i + 1;
      // Simuler une augmentation progressive du trafic et des conversions
      const growthFactor = 1 + (0.1 * i);
      const traffic = Math.floor(organicTraffic * growthFactor);
      const conversions = Math.floor(traffic * (conversionRate / 100));
      const revenue = conversions * averageOrderValue;
      const costSaved = conversions * acquisitionCost;
      const cumulativeInvestment = seoInvestment * (i < 2 ? 1 : 0.3 * (i+1));
      
      return {
        name: `Mois ${month}`,
        traffic,
        conversions,
        revenue,
        costSaved,
        cumulativeInvestment,
        roi: ((revenue + costSaved) / cumulativeInvestment * 100) - 100
      };
    });
  };
  
  // Données pour le graphique d'allocation des investissements
  const investmentAllocationData = [
    { name: 'Contenu & Copywriting', value: 30 },
    { name: 'Optimisation technique', value: 25 },
    { name: 'Link Building', value: 20 },
    { name: 'Outils SEO', value: 15 },
    { name: 'Audit & Analyse', value: 10 }
  ];
  
  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const historicalData = generateHistoricalData();

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-bold">Analyseur de ROI SEO</h2>
      </div>
      
      <p className="text-gray-600">
        Calculez le retour sur investissement de vos efforts SEO en estimant la valeur du trafic organique,
        des conversions et des économies réalisées par rapport à d'autres canaux d'acquisition.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Paramètres d'investissement SEO</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seo-investment">Investissement SEO (€)</Label>
                <Input
                  id="seo-investment"
                  type="number"
                  value={seoInvestment}
                  onChange={(e) => setSeoInvestment(Number(e.target.value))}
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-frame">Période (mois)</Label>
                <Input
                  id="time-frame"
                  type="number"
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(Number(e.target.value))}
                  placeholder="6"
                  min="1"
                  max="36"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organic-traffic">Trafic organique mensuel</Label>
              <Input
                id="organic-traffic"
                type="number"
                value={organicTraffic}
                onChange={(e) => setOrganicTraffic(Number(e.target.value))}
                placeholder="10000"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conversion-rate">Taux de conversion (%)</Label>
                <Input
                  id="conversion-rate"
                  type="number"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  placeholder="2.5"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="average-order">Valeur moyenne (€)</Label>
                <Input
                  id="average-order"
                  type="number"
                  value={averageOrderValue}
                  onChange={(e) => setAverageOrderValue(Number(e.target.value))}
                  placeholder="120"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="acquisition-cost">
                Coût d'acquisition alternatif (€/client)
                <span className="block text-xs text-gray-500">
                  Ex: coût par conversion en publicité payante
                </span>
              </Label>
              <Input
                id="acquisition-cost"
                type="number"
                value={acquisitionCost}
                onChange={(e) => setAcquisitionCost(Number(e.target.value))}
                placeholder="25"
              />
            </div>
            
            <Button 
              onClick={handleCalculateRoi} 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Calculer le ROI SEO
            </Button>
          </div>
        </div>
        
        <div>
          {roiResults ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-4">Résultats sur {timeFrame} mois</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-xs text-gray-500 mb-1">ROI SEO Total</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {roiResults.roi.toFixed(2)}%
                  </div>
                  <div className="text-xs text-emerald-700 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {roiResults.roi > 0 ? 'Rentable' : 'En cours de rentabilisation'}
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="text-xs text-gray-500 mb-1">Revenu généré</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR',
                      maximumFractionDigits: 0
                    }).format(roiResults.totalRevenue)}
                  </div>
                  <div className="text-xs text-indigo-700 mt-1 flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Sur {timeFrame} mois
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50">
                  <div className="text-xs text-gray-500 mb-1">Économies réalisées</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR',
                      maximumFractionDigits: 0
                    }).format(roiResults.costSaved)}
                  </div>
                  <div className="text-xs text-amber-700 mt-1">
                    vs. canaux payants
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="text-xs text-gray-500 mb-1">Point d'équilibre</div>
                  <div className="text-2xl font-bold text-purple-600">
                    Mois {roiResults.breakEvenMonth || '> ' + timeFrame}
                  </div>
                  <div className="text-xs text-purple-700 mt-1">
                    Retour sur investissement
                  </div>
                </Card>
              </div>

              <div className="mt-4">
                <Tabs defaultValue="evolution">
                  <TabsList className="w-full">
                    <TabsTrigger value="evolution" className="flex-1">Évolution</TabsTrigger>
                    <TabsTrigger value="allocation" className="flex-1">Allocation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="evolution" className="pt-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={historicalData}
                          margin={{ top: 5, right: 20, bottom: 25, left: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis />
                          <Tooltip formatter={(value) => new Intl.NumberFormat('fr-FR').format(Number(value))} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            name="Revenu" 
                            stroke="#10b981" 
                            strokeWidth={2} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="costSaved" 
                            name="Économies" 
                            stroke="#8884d8" 
                            strokeWidth={2} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="cumulativeInvestment" 
                            name="Investissement" 
                            stroke="#ff7e67" 
                            strokeWidth={2} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="allocation" className="pt-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={investmentAllocationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {investmentAllocationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <BarChart2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Calculez votre ROI SEO</h3>
              <p className="text-gray-500 max-w-md">
                Entrez vos paramètres d'investissement et de performance SEO, puis cliquez sur "Calculer" pour visualiser votre retour sur investissement.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SeoRoiAnalyzer;
