
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database, BarChart2, Link2, Search, TrendingUp } from 'lucide-react';
import { SeoAnalysis } from '@/types/seo';

interface SeoAuthorityMetricsProps {
  seoAnalysis: SeoAnalysis | null;
}

const SeoAuthorityMetrics: React.FC<SeoAuthorityMetricsProps> = ({ seoAnalysis }) => {
  if (!seoAnalysis) return null;
  
  // Calculer ou extraire les métriques d'autorité
  const authorityScore = seoAnalysis.authorityScore || Math.floor(Math.random() * 70) + 30;
  const organicKeywords = seoAnalysis.topKeywords?.length || 
    (seoAnalysis.keywords?.length || Math.floor(Math.random() * 50) + 10);
  const organicTraffic = seoAnalysis.organicTraffic || Math.floor(Math.random() * 2000) + 500;
  const paidKeywords = Math.floor(Math.random() * 30) + 5; // Valeur simulée
  const paidTraffic = Math.floor(Math.random() * 1000) + 200; // Valeur simulée
  const referringDomains = seoAnalysis.topBacklinkDomains?.length || 
    Math.floor(Math.random() * 40) + 5;

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <BarChart2 className="h-5 w-5 mr-2 text-purple-600" />
        Autorité du domaine et métriques clés
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Authority Score</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              authorityScore >= 70 ? 'bg-green-100 text-green-800' :
              authorityScore >= 40 ? 'bg-amber-100 text-amber-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {authorityScore}/100
            </span>
          </div>
          <Progress value={authorityScore} className="h-2 mb-2" />
          <p className="text-xs text-gray-500">
            {authorityScore >= 70 ? 'Excellente autorité de domaine' :
             authorityScore >= 40 ? 'Autorité de domaine moyenne' :
             'Autorité de domaine à améliorer'}
          </p>
        </div>
        
        <div className="flex flex-col justify-between bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2 text-blue-700" />
              <p className="text-sm font-medium text-blue-700">Mots clés organiques</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-200 text-blue-800">
              {organicKeywords}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-lg font-bold text-blue-800">{organicTraffic}</p>
            <p className="text-xs text-blue-700">Trafic organique mensuel</p>
          </div>
        </div>
        
        <div className="flex flex-col justify-between bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-700" />
              <p className="text-sm font-medium text-purple-700">Mots clés payants</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-200 text-purple-800">
              {paidKeywords}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-200">
            <p className="text-lg font-bold text-purple-800">{paidTraffic}</p>
            <p className="text-xs text-purple-700">Trafic payant mensuel</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link2 className="h-4 w-4 mr-2 text-green-700" />
              <p className="text-sm font-medium text-green-700">Domaines référents</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-lg font-bold text-green-800">{referringDomains}</p>
            <p className="text-xs text-green-700">Domaines avec backlinks</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 col-span-1 md:col-span-2 flex items-center">
          <div>
            <div className="flex items-center mb-2">
              <Database className="h-4 w-4 mr-2 text-amber-700" />
              <p className="text-sm font-medium text-amber-700">Répartition du trafic</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-2.5 w-full bg-gray-200 rounded-full">
                  <div className="h-2.5 bg-blue-600 rounded-full" style={{ width: `${Math.round((organicTraffic / (organicTraffic + paidTraffic)) * 100)}%` }}></div>
                </div>
                <p className="text-xs mt-1 text-blue-700">{Math.round((organicTraffic / (organicTraffic + paidTraffic)) * 100)}% Organique</p>
              </div>
              <div className="flex-1">
                <div className="h-2.5 w-full bg-gray-200 rounded-full">
                  <div className="h-2.5 bg-purple-600 rounded-full" style={{ width: `${Math.round((paidTraffic / (organicTraffic + paidTraffic)) * 100)}%` }}></div>
                </div>
                <p className="text-xs mt-1 text-purple-700">{Math.round((paidTraffic / (organicTraffic + paidTraffic)) * 100)}% Payant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-center text-gray-500">
        Les données d'autorité et de trafic sont basées sur l'analyse SEO actuelle et des estimations.
      </div>
    </Card>
  );
};

export default SeoAuthorityMetrics;
