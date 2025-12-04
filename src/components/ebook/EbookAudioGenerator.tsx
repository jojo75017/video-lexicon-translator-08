import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Volume2, Play, Pause, Square, Download, Loader2, 
  Headphones, Music, Mic2, Settings2, BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

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

const voices = [
  { id: 'alloy', name: 'Alloy', description: 'Neutre et polyvalente' },
  { id: 'echo', name: 'Echo', description: 'Masculine et profonde' },
  { id: 'fable', name: 'Fable', description: 'Narrative et expressive' },
  { id: 'onyx', name: 'Onyx', description: 'Grave et autoritaire' },
  { id: 'nova', name: 'Nova', description: 'Féminine et chaleureuse' },
  { id: 'shimmer', name: 'Shimmer', description: 'Claire et dynamique' },
];

export const EbookAudioGenerator: React.FC<EbookAudioGeneratorProps> = ({
  ebookTitle,
  authorName,
  preface,
  conclusion,
  epilogue,
  chapters,
  apiKey
}) => {
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [speed, setSpeed] = useState([1.0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioSections, setAudioSections] = useState<AudioSection[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const generateAudioForSection = async (section: AudioSection): Promise<Blob | null> => {
    if (!apiKey) {
      toast.error('Clé API OpenAI requise');
      return null;
    }

    // Limiter à 4096 caractères par requête (limite OpenAI TTS)
    let textToSpeak = section.content;
    if (textToSpeak.length > 4096) {
      textToSpeak = textToSpeak.substring(0, 4096);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1-hd',
          input: textToSpeak,
          voice: selectedVoice,
          speed: speed[0],
          response_format: 'mp3',
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur génération audio');
      }

      return await response.blob();
    } catch (error) {
      console.error('TTS error:', error);
      return null;
    }
  };

  const generateFullAudiobook = async () => {
    if (!apiKey) {
      toast.error('Veuillez entrer votre clé API OpenAI');
      return;
    }

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
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsGenerating(false);
    toast.success('Livre audio généré !');
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            Générateur de Livre Audio
          </CardTitle>
          <CardDescription>
            Convertissez votre ebook en fichiers audio MP3 avec des voix IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                Configuration audio
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
                  <Label>Vitesse de lecture: {speed[0].toFixed(1)}x</Label>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    min={0.5}
                    max={2.0}
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
            disabled={isGenerating || !apiKey || totalWords === 0}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5 mr-2" />
                Générer le Livre Audio Complet
              </>
            )}
          </Button>

          {!apiKey && (
            <p className="text-sm text-center text-amber-500">
              ⚠️ Entrez votre clé API OpenAI dans les paramètres pour utiliser cette fonction
            </p>
          )}

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(progress)}% - Génération de l'audio...
              </p>
            </div>
          )}
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
          <CardTitle className="text-base">💡 Conseils</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• La voix **Nova** est recommandée pour le français</li>
            <li>• Chaque section est limitée à ~4000 caractères (limite API)</li>
            <li>• Les fichiers MP3 sont en haute qualité (TTS-1-HD)</li>
            <li>• Téléchargez chaque chapitre séparément ou tous à la fois</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
