
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { List, Heading1, Heading2, Heading3, Image, ChevronDown, ChevronRight, Type } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { HeadingStructure } from '@/types/seo';

interface SeoStructureProps {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imgCount: number;
  headings?: HeadingStructure['headings'];
  showHeadingsList?: boolean;
}

const SeoStructure = ({ 
  h1Count, 
  h2Count, 
  h3Count, 
  imgCount, 
  headings = [],
  showHeadingsList = false
}: SeoStructureProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  
  const getHeadingIcon = (level: number) => {
    switch(level) {
      case 1: return <Heading1 className="h-4 w-4 text-blue-600" />;
      case 2: return <Heading2 className="h-4 w-4 text-green-600" />;
      case 3: return <Heading3 className="h-4 w-4 text-purple-600" />;
      default: return <Heading3 className="h-4 w-4 text-gray-600" />;
    }
  };
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <List className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Structure SERP de la page</h3>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heading1 className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Titres H1</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={h1Count === 1 ? "default" : "destructive"}>
              {h1Count || 0}
            </Badge>
            {h1Count !== 1 && (
              <span className="text-sm text-red-500">
                Devrait être égal à 1
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heading2 className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Titres H2</span>
          </div>
          <Badge variant="secondary">{h2Count || 0}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heading3 className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Titres H3</span>
          </div>
          <Badge variant="secondary">{h3Count || 0}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Images</span>
          </div>
          <Badge variant="secondary">{imgCount || 0}</Badge>
        </div>
      </div>
      
      {showHeadingsList && headings.length > 0 && (
        <div className="mt-4">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mb-2"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {expanded ? "Masquer" : "Afficher"} la structure des titres
          </button>
          
          {expanded && (
            <Card className="p-4 bg-gray-50 border border-gray-200 overflow-auto max-h-96">
              <div className="space-y-2">
                {headings.map((heading, idx) => (
                  <div 
                    key={idx} 
                    className={`
                      flex items-start gap-2 p-2 rounded-md
                      ${heading.level === 1 ? 'bg-blue-50 border border-blue-100' : ''}
                      ${heading.level === 2 ? 'ml-6' : ''}
                      ${heading.level === 3 ? 'ml-12' : ''}
                      ${heading.level > 3 ? 'ml-16' : ''}
                    `}
                  >
                    {getHeadingIcon(heading.level)}
                    <span className={heading.level === 1 ? 'font-bold' : heading.level === 2 ? 'font-medium' : ''}>
                      {heading.text}
                    </span>
                  </div>
                ))}
                {headings.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    Aucune structure de titres détectée
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SeoStructure;
