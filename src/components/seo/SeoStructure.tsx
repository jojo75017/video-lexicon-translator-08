
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { AlertTriangle, Check, ChevronDown, ChevronRight, FileText, List } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { HierarchyItem } from '@/types/seo/Hierarchy';

interface SeoStructureProps {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imgCount: number;
  headings?: { text: string; level: number; position: number; }[];
  showHeadingsList?: boolean;
  hierarchy?: HierarchyItem[];
}

const SeoStructure = ({
  h1Count,
  h2Count,
  h3Count,
  imgCount,
  headings = [],
  showHeadingsList = false,
  hierarchy = []
}: SeoStructureProps) => {
  const [expanded, setExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  console.log("SeoStructure props:", { h1Count, h2Count, h3Count, imgCount, headings, hierarchy });

  // Automatically expand all hierarchy items on first render
  React.useEffect(() => {
    if (hierarchy && hierarchy.length > 0) {
      const initExpanded: Record<string, boolean> = {};
      const expandAll = (items: HierarchyItem[], prefix = '') => {
        items.forEach((item, index) => {
          const key = `${prefix}-${index}`;
          initExpanded[key] = true;
          if (item.children && item.children.length > 0) {
            expandAll(item.children, key);
          }
        });
      };
      expandAll(hierarchy);
      setExpandedItems(initExpanded);
    }
  }, [hierarchy]);

  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderHierarchyItem = (item: HierarchyItem, index: number, prefix = ''): JSX.Element => {
    const key = `${prefix}-${index}`;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[key] || false;
    
    const tagStyle = () => {
      switch(item.tagName) {
        case 'h1': return 'text-blue-700 font-bold text-base';
        case 'h2': return 'text-green-600 font-semibold text-sm ml-4';
        case 'h3': return 'text-amber-600 font-medium text-sm ml-8';
        case 'h4': return 'text-purple-600 font-medium text-sm ml-12';
        case 'h5': return 'text-pink-600 font-medium text-sm ml-16';
        case 'h6': return 'text-red-600 font-medium text-sm ml-20';
        case 'p': return 'text-gray-600 text-xs ml-12';
        default: return 'text-gray-600';
      }
    };
    
    return (
      <div key={key} className="mb-1">
        <div className={`flex items-start ${tagStyle()}`}>
          {hasChildren ? (
            <button 
              onClick={() => toggleItem(key)} 
              className="p-1 rounded hover:bg-gray-100 mr-1"
            >
              {isExpanded ? 
                <ChevronDown className="h-3 w-3" /> : 
                <ChevronRight className="h-3 w-3" />
              }
            </button>
          ) : (
            <span className="w-5"></span>
          )}
          <span className="text-gray-400 mr-1">{item.tagName}</span>
          <span className="flex-1 break-words">{item.text}</span>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {item.children.map((child, childIndex) => renderHierarchyItem(child, childIndex, key))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Structure SEO
        </h3>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      {expanded && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Balises de titre</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Badge variant="outline" className="mr-2 font-mono">H1</Badge>
                    <span className="text-sm">{h1Count} balise(s)</span>
                  </span>
                  {h1Count === 1 ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : h1Count === 0 ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Badge variant="outline" className="mr-2 font-mono">H2</Badge>
                    <span className="text-sm">{h2Count} balise(s)</span>
                  </span>
                  {h2Count > 0 ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Badge variant="outline" className="mr-2 font-mono">H3</Badge>
                    <span className="text-sm">{h3Count} balise(s)</span>
                  </span>
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Ressources</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Badge variant="outline" className="mr-2">IMG</Badge>
                    <span className="text-sm">{imgCount} image(s)</span>
                  </span>
                  {imgCount > 0 ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {showHeadingsList && headings && headings.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <List className="h-4 w-4 mr-1" />
                Structure des titres
              </h4>
              <Card className="p-3 max-h-[350px] overflow-y-auto">
                {headings.map((heading, i) => (
                  <div 
                    key={i} 
                    className={`
                      py-1 px-2 
                      ${i % 2 === 0 ? 'bg-gray-50' : ''} 
                      ${heading.level === 1 ? 'font-bold' : ''}
                      ${heading.level === 2 ? 'pl-4 font-semibold' : ''}
                      ${heading.level === 3 ? 'pl-8' : ''}
                      ${heading.level > 3 ? `pl-${heading.level * 4}` : ''}
                    `}
                  >
                    <Badge variant="outline" className="mr-2 text-xs">H{heading.level}</Badge>
                    {heading.text}
                  </div>
                ))}
              </Card>
            </div>
          )}

          {hierarchy && hierarchy.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <List className="h-4 w-4 mr-1" />
                Hiérarchie du contenu
              </h4>
              <Card className="p-3 max-h-[400px] overflow-y-auto">
                {hierarchy.map((item, index) => renderHierarchyItem(item, index))}
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SeoStructure;
