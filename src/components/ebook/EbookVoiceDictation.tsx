import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, MicOff, Play, Pause, Square, Loader2, Volume2, 
  Wand2, Copy, Check, RefreshCw, Headphones
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Chapter {
  id: string;
  title: string;
  content?: string;
  subChapters: Array<{ id: string; title: string; content?: string }>;
}

interface EbookVoiceDictationProps {
  chapters: Chapter[];
  onUpdateChapterContent: (chapterId: string, content: string) => void;
  onUpdateSubChapterContent: (chapterId: string, subChapterId: string, content: string) => void;
  apiKey?: string;
}

export const EbookVoiceDictation: React.FC<EbookVoiceDictationProps> = ({
  chapters,
  onUpdateChapterContent,
  onUpdateSubChapterContent,
  apiKey
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string>('new');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingDuration(0);
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success('Enregistrement démarré - Parlez clairement');
    } catch (error) {
      console.error('Erreur accès microphone:', error);
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.info('Enregistrement terminé - Traitement en cours...');
      setTimeout(() => transcribeAudio(), 500);
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) {
      toast.error('Aucun enregistrement à transcrire');
      return;
    }

    setIsProcessing(true);

    try {
      // Convertir en base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // Utiliser l'edge function pour la transcription
        const { data, error } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio }
        });

        if (error) throw error;

        if (data?.text) {
          setTranscribedText(prev => prev ? `${prev}\n\n${data.text}` : data.text);
          toast.success('Transcription réussie !');
        } else {
          toast.error('Aucun texte détecté');
        }
        
        setIsProcessing(false);
      };
    } catch (error) {
      console.error('Erreur transcription:', error);
      toast.error('Erreur lors de la transcription');
      setIsProcessing(false);
    }
  };

  const enhanceText = async () => {
    if (!transcribedText.trim()) {
      toast.error('Aucun texte à améliorer');
      return;
    }

    setIsEnhancing(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'enhance-dictation',
          prompt: `Améliore et reformule ce texte dicté pour en faire un texte littéraire fluide et professionnel. Corrige la grammaire, la ponctuation et améliore le style. Conserve le sens original:\n\n${transcribedText}`,
          apiKey
        }
      });

      if (error) throw error;

      if (data?.content) {
        setTranscribedText(data.content);
        toast.success('Texte amélioré !');
      }
    } catch (error) {
      console.error('Erreur amélioration:', error);
      toast.error('Erreur lors de l\'amélioration');
    } finally {
      setIsEnhancing(false);
    }
  };

  const applyToChapter = () => {
    if (!transcribedText.trim()) {
      toast.error('Aucun texte à appliquer');
      return;
    }

    if (selectedTarget === 'new') {
      navigator.clipboard.writeText(transcribedText);
      toast.success('Texte copié ! Collez-le dans le chapitre souhaité');
      return;
    }

    const [type, chapterId, subChapterId] = selectedTarget.split(':');
    
    if (type === 'chapter') {
      const chapter = chapters.find(c => c.id === chapterId);
      if (chapter) {
        const newContent = chapter.content 
          ? `${chapter.content}\n\n${transcribedText}` 
          : transcribedText;
        onUpdateChapterContent(chapterId, newContent);
        toast.success(`Texte ajouté au chapitre "${chapter.title}"`);
      }
    } else if (type === 'subchapter' && subChapterId) {
      const chapter = chapters.find(c => c.id === chapterId);
      const subChapter = chapter?.subChapters.find(s => s.id === subChapterId);
      if (subChapter) {
        const newContent = subChapter.content 
          ? `${subChapter.content}\n\n${transcribedText}` 
          : transcribedText;
        onUpdateSubChapterContent(chapterId, subChapterId, newContent);
        toast.success(`Texte ajouté au sous-chapitre "${subChapter.title}"`);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const clearText = () => {
    setTranscribedText('');
    setAudioBlob(null);
    toast.info('Texte effacé');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            Dictée Vocale
          </CardTitle>
          <CardDescription>
            Créez vos chapitres rapidement en dictant votre texte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contrôles d'enregistrement */}
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
            <div className="flex items-center gap-4">
              {!isRecording ? (
                <Button
                  size="lg"
                  onClick={startRecording}
                  disabled={isProcessing}
                  className="h-16 w-16 rounded-full"
                >
                  <Mic className="h-8 w-8" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={stopRecording}
                  className="h-16 w-16 rounded-full animate-pulse"
                >
                  <Square className="h-6 w-6" />
                </Button>
              )}
            </div>
            
            {isRecording && (
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping" />
                  Enregistrement
                </Badge>
                <span className="font-mono text-lg">{formatDuration(recordingDuration)}</span>
              </div>
            )}
            
            {isProcessing && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Transcription en cours...</span>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {isRecording 
                ? 'Parlez clairement dans votre microphone. Cliquez sur le bouton pour arrêter.'
                : 'Cliquez sur le microphone pour commencer à dicter votre texte.'
              }
            </p>
          </div>

          {/* Zone de texte transcrit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Texte transcrit</Label>
              <div className="flex gap-2">
                {transcribedText && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={enhanceText}
                      disabled={isEnhancing}
                    >
                      {isEnhancing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4 mr-2" />
                      )}
                      Améliorer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearText}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Effacer
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Textarea
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              placeholder="Le texte transcrit apparaîtra ici. Vous pouvez aussi le modifier manuellement..."
              className="min-h-[200px] font-serif"
              style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
            />
            {transcribedText && (
              <p className="text-xs text-muted-foreground">
                {transcribedText.split(/\s+/).filter(w => w.length > 0).length} mots
              </p>
            )}
          </div>

          {/* Sélection du chapitre cible */}
          <div className="space-y-3">
            <Label>Ajouter le texte à</Label>
            <div className="flex gap-3">
              <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sélectionner une destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">📋 Copier dans le presse-papier</SelectItem>
                  {chapters.map((chapter, index) => (
                    <React.Fragment key={chapter.id}>
                      <SelectItem value={`chapter:${chapter.id}`}>
                        📚 {index + 1}. {chapter.title || 'Sans titre'}
                      </SelectItem>
                      {chapter.subChapters.map((sub, subIndex) => (
                        <SelectItem 
                          key={sub.id} 
                          value={`subchapter:${chapter.id}:${sub.id}`}
                        >
                          &nbsp;&nbsp;&nbsp;📄 {index + 1}.{subIndex + 1} {sub.title || 'Sans titre'}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={applyToChapter}
                disabled={!transcribedText.trim()}
              >
                <Check className="h-4 w-4 mr-2" />
                Appliquer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conseils */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">💡 Conseils pour une meilleure dictée</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Parlez clairement et à un rythme modéré</li>
            <li>• Utilisez un environnement calme pour minimiser le bruit de fond</li>
            <li>• Dictez la ponctuation : "point", "virgule", "nouveau paragraphe"</li>
            <li>• Utilisez le bouton "Améliorer" pour reformuler automatiquement le texte</li>
            <li>• Vous pouvez éditer manuellement le texte avant de l'appliquer</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
