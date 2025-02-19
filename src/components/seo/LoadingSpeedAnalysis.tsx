
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface LoadingSpeedAnalysisProps {
  performance: {
    loadTime: number;
    firstContentfulPaint: number;
    domLoadTime: number;
    speedIndex: number;
    score: number;
    largestContentfulPaint: number;
    timeToInteractive: number;
    resourceBreakdown: {
      images: number;
      scripts: number;
      styles: number;
      fonts: number;
      other: number;
    };
  };
}

const LoadingSpeedAnalysis = ({ performance }: LoadingSpeedAnalysisProps) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Bon';
    if (score >= 50) return 'Moyen';
    return 'À améliorer';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const resourceData = [
    { name: 'Images', size: performance.resourceBreakdown.images },
    { name: 'Scripts', size: performance.resourceBreakdown.scripts },
    { name: 'Styles', size: performance.resourceBreakdown.styles },
    { name: 'Fonts', size: performance.resourceBreakdown.fonts },
    { name: 'Autres', size: performance.resourceBreakdown.other },
  ];

  const timelineData = [
    { name: 'FCP', time: performance.firstContentfulPaint },
    { name: 'TTI', time: performance.timeToInteractive },
    { name: 'LCP', time: performance.largestContentfulPaint },
    { name: 'Total', time: performance.loadTime },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="text-xl font-semibold">Score de Performance</h3>
          </div>
          <div className={`text-3xl font-bold ${getPerformanceColor(performance.score)}`}>
            {performance.score}/100
          </div>
        </div>

        <div className="mb-4">
          <Progress value={performance.score} className="h-2" />
          <p className="mt-2 text-sm text-gray-600">
            {getPerformanceLabel(performance.score)}
          </p>
        </div>

        {performance.loadTime > 3000 && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <p>
              Le temps de chargement total dépasse les 3 secondes, ce qui peut impacter négativement l'expérience utilisateur et le référencement.
            </p>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Chronologie du chargement</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatTime(value)} />
              <Tooltip 
                formatter={(value: number) => formatTime(value)}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="time" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="text-gray-600">First Contentful Paint (FCP)</p>
            <p className="font-semibold">{formatTime(performance.firstContentfulPaint)}</p>
          </div>
          <div>
            <p className="text-gray-600">Time to Interactive (TTI)</p>
            <p className="font-semibold">{formatTime(performance.timeToInteractive)}</p>
          </div>
          <div>
            <p className="text-gray-600">Largest Contentful Paint (LCP)</p>
            <p className="font-semibold">{formatTime(performance.largestContentfulPaint)}</p>
          </div>
          <div>
            <p className="text-gray-600">Temps de chargement total</p>
            <p className="font-semibold">{formatTime(performance.loadTime)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Répartition des ressources</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatBytes(value)} />
              <Tooltip 
                formatter={(value: number) => formatBytes(value)}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="size" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {resourceData.map((resource) => (
            <div key={resource.name}>
              <p className="text-gray-600">{resource.name}</p>
              <p className="font-semibold">{formatBytes(resource.size)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LoadingSpeedAnalysis;
