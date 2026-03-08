import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, AlertTriangle, CheckCircle2, RefreshCw, Copy, Sparkles, BarChart3, Type, Repeat, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useSubscriptionGeneration';

interface WritingIntelligenceProps {
  chapters?: Chapter[];
  onUpdateChapterContent?: (id: string, content: string) => void;
}

interface TextAnalysis {
  readabilityScore: number;
  avgSentenceLength: number;
  avgWordLength: number;
  passiveVoiceCount: number;
  repetitions: { word: string; count: number }[];
  longSentences: number;
  shortSentences: number;
  paragraphCount: number;
  uniqueWordsRatio: number;
  adverbCount: number;
  fillerWords: { word: string; count: number }[];
  suggestions: string[];
}

const FILLER_WORDS_FR = [
  'vraiment', 'absolument', 'totalement', 'complètement', 'fondamentalement',
  'littéralement', 'certainement', 'évidemment', 'effectivement', 'justement',
  'simplement', 'globalement', 'généralement', 'naturellement', 'clairement',
  'bien sûr', 'en fait', 'en effet', 'de plus', 'par conséquent',
  'il est important de noter', 'il convient de', 'force est de constater',
  'dans un monde où', 'il va sans dire',
];

const PASSIVE_MARKERS_FR = [
  'est considéré', 'a été', 'sera', 'serait', 'est vu', 'est perçu',
  'est reconnu', 'est défini', 'est décrit', 'est présenté',
];

function analyzeText(text: string): TextAnalysis {
  if (!text.trim()) return {
    readabilityScore: 0, avgSentenceLength: 0, avgWordLength: 0,
    passiveVoiceCount: 0, repetitions: [], longSentences: 0, shortSentences: 0,
    paragraphCount: 0, uniqueWordsRatio: 0, adverbCount: 0, fillerWords: [], suggestions: [],
  };

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-zàâäéèêëïîôùûüÿçœæ-]/g, ''));
  
  // Sentence lengths
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgSentLen = sentenceLengths.length > 0 ? sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length : 0;
  const longSents = sentenceLengths.filter(l => l > 30).length;
  const shortSents = sentenceLengths.filter(l => l < 5 && l > 0).length;
  
  // Word analysis
  const avgWordLen = words.length > 0 ? words.reduce((a, w) => a + w.length, 0) / words.length : 0;
  const uniqueWords = new Set(lowerWords.filter(w => w.length > 3));
  const uniqueRatio = words.length > 0 ? uniqueWords.size / words.length : 0;

  // Repetitions (words > 4 chars appearing > 3 times)
  const wordCounts: Record<string, number> = {};
  lowerWords.filter(w => w.length > 4).forEach(w => { wordCounts[w] = (wordCounts[w] || 0) + 1; });
  const repetitions = Object.entries(wordCounts)
    .filter(([, c]) => c > 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  // Passive voice
  const lowerText = text.toLowerCase();
  const passiveCount = PASSIVE_MARKERS_FR.reduce((acc, m) => acc + (lowerText.split(m).length - 1), 0);

  // Adverbs
  const adverbs = lowerWords.filter(w => w.endsWith('ment') && w.length > 6);
  
  // Filler words
  const fillers: { word: string; count: number }[] = [];
  FILLER_WORDS_FR.forEach(f => {
    const count = (lowerText.split(f).length - 1);
    if (count > 0) fillers.push({ word: f, count });
  });
  fillers.sort((a, b) => b.count - a.count);

  // Readability (Flesch-like for French, simplified)
  const syllableCount = words.reduce((acc, w) => acc + Math.max(1, w.replace(/[^aeiouyàâäéèêëïîôùûüÿœæ]/gi, '').length), 0);
  const avgSyllables = words.length > 0 ? syllableCount / words.length : 0;
  const readability = Math.max(0, Math.min(100, 207 - (1.015 * avgSentLen) - (73.6 * avgSyllables)));

  // Suggestions
  const suggestions: string[] = [];
  if (avgSentLen > 25) suggestions.push('📏 Phrases trop longues en moyenne. Visez 15-20 mots par phrase.');
  if (longSents > sentences.length * 0.3) suggestions.push('⚠️ Plus de 30% de phrases longues (>30 mots). Variez les longueurs.');
  if (uniqueRatio < 0.4) suggestions.push('🔄 Vocabulaire répétitif. Utilisez davantage de synonymes.');
  if (passiveCount > sentences.length * 0.2) suggestions.push('🔀 Trop de voix passive. Préférez la voix active.');
  if (adverbs.length > words.length * 0.03) suggestions.push('✂️ Excès d\'adverbes en -ment. Préférez des verbes précis.');
  if (fillers.length > 3) suggestions.push('🚫 Tics de langage IA détectés. Reformulez pour un ton plus naturel.');
  if (paragraphs.length < 3 && words.length > 200) suggestions.push('📝 Ajoutez plus de paragraphes pour aérer le texte.');
  if (readability < 40) suggestions.push('📖 Texte difficile à lire. Simplifiez la structure.');
  if (suggestions.length === 0 && words.length > 50) suggestions.push('✅ Excellent ! Le texte est bien écrit.');

  return {
    readabilityScore: Math.round(readability),
    avgSentenceLength: Math.round(avgSentLen * 10) / 10,
    avgWordLength: Math.round(avgWordLen * 10) / 10,
    passiveVoiceCount: passiveCount,
    repetitions,
    longSentences: longSents,
    shortSentences: shortSents,
    paragraphCount: paragraphs.length,
    uniqueWordsRatio: Math.round(uniqueRatio * 100),
    adverbCount: adverbs.length,
    fillerWords: fillers,
    suggestions,
  };
}

export const EbookWritingIntelligence: React.FC<WritingIntelligenceProps> = ({ chapters, onUpdateChapterContent }) => {
  const [content, setContent] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');

  useEffect(() => {
    if (chapters?.length && !selectedChapterId) {
      const first = chapters[0];
      setSelectedChapterId(first.id);
      setContent(first.content || '');
    }
  }, [chapters]);

  const analysis = useMemo(() => analyzeText(content), [content]);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  const getReadabilityLabel = (score: number) => {
    if (score >= 70) return { label: 'Facile', color: 'text-green-500' };
    if (score >= 50) return { label: 'Moyen', color: 'text-amber-500' };
    return { label: 'Difficile', color: 'text-red-500' };
  };

  const readability = getReadabilityLabel(analysis.readabilityScore);

  const loadChapter = (id: string) => {
    const ch = chapters?.find(c => c.id === id);
    if (ch) { setSelectedChapterId(id); setContent(ch.content || ''); }
  };

  const saveContent = () => {
    if (selectedChapterId && onUpdateChapterContent) {
      onUpdateChapterContent(selectedChapterId, content);
      toast.success('Chapitre sauvegardé');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10"><Brain className="h-6 w-6 text-primary" /></div>
            Assistant d'Écriture Intelligent
            <Badge className="bg-primary/10 text-primary border-primary/30">TEMPS RÉEL</Badge>
          </CardTitle>
          <CardDescription>Analyse de lisibilité, détection de répétitions, suggestions de style — tout en écrivant</CardDescription>
        </CardHeader>
      </Card>

      {/* Chapter selector */}
      {chapters && chapters.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {chapters.map((ch, i) => (
            <Button
              key={ch.id}
              variant={selectedChapterId === ch.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => loadChapter(ch.id)}
            >
              Ch. {i + 1}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez ou collez votre texte ici pour une analyse en temps réel..."
            className="min-h-[500px] font-mono text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{wordCount} mots • {analysis.paragraphCount} paragraphes • ~{Math.ceil(wordCount / 250)} pages</span>
            {onUpdateChapterContent && (
              <Button size="sm" variant="outline" onClick={saveContent}>Sauvegarder</Button>
            )}
          </div>
        </div>

        {/* Analysis panel */}
        <div className="space-y-4">
          {/* Readability score */}
          <Card>
            <CardContent className="pt-4 text-center space-y-3">
              <div className={`text-5xl font-black ${readability.color}`}>{analysis.readabilityScore}</div>
              <p className="text-sm font-medium">Score de lisibilité</p>
              <Badge variant={analysis.readabilityScore >= 50 ? 'default' : 'destructive'}>{readability.label}</Badge>
              <Progress value={analysis.readabilityScore} className="h-2" />
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Métriques</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                { label: 'Moy. mots/phrase', value: analysis.avgSentenceLength, target: '15-20', ok: analysis.avgSentenceLength >= 12 && analysis.avgSentenceLength <= 22 },
                { label: 'Phrases longues (>30)', value: analysis.longSentences, target: '<20%', ok: analysis.longSentences < 5 },
                { label: 'Voix passive', value: analysis.passiveVoiceCount, target: '<10%', ok: analysis.passiveVoiceCount < 5 },
                { label: 'Adverbes (-ment)', value: analysis.adverbCount, target: '<3%', ok: analysis.adverbCount < 10 },
                { label: 'Richesse vocabulaire', value: `${analysis.uniqueWordsRatio}%`, target: '>50%', ok: analysis.uniqueWordsRatio > 45 },
              ].map(({ label, value, target, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{value}</span>
                    {ok ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Filler words */}
          {analysis.fillerWords.length > 0 && (
            <Card className="border-amber-500/30">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Tics de langage ({analysis.fillerWords.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {analysis.fillerWords.map((f, i) => (
                    <Badge key={i} variant="outline" className="text-xs">"{f.word}" ×{f.count}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Repetitions */}
          {analysis.repetitions.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Repeat className="h-4 w-4" /> Mots répétés</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {analysis.repetitions.slice(0, 8).map((r, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{r.word} ×{r.count}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Suggestions</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground">{s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EbookWritingIntelligence;
