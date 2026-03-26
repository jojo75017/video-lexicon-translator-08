import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Monitor, ChevronLeft, ChevronRight, Type, BookOpen } from 'lucide-react';
import { Chapter } from '@/hooks/useSubscriptionGeneration';
import { cleanGeneratedText } from '@/utils/textCleaner';

interface Props {
  title: string;
  authorName: string;
  chapters: Chapter[];
  preface?: string;
  conclusion?: string;
}

export const EbookKindlePreview: React.FC<Props> = ({ title, authorName, chapters, preface, conclusion }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState([16]);

  const pages = useMemo(() => {
    const result: { type: string; title?: string; content?: string }[] = [];
    // Cover
    result.push({ type: 'cover', title, content: authorName });
    // Preface
    if (preface) result.push({ type: 'chapter', title: 'Préface', content: cleanGeneratedText(preface) });
    // Chapters
    chapters.forEach((ch, i) => {
      let content = cleanGeneratedText(ch.content || '');
      ch.subChapters?.forEach(sc => {
        if (sc.content) content += `\n\n${sc.title}\n\n${cleanGeneratedText(sc.content)}`;
      });
      result.push({ type: 'chapter', title: `Chapitre ${i + 1} — ${ch.title}`, content });
    });
    // Conclusion
    if (conclusion) result.push({ type: 'chapter', title: 'Conclusion', content: cleanGeneratedText(conclusion) });
    return result;
  }, [title, authorName, chapters, preface, conclusion]);

  const page = pages[currentPage] || pages[0];

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Monitor className="h-5 w-5 text-primary" /> Prévisualisation Kindle
          <Badge variant="secondary" className="text-xs">PREVIEW</Badge>
        </CardTitle>
        <div className="flex items-center gap-3">
          <Type className="h-4 w-4 text-muted-foreground" />
          <Slider value={fontSize} onValueChange={setFontSize} min={12} max={24} step={1} className="w-32" />
          <span className="text-xs text-muted-foreground">{fontSize[0]}px</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Kindle device frame */}
        <div className="mx-auto max-w-[400px]">
          <div className="bg-[#1a1a1a] rounded-2xl p-3 shadow-2xl">
            {/* Screen */}
            <div
              className="bg-[#f5f1e8] rounded-lg overflow-hidden"
              style={{ minHeight: '520px', maxHeight: '520px', fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {/* Status bar */}
              <div className="flex justify-between items-center px-3 py-1 bg-[#e8e4db] text-[10px] text-[#666]">
                <span>{title}</span>
                <span>{currentPage + 1} / {pages.length}</span>
              </div>

              {/* Content */}
              <div className="p-5 overflow-y-auto" style={{ maxHeight: '480px', fontSize: `${fontSize[0]}px` }}>
                {page.type === 'cover' ? (
                  <div className="flex flex-col items-center justify-center" style={{ minHeight: '440px' }}>
                    <h1 className="text-center font-bold text-[#2c2c2c] mb-4" style={{ fontSize: `${fontSize[0] * 1.8}px`, lineHeight: 1.2 }}>
                      {page.title}
                    </h1>
                    <div className="w-16 h-px bg-[#999] my-4" />
                    <p className="text-center italic text-[#555]" style={{ fontSize: `${fontSize[0] * 1.1}px` }}>
                      {page.content}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="font-bold text-[#2c2c2c] mb-4 text-center" style={{ fontSize: `${fontSize[0] * 1.3}px` }}>
                      {page.title}
                    </h2>
                    <div className="text-[#333] leading-relaxed" style={{ textAlign: 'justify', textIndent: '1.5em', lineHeight: 1.8 }}>
                      {(page.content || '').split('\n\n').map((p, i) => (
                        <p key={i} className="mb-3" style={{ textIndent: i > 0 ? '1.5em' : '0' }}>{p}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-3">
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
            </Button>
            <span className="text-xs text-muted-foreground">{currentPage + 1} / {pages.length}</span>
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))} disabled={currentPage >= pages.length - 1}>
              Suivant <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EbookKindlePreview;
