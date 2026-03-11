import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  Headphones, Music, Mic2, BookOpen, FileText, GraduationCap,
  SkipForward, SkipBack, ListOrdered, FileDown, Timer, RotateCcw,
  Bookmark, BookmarkCheck, Eye, EyeOff, ChevronDown, ChevronUp,
  Download, Repeat, Shuffle, FileAudio
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { supabase } from '@/integrations/supabase/client';
import { generateIntroJingle, generateIntroForExport } from '@/utils/audioIntroGenerator';
import { cleanForAudio, detectAudioArtifacts } from '@/utils/textCleaner';

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

// ElevenLabs Premium Voices par niche (moteur principal)
const VOICE_PRESETS = [
  { id: 'enfants-3-6', label: '👶 Enfants (3-6 ans)', voiceId: 'FGY2WhTYpPnrIDTdsKH5', voiceName: 'Laura', description: 'Douce, chaleureuse et rassurante', engine: 'elevenlabs' },
  { id: 'enfants-6-12', label: '🧒 Enfants (6-12 ans)', voiceId: 'XrExE9yKIg1WjnnlVkGX', voiceName: 'Matilda', description: 'Narrative et entraînante', engine: 'elevenlabs' },
  { id: 'thriller', label: '🔪 Thriller / Policier', voiceId: 'onwK4e9ZLuTAKqWW03F9', voiceName: 'Daniel', description: 'Voix grave, suspense intense', engine: 'elevenlabs' },
  { id: 'romance', label: '💕 Romance / Romans', voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Sarah', description: 'Sensuelle et expressive', engine: 'elevenlabs' },
  { id: 'spiritualite', label: '🧘 Spiritualité', voiceId: 'Xb7hH8MSUJpSbSDYk0k2', voiceName: 'Alice', description: 'Calme, apaisante et profonde', engine: 'elevenlabs' },
  { id: 'business', label: '💼 Marketing / Business', voiceId: 'cjVigY5qzO86Huf0OWal', voiceName: 'Eric', description: 'Dynamique et professionnel', engine: 'elevenlabs' },
  { id: 'histoire', label: '📚 Histoire / Éducation', voiceId: 'JBFqnCBsd6RMkjVDRZzb', voiceName: 'George', description: 'Claire, posée et éducative', engine: 'elevenlabs' },
  { id: 'saga', label: '⚔️ Saga / Fantasy', voiceId: 'N2lVS1w4EtoT3dr4eOWO', voiceName: 'Callum', description: 'Épique et immersive', engine: 'elevenlabs' },
  { id: 'default', label: '🎙️ Voix Premium (défaut)', voiceId: 'pFZP5JQG7iQjIQuC4Bku', voiceName: 'Lily', description: 'Polyvalente, naturelle et fluide', engine: 'elevenlabs' },
] as const;

const ELEVENLABS_VOICES_LIST = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Narrative douce)', lang: 'fr' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura (Chaleureuse)', lang: 'fr' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda (Entraînante)', lang: 'fr' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice (Apaisante)', lang: 'fr' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily (Polyvalente)', lang: 'fr' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica (Expressive)', lang: 'fr' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Masculin profond)', lang: 'fr' },
  { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric (Dynamique)', lang: 'fr' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (Posé)', lang: 'fr' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum (Épique)', lang: 'fr' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian (Narrateur)', lang: 'fr' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam (Jeune)', lang: 'fr' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie (Conversationnel)', lang: 'fr' },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger (Classique)', lang: 'fr' },
  { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River (Non-binaire)', lang: 'fr' },
];

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

  // New state for enhanced features
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [loopMode, setLoopMode] = useState(false);
  const [activeTab, setActiveTab] = useState('ebook');
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});
  const [listenedSections, setListenedSections] = useState<Set<string>>(new Set());

  // Texte libre
  const [customText, setCustomText] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [isExportingScript, setIsExportingScript] = useState(false);
  const [isGeneratingMp3, setIsGeneratingMp3] = useState(false);
  const [mp3Progress, setMp3Progress] = useState(0);
  const [mp3ProgressLabel, setMp3ProgressLabel] = useState('');
  const [isPreviewingJingle, setIsPreviewingJingle] = useState(false);
  const [isDownloadingIntro, setIsDownloadingIntro] = useState(false);
  const jingleAudioRef = useRef<HTMLAudioElement | null>(null);

  // ElevenLabs Premium voice selection
  const AUTO_VOICE = '__auto_voice__';
  const [selectedNiche, setSelectedNiche] = useState('default');
  const [selectedPremiumVoice, setSelectedPremiumVoice] = useState(AUTO_VOICE);
  const [useElevenLabsForExport, setUseElevenLabsForExport] = useState(true);
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
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;

    if (!synth) {
      setAvailableVoices([]);
      return;
    }

    const loadVoices = () => {
      const voices = synth.getVoices?.() || [];
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
    synth.onvoiceschanged = loadVoices;
    return () => {
      if (synth.onvoiceschanged === loadVoices) {
        synth.onvoiceschanged = null;
      }
    };
  }, [selectedVoice]);

  const getSafeSubChapters = useCallback((chapter: Chapter | any) => {
    const rawSubChapters = chapter?.subChapters ?? chapter?.subchapters ?? [];
    return Array.isArray(rawSubChapters) ? rawSubChapters : [];
  }, []);

  const prepareSections = useCallback((): AudioSection[] => {
    const sections: AudioSection[] = [];
    const countWords = (text: string) => text.split(/\s+/).filter(w => w).length;
    
    if (ebookTitle) {
      const content = `${ebookTitle}. Par ${authorName || "l'auteur"}.`;
      sections.push({ id: 'intro', title: 'Introduction', content, wordCount: countWords(content), estimatedMinutes: 0.5, status: 'done' });
    }
    if (preface) {
      sections.push({ id: 'preface', title: 'Préface', content: cleanForAudio(preface), wordCount: countWords(preface), estimatedMinutes: Math.ceil(countWords(preface) / 150), status: 'done' });
    }
    chapters.forEach((chapter, index) => {
      const chapterContent = chapter.content || '';
      const safeSubChapters = getSafeSubChapters(chapter);
      const subContent = safeSubChapters
        .map(sub => `${sub.title}.\n\n${sub.content || ''}`)
        .filter(c => c.trim().length > 5)
        .join('\n\n');
      const fullContent = cleanForAudio(`Chapitre ${index + 1}: ${chapter.title}.\n\n${chapterContent}\n\n${subContent}`);
      if (fullContent.trim().length > 50) {
        const wc = countWords(fullContent);
        sections.push({ id: `chapter-${chapter.id}`, title: `Chapitre ${index + 1}: ${chapter.title}`, content: fullContent, wordCount: wc, estimatedMinutes: Math.ceil(wc / 150), status: 'done' });
      }
    });
    if (conclusion) {
      sections.push({ id: 'conclusion', title: 'Conclusion', content: cleanForAudio(conclusion), wordCount: countWords(conclusion), estimatedMinutes: Math.ceil(countWords(conclusion) / 150), status: 'done' });
    }
    if (epilogue) {
      sections.push({ id: 'epilogue', title: 'Épilogue', content: cleanForAudio(epilogue), wordCount: countWords(epilogue), estimatedMinutes: Math.ceil(countWords(epilogue) / 150), status: 'done' });
    }
    return sections;
  }, [ebookTitle, authorName, preface, conclusion, epilogue, chapters, getSafeSubChapters]);

  // Auto-load sections when ebook content changes
  useEffect(() => {
    const sections = prepareSections();
    if (sections.length > 0) {
      setAudioSections(sections);
    }
  }, [prepareSections]);

  // Détection des artefacts markdown dans les sections audio
  const audioArtifacts = useMemo(() => {
    const allText = audioSections.map(s => s.content).join(' ');
    return detectAudioArtifacts(allText);
  }, [audioSections]);

  // Nettoyage forcé de toutes les sections
  const forceCleanAllSections = useCallback(() => {
    setAudioSections(prev => prev.map(section => ({
      ...section,
      content: cleanForAudio(section.content),
    })));
    toast.success('✅ Toutes les sections ont été nettoyées !');
  }, []);

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

  const playSection = async (sectionId: string) => {
    const section = audioSections.find(s => s.id === sectionId);
    if (!section) return;
    stopSpeaking();
    sequentialAbortRef.current = false;
    setCurrentPlaying(sectionId);
    setIsPlaying(true);
    setElapsedTime(0);
    try {
      await speakText(section.content, () => { 
        setCurrentPlaying(null); 
        setIsPlaying(false);
        setListenedSections(prev => new Set(prev).add(sectionId));
      });
    } catch {
      toast.error('Erreur lors de la lecture');
      setCurrentPlaying(null);
      setIsPlaying(false);
    }
  };

  // Lecture séquentielle de toutes les sections
  const playAllSequentially = async (startIndex = 0) => {
    if (audioSections.length === 0) return;
    setIsSequentialPlaying(true);
    sequentialAbortRef.current = false;
    setElapsedTime(0);

    for (let i = startIndex; i < audioSections.length; i++) {
      if (sequentialAbortRef.current) break;
      setCurrentSequentialIndex(i);
      setCurrentPlaying(audioSections[i].id);
      setIsPlaying(true);
      try {
        await speakText(audioSections[i].content);
        setListenedSections(prev => new Set(prev).add(audioSections[i].id));
      } catch { break; }
    }

    if (loopMode && !sequentialAbortRef.current) {
      setCurrentSequentialIndex(0);
      playAllSequentially(0);
      return;
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
    }
  };

  const skipToPrev = () => {
    window.speechSynthesis.cancel();
    const prevIdx = Math.max(0, currentSequentialIndex - 1);
    setCurrentSequentialIndex(prevIdx);
  };

  const totalWords = useMemo(() => 
    (preface?.split(/\s+/).length || 0) + 
    (conclusion?.split(/\s+/).length || 0) +
    (epilogue?.split(/\s+/).length || 0) +
    chapters.reduce((acc, c) => {
      const chapterWords = c.content?.split(/\s+/).length || 0;
      const safeSubChapters = getSafeSubChapters(c);
      const subWords = safeSubChapters.reduce((a, s) => a + (s.content?.split(/\s+/).length || 0), 0);
      return acc + chapterWords + subWords;
    }, 0)
  , [preface, conclusion, epilogue, chapters, getSafeSubChapters]);

  const estimatedDuration = Math.ceil(totalWords / 150);

  const listeningProgress = useMemo(() => {
    if (audioSections.length === 0) return 0;
    return Math.round((listenedSections.size / audioSections.length) * 100);
  }, [listenedSections, audioSections]);

  const toggleBookmark = (sectionId: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

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
    addText('- Marque-pages pour reprendre la lecture', 10);
    addText('- Suivi de progression d\'ecoute', 10);
    addText('- Export du script en PDF et Word', 10);
    yPos += 3;
    addText('2. Voix disponibles', 12, true);
    addText('Les voix dependent de votre navigateur et systeme. Les voix francaises sont privilegiees.', 10);
    yPos += 5;
    addText('Guide d\'utilisation', 14, true, true);
    addText('Etape 1: L\'ebook est automatiquement charge en sections', 10);
    addText('Etape 2: Choisissez une voix et ajustez vitesse/ton/volume', 10);
    addText('Etape 3: Cliquez sur une section pour la lire ou "Tout lire"', 10);
    addText('Etape 4: Utilisez les marque-pages pour retrouver vos passages', 10);
    addText('Etape 5: Exportez le script en PDF ou Word', 10);
    yPos += 5;
    addText('Version 5.0 - Mars 2026', 9);
    pdf.save('Formation_Livre_Audio.pdf');
    toast.success('Formation exportée en PDF !');
  };

  // Generate MP3 for a single section via Azure Speech (with ElevenLabs fallback)
  const generateSectionMp3 = async (text: string): Promise<Blob | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      throw new Error('Vous devez être connecté pour exporter et sauvegarder en MP3');
    }

    // Nettoyage final de sécurité avant envoi à l'API vocale
    const cleanText = cleanForAudio(text);
    
    // Split text into chunks of 5000 chars max
    const chunks: string[] = [];
    let remaining = cleanText;
    while (remaining.length > 0) {
      chunks.push(remaining.substring(0, 5000));
      remaining = remaining.substring(5000);
    }

    const audioBlobs: Blob[] = [];
    
    for (const chunk of chunks) {
      let response: Response;
      
      if (useElevenLabsForExport) {
        // Use ElevenLabs Premium TTS (primary)
        const voiceId = selectedPremiumVoice === AUTO_VOICE
          ? VOICE_PRESETS.find(p => p.id === selectedNiche)?.voiceId || 'pFZP5JQG7iQjIQuC4Bku'
          : selectedPremiumVoice;
        
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              text: chunk,
              voiceId,
              modelId: 'eleven_multilingual_v2',
            }),
          }
        );
      } else {
        // Fallback to Azure Speech
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azure-speech-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              text: chunk,
              niche: selectedNiche,
            }),
          }
        );
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        throw new Error(err.error || `Erreur ${response.status}`);
      }

      const data = await response.json();
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      const audioResponse = await fetch(audioUrl);
      audioBlobs.push(await audioResponse.blob());
    }

    // Concatenate all blobs into a single MP3 file
    return new Blob(audioBlobs, { type: 'audio/mpeg' });
  };

  // Export a single section as MP3
  const exportSectionMp3 = async (section: AudioSection) => {
    setIsGeneratingMp3(true);
    setMp3ProgressLabel(section.title);
    setMp3Progress(10);
    try {
      const blob = await generateSectionMp3(section.content);
      if (blob) {
        const filename = `${(section.title || 'section').replace(/[^a-zA-Z0-9àâéèêëïîôùûüç\s-]/gi, '').replace(/\s+/g, '-')}.mp3`;
        saveAs(blob, filename);
        toast.success(`MP3 exporté : ${section.title}`);
        // Save to library
        await saveToLibrary(blob, `${ebookTitle} - ${section.title}`, section.estimatedMinutes * 60);
      }
    } catch (error: any) {
      console.error('MP3 export error:', error);
      toast.error(`Erreur export MP3 : ${error.message}`);
    } finally {
      setIsGeneratingMp3(false);
      setMp3Progress(0);
      setMp3ProgressLabel('');
    }
  };

  // Export all sections as a ZIP of MP3 files
  const exportAllMp3 = async () => {
    const sections = prepareSections();
    if (sections.length === 0) {
      toast.error('Aucun contenu à exporter');
      return;
    }

    setIsGeneratingMp3(true);
    setMp3Progress(0);

    try {
      const zip = new JSZip();
      
      // Generate intro jingle as track 00
      setMp3ProgressLabel('🔔 Génération du jingle d\'intro...');
      setMp3Progress(2);
      const introBlobs = await generateIntroForExport(generateSectionMp3, ebookTitle, authorName, preface, selectedNiche);
      if (introBlobs.length > 0) {
        const introBlob = new Blob(introBlobs, { type: 'audio/mpeg' });
        zip.file('00-Intro-Jingle.mp3', introBlob);
      }
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        setMp3ProgressLabel(`${i + 1}/${sections.length} — ${section.title}`);
        setMp3Progress(Math.round(5 + ((i) / sections.length) * 90));
        
        const blob = await generateSectionMp3(section.content);
        if (blob) {
          const filename = `${String(i + 1).padStart(2, '0')}-${(section.title || 'section').replace(/[^a-zA-Z0-9àâéèêëïîôùûüç\s-]/gi, '').replace(/\s+/g, '-')}.mp3`;
          zip.file(filename, blob);
        }
      }

      setMp3ProgressLabel('Création du ZIP...');
      setMp3Progress(95);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipName = `audiobook-${(ebookTitle || 'ebook').replace(/\s+/g, '-')}.zip`;
      saveAs(zipBlob, zipName);
      toast.success(`Audiobook exporté avec intro ! ${sections.length + 1} fichiers MP3`);

      // Save merged audio to library
      setMp3ProgressLabel('Sauvegarde en bibliothèque...');
      const allMp3Files = Object.values(zip.files);
      const mp3Blobs: Blob[] = [];
      for (const file of allMp3Files) {
        if (!file.dir) {
          const content = await file.async('blob');
          mp3Blobs.push(content);
        }
      }
      if (mp3Blobs.length > 0) {
        const mergedBlob = new Blob(mp3Blobs, { type: 'audio/mpeg' });
        const totalMinutes = sections.reduce((sum, s) => sum + s.estimatedMinutes, 0);
        await saveToLibrary(mergedBlob, ebookTitle || 'Audiobook', totalMinutes * 60);
      }
    } catch (error: any) {
      console.error('MP3 batch export error:', error);
      toast.error(`Erreur export MP3 : ${error.message}`);
    } finally {
      setIsGeneratingMp3(false);
      setMp3Progress(0);
      setMp3ProgressLabel('');
    }
  };

  // Save audiobook to library (storage + database)
  const saveToLibrary = async (audioBlob: Blob, title: string, durationEstimate: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let userId = session?.user?.id;

      if (!userId) {
        const { data: userData } = await supabase.auth.getUser();
        userId = userData?.user?.id;
      }

      if (!userId) {
        toast.error('❌ ERREUR SESSION : Vous n\'êtes pas connecté ! Allez sur /auth pour vous connecter, puis relancez l\'export.');
        console.error('saveToLibrary: NO USER ID - session missing');
        return;
      }
      
      console.log('saveToLibrary: userId =', userId, '| title =', title, '| blob size =', audioBlob.size);

      const fileName = `${userId}/${Date.now()}-${title.replace(/[^a-zA-Z0-9àâéèêëïîôùûüç\s-]/gi, '').replace(/\s+/g, '-')}.mp3`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('audiobooks')
        .upload(fileName, audioBlob, {
          contentType: 'audio/mpeg',
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        toast.error(`Erreur upload du fichier audio: ${uploadError.message}`);
        return;
      }

      const { data: urlData } = supabase.storage.from('audiobooks').getPublicUrl(fileName);

      // Determine voice name
      const voiceName = selectedPremiumVoice === AUTO_VOICE
        ? VOICE_PRESETS.find(p => p.id === selectedNiche)?.voiceName || 'Lily (ElevenLabs)'
        : ELEVENLABS_VOICES_LIST.find(v => v.id === selectedPremiumVoice)?.name || selectedPremiumVoice;

      // Insert into audiobooks table
      const { error: dbError } = await supabase.from('audiobooks').insert({
        user_id: userId,
        title: title.trim(),
        author_name: authorName || null,
        audio_url: urlData.publicUrl,
        voice_name: voiceName,
        duration_seconds: Math.round(durationEstimate),
        status: 'published',
        is_public: false,
      });

      if (dbError) {
        console.error('DB insert error:', dbError);
        toast.error(`Erreur sauvegarde en bibliothèque: ${dbError.message}`);
        return;
      }

      toast.success('📚 Livre audio sauvegardé dans votre bibliothèque !');
    } catch (err: any) {
      console.error('Save to library error:', err);
    }
  };


  const VoiceConfig = ({ compact = false }: { compact?: boolean }) => (
    <Card className="bg-muted/30">
      <CardContent className="pt-4 space-y-4">
        {/* Azure Voice by Niche */}
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <Label className="text-sm font-semibold flex items-center gap-2 mb-2">
            <Mic2 className="h-4 w-4 text-primary" />
            🎧 Voix Premium ElevenLabs (Export MP3)
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Thématique / Niche</Label>
              <Select value={selectedNiche} onValueChange={(val) => {
                setSelectedNiche(val);
                const preset = VOICE_PRESETS.find(p => p.id === val);
                if (preset) setSelectedPremiumVoice(preset.voiceId);
              }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choisir une thématique" />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_PRESETS.map(preset => (
                    <SelectItem key={preset.id} value={preset.id}>
                      <span>{preset.label}</span>
                      <span className="text-xs text-muted-foreground ml-1">— {preset.voiceName} · {preset.description}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Voix manuelle (optionnel)</Label>
              <Select value={selectedPremiumVoice} onValueChange={setSelectedPremiumVoice}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Auto (selon niche)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AUTO_VOICE}>🎯 Auto (selon niche)</SelectItem>
                  {ELEVENLABS_VOICES_LIST.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      🎤 {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            ✨ Moteur ElevenLabs Multilingual v2 — Voix ultra-réalistes, émotions naturelles. Azure en fallback automatique.
          </p>
        </div>

        {/* Web Speech controls for preview */}
        <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-4'} gap-4`}>
          <div>
            <Label className="text-xs">Voix navigateur (aperçu)</Label>
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

  // Mini player bar (fixed when playing)
  const MiniPlayer = () => {
    if (!isSpeaking && !currentPlaying) return null;
    const currentSection = audioSections.find(s => s.id === currentPlaying);
    return (
      <div className="sticky bottom-0 z-10 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg p-3 mt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Volume2 className="h-5 w-5 text-primary animate-pulse flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{currentSection?.title || 'Lecture en cours'}</p>
              <p className="text-xs text-muted-foreground">
                {formatTime(elapsedTime)} • {currentSection?.wordCount} mots
                {isSequentialPlaying && ` • Section ${currentSequentialIndex + 1}/${audioSections.length}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isSequentialPlaying && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipToPrev}>
                <SkipBack className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={togglePauseSpeaking}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={stopSpeaking}>
              <Square className="h-4 w-4" />
            </Button>
            {isSequentialPlaying && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipToNext}>
                <SkipForward className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                Générateur de Livre Audio
                <Badge variant="secondary" className="ml-2 bg-emerald-500/20 text-emerald-700">Azure Neural</Badge>
              </CardTitle>
              <CardDescription>
                Écoutez votre ebook, exportez en MP3 Pro avec voix Azure par niche
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ebook">
                <BookOpen className="h-4 w-4 mr-2" />
                Écouter l'ebook
              </TabsTrigger>
              <TabsTrigger value="custom">
                <FileText className="h-4 w-4 mr-2" />
                Texte libre
              </TabsTrigger>
              <TabsTrigger value="export">
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
            </TabsList>

            {/* ===== EBOOK COMPLET ===== */}
            <TabsContent value="ebook" className="space-y-4 mt-4">
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-lg">
                  <BookOpen className="h-5 w-5 mx-auto mb-1 text-violet-500" />
                  <div className="text-lg font-bold">{chapters.length}</div>
                  <div className="text-xs text-muted-foreground">Chapitres</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg">
                  <Music className="h-5 w-5 mx-auto mb-1 text-cyan-500" />
                  <div className="text-lg font-bold">{totalWords.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Mots</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg">
                  <Timer className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                  <div className="text-lg font-bold">~{estimatedDuration} min</div>
                  <div className="text-xs text-muted-foreground">Durée</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg">
                  <ListOrdered className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                  <div className="text-lg font-bold">{audioSections.length}</div>
                  <div className="text-xs text-muted-foreground">Sections</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-lg">
                  <Headphones className="h-5 w-5 mx-auto mb-1 text-rose-500" />
                  <div className="text-lg font-bold">{listeningProgress}%</div>
                  <div className="text-xs text-muted-foreground">Écouté</div>
                </div>
              </div>

              {/* Listening progress */}
              {audioSections.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progression d'écoute</span>
                    <span>{listenedSections.size}/{audioSections.length} sections</span>
                  </div>
                  <Progress value={listeningProgress} className="h-2" />
                </div>
              )}

              {/* Alerte artefacts markdown */}
              {audioArtifacts.count > 0 && (
                <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <span className="text-destructive text-xl mt-0.5">⚠️</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-destructive">
                      {audioArtifacts.count} caractère{audioArtifacts.count > 1 ? 's' : ''} de formatage détecté{audioArtifacts.count > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {audioArtifacts.types.join(' · ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ces symboles peuvent provoquer des bafouillements ou pauses incohérentes lors de la synthèse vocale.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={forceCleanAllSections}
                    className="shrink-0"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Nettoyer maintenant
                  </Button>
                </div>
              )}

              {/* Voice config */}
              <VoiceConfig />

              {/* Main controls */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => isSequentialPlaying ? stopSpeaking() : playAllSequentially(0)}
                  variant={isSequentialPlaying ? "destructive" : "default"}
                  className="flex-1 h-12 text-base"
                  size="lg"
                  disabled={audioSections.length === 0}
                >
                  {isSequentialPlaying ? (
                    <><Square className="h-5 w-5 mr-2" />Arrêter</>
                  ) : (
                    <><Play className="h-5 w-5 mr-2" />Tout écouter</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12"
                  onClick={() => setLoopMode(!loopMode)}
                  title="Lecture en boucle"
                >
                  <Repeat className={`h-5 w-5 ${loopMode ? 'text-primary' : ''}`} />
                </Button>
              </div>

              {audioSections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Volume2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Aucun contenu à écouter</p>
                  <p className="text-sm mt-1">Rédigez d'abord le contenu de votre ebook (préface, chapitres, conclusion) pour pouvoir l'écouter.</p>
                </div>
              )}

              {/* Sections list */}
              {audioSections.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <ListOrdered className="h-4 w-4" />
                      Table des matières audio
                    </h3>
                    {bookmarks.size > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <BookmarkCheck className="h-3 w-3 mr-1" />
                        {bookmarks.size} marque-page{bookmarks.size > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  <div className="max-h-[500px] overflow-y-auto">
                    <div className="space-y-2 pr-2">
                      {audioSections.map((section, idx) => {
                        const isActive = currentPlaying === section.id;
                        const isBookmarked = bookmarks.has(section.id);
                        const isListened = listenedSections.has(section.id);
                        const isExpanded = expandedSection === section.id;

                        return (
                          <div key={section.id} className="space-y-0">
                            <div 
                              className={`flex items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer ${
                                isActive 
                                  ? 'bg-primary/10 border-primary shadow-sm ring-1 ring-primary/20' 
                                  : isListened
                                    ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10'
                                    : 'bg-muted/30 hover:bg-muted/50'
                              }`}
                              onClick={() => {
                                if (isActive) togglePauseSpeaking();
                                else playSection(section.id);
                              }}
                            >
                              {/* Number / status icon */}
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                isActive ? 'bg-primary text-primary-foreground' : isListened ? 'bg-emerald-500/20 text-emerald-700' : 'bg-muted'
                              }`}>
                                {isActive ? (
                                  <Volume2 className="h-4 w-4 animate-pulse" />
                                ) : isListened ? (
                                  <span>✓</span>
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>

                              {/* Title & info */}
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm truncate ${isActive ? 'font-semibold text-primary' : 'font-medium'}`}>
                                  {section.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {section.wordCount} mots • ~{section.estimatedMinutes} min
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => toggleBookmark(section.id)}
                                  title={isBookmarked ? 'Retirer le marque-page' : 'Ajouter un marque-page'}
                                >
                                  {isBookmarked ? (
                                    <BookmarkCheck className="h-3.5 w-3.5 text-amber-500" />
                                  ) : (
                                    <Bookmark className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                                  title="Aperçu du texte"
                                >
                                  {isExpanded ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                </Button>
                                <Button
                                  variant={isActive ? "secondary" : "ghost"}
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    if (isActive) togglePauseSpeaking();
                                    else playSection(section.id);
                                  }}
                                >
                                  {isActive && isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                                </Button>
                              </div>
                            </div>

                            {/* Expanded preview */}
                            {isExpanded && (
                              <div className="ml-10 p-3 bg-muted/20 border-l-2 border-primary/20 rounded-b-lg text-sm text-muted-foreground leading-relaxed max-h-[200px] overflow-y-auto">
                                {section.content.substring(0, 800)}
                                {section.content.length > 800 && <span className="text-primary">... (suite)</span>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bookmarked sections shortcut */}
                  {bookmarks.size > 0 && (
                    <Card className="bg-amber-500/5 border-amber-500/20">
                      <CardContent className="p-3">
                        <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                          <BookmarkCheck className="h-3 w-3 text-amber-500" />
                          Marque-pages
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {audioSections.filter(s => bookmarks.has(s.id)).map(section => (
                            <Button
                              key={section.id}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => playSection(section.id)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              {section.title.length > 25 ? section.title.substring(0, 25) + '...' : section.title}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Mini player */}
              <MiniPlayer />
            </TabsContent>

            {/* ===== TEXTE LIBRE ===== */}
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
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Lecture en cours...</>
                  ) : (
                    <><Play className="h-5 w-5 mr-2" />Lire le texte</>
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

            {/* ===== EXPORT ===== */}
            <TabsContent value="export" className="space-y-4 mt-4">
              <Card className="border-2 border-dashed border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileDown className="h-5 w-5 text-primary" />
                    Exporter le contenu de votre ebook
                  </CardTitle>
                  <CardDescription>
                    Téléchargez le texte complet en PDF ou Word pour relecture, impression ou partage
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
                      {isExportingScript ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
                      Exporter en PDF
                    </Button>
                    <Button
                      onClick={exportScriptDocx}
                      disabled={isExportingScript || totalWords === 0}
                      variant="outline"
                      className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                      {isExportingScript ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
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

              {/* Export MP3 — Azure Speech */}
              <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 to-teal-500/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileAudio className="h-5 w-5 text-emerald-500" />
                    Exporter en MP3 Pro (Audiobook)
                    <Badge variant="secondary" className="ml-2 bg-emerald-500/20 text-emerald-700">Azure Neural</Badge>
                  </CardTitle>
                  <CardDescription>
                    Voix neuronales premium Azure • 192kbps / 48kHz • Conforme KDP/Audible
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Niche voice selector in export context */}
                  <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Mic2 className="h-4 w-4" />
                      Voix sélectionnée : {VOICE_PRESETS.find(p => p.id === selectedNiche)?.label || 'Par défaut'}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      🎤 {VOICE_PRESETS.find(p => p.id === selectedNiche)?.voiceName || 'Lily'} (ElevenLabs Premium)
                      {' '} — Changez la voix dans le panneau de configuration ci-dessus
                    </p>
                  </div>

                  {/* Preview Jingle Button */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        // Stop if already playing
                        if (jingleAudioRef.current) {
                          jingleAudioRef.current.pause();
                          jingleAudioRef.current = null;
                          setIsPreviewingJingle(false);
                          return;
                        }
                        // Create audio element immediately for user gesture
                        const audio = new Audio();
                        audio.play().catch(() => {});
                        jingleAudioRef.current = audio;
                        setIsPreviewingJingle(true);
                        try {
                          const introBlobs = await generateIntroJingle(generateSectionMp3, ebookTitle, authorName, preface, selectedNiche);
                          if (introBlobs.length === 0) {
                            toast.error('Impossible de générer le jingle');
                            setIsPreviewingJingle(false);
                            jingleAudioRef.current = null;
                            return;
                          }
                          // Play each blob sequentially (all MP3 format)
                          const playBlobSequence = async (blobs: Blob[], index: number) => {
                            if (index >= blobs.length || !jingleAudioRef.current) {
                              setIsPreviewingJingle(false);
                              jingleAudioRef.current = null;
                              return;
                            }
                            const url = URL.createObjectURL(blobs[index]);
                            audio.src = url;
                            audio.onended = () => {
                              URL.revokeObjectURL(url);
                              playBlobSequence(blobs, index + 1);
                            };
                            audio.onerror = () => {
                              URL.revokeObjectURL(url);
                              playBlobSequence(blobs, index + 1);
                            };
                            await audio.play();
                          };
                          await playBlobSequence(introBlobs, 0);
                        } catch (error: any) {
                          toast.error(`Erreur jingle : ${error.message}`);
                          setIsPreviewingJingle(false);
                          jingleAudioRef.current = null;
                        }
                      }}
                      disabled={isGeneratingMp3}
                      className="h-10"
                    >
                      {isPreviewingJingle ? (
                        <>
                          <Square className="h-4 w-4 mr-2" />
                          Arrêter le jingle
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          🔔 Prévisualiser le jingle d'intro
                        </>
                      )}
                    </Button>
                    
                    {/* Download Intro as separate MP3 */}
                    <Button
                      variant="outline"
                      onClick={async () => {
                        setIsDownloadingIntro(true);
                        try {
                          toast.info('Génération de l\'intro en cours...');
                          // Use generateIntroJingle (with jingle + ambiance) for identical sound
                          const introBlobs = await generateIntroJingle(generateSectionMp3, ebookTitle, authorName, preface, selectedNiche);
                          if (introBlobs.length === 0) {
                            toast.error('Impossible de générer l\'intro');
                            setIsDownloadingIntro(false);
                            return;
                          }
                          const introBlob = new Blob(introBlobs, { type: 'audio/mpeg' });
                          const filename = `Intro-Premium-${ebookTitle?.replace(/[^a-zA-Z0-9]/g, '_') || 'Extrait'}.mp3`;
                          saveAs(introBlob, filename);
                          toast.success('Intro téléchargée ! 🎧');
                        } catch (error: any) {
                          toast.error(`Erreur : ${error.message}`);
                        } finally {
                          setIsDownloadingIntro(false);
                        }
                      }}
                      disabled={isGeneratingMp3 || isDownloadingIntro}
                      className="h-10"
                    >
                      {isDownloadingIntro ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          📥 Télécharger l'intro seule
                        </>
                      )}
                    </Button>
                    
                    {isPreviewingJingle && (
                      <span className="text-xs text-muted-foreground animate-pulse">🔊 Lecture en cours...</span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Export all as single concatenated MP3 */}
                    <Button
                    onClick={async () => {
                        const sections = prepareSections();
                        if (sections.length === 0) { toast.error('Aucun contenu'); return; }
                        setIsGeneratingMp3(true);
                        setMp3Progress(0);
                        try {
                          const allBlobs: Blob[] = [];
                          
                          // Generate intro jingle (bell + TTS + silence)
                          setMp3ProgressLabel('🔔 Génération du jingle d\'intro...');
                          setMp3Progress(2);
                          const introBlobs = await generateIntroForExport(generateSectionMp3, ebookTitle, authorName, preface, selectedNiche);
                          allBlobs.push(...introBlobs);
                          
                          for (let i = 0; i < sections.length; i++) {
                            setMp3ProgressLabel(`${i + 1}/${sections.length} — ${sections[i].title}`);
                            setMp3Progress(Math.round(5 + (i / sections.length) * 85));
                            const blob = await generateSectionMp3(sections[i].content);
                            if (blob) allBlobs.push(blob);
                          }
                          setMp3ProgressLabel('Fusion audio...');
                          setMp3Progress(95);
                          const finalBlob = new Blob(allBlobs, { type: 'audio/mpeg' });
                          const filename = `${(ebookTitle || 'audiobook').replace(/\s+/g, '-')}-complet.mp3`;
                          saveAs(finalBlob, filename);

                          // Persist in audiobook library for Elementor export
                          const totalMinutes = sections.reduce((sum, s) => sum + s.estimatedMinutes, 0);
                          await saveToLibrary(finalBlob, ebookTitle || 'Audiobook', totalMinutes * 60);

                          toast.success('Audiobook complet exporté avec intro jingle !');
                        } catch (error: any) {
                          toast.error(`Erreur : ${error.message}`);
                        } finally {
                          setIsGeneratingMp3(false);
                          setMp3Progress(0);
                          setMp3ProgressLabel('');
                        }
                      }}
                      disabled={isGeneratingMp3 || totalWords === 0}
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                      size="lg"
                    >
                      {isGeneratingMp3 ? (
                        <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Fusion en cours...</>
                      ) : (
                        <><FileAudio className="h-5 w-5 mr-2" />Audiobook complet (1 fichier MP3)</>
                      )}
                    </Button>

                    {/* Export all as ZIP */}
                    <Button
                      onClick={exportAllMp3}
                      disabled={isGeneratingMp3 || totalWords === 0}
                      variant="outline"
                      className="flex-1 h-12 border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10"
                      size="lg"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Chapitres séparés (ZIP)
                    </Button>
                  </div>

                  {isGeneratingMp3 && (
                    <div className="space-y-2">
                      <Progress value={mp3Progress} className="h-3" />
                      <p className="text-sm text-center text-muted-foreground">
                        {mp3ProgressLabel} — {mp3Progress}%
                      </p>
                    </div>
                  )}

                  {/* Individual section export */}
                  {audioSections.length > 0 && !isGeneratingMp3 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ou exportez section par section :</Label>
                      <div className="max-h-[300px] overflow-y-auto space-y-1">
                        {audioSections.map((section, idx) => (
                          <div key={section.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{idx + 1}. {section.title}</p>
                              <p className="text-xs text-muted-foreground">{section.wordCount} mots • ~{section.estimatedMinutes} min</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportSectionMp3(section)}
                              disabled={isGeneratingMp3}
                              className="ml-2 flex-shrink-0"
                            >
                              <Download className="h-3.5 w-3.5 mr-1" />
                              MP3
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-muted/30 border border-border rounded-lg text-sm text-muted-foreground">
                    <p className="font-medium mb-1">🎧 Export Pro Azure Speech</p>
                    <ul className="space-y-1 text-xs">
                      <li>• 🔔 Intro jingle automatique (cloche + message d'accueil)</li>
                      <li>• Voix neuronales Azure premium (7 voix par niche)</li>
                      <li>• Format MP3 192kbps / 48kHz — conforme KDP & Audible</li>
                      <li>• Fusion automatique en un seul fichier audiobook</li>
                      <li>• Export chapitres séparés en archive ZIP</li>
                      <li>• Compatible avec tous les lecteurs et plateformes</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">💡 Conseils d'export</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Le <strong>PDF</strong> est idéal pour l'impression et l'archivage</li>
                    <li>• Le <strong>Word</strong> permet de modifier le texte facilement</li>
                    <li>• Le <strong>MP3 complet</strong> crée un vrai audiobook en un fichier</li>
                    <li>• Le <strong>ZIP</strong> sépare les chapitres pour les distribuer individuellement</li>
                    <li>• Choisissez la voix par niche pour un rendu adapté à votre public</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
