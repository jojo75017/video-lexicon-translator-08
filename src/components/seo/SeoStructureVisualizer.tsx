
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HierarchyItem, HeadingStructure } from '@/types/seo';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SeoStructureVisualizerProps {
  headingStructure: HeadingStructure;
}

const SeoStructureVisualizer: React.FC<SeoStructureVisualizerProps> = ({ headingStructure }) => {
  const { t } = useTranslation();
  
  const renderHeading = (heading: HierarchyItem, index: number) => {
    const level = heading.level;
    const indentClass = level === 1 ? '' : `ml-${(level - 1) * 4}`;
    const fontSizeClass = level === 1 ? 'text-xl' : level === 2 ? 'text-lg' : level === 3 ? 'text-base' : 'text-sm';
    
    return (
      <div key={`${heading.tagName}-${index}`}>
        <div className={`p-2 my-1 rounded border ${indentClass} ${
          level === 1 ? 'bg-blue-50 border-blue-200 font-bold' :
          level === 2 ? 'bg-indigo-50 border-indigo-200 font-semibold' :
          level === 3 ? 'bg-purple-50 border-purple-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
              {heading.tagName?.toUpperCase() || `H${level}`}
            </span>
            <span className={fontSizeClass}>{heading.text || heading.name}</span>
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('seo.structure.visualizer', 'Visualisation de la structure')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasIssues && (
          <Alert variant="warning" className="mb-4">
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
