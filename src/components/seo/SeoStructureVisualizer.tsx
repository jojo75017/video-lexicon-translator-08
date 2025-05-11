
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HierarchyItem, HeadingStructure } from '@/types/seo';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface SeoStructureVisualizerProps {
  headingStructure: HeadingStructure;
}

const SeoStructureVisualizer: React.FC<SeoStructureVisualizerProps> = ({ headingStructure }) => {
  const { t } = useTranslation();
  
  const renderHeading = (heading: HierarchyItem, index: number) => {
    const level = heading.level;
    const indentClass = level === 1 ? '' : `ml-${(level - 1) * 4}`;
    const fontSizeClass = level === 1 ? 'text-xl' : level === 2 ? 'text-lg' : level === 3 ? 'text-base' : 'text-sm';
    
    const statusBadge = () => {
      if (level === 1 && index > 0) {
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 ml-2">
            {t('seo.multipleH1', 'Multiple H1')}
          </Badge>
        );
      }
      if (level > 1 && !heading.parentFound) {
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 ml-2">
            {t('seo.missingParent', 'Missing parent')}
          </Badge>
        );
      }
      return null;
    };
    
    const wordCount = heading.text ? heading.text.split(' ').length : 0;
    const isLongHeading = level <= 2 && wordCount > 10;

    return (
      <div key={`${heading.tagName}-${index}`}>
        <div className={`p-2 my-1 rounded border ${indentClass} ${
          level === 1 ? 'bg-blue-50 border-blue-200 font-bold' :
          level === 2 ? 'bg-indigo-50 border-indigo-200 font-semibold' :
          level === 3 ? 'bg-purple-50 border-purple-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
              {heading.tagName?.toUpperCase() || `H${level}`}
            </span>
            <span className={`${fontSizeClass} ${isLongHeading ? 'text-orange-600' : ''}`}>
              {heading.text || heading.name || t('seo.untitled', 'Sans titre')}
            </span>
            {statusBadge()}
            
            {isLongHeading && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                {t('seo.longHeading', 'Titre long')}
              </Badge>
            )}
            
            {wordCount > 0 && (
              <span className="text-xs text-gray-500 ml-auto">
                {wordCount} {t('seo.words', 'mots')}
              </span>
            )}
          </div>
        </div>
        
        {heading.children && heading.children.length > 0 && (
          <div className="ml-4">
            {heading.children.map((childHeading, childIndex) => 
              renderHeading(childHeading, childIndex)
            )}
          </div>
        )}
      </div>
    );
  };
  
  const issues = headingStructure.issues || [];
  const hasIssues = issues.length > 0;
  const hasH1 = headingStructure.hierarchy?.some(h => h.level === 1 || h.tagName === 'H1');
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {t('seo.structure.visualizer', 'Visualisation de la structure')}
        </CardTitle>
        <div>
          {hasH1 ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              {t('seo.h1Present', 'H1 présent')}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {t('seo.missingH1', 'H1 manquant')}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {hasIssues && (
          <Alert className="mb-4" variant="destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              <div className="font-medium mb-1">{t('seo.structure.issues', 'Problèmes détectés')}</div>
              <ul className="list-disc pl-5 text-sm">
                {issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {!hasH1 && (
          <Alert className="mb-4" variant="warning">
            <Info className="h-4 w-4 mr-2" />
            <AlertDescription>
              {t('seo.recommendH1', 'Il est recommandé d\'avoir exactement une balise H1 sur votre page')}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-2 space-y-1">
          {headingStructure.hierarchy && headingStructure.hierarchy.length > 0 ? (
            headingStructure.hierarchy.map((heading, index) => renderHeading(heading, index))
          ) : (
            <div className="text-gray-500 italic py-4 text-center border border-dashed border-gray-200 rounded">
              {t('seo.structure.noHeadings', 'Aucune structure de titres détectée')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoStructureVisualizer;
