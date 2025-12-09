import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, MicOff, Play, Pause, Square, Loader2, Volume2, 
  Wand2, Copy, Check, RefreshCw, Headphones, Radio, Settings,
  Waves, Languages, Keyboard
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
  const [useRealtimeMode, setUseRealtimeMode] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('fr-FR');
  const [interimText, setInterimText] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check for Web Speech API support
  const hasSpeechRecognition = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Audio level visualization
  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setAudioLevel(Math.min(100, average * 1.5));
    
    animationRef.current = requestAnimationFrame(updateAudioLevel);
  }, []);

  // Initialize Web Speech API for real-time transcription
  const initSpeechRecognition = useCallback(() => {
    if (!hasSpeechRecognition) return null;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;
    recognition.maxAlternatives = 1;
    
    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
      
      if (final) {
        setTranscribedText(prev => prev + final);
        setInterimText('');
      } else {
        setInterimText(interim);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        toast.error(`Erreur: ${event.error}`);
      }
    };
    
    recognition.onend = () => {
      if (isRecording && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Already started
        }
      }
    };
    
    return recognition;
  }, [hasSpeechRecognition, selectedLanguage, isRecording]);

  // Start recording with real-time or batch mode
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
      
      streamRef.current = stream;
      
      // Set up audio analyzer for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // Start audio level animation
      updateAudioLevel();
      
      // Real-time mode with Web Speech API
      if (useRealtimeMode && hasSpeechRecognition) {
        recognitionRef.current = initSpeechRecognition();
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      }
      
      // Also record for Whisper backup/enhancement
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
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingDuration(0);
      setInterimText('');
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success(useRealtimeMode 
        ? 'Transcription temps réel activée - Parlez...' 
        : 'Enregistrement démarré - Parlez clairement'
      );
    } catch (error) {
      console.error('Erreur accès microphone:', error);
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    // Stop audio analysis
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Stop media recorder
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Stop stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      setAudioLevel(0);
      setInterimText('');
      
      // If not in realtime mode, transcribe with Whisper
      if (!useRealtimeMode || !transcribedText.trim()) {
        toast.info('Enregistrement terminé - Traitement en cours...');
        setTimeout(() => transcribeAudio(), 500);
      } else {
        toast.success('Transcription terminée !');
      }
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) {
      toast.error('Aucun enregistrement à transcrire');
      return;
    }

    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
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
    setInterimText('');
    toast.info('Texte effacé');
  };

  // Insert voice command shortcuts
  const insertPunctuation = (text: string) => {
    setTranscribedText(prev => prev + text);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            Dictée Vocale IA
          </CardTitle>
          <CardDescription>
            Créez vos chapitres rapidement en dictant votre texte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode et langue */}
          <div className="flex flex-wrap gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={useRealtimeMode ? "default" : "outline"}
                onClick={() => setUseRealtimeMode(true)}
                disabled={!hasSpeechRecognition || isRecording}
              >
                <Radio className="h-4 w-4 mr-1" />
                Temps réel
              </Button>
              <Button
                size="sm"
                variant={!useRealtimeMode ? "default" : "outline"}
                onClick={() => setUseRealtimeMode(false)}
                disabled={isRecording}
              >
                <Wand2 className="h-4 w-4 mr-1" />
                Whisper IA
              </Button>
            </div>
            
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage} disabled={isRecording}>
              <SelectTrigger className="w-[140px] h-9">
                <Languages className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr-FR">Français</SelectItem>
                <SelectItem value="en-US">English</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
                <SelectItem value="de-DE">Deutsch</SelectItem>
                <SelectItem value="it-IT">Italiano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contrôles d'enregistrement */}
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
            {/* Audio level indicator */}
            {isRecording && (
              <div className="w-full max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Waves className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-xs text-muted-foreground">Niveau audio</span>
                </div>
                <Progress value={audioLevel} className="h-2" />
              </div>
            )}
            
            <div className="flex items-center gap-4">
              {!isRecording ? (
                <Button
                  size="lg"
                  onClick={startRecording}
                  disabled={isProcessing}
                  className="h-20 w-20 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Mic className="h-10 w-10" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={stopRecording}
                  className="h-20 w-20 rounded-full animate-pulse shadow-lg"
                >
                  <Square className="h-8 w-8" />
                </Button>
              )}
            </div>
            
            {isRecording && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping" />
                    {useRealtimeMode ? 'Transcription en direct' : 'Enregistrement'}
                  </Badge>
                  <span className="font-mono text-lg">{formatDuration(recordingDuration)}</span>
                </div>
                
                {/* Interim text preview */}
                {interimText && (
                  <p className="text-sm text-muted-foreground italic max-w-md text-center animate-pulse">
                    {interimText}...
                  </p>
                )}
              </div>
            )}
            
            {isProcessing && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Transcription Whisper en cours...</span>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {isRecording 
                ? useRealtimeMode 
                  ? 'Le texte apparaît en temps réel. Cliquez sur stop pour terminer.'
                  : 'Parlez clairement. La transcription sera faite à la fin.'
                : 'Cliquez sur le microphone pour commencer à dicter.'
              }
            </p>
          </div>

          {/* Raccourcis ponctuation */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Label className="w-full text-center text-sm text-muted-foreground mb-1">
              <Keyboard className="h-4 w-4 inline mr-1" /> Insertion rapide :
            </Label>
            {[
              { label: '. Point', value: '. ' },
              { label: ', Virgule', value: ', ' },
              { label: '? Question', value: '? ' },
              { label: '! Exclamation', value: '! ' },
              { label: '¶ Paragraphe', value: '\n\n' },
              { label: '— Tiret', value: '— ' },
            ].map((item) => (
              <Button
                key={item.value}
                size="sm"
                variant="outline"
                onClick={() => insertPunctuation(item.value)}
                disabled={isRecording}
                className="text-xs"
              >
                {item.label}
              </Button>
            ))}
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
                      Améliorer IA
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
            <li>• <strong>Mode temps réel :</strong> Transcription instantanée via votre navigateur (gratuit)</li>
            <li>• <strong>Mode Whisper IA :</strong> Transcription plus précise à la fin de l'enregistrement</li>
            <li>• Parlez clairement et à un rythme modéré</li>
            <li>• Utilisez les boutons de ponctuation pour plus de contrôle</li>
            <li>• Le bouton "Améliorer IA" reformule le texte en style littéraire</li>
            <li>• Vous pouvez éditer manuellement avant d'appliquer au chapitre</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
