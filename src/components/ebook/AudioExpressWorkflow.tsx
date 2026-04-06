import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Target, ListOrdered, PenTool, Sparkles, Clock, Mic2,
  Volume2, Combine, Archive, ChevronRight, ChevronLeft,
  CheckCircle2, Lock, Loader2, Headphones, Download, Play, Pause, Music, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { cleanForAudio } from '@/utils/textCleaner';
import { generateIntroForExport } from '@/utils/audioIntroGenerator';
import { supabase } from '@/integrations/supabase/client';
import { combineMp3Blobs, requestTtsAudioChunks } from '@/utils/ttsRequest';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

// --- Constants ---

interface AudioExpressStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  estimatedMinutes: number;
}

const AUDIO_STEPS: AudioExpressStep[] = [
  { id: 'A1', label: 'Brief Directeur', description: 'Titre, auteur, catégorie, introduction et contenu des chapitres', icon: Target, estimatedMinutes: 3 },
  { id: 'A2', label: 'Structure Audible', description: 'Plan optimisé pour l\'écoute (chapitres courts, transitions)', icon: ListOrdered, estimatedMinutes: 5 },
  { id: 'A3', label: 'Rédaction Voix Haute', description: 'Phrases courtes, ton amical et conversationnel', icon: PenTool, estimatedMinutes: 15 },
  { id: 'A4', label: 'Nettoyage & Polissage', description: 'Retrait des astérisques, markdown et défauts', icon: Sparkles, estimatedMinutes: 2 },
  { id: 'A5', label: 'Script de Ponctuation', description: 'Insertion de pauses naturelles (virgules, points)', icon: Clock, estimatedMinutes: 3 },
  { id: 'A6', label: 'Casting Vocal', description: 'Choix de l\'avatar Azure : Denise, Henri, etc.', icon: Mic2, estimatedMinutes: 2 },
  { id: 'A7', label: 'Production Audio', description: 'Synthèse vocale par chapitre via Azure Neural', icon: Volume2, estimatedMinutes: 10 },
  { id: 'A8', label: 'Fusion Master', description: 'Assemblage Intro + Chapitres + Outro en 1 MP3', icon: Combine, estimatedMinutes: 5 },
  { id: 'A9', label: 'Archivage & Export', description: 'Sauvegarde en bibliothèque et téléchargement final', icon: Archive, estimatedMinutes: 2 },
];

const CATEGORIES = [
  { value: 'enfants-3-8', label: '👶 Enfants 3-8 ans', voiceId: 'FGY2WhTYpPnrIDTdsKH5', voiceName: 'Laura' },
  { value: 'ados-12-16', label: '🧒 Ados 12-16 ans', voiceId: 'XrExE9yKIg1WjnnlVkGX', voiceName: 'Matilda' },
  { value: 'thriller', label: '🔪 Thriller', voiceId: 'onwK4e9ZLuTAKqWW03F9', voiceName: 'Daniel' },
  { value: 'romance', label: '💕 Romance', voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Sarah' },
  { value: 'saga', label: '📖 Saga', voiceId: 'N2lVS1w4EtoT3dr4eOWO', voiceName: 'Callum' },
  { value: 'spiritualite', label: '🧘 Spiritualité', voiceId: 'Xb7hH8MSUJpSbSDYk0k2', voiceName: 'Alice' },
  { value: 'marketing', label: '💼 Marketing', voiceId: 'cjVigY5qzO86Huf0OWal', voiceName: 'Eric' },
];

const AZURE_VOICES = [
  { id: 'fr-FR-EloiseNeural', label: '👶 Eloise (Enfants 3-6)', niche: 'enfants' },
  { id: 'fr-FR-BrigitteNeural', label: '🧒 Brigitte (Enfants 6-12)', niche: 'jeunesse' },
  { id: 'fr-FR-HenriNeural', label: '🔪 Henri (Thriller)', niche: 'thriller' },
  { id: 'fr-FR-DeniseNeural', label: '💕 Denise (Romance)', niche: 'romance' },
  { id: 'fr-FR-AlainNeural', label: '🧘 Alain (Spiritualité)', niche: 'spiritualite' },
  { id: 'fr-FR-JeromeNeural', label: '💼 Jérôme (Business)', niche: 'business' },
  { id: 'fr-FR-CelesteNeural', label: '📚 Céleste (Histoire)', niche: 'histoire' },
];

const serializeProjectChapters = (chapterList: any[] = []) => {
  const sections: string[] = [];

  chapterList.forEach((chapter: any, chapterIndex: number) => {
    sections.push(`Chapitre ${chapterIndex + 1}: ${chapter.title || `Chapitre ${chapterIndex + 1}`}`);

    if (typeof chapter.content === 'string' && chapter.content.trim()) {
      sections.push(chapter.content.trim());
    }

    const subChapters = chapter.subChapters || chapter.subchapters || [];
    subChapters.forEach((subChapter: any, subIndex: number) => {
      if (typeof subChapter.title === 'string' && subChapter.title.trim()) {
        sections.push(subChapter.title.trim());
      } else {
        sections.push(`Sous-chapitre ${chapterIndex + 1}.${subIndex + 1}`);
      }

      if (typeof subChapter.content === 'string' && subChapter.content.trim()) {
        sections.push(subChapter.content.trim());
      }
    });
  });

  return sections.join('\n\n').trim();
};

// --- Component ---

interface AudioExpressWorkflowProps {
  ebookTitle?: string;
  chapters?: any[];
  preface?: string;
  conclusion?: string;
  authorName?: string;
  onNavigateToAudio?: () => void;
}

export const AudioExpressWorkflow: React.FC<AudioExpressWorkflowProps> = ({
  ebookTitle = '',
  chapters = [],
  preface = '',
  conclusion = '',
  authorName: propAuthorName = '',
  onNavigateToAudio,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepResults, setStepResults] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // A1 — Brief Directeur
  const [bookTitle, setBookTitle] = useState(ebookTitle || '');
  const [bookSubtitle, setBookSubtitle] = useState('');
  const [authorNameState, setAuthorNameState] = useState(propAuthorName || '');
  const [category, setCategory] = useState('enfants-3-8');
  const [introduction, setIntroduction] = useState(preface || '');

  // Update intro when title changes (only if user hasn't manually edited)
  const [introManuallyEdited, setIntroManuallyEdited] = useState(false);
  // No auto-generated intro text — introduction field holds the real preface
  const [chapterContent, setChapterContent] = useState('');

  const projectChapterText = useMemo(() => serializeProjectChapters(chapters), [chapters]);
  const displayedChapterContent = chapterContent || projectChapterText;
  const effectiveChapterContent = chapterContent.trim() ? chapterContent : projectChapterText;
  const availableChapterWordCount = useMemo(
    () => effectiveChapterContent.split(/\s+/).filter(Boolean).length,
    [effectiveChapterContent]
  );

  // A4 cleaned text
  const [cleanedText, setCleanedText] = useState('');

  // A6 voice — auto-mapped from category
  const [selectedVoice, setSelectedVoice] = useState('fr-FR-EloiseNeural');

  // MP3 generation state
  const [introBlob, setIntroBlob] = useState<Blob | null>(null);
  const [fullBlob, setFullBlob] = useState<Blob | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationLabel, setGenerationLabel] = useState('');
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [playingType, setPlayingType] = useState<'intro' | 'full' | null>(null);

  // Sync voice when category changes
  useEffect(() => {
    const cat = CATEGORIES.find(c => c.value === category);
    if (cat) setSelectedVoice(cat.voiceId);
  }, [category]);

  // Sync props
  useEffect(() => { if (ebookTitle) setBookTitle(ebookTitle); }, [ebookTitle]);
  useEffect(() => { if (propAuthorName) setAuthorNameState(propAuthorName); }, [propAuthorName]);
  useEffect(() => { if (preface) setIntroduction(preface); }, [preface]);

  const completedSteps = Object.keys(stepResults).length;
  const progressPercent = (completedSteps / AUDIO_STEPS.length) * 100;

  const getBriefData = () => stepResults['A1'] || {};

  const markStepDone = (stepId: string, result: any = true) => {
    setStepResults(prev => ({ ...prev, [stepId]: result }));
    toast.success(`✅ ${stepId} terminé`);
  };

  const isStepCompleted = (idx: number) => !!stepResults[AUDIO_STEPS[idx].id];
  const canGoToStep = (idx: number) => idx === 0 || isStepCompleted(idx - 1);

  // A1 validation → auto-advance to A2
  const handleValidateBrief = () => {
    const briefData = {
      bookTitle,
      bookSubtitle,
      authorName: authorNameState,
      category,
      introduction,
      chapterContent: effectiveChapterContent,
    };
    markStepDone('A1', briefData);
    // Auto-advance
    setTimeout(() => setCurrentStep(1), 400);
  };

  // A4: Auto-clean text
  const handleCleanText = useCallback(() => {
    setIsProcessing(true);
    const brief = getBriefData();
    let fullText = '';
    if (brief.introduction) fullText += brief.introduction + '\n\n';

    const sourceChapterText = brief.chapterContent || effectiveChapterContent;
    if (sourceChapterText) {
      fullText += sourceChapterText;
    } else {
      chapters.forEach((ch: any, i: number) => {
        fullText += `Chapitre ${i + 1}: ${ch.title || ''}\n\n${ch.content || ''}\n\n`;
        const subs = ch.subChapters || ch.subchapters || [];
        subs.forEach((s: any) => { fullText += `${s.title || ''}\n\n${s.content || ''}\n\n`; });
      });
    }

    if (conclusion) fullText += conclusion;
    const cleaned = cleanForAudio(fullText);
    setCleanedText(cleaned);
    setIsProcessing(false);
    markStepDone('A4', cleaned);
  }, [chapters, conclusion, effectiveChapterContent, stepResults]);

  // TTS generation via edge function
  const generateTts = async (text: string): Promise<Blob | null> => {
    const { audioBlobs, errors } = await requestTtsAudioChunks({
      text,
      niche: category,
      maxFailures: 2,
    });

    if (errors.length > 0) {
      console.warn('AudioExpress partial TTS generation:', errors);
    }

    return combineMp3Blobs(audioBlobs);
  };

  // Split text into chapters
  const splitIntoChapters = (text: string): { title: string; content: string }[] => {
    // Match "Chapitre N", "Épisode N", "Episode N", "Partie N", "Section N"
    const chapterRegex = /(?:^|\n)((?:Chapitre|[ÉE]pisode|Partie|Section)\s+\d+[^\n]*)/gi;
    const matches = [...text.matchAll(chapterRegex)];
    if (matches.length >= 2) {
      const chapters: { title: string; content: string }[] = [];
      for (let i = 0; i < matches.length; i++) {
        const startIdx = matches[i].index!;
        const endIdx = i + 1 < matches.length ? matches[i + 1].index! : text.length;
        chapters.push({ title: matches[i][1].trim(), content: text.substring(startIdx, endIdx).trim() });
      }
      return chapters;
    }
    // Fallback: split by paragraphs with smaller chunk size to preserve more sections
    const sections: { title: string; content: string }[] = [];
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
    let currentContent = '';
    let sectionIndex = 1;
    for (const para of paragraphs) {
      if (currentContent.length + para.length > 2000 && currentContent.length > 200) {
        sections.push({ title: `Section ${sectionIndex}`, content: currentContent.trim() });
        currentContent = para;
        sectionIndex++;
      } else {
        currentContent += '\n\n' + para;
      }
    }
    if (currentContent.trim()) sections.push({ title: `Section ${sectionIndex}`, content: currentContent.trim() });
    return sections.length > 0 ? sections : [{ title: 'Livre complet', content: text }];
  };

  // A7: Generate full audiobook (intro + chapters) as MP3
  const handleGenerateAudio = async () => {
    const brief = getBriefData();
    const textToConvert = cleanedText || brief.chapterContent || effectiveChapterContent;
    if (!textToConvert?.trim()) {
      toast.error('Aucun texte à convertir. Complétez les étapes précédentes.');
      return;
    }
    setIsGeneratingAudio(true);
    setGenerationProgress(0);
    try {
      const zip = new JSZip();
      const allMp3Blobs: Blob[] = [];

      // Intro MP3 — "{Titre}, par {Auteur}."
      setGenerationLabel('🎵 Génération de l\'intro...');
      setGenerationProgress(5);
      const introBlobs = await generateIntroForExport(
        generateTts, brief.bookTitle || bookTitle, brief.authorName || authorNameState
      );
      if (introBlobs.length > 0) {
        const iBlob = new Blob(introBlobs, { type: 'audio/mpeg' });
        zip.file('00-Intro.mp3', iBlob);
        setIntroBlob(iBlob);
        allMp3Blobs.push(iBlob);
      }

      // Préface / Introduction (texte réel, lu en entier)
      const prefaceText = (brief.introduction || introduction || '').trim();
      if (prefaceText && prefaceText.length > 20) {
        setGenerationLabel('📖 Génération de la préface...');
        setGenerationProgress(8);
        try {
          const prefaceResult = await requestTtsAudioChunks({ text: prefaceText, voiceName: selectedVoice });
          if (prefaceResult.audioBlobs.length > 0) {
            const prefaceBlob = combineMp3Blobs(prefaceResult.audioBlobs);
            zip.file('01-Preface.mp3', prefaceBlob);
            allMp3Blobs.push(prefaceBlob);
          }
        } catch (e: any) {
          console.warn('Préface audio failed:', e.message);
          toast.error(`⚠️ Préface non générée : ${e.message}`);
        }
      }

      // Chapters
      const chaps = splitIntoChapters(textToConvert);
      
      let chaptersGenerated = 0;
      for (let i = 0; i < chaps.length; i++) {
        const chapContent = chaps[i].content?.trim();
        if (!chapContent || chapContent.length < 10) {
          console.warn(`Chapitre ${i + 1} ignoré (contenu vide ou trop court)`);
          continue;
        }
        setGenerationLabel(`📖 ${i + 1}/${chaps.length} — ${chaps[i].title}`);
        setGenerationProgress(Math.round(10 + ((i) / chaps.length) * 80));
        try {
          const blob = await generateTts(chapContent);
          if (blob && blob.size > 100) {
            const fname = `${String(i + 1).padStart(2, '0')}-${chaps[i].title.replace(/[^a-zA-Z0-9àâéèêëïîôùûüç\s-]/gi, '').replace(/\s+/g, '-').substring(0, 60)}.mp3`;
            zip.file(fname, blob);
            allMp3Blobs.push(blob);
            chaptersGenerated++;
          } else {
            console.warn(`Chapitre ${i + 1}: blob vide ou trop petit`);
            toast.error(`⚠️ Chapitre ${i + 1} "${chaps[i].title}" : audio non généré`);
          }
        } catch (chapterError: any) {
          console.error(`Erreur chapitre ${i + 1}:`, chapterError);
          toast.error(`⚠️ Chapitre ${i + 1} "${chaps[i].title}" : ${chapterError.message}`);
        }
      }

      if (chaptersGenerated === 0) {
        toast.error('❌ Aucun chapitre n\'a pu être converti en audio. Vérifiez le contenu texte.');
        return;
      }

      // ZIP download
      setGenerationLabel('📦 Création du ZIP...');
      setGenerationProgress(95);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `audiobook-${(brief.bookTitle || bookTitle).replace(/\s+/g, '-')}.zip`);

      // Merge all blobs (intro + chapters) for full preview and library
      if (allMp3Blobs.length > 0) {
        const mergedBlob = new Blob(allMp3Blobs, { type: 'audio/mpeg' });
        setFullBlob(mergedBlob);
        console.log(`Full audiobook: ${allMp3Blobs.length} segments, ${mergedBlob.size} bytes, ${chaptersGenerated} chapitres`);
        await saveToLibrary(mergedBlob, brief.bookTitle || bookTitle, brief.authorName || authorNameState);
      }

      markStepDone('A7');
      markStepDone('A8');
      toast.success(`🎉 Audiobook généré ! ${chaps.length + 1} fichiers MP3`);
      setTimeout(() => setCurrentStep(8), 500);
    } catch (error: any) {
      console.error('Audio generation error:', error);
      toast.error(`Erreur : ${error.message}`);
    } finally {
      setIsGeneratingAudio(false);
      setGenerationProgress(0);
      setGenerationLabel('');
    }
  };

  // Save to library
  const saveToLibrary = async (audioBlob: Blob, titleStr: string, authorStr: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;
      const safeName = titleStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 80);
      const fileName = `${userId}/${Date.now()}-${safeName}.mp3`;
      const { error: uploadError } = await supabase.storage.from('audiobooks').upload(fileName, audioBlob, { contentType: 'audio/mpeg' });
      if (uploadError) { console.error('Upload error:', uploadError); return; }
      const { data: urlData } = supabase.storage.from('audiobooks').getPublicUrl(fileName);
      const wordCount = (cleanedText || chapterContent).split(/\s+/).filter(w => w).length;
      await supabase.from('audiobooks').insert({
        user_id: userId, title: titleStr.trim(), author_name: authorStr || null,
        description: introduction || null, audio_url: urlData.publicUrl,
        voice_name: CATEGORIES.find(c => c.value === category)?.voiceName || 'Auto',
        duration_seconds: Math.round((wordCount / 150) * 60), status: 'published', is_public: false,
      });
      toast.success('💾 Sauvegardé dans Mes Livres Audio');
    } catch (e) { console.error('saveToLibrary error:', e); }
  };

  // Play/pause preview
  const togglePlay = (type: 'intro' | 'full') => {
    const blob = type === 'intro' ? introBlob : fullBlob;
    if (!blob) return;
    if (playingType === type && audioRef.current) {
      audioRef.current.pause(); audioRef.current = null; setPlayingType(null); return;
    }
    if (audioRef.current) audioRef.current.pause();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => { setPlayingType(null); URL.revokeObjectURL(url); };
    audio.play(); audioRef.current = audio; setPlayingType(type);
  };

  // Download MP3 blob
  const handleDownloadIntro = () => {
    if (introBlob) {
      saveAs(introBlob, `${(bookTitle || 'livre-audio').replace(/\s+/g, '-')}-intro.mp3`);
      toast.success('📥 Intro MP3 téléchargée');
    } else {
      toast.info('Générez d\'abord l\'audio à l\'étape A7');
    }
  };

  const handleDownloadFullExport = () => {
    if (fullBlob) {
      saveAs(fullBlob, `${(bookTitle || 'livre-audio').replace(/\s+/g, '-')}-complet.mp3`);
      toast.success('📥 Livre complet MP3 téléchargé');
    } else {
      toast.info('Générez d\'abord l\'audio à l\'étape A7');
    }
  };

  const renderStepContent = (idx: number) => {
    const step = AUDIO_STEPS[idx];
    const brief = getBriefData();

    switch (step.id) {
      case 'A1':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>📕 Titre du Livre</Label>
                <Input value={bookTitle} onChange={e => setBookTitle(e.target.value)} placeholder="Ex: Le Village Irrésistible" />
              </div>
              <div className="space-y-2">
                <Label>📝 Sous-titre</Label>
                <Input value={bookSubtitle} onChange={e => setBookSubtitle(e.target.value)} placeholder="Ex: Aventure gauloise drôle" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>✍️ Auteur</Label>
                <Input value={authorNameState} onChange={e => setAuthorNameState(e.target.value)} placeholder="Ex: Georges" />
              </div>
              <div className="space-y-2">
                <Label>🎯 Catégorie / Public</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>📖 Introduction / Résumé</Label>
              <Textarea value={introduction} onChange={e => { setIntroduction(e.target.value); setIntroManuallyEdited(true); }} rows={6} placeholder="Résumé ou introduction du livre audio..." />
            </div>
            <div className="space-y-2">
              <Label>📚 Contenu des Chapitres</Label>
              <Textarea value={chapterContent} onChange={e => setChapterContent(e.target.value)} rows={8} placeholder="Collez ici le texte complet de vos chapitres..." className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground">
                {chapterContent ? `${chapterContent.split(/\s+/).filter(w => w).length} mots` : 'Collez le texte intégral ou générez-le via le workflow P1-P5'}
              </p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
              <p className="font-medium">📋 Récapitulatif du Brief</p>
              <p className="text-muted-foreground mt-1">
                <strong>{bookTitle}</strong> {bookSubtitle && `— ${bookSubtitle}`} par <strong>{authorNameState}</strong> • {CATEGORIES.find(c => c.value === category)?.label}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                🎙️ Voix auto-sélectionnée : {AZURE_VOICES.find(v => v.id === selectedVoice)?.label}
              </p>
            </div>
            <Button onClick={handleValidateBrief} disabled={!bookTitle || !authorNameState} className="w-full">
              <CheckCircle2 className="h-4 w-4 mr-2" /> Valider le Brief → Passer à la Structure
            </Button>
          </div>
        );

      case 'A2':
        return (
          <div className="space-y-4">
            <div className="bg-muted/30 border rounded-lg p-4 text-sm space-y-2">
              <p className="font-medium">📕 {brief.bookTitle} — {brief.bookSubtitle}</p>
              <p className="text-muted-foreground">Par {brief.authorName} • {CATEGORIES.find(c => c.value === brief.category)?.label}</p>
            </div>
            <p className="text-muted-foreground text-sm">La structure sera optimisée pour l'écoute : chapitres courts, transitions naturelles, titres lus à voix haute.</p>
            {brief.chapterContent ? (
              <div className="border rounded-lg p-4 bg-muted/30 max-h-40 overflow-auto text-sm">
                <p className="text-muted-foreground">{brief.chapterContent.slice(0, 500)}...</p>
                <p className="text-xs mt-2">{brief.chapterContent.split(/\s+/).filter((w: string) => w).length} mots au total</p>
              </div>
            ) : chapters.length > 0 ? (
              <div className="border rounded-lg p-4 bg-muted/30 max-h-60 overflow-auto text-sm space-y-1">
                {chapters.map((ch: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge variant="outline" className="shrink-0">{i + 1}</Badge>
                    <span>{ch.title || `Chapitre ${i + 1}`}</span>
                  </div>
                ))}
              </div>
            ) : null}
            <Button onClick={() => { markStepDone('A2'); setTimeout(() => setCurrentStep(2), 400); }}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Structure validée
            </Button>
          </div>
        );

      case 'A3':
        return (
          <div className="space-y-4">
            <div className="bg-muted/30 border rounded-lg p-4 text-sm">
              <p className="font-medium">📕 {brief.bookTitle}</p>
              <p className="text-muted-foreground">Rédaction optimisée : phrases courtes, ton amical pour {CATEGORIES.find(c => c.value === brief.category)?.label}</p>
            </div>
            <p className="text-muted-foreground text-sm">💡 Utilisez le workflow P1-P5 pour générer le contenu textuel, puis revenez ici.</p>
            <Button onClick={() => { markStepDone('A3'); setTimeout(() => setCurrentStep(3), 400); }}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Rédaction prête
            </Button>
          </div>
        );

      case 'A4':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Suppression automatique des astérisques, balises Markdown, et caractères parasites du texte de <strong>{brief.bookTitle}</strong>.</p>
            <Button onClick={handleCleanText} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              🧹 Nettoyer le texte automatiquement
            </Button>
            {cleanedText && (
              <div className="space-y-2">
                <Label>📝 Texte nettoyé (éditable avant export)</Label>
                <Textarea value={cleanedText} onChange={e => setCleanedText(e.target.value)} rows={12} className="font-mono text-sm" />
                <p className="text-xs text-muted-foreground">{cleanedText.split(/\s+/).filter(w => w).length} mots • Prêt pour la synthèse vocale</p>
              </div>
            )}
          </div>
        );

      case 'A5':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Ajout de micro-pauses naturelles pour <strong>{brief.bookTitle}</strong>.</p>
            <div className="bg-muted/30 border rounded-lg p-4 text-sm space-y-2">
              <p>🔸 Virgules → pause courte (0.3s)</p>
              <p>🔸 Points → pause moyenne (0.6s)</p>
              <p>🔸 Paragraphes → pause longue (1.2s)</p>
              <p>🔸 Chapitres → silence (2s)</p>
            </div>
            <Button onClick={() => { markStepDone('A5'); setTimeout(() => setCurrentStep(5), 400); }}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Ponctuation validée
            </Button>
          </div>
        );

      case 'A6':
        return (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
              <p>🎯 Voix <strong>auto-sélectionnée</strong> selon la catégorie « {CATEGORIES.find(c => c.value === brief.category)?.label} » :</p>
              <p className="font-medium mt-1">{AZURE_VOICES.find(v => v.id === selectedVoice)?.label}</p>
              <p className="text-xs text-muted-foreground mt-1">Vous pouvez changer manuellement ci-dessous.</p>
            </div>
            <Label>🎙️ Voix Azure pour « {brief.bookTitle} »</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AZURE_VOICES.map(v => (
                <Card key={v.id} className={`cursor-pointer transition-all ${selectedVoice === v.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`} onClick={() => setSelectedVoice(v.id)}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <Mic2 className={`h-5 w-5 ${selectedVoice === v.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium text-sm">{v.label}</p>
                      <p className="text-xs text-muted-foreground">Niche : {v.niche}</p>
                    </div>
                    {selectedVoice === v.id && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={() => { markStepDone('A6', selectedVoice); setTimeout(() => setCurrentStep(6), 400); }}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Voix confirmée
            </Button>
          </div>
        );

      case 'A7':
        return (
          <div className="space-y-4">
            {(() => {
              const textToPreview = cleanedText || brief.chapterContent || chapterContent;
              const detectedChaps = textToPreview ? splitIntoChapters(textToPreview) : [];
              return (
                <>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm space-y-1">
                    <p>✅ Titre : <strong>{brief.bookTitle}</strong></p>
                    <p>✅ Auteur : <strong>{brief.authorName}</strong></p>
                    <p>✅ Voix : <strong>{CATEGORIES.find(c => c.value === brief.category)?.voiceName}</strong></p>
                    <p>✅ Texte nettoyé & ponctuation optimisée</p>
                  </div>
                  {detectedChaps.length > 0 && (
                    <div className="bg-accent/50 border border-accent rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-base">{detectedChaps.length} épisode{detectedChaps.length > 1 ? 's' : ''} détecté{detectedChaps.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="max-h-32 overflow-auto space-y-0.5 text-xs text-muted-foreground">
                        {detectedChaps.map((ch, idx) => (
                          <p key={idx}>📖 {ch.title} <span className="opacity-60">({ch.content.length} car.)</span></p>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">🎬 Ce qui sera généré :</p>
                    <p>1. 🎵 Intro Premium (jingle + présentation + teaser)</p>
                    <p>2. 📖 {detectedChaps.length} chapitre{detectedChaps.length > 1 ? 's' : ''} en MP3 séparés</p>
                    <p>3. 📦 Archive ZIP complète téléchargée automatiquement</p>
                    <p>4. 💾 Sauvegarde automatique dans Mes Livres Audio</p>
                  </div>
                </>
              );
            })()}
            {isGeneratingAudio && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm font-medium">{generationLabel}</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            )}
            {introBlob && (
              <div className="flex gap-2 items-center p-3 bg-muted/30 rounded-lg">
                <Music className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium flex-1">Intro MP3 prête</span>
                <Button size="sm" variant="outline" onClick={() => togglePlay('intro')}>
                  {playingType === 'intro' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownloadIntro}>
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            )}
            {fullBlob && (
              <div className="flex gap-2 items-center p-3 bg-muted/30 rounded-lg">
                <Headphones className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium flex-1">Livre complet MP3 prêt</span>
                <Button size="sm" variant="outline" onClick={() => togglePlay('full')}>
                  {playingType === 'full' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownloadFullExport}>
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            )}
            <Button onClick={handleGenerateAudio} disabled={isGeneratingAudio} className="w-full">
              {isGeneratingAudio ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Génération en cours...</>
              ) : (
                <><Headphones className="h-4 w-4 mr-2" /> 🎙️ Générer l'Intro + Livre Complet en MP3</>
              )}
            </Button>
          </div>
        );

      case 'A8':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Fusion de l'intro + chapitres en MP3 pour <strong>{brief.bookTitle}</strong>.</p>
            <div className="bg-muted/30 border rounded-lg p-4 text-sm">
              <p>📋 Métadonnées du fichier audio :</p>
              <p className="text-muted-foreground">Titre : {brief.bookTitle} {brief.bookSubtitle && `— ${brief.bookSubtitle}`}</p>
              <p className="text-muted-foreground">Auteur : {brief.authorName}</p>
              <p className="text-muted-foreground">Catégorie : {CATEGORIES.find(c => c.value === brief.category)?.label}</p>
            </div>
            {introBlob && (
              <div className="flex gap-2 items-center p-3 bg-muted/30 rounded-lg">
                <Music className="h-4 w-4 text-primary" />
                <span className="text-sm flex-1">Intro MP3</span>
                <Button size="sm" variant="outline" onClick={() => togglePlay('intro')}>
                  {playingType === 'intro' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownloadIntro}>
                  <Download className="h-3 w-3 mr-1" /> Intro
                </Button>
              </div>
            )}
            {fullBlob && (
              <div className="flex gap-2 items-center p-3 bg-muted/30 rounded-lg">
                <Headphones className="h-4 w-4 text-primary" />
                <span className="text-sm flex-1">Livre complet MP3</span>
                <Button size="sm" variant="outline" onClick={() => togglePlay('full')}>
                  {playingType === 'full' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownloadFullExport}>
                  <Download className="h-3 w-3 mr-1" /> Complet
                </Button>
              </div>
            )}
            {!introBlob && !fullBlob && (
              <p className="text-sm text-amber-600">⚠️ Aucun MP3 généré. Retournez à l'étape A7 pour lancer la production audio.</p>
            )}
            <Button onClick={() => markStepDone('A8')} className="w-full" disabled={!fullBlob}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Fusion terminée
            </Button>
          </div>
        );

      case 'A9':
        return (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="font-medium">🎉 Félicitations !</p>
              <p className="text-sm text-muted-foreground mt-1">
                « <strong>{brief.bookTitle}</strong> » par <strong>{brief.authorName}</strong> est prêt et sauvegardé dans la 📚 Bibliothèque.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {introBlob && (
                <Button variant="outline" onClick={handleDownloadIntro}>
                  <Download className="h-4 w-4 mr-2" /> 📥 Intro MP3
                </Button>
              )}
              {fullBlob && (
                <Button variant="outline" onClick={handleDownloadFullExport}>
                  <Download className="h-4 w-4 mr-2" /> 📥 Livre Complet MP3
                </Button>
              )}
            </div>
            <Button onClick={() => markStepDone('A9')} className="w-full">
              <Archive className="h-4 w-4 mr-2" /> Archiver et terminer
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-indigo-500/20">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">🎧 Audio Express</h2>
          <p className="text-muted-foreground text-sm mt-1">Workflow de production audio en 9 étapes</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{completedSteps}/{AUDIO_STEPS.length} étapes</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Steps navigation */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {AUDIO_STEPS.map((step, idx) => {
          const completed = isStepCompleted(idx);
          const active = idx === currentStep;
          const locked = !canGoToStep(idx);
          return (
            <Button key={step.id} variant={active ? 'default' : completed ? 'secondary' : 'outline'} size="sm"
              className={`shrink-0 ${locked ? 'opacity-50' : ''}`}
              disabled={locked}
              onClick={() => setCurrentStep(idx)}>
              {completed ? <CheckCircle2 className="h-3 w-3 mr-1" /> : locked ? <Lock className="h-3 w-3 mr-1" /> : null}
              {step.id}
            </Button>
          );
        })}
      </div>

      {/* Current step */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              {React.createElement(AUDIO_STEPS[currentStep].icon, { className: 'h-5 w-5 text-primary' })}
              {AUDIO_STEPS[currentStep].id} — {AUDIO_STEPS[currentStep].label}
            </CardTitle>
            <Badge variant="outline">~{AUDIO_STEPS[currentStep].estimatedMinutes} min</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{AUDIO_STEPS[currentStep].description}</p>
        </CardHeader>
        <CardContent>{renderStepContent(currentStep)}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
        </Button>
        <Button onClick={() => setCurrentStep(Math.min(AUDIO_STEPS.length - 1, currentStep + 1))}
          disabled={currentStep === AUDIO_STEPS.length - 1 || !canGoToStep(currentStep + 1)}>
          Suivant <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default AudioExpressWorkflow;
