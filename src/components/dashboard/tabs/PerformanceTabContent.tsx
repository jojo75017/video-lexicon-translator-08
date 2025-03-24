
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { analyzePerformance, getLighthouseScore, getMockedWpt } from '@/utils/seo/performanceAnalyzer';
import { Performance } from '@/types/seo';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import LoadingPerformance from '@/components/seo/LoadingPerformance';

const PerformanceTabContent = () => {
  const [performanceData, setPerformanceData] = useState<Performance | null>(null);
  const [lighthouseScore, setLighthouseScore] = useState<{score: number; issues: {category: string; description: string}[]}>(
    {score: 0, issues: []}
  );
  const [wptData, setWptData] = useState<any>(null);
  
  useEffect(() => {
    // Generate performance data when component mounts
    const startTime = performance.now();
    const performanceResults = analyzePerformance(document, startTime);
    setPerformanceData(performanceResults);
    
    // Get Lighthouse score
    const lighthouseResults = getLighthouseScore();
    setLighthouseScore(lighthouseResults);
    
    // Get WebPageTest data
    const wptResults = getMockedWpt();
    setWptData(wptResults);
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Performance du site</h3>
      <p className="text-sm text-gray-600">
        Analysez les performances techniques de votre site web.
      </p>
      
      {performanceData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingPerformance 
            loadTime={performanceData.loadTime}
            firstContentfulPaint={performanceData.firstContentfulPaint}
            domLoadTime={performanceData.domLoadTime}
          />
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Lighthouse Score</h3>
            <div className="flex items-center justify-center mb-6">
              <div className={`h-32 w-32 rounded-full flex items-center justify-center text-white text-3xl font-bold
                ${lighthouseScore.score >= 90 ? 'bg-green-500' : 
                  lighthouseScore.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {lighthouseScore.score}
              </div>
            </div>
            
            {lighthouseScore.issues.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Problèmes à corriger:</h4>
                <ul className="space-y-2">
                  {lighthouseScore.issues.map((issue, index) => (
                    <li key={index} className="bg-amber-50 p-3 rounded-md border border-amber-200 text-sm">
                      <span className="font-medium text-amber-800">{issue.category}:</span> {issue.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
          
          {performanceData && <PerformanceMetrics performance={performanceData} />}
          
          {wptData && (
            <Card className="p-6 md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">WebPageTest Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">First Byte</div>
                  <div className="text-xl font-bold">{wptData.firstView.firstByte.toFixed(0)}ms</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Start Render</div>
                  <div className="text-xl font-bold">{wptData.firstView.startRender.toFixed(0)}ms</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Speed Index</div>
                  <div className="text-xl font-bold">{wptData.firstView.speedIndex.toFixed(0)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Visual Complete</div>
                  <div className="text-xl font-bold">{wptData.firstView.visualComplete.toFixed(0)}ms</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-4">
          <p className="text-sm">Chargement des données de performance...</p>
        </Card>
      )}
    </div>
  );
};

export default PerformanceTabContent;
