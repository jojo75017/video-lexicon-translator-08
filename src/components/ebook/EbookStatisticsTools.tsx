import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, Globe, Volume2, Loader2, BookOpen, Clock, 
  Target, TrendingUp, Languages, Play, Pause, Square
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/hooks/useSubscriptionGeneration';
import EbookNarrativeChecker from './EbookNarrativeChecker';
import { callGemini } from '@/services/geminiService';

interface Character {
  id: string;
  name: string;
  description: string;
}

interface EbookStatisticsToolsProps {
  ebookTitle: string;
  preface: string;
  conclusion: string;
  epilogue?: string;
  chapters: Chapter[];
  characters?: Character[];
  apiKey: string;
  isDemo?: boolean;
  onTranslate?: (translatedData: { preface: string; conclusion: string; epilogue: string; chapters: Chapter[] }) => void;
}

const languages = [
  { value: 'français', label: '🇫🇷 Français' },
  { value: 'anglais', label: '🇬🇧 Anglais' },
  { value: 'espagnol', label: '🇪🇸 Espagnol' },
  { value: 'allemand', label: '🇩🇪 Allemand' },
  { value: 'italien', label: '🇮🇹 Italien' },
  { value: 'portugais', label: '🇵🇹 Portugais' },
  { value: 'néerlandais', label: '🇳🇱 Néerlandais' },
  { value: 'polonais', label: '🇵🇱 Polonais' },
  { value: 'russe', label: '🇷🇺 Russe' },
  { value: 'japonais', label: '🇯🇵 Japonais' },
  { value: 'chinois', label: '🇨🇳 Chinois' },
  { value: 'arabe', label: '🇸🇦 Arabe' },
];

export const EbookStatisticsTools: React.FC<EbookStatisticsToolsProps> = ({
  ebookTitle,
  preface,
  conclusion,
  epilogue,
  chapters,
  characters = [],
  apiKey,
  isDemo = false,
  onTranslate
}) => {
  const [targetLanguage, setTargetLanguage] = useState('anglais');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [selectedChapterForAudio, setSelectedChapterForAudio] = useState<string>('preface');

  // Calcul des statistiques en temps réel
  const statistics = useMemo(() => {
    let totalWords = 0;
    let totalChars = 0;
    let totalSentences = 0;
    let totalParagraphs = 0;

    const countText = (text: string) => {
      if (!text) return;
      const words = text.split(/\s+/).filter(w => w.length > 0);
      totalWords += words.length;
      totalChars += text.length;
      totalSentences += (text.match(/[.!?]+/g) || []).length;
      totalParagraphs += (text.split(/\n\n+/).filter(p => p.trim().length > 0)).length;
    };

    countText(preface);
    countText(conclusion);
    if (epilogue) countText(epilogue);
    
    chapters.forEach(chapter => {
      countText(chapter.content || '');
      chapter.subChapters.forEach(sub => {
        countText(sub.content || '');
      });
    });

    const avgWordsPerSentence = totalSentences > 0 ? Math.round(totalWords / totalSentences) : 0;
    const readingTimeMinutes = Math.ceil(totalWords / 250);
    
    // Estimation des pages (250 mots/page en moyenne)
    const estimatedPages = Math.ceil(totalWords / 250);

    // Score de lisibilité simplifié (basé sur la longueur moyenne des phrases)
    let readabilityLevel = 'Moyen';
    if (avgWordsPerSentence < 12) readabilityLevel = 'Très facile';
    else if (avgWordsPerSentence < 17) readabilityLevel = 'Facile';
    else if (avgWordsPerSentence < 22) readabilityLevel = 'Moyen';
    else if (avgWordsPerSentence < 28) readabilityLevel = 'Difficile';
    else readabilityLevel = 'Très difficile';

    return {
      totalWords,
      totalChars,
      totalSentences,
      totalParagraphs,
      avgWordsPerSentence,
      readingTimeMinutes,
      estimatedPages,
      readabilityLevel,
      chaptersCount: chapters.length,
      subChaptersCount: chapters.reduce((acc, c) => acc + c.subChapters.length, 0)
    };
  }, [preface, conclusion, epilogue, chapters]);

  // Statistiques par chapitre
  const chapterStats = useMemo(() => {
    return chapters.map((chapter, index) => {
      let words = 0;
      if (chapter.content) {
        words += chapter.content.split(/\s+/).filter(w => w.length > 0).length;
      }
      chapter.subChapters.forEach(sub => {
        if (sub.content) {
          words += sub.content.split(/\s+/).filter(w => w.length > 0).length;
        }
      });
      return { 
        title: chapter.title, 
        words, 
        index: index + 1,
        progress: Math.min(100, (words / 2000) * 100) // Objectif 2000 mots par chapitre
      };
    });
  }, [chapters]);

  // Traduction automatique
  const handleTranslate = async () => {
    if (isDemo) {
      toast.error("Fonction réservée aux abonnés", {
        description: "La traduction automatique est désactivée en mode démo.",
      });
      return;
    }

    if (!apiKey) {
      toast.error('Clé API OpenAI requise pour la traduction');
      return;
    }

    setIsTranslating(true);
    setTranslationProgress(0);

    try {
      const translateText = async (text: string) => {
        if (!text) return '';
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { 
                role: 'system', 
                content: `Tu es un traducteur professionnel. Traduis le texte suivant en ${targetLanguage}. Conserve le style, le ton et la mise en forme. Ne fais que traduire.` 
              },
              { role: 'user', content: text }
            ],
            max_tokens: 4000,
          }),
        });

        if (!response.ok) throw new Error('Erreur de traduction');
        const data = await response.json();
        return data.choices[0].message.content;
      };

      // Traduire les sections principales
      const totalItems = 3 + chapters.length + chapters.reduce((acc, c) => acc + c.subChapters.length, 0);
      let completed = 0;

      const translatedPreface = await translateText(preface);
      completed++;
      setTranslationProgress((completed / totalItems) * 100);

      const translatedConclusion = await translateText(conclusion);
      completed++;
      setTranslationProgress((completed / totalItems) * 100);

      const translatedEpilogue = epilogue ? await translateText(epilogue) : '';
      completed++;
      setTranslationProgress((completed / totalItems) * 100);

      // Traduire les chapitres
      const translatedChapters: Chapter[] = [];
      for (const chapter of chapters) {
        const translatedChapter: Chapter = {
          ...chapter,
          title: await translateText(chapter.title),
          content: chapter.content ? await translateText(chapter.content) : '',
          subChapters: []
        };
        completed++;
        setTranslationProgress((completed / totalItems) * 100);

        for (const sub of chapter.subChapters) {
          translatedChapter.subChapters.push({
            ...sub,
            title: await translateText(sub.title),
            content: sub.content ? await translateText(sub.content) : ''
          });
          completed++;
          setTranslationProgress((completed / totalItems) * 100);
        }

        translatedChapters.push(translatedChapter);
      }

      if (onTranslate) {
        onTranslate({
          preface: translatedPreface,
          conclusion: translatedConclusion,
          epilogue: translatedEpilogue,
          chapters: translatedChapters
        });
      }

      toast.success(`Ebook traduit en ${targetLanguage} !`);
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Erreur lors de la traduction');
    } finally {
      setIsTranslating(false);
      setTranslationProgress(0);
    }
  };

  // Text-to-Speech avec OpenAI
  const handleGenerateAudio = async () => {
    if (!apiKey) {
      toast.error('Clé API OpenAI requise pour l\'audio');
      return;
    }

    let textToSpeak = '';
    if (selectedChapterForAudio === 'preface') {
      textToSpeak = preface;
    } else if (selectedChapterForAudio === 'conclusion') {
      textToSpeak = conclusion;
    } else {
      const chapter = chapters.find(c => c.id === selectedChapterForAudio);
      if (chapter) {
        textToSpeak = chapter.content || chapter.subChapters.map(s => s.content).join('\n\n');
      }
    }

    if (!textToSpeak) {
      toast.error('Aucun contenu à lire');
      return;
    }

    // Limiter à 4096 caractères pour l'API OpenAI TTS
    if (textToSpeak.length > 4096) {
      textToSpeak = textToSpeak.substring(0, 4096);
      toast.info('Texte tronqué (limite API)');
    }

    setIsGeneratingAudio(true);

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: textToSpeak,
          voice: 'nova', // Voix française naturelle
          response_format: 'mp3',
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur génération audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      setCurrentAudio(audio);
      audio.play();
      setIsPlayingAudio(true);
      toast.success('Audio généré !');
    } catch (error) {
      console.error('TTS error:', error);
      toast.error('Erreur lors de la génération audio');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleToggleAudio = () => {
    if (currentAudio) {
      if (isPlayingAudio) {
        currentAudio.pause();
        setIsPlayingAudio(false);
      } else {
        currentAudio.play();
        setIsPlayingAudio(true);
      }
    }
  };

  const handleStopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Statistiques de l'Ebook
          </CardTitle>
          <CardDescription>Analyse détaillée de votre contenu en temps réel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-lg">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-violet-500" />
              <div className="text-2xl font-bold">{statistics.totalWords.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Mots</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-cyan-500" />
              <div className="text-2xl font-bold">{statistics.readingTimeMinutes}</div>
              <div className="text-xs text-muted-foreground">Minutes de lecture</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold">{statistics.estimatedPages}</div>
              <div className="text-xs text-muted-foreground">Pages estimées</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
              <div className="text-2xl font-bold">{statistics.readabilityLevel}</div>
              <div className="text-xs text-muted-foreground">Lisibilité</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chapitres:</span>
              <span className="font-medium">{statistics.chaptersCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-chapitres:</span>
              <span className="font-medium">{statistics.subChaptersCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phrases:</span>
              <span className="font-medium">{statistics.totalSentences}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mots/phrase:</span>
              <span className="font-medium">{statistics.avgWordsPerSentence}</span>
            </div>
          </div>

          {/* Progression par chapitre */}
          {chapterStats.length > 0 && (
            <div className="mt-6">
              <Label className="mb-3 block">Progression par chapitre (objectif: 2000 mots)</Label>
              <div className="space-y-3">
                {chapterStats.map((stat) => (
                  <div key={stat.index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="truncate max-w-[200px]">{stat.index}. {stat.title}</span>
                      <span className="text-muted-foreground">{stat.words} mots</span>
                    </div>
                    <Progress value={stat.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Traduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Traduction Automatique
          </CardTitle>
          <CardDescription>Traduisez votre ebook dans une autre langue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Langue cible</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleTranslate}
              disabled={isTranslating || !apiKey}
            >
              {isTranslating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Traduction...
                </>
              ) : (
                <>
                  <Languages className="h-4 w-4 mr-2" />
                  Traduire l'ebook
                </>
              )}
            </Button>
          </div>
          
          {isTranslating && (
            <div className="space-y-2">
              <Progress value={translationProgress} />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(translationProgress)}% complété
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Text-to-Speech */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            Prévisualisation Audio (TTS)
          </CardTitle>
          <CardDescription>Écoutez votre ebook lu par une voix IA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Section à écouter</Label>
              <Select value={selectedChapterForAudio} onValueChange={setSelectedChapterForAudio}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preface">📖 Préface</SelectItem>
                  <SelectItem value="conclusion">📝 Conclusion</SelectItem>
                  {chapters.map((chapter, index) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      📚 {index + 1}. {chapter.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio || !apiKey}
              className="flex-1"
            >
              {isGeneratingAudio ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Générer l'audio
                </>
              )}
            </Button>
            
            {currentAudio && (
              <>
                <Button variant="outline" size="icon" onClick={handleToggleAudio}>
                  {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={handleStopAudio}>
                  <Square className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            ⚠️ L'audio est limité à ~4000 caractères par génération (limite API OpenAI).
          </p>
        </CardContent>
      </Card>

      {/* Narrative Consistency Checker */}
      <EbookNarrativeChecker
        chapters={chapters}
        characters={characters}
        preface={preface}
        conclusion={conclusion}
        title={ebookTitle}
      />
    </div>
  );
};
