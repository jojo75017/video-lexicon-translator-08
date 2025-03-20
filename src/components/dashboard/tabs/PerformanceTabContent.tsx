
import React from 'react';
import LoadingSpeedAnalysis from '@/components/seo/LoadingSpeedAnalysis';
import LoadingPerformance from '@/components/seo/LoadingPerformance';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import { getHealthMetrics } from '@/utils/seo/healthUtils';
import { Activity, AlertTriangle, Database, Download, FileText, Gauge, LayoutGrid, Server, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Données d'exemple pour les performances compatibles avec l'interface Performance
const samplePerformance = {
  score: 85,
  loadTime: 1520,
  firstContentfulPaint: 980,
  domLoadTime: 2100,
  timeToInteractive: 2800,
  cssCount: 10,
  scriptCount: 15,
  requestCount: 28,
  resourceCount: 38,
  imageCount: 12,
  cacheLifetime: 3600,
  largestContentfulPaint: 1500,
  speedIndex: 1900,
  resourceBreakdown: {
    images: 980000,
    scripts: 720000,
    styles: 280000,
    fonts: 150000,
    other: 370000
  },
  totalSize: 2500000,
  styleCount: 10,
  responseTime: 280,
  impressions: 32500,
  clickThroughRate: 0.072
};

const PerformanceTabContent: React.FC = () => {
  const healthMetrics = getHealthMetrics();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md" id="performance" data-section="performance" data-tab-content="performance">
      <h2 className="text-xl font-bold mb-4">Performance et Vitesse</h2>
      <p className="text-gray-600 mb-6">Analyse détaillée des performances de chargement et optimisations recommandées pour votre site.</p>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Scores de santé */}
        <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5 text-indigo-600" />
            Scores de santé technique
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-4">
            <MetricCard 
              icon={<Zap className="h-5 w-5" />}
              label="Performance"
              value={healthMetrics.performance}
              color="text-amber-600"
              bgColor="bg-amber-50"
            />
            <MetricCard 
              icon={<LayoutGrid className="h-5 w-5" />}
              label="Accessibilité"
              value={healthMetrics.accessibility}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <MetricCard 
              icon={<FileText className="h-5 w-5" />}
              label="SEO"
              value={healthMetrics.seo}
              color="text-emerald-600"
              bgColor="bg-emerald-50"
            />
            <MetricCard 
              icon={<Server className="h-5 w-5" />}
              label="Sécurité"
              value={healthMetrics.security}
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
            <MetricCard 
              icon={<Activity className="h-5 w-5" />}
              label="Mobile"
              value={healthMetrics.mobile}
              color="text-rose-600"
              bgColor="bg-rose-50"
            />
          </div>
        </Card>
        
        {/* Analyse des performances de chargement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <LoadingPerformance 
            loadTime={samplePerformance.loadTime}
            firstContentfulPaint={samplePerformance.firstContentfulPaint}
            domLoadTime={samplePerformance.domLoadTime}
          />
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Optimisations critiques
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="min-w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-red-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Optimiser les images</p>
                  <p className="text-sm text-gray-600">Réduisez le poids des images de 980KB à environ 400KB</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="min-w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-amber-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mettre en cache les ressources</p>
                  <p className="text-sm text-gray-600">Définir des en-têtes d'expiration appropriés</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="min-w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-amber-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Minifier JavaScript</p>
                  <p className="text-sm text-gray-600">Réduire la taille des scripts de 720KB à environ 500KB</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="min-w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Utiliser un CDN</p>
                  <p className="text-sm text-gray-600">Distribuer les ressources statiques via un réseau de diffusion</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
        
        {/* Métrique de ressources */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-600" />
              Ressources et téléchargements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PerformanceMetrics performance={samplePerformance} />
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Répartition des ressources</h4>
                  <div className="space-y-3">
                    <ResourceBar 
                      label="Images" 
                      size={samplePerformance.resourceBreakdown.images} 
                      color="bg-blue-500" 
                      totalSize={samplePerformance.totalSize}
                    />
                    <ResourceBar 
                      label="Scripts" 
                      size={samplePerformance.resourceBreakdown.scripts} 
                      color="bg-amber-500" 
                      totalSize={samplePerformance.totalSize}
                    />
                    <ResourceBar 
                      label="Styles" 
                      size={samplePerformance.resourceBreakdown.styles} 
                      color="bg-emerald-500" 
                      totalSize={samplePerformance.totalSize}
                    />
                    <ResourceBar 
                      label="Fonts" 
                      size={samplePerformance.resourceBreakdown.fonts} 
                      color="bg-purple-500" 
                      totalSize={samplePerformance.totalSize}
                    />
                    <ResourceBar 
                      label="Autres" 
                      size={samplePerformance.resourceBreakdown.other} 
                      color="bg-gray-500" 
                      totalSize={samplePerformance.totalSize}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Actions recommandées</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-indigo-600" />
                      <span>Réduire la taille totale de la page à moins de 1.5MB</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-indigo-600" />
                      <span>Limiter les requêtes HTTP à moins de 25</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-indigo-600" />
                      <span>Activer la compression GZIP pour tous les assets</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Analyse détaillée des performances */}
        <LoadingSpeedAnalysis performance={samplePerformance} />
      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, color, bgColor }) => {
  return (
    <div className={`p-4 rounded-lg ${bgColor} border border-gray-100`}>
      <div className="flex justify-between items-center mb-2">
        <div className={`${color}`}>{icon}</div>
        <span className={`text-xs font-medium ${value >= 90 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'} px-2 py-0.5 rounded-full`}>
          {value >= 90 ? 'Excellent' : value >= 70 ? 'Bon' : 'À améliorer'}
        </span>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
        
        <Progress
          value={value}
          className="h-1.5"
          className={
            value >= 90 ? 'bg-green-500' : 
            value >= 70 ? 'bg-blue-500' : 
            value >= 50 ? 'bg-amber-500' : 
            'bg-red-500'
          }
        />
      </div>
    </div>
  );
};

interface ResourceBarProps {
  label: string;
  size: number;
  color: string;
  totalSize: number;
}

const ResourceBar: React.FC<ResourceBarProps> = ({ label, size, color, totalSize }) => {
  const percentage = (size / totalSize) * 100;
  const formattedSize = formatBytes(size);
  
  return (
    <div>
      <div className="flex justify-between mb-1 text-sm">
        <span>{label}</span>
        <span className="text-gray-600">{formattedSize} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

// Fonction utilitaire pour formater les tailles en octets
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default PerformanceTabContent;
