import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Headphones, Download, Music, Zap, BookOpen, Play, Pause, Square,
  Loader2, FileAudio, Volume2, Mic2
} from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { supabase } from '@/integrations/supabase/client';
import { generateIntroForExport } from '@/utils/audioIntroGenerator';
import { cleanForAudio, detectAudioArtifacts } from '@/utils/textCleaner';

const VOICE_PRESETS = [
  { id: 'enfants-3-6', label: '👶 Enfants (3-6 ans)', voiceId: 'FGY2WhTYpPnrIDTdsKH5', voiceName: 'Laura' },
  { id: 'enfants-6-12', label: '🧒 Enfants (6-12 ans)', voiceId: 'XrExE9yKIg1WjnnlVkGX', voiceName: 'Matilda' },
  { id: 'thriller', label: '🔪 Thriller / Policier', voiceId: 'onwK4e9ZLuTAKqWW03F9', voiceName: 'Daniel' },
  { id: 'romance', label: '💕 Romance / Romans', voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Sarah' },
  { id: 'spiritualite', label: '🧘 Spiritualité', voiceId: 'Xb7hH8MSUJpSbSDYk0k2', voiceName: 'Alice' },
  { id: 'business', label: '💼 Marketing / Business', voiceId: 'cjVigY5qzO86Huf0OWal', voiceName: 'Eric' },
  { id: 'histoire', label: '📚 Histoire / Éducation', voiceId: 'JBFqnCBsd6RMkjVDRZzb', voiceName: 'George' },
  { id: 'saga', label: '⚔️ Saga / Fantasy', voiceId: 'N2lVS1w4EtoT3dr4eOWO', voiceName: 'Callum' },
  { id: 'default', label: '🎙️ Voix Premium (défaut)', voiceId: 'pFZP5JQG7iQjIQuC4Bku', voiceName: 'Lily' },
] as const;

const ELEVENLABS_VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Narrative douce)' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura (Chaleureuse)' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda (Entraînante)' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice (Apaisante)' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily (Polyvalente)' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Masculin profond)' },
  { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric (Dynamique)' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (Posé)' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum (Épique)' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian (Narrateur)' },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger (Classique)' },
];

const AUTO_VOICE = '__auto_voice__';

export const AudioDirectMode: React.FC = () => {
  // Form
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('default');
  const [selectedVoice, setSelectedVoice] = useState(AUTO_VOICE);
  const [bookText, setBookText] = useState('');

  // Generation state
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false);
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [introBlob, setIntroBlob] = useState<Blob | null>(null);
  const [fullBlob, setFullBlob] = useState<Blob | null>(null);

  // Preview
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingType, setPlayingType] = useState<'intro' | 'full' | null>(null);

  const wordCount = bookText.trim().split(/\s+/).filter(w => w).length;
  const estimatedMinutes = Math.ceil(wordCount / 150);
  const artifacts = detectAudioArtifacts(bookText);

  const getVoiceId = () => {
    if (selectedVoice !== AUTO_VOICE) return selectedVoice;
    return VOICE_PRESETS.find(p => p.id === category)?.voiceId || 'pFZP5JQG7iQjIQuC4Bku';
  };

  const getVoiceName = () => {
    if (selectedVoice !== AUTO_VOICE) {
      return ELEVENLABS_VOICES.find(v => v.id === selectedVoice)?.name || selectedVoice;
    }
    return VOICE_PRESETS.find(p => p.id === category)?.voiceName || 'Lily';
  };

  // Generate TTS for a text chunk
  const generateTts = async (text: string): Promise<Blob | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const cleanText = cleanForAudio(text);

    const chunks: string[] = [];
    let remaining = cleanText;
    while (remaining.length > 0) {
      chunks.push(remaining.substring(0, 5000));
      remaining = remaining.substring(5000);
    }

    const audioBlobs: Blob[] = [];

    for (const chunk of chunks) {
      let response: Response;

      if (token) {
        // ElevenLabs via authenticated edge function
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
              voiceId: getVoiceId(),
              modelId: 'eleven_multilingual_v2',
            }),
          }
        );
      } else {
        // Azure fallback
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azure-speech-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ text: chunk, niche: category }),
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

    return new Blob(audioBlobs, { type: 'audio/mpeg' });
  };

  // Generate intro only
  const handleGenerateIntro = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer un titre');
      return;
    }
    setIsGeneratingIntro(true);
    setProgress(10);
    setProgressLabel('Génération de l\'intro...');
    try {
      const introBlobs = await generateIntroForExport(
        generateTts, title, authorName, description || subtitle, category
      );
      if (introBlobs.length > 0) {
        const blob = new Blob(introBlobs, { type: 'audio/mpeg' });
        setIntroBlob(blob);
        toast.success('✅ Intro MP3 générée !');
      }
    } catch (error: any) {
      console.error('Intro generation error:', error);
      toast.error(`Erreur : ${error.message}`);
    } finally {
      setIsGeneratingIntro(false);
      setProgress(0);
      setProgressLabel('');
    }
  };

  // Generate full book MP3
  const handleGenerateFull = async () => {
    if (!bookText.trim()) {
      toast.error('Veuillez coller votre texte');
      return;
    }
    if (!title.trim()) {
      toast.error('Veuillez entrer un titre');
      return;
    }

    setIsGeneratingFull(true);
    setProgress(0);

    try {
      const zip = new JSZip();

      // Step 1: Generate intro
      setProgressLabel('🔔 Génération du jingle d\'intro...');
      setProgress(5);
      const introBlobs = await generateIntroForExport(
        generateTts, title, authorName, description || subtitle, category
      );
      if (introBlobs.length > 0) {
        const iBlob = new Blob(introBlobs, { type: 'audio/mpeg' });
        zip.file('00-Intro-Jingle.mp3', iBlob);
        setIntroBlob(iBlob);
      }

      // Step 2: Split text into chapters (by double newline or "Chapitre" markers)
      const chapters = splitIntoChapters(bookText);
      const totalChapters = chapters.length;

      for (let i = 0; i < totalChapters; i++) {
        const chapter = chapters[i];
        setProgressLabel(`${i + 1}/${totalChapters} — ${chapter.title}`);
        setProgress(Math.round(10 + ((i) / totalChapters) * 85));

        const blob = await generateTts(chapter.content);
        if (blob) {
          const filename = `${String(i + 1).padStart(2, '0')}-${chapter.title.replace(/[^a-zA-Z0-9àâéèêëïîôùûüç\s-]/gi, '').replace(/\s+/g, '-').substring(0, 60)}.mp3`;
          zip.file(filename, blob);
        }
      }

      // Step 3: Create ZIP
      setProgressLabel('📦 Création du ZIP...');
      setProgress(95);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `audiobook-${title.replace(/\s+/g, '-')}.zip`);

      // Merge all for library save + full blob preview
      const allFiles = Object.values(zip.files);
      const mp3Blobs: Blob[] = [];
      for (const file of allFiles) {
        if (!file.dir) {
          const content = await file.async('blob');
          mp3Blobs.push(content);
        }
      }
      if (mp3Blobs.length > 0) {
        const mergedBlob = new Blob(mp3Blobs, { type: 'audio/mpeg' });
        setFullBlob(mergedBlob);
        await saveToLibrary(mergedBlob, estimatedMinutes * 60);
      }

      toast.success(`🎉 Audiobook complet exporté ! ${totalChapters + 1} fichiers MP3`);
    } catch (error: any) {
      console.error('Full generation error:', error);
      toast.error(`Erreur : ${error.message}`);
    } finally {
      setIsGeneratingFull(false);
      setProgress(0);
      setProgressLabel('');
    }
  };

  // Split text into chapters
  const splitIntoChapters = (text: string): { title: string; content: string }[] => {
    // Try splitting by "Chapitre X" pattern
    const chapterRegex = /(?:^|\n)(Chapitre\s+\d+[^\n]*)/gi;
    const matches = [...text.matchAll(chapterRegex)];

    if (matches.length >= 2) {
      const chapters: { title: string; content: string }[] = [];
      for (let i = 0; i < matches.length; i++) {
        const startIdx = matches[i].index!;
        const endIdx = i + 1 < matches.length ? matches[i + 1].index! : text.length;
        const chapterText = text.substring(startIdx, endIdx).trim();
        const titleLine = matches[i][1].trim();
        chapters.push({ title: titleLine, content: chapterText });
      }
      return chapters;
    }

    // Fallback: split by double newlines into ~5000 char sections
    const sections: { title: string; content: string }[] = [];
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
    let currentContent = '';
    let sectionIndex = 1;

    for (const para of paragraphs) {
      if (currentContent.length + para.length > 5000 && currentContent.length > 500) {
        sections.push({ title: `Section ${sectionIndex}`, content: currentContent.trim() });
        currentContent = para;
        sectionIndex++;
      } else {
        currentContent += '\n\n' + para;
      }
    }
    if (currentContent.trim()) {
      sections.push({ title: `Section ${sectionIndex}`, content: currentContent.trim() });
    }

    return sections.length > 0 ? sections : [{ title: 'Livre complet', content: text }];
  };

  // Save to library
  const saveToLibrary = async (audioBlob: Blob, durationEstimate: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        toast.info('Connectez-vous pour sauvegarder dans Mes Livres Audio');
        return;
      }

      const fileName = `${userId}/${Date.now()}-${title.replace(/[^a-zA-Z0-9àâéèêëïîôùûüç\s-]/gi, '').replace(/\s+/g, '-')}.mp3`;
      const { error: uploadError } = await supabase.storage
        .from('audiobooks')
        .upload(fileName, audioBlob, { contentType: 'audio/mpeg', cacheControl: '3600' });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return;
      }

      const { data: urlData } = supabase.storage.from('audiobooks').getPublicUrl(fileName);
      const { error: dbError } = await supabase.from('audiobooks').insert({
        user_id: userId,
        title: title.trim(),
        author_name: authorName || null,
        description: description || subtitle || null,
        audio_url: urlData.publicUrl,
        voice_name: getVoiceName(),
        duration_seconds: Math.round(durationEstimate),
        status: 'published',
        is_public: false,
      });

      if (dbError) {
        console.error('DB error:', dbError);
      } else {
        toast.success('💾 Sauvegardé dans Mes Livres Audio');
      }
    } catch (e) {
      console.error('saveToLibrary error:', e);
    }
  };

  // Play/pause preview
  const togglePlay = (type: 'intro' | 'full') => {
    const blob = type === 'intro' ? introBlob : fullBlob;
    if (!blob) return;

    if (playingType === type && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingType(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => { setPlayingType(null); URL.revokeObjectURL(url); };
    audio.play();
    audioRef.current = audio;
    setPlayingType(type);
  };

  const downloadBlob = (blob: Blob, suffix: string) => {
    saveAs(blob, `${(title || 'audiobook').replace(/\s+/g, '-')}-${suffix}.mp3`);
  };

  const isGenerating = isGeneratingIntro || isGeneratingFull;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-indigo-600" />
            Audio Direct — Texte → MP3 en un clic
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Collez votre texte, renseignez les infos, et obtenez l'intro + le livre complet en MP3. Sans passer par le workflow éditorial.
          </p>
        </CardHeader>
      </Card>

      {/* Metadata Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Informations du livre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Le titre de votre livre"
              />
            </div>
            <div className="space-y-2">
              <Label>Sous-titre</Label>
              <Input
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="Sous-titre (optionnel)"
              />
            </div>
            <div className="space-y-2">
              <Label>Auteur</Label>
              <Input
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Nom de l'auteur"
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie / Niche</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_PRESETS.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description / Résumé</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brève description de votre livre (utilisée dans l'intro audio)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Voice Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mic2 className="h-4 w-4" /> Voix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Voix narrative</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AUTO_VOICE}>
                  🎯 Auto ({VOICE_PRESETS.find(p => p.id === category)?.voiceName || 'Lily'} — selon la catégorie)
                </SelectItem>
                {ELEVENLABS_VOICES.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Text Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileAudio className="h-4 w-4" /> Texte du livre
            {wordCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {wordCount.toLocaleString()} mots — ~{estimatedMinutes} min
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {artifacts.length > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
              ⚠️ {artifacts.length} artéfact(s) Markdown détecté(s). Le texte sera nettoyé automatiquement avant la génération.
            </div>
          )}
          <Textarea
            value={bookText}
            onChange={e => setBookText(e.target.value)}
            placeholder="Collez ici le texte complet de votre livre...&#10;&#10;Astuce : Si votre texte contient des marqueurs 'Chapitre 1', 'Chapitre 2', etc., le système les détectera automatiquement pour créer les fichiers MP3 séparés."
            rows={12}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>

      {/* Progress */}
      {isGenerating && (
        <Card className="border-indigo-300 dark:border-indigo-700">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              <span className="text-sm font-medium">{progressLabel}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Intro Only */}
        <Card className="border-violet-200 dark:border-violet-800">
          <CardContent className="pt-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Music className="h-4 w-4 text-violet-600" /> Intro MP3
            </h3>
            <p className="text-xs text-muted-foreground">
              Jingle + présentation du livre + teaser
            </p>
            <Button
              onClick={handleGenerateIntro}
              disabled={isGenerating || !title.trim()}
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              {isGeneratingIntro ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Génération...</>
              ) : (
                <><Music className="h-4 w-4 mr-2" /> Générer l'intro</>
              )}
            </Button>
            {introBlob && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => togglePlay('intro')} className="flex-1">
                  {playingType === 'intro' ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                  {playingType === 'intro' ? 'Pause' : 'Écouter'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => downloadBlob(introBlob, 'intro')} className="flex-1">
                  <Download className="h-3 w-3 mr-1" /> Télécharger
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Full Book */}
        <Card className="border-indigo-200 dark:border-indigo-800">
          <CardContent className="pt-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Headphones className="h-4 w-4 text-indigo-600" /> Livre Complet MP3
            </h3>
            <p className="text-xs text-muted-foreground">
              Intro + tous les chapitres en ZIP (sauvegardé automatiquement)
            </p>
            <Button
              onClick={handleGenerateFull}
              disabled={isGenerating || !bookText.trim() || !title.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isGeneratingFull ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Génération...</>
              ) : (
                <><Headphones className="h-4 w-4 mr-2" /> Générer le livre complet</>
              )}
            </Button>
            {fullBlob && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => togglePlay('full')} className="flex-1">
                  {playingType === 'full' ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                  {playingType === 'full' ? 'Pause' : 'Écouter'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => downloadBlob(fullBlob, 'complet')} className="flex-1">
                  <Download className="h-3 w-3 mr-1" /> Télécharger
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium mb-2">💡 Conseils</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• La voix s'adapte automatiquement à la catégorie choisie (ex: voix grave pour Thriller)</li>
            <li>• Pour une série, utilisez toujours la même catégorie et voix pour garder le même personnage</li>
            <li>• Les marqueurs « Chapitre 1 », « Chapitre 2 » etc. dans le texte créent des pistes MP3 séparées</li>
            <li>• Le livre est automatiquement sauvegardé dans « Mes Livres Audio » après l'export</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
