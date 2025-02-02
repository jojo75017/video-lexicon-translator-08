import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from 'react-i18next';
import { ChevronRight, Heading1, Heading2, Heading3, Type, AlertCircle, CheckCircle2, BarChart2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

    return issues;
  };

  const extractKeywords = () => {
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

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-blue-600" />
            Analyse de la Structure
          </h2>
          <p className="text-gray-600 text-sm">
            Analyse détaillée de la hiérarchie et du contenu de votre page
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
            {hierarchyIssues.length > 0 ? (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-800">
                  <ul className="list-none space-y-2">
                    {hierarchyIssues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-800">
                  La hiérarchie de votre contenu est bien structurée !
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">Aperçu de la Structure</h3>
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
        </div>
      </div>
    </Card>
  );
};

export default ContentHierarchy;