import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Copy, AlertTriangle, SpellCheck, BookOpen } from 'lucide-react';

interface Correction {
  type: string;
  original: string;
  corrige: string;
  explication: string;
}

interface ProofreadResult {
  texteCorrige: string;
  corrections: Correction[];
  nombreCorrections: number;
  qualiteOrthographe: number;
}

interface EbookStrictProofreaderProps {
  chapters?: Array<{ title?: string; content?: string; subChapters?: Array<{ title?: string; content?: string }> }>;
  onApplyCorrections?: (chapterIndex: number, correctedContent: string) => void;
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  orthographe: { label: 'Orthographe', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  grammaire: { label: 'Grammaire', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  accord: { label: 'Accord', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
  ponctuation: { label: 'Ponctuation', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  anglicisme: { label: 'Anglicisme', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  temps: { label: 'Temps', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
  repetition: { label: 'Répétition', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
};

export default function EbookStrictProofreader({ chapters = [], onApplyCorrections }: EbookStrictProofreaderProps) {
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProofreadResult | null>(null);
  const [copied, setCopied] = useState(false);

  const loadChapter = (index: number) => {
    const ch = chapters[index];
    if (!ch) return;
    setSelectedChapterIndex(index);
    setChapterTitle(ch.title || `Chapitre ${index + 1}`);
    // Combine chapter + subchapters content
    let fullContent = ch.content || '';
    if (ch.subChapters) {
      for (const sub of ch.subChapters) {
        if (sub.content) {
          fullContent += `\n\n### ${sub.title || 'Sous-chapitre'}\n\n${sub.content}`;
        }
      }
    }
    setChapterContent(fullContent);
    setResult(null);
  };

  const handleProofread = async () => {
    if (!chapterContent || chapterContent.length < 20) {
      toast.error('Le texte doit contenir au moins 20 caractères.');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('strict-proofread', {
        body: { chapterTitle, chapterContent }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      toast.success(`Correction terminée : ${data.nombreCorrections || 0} corrections trouvées`);
    } catch (err: any) {
      console.error('Proofread error:', err);
      toast.error(err.message || 'Erreur lors de la correction');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.texteCorrige) return;
    await navigator.clipboard.writeText(result.texteCorrige);
    setCopied(true);
    toast.success('Texte corrigé copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (!result?.texteCorrige || selectedChapterIndex === null || !onApplyCorrections) return;
    onApplyCorrections(selectedChapterIndex, result.texteCorrige);
    toast.success('Corrections appliquées au chapitre !');
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <SpellCheck className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">Correcteur Éditorial Strict</CardTitle>
              <CardDescription>
                Correction orthographique, grammaticale et typographique — sans aucune réécriture. 
                Le style de l'auteur est préservé intégralement.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chapter selector */}
      {chapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Sélectionner un chapitre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {chapters.map((ch, i) => (
                <Button
                  key={i}
                  variant={selectedChapterIndex === i ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => loadChapter(i)}
                >
                  {ch.title || `Chapitre ${i + 1}`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Texte à corriger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Titre du chapitre (optionnel)"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />
          <Textarea
            placeholder="Collez ou sélectionnez le texte du chapitre à corriger..."
            value={chapterContent}
            onChange={(e) => setChapterContent(e.target.value)}
            rows={12}
            className="font-serif text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {chapterContent.split(/\s+/).filter(Boolean).length} mots
            </span>
            <Button
              onClick={handleProofread}
              disabled={isProcessing || chapterContent.length < 20}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Correction en cours...
                </>
              ) : (
                <>
                  <SpellCheck className="h-4 w-4 mr-2" />
                  Corriger ce chapitre
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          {/* Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Qualité orthographique</span>
                <span className={`text-2xl font-bold ${getScoreColor(result.qualiteOrthographe)}`}>
                  {result.qualiteOrthographe}/100
                </span>
              </div>
              <Progress value={result.qualiteOrthographe} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {result.nombreCorrections} correction{result.nombreCorrections > 1 ? 's' : ''} effectuée{result.nombreCorrections > 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          {/* Corrections list */}
          {result.corrections && result.corrections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Corrections effectuées ({result.corrections.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="space-y-3">
                    {result.corrections.map((c, i) => {
                      const typeInfo = TYPE_LABELS[c.type] || { label: c.type, color: 'bg-muted text-muted-foreground' };
                      return (
                        <div key={i} className="p-3 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={typeInfo.color} variant="secondary">
                              {typeInfo.label}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground text-xs">Original :</span>
                              <p className="line-through text-red-600 dark:text-red-400">{c.original}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-xs">Corrigé :</span>
                              <p className="text-green-600 dark:text-green-400 font-medium">{c.corrige}</p>
                            </div>
                          </div>
                          {c.explication && (
                            <p className="text-xs text-muted-foreground mt-1 italic">{c.explication}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {result.corrections?.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="font-medium text-green-700 dark:text-green-400">Aucune correction nécessaire !</p>
                <p className="text-sm text-muted-foreground">Le texte est prêt pour publication.</p>
              </CardContent>
            </Card>
          )}

          {/* Corrected text */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Texte corrigé</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-1" />
                    {copied ? 'Copié !' : 'Copier'}
                  </Button>
                  {onApplyCorrections && selectedChapterIndex !== null && (
                    <Button size="sm" onClick={handleApply}>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Appliquer au chapitre
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[500px] overflow-y-auto">
                <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed p-4 bg-muted/30 rounded-lg">
                  {result.texteCorrige}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
