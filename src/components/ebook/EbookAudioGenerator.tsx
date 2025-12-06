import React, { useState, useRef, useEffect } from 'react';
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
  Volume2, Play, Pause, Square, Download, Loader2, 
  Headphones, Music, Mic2, Settings2, BookOpen, FileText, GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

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
  audioBlob?: Blob;
  audioUrl?: string;
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

// Web Speech API voices - will be populated dynamically
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioSections, setAudioSections] = useState<AudioSection[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Texte libre
  const [customText, setCustomText] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  // Load available voices from Web Speech API
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
      
      // Add some English voices as fallback
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
        // Select first French voice by default, or first available
        const defaultVoice = frenchVoices[0] || allVoices[0];
        if (defaultVoice && !selectedVoice) {
          setSelectedVoice(defaultVoice.id);
        }
      }
    };

    // Load voices - they might not be immediately available
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  // Préparer toutes les sections de l'ebook
  const prepareSections = (): AudioSection[] => {
    const sections: AudioSection[] = [];
    
    // Introduction
    if (ebookTitle) {
      sections.push({
        id: 'intro',
        title: 'Introduction',
        content: `${ebookTitle}. Par ${authorName || 'l\'auteur'}.`,
        status: 'pending'
      });
    }
    
    // Préface
    if (preface) {
      sections.push({
        id: 'preface',
        title: 'Préface',
        content: preface,
        status: 'pending'
      });
    }
    
    // Chapitres
    chapters.forEach((chapter, index) => {
      const chapterContent = chapter.content || '';
      const subContent = chapter.subChapters
        .map(sub => sub.content || '')
        .filter(c => c)
        .join('\n\n');
      
      const fullContent = `Chapitre ${index + 1}: ${chapter.title}.\n\n${chapterContent}\n\n${subContent}`;
      
      if (fullContent.trim().length > 50) {
        sections.push({
          id: `chapter-${chapter.id}`,
          title: `Chapitre ${index + 1}: ${chapter.title}`,
          content: fullContent,
          status: 'pending'
        });
      }
    });
    
    // Conclusion
    if (conclusion) {
      sections.push({
        id: 'conclusion',
        title: 'Conclusion',
        content: conclusion,
        status: 'pending'
      });
    }
    
    // Épilogue
    if (epilogue) {
      sections.push({
        id: 'epilogue',
        title: 'Épilogue',
        content: epilogue,
        status: 'pending'
      });
    }
    
    return sections;
  };

  // Speak text using Web Speech API
  const speakText = (text: string, onEnd?: () => void): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Web Speech API non supportée'));
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find and set the selected voice
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        // Fallback to French
        utterance.lang = 'fr-FR';
      }
      
      utterance.rate = speed[0];
      utterance.pitch = pitch[0];
      
      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
        resolve();
      };
      
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        reject(new Error(event.error));
      };

      speechSynthRef.current = utterance;
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    });
  };

  // Stop speaking
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPlaying(false);
    setCurrentPlaying(null);
  };

  // Pause/Resume speaking
  const togglePauseSpeaking = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    } else if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const generateFullAudiobook = async () => {
    const sections = prepareSections();
    if (sections.length === 0) {
      toast.error('Aucun contenu à lire');
      return;
    }

    if (!window.speechSynthesis) {
      toast.error('Votre navigateur ne supporte pas la synthèse vocale');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setAudioSections(sections);

    // Mark all as done (Web Speech doesn't generate files, it speaks directly)
    const updatedSections = sections.map(s => ({ ...s, status: 'done' as const }));
    setAudioSections(updatedSections);
    setProgress(100);

    setIsGenerating(false);
    toast.success('Sections prêtes à être lues !');
  };

  const playSection = async (sectionId: string) => {
    const section = audioSections.find(s => s.id === sectionId);
    if (!section) return;

    stopSpeaking();
    setCurrentPlaying(sectionId);
    setIsPlaying(true);

    try {
      await speakText(section.content, () => {
        setCurrentPlaying(null);
        setIsPlaying(false);
      });
    } catch (error) {
      console.error('Error speaking:', error);
      toast.error('Erreur lors de la lecture');
      setCurrentPlaying(null);
      setIsPlaying(false);
    }
  };

  const totalWords = (preface?.split(/\s+/).length || 0) + 
    (conclusion?.split(/\s+/).length || 0) +
    (epilogue?.split(/\s+/).length || 0) +
    chapters.reduce((acc, c) => {
      const chapterWords = c.content?.split(/\s+/).length || 0;
      const subWords = c.subChapters.reduce((a, s) => a + (s.content?.split(/\s+/).length || 0), 0);
      return acc + chapterWords + subWords;
    }, 0);

  const estimatedDuration = Math.ceil(totalWords / 150); // ~150 mots/minute

  // Génération audio pour texte libre
  const generateCustomAudio = async () => {
    if (!customText.trim()) {
      toast.error('Veuillez entrer du texte à lire');
      return;
    }

    if (!window.speechSynthesis) {
      toast.error('Votre navigateur ne supporte pas la synthèse vocale');
      return;
    }

    setIsGeneratingCustom(true);
    setCurrentPlaying('custom');
    setIsPlaying(true);

    try {
      await speakText(customText, () => {
        setCurrentPlaying(null);
        setIsPlaying(false);
      });
      toast.success('Lecture terminée !');
    } catch (error) {
      console.error('TTS error:', error);
      toast.error('Erreur lors de la lecture');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  // Exporter la formation livre audio en PDF
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
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += fontSize * 0.5;
      }
      yPos += isTitle ? 8 : 4;
    };

    // Titre principal
    addText('🎧 Formation - Générateur de Livres Audio', 18, true, true);
    yPos += 5;

    // Vue d'ensemble
    addText('Vue d\'ensemble', 14, true, true);
    addText('Le générateur de livres audio utilise la technologie Web Speech API intégrée à votre navigateur pour lire vos textes à haute voix gratuitement.', 10);
    yPos += 5;

    // Fonctionnalités
    addText('📋 Fonctionnalités principales', 14, true, true);
    addText('1. Lecture gratuite et illimitée', 12, true);
    addText('• Aucune limite de texte : Lisez des textes de n\'importe quelle longueur', 10);
    addText('• 100% gratuit : Utilise l\'API native du navigateur', 10);
    addText('• Contrôle de la vitesse et du ton', 10);
    yPos += 3;

    addText('2. Voix disponibles', 12, true);
    addText('Les voix dépendent de votre navigateur et système d\'exploitation. Les voix françaises sont privilégiées.', 10);
    yPos += 5;

    // Guide d'utilisation
    addText('🚀 Guide d\'utilisation', 14, true, true);
    addText('Étape 1: Accédez au générateur via l\'onglet "Audio" du planificateur', 10);
    addText('Étape 2: Choisissez le type de contenu (Texte libre ou Ebook complet)', 10);
    addText('Étape 3: Sélectionnez une voix parmi celles disponibles', 10);
    addText('Étape 4: Ajustez la vitesse et le ton selon vos préférences', 10);
    addText('Étape 5: Cliquez sur "Lire" pour démarrer la lecture', 10);
    yPos += 5;

    // Conseils
    addText('💡 Conseils et bonnes pratiques', 14, true, true);
    addText('Optimiser la qualité de lecture:', 11, true);
    addText('• Utilisez des points pour des pauses longues, virgules pour pauses courtes', 10);
    addText('• Évitez les émojis (non prononcés) et les phrases trop longues', 10);
    addText('• Divisez en paragraphes logiques', 10);
    yPos += 5;

    addText('Documentation mise à jour: Décembre 2024', 9);
    addText('Version du générateur: 3.0 avec Web Speech API', 9);

    pdf.save('Formation_Livre_Audio.pdf');
    toast.success('Formation exportée en PDF !');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                Générateur de Livre Audio
                <Badge variant="secondary" className="ml-2 bg-emerald-500/20 text-emerald-700">Gratuit</Badge>
              </CardTitle>
              <CardDescription>
                Lisez votre ebook à haute voix avec la synthèse vocale du navigateur - 100% gratuit
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportFormationPDF}>
              <GraduationCap className="h-4 w-4 mr-2" />
              Formation PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="custom" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="custom">
                <FileText className="h-4 w-4 mr-2" />
                Texte libre
              </TabsTrigger>
              <TabsTrigger value="ebook">
                <BookOpen className="h-4 w-4 mr-2" />
                Ebook complet
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
                  <span>{customText.length} caractères</span>
                  <span>~{Math.ceil(customText.split(/\s+/).filter(w => w).length / 150)} min de lecture</span>
                </div>
              </div>

              {/* Configuration voix */}
              <Card className="bg-muted/30">
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <div className="flex flex-col">
                                  <span>{voice.name}</span>
                                  <span className="text-xs text-muted-foreground">{voice.description}</span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="default" disabled>
                              Chargement des voix...
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Vitesse: {speed[0].toFixed(1)}x</Label>
                        <Slider
                          value={speed}
                          onValueChange={setSpeed}
                          min={0.5}
                          max={2}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Ton: {pitch[0].toFixed(1)}</Label>
                        <Slider
                          value={pitch}
                          onValueChange={setPitch}
                          min={0.5}
                          max={2}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={togglePauseSpeaking}
                      className="h-12"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={stopSpeaking}
                      className="h-12"
                    >
                      <Square className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              {/* Note about Web Speech */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-1">ℹ️ API Web Speech</p>
                <p>La synthèse vocale utilise les voix de votre navigateur. La qualité peut varier selon votre système. Pour télécharger en MP3, des services payants comme ElevenLabs sont nécessaires.</p>
              </div>
            </TabsContent>

            {/* Ebook complet */}
            <TabsContent value="ebook" className="space-y-4 mt-4">
              {/* Statistiques */}
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

              {/* Configuration */}
              <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Configuration audio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                <div className="flex flex-col">
                                  <span>{voice.name}</span>
                                  <span className="text-xs text-muted-foreground">{voice.description}</span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="default" disabled>
                              Chargement des voix...
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Vitesse: {speed[0].toFixed(1)}x</Label>
                      <Slider
                        value={speed}
                        onValueChange={setSpeed}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="mt-3"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Ton: {pitch[0].toFixed(1)}</Label>
                      <Slider
                        value={pitch}
                        onValueChange={setPitch}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="mt-3"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bouton de génération */}
              <Button
                onClick={generateFullAudiobook}
                disabled={isGenerating || totalWords === 0}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Préparation...
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5 mr-2" />
                    Préparer les sections
                  </>
                )}
              </Button>

              {/* Progress */}
              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-center text-muted-foreground">
                    {Math.round(progress)}% - Préparation des sections...
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Liste des sections audio */}
      {audioSections.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Sections à lire</CardTitle>
              {isSpeaking && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={stopSpeaking}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Arrêter
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {audioSections.map((section) => (
              <div 
                key={section.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  currentPlaying === section.id ? 'bg-primary/10 border-primary' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {currentPlaying === section.id ? (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                    ) : section.status === 'done' ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Volume2 className="h-4 w-4 text-emerald-500" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{section.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {section.content.length} caractères
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {section.status === 'done' && (
                    <Button
                      size="sm"
                      variant={currentPlaying === section.id ? "secondary" : "outline"}
                      onClick={() => {
                        if (currentPlaying === section.id) {
                          togglePauseSpeaking();
                        } else {
                          playSection(section.id);
                        }
                      }}
                    >
                      {currentPlaying === section.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
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
