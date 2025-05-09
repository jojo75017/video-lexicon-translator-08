
import React, { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { PieChart, BarChart2, Clock, Zap, Lightbulb, Monitor, Smartphone } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  speedIndex?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  score?: number;
  resourceBreakdown?: {
    images?: number;
    scripts?: number;
    styles?: number;
    fonts?: number;
    other?: number;
  };
  performanceScore?: number;
  totalBlockingTime?: number;
  cumulativeLayoutShift?: number;
  resourceCount?: number;
  scriptCount?: number;
  styleCount?: number;
  imageCount?: number;
  totalSize?: number;
  responseTime?: number;
}

interface LoadingSpeedAnalysisProps {
  performance: {
    loadTime: number;
    firstContentfulPaint: number;
    domLoadTime: number;
    speedIndex?: number;
    largestContentfulPaint?: number;
    timeToInteractive?: number;
    score?: number;
    resourceBreakdown?: {
      images?: number;
      scripts?: number;
      styles?: number;
      fonts?: number;
      other?: number;
    };
    performanceScore?: number;
    totalBlockingTime?: number;
    cumulativeLayoutShift?: number;
    mobilePerformance?: PerformanceData;
    desktopPerformance?: PerformanceData;
    resourceCount?: number;
    scriptCount?: number;
    styleCount?: number;
    imageCount?: number;
    totalSize?: number;
    responseTime?: number;
  };
}

const LoadingSpeedAnalysis: React.FC<LoadingSpeedAnalysisProps> = ({ performance }) => {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'desktop'>('desktop');

  // Format de conversion de millisecondes en format lisible
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Formater la taille en Ko ou Mo
  const formatSize = (bytes: number): string => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Déterminer la classe de couleur en fonction de la vitesse
  const getSpeedColorClass = (ms: number, type: 'text' | 'bg' = 'text'): string => {
    const prefix = type === 'text' ? 'text' : 'bg';
    if (ms < 1000) return `${prefix}-green-600`;
    if (ms < 2500) return `${prefix}-yellow-600`;
    return `${prefix}-red-600`;
  };

  // Obtenir les données de performance en fonction de l'appareil sélectionné
  const getDevicePerformance = (): PerformanceData => {
    if (activeDevice === 'mobile' && performance.mobilePerformance) {
      return performance.mobilePerformance;
    }
    
    if (activeDevice === 'desktop' && performance.desktopPerformance) {
      return performance.desktopPerformance;
    }
    
    // Fallback aux données génériques si les données spécifiques ne sont pas disponibles
    return performance;
  };

  const deviceData = getDevicePerformance();
  
  // Calculer le score si non fourni
  const speedScore = deviceData.performanceScore || deviceData.score || Math.max(0, Math.min(100, 100 - (deviceData.loadTime / 100)));

  // Données pour le graphique à barres
  const barData = [
    { name: 'Contenu', value: deviceData.firstContentfulPaint || 0 },
    { name: 'DOM', value: deviceData.domLoadTime || 0 },
    { name: 'Total', value: deviceData.loadTime || 0 },
    { name: 'Interactif', value: deviceData.timeToInteractive || deviceData.loadTime * 1.1 || 0 },
  ];

  // Données pour le graphique circulaire
  const resourcesData = [];
  
  if (deviceData.resourceBreakdown) {
    const { images, scripts, styles, fonts, other } = deviceData.resourceBreakdown;
    
    if (images) resourcesData.push({ name: 'Images', value: images });
    if (scripts) resourcesData.push({ name: 'Scripts', value: scripts });
    if (styles) resourcesData.push({ name: 'Styles', value: styles });
    if (fonts) resourcesData.push({ name: 'Polices', value: fonts });
    if (other) resourcesData.push({ name: 'Autres', value: other });
  }

  // Couleurs pour le graphique circulaire
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Formatage pour le tooltip du graphique à barres
  const renderBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-sm">
          <p>{`${payload[0].name}: ${formatTime(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-medium">Performance de chargement</h3>
        </div>
        <div className={`text-2xl font-bold ${speedScore >= 80 ? 'text-green-600' : speedScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
          {speedScore.toFixed(0)}/100
          <span className="text-sm font-normal ml-2 text-gray-500">
            ({speedScore >= 80 ? 'Rapide' : speedScore >= 50 ? 'Moyen' : 'Lent'})
          </span>
        </div>
      </div>
      
      <Tabs defaultValue={activeDevice} onValueChange={(value) => setActiveDevice(value as 'mobile' | 'desktop')}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="desktop" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" /> Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> Mobile
          </TabsTrigger>
        </TabsList>
        
        <Progress value={speedScore} className="h-2" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-center mb-4">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              <h4 className="font-medium">
                {activeDevice === 'mobile' ? 'Temps de chargement mobile' : 'Temps de chargement desktop'}
              </h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Temps de chargement total</span>
                  <span className={getSpeedColorClass(deviceData.loadTime)}>{formatTime(deviceData.loadTime)}</span>
                </div>
                <Progress 
                  value={(deviceData.loadTime / 5000) * 100} 
                  className={`h-2 ${getSpeedColorClass(deviceData.loadTime, 'bg')}`} 
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Premier affichage du contenu</span>
                  <span className={getSpeedColorClass(deviceData.firstContentfulPaint)}>
                    {formatTime(deviceData.firstContentfulPaint)}
                  </span>
                </div>
                <Progress 
                  value={(deviceData.firstContentfulPaint / 2000) * 100} 
                  className={`h-2 ${getSpeedColorClass(deviceData.firstContentfulPaint, 'bg')}`} 
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Chargement du DOM</span>
                  <span className={getSpeedColorClass(deviceData.domLoadTime)}>
                    {formatTime(deviceData.domLoadTime)}
                  </span>
                </div>
                <Progress 
                  value={(deviceData.domLoadTime / 3000) * 100} 
                  className={`h-2 ${getSpeedColorClass(deviceData.domLoadTime, 'bg')}`} 
                />
              </div>
              
              {deviceData.totalBlockingTime && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Temps de blocage total</span>
                    <span className={getSpeedColorClass(deviceData.totalBlockingTime)}>
                      {formatTime(deviceData.totalBlockingTime)}
                    </span>
                  </div>
                  <Progress 
                    value={(deviceData.totalBlockingTime / 500) * 100} 
                    className={`h-2 ${getSpeedColorClass(deviceData.totalBlockingTime, 'bg')}`} 
                  />
                </div>
              )}
              
              {deviceData.timeToInteractive && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Temps avant interactivité</span>
                    <span className={getSpeedColorClass(deviceData.timeToInteractive)}>
                      {formatTime(deviceData.timeToInteractive)}
                    </span>
                  </div>
                  <Progress 
                    value={(deviceData.timeToInteractive / 5000) * 100} 
                    className={`h-2 ${getSpeedColorClass(deviceData.timeToInteractive, 'bg')}`} 
                  />
                </div>
              )}
              
              {deviceData.cumulativeLayoutShift !== undefined && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Décalage cumulatif de mise en page (CLS)</span>
                    <span className={deviceData.cumulativeLayoutShift < 0.1 ? 'text-green-600' : deviceData.cumulativeLayoutShift < 0.25 ? 'text-yellow-600' : 'text-red-600'}>
                      {deviceData.cumulativeLayoutShift.toFixed(3)}
                    </span>
                  </div>
                  <Progress 
                    value={(deviceData.cumulativeLayoutShift / 0.5) * 100} 
                    className={`h-2 ${deviceData.cumulativeLayoutShift < 0.1 ? 'bg-green-600' : deviceData.cumulativeLayoutShift < 0.25 ? 'bg-yellow-600' : 'bg-red-600'}`} 
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-center mb-2">
              <BarChart2 className="w-4 h-4 mr-2 text-blue-600" />
              <h4 className="font-medium">
                {activeDevice === 'mobile' ? 'Analyse des métriques mobiles' : 'Analyse des métriques desktop'}
              </h4>
            </div>
            
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" hide={true} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={70}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={renderBarTooltip} />
                  <Bar 
                    dataKey="value" 
                    fill={activeDevice === 'mobile' ? '#6366F1' : '#4F46E5'} 
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                    label={{ 
                      position: 'right', 
                      formatter: (value: number) => formatTime(value),
                      fontSize: 12,
                      fill: '#6B7280'
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Tabs>
      
      {resourcesData.length > 0 && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center mb-4">
            <PieChart className="w-4 h-4 mr-2 text-blue-600" />
            <h4 className="font-medium">
              {activeDevice === 'mobile' ? 'Répartition des ressources (Mobile)' : 'Répartition des ressources (Desktop)'}
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={resourcesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {resourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatSize(Number(value))} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="col-span-2 space-y-3">
              <h5 className="font-medium text-sm">Détail des ressources:</h5>
              {resourcesData.map((resource, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{resource.name}</span>
                  </div>
                  <span className="font-medium">{formatSize(resource.value)}</span>
                </div>
              ))}
              
              <div className="flex items-center justify-between text-sm font-bold pt-2 border-t mt-2">
                <span>Total</span>
                <span>
                  {formatSize(resourcesData.reduce((sum, item) => sum + item.value, 0))}
                </span>
              </div>
              
              {deviceData.resourceCount !== undefined && (
                <div className="flex items-center justify-between text-sm pt-2">
                  <span>Nombre total de requêtes</span>
                  <span className="font-medium">{deviceData.resourceCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">
              {activeDevice === 'mobile' ? 'Recommandations d\'optimisation mobile' : 'Recommandations d\'optimisation desktop'}
            </h4>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc pl-5">
              {activeDevice === 'mobile' && (
                <>
                  {deviceData.loadTime > 3500 && (
                    <li>Optimisez spécifiquement pour les connexions mobiles plus lentes (3G/4G)</li>
                  )}
                  {deviceData.firstContentfulPaint > 1200 && (
                    <li>Réduisez les CSS bloquants pour améliorer le rendu initial sur mobile</li>
                  )}
                  {deviceData.resourceBreakdown?.images && deviceData.resourceBreakdown.images > 400000 && (
                    <li>Utilisez des images responsive avec srcset pour les appareils mobiles</li>
                  )}
                  {deviceData.cumulativeLayoutShift && deviceData.cumulativeLayoutShift > 0.25 && (
                    <li>Corrigez les changements de mise en page inattendus sur mobile (CLS élevé)</li>
                  )}
                  <li>Utilisez AMP (Accelerated Mobile Pages) pour une expérience ultra-rapide</li>
                  <li>Testez l'interface tactile et assurez-vous que les éléments cliquables sont suffisamment grands</li>
                  <li>Évitez les redirections sur mobile qui ralentissent le chargement</li>
                </>
              )}
                  
              {activeDevice === 'desktop' && (
                <>
                  {deviceData.loadTime > 3000 && (
                    <li>Réduisez le temps de chargement total, idéalement en dessous de 3 secondes</li>
                  )}
                  {deviceData.firstContentfulPaint > 1000 && (
                    <li>Améliorez le premier affichage du contenu en optimisant le CSS critique</li>
                  )}
                  {deviceData.resourceBreakdown?.images && deviceData.resourceBreakdown.images > 500000 && (
                    <li>Compressez et optimisez les images pour réduire leur taille</li>
                  )}
                  {deviceData.resourceBreakdown?.scripts && deviceData.resourceBreakdown.scripts > 400000 && (
                    <li>Minifiez et divisez vos scripts JavaScript</li>
                  )}
                  {deviceData.timeToInteractive && deviceData.timeToInteractive > 3500 && (
                    <li>Réduisez le JavaScript qui bloque l'interactivité</li>
                  )}
                  <li>Utilisez un système de mise en cache efficace pour les ressources statiques</li>
                  <li>Implémentez le chargement différé (lazy loading) pour les images</li>
                </>
              )}
              
              <li>Adoptez un CDN pour améliorer les temps de réponse globaux</li>
              <li>Activez la compression GZIP/Brotli pour réduire la taille des transferts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpeedAnalysis;
