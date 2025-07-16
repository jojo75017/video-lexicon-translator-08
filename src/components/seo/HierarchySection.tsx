
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, CheckCircle, List } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface HierarchySectionProps {
  isLoading: boolean;
  seoAnalysis: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    hierarchy: any[];
    headings: any[];
    wordCount: number;
    readabilityScore: number;
  };
}

const HierarchySection: React.FC<HierarchySectionProps> = ({ isLoading, seoAnalysis }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Hiérarchie du contenu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getOptimizationStatus = (type: string, count: number) => {
    if (type === 'h1') {
      if (count === 1) return { status: 'good', message: 'Parfait: 1 seule balise H1' };
      if (count === 0) return { status: 'error', message: 'Aucune balise H1 trouvée' };
      return { status: 'warning', message: `${count} balises H1 (recommandé: 1)` };
    }
    
    if (type === 'h2') {
      if (count >= 2 && count <= 8) return { status: 'good', message: `${count} balises H2 (optimal)` };
      if (count === 0) return { status: 'warning', message: 'Aucune balise H2' };
      if (count === 1) return { status: 'warning', message: 'Une seule H2 (ajoutez-en)' };
      return { status: 'warning', message: `${count} balises H2 (beaucoup)` };
    }
    
    return { status: 'good', message: `${count} balises ${type}` };
  };

  const h1Status = getOptimizationStatus('h1', seoAnalysis.h1Count);
  const h2Status = getOptimizationStatus('h2', seoAnalysis.h2Count);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Hiérarchie du contenu
        </CardTitle>
        <p className="text-sm text-gray-600">
          Structure des titres et lisibilité
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Métriques de base */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Structure des titres</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">H1</Badge>
                    <span className="text-sm">{seoAnalysis.h1Count}</span>
                  </span>
                  {h1Status.status === 'good' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {h1Status.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  {h1Status.status === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">H2</Badge>
                    <span className="text-sm">{seoAnalysis.h2Count}</span>
                  </span>
                  {h2Status.status === 'good' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {h2Status.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">H3</Badge>
                    <span className="text-sm">{seoAnalysis.h3Count}</span>
                  </span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Lisibilité</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mots</span>
                  <span className="font-medium">{seoAnalysis.wordCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Score lisibilité</span>
                  <span className="font-medium">{seoAnalysis.readabilityScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${seoAnalysis.readabilityScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hiérarchie des titres */}
          {seoAnalysis.headings && seoAnalysis.headings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <List className="h-4 w-4" />
                Structure détaillée
              </h4>
              <div className="bg-white border border-gray-200 rounded-lg p-3 max-h-64 overflow-y-auto">
                {seoAnalysis.headings.map((heading: any, index: number) => (
                  <div 
                    key={index} 
                    className={`py-2 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        H{heading.level}
                      </Badge>
                      <span className="text-sm truncate">{heading.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Recommandations */}
          <div className="space-y-2">
            {h1Status.status !== 'good' && (
              <div className={`p-3 rounded-lg text-sm ${
                h1Status.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {h1Status.message}
              </div>
            )}
            
            {h2Status.status !== 'good' && (
              <div className="p-3 rounded-lg text-sm bg-amber-50 text-amber-700">
                {h2Status.message}
              </div>
            )}
            
            {seoAnalysis.wordCount < 300 && (
              <div className="p-3 rounded-lg text-sm bg-amber-50 text-amber-700">
                Contenu court ({seoAnalysis.wordCount} mots). Recommandé: au moins 300 mots.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HierarchySection;
