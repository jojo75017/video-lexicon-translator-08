
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronDown, Heading1, Heading2, Heading3, Type, AlertCircle, CheckCircle2, BarChart2, Lightbulb, FileQuestion, Search } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ContentItem {
  type: 'h1' | 'h2' | 'h3' | 'text';
  content: string;
  position: number;
}

interface ContentHierarchyProps {
  headings: {
    text: string;
    level: number;
    position: number;
  }[];
  paragraphs: {
    text: string;
    position: number;
  }[];
  hierarchy?: any[];
  recommendations?: string[];
  onAnalyze?: () => void;
}

const ContentHierarchy = ({ 
  headings = [], 
  paragraphs = [], 
  hierarchy = [],
  recommendations = [],
  onAnalyze
}: ContentHierarchyProps) => {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // Check if we have actual content to analyze - ensure arrays have elements with content
  const hasHeadings = headings && headings.length > 0 && headings.some(h => h.text && h.text.trim() !== '');
  const hasParagraphs = paragraphs && paragraphs.length > 0 && paragraphs.some(p => p.text && p.text.trim() !== '');
  const hasContent = hasHeadings || hasParagraphs;

  const handleAnalyzeClick = () => {
    if (onAnalyze) {
      onAnalyze();
    } else {
      toast.info("Pour analyser un site, utilisez l'outil principal d'analyse SEO");
    }
  };

  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getAllContent = (): ContentItem[] => {
    if (!hasContent) return [];
    
    const content: ContentItem[] = [
      ...headings.map(h => ({
        type: `h${h.level}` as 'h1' | 'h2' | 'h3',
        content: h.text,
        position: h.position
      })),
      ...paragraphs.map(p => ({
        type: 'text' as const,
        content: p.text,
        position: p.position
      }))
    ];

    return content.sort((a, b) => a.position - b.position);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'h1':
        return <Heading1 className="h-4 w-4 text-blue-600" />;
      case 'h2':
        return <Heading2 className="h-4 w-4 text-green-600" />;
      case 'h3':
        return <Heading3 className="h-4 w-4 text-purple-600" />;
      default:
        return <Type className="h-4 w-4 text-gray-600" />;
    }
  };

  const getIndentation = (type: string) => {
    switch (type) {
      case 'h1':
        return 'ml-0';
      case 'h2':
        return 'ml-6';
      case 'h3':
        return 'ml-12';
      default:
        return 'ml-16';
    }
  };

  const analyzeHierarchy = () => {
    if (!hasContent) return ["Aucun contenu à analyser. Analysez d'abord un site web."];
    
    const h1Count = headings.filter(h => h.level === 1).length;
    const issues = [];

    if (h1Count === 0) {
      issues.push("❌ Aucun titre H1 trouvé - chaque page devrait avoir un H1 unique");
    } else if (h1Count > 1) {
      issues.push("⚠️ Plusieurs titres H1 détectés - il ne devrait y en avoir qu'un seul");
    }

    const h2BeforeH1 = headings.some((h, i) => {
      const prevH1 = headings.slice(0, i).find(prev => prev.level === 1);
      return h.level === 2 && !prevH1;
    });

    if (h2BeforeH1) {
      issues.push("⚠️ Des titres H2 apparaissent avant le premier H1");
    }

    const h3BeforeH2 = headings.some((h, i) => {
      const prevH2 = headings.slice(0, i).find(prev => prev.level === 2);
      return h.level === 3 && !prevH2;
    });

    if (h3BeforeH2) {
      issues.push("⚠️ Des titres H3 apparaissent avant le premier H2");
    }

    return issues.length > 0 ? issues : ["La structure hiérarchique est bien organisée"];
  };

  const extractKeywords = () => {
    if (!hasContent) return [];
    
    const allText = getAllContent().map(item => item.content).join(' ').toLowerCase();
    const words = allText.split(/\s+/);
    const wordCount: { [key: string]: number } = {};
    
    const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'mais', 'donc', 'car', 'de', 'à', 'en', 'dans', 'par', 'pour', 'avec', 'sur'];
    
    words.forEach(word => {
      if (word.length > 3 && !stopWords.includes(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));
  };

  const content = getAllContent();
  const hierarchyIssues = analyzeHierarchy();
  const keywords = extractKeywords();

  // Empty state rendering
  if (!hasContent) {
    return (
      <Card className="p-6 bg-white/50 backdrop-blur-sm">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-600" />
              Aperçu de la SERP et Structure
            </h2>
            <p className="text-gray-600 text-sm">
              Analysez un site web pour voir sa structure SERP et hiérarchique
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileQuestion className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">Aucun site web analysé</h3>
            <p className="text-gray-400 max-w-md mb-6">
              Pour voir l'analyse de la structure SERP, commencez par analyser un site web en utilisant l'outil d'analyse SEO.
            </p>
            <Button 
              variant="outline"
              onClick={handleAnalyzeClick}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Analyser un site web
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Render hierarchical content with expand/collapse functionality
  const renderHierarchicalItem = (item: any, index: number, level: number = 0, path: string = '') => {
    const currentPath = `${path}-${index}`;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[currentPath] !== false; // Default to expanded
    
    const getTagIcon = () => {
      if (item.tagName === 'h1') return <Heading1 className="h-5 w-5 text-blue-600 flex-shrink-0" />;
      if (item.tagName === 'h2') return <Heading2 className="h-5 w-5 text-green-600 flex-shrink-0" />;
      if (item.tagName === 'h3') return <Heading3 className="h-5 w-5 text-purple-600 flex-shrink-0" />;
      if (item.tagName === 'p') return <Type className="h-5 w-5 text-gray-500 flex-shrink-0" />;
      return <div className="w-5 h-5 flex-shrink-0" />;
    };
    
    return (
      <div key={currentPath} className={`ml-${level * 6}`}>
        <div 
          className={`
            flex items-start rounded-md p-2 mb-1 group transition-colors
            ${item.tagName === 'h1' ? 'bg-blue-50 border border-blue-100' : ''}
            ${item.tagName === 'h2' ? 'bg-green-50 border border-green-100' : ''}
            ${item.tagName === 'h3' ? 'bg-purple-50 border border-purple-100' : ''}
            ${item.tagName === 'p' ? 'pl-3 text-sm text-gray-600' : 'font-medium'}
          `}
        >
          {hasChildren ? (
            <button 
              onClick={() => toggleItem(currentPath)} 
              className="mr-1 text-gray-400 hover:text-gray-600 mt-0.5"
            >
              {isExpanded ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </button>
          ) : (
            <div className="w-5 mr-1" />
          )}
          
          {getTagIcon()}
          
          <span className="ml-2 overflow-hidden text-ellipsis">
            {item.text}
          </span>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="pl-4 border-l border-gray-200 ml-2.5 mt-1 mb-2">
            {item.children.map((child: any, childIndex: number) => 
              renderHierarchicalItem(child, childIndex, level + 1, currentPath)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-blue-600" />
            Aperçu de la SERP et Structure
          </h2>
          <p className="text-gray-600 text-sm">
            Analyse détaillée de la hiérarchie SERP et du contenu de votre page
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Type className="h-4 w-4 text-blue-600" />
                Mots-clés Principaux
              </h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map(({ word, count }, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {word} ({count})
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Structure du Document</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Heading1 className="h-4 w-4 text-blue-600" />
                      <span>H1</span>
                    </span>
                    <Badge variant={headings.filter(h => h.level === 1).length === 1 ? "default" : "destructive"}>
                      {headings.filter(h => h.level === 1).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Heading2 className="h-4 w-4 text-green-600" />
                      <span>H2</span>
                    </span>
                    <Badge>{headings.filter(h => h.level === 2).length}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Heading3 className="h-4 w-4 text-purple-600" />
                      <span>H3</span>
                    </span>
                    <Badge>{headings.filter(h => h.level === 3).length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Type className="h-4 w-4 text-gray-600" />
                      <span>Paragraphes</span>
                    </span>
                    <Badge>{paragraphs.length}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Alert className={hierarchyIssues.length === 1 && hierarchyIssues[0] === "La structure hiérarchique est bien organisée" 
              ? "bg-green-50 border-green-200" 
              : "bg-amber-50 border-amber-200"}>
              {hierarchyIssues.length === 1 && hierarchyIssues[0] === "La structure hiérarchique est bien organisée" ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <AlertDescription className={
                hierarchyIssues.length === 1 && hierarchyIssues[0] === "La structure hiérarchique est bien organisée"
                  ? "text-green-800"
                  : "text-amber-800"
              }>
                <ul className="list-none space-y-2">
                  {hierarchyIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>

            {recommendations && recommendations.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  Recommandations SERP
                </h3>
                <ul className="space-y-2">
                  {recommendations.slice(0, 5).map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                      <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {recommendation}
                    </li>
                  ))}
                  {recommendations.length > 5 && (
                    <li className="text-sm text-blue-700 italic">
                      + {recommendations.length - 5} autres recommandations
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-blue-600" />
            Structure SERP Détaillée
          </h3>
          <Card className="bg-white border border-gray-200 p-2">
            <ScrollArea className="h-[400px] rounded-md pr-4">
              <div className="space-y-1 p-2">
                {hierarchy && hierarchy.length > 0 ? (
                  hierarchy.map((item, index) => renderHierarchicalItem(item, index))
                ) : content.length > 0 ? (
                  content.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 py-2 ${getIndentation(item.type)} group hover:bg-gray-50 rounded px-2 transition-colors`}
                    >
                      {getIcon(item.type)}
                      <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className={`text-sm ${item.type === 'text' ? 'text-gray-600' : 'font-medium'}`}>
                        {item.content}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-400 py-16">
                    Aucun contenu structuré à afficher
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default ContentHierarchy;
