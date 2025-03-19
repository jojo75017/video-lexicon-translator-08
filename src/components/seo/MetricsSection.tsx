
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart2, PieChart, TrendingUp, AlertTriangle, Zap, Search, Globe } from 'lucide-react';
import { SeoAnalysis } from '@/types/seo';
import { Progress } from '@/components/ui/progress';

interface MetricsSectionProps {
  isLoading: boolean;
  seoAnalysis?: SeoAnalysis | null;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ isLoading, seoAnalysis }) => {
  const hasData = seoAnalysis && Object.keys(seoAnalysis).length > 0;
  
  return (
    <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800">Métriques SEO détaillées</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Visualisez les données clés de performance pour optimiser votre référencement naturel
      </p>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div>
          {hasData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard 
                  icon={<BarChart2 className="h-5 w-5 text-indigo-600" />}
                  title="Performance"
                  value={seoAnalysis.performance?.score ? `${seoAnalysis.performance.score}%` : 'N/A'}
                  description="Score de vitesse global"
                  color="indigo"
                />
                <MetricCard 
                  icon={<PieChart className="h-5 w-5 text-emerald-600" />}
                  title="Structure"
                  value={`${seoAnalysis.h1Count || 0} H1, ${seoAnalysis.h2Count || 0} H2`}
                  description="Balises de titre"
                  color="emerald"
                />
                <MetricCard 
                  icon={<TrendingUp className="h-5 w-5 text-rose-600" />}
                  title="Trafic"
                  value={seoAnalysis.organicTraffic?.toString() || 'N/A'}
                  description="Visiteurs organiques estimés"
                  color="rose"
                />
              </div>
              
              {/* Métriques supplémentaires */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Search className="h-4 w-4 text-blue-600 mr-2" />
                      <h3 className="text-sm font-medium text-gray-700">Visibilité sur les mots-clés</h3>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      Top 3: {seoAnalysis.topKeywords?.filter(k => k.position <= 3).length || 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {seoAnalysis.topKeywords?.slice(0, 3).map((keyword, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium truncate mr-2">{keyword.keyword}</span>
                          <span className="text-gray-500">Position {keyword.position}</span>
                        </div>
                        <Progress
                          value={(10 - Math.min(keyword.position, 10)) * 10}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-amber-600 mr-2" />
                      <h3 className="text-sm font-medium text-gray-700">Performance du site</h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      (seoAnalysis.performance?.loadTime || 0) < 2000 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {((seoAnalysis.performance?.loadTime || 0) / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Temps de chargement</span>
                        <span className="text-gray-900 font-medium">
                          {((seoAnalysis.performance?.loadTime || 0) / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <Progress
                        value={Math.max(0, 100 - (seoAnalysis.performance?.loadTime || 0) / 50)}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Premier affichage</span>
                        <span className="text-gray-900 font-medium">
                          {((seoAnalysis.performance?.firstContentfulPaint || 0) / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <Progress
                        value={Math.max(0, 100 - (seoAnalysis.performance?.firstContentfulPaint || 0) / 30)}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center flex flex-col items-center">
              <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
              <p className="text-gray-700 font-medium">
                Aucun site web analysé
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Entrez l'URL d'un site web dans le formulaire ci-dessus pour commencer l'analyse
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
  color: "indigo" | "emerald" | "rose" | "blue" | "amber";
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, description, color }) => {
  const bgColor = {
    indigo: "bg-indigo-50",
    emerald: "bg-emerald-50",
    rose: "bg-rose-50",
    blue: "bg-blue-50",
    amber: "bg-amber-50"
  }[color];
  
  const borderColor = {
    indigo: "border-indigo-100",
    emerald: "border-emerald-100",
    rose: "border-rose-100",
    blue: "border-blue-100",
    amber: "border-amber-100"
  }[color];
  
  return (
    <div className={`p-4 rounded-lg border shadow-sm ${bgColor} ${borderColor} hover:shadow-md transition-shadow`}>
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
