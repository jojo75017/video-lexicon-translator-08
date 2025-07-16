
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Clock, 
  Smartphone, 
  Monitor,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface PerformanceData {
  score: number;
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  totalSize: number;
  scriptCount: number;
  styleCount: number;
  responseTime: number;
  resourceBreakdown: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
}

interface PerformanceHighlightsProps {
  deviceData: PerformanceData;
  activeDevice: 'mobile' | 'desktop';
}

const PerformanceHighlights: React.FC<PerformanceHighlightsProps> = ({ 
  deviceData, 
  activeDevice 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { variant: 'default' as const, text: 'Excellent', icon: CheckCircle };
    if (score >= 50) return { variant: 'secondary' as const, text: 'Moyen', icon: AlertTriangle };
    return { variant: 'destructive' as const, text: 'Faible', icon: AlertTriangle };
  };

  const formatTime = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.round(ms)}ms`;
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)}MB`;
    if (bytes >= 1000) return `${(bytes / 1000).toFixed(0)}KB`;
    return `${bytes}B`;
  };

  const scoreBadge = getScoreBadge(deviceData.score);
  const ScoreIcon = scoreBadge.icon;

  return (
    <div className="space-y-6">
      {/* Score principal */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50"></div>
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-md">
                {activeDevice === 'mobile' ? 
                  <Smartphone className="h-6 w-6 text-blue-600" /> : 
                  <Monitor className="h-6 w-6 text-blue-600" />
                }
              </div>
              <div>
                <h3 className="text-lg font-semibold">Score Performance {activeDevice === 'mobile' ? 'Mobile' : 'Desktop'}</h3>
                <p className="text-sm text-gray-600">Évaluation globale PageSpeed Insights</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-4xl font-bold ${getScoreColor(deviceData.score)}`}>
                {deviceData.score}
              </div>
              <Badge variant={scoreBadge.variant} className="mt-2">
                <ScoreIcon className="h-3 w-3 mr-1" />
                {scoreBadge.text}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Temps de chargement</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{formatTime(deviceData.loadTime)}</div>
              <Progress value={Math.min((3000 - deviceData.loadTime) / 30, 100)} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">First Contentful Paint</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{formatTime(deviceData.firstContentfulPaint)}</div>
              <Progress value={Math.min((2000 - deviceData.firstContentfulPaint) / 20, 100)} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">LCP</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{formatTime(deviceData.largestContentfulPaint)}</div>
              <Progress value={Math.min((2500 - deviceData.largestContentfulPaint) / 25, 100)} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">CLS</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{deviceData.cumulativeLayoutShift.toFixed(3)}</div>
              <div className="text-xs text-gray-500 mt-1">
                {deviceData.cumulativeLayoutShift < 0.1 ? 'Bon' : 
                 deviceData.cumulativeLayoutShift < 0.25 ? 'Moyen' : 'Mauvais'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails des ressources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analyse des ressources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{formatSize(deviceData.totalSize)}</div>
              <div className="text-sm text-gray-600">Taille totale</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{deviceData.scriptCount}</div>
              <div className="text-sm text-gray-600">Scripts JS</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{deviceData.styleCount}</div>
              <div className="text-sm text-gray-600">Feuilles CSS</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{formatTime(deviceData.responseTime)}</div>
              <div className="text-sm text-gray-600">Temps réponse</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-3">Répartition des ressources</h4>
            <div className="space-y-3">
              {Object.entries(deviceData.resourceBreakdown).map(([type, size]) => (
                <div key={type} className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium capitalize">{type}</div>
                  <div className="flex-1">
                    <Progress 
                      value={(size / deviceData.totalSize) * 100} 
                      className="h-3"
                    />
                  </div>
                  <div className="text-sm text-gray-600 w-16 text-right">
                    {formatSize(size)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceHighlights;
