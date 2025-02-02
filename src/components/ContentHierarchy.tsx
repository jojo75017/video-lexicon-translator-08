import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from 'react-i18next';
import { ChevronRight, Heading1, Heading2, Heading3, Type } from 'lucide-react';

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

  const content = getAllContent();

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{t('content.hierarchy')}</h2>
      <p className="text-gray-600 mb-6">
        {t('content.hierarchyDescription')}
      </p>

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