import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3 } from 'lucide-react';
import { Chapter } from '@/hooks/useSubscriptionGeneration';

interface Props {
  chapters: Chapter[];
  targetWordsPerChapter?: number;
}

export const EbookChapterWordCount: React.FC<Props> = ({ chapters, targetWordsPerChapter = 2500 }) => {
  const data = useMemo(() => {
    return chapters.map((ch, i) => {
      let words = (ch.content || '').split(/\s+/).filter(Boolean).length;
      ch.subChapters?.forEach(sc => {
        words += (sc.content || '').split(/\s+/).filter(Boolean).length;
      });
      return { index: i + 1, title: ch.title || `Chapitre ${i + 1}`, words };
    });
  }, [chapters]);

  const maxWords = Math.max(...data.map(d => d.words), targetWordsPerChapter);
  const totalWords = data.reduce((s, d) => s + d.words, 0);
  const avgWords = data.length > 0 ? Math.round(totalWords / data.length) : 0;

  if (data.length === 0) {
    return (
      <Card><CardContent className="pt-6 text-center text-muted-foreground">
        Aucun chapitre à analyser.
      </CardContent></Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" /> Répartition des mots par chapitre
        </CardTitle>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total : <strong className="text-foreground">{totalWords.toLocaleString()}</strong> mots</span>
          <span>Moyenne : <strong className="text-foreground">{avgWords.toLocaleString()}</strong> mots/chapitre</span>
          <span>Cible : <strong className="text-foreground">{targetWordsPerChapter.toLocaleString()}</strong></span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map(d => {
          const pct = maxWords > 0 ? (d.words / maxWords) * 100 : 0;
          const ratio = targetWordsPerChapter > 0 ? d.words / targetWordsPerChapter : 0;
          const color = ratio >= 0.9 ? 'bg-green-500' : ratio >= 0.5 ? 'bg-yellow-500' : 'bg-red-400';
          const textColor = ratio >= 0.9 ? 'text-green-600' : ratio >= 0.5 ? 'text-yellow-600' : 'text-red-500';

          return (
            <div key={d.index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="truncate max-w-[200px] font-medium">Ch.{d.index} — {d.title}</span>
                <span className={`font-mono text-xs ${textColor}`}>
                  {d.words.toLocaleString()} / {targetWordsPerChapter.toLocaleString()}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default EbookChapterWordCount;
