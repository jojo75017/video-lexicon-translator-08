
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { HierarchyItem, HeadingStructure } from '@/types/seo';
import { AlertCircle, Layout } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SeoStructureVisualizerProps {
  headingStructure?: HeadingStructure;
}

const SeoStructureVisualizer: React.FC<SeoStructureVisualizerProps> = ({ headingStructure }) => {
  const { t } = useTranslation();

  if (!headingStructure) {
    return null;
  }

  const renderHierarchyItem = (item: HierarchyItem, index: number) => {
    const indentation = item.level - 1;
    const tag = item.tagName || `H${item.level}`;
    const hasError = item.level > 1 && item.parentFound === false;
    
    return (
      <React.Fragment key={`hierarchy-${index}`}>
        <div 
          className={`py-2 border-l-2 pl-4 ${hasError ? 'border-red-400' : 'border-gray-300'}`}
          style={{ marginLeft: `${indentation * 1.5}rem` }}
        >
          <div className="flex items-center">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
              hasError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {tag}
            </span>
            <span className="ml-2 text-gray-800">
              {item.text || item.name || '(Sans texte)'}
            </span>
            
            {hasError && (
              <span className="ml-2 text-red-500 text-xs flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {t('seo.missingParent', 'Parent manquant')}
              </span>
            )}
          </div>
        </div>
        
        {item.children && item.children.map((child, childIndex) => 
          renderHierarchyItem(child, index * 100 + childIndex)
        )}
      </React.Fragment>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5 text-blue-600" />
          {t('seo.headingStructure', 'Structure des titres')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {headingStructure.hierarchy && headingStructure.hierarchy.length > 0 ? (
          <div className="space-y-1 mt-2">
            {headingStructure.hierarchy.map((item, index) => renderHierarchyItem(item, index))}
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">
            {t('seo.noHeadingStructure', 'Aucune structure de titres détectée')}
          </div>
        )}
        
        {headingStructure.issues && headingStructure.issues.length > 0 && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">{t('seo.structureIssues', 'Problèmes de structure')}:</div>
              <ul className="list-disc pl-5 space-y-1">
                {headingStructure.issues.map((issue, index) => (
                  <li key={index} className="text-sm">{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SeoStructureVisualizer;
