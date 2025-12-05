import React, { useState, useRef } from 'react';
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
  Headphones, Music, Mic2, Settings2, BookOpen, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

// ElevenLabs voices avec voice IDs - 20 voix disponibles
const voices = [
  // Voix féminines
  { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', description: 'Claire et polyvalente', forKids: true },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Douce et expressive', forKids: true },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', description: '⭐ Chaleureuse - Idéale contes', forKids: true },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Élégante et sophistiquée', forKids: true },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: '⭐ Douce - Parfaite histoires enfants', forKids: true },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', description: 'Naturelle et engageante', forKids: true },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', description: 'Chaleureuse et amicale', forKids: true },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', description: 'Expressive et dynamique', forKids: true },
  { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River', description: 'Calme et apaisante', forKids: true },
  // Voix masculines
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', description: 'Narrateur professionnel', forKids: false },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Narrateur masculin profond', forKids: false },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Décontracté et naturel', forKids: true },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', description: 'Jeune et énergique', forKids: true },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Chaleureux et accessible', forKids: true },
  { id: 'bIHbv24MWmeRgasZH58o', name: 'Will', description: 'Amical et conversationnel', forKids: true },
  { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric', description: 'Clair et articulé', forKids: false },
  { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', description: 'Dynamique et engageant', forKids: false },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', description: 'Narrateur anglais classique', forKids: false },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', description: 'Voix masculine autoritaire', forKids: false },
  { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', description: 'Mature et rassurant', forKids: false },
];

export const EbookAudioGenerator: React.FC<EbookAudioGeneratorProps> = ({
  ebookTitle,
  authorName,
  preface,
  conclusion,
  epilogue,
  chapters,
}) => {
  const [selectedVoice, setSelectedVoice] = useState('FGY2WhTYpPnrIDTdsKH5'); // Laura par défaut
  const [showKidsVoices, setShowKidsVoices] = useState(false);
  const [speed, setSpeed] = useState([1.0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioSections, setAudioSections] = useState<AudioSection[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Texte libre
  const [customText, setCustomText] = useState('');
  const [customAudioBlob, setCustomAudioBlob] = useState<Blob | null>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

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

  // Découper le texte en morceaux de ~4500 caractères (marge de sécurité)
  const chunkText = (text: string, maxLength: number = 4500): string[] => {
    const chunks: string[] = [];
    let remaining = text;
    
    while (remaining.length > 0) {
      if (remaining.length <= maxLength) {
        chunks.push(remaining);
        break;
      }
      
      // Trouver un point de coupure naturel (fin de phrase)
      let cutPoint = maxLength;
      const searchArea = remaining.substring(maxLength - 500, maxLength);
      
      // Chercher la dernière fin de phrase dans la zone de recherche
      const lastPeriod = searchArea.lastIndexOf('. ');
      const lastQuestion = searchArea.lastIndexOf('? ');
      const lastExclaim = searchArea.lastIndexOf('! ');
      const lastNewline = searchArea.lastIndexOf('\n');
      
      const bestCut = Math.max(lastPeriod, lastQuestion, lastExclaim, lastNewline);
      
      if (bestCut > 0) {
        cutPoint = maxLength - 500 + bestCut + 1;
      }
      
      chunks.push(remaining.substring(0, cutPoint).trim());
      remaining = remaining.substring(cutPoint).trim();
    }
    
    return chunks;
  };

  // Générer l'audio pour un seul chunk
  const generateAudioChunk = async (text: string): Promise<Blob | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text: text,
          voiceId: selectedVoice,
          modelId: 'eleven_multilingual_v2'
        }
      });

      if (error) {
        console.error('ElevenLabs edge function error:', error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Convertir base64 en blob
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: 'audio/mpeg' });
    } catch (error) {
      console.error('TTS error:', error);
      return null;
    }
  };

  // Combiner plusieurs blobs audio en un seul
  const combineAudioBlobs = async (blobs: Blob[]): Promise<Blob> => {
    const arrayBuffers = await Promise.all(blobs.map(blob => blob.arrayBuffer()));
    const totalLength = arrayBuffers.reduce((acc, buf) => acc + buf.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    
    let offset = 0;
    for (const buffer of arrayBuffers) {
      combined.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }
    
    return new Blob([combined], { type: 'audio/mpeg' });
  };

  // Générer l'audio pour un texte long (avec découpage automatique)
  const generateAudioWithElevenLabs = async (text: string, onChunkProgress?: (current: number, total: number) => void): Promise<Blob | null> => {
    const chunks = chunkText(text);
    
    if (chunks.length === 1) {
      return generateAudioChunk(chunks[0]);
    }
    
    // Générer l'audio pour chaque chunk
    const audioBlobs: Blob[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      onChunkProgress?.(i + 1, chunks.length);
      
      const blob = await generateAudioChunk(chunks[i]);
      if (!blob) {
        console.error(`Failed to generate chunk ${i + 1}/${chunks.length}`);
        return null;
      }
      audioBlobs.push(blob);
      
      // Délai entre les chunks pour éviter le rate limiting
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    
    // Combiner tous les blobs
    return combineAudioBlobs(audioBlobs);
  };

  const generateAudioForSection = async (section: AudioSection): Promise<Blob | null> => {
    return generateAudioWithElevenLabs(section.content);
  };

  const generateFullAudiobook = async () => {
    const sections = prepareSections();
    if (sections.length === 0) {
      toast.error('Aucun contenu à convertir en audio');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setAudioSections(sections);

    const updatedSections = [...sections];
    let completed = 0;

    for (let i = 0; i < sections.length; i++) {
      updatedSections[i].status = 'generating';
      setAudioSections([...updatedSections]);

      const audioBlob = await generateAudioForSection(sections[i]);
      
      if (audioBlob) {
        updatedSections[i].audioBlob = audioBlob;
        updatedSections[i].audioUrl = URL.createObjectURL(audioBlob);
        updatedSections[i].status = 'done';
      } else {
        updatedSections[i].status = 'error';
      }

      completed++;
      setProgress((completed / sections.length) * 100);
      setAudioSections([...updatedSections]);
      
      // Petit délai pour éviter le rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsGenerating(false);
    toast.success('Livre audio généré avec ElevenLabs !');
  };

  const playSection = (sectionId: string) => {
    const section = audioSections.find(s => s.id === sectionId);
    if (!section?.audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(section.audioUrl);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentPlaying(null);
    };
    
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);
    setCurrentPlaying(sectionId);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentPlaying(null);
    }
  };

  const downloadSection = (section: AudioSection) => {
    if (!section.audioBlob) return;
    
    const url = URL.createObjectURL(section.audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ebookTitle || 'ebook'}_${section.title.replace(/[^a-z0-9]/gi, '_')}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllAudio = async () => {
    const completedSections = audioSections.filter(s => s.audioBlob);
    if (completedSections.length === 0) {
      toast.error('Aucun audio à télécharger');
      return;
    }

    // Télécharger chaque section séparément
    for (const section of completedSections) {
      downloadSection(section);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    toast.success(`${completedSections.length} fichiers MP3 téléchargés !`);
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
      toast.error('Veuillez entrer du texte à convertir');
      return;
    }

    setIsGeneratingCustom(true);

    try {
      const audioBlob = await generateAudioWithElevenLabs(customText);
      
      if (!audioBlob) {
        throw new Error('Échec de la génération');
      }

      const url = URL.createObjectURL(audioBlob);
      
      setCustomAudioBlob(audioBlob);
      setCustomAudioUrl(url);
      
      // Jouer automatiquement
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentPlaying(null);
      };
      audioRef.current = audio;
      audio.play();
      setIsPlaying(true);
      setCurrentPlaying('custom');
      
      toast.success('Audio généré avec ElevenLabs !');
    } catch (error) {
      console.error('TTS error:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  const downloadCustomAudio = () => {
    if (!customAudioBlob) return;
    
    const url = URL.createObjectURL(customAudioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audio_personnalise.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Audio téléchargé !');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            Générateur de Livre Audio
            <Badge variant="secondary" className="ml-2">ElevenLabs</Badge>
          </CardTitle>
          <CardDescription>
            Convertissez votre ebook complet en audio HD - textes longs découpés automatiquement
          </CardDescription>
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
                <Label>Entrez votre texte à convertir en audio</Label>
                <Textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Collez ou tapez votre texte ici (illimité)... Les textes longs seront automatiquement découpés et assemblés."
                  className="min-h-[200px] font-serif"
                  style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{customText.length} caractères ({Math.ceil(customText.length / 4500)} partie{Math.ceil(customText.length / 4500) > 1 ? 's' : ''})</span>
                  <span>~{Math.ceil(customText.split(/\s+/).filter(w => w).length / 150)} min d'audio</span>
                </div>
              </div>

              {/* Configuration voix */}
              <Card className="bg-muted/30">
                <CardContent className="pt-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="kidsVoices"
                      checked={showKidsVoices}
                      onChange={(e) => setShowKidsVoices(e.target.checked)}
                      className="rounded border-primary"
                    />
                    <Label htmlFor="kidsVoices" className="cursor-pointer text-sm">
                      🧒 Voix adaptées aux enfants uniquement
                    </Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Voix ElevenLabs {showKidsVoices && '(enfants)'}</Label>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {voices
                            .filter(v => !showKidsVoices || v.forKids)
                            .map(voice => (
                            <SelectItem key={voice.id} value={voice.id}>
                              <div className="flex flex-col">
                                <span>{voice.name} {voice.forKids && '🧒'}</span>
                                <span className="text-xs text-muted-foreground">{voice.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Qualité audio</Label>
                      <div className="mt-2 p-2 bg-primary/10 rounded text-sm text-center">
                        🎵 Multilingual v2 (HD)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={generateCustomAudio}
                disabled={isGeneratingCustom || !customText.trim()}
                className="w-full h-12"
                size="lg"
              >
                {isGeneratingCustom ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Génération ElevenLabs...
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5 mr-2" />
                    Convertir en Audio
                  </>
                )}
              </Button>

              {/* Lecteur audio personnalisé */}
              {customAudioUrl && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            if (audioRef.current) {
                              if (isPlaying && currentPlaying === 'custom') {
                                audioRef.current.pause();
                                setIsPlaying(false);
                              } else {
                                audioRef.current.play();
                                setIsPlaying(true);
                                setCurrentPlaying('custom');
                              }
                            }
                          }}
                        >
                          {isPlaying && currentPlaying === 'custom' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="text-sm font-medium">Audio prêt</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={downloadCustomAudio}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger MP3
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                  <div className="text-xs text-muted-foreground">Sections générées</div>
                </div>
              </div>

              {/* Configuration */}
              <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Configuration audio ElevenLabs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Voix</Label>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {voices.map(voice => (
                            <SelectItem key={voice.id} value={voice.id}>
                              <div className="flex flex-col">
                                <span>{voice.name}</span>
                                <span className="text-xs text-muted-foreground">{voice.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Modèle audio</Label>
                      <div className="mt-2 p-2 bg-primary/10 rounded text-sm text-center">
                        🎵 Multilingual v2 (29 langues)
                      </div>
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
                    Génération ElevenLabs en cours...
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5 mr-2" />
                    Générer le Livre Audio Complet
                  </>
                )}
              </Button>

              {/* Progress */}
              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-center text-muted-foreground">
                    {Math.round(progress)}% - Génération de l'audio avec ElevenLabs...
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
              <CardTitle className="text-base">Sections audio générées</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAllAudio}
                disabled={audioSections.filter(s => s.status === 'done').length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Tout télécharger
              </Button>
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
                    {section.status === 'pending' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    {section.status === 'generating' && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 text-primary animate-spin" />
                      </div>
                    )}
                    {section.status === 'done' && (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Volume2 className="h-4 w-4 text-emerald-500" />
                      </div>
                    )}
                    {section.status === 'error' && (
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Volume2 className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{section.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {section.content.split(/\s+/).length} mots
                    </p>
                  </div>
                </div>
                
                {section.status === 'done' && (
                  <div className="flex items-center gap-2">
                    {currentPlaying === section.id ? (
                      <>
                        <Button size="sm" variant="ghost" onClick={togglePlayPause}>
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={stopAudio}>
                          <Square className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => playSection(section.id)}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => downloadSection(section)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {section.status === 'generating' && (
                  <Badge variant="secondary" className="animate-pulse">
                    Génération...
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Conseils */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">💡 Conseils ElevenLabs</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Les voix **Laura** et **Lily** sont recommandées pour les contes enfants</li>
            <li>• Modèle Multilingual v2 : support de 29 langues dont le français</li>
            <li>• Qualité audio professionnelle, idéale pour les livres audio</li>
            <li>• Chaque section est limitée à ~5000 caractères</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
