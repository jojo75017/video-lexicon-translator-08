import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Volume2, Play, Pause, Square, Loader2, 
  Headphones, Music, Mic2, Settings2, BookOpen, FileText, GraduationCap,
  SkipForward, SkipBack, ListOrdered, FileDown, Timer, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

interface Chapter {
  id: string;
  title: string;
  content?: string;
  subChapters: Array<{ id: string; title: string; content?: string }>;
}

interface AudioSection {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  estimatedMinutes: number;
  status: 'pending' | 'generating' | 'done' | 'error';
}

interface EbookAudioGeneratorProps {
  ebookTitle: string;
  authorName: string;
  preface: string;
  conclusion: string;
  epilogue?: string;
  chapters: Chapter[];
  apiKey?: string;
}

interface WebSpeechVoice {
  id: string;
  name: string;
  lang: string;
  description: string;
}

export const EbookAudioGenerator: React.FC<EbookAudioGeneratorProps> = ({
  ebookTitle,
  authorName,
  preface,
  conclusion,
  epilogue,
  chapters,
}) => {
  const [availableVoices, setAvailableVoices] = useState<WebSpeechVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [speed, setSpeed] = useState([1.0]);
  const [pitch, setPitch] = useState([1.0]);
  const [volume, setVolume] = useState([1.0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioSections, setAudioSections] = useState<AudioSection[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSequentialPlaying, setIsSequentialPlaying] = useState(false);
  const [currentSequentialIndex, setCurrentSequentialIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sequentialAbortRef = useRef(false);

  // Texte libre
  const [customText, setCustomText] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [isExportingScript, setIsExportingScript] = useState(false);

  // Timer
  useEffect(() => {
    if (isSpeaking && isPlaying) {
      timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isSpeaking, isPlaying]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const frenchVoices = voices
        .filter(v => v.lang.startsWith('fr'))
        .map(v => ({
          id: v.name,
          name: v.name.replace(/Microsoft|Google|Apple/gi, '').trim(),
          lang: v.lang,
          description: v.lang === 'fr-FR' ? 'Français (France)' : v.lang === 'fr-CA' ? 'Français (Canada)' : 'Français'
        }));
      const englishVoices = voices
        .filter(v => v.lang.startsWith('en') && !v.name.includes('Microsoft'))
        .slice(0, 5)
        .map(v => ({
          id: v.name,
          name: v.name.replace(/Microsoft|Google|Apple/gi, '').trim(),
          lang: v.lang,
          description: 'English'
        }));
      const allVoices = [...frenchVoices, ...englishVoices];
      if (allVoices.length > 0) {
        setAvailableVoices(allVoices);
        const defaultVoice = frenchVoices[0] || allVoices[0];
        if (defaultVoice && !selectedVoice) {
          setSelectedVoice(defaultVoice.id);
        }
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [selectedVoice]);

  const prepareSections = useCallback((): AudioSection[] => {
    const sections: AudioSection[] = [];
    const countWords = (text: string) => text.split(/\s+/).filter(w => w).length;
    
    if (ebookTitle) {
      const content = `${ebookTitle}. Par ${authorName || "l'auteur"}.`;
      sections.push({ id: 'intro', title: 'Introduction', content, wordCount: countWords(content), estimatedMinutes: 0.5, status: 'pending' });
    }
    if (preface) {
      sections.push({ id: 'preface', title: 'Préface', content: preface, wordCount: countWords(preface), estimatedMinutes: Math.ceil(countWords(preface) / 150), status: 'pending' });
    }
    chapters.forEach((chapter, index) => {
      const chapterContent = chapter.content || '';
      const subContent = chapter.subChapters.map(sub => sub.content || '').filter(c => c).join('\n\n');
      const fullContent = `Chapitre ${index + 1}: ${chapter.title}.\n\n${chapterContent}\n\n${subContent}`;
      if (fullContent.trim().length > 50) {
        const wc = countWords(fullContent);
        sections.push({ id: `chapter-${chapter.id}`, title: `Chapitre ${index + 1}: ${chapter.title}`, content: fullContent, wordCount: wc, estimatedMinutes: Math.ceil(wc / 150), status: 'pending' });
      }
    });
    if (conclusion) {
      sections.push({ id: 'conclusion', title: 'Conclusion', content: conclusion, wordCount: countWords(conclusion), estimatedMinutes: Math.ceil(countWords(conclusion) / 150), status: 'pending' });
    }
    if (epilogue) {
      sections.push({ id: 'epilogue', title: 'Épilogue', content: epilogue, wordCount: countWords(epilogue), estimatedMinutes: Math.ceil(countWords(epilogue) / 150), status: 'pending' });
    }
    return sections;
  }, [ebookTitle, authorName, preface, conclusion, epilogue, chapters]);

  const speakText = (text: string, onEnd?: () => void): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) { reject(new Error('Web Speech API non supportée')); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) { utterance.voice = voice; utterance.lang = voice.lang; } else { utterance.lang = 'fr-FR'; }
      utterance.rate = speed[0];
      utterance.pitch = pitch[0];
      utterance.volume = volume[0];
      utterance.onend = () => { setIsSpeaking(false); onEnd?.(); resolve(); };
      utterance.onerror = (event) => { setIsSpeaking(false); reject(new Error(event.error)); };
      speechSynthRef.current = utterance;
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    });
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPlaying(false);
    setCurrentPlaying(null);
    setIsSequentialPlaying(false);
    sequentialAbortRef.current = true;
    setElapsedTime(0);
  };

  const togglePauseSpeaking = () => {
    if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); setIsPlaying(true); }
    else if (window.speechSynthesis.speaking) { window.speechSynthesis.pause(); setIsPlaying(false); }
  };

  const generateFullAudiobook = async () => {
    const sections = prepareSections();
    if (sections.length === 0) { toast.error('Aucun contenu à lire'); return; }
    if (!window.speechSynthesis) { toast.error('Votre navigateur ne supporte pas la synthèse vocale'); return; }
    setIsGenerating(true);
    setProgress(0);
    setAudioSections(sections);
    const updatedSections = sections.map(s => ({ ...s, status: 'done' as const }));
    setAudioSections(updatedSections);
    setProgress(100);
    setIsGenerating(false);
    toast.success(`${sections.length} sections prêtes à être lues !`);
  };

  const playSection = async (sectionId: string) => {
    const section = audioSections.find(s => s.id === sectionId);
    if (!section) return;
    stopSpeaking();
    sequentialAbortRef.current = false;
    setCurrentPlaying(sectionId);
    setIsPlaying(true);
    setElapsedTime(0);
    try {
      await speakText(section.content, () => { setCurrentPlaying(null); setIsPlaying(false); });
    } catch {
      toast.error('Erreur lors de la lecture');
      setCurrentPlaying(null);
      setIsPlaying(false);
    }
  };

  // Lecture séquentielle de toutes les sections
  const playAllSequentially = async () => {
    if (audioSections.length === 0) return;
    setIsSequentialPlaying(true);
    sequentialAbortRef.current = false;
    setElapsedTime(0);

    for (let i = currentSequentialIndex; i < audioSections.length; i++) {
      if (sequentialAbortRef.current) break;
      setCurrentSequentialIndex(i);
      setCurrentPlaying(audioSections[i].id);
      setIsPlaying(true);
      try {
        await speakText(audioSections[i].content);
      } catch { break; }
    }
    setIsSequentialPlaying(false);
    setCurrentPlaying(null);
    setIsPlaying(false);
  };

  const skipToNext = () => {
    window.speechSynthesis.cancel();
    const nextIdx = currentSequentialIndex + 1;
    if (nextIdx < audioSections.length) {
      setCurrentSequentialIndex(nextIdx);
      // Will be picked up by sequential loop
    }
  };

  const skipToPrev = () => {
    window.speechSynthesis.cancel();
    const prevIdx = Math.max(0, currentSequentialIndex - 1);
    setCurrentSequentialIndex(prevIdx);
  };

  const totalWords = (preface?.split(/\s+/).length || 0) + 
    (conclusion?.split(/\s+/).length || 0) +
    (epilogue?.split(/\s+/).length || 0) +
    chapters.reduce((acc, c) => {
      const chapterWords = c.content?.split(/\s+/).length || 0;
      const subWords = c.subChapters.reduce((a, s) => a + (s.content?.split(/\s+/).length || 0), 0);
      return acc + chapterWords + subWords;
    }, 0);

  const estimatedDuration = Math.ceil(totalWords / 150);

  // Texte libre
  const generateCustomAudio = async () => {
    if (!customText.trim()) { toast.error('Veuillez entrer du texte à lire'); return; }
    if (!window.speechSynthesis) { toast.error('Votre navigateur ne supporte pas la synthèse vocale'); return; }
    setIsGeneratingCustom(true);
    setCurrentPlaying('custom');
    setIsPlaying(true);
    setElapsedTime(0);
    try {
      await speakText(customText, () => { setCurrentPlaying(null); setIsPlaying(false); });
      toast.success('Lecture terminée !');
    } catch { toast.error('Erreur lors de la lecture'); }
    finally { setIsGeneratingCustom(false); }
  };

  // Export script PDF
  const exportScriptPDF = () => {
    setIsExportingScript(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let y = 20;

      // Title page
      pdf.setFontSize(22);
      pdf.text(ebookTitle || 'Script Livre Audio', pageWidth / 2, 50, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text(`Par ${authorName || 'Auteur'}`, pageWidth / 2, 65, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(`Script genere le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 80, { align: 'center' });
      pdf.text(`${totalWords.toLocaleString()} mots — ~${estimatedDuration} min de lecture`, pageWidth / 2, 88, { align: 'center' });

      const sections = prepareSections();
      for (const section of sections) {
        pdf.addPage();
        y = 20;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(section.title, margin, y);
        y += 8;
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(120);
        pdf.text(`${section.wordCount} mots — ~${section.estimatedMinutes} min`, margin, y);
        pdf.setTextColor(0);
        y += 8;
        pdf.setFontSize(10);
        const lines = pdf.splitTextToSize(section.content, maxWidth);
        for (const line of lines) {
          if (y > 270) { pdf.addPage(); y = 20; }
          pdf.text(line, margin, y);
          y += 5;
        }
      }

      pdf.save(`script-audio-${(ebookTitle || 'ebook').replace(/\s+/g, '-')}.pdf`);
      toast.success('Script PDF exporté !');
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'export PDF");
    } finally {
      setIsExportingScript(false);
    }
  };

  // Export script DOCX
  const exportScriptDocx = async () => {
    setIsExportingScript(true);
    try {
      const sections = prepareSections();
      const children: any[] = [
        new Paragraph({ text: ebookTitle || 'Script Livre Audio', heading: HeadingLevel.TITLE, spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: `Par ${authorName || 'Auteur'}`, italics: true })], spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: `Script généré le ${new Date().toLocaleDateString('fr-FR')} — ${totalWords.toLocaleString()} mots — ~${estimatedDuration} min`, size: 20, color: '666666' })], spacing: { after: 600 } }),
      ];

      for (const section of sections) {
        children.push(
          new Paragraph({ text: section.title, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: `${section.wordCount} mots — ~${section.estimatedMinutes} min`, italics: true, color: '888888', size: 18 })], spacing: { after: 200 } }),
        );
        const paragraphs = section.content.split('\n').filter(l => l.trim());
        for (const para of paragraphs) {
          children.push(new Paragraph({ children: [new TextRun({ text: para })], spacing: { after: 100 } }));
        }
      }

      const doc = new Document({ sections: [{ properties: {}, children }] });
      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, `script-audio-${(ebookTitle || 'ebook').replace(/\s+/g, '-')}.docx`);
      toast.success('Script Word exporté !');
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'export Word");
    } finally {
      setIsExportingScript(false);
    }
  };

  // Formation PDF
  const exportFormationPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPos = 20;
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, isTitle: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = pdf.splitTextToSize(text, maxWidth);
      for (const line of lines) {
        if (yPos > 270) { pdf.addPage(); yPos = 20; }
        pdf.text(line, margin, yPos);
        yPos += fontSize * 0.5;
      }
      yPos += isTitle ? 8 : 4;
    };
    addText('Formation - Generateur de Livres Audio', 18, true, true);
    yPos += 5;
    addText('Vue d\'ensemble', 14, true, true);
    addText('Le generateur de livres audio utilise la technologie Web Speech API integree a votre navigateur pour lire vos textes a haute voix gratuitement.', 10);
    yPos += 5;
    addText('Fonctionnalites principales', 14, true, true);
    addText('1. Lecture gratuite et illimitee', 12, true);
    addText('- Aucune limite de texte', 10);
    addText('- 100% gratuit : Utilise l\'API native du navigateur', 10);
    addText('- Controle de la vitesse, du ton et du volume', 10);
    addText('- Lecture sequentielle de tout l\'ebook', 10);
    addText('- Export du script en PDF et Word', 10);
    yPos += 3;
    addText('2. Voix disponibles', 12, true);
    addText('Les voix dependent de votre navigateur et systeme. Les voix francaises sont privilegiees.', 10);
    yPos += 5;
    addText('Guide d\'utilisation', 14, true, true);
    addText('Etape 1: Accedez au generateur via l\'onglet "Audio"', 10);
    addText('Etape 2: Choisissez le type de contenu (Texte libre ou Ebook complet)', 10);
    addText('Etape 3: Selectionnez une voix et ajustez vitesse/ton/volume', 10);
    addText('Etape 4: Cliquez sur "Lire" ou "Lecture continue"', 10);
    addText('Etape 5: Exportez le script en PDF ou Word pour revision', 10);
    yPos += 5;
    addText('Conseils et bonnes pratiques', 14, true, true);
    addText('- Utilisez des points pour des pauses longues', 10);
    addText('- Evitez les emojis (non prononces)', 10);
    addText('- Divisez en paragraphes logiques', 10);
    addText('- Ajustez le volume pour le confort d\'ecoute', 10);
    yPos += 5;
    addText('Version 4.0 - Mars 2026', 9);
    pdf.save('Formation_Livre_Audio.pdf');
    toast.success('Formation exportée en PDF !');
  };

  // Voice config shared component
  const VoiceConfig = ({ compact = false }: { compact?: boolean }) => (
    <Card className="bg-muted/30">
      <CardContent className={compact ? "pt-4 space-y-4" : "pt-4 space-y-4"}>
        <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-4'} gap-4`}>
          <div>
            <Label>Voix</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner une voix" />
              </SelectTrigger>
              <SelectContent>
                {availableVoices.length > 0 ? (
                  availableVoices.map(voice => (
                    <SelectItem key={voice.id} value={voice.id}>
                      <span>{voice.name}</span>
                      <span className="text-xs text-muted-foreground ml-1">({voice.description})</span>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="default" disabled>Chargement des voix...</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Vitesse: {speed[0].toFixed(1)}x</Label>
            <Slider value={speed} onValueChange={setSpeed} min={0.5} max={2} step={0.1} className="mt-2" />
          </div>
          <div>
            <Label className="text-xs">Ton: {pitch[0].toFixed(1)}</Label>
            <Slider value={pitch} onValueChange={setPitch} min={0.5} max={2} step={0.1} className="mt-2" />
          </div>
          <div>
            <Label className="text-xs">Volume: {Math.round(volume[0] * 100)}%</Label>
            <Slider value={volume} onValueChange={setVolume} min={0} max={1} step={0.05} className="mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                Générateur de Livre Audio
                <Badge variant="secondary" className="ml-2 bg-emerald-500/20 text-emerald-700">Gratuit</Badge>
              </CardTitle>
              <CardDescription>
                Lecture vocale, export du script en PDF/Word, lecture séquentielle
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportFormationPDF}>
                <GraduationCap className="h-4 w-4 mr-2" />
                Formation
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="custom" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="custom">
                <FileText className="h-4 w-4 mr-2" />
                Texte libre
              </TabsTrigger>
              <TabsTrigger value="ebook">
                <BookOpen className="h-4 w-4 mr-2" />
                Ebook complet
              </TabsTrigger>
              <TabsTrigger value="export">
                <FileDown className="h-4 w-4 mr-2" />
                Export Script
              </TabsTrigger>
            </TabsList>

            {/* Texte libre */}
            <TabsContent value="custom" className="space-y-4 mt-4">
              <div className="space-y-3">
                <Label>Entrez votre texte à lire</Label>
                <Textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Collez ou tapez votre texte ici..."
                  className="min-h-[200px] font-serif"
                  style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{customText.length} caractères — {customText.split(/\s+/).filter(w => w).length} mots</span>
                  <span>~{Math.ceil(customText.split(/\s+/).filter(w => w).length / 150)} min de lecture</span>
                </div>
              </div>

              <VoiceConfig compact />

              <div className="flex gap-2">
                <Button
                  onClick={generateCustomAudio}
                  disabled={isGeneratingCustom || !customText.trim() || isSpeaking}
                  className="flex-1 h-12"
                  size="lg"
                >
                  {isGeneratingCustom || (isSpeaking && currentPlaying === 'custom') ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Lecture en cours...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Lire le texte
                    </>
                  )}
                </Button>
                
                {isSpeaking && (
                  <>
                    <Button variant="outline" size="lg" onClick={togglePauseSpeaking} className="h-12">
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button variant="destructive" size="lg" onClick={stopSpeaking} className="h-12">
                      <Square className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              {isSpeaking && currentPlaying === 'custom' && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span>Temps écoulé : {formatTime(elapsedTime)}</span>
                </div>
              )}

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-1">ℹ️ API Web Speech</p>
                <p>La synthèse vocale utilise les voix de votre navigateur. La qualité peut varier selon votre système.</p>
              </div>
            </TabsContent>

            {/* Ebook complet */}
            <TabsContent value="ebook" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-lg">
                  <BookOpen className="h-6 w-6 mx-auto mb-2 text-violet-500" />
                  <div className="text-xl font-bold">{chapters.length}</div>
                  <div className="text-xs text-muted-foreground">Chapitres</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg">
                  <Music className="h-6 w-6 mx-auto mb-2 text-cyan-500" />
                  <div className="text-xl font-bold">{totalWords.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Mots</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg">
                  <Volume2 className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                  <div className="text-xl font-bold">~{estimatedDuration} min</div>
                  <div className="text-xs text-muted-foreground">Durée estimée</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg">
                  <Mic2 className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                  <div className="text-xl font-bold">{audioSections.filter(s => s.status === 'done').length}</div>
                  <div className="text-xs text-muted-foreground">Sections prêtes</div>
                </div>
              </div>

              <VoiceConfig />

              <div className="flex gap-2">
                <Button
                  onClick={generateFullAudiobook}
                  disabled={isGenerating || totalWords === 0}
                  className="flex-1 h-12 text-lg"
                  size="lg"
                >
                  {isGenerating ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Préparation...</>
                  ) : (
                    <><ListOrdered className="h-5 w-5 mr-2" />Préparer les sections</>
                  )}
                </Button>

                {audioSections.length > 0 && (
                  <Button
                    onClick={isSequentialPlaying ? stopSpeaking : playAllSequentially}
                    variant={isSequentialPlaying ? "destructive" : "default"}
                    className="h-12"
                    size="lg"
                  >
                    {isSequentialPlaying ? (
                      <><Square className="h-5 w-5 mr-2" />Arrêter</>
                    ) : (
                      <><Play className="h-5 w-5 mr-2" />Lecture continue</>
                    )}
                  </Button>
                )}
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-center text-muted-foreground">{Math.round(progress)}% — Préparation des sections...</p>
                </div>
              )}

              {isSpeaking && (
                <div className="flex items-center justify-center gap-4 p-3 bg-primary/5 rounded-lg">
                  <Button variant="ghost" size="sm" onClick={skipToPrev}><SkipBack className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={togglePauseSpeaking}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={stopSpeaking}><Square className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={skipToNext}><SkipForward className="h-4 w-4" /></Button>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {formatTime(elapsedTime)}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Export Script */}
            <TabsContent value="export" className="space-y-4 mt-4">
              <Card className="border-2 border-dashed border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileDown className="h-5 w-5 text-primary" />
                    Exporter le script de votre ebook
                  </CardTitle>
                  <CardDescription>
                    Téléchargez le texte complet de votre ebook en PDF ou Word pour relecture, impression ou partage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">{totalWords.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Mots</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">{chapters.length}</div>
                      <div className="text-xs text-muted-foreground">Chapitres</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">~{Math.ceil(totalWords / 250)}</div>
                      <div className="text-xs text-muted-foreground">Pages estimées</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold">~{estimatedDuration} min</div>
                      <div className="text-xs text-muted-foreground">Lecture audio</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={exportScriptPDF}
                      disabled={isExportingScript || totalWords === 0}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      {isExportingScript ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileDown className="h-4 w-4 mr-2" />
                      )}
                      Exporter en PDF
                    </Button>
                    <Button
                      onClick={exportScriptDocx}
                      disabled={isExportingScript || totalWords === 0}
                      variant="outline"
                      className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                      {isExportingScript ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      Exporter en Word
                    </Button>
                  </div>

                  {totalWords === 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                      ⚠️ Aucun contenu disponible. Générez d'abord du contenu dans votre ebook.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">💡 Conseils d'export</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Le <strong>PDF</strong> est idéal pour l'impression et l'archivage</li>
                    <li>• Le <strong>Word</strong> permet de modifier le texte facilement</li>
                    <li>• Le script inclut le nombre de mots et la durée estimée par section</li>
                    <li>• Relisez le script avant de créer votre version audio finale</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Liste des sections audio */}
      {audioSections.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ListOrdered className="h-4 w-4" />
                Sections ({audioSections.length})
                {isSequentialPlaying && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Lecture continue — {currentSequentialIndex + 1}/{audioSections.length}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex gap-2">
                {!isSequentialPlaying && audioSections.length > 0 && (
                  <Button size="sm" variant="outline" onClick={() => { setCurrentSequentialIndex(0); playAllSequentially(); }}>
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Tout relire
                  </Button>
                )}
                {isSpeaking && (
                  <Button variant="destructive" size="sm" onClick={stopSpeaking}>
                    <Square className="h-4 w-4 mr-2" />Arrêter
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {audioSections.map((section, idx) => (
              <div 
                key={section.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  currentPlaying === section.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-muted">
                    {currentPlaying === section.id ? (
                      <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{section.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {section.wordCount} mots — ~{section.estimatedMinutes} min
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {section.status === 'done' && (
                    <Button
                      size="sm"
                      variant={currentPlaying === section.id ? "secondary" : "outline"}
                      onClick={() => {
                        if (currentPlaying === section.id) togglePauseSpeaking();
                        else playSection(section.id);
                      }}
                    >
                      {currentPlaying === section.id && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
