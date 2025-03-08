
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart2, PieChart, TrendingUp } from 'lucide-react';
import { SeoAnalysisResult } from '@/types/seo';

interface MetricsSectionProps {
  isLoading: boolean;
  seoAnalysis: SeoAnalysisResult | null;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ isLoading, seoAnalysis }) => {
  return (
    <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-fuchsia-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800">Métriques SEO détaillées</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Visualisez les données clés de performance pour optimiser votre référencement naturel
      </p>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
        </div>
      ) : (
        <div>
          {seoAnalysis ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard 
                icon={<BarChart2 className="h-5 w-5 text-indigo-600" />}
                title="Performance"
                value={seoAnalysis.performance?.score ? `${seoAnalysis.performance.score}%` : 'N/A'}
                description="Score de vitesse global"
              />
              <MetricCard 
                icon={<PieChart className="h-5 w-5 text-emerald-600" />}
                title="Structure"
                value={`${seoAnalysis.h1Count || 0} H1, ${seoAnalysis.h2Count || 0} H2`}
                description="Balises de titre"
              />
              <MetricCard 
                icon={<TrendingUp className="h-5 w-5 text-rose-600" />}
                title="Trafic"
                value={seoAnalysis.organicTraffic?.toString() || 'N/A'}
                description="Visiteurs organiques estimés"
              />
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500 font-medium">
                Analysez un site pour voir ses métriques détaillées
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Les données seront affichées ici après l'analyse
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-sm font-medium text-gray-700 ml-2">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default MetricsSection;
