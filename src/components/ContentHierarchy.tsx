import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from 'react-i18next';
import { ChevronRight, Heading1, Heading2, Heading3, Type, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
}

const ContentHierarchy = ({ headings, paragraphs }: ContentHierarchyProps) => {
  const { t } = useTranslation();

  const getAllContent = (): ContentItem[] => {
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
    const h1Count = headings.filter(h => h.level === 1).length;
    const issues = [];

    if (h1Count === 0) {
      issues.push("Aucun titre H1 trouvé - chaque page devrait avoir un H1");
    } else if (h1Count > 1) {
      issues.push("Plusieurs titres H1 détectés - il ne devrait y en avoir qu'un seul");
    }

    const h2BeforeH1 = headings.some((h, i) => {
      const prevH1 = headings.slice(0, i).find(prev => prev.level === 1);
      return h.level === 2 && !prevH1;
    });

    if (h2BeforeH1) {
      issues.push("Des titres H2 apparaissent avant le premier H1");
    }

    const h3BeforeH2 = headings.some((h, i) => {
      const prevH2 = headings.slice(0, i).find(prev => prev.level === 2);
      return h.level === 3 && !prevH2;
    });

    if (h3BeforeH2) {
      issues.push("Des titres H3 apparaissent avant le premier H2");
    }

    return issues;
  };

  const content = getAllContent();
  const hierarchyIssues = analyzeHierarchy();

  // Extraction des mots-clés potentiels (mots qui apparaissent fréquemment)
  const extractKeywords = () => {
    const allText = content.map(item => item.content).join(' ').toLowerCase();
    const words = allText.split(/\s+/);
    const wordCount: { [key: string]: number } = {};
    
    const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'mais', 'donc', 'car', 'de', 'à', 'en', 'dans'];
    
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

  const keywords = extractKeywords();

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{t('content.hierarchy')}</h2>
      <p className="text-gray-600 mb-6">
        {t('content.hierarchyDescription')}
      </p>

      {hierarchyIssues.length > 0 && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-800">
            <ul className="list-disc pl-4">
              {hierarchyIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {hierarchyIssues.length === 0 && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800">
            La hiérarchie de votre contenu est bien structurée !
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Mots-clés principaux</h3>
        <div className="flex flex-wrap gap-2">
          {keywords.map(({ word, count }, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {word} ({count})
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heading1 className="h-4 w-4 text-blue-600" />
              <span className="text-sm">H1: {headings.filter(h => h.level === 1).length}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Heading2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">H2: {headings.filter(h => h.level === 2).length}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heading3 className="h-4 w-4 text-purple-600" />
              <span className="text-sm">H3: {headings.filter(h => h.level === 3).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-gray-600" />
              <span className="text-sm">{t('content.paragraphs')}: {paragraphs.length}</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {content.map((item, index) => (
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
        ))}
      </ScrollArea>
    </Card>
  );
};

export default ContentHierarchy;