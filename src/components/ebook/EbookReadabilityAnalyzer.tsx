import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, BookOpen, Type, BarChart3 } from 'lucide-react';
import { Chapter } from '@/hooks/useSubscriptionGeneration';

interface Props {
  chapters: Chapter[];
  preface?: string;
  conclusion?: string;
}

function countSyllablesFr(word: string): number {
  const w = word.toLowerCase().replace(/[^a-zàâäéèêëïîôöùûüçœæ]/g, '');
  if (w.length <= 2) return 1;
  let count = 0;
  const vowels = /[aeiouyàâäéèêëïîôöùûüœæ]/i;
  let prevVowel = false;
  for (const ch of w) {
    if (vowels.test(ch)) {
      if (!prevVowel) count++;
      prevVowel = true;
    } else {
      prevVowel = false;
    }
  }
  // "e" muet en fin de mot
  if (w.endsWith('e') && count > 1) count--;
  if (w.endsWith('es') && count > 1) count--;
  if (w.endsWith('ent') && count > 1) count--;
  return Math.max(1, count);
}

function analyzeText(text: string) {
  if (!text || text.trim().length < 20) return null;

  const sentences = text.split(/[.!?…]+/).filter(s => s.trim().length > 3);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const totalSyllables = words.reduce((sum, w) => sum + countSyllablesFr(w), 0);

  const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
  const avgSyllablesPerWord = words.length > 0 ? totalSyllables / words.length : 0;

  // Flesch-Kincaid adapté français (formule Kandel-Moles)
  const fleschScore = 207 - (1.015 * avgWordsPerSentence) - (73.6 * avgSyllablesPerWord);
  const clampedScore = Math.max(0, Math.min(100, fleschScore));

  // Phrases trop longues (>35 mots)
  const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 35);

  // Détection des répétitions
  const wordFreq: Record<string, number> = {};
  const stopWords = new Set(['le','la','les','de','du','des','un','une','et','en','à','au','aux','il','elle','on','nous','vous','ils','elles','ce','se','ne','pas','que','qui','dans','par','pour','sur','avec','est','sont','a','ont','son','sa','ses','cette','ces','mais','ou','donc','car','si','je','tu','mon','ton','leur','même','aussi','plus','très','bien','fait','être','avoir','tout','tous','comme']);
  words.forEach(w => {
    const lower = w.toLowerCase().replace(/[^a-zàâäéèêëïîôöùûüçœæ]/g, '');
    if (lower.length > 3 && !stopWords.has(lower)) {
      wordFreq[lower] = (wordFreq[lower] || 0) + 1;
    }
  });
  const repetitions = Object.entries(wordFreq)
    .filter(([, count]) => count > 5)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return {
    score: Math.round(clampedScore),
    totalWords: words.length,
    totalSentences: sentences.length,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    longSentences: longSentences.length,
    longSentenceExamples: longSentences.slice(0, 3).map(s => s.trim().substring(0, 100) + '...'),
    repetitions,
  };
}

function getScoreLabel(score: number): { label: string; color: string; desc: string } {
  if (score >= 80) return { label: 'Très facile', color: 'text-green-600', desc: 'Accessible à tous' };
  if (score >= 60) return { label: 'Facile', color: 'text-green-500', desc: 'Lecture fluide' };
  if (score >= 40) return { label: 'Standard', color: 'text-yellow-500', desc: 'Niveau courant' };
  if (score >= 20) return { label: 'Difficile', color: 'text-orange-500', desc: 'Lecteurs avertis' };
  return { label: 'Très difficile', color: 'text-red-500', desc: 'Texte académique' };
}

export const EbookReadabilityAnalyzer: React.FC<Props> = ({ chapters, preface, conclusion }) => {
  const analysis = useMemo(() => {
    let fullText = '';
    if (preface) fullText += preface + '\n\n';
    chapters.forEach(ch => {
      fullText += (ch.content || '') + '\n\n';
      ch.subChapters?.forEach(sc => { fullText += (sc.content || '') + '\n\n'; });
    });
    if (conclusion) fullText += conclusion;
    return analyzeText(fullText);
  }, [chapters, preface, conclusion]);

  if (!analysis) {
    return (
      <Card><CardContent className="pt-6 text-center text-muted-foreground">
        Ajoutez du contenu pour analyser la lisibilité du manuscrit.
      </CardContent></Card>
    );
  }

  const scoreInfo = getScoreLabel(analysis.score);

  return (
    <div className="space-y-4">
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" /> Analyseur de Lisibilité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Score principal */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${scoreInfo.color}`}>{analysis.score}</div>
              <div className="text-xs text-muted-foreground">/ 100</div>
            </div>
            <div className="flex-1">
              <Progress value={analysis.score} className="h-3" />
              <div className="flex justify-between mt-1">
                <span className={`text-sm font-medium ${scoreInfo.color}`}>{scoreInfo.label}</span>
                <span className="text-xs text-muted-foreground">{scoreInfo.desc}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">{analysis.totalWords.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Mots</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">{analysis.totalSentences}</div>
              <div className="text-xs text-muted-foreground">Phrases</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">{analysis.avgWordsPerSentence}</div>
              <div className="text-xs text-muted-foreground">Mots/phrase</div>
            </div>
          </div>

          {/* Phrases longues */}
          {analysis.longSentences > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-sm">{analysis.longSentences} phrase{analysis.longSentences > 1 ? 's' : ''} trop longue{analysis.longSentences > 1 ? 's' : ''} (&gt;35 mots)</span>
              </div>
              {analysis.longSentenceExamples.map((ex, i) => (
                <p key={i} className="text-xs text-orange-700 italic mt-1">« {ex} »</p>
              ))}
            </div>
          )}

          {analysis.longSentences === 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-700">Aucune phrase trop longue détectée ✓</span>
            </div>
          )}

          {/* Répétitions */}
          {analysis.repetitions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Mots les plus répétés</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.repetitions.map(([word, count]) => (
                  <Badge key={word} variant={count > 15 ? 'destructive' : 'secondary'} className="text-xs">
                    {word} ×{count}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookReadabilityAnalyzer;
