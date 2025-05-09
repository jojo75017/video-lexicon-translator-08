
import React from 'react';
import { Card } from "@/components/ui/card";
import { Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { PerformanceData } from './types';
import { calculateSpeedScore } from './utils';

interface PerformanceHighlightsProps {
  mobilePerformance?: PerformanceData;
  desktopPerformance?: PerformanceData;
}

const PerformanceHighlights: React.FC<PerformanceHighlightsProps> = ({ 
  mobilePerformance, 
  desktopPerformance 
}) => {
  // Déterminer si les performances sont acceptables
  const isMobileAcceptable = mobilePerformance && calculateSpeedScore(mobilePerformance) >= 70;
  const isDesktopAcceptable = desktopPerformance && calculateSpeedScore(desktopPerformance) >= 80;
  
  // Déterminer les problèmes majeurs
  const getMajorIssues = (data?: PerformanceData) => {
    if (!data) return [];
    
    const issues = [];
    
    if (data.largestContentfulPaint && data.largestContentfulPaint > 2500) {
      issues.push('Contenu principal lent à s\'afficher');
    }
    
    if (data.totalBlockingTime && data.totalBlockingTime > 300) {
      issues.push('Temps de blocage excessif');
    }
    
    if (data.cumulativeLayoutShift && data.cumulativeLayoutShift > 0.25) {
      issues.push('Instabilité visuelle importante');
    }
    
    if ((data.resourceCount || 0) > 70) {
      issues.push('Nombre excessif de ressources');
    }
    
    if ((data.totalSize || 0) > 3 * 1024 * 1024) {
      issues.push('Taille totale de page excessive');
    }
    
    return issues;
  };
  
  const mobileIssues = getMajorIssues(mobilePerformance);
  const desktopIssues = getMajorIssues(desktopPerformance);
  
  // Trouver les points forts
  const getStrengths = (data?: PerformanceData) => {
    if (!data) return [];
    
    const strengths = [];
    
    if (data.firstContentfulPaint && data.firstContentfulPaint < 1000) {
      strengths.push('Premier affichage rapide');
    }
    
    if (data.cumulativeLayoutShift !== undefined && data.cumulativeLayoutShift < 0.1) {
      strengths.push('Excellente stabilité visuelle');
    }
    
    if (data.loadTime && data.loadTime < 2000) {
      strengths.push('Temps de chargement rapide');
    }
    
    return strengths;
  };
  
  const mobileStrengths = getStrengths(mobilePerformance);
  const desktopStrengths = getStrengths(desktopPerformance);
  
  // Déterminer quelle version est plus rapide
  const getFasterVersion = () => {
    if (!mobilePerformance || !desktopPerformance) return null;
    
    const mobileScore = calculateSpeedScore(mobilePerformance);
    const desktopScore = calculateSpeedScore(desktopPerformance);
    
    if (desktopScore > mobileScore + 10) return 'desktop';
    if (mobileScore > desktopScore + 5) return 'mobile';
    return 'equal';
  };
  
  const fasterVersion = getFasterVersion();

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-lg font-medium mb-3">Points clés de performance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Vue d'ensemble */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <h4 className="font-medium flex items-center text-gray-700 mb-2">
            <Clock className="h-4 w-4 mr-1 text-blue-500" />
            Vue d'ensemble
          </h4>
          
          <div className="space-y-2 text-sm">
            {fasterVersion && (
              <div className="flex items-baseline">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500 flex-shrink-0" />
                <span>
                  Version la plus rapide: 
                  <span className={`font-medium ${fasterVersion === 'equal' ? 'text-gray-600' : fasterVersion === 'desktop' ? 'text-green-600' : 'text-blue-600'}`}>
                    {fasterVersion === 'equal' ? ' Performances équilibrées' : 
                     fasterVersion === 'desktop' ? ' Desktop (ordinateur)' : ' Mobile (smartphone)'}
                  </span>
                </span>
              </div>
            )}
            
            <div className="flex items-baseline">
              <span className="text-gray-700">Performance mobile:</span>
              <span className={`ml-2 ${isMobileAcceptable ? 'text-green-600' : 'text-orange-500'}`}>
                {isMobileAcceptable ? 'Acceptable' : 'À améliorer'} 
                ({mobilePerformance ? Math.round(calculateSpeedScore(mobilePerformance)) : '--'}/100)
              </span>
            </div>
            
            <div className="flex items-baseline">
              <span className="text-gray-700">Performance desktop:</span>
              <span className={`ml-2 ${isDesktopAcceptable ? 'text-green-600' : 'text-orange-500'}`}>
                {isDesktopAcceptable ? 'Bonne' : 'À améliorer'} 
                ({desktopPerformance ? Math.round(calculateSpeedScore(desktopPerformance)) : '--'}/100)
              </span>
            </div>
          </div>
        </div>
        
        {/* Problèmes majeurs */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <h4 className="font-medium flex items-center text-gray-700 mb-2">
            <AlertTriangle className="h-4 w-4 mr-1 text-orange-500" />
            Principaux problèmes
          </h4>
          
          <div className="space-y-2 text-sm">
            {mobileIssues.length > 0 && (
              <div>
                <span className="text-gray-700">Mobile:</span>
                <ul className="list-disc pl-5 text-orange-600">
                  {mobileIssues.slice(0, 2).map((issue, idx) => (
                    <li key={`mobile-issue-${idx}`}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {desktopIssues.length > 0 && (
              <div>
                <span className="text-gray-700">Desktop:</span>
                <ul className="list-disc pl-5 text-orange-600">
                  {desktopIssues.slice(0, 2).map((issue, idx) => (
                    <li key={`desktop-issue-${idx}`}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {mobileIssues.length === 0 && desktopIssues.length === 0 && (
              <div className="text-green-600">
                Aucun problème majeur détecté !
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Points forts */}
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <h4 className="font-medium flex items-center text-gray-700 mb-2">
          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
          Points forts
        </h4>
        
        <div className="space-y-2 text-sm">
          {mobileStrengths.length > 0 && (
            <div>
              <span className="text-gray-700">Mobile:</span>
              <ul className="list-disc pl-5 text-green-600">
                {mobileStrengths.map((strength, idx) => (
                  <li key={`mobile-strength-${idx}`}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {desktopStrengths.length > 0 && (
            <div>
              <span className="text-gray-700">Desktop:</span>
              <ul className="list-disc pl-5 text-green-600">
                {desktopStrengths.map((strength, idx) => (
                  <li key={`desktop-strength-${idx}`}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {mobileStrengths.length === 0 && desktopStrengths.length === 0 && (
            <div className="text-orange-600">
              Des améliorations sont recommandées pour tous les aspects.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PerformanceHighlights;
